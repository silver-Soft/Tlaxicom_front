import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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

@Component({
  selector: 'app-crear-contrato',
  imports: [MatCardModule,
        CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule,
        FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule, MatDatepickerModule, 
      MatTimepickerModule, MatSlideToggleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crear-contrato.component.html',
  styleUrl: './crear-contrato.component.scss'
})
export class CrearContratoComponent {
  contratoFormGroup!: FormGroup;
  contratoModel: ContratoModel = new ContratoModel();
  tiposConexion: any[] = [];

  constructor(            
      private _formBuilder: FormBuilder,
      //private catalogosService: CatalogosService,
      private notificationService: NotificationService
    ){
      this.contratoFormGroup = this._formBuilder.group({                
        nombre: [null, [Validators.required,]],
        apPaterno: [null, [Validators.required,]],
        apMaterno: [null, [Validators.nullValidator,]],
        domicilio: [null, [Validators.required,]],
        numExterior: [null, [Validators.required,]],
        numInterior: [null, [Validators.nullValidator,]],
        colonia: [null, [Validators.required,]],
        municipio: [null, [Validators.required,]],
        estado: [null, [Validators.required,]],
        cp: [null, [Validators.required,]],
        telefono: [null, [Validators.required,]],
        idPaquete: [null, [Validators.required,]],
        tarifa: [null, [Validators.required,]],
        marcaModem: [null, [Validators.required,]],
        modeloModem: [null, [Validators.required,]],
        noSerieModem: [null, [Validators.required,]],
        cantEquipos: [null, [Validators.required,]],
        fechaInstalacion: [null, [Validators.required,]],
        horaInstalacion: [null, [Validators.required,]], 
        idMetodoPago: [null, [Validators.required,]],
        serviciosAdicionales: [null, [Validators.nullValidator,]],
        cuentaEmail: [null, [Validators.required,]],
        email: [null, [Validators.nullValidator,]],
      });
    }

    onSubmit(){
      if(this.contratoFormGroup.valid){
        this.notificationService.pushSuccess('Formulario Válido');
      } else {
        this.notificationService.pushError('Formulario Inválido');
      }
    }
}
