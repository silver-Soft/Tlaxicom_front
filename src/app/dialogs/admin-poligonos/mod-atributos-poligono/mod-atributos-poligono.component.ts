import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { PoligonoModel } from '../../../components/models/poligonoModel';
import { CatalogosService } from '../../../services/catalogos.service';
import { NotificationService } from '../../../services/core/notification.service';
import { MatSelectModule } from '@angular/material/select';

export interface DialogData {    
  poligonoModel:PoligonoModel;
}

@Component({
  selector: 'app-mod-atributos-poligono',
  imports: [MatDialogModule, MatCardModule,
        CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule,
        FormsModule, ReactiveFormsModule, MatIconModule, MatSelectModule],
  templateUrl: './mod-atributos-poligono.component.html',
  styleUrl: './mod-atributos-poligono.component.scss'
})
export class ModAtributosPoligonoComponent implements OnInit {
  detallesPoligonoFormGroup!: FormGroup;
  poligonoModel: PoligonoModel = new PoligonoModel();
  tiposConexion: any[] = [];

  constructor(
      public dialogRef: MatDialogRef<ModAtributosPoligonoComponent>,      
      @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
      private _formBuilder: FormBuilder,
      private catalogosService: CatalogosService,
      private notificationService: NotificationService
    ){
      this.detallesPoligonoFormGroup = this._formBuilder.group({        
        idTipo: [null, [Validators.required,]],         
        nombre:[null, [Validators.required,]]        
      });
     }

  
  ngOnInit(): void {
    this.poligonoModel = this.dialogData.poligonoModel;

    this.obtenerPoligonos(
      (listaTiposConexion) => {
        this.tiposConexion = listaTiposConexion;
      },
      (message: string) => {
        this.notificationService.pushError(message);
      }
    )

    this.detallesPoligonoFormGroup.patchValue({
      idTipo: this.poligonoModel.idTipo === 0 ? null : this.poligonoModel.idTipo,
      nombre: this.poligonoModel.nombre
    });
  }

  validarFormulario(form: any) {
    if (form.valid) {
      this.poligonoModel = this.mapFormToDto(this.detallesPoligonoFormGroup)

      this.dialogRef.close({result:true, data: this.poligonoModel});
    }
    else {
      this.notificationService.pushError('Por favor, complete todos los campos requeridos.');
    }
  }


  obtenerPoligonos(onSuccess: (listaTiposConexion: any) => void, onError: (message: string) => void) {
    this.catalogosService.obtenerTiposConexion().subscribe((data: any) => {
      if (data.resultado === true) {
        onSuccess(data.obj);
      } else {
        onError(data.mensaje);
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close({result:false, data: null});
  }

  mapFormToDto(form: FormGroup): PoligonoModel {
    const idTipo = form.get('idTipo')?.value;
      const dto = new PoligonoModel();
      dto.idPoligono = this.dialogData.poligonoModel.idPoligono;
      dto.idTipo = idTipo;
      dto.tipo = this.tiposConexion.find((conexion: any) => conexion.idTipo === idTipo).tipo;
      dto.nombre = form.get('nombre')?.value;    
      dto.poligono = this.dialogData.poligonoModel.poligono  
      return dto;
  }
}
