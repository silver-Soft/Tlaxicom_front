import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AppSettings } from '../../appSettings';
import { LoginRequest } from '../../DTOs/request/loginRequest';

class DatosUsuario {
  nombre: string;
  email: string;  
  constructor() {
    this.nombre = '';
    this.email = '';    
  }
}

@Injectable({
  providedIn: 'root'
})
export class LoginUsuarioService {

  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService
  ) { }

  //LOGUEO
  UsuarioLogueo(credenciales:LoginRequest): Observable<any> {
    return this.http.post(
      AppSettings.API_ENDPOINT + '/public/auth',credenciales
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  guardarToken(token:string){
    return sessionStorage.setItem("token",token)
  }

  obtenerToken() { 
    return sessionStorage.getItem("token")
  }  

  obtenerDatosUsuario(): DatosUsuario { 
    let datosUsuario = new DatosUsuario();
    datosUsuario.nombre = sessionStorage.getItem("usuario") || '';
    datosUsuario.email = sessionStorage.getItem("email") || '';
    return datosUsuario    
  }  

  // Manejo de errores más robusto
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error('Error en servicio Poligonos:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}