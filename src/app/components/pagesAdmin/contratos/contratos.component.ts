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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-contratos',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, CommonModule,
    MatTooltipModule, MatTableModule, MatMenuModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatFormFieldModule, MatInputModule,
        FormsModule, ReactiveFormsModule, MatIconModule, MatDatepickerModule],
  templateUrl: './contratos.component.html',
  styleUrl: './contratos.component.scss'
})
export class ContratosComponent implements OnInit{
  esDispositivoMovil: boolean = false;
  
  displayedColumns: string[] = ['id', 'nombre', 'domicilio', 'paquete', 'activo', 'acciones'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  busquedaContratosFormGroup!: FormGroup;
  constructor(
      private notificationService: NotificationService,
      private contratosService: ContratosService,
      public navbarService:NavBarService,
      private observer : BreakpointObserver,
      private utilsService: UtilsService,
      private _formBuilder: FormBuilder,
    ) { 
      this.observer.observe(['(max-width : 800px)']).subscribe(res => {
      this.esDispositivoMovil = res.matches;
    });
  }

  ngOnInit(): void {
    this.busquedaContratosFormGroup = this._formBuilder.group({
        nombre: [''],
        domicilio: [''],
        fechaInstalacion1: [''],
        fechaInstalacion2: [''],
      }, { validators: this.busquedaContratosValidator });

    this.obtenerContratos()    
  }

  buscarContratos(){
    if(this.busquedaContratosFormGroup.valid){
      const raw = this.busquedaContratosFormGroup.value;
      const payload = {
        nombre: raw.nombre?.trim() || "",
        domicilio: raw.domicilio?.trim() || "",
        fechaInstalacion1: this.utilsService.formatDate(raw.fechaInstalacion1),
        fechaInstalacion2: this.utilsService.formatDate(raw.fechaInstalacion2)
      };
      this.contratosService.buscarContratoPorCriterio(payload).subscribe((data: ResultadoDto) => {
        if (data.resultado === true) {
          this.dataSource.data = data.obj
        } else {
          this.notificationService.pushError(data.mensaje);
        }
      })
    }else{
      this.notificationService.pushError("Por favor, complete los campos correctamente.");
    }
  }

  detalle(element: any) {
    this.contratosService.obtenerUrlContrato(element.idContrato).subscribe((data: ResultadoDto) => {
      if (data.resultado === true) {
        this.utilsService.downloadPdfFromSignedUrl(
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

  busquedaContratosValidator(control: AbstractControl): ValidationErrors | null {
    const nombre = control.get('nombre')?.value?.trim();
    const domicilio = control.get('domicilio')?.value?.trim();
    const fechaInstalacion1 = control.get('fechaInstalacion1')?.value;
    const fechaInstalacion2 = control.get('fechaInstalacion2')?.value;

    const tieneTexto = !!(nombre || domicilio);
    const tieneFechas = !!(fechaInstalacion1 || fechaInstalacion2);

    // ---- REGLA 1: Búsqueda por texto ----
    if (tieneTexto) {
      return null; // No requiere fechas
    }

    // ---- REGLA 2: Búsqueda por fechas ----
    if (tieneFechas) {
      if (fechaInstalacion1 && fechaInstalacion2) {
        return null; // OK, rango válido
      } else {
        return { rangoFechasIncompleto: true }; // Falta una de las dos fechas
      }
    }

    // ---- REGLA 3: Nada lleno ----
    return { sinCriterios: true };
  }
}
