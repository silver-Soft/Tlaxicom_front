import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(            
      private _formBuilder: FormBuilder,
      private catalogosService: CatalogosService,
      private notificationService: NotificationService
    ){}

  ngOnInit(): void {
    this.stepPersonalData = this._formBuilder.group({
        nombre: [null, [Validators.required]], //
        apPaterno: [null, [Validators.required]], //
        apMaterno: [null, [Validators.nullValidator]], //
        tipoTelefono: ['2', [Validators.required]],
        telefono: [null, [Validators.required]], //
        rfc: [null, [Validators.nullValidator]], // OK -->ADD
        cuentaEmail: [false, [Validators.required]], // 
        email: [{ value: null, disabled: true }, [Validators.nullValidator]], // 
      });
  
      this.stepAddressData = this._formBuilder.group({
        domicilio: [null, [Validators.required]], // OK
        numExterior: [null, [Validators.required]], // OK
        numInterior: [null, [Validators.nullValidator]], // OK
        colonia: [null, [Validators.required]], // OK
        cp: [null, [Validators.required]], // OK
        municipio: [null, [Validators.required]], // OK
        estado: [null, [Validators.required]], // OK
      });
  
      this.stepServiceData = this._formBuilder.group({
        idPaquete: [null, [Validators.required]], //
        tarifa: [null, [Validators.required]], //
        //mensualidad --> Este se debe mapear, el valor es '$'+tarifa+'M.N'
        //plazoIndefinido --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //plazo12Meses --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //conTarifaReconexion --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //sinTarifaReconexion --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //montoTarifaReconexion Este campo se captura si conTarifaReconexion esta en check, el valor es '$'+tarifa-Reconexion+'M.N'
        //descripcionPaquete: [null, [Validators.nullValidator]], //--> HIDDEN VALUE, no se mostrara en vista pero se setea en el pdf
        //folioIft: [null, [Validators.nullValidator]], //--> HIDDEN VALUE, no se mostrara en vista pero se setea en el pdf        
        marcaModem: [null, [Validators.required]], //
        modeloModem: [null, [Validators.required]], //
        noSerieModem: [null, [Validators.required]], //
        cantEquipos: [null, [Validators.required]], //
        //pagoCompraVentaEquipo --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //porMesCheck --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        //pagoUnicoCheck --> Este campo se declara en el PDF pero no es tomado en cuenta. Integrar en el futuro
        fechaInstalacion: [null, [Validators.required]], //
        //domicilioInstalacion --> Se declara en el pdf. Su valor debe ser el del campo domicilio del mat-form
        //costoInstalacion --> Se declara en el pdf. Su valor debe ser fijo en $600 --> Obtenerlo de la BD para hacerlo dinamico
        //mPagoEfectivoCheck --> Se declara en el pdf. Mostrar en TRUE por defecto
        //mPagoTarjetaCheck --> Se declara en el pdf. Mostrar en FALSE por defecto
        //mPagoTransferCheck --> Se declara en el pdf. Mostrar en TRUE por defecto
        //mPagoDepositoCheck --> Se declara en el pdf. Mostrar en FALSE por defecto
        //infoMetodoPago --> Se declara en el pdf. Mostrar la informacion del metodo seleccionado
        //autorizoCargo --> Se declara en el pdf. Mostrar en FALSE por defecto
        //noAutorizoCargo --> Se declara en el pdf. Mostrar en TRUE por defecto
        //vigenciaDeCargos --> Se declara en el PDF y el valor es opcion1-> Preguntar cual es la opcion 1, mientras se queda por defecto asi
        //banco --> Se declara en el PDF no se llena por ahora
        //numeroTarjeta --> Se declara en el PDF no se llena por ahora
        horaInstalacion: [null, [Validators.required]], // 
        idMetodoPago: [null, [Validators.required]], //
        serviciosAdicionales: [false, [Validators.nullValidator]], // 
        //firma_Cliente1 --> Se declara en el PDF, aqui se coloca la imagen de la firma
        //firma_Cliente2 --> Se declara en el PDF, aqui se coloca la imagen de la firma
        //firma_Cliente3 --> Se declara en el PDF, aqui se coloca la imagen de la firma
        //firma_Cliente4 --> Se declara en el PDF, aqui se coloca la imagen de la firma
        //firma_Cliente5 --> Se declara en el PDF, aqui se coloca la imagen de la firma
        //autUsoInfoSuscrip --> Se declara en el PDF, este va en true por defecto
        //lugarFirmaContrato --> Se declara en el PDF, su valor es igual al form-field municipio
        //fcFirmaContrato_dia --> Se declara en el PDF, su valor es el dia de fechaInstalacion
        //fcFirmaContrato_mes --> Se declara en el PDF, su valor es el mes de fechaInstalacion
        //fcFirmaContrato_anio --> Se declara en el PDF, su valor es el año de fechaInstalacion
      });

      // El FormGroup principal agrupa los subgrupos (los pasos del stepper)
      this.contratoFormGroup = this._formBuilder.group({
        personal: this.stepPersonalData,
        address: this.stepAddressData,
        service: this.stepServiceData
      });

      // 🎯 Lógica para habilitar/deshabilitar el campo 'email' basado en el toggle
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

  async onSubmit() {
    console.log(this.contratoFormGroup.valid)
    // El formulario principal es válido si todos los subgrupos son válidos
    if (this.contratoFormGroup.valid) {
      // Aquí se pueden extraer todos los datos anidados:
      const finalData = this.contratoFormGroup.value;
      console.log('Datos finales:', JSON.stringify(finalData));

      await this.generatePdf();

      this.notificationService.pushSuccess('Contrato creado exitosamente.');
    } else {
      // Marca todos los controles de todos los pasos como 'touched' para mostrar errores
      this.contratoFormGroup.markAllAsTouched();
      this.notificationService.pushError('Por favor, completa todos los campos obligatorios.');
    }
  }

   async generatePdf(): Promise<void> {
      try {
        // --- UTILERÍAS DE MATEO ---
        // 1. Función para reemplazar null/undefined/'' con 'xxxxx'
        const safeText = (value: any): string => {
          // Usamos String(value) para manejar números o booleanos
          return (value === null || value === undefined || value === '') ? 'xxxxx' : String(value);
        };

        // 2. Función para formatear fecha a DD/MM/YYYY
        const formatDate = (date: string | Date | null): string => {
          if (!date) return 'xxxxx';
          const d = date instanceof Date ? date : new Date(date);
          if (isNaN(d.getTime())) return 'xxxxx';
          
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
          const year = d.getFullYear();
          
          return `${day}/${month}/${year}`;
        };

        // 3. Función para formatear hora a HH:mm
        const formatTime = (date: string | Date | null): string => {
          if (!date) return 'xxxxx';
          const d = date instanceof Date ? date : new Date(date);
          if (isNaN(d.getTime())) return 'xxxxx';
          
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
        
        // 🛠️ CORRECCIÓN: Lógica para el Radio Group tipoTelefono
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
        
        // El campo email viene de un control deshabilitado si cuentaEmail es false.
        //form.getTextField('email').setText(safeText(formData.email)); 

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
        form.getTextField('folioIft').setText(safeText(formData.folioIft)); 
        form.getTextField('marcaModem').setText(safeText(formData.marcaModem));
        form.getTextField('modeloModem').setText(safeText(formData.modeloModem));
        form.getTextField('noSerieModem').setText(safeText(formData.noSerieModem));
        form.getTextField('cantEquipos').setText(safeText(formData.cantEquipos));
        
        // Formateo de fechas
        form.getTextField('fechaInstalacion').setText(formatDate(formData.fechaInstalacion));
        form.getTextField('horaInstalacion').setText(formatTime(formData.horaInstalacion));

        //form.getTextField('idMetodoPago').setText(safeText(formData.idMetodoPago));
        
        // Nota: Asumimos que 'serviciosAdicionales' es un campo de texto en el PDF
        const serviciosAdicionalesText = formData.serviciosAdicionales ? 'Sí' : 'No';
        //form.getTextField('serviciosAdicionales').setText(serviciosAdicionalesText);


        form.flatten();

        // 5. Guardar y descargar el PDF
        const pdfBytes = await pdfDoc.save();
        // 💡 CORRECCIÓN: Usamos .slice() para obtener un Uint8Array respaldado por un ArrayBuffer compatible
        const blob = new Blob([pdfBytes.slice()], { type: 'application/pdf' }); 
        
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `Contrato_${formData.nombre}_${formData.apPaterno}.pdf`;
        link.click();
        
        this.notificationService.pushSuccess('PDF generado y descargado con éxito.');

      } catch (error) {
        console.error('Error al generar el PDF:', error);
        this.notificationService.pushError('Error al generar el PDF. Asegúrate de que la plantilla existe y los campos están definidos.');
      }
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
