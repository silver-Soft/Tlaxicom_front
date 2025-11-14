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
import { ContratosService } from '../../../services/contratos.service';
import { ResultadoDto } from '../../../DTOs/response/resultadoDto';
import { UtilsService } from '../../../services/utils.service';

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
      private contratosService: ContratosService,
      public navbarService:NavBarService,
      private observer : BreakpointObserver,
      private utilsService: UtilsService
    ) { 
      this.observer.observe(['(max-width : 800px)']).subscribe(res => {
      this.esDispositivoMovil = res.matches;
    });
  }

  ngOnInit(): void {
    this.obtenerContratos()    
  }

  detalle(element: any) {
    this.contratosService.obtenerUrlContrato(element.idContrato).subscribe((data: ResultadoDto) => {
      if (data.resultado === true) {
        this.utilsService.downloadPdf(
          data.obj, 
          'Contrato_'+element.idContrato+'_'+element.personal.nombre + '_' + element.personal.apPaterno + '_' + element.personal.apMaterno + '.pdf'
        );
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    });    
  }

  archivar(idAcreedor: number) {
    
  }

  eliminar(idContrato: number) {
    this.contratosService.eliminarContrato(idContrato.toString()).subscribe((data: ResultadoDto) => {
      if (data.resultado === true) {
        this.notificationService.pushSuccess("Contrato eliminado correctamente");
        this.obtenerContratos();
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    });
  }

  obtenerContratos(): void {
    this.contratosService.obtenerContratos().subscribe((data: ResultadoDto) => {
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
