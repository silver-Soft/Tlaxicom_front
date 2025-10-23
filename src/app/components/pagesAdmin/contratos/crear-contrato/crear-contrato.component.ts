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

@Component({
  selector: 'app-crear-contrato',
  imports: [MatCardModule,
        CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule,
        FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatDatepickerModule, 
      MatTimepickerModule, MatSlideToggleModule, MatStepperModule],
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

  constructor(            
      private _formBuilder: FormBuilder,
      //private catalogosService: CatalogosService,
      private notificationService: NotificationService
    ){}

  ngOnInit(): void {
    this.stepPersonalData = this._formBuilder.group({
        nombre: [null, [Validators.required]],
        apPaterno: [null, [Validators.required]],
        apMaterno: [null, [Validators.nullValidator]],
        telefono: [null, [Validators.required]],
        cuentaEmail: [false, [Validators.required]], // Inicializado en false para el toggle
        email: [{ value: null, disabled: true }, [Validators.nullValidator]], // Deshabilitado inicialmente
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
        serviciosAdicionales: [false, [Validators.nullValidator]], // Inicializado en false para el toggle
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
  }

    onSubmit(){
      console.log(this.contratoFormGroup.valid)
      // El formulario principal es válido si todos los subgrupos son válidos
      if(this.contratoFormGroup.valid){
        // Aquí se pueden extraer todos los datos anidados:
        const finalData = this.contratoFormGroup.value;
        console.log('Datos finales:', finalData);
        this.notificationService.pushSuccess('Contrato creado exitosamente.');
      } else {
        // Marca todos los controles de todos los pasos como 'touched' para mostrar errores
        this.contratoFormGroup.markAllAsTouched();
        this.notificationService.pushError('Por favor, completa todos los campos obligatorios.');
      }
    }

    // Método de utilidad para simplificar la validación en la plantilla
    get personalControls() { return this.stepPersonalData.controls; }
    get addressControls() { return this.stepAddressData.controls; }
    get serviceControls() { return this.stepServiceData.controls; }
}
