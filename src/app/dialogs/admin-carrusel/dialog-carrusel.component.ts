import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { CarruselApiService } from '../../services/carrusel-api.service'; // ajusta la ruta real
import { NotificationService } from '../../services/core/notification.service';

interface UbicacionCarrusel {
  idUbicacion: string;
  idCarruselActivo: number | null;
  nombreDisplay: string;
}

@Component({
  selector: 'app-dialog-carrusel',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  templateUrl: './dialog-carrusel.component.html',
  styleUrl: './dialog-carrusel.component.scss'
})


export class DialogCarruselComponent implements OnInit {
  form: FormGroup;
  previewIndex = 0;

  ubicaciones: UbicacionCarrusel[] = [];
  cargandoUbicaciones = false;

  guardando = false;
  errorGuardado: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<DialogCarruselComponent>,
    private fb: FormBuilder,
    private carruselApi: CarruselApiService,
    private notificationService: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      idCarrusel: [data?.idCarrusel ?? null],
      nombreCarrusel: [data?.nombreCarrusel ?? '', Validators.required],
      ubicacion: [data?.ubicacion ?? '', Validators.required],
      imagenes: this.fb.array(
        data?.imagenes?.length
          ? data.imagenes.map((img: any) => this.crearImagenGroup(img))
          : [this.crearImagenGroup()]
      )
    });
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
  }

  cargarUbicaciones() {
    this.ubicaciones = [];
    this.cargandoUbicaciones = true;
    this.carruselApi.getUbicaciones().subscribe({
      next: (resp) => {

        if (resp.resultado) {
          this.cargandoUbicaciones = false;
          this.ubicaciones = resp.obj ?? [];

          
        }else {
          this.ubicaciones = [];
          this.cargandoUbicaciones = false;
        }
      },  
      error: () => {
        this.ubicaciones = [];
        this.cargandoUbicaciones = false;
      }
    });
  }

  get imagenes(): FormArray {
    return this.form.get('imagenes') as FormArray;
  }

  crearImagenGroup(img?: any): FormGroup {
    return this.fb.group({
      idImagen: [img?.idImagen ?? null],
      titulo: [img?.titulo ?? '', Validators.required],
      descripcion: [img?.descripcion ?? '', Validators.required],
      url: [img?.urlImagen ?? img?.url ?? '', Validators.required]
    });
  }

  agregarImagen() {
    this.imagenes.push(this.crearImagenGroup());
    this.previewIndex = this.imagenes.length - 1;
  }

  eliminarImagen(index: number) {
    this.imagenes.removeAt(index);
    if (this.previewIndex >= this.imagenes.length) {
      this.previewIndex = Math.max(0, this.imagenes.length - 1);
    }
  }

  get imagenActualGroup(): FormGroup {
    return this.imagenes.at(this.previewIndex) as FormGroup;
  }

  // --- Vista previa ---
  get imagenPreviewActual() {
    return this.imagenes.at(this.previewIndex)?.value;
  }

  siguientePreview() {
    if (this.imagenes.length === 0) return;
    this.previewIndex = (this.previewIndex + 1) % this.imagenes.length;
  }

  anteriorPreview() {
    if (this.imagenes.length === 0) return;
    this.previewIndex =
      (this.previewIndex - 1 + this.imagenes.length) % this.imagenes.length;
  }

  irAPreview(index: number) {
    this.previewIndex = index;
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorGuardado = null;

    const valorForm = this.form.value;

    const payload = {
      idCarrusel: valorForm.idCarrusel,
      nombreCarrusel: valorForm.nombreCarrusel,
      ubicacion: valorForm.ubicacion,
      listaImagenes: valorForm.imagenes.map((img: any) => ({
        idImagen: img.idImagen ?? null,
        titulo: img.titulo,
        descripcion: img.descripcion,
        urlImagen: img.url
      }))
    };

    this.guardando = true;

    const request$ = payload.idCarrusel
      ? this.carruselApi.actualizarCarrusel(payload.idCarrusel, payload)
      : this.carruselApi.nuevoCarrusel(payload);

    request$.subscribe({
      next: (resp) => {
        this.guardando = false;
        if (resp.resultado) {
          this.notificationService.pushSuccess(resp.mensaje || 'Carrusel guardado exitosamente.');
          this.dialogRef.close();
        } else {
          this.errorGuardado = resp.mensaje || 'No se pudo guardar el carrusel.';
        }
      },
      error: (err) => {
        this.guardando = false;
        this.errorGuardado =
          err?.error?.mensaje || 'Error inesperado al guardar el carrusel.';
      }
    });
  }

  cancelar() {
    this.dialogRef.close();
  }
}