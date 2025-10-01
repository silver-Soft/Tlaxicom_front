import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoTlaxicomComponent } from '../core/logo-tlaxicom/logo-tlaxicom.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoginUsuarioService } from '../../services/core/login.service';
import { MatMenuModule } from '@angular/material/menu';
import { MenuService } from '../../services/menu.service';
import { ResultadoDto } from '../../DTOs/response/resultadoDto';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NavBarService } from '../../services/core/navBar.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, RouterModule, MatButtonModule, LogoTlaxicomComponent,
    MatSidenavModule, MatListModule, MatTooltipModule, MatMenuModule, MatButtonToggleModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  esDispositivoMovil: boolean = false;
  menuList: any [] = [];
  constructor(    
    private observer: BreakpointObserver,
    public loginService: LoginUsuarioService,
    public menuService: MenuService,
    private router: Router,
    private servicioNavBar: NavBarService
  ) {
    this.observer.observe(['(max-width: 800px)']).subscribe(result => {
      this.esDispositivoMovil = result.matches;
    });
  }
  ngOnInit(): void {
    // Verifica si hay sesión al cargar el componente
    const haySesion = !!sessionStorage.getItem('token');
    if (haySesion) {
      this.getMenu();
    } else {
      this.getMenuPublico();
    }
    
    this.servicioNavBar.triggerLogin.subscribe(haySesion => {//si existe sesion
        console.log("Hay sesion? ", haySesion);    
        if(haySesion){
          this.getMenu() //obtener menu con privilegios
        }else{
          this.getMenuPublico() //obtener menu publico
        }    
      })
  }

  getMenuPublico() {
    this.menuService.obtenerMenuPublico().subscribe((data: ResultadoDto) => {
      if (data.resultado === true) { 
        this.menuList = data.obj.menu         
      } 
    })
  }

  getMenu() {
    this.menuService.obtenerMenu(2).subscribe((data: ResultadoDto) => {
      if (data.resultado === true) { 
        this.menuList = data.obj.menu         
      } 
    })
  }

  cerrarSesion(){
    sessionStorage.clear()
    this.servicioNavBar.triggerLogin.emit(false) //emitir evento de que no hay sesion
    this.router.navigate(['inicio']).then(() => {
      window.location.replace(window.location.href);
    });
  }

  navigate(ruta:string){

  }
}
