import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ContratoModel } from '../../../models/contratoModel';
import { NotificationService } from '../../../../services/core/notification.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatTimepickerModule} from '@angular/material/timepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';

import { PDFDocument } from 'pdf-lib';
import { CatalogosService } from '../../../../services/catalogos.service';
import { ResultadoDto } from '../../../../DTOs/response/resultadoDto';
import { PaqueteModel } from '../../../models/paqueteModel';
import { MetodoPagoModel } from '../../../models/metodoPagoModel';
import SignaturePad from "signature_pad";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContratosService } from '../../../../services/contratos.service';

@Component({
  selector: 'app-crear-contrato',
  imports: [MatCardModule,
        CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule,
        FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatDatepickerModule, 
      MatTimepickerModule, MatSlideToggleModule, MatStepperModule,MatRadioModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss',
  providers: [provideNativeDateAdapter()]
})
export class CrearContratoComponent implements OnInit{
  contratoFormGroup!: FormGroup;

  // FormGroups para cada paso del Stepper
  stepPersonalData!: FormGroup;
  stepAddressData!: FormGroup;
  stepServiceData!: FormGroup;

  contratoModel: ContratoModel = new ContratoModel();
  tiposConexion: any[] = [];

  private pdfTemplateUrl = 'assets/contrato_dinamico_tlaxicom.pdf';
  paquetes: PaqueteModel[] = new Array<PaqueteModel>();
  metodosPago: MetodoPagoModel[] = new Array<MetodoPagoModel>();

  @ViewChild("canvas", { static: true }) canvas!: ElementRef;
  sig!: SignaturePad;
  firmaBase64: string = "";
  pdfBase64: any = null;
  public pdfUrlSegura: SafeResourceUrl | null = null;
  mostrarModalPdf: boolean = false;

  constructor(            
      private _formBuilder: FormBuilder,
      private catalogosService: CatalogosService,
      private notificationService: NotificationService,
      private sanitizer: DomSanitizer,
      private cdRef: ChangeDetectorRef,
      private contratosService: ContratosService
    ){}

  ngOnInit(): void {
    this.sig = new SignaturePad(this.canvas.nativeElement);
    this.stepPersonalData = this._formBuilder.group({
        nombre: [null, [Validators.required]], 
        apPaterno: [null, [Validators.required]], 
        apMaterno: [null, [Validators.nullValidator]], 
        tipoTelefono: ['2', [Validators.required]],
        telefono: [null, [Validators.required]], 
        rfc: [null, [Validators.nullValidator]], 
        cuentaEmail: [false, [Validators.required]], 
        email: [{ value: null, disabled: true }, [Validators.nullValidator]], 
      });
  
      this.stepAddressData = this._formBuilder.group({
        domicilio: [null, [Validators.required]], 
        numExterior: [null, [Validators.required]], 
        numInterior: [null, [Validators.nullValidator]], 
        colonia: [null, [Validators.required]], 
        cp: [null, [Validators.required]], 
        municipio: [null, [Validators.required]], 
        estado: [null, [Validators.required]], 
      });
  
      this.stepServiceData = this._formBuilder.group({
        idPaquete: [null, [Validators.required]],
        tarifa: [null, [Validators.required]],         
        marcaModem: [null, [Validators.required]], 
        modeloModem: [null, [Validators.required]], 
        noSerieModem: [null, [Validators.required]], 
        cantEquipos: [null, [Validators.required]], 
        fechaInstalacion: [null, [Validators.required]], 
        horaInstalacion: [null, [Validators.required]], 
        idMetodoPago: [null, [Validators.required]], 
        serviciosAdicionales: [false, [Validators.nullValidator]], 
      });

      // El FormGroup principal agrupa los subgrupos (los pasos del stepper)
      this.contratoFormGroup = this._formBuilder.group({
        personal: this.stepPersonalData,
        address: this.stepAddressData,
        service: this.stepServiceData
      });

      //Lógica para habilitar/deshabilitar el campo 'email' basado en el toggle
      this.stepPersonalData.get('cuentaEmail')?.valueChanges.subscribe(hasEmail => {
        const emailControl = this.stepPersonalData.get('email');
        if (hasEmail) {
          emailControl?.enable();
          emailControl?.setValidators([Validators.required, Validators.email]);
        } else {
          emailControl?.disable();
          emailControl?.clearValidators();
          emailControl?.setValue(null);
        }
        emailControl?.updateValueAndValidity();
      });

      this.obtenerPaquetes();
      this.obtenerMetodosPago();
  }

  clear() {
    console.log("limpiar firma:\n"+this.sig.toDataURL("image/png"));
    this.sig.clear();
  }

  async vistaPreviaContrato(){
    console.log("valores:\n"+JSON.stringify(this.contratoFormGroup.getRawValue()))
    const resultado = await this.generatePdf();

    if (!this.contratoFormGroup.valid) {
      this.notificationService.pushAlert('El formulario contiene campos incompletos o inválidos. La vista previa del contrato puede no reflejar todos los datos correctamente.');
    }

    if (resultado && resultado.base64) {
        this.pdfBase64 = resultado.base64;
        this.abrirVistaPrevia();
    } else {
        this.notificationService.pushAlert('No se pudo generar el contenido del PDF.');
    }
     
  }

  abrirVistaPrevia() {
    if (!this.pdfBase64) return;

    // 1. Crear la URL de datos (data URL)
    const dataUrl = `data:application/pdf;base64,${this.pdfBase64}`;

    // 2. Sanear la URL para usarla en el Iframe (Crucial por seguridad en frameworks)
    // Si NO usas un framework (solo JS vanilla), puedes omitir esta línea de sanitizer.
    this.pdfUrlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);

    // 3. Mostrar el modal
    this.mostrarModalPdf = true;
    this.cdRef.detectChanges();
  }
  cerrarVistaPrevia() {
    this.mostrarModalPdf = false;
    this.pdfBase64 = null;
    this.pdfUrlSegura = null;
  }

  async onSubmit() {
    // El formulario principal es válido si todos los subgrupos son válidos
    if (this.contratoFormGroup.valid) {
      // Aquí se pueden extraer todos los datos anidados:
      const finalData = this.contratoFormGroup.value;
      
      const resultado = await this.generatePdf()

      finalData.pdfBase64 = resultado.base64 // PDF en base64

      this.contratosService.nuevoContrato(finalData).subscribe((data: ResultadoDto) => {
          if (data.resultado === true) {   
            this.notificationService.pushSuccess("Contrato creado correctamente.");           
          } else {
            this.notificationService.pushError("Error al crear el contrato: " + data.mensaje);
          }
        })

      /*const link = document.createElement('a');
      link.href = resultado.urlBytes;
      link.download = resultado.nombre;
      link.click();        
      this.notificationService.pushSuccess('PDF generado y descargado con éxito.');*/
      
    } else {
      // Marca todos los controles de todos los pasos como 'touched' para mostrar errores
      this.contratoFormGroup.markAllAsTouched();
      this.notificationService.pushError('Por favor, completa todos los campos obligatorios.');
    }
  }

   async generatePdf(): Promise<{ nombre: string, urlBytes: string, base64: string }> {
      try {
        // --- UTILERÍAS DE MATEO ---
        // 1. Función para reemplazar null/undefined/'' con '------'
        const safeText = (value: any): string => {
          // Usamos String(value) para manejar números o booleanos
          return (value === null || value === undefined || value === '') ? '------' : String(value);
        };

        // 2. Función para formatear fecha a DD/MM/YYYY
        const formatDate = (date: string | Date | null): string => {
          if (!date) return '------';
          const d = date instanceof Date ? date : new Date(date);
          if (isNaN(d.getTime())) return '------';
          
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
          const year = d.getFullYear();
          
          return `${day}/${month}/${year}`;
        };

        // 3. Función para formatear hora a HH:mm
        const formatTime = (date: string | Date | null): string => {
          if (!date) return '------';
          const d = date instanceof Date ? date : new Date(date);
          if (isNaN(d.getTime())) return '------';
          
          // Al venir de un input type="time" o de un ISO string, usamos las horas y minutos locales
          const hours = String(d.getHours()).padStart(2, '0');
          const minutes = String(d.getMinutes()).padStart(2, '0');
          
          return `${hours}:${minutes}`;
        };
        // -------------------------

        // 1. Obtener la plantilla PDF
        const existingPdfBytes = await fetch(this.pdfTemplateUrl).then(res => res.arrayBuffer());
        
        // 2. Cargar el documento con pdf-lib
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const form = pdfDoc.getForm();

        // 3. Consolidar todos los datos del formulario anidado
        // IMPORTANTE: Los valores se obtienen con .value, lo que incluye los campos deshabilitados
        // (email) con su valor, por lo que el mapeo es más directo.
        const formData = {
          ...this.stepPersonalData.value,
          ...this.stepAddressData.value,
          ...this.stepServiceData.value,
        };
        
        // 4. Mapear y rellenar los campos (usando getTextField().setText())

        // --- DATOS PERSONALES ---
        form.getTextField('nombre').setText(safeText(formData.nombre));
        form.getTextField('apPaterno').setText(safeText(formData.apPaterno));
        form.getTextField('apMaterno').setText(safeText(formData.apMaterno));      
        const tipoTel = formData.tipoTelefono;
        
        // Desmarcar ambos campos en el PDF (limpieza inicial)
        form.getCheckBox('telefonoFijo').uncheck();
        form.getCheckBox('telefonoMovil').uncheck();

        if (tipoTel === '1') { // '1' (Teléfono fijo) -> Check 'telefonoFijo' en PDF
            form.getCheckBox('telefonoFijo').check();
        } else if (tipoTel === '2') { // '2' (Teléfono móvil) -> Check 'telefonoMovil' en PDF
            form.getCheckBox('telefonoMovil').check();
        }

        form.getTextField('telefono').setText(safeText(formData.telefono));
        form.getTextField('rfc').setText(safeText(formData.rfc)); 
        
        // --- DATOS DE DOMICILIO ---
        form.getTextField('domicilio').setText(safeText(formData.domicilio));
        form.getTextField('numExterior').setText(safeText(formData.numExterior));
        form.getTextField('numInterior').setText(safeText(formData.numInterior)); 
        form.getTextField('colonia').setText(safeText(formData.colonia));
        form.getTextField('cp').setText(safeText(formData.cp));
        form.getTextField('municipio').setText(safeText(formData.municipio));
        form.getTextField('estado').setText(safeText(formData.estado));
         
        // --- DATOS DEL SERVICIO ---
        //form.getTextField('idPaquete').setText(safeText(formData.idPaquete));
        form.getTextField('tarifa').setText(`$${safeText(formData.tarifa)}`); 
        const paquete = this.paquetes.find(p => p.idPaquete === formData.idPaquete);
        const fullDescripcion = paquete
          ? `${paquete.title} - ${paquete.speed} - ${paquete.tipo}`
          : '';
        form.getTextField('descripcionPaquete').setText(safeText(fullDescripcion)); 
        form.getTextField('folioIft').setText(safeText(paquete?.features?.folio)); 
        form.getTextField('mensualidad').setText(safeText("$"+formData.tarifa+".00 MN")); 

        form.getCheckBox('conTarifaReconexion').check();
        form.getCheckBox('sinTarifaReconexion').uncheck();
        form.getTextField('montoTarifaReconexion').setText("$150.00 MN"); 

        form.getCheckBox('plazoIndefinido').uncheck();
        form.getCheckBox('plazo12Meses').check();

        form.getTextField('marcaModem').setText(safeText(formData.marcaModem));
        form.getTextField('modeloModem').setText(safeText(formData.modeloModem));
        form.getTextField('noSerieModem').setText(safeText(formData.noSerieModem));
        form.getTextField('cantEquipos').setText(safeText(formData.cantEquipos));

        form.getCheckBox('porMesCheck').check();
        form.getCheckBox('pagoUnicoCheck').uncheck();
        
        // Instalación y Formateo de fechas   
        form.getTextField('domicilioInstalacion').setText(safeText(formData.domicilio));
        form.getTextField('fechaInstalacion').setText(formatDate(formData.fechaInstalacion));
        form.getTextField('horaInstalacion').setText(formatTime(formData.horaInstalacion));
        form.getTextField('costoInstalacion').setText('600.00 MN');

        const metodoPago = this.metodosPago.find(m => m.idMetodo === formData.idMetodoPago);
        switch (formData.idMetodoPago) {
          case 1: // Efectivo
            form.getCheckBox('mPagoEfectivoCheck').check();
            form.getTextField('infoMetodoPago').setText(safeText(metodoPago?.descripcion));
            break;
          case 2: // Tarjeta
            form.getCheckBox('mPagoTarjetaCheck').check();
            form.getTextField('infoMetodoPago').setText(safeText(metodoPago?.descripcion));
            break;
          case 3: // Transferencia
            form.getCheckBox('mPagoTransferCheck').check();
            form.getTextField('infoMetodoPago').setText(safeText(metodoPago?.descripcion));
            break;
          case 4: // Depósito 
            form.getCheckBox('mPagoDepositoCheck').check();
            form.getTextField('infoMetodoPago').setText(safeText(metodoPago?.descripcion));
            break;
          default:
            // Desmarcar todos y marcar efectivo por defecto
            form.getCheckBox('mPagoEfectivoCheck').check();
            form.getCheckBox('mPagoTarjetaCheck').uncheck();
            form.getCheckBox('mPagoTransferCheck').uncheck();
            form.getCheckBox('mPagoDepositoCheck').uncheck();
            break;
        }        
        
        form.getCheckBox('autorizoCargo').uncheck();
        form.getCheckBox('noAutorizoCargo').check();

        this.firmaBase64 = this.sig.toDataURL("image/png");
        const pngData = this.firmaBase64.replace(/^data:image\/(png|jpeg);base64,/, '');        
        const firmaBytes = new Uint8Array(
          atob(pngData).split('').map(c => c.charCodeAt(0))
        );
        const pdfImage = await pdfDoc.embedPng(firmaBytes);
        const campoFirma1 = form.getButton('firma_Cliente1');
        const campoFirma2 = form.getButton('firma_Cliente2');
        const campoFirma3 = form.getButton('firma_Cliente3');
        const campoFirma4 = form.getButton('firma_Cliente4');
        const campoFirma5 = form.getButton('firma_Cliente5');

        campoFirma1.setImage(pdfImage);
        campoFirma2.setImage(pdfImage);
        campoFirma3.setImage(pdfImage);
        campoFirma4.setImage(pdfImage);
        campoFirma5.setImage(pdfImage);
        //SERVICIOS ADICIONALES
        if(!formData.serviciosAdicionales){
          form.getTextField('servicioAdicional1').setText('--------------------');
          form.getTextField('servicioAdicional2').setText('--------------------');
          form.getTextField('costoServ1').setText('$0.00');
          form.getTextField('costoServ2').setText('$0.00');  
          form.getTextField('descripcionServ1').setText('--------------------');
          form.getTextField('descripcionServ2').setText('--------------------');          
        }
        //CONCEPTOS FACTURABLES
        form.getTextField('facturable1').setText('Cambio de domicilio');
        form.getTextField('facturable2').setText('Cambio de contraseña');
        form.getTextField('costoFacturable1').setText('$200.00');
        form.getTextField('costoFacturable2').setText('$50.00');
        form.getTextField('descripcionFacturable1').setText('CAMBIO DE DOMICILIO (NO INCLUYE MATERIAL ADICIONAL)');
        form.getTextField('descripcionFacturable2').setText('CAMBIO DE CONTRASEÑA');

        //EL SUSCRIPTOR AUTORIZA SE LE ENVIE POR CORREO ELECTRÓNICO:  
        if(formData.cuentaEmail){
          form.getCheckBox('envioFacturaSi').check();
          form.getCheckBox('cartaDerMinSi').check();
          form.getCheckBox('contratoSi').check(); 
          form.getTextField('correoElectronico').setText(safeText(formData.email));
        }else{
          form.getCheckBox('envioFacturaSi').uncheck();
          form.getCheckBox('cartaDerMinSi').uncheck();
          form.getCheckBox('contratoSi').uncheck();
          form.getTextField('correoElectronico').setText('');
        }      
        //AUTORIZACIÓN PARA USO DE INFORMACIÓN DEL SUSCRIPTOR
        form.getCheckBox('siAutUsoInfoSuscrip').uncheck();
        form.getCheckBox('noAutUsoInfoSuscrip').check();
        form.getCheckBox('siLlamadasPromo').check();
        form.getCheckBox('noLlamadasPromo').uncheck();

        //Lugar y fecha de firma del contrato
        form.getTextField('lugarFirmaContrato').setText(safeText(formData.municipio));
        const meses = [
          'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
          'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];        
        const fechaFirma = new Date(formData.fechaInstalacion);
        const mesNombre = meses[fechaFirma.getMonth()];
        form.getTextField('fcFirmaContrato_dia').setText(safeText(String(fechaFirma.getDate()).padStart(2, '0')));
        form.getTextField('fcFirmaContrato_mes').setText(safeText(mesNombre));
        form.getTextField('fcFirmaContrato_anio').setText(safeText(String(fechaFirma.getFullYear())));

        form.flatten();

        // 5. Guardar y descargar el PDF
        const pdfBytes = await pdfDoc.save();
        // 💡 CORRECCIÓN: Usamos .slice() para obtener un Uint8Array respaldado por un ArrayBuffer compatible
        const blob = new Blob([pdfBytes.slice()], { type: 'application/pdf' }); 
        
        const urlContrato = URL.createObjectURL(blob);     
        const nombreDocument = `Contrato_${formData.nombre}_${formData.apPaterno}.pdf`;
        const base64 = this.uint8ArrayToBase64(pdfBytes);
        return { nombre: nombreDocument, urlBytes:urlContrato, base64:base64 }; 

      } catch (error) {        
        console.error('Error al generar el PDF:', error);
        this.notificationService.pushError('Error al generar el PDF. Asegúrate de que la plantilla existe y los campos están definidos.');
        throw error;
      }
    }

    uint8ArrayToBase64(uint8a:Uint8Array<ArrayBufferLike>) {
      let binary = '';
      const len = uint8a.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(uint8a[i]);
      }
      // En navegadores modernos, btoa puede manejar cadenas binarias
      return btoa(binary);
    }

    obtenerPaquetes(): void {
        this.catalogosService.obtenerPaquetes().subscribe((data: ResultadoDto) => {
          if (data.resultado === true) {   
            this.paquetes = data.obj as PaqueteModel[];              
          } else {
            this.notificationService. pushError("Error al obtener los paquetes: " + data.mensaje);
          }
        })
      }  

      obtenerMetodosPago(): void {
        this.catalogosService.obtenerMetodosPago().subscribe((data: ResultadoDto) => {
          if (data.resultado === true) {   
            this.metodosPago = data.obj as MetodoPagoModel[];              
          } else {
            this.notificationService. pushError("Error al obtener los paquetes: " + data.mensaje);
          }
        })
     }  

    // Método de utilidad para simplificar la validación en la plantilla
    get personalControls() { return this.stepPersonalData.controls; }
    get addressControls() { return this.stepAddressData.controls; }
    get serviceControls() { return this.stepServiceData.controls; }
}
