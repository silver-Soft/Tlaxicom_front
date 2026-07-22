import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../services/core/notification.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CatalogosService } from '../../../services/catalogos.service';
import { ResultadoDto } from '../../../DTOs/response/resultadoDto';
import { DialogCarruselComponent } from '../../../dialogs/admin-carrusel/dialog-carrusel.component';
import { CarruselApiService } from '../../../services/carrusel-api.service';

@Component({
  selector: 'app-carruseles',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, CommonModule,
    MatTooltipModule, MatTableModule, MatMenuModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatDialogModule],
  templateUrl: './carruseles.component.html',
  styleUrl: './carruseles.component.scss'
})
export class CarruselesComponent implements OnInit {

  esDispositivoMovil: boolean = false;

 displayedColumns: string[] = ['id', 'nombre', 'ubicacion', 'status', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  // Mapa idUbicacion -> nombreDisplay, para resolver el nombre legible en la tabla
  private mapaUbicaciones = new Map<string, string>();

  constructor(
    private notificationService: NotificationService,
    private observer: BreakpointObserver,
    private catalogosService: CatalogosService,
    private CarruselApiService: CarruselApiService,
    private dialog: MatDialog
  ) {
    this.observer.observe(['(max-width : 800px)']).subscribe(res => {
      this.esDispositivoMovil = res.matches;
    });
  }

  ngOnInit(): void {
    this.cargarUbicaciones();
    this.obtenerCarrousels();
  }

  cargarUbicaciones(): void {
    this.CarruselApiService.getUbicaciones().subscribe({
      next: (resp) => {
        if (resp.resultado && resp.obj) {
          this.mapaUbicaciones.clear();
          resp.obj.forEach((ub: any) => {
            this.mapaUbicaciones.set(ub.idUbicacion, ub.nombreDisplay);
          });
        }
      }
    });
  }

  // Usado en el template para mostrar el nombre legible de la ubicación
  nombreUbicacion(idUbicacion: string | null): string {
    if (!idUbicacion) return 'Sin asignar';
    return this.mapaUbicaciones.get(idUbicacion) ?? idUbicacion;
  }

  nuevoCarrusel(carruselObjeto?: any): void {
    const dialogRef = this.dialog.open(DialogCarruselComponent, {
      data: carruselObjeto || null
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.obtenerCarrousels();
    });
  }

  obtDetalleCarrusel(element: any) {
    this.CarruselApiService.obtenerDetalleCarrusel(element.idCarrusel).subscribe({
      next: (resp: ResultadoDto) => {
        if (resp.resultado) {
          this.nuevoCarrusel(resp.obj);
        } else {
          this.notificationService.pushError(resp.mensaje);
        }
      }
    });
  }

habilitar(idCarrusel: number, idUbicacion: number) {
  this.CarruselApiService.habilitarCarrusel(idCarrusel, idUbicacion).subscribe({
    next: (resp) => {
      if (resp.resultado) {
        this.notificationService.pushSuccess(resp.mensaje || 'Carrusel habilitado.');
        this.obtenerCarrousels();
      } else {
        this.notificationService.pushError(resp.mensaje || 'No se pudo habilitar el carrusel.');
      }
    },
    error: (err) => {
      console.error('Error al habilitar carrusel:', err); // opcional, para debug
      this.notificationService.pushError(
        err?.error?.mensaje || 'Error al habilitar el carrusel.'
      );
    }
  });
}

eliminar(idCarrusel: number) {
  this.notificationService.pedirConfirmacion(
    'Confirmación de eliminación',
    '¿Está seguro de que desea eliminar este carrusel?',
    'warning', true
  ).then((confirmado: boolean) => {
    if (confirmado) {
      this.CarruselApiService.deleteCarrusel(idCarrusel).subscribe({
        next: (resp) => {
          if (resp.resultado) {
            this.notificationService.pushSuccess(resp.mensaje || 'Carrusel eliminado.');
            this.obtenerCarrousels();
          } else {
            this.notificationService.pushError(resp.mensaje || 'No se pudo eliminar el carrusel.');
          }
        },
        error: (err) => {
          this.notificationService.pushError(
            err?.error?.mensaje || 'Error al eliminar el carrusel.'
          );
        }
      });
    }
  });
}

  obtenerCarrousels(): void {
    this.catalogosService.obtenerCarrousels().subscribe((data: ResultadoDto) => {
      if (data.resultado === true) {
        this.dataSource.data = data.obj
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}