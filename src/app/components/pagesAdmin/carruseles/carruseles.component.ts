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

  displayedColumns: string[] = ['id', 'nombre', 'ubicacion', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
    private notificationService: NotificationService,
    private observer: BreakpointObserver,
    private catalogosService: CatalogosService,
    private dialog: MatDialog
  ) {
    this.observer.observe(['(max-width : 800px)']).subscribe(res => {
      this.esDispositivoMovil = res.matches;
    });
  }

  ngOnInit(): void {
    this.obtenerCarrousels();
  }

  nuevoCarrusel(): void {
    const dialogRef = this.dialog.open(DialogCarruselComponent, {
      width: '750px',
      data: null
    });

    dialogRef.afterClosed().subscribe(_ => {
      this.obtenerCarrousels();
    });
  }

  editar(element: any): void {
    const dialogRef = this.dialog.open(DialogCarruselComponent, {
      width: '750px',
      data: element
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        // TODO: llamar a catalogosService para actualizar
        this.obtenerCarrousels();
      }
    });
  }

  habilitar(idCarrusel: number) {

  }
  eliminar(idCarrusel: number) {

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