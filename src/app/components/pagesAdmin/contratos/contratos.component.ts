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
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { NavBarService } from '../../../services/core/navBar.service';

@Component({
  selector: 'app-contratos',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, CommonModule,
    MatTooltipModule, MatTableModule, MatMenuModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.scss'
})
export class ContratosComponent implements OnInit{
  esDispositivoMovil: boolean = false;
  
  displayedColumns: string[] = ['id', 'nombre', 'domicilio', 'paquete', 'activo', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  constructor(
      private notificationService: NotificationService,
      //private dialog: MatDialog,
      public navbarService:NavBarService,
      private observer : BreakpointObserver,
    ) { 
      this.observer.observe(['(max-width : 800px)']).subscribe(res => {
      this.esDispositivoMovil = res.matches;
    });
  }

  ngOnInit(): void {
    this.dataSource.data = [
      {id: 1, nombre: 'Ernesto Pérez', domicilio: 'Calle 5 de Febrero #123, Col. Centro, CP 06000, CDMX', paquete: 'Básico', activo: true},
      {id: 2, nombre: 'María López', domicilio: 'Avenida Insurgentes Sur #456, Col. Del Valle, CP 03100, CDMX', paquete: 'Premium', activo: false},
      {id: 3, nombre: 'Juan Martínez', domicilio: 'Calle Reforma #789, Col. Juárez, CP 06600, CDMX', paquete: 'Estándar', activo: true},
      {id: 4, nombre: 'Ana Gómez', domicilio: 'Avenida Coyoacán #101, Col. Narvarte, CP 03020, CDMX', paquete: 'Básico', activo: true},]
  }

  detalle(element: any) {
    
  }

  modificar(idAcreedor: number) {
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
