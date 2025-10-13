import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavBarService {

  @Output() triggerLogin: EventEmitter<any> = new EventEmitter()
  constructor(private router: Router) { }

  /**
   * Navega a la ruta especificada.
   * @param route La ruta de destino (ej: '/dashboard' o ['/perfil', userId]).
   */
  navigateTo(route: string | any[]): void {  
    console.log('Navegando a:', route); // Log para depuración  
    if (typeof route === 'string') {
        this.router.navigate([route]);
    } else {
        this.router.navigate(route);
    }
  }
}
