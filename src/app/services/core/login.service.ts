import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { catchError, Observable, throwError } from 'rxjs';
import { AppSettings } from '../../appSettings';
import { LoginRequest } from '../../DTOs/request/loginRequest';
import { LoginResponseDto } from '../../DTOs/response/loginResponseDto';

class DatosUsuario {
  nombre: string;
  email: string;  
  constructor() {
    this.nombre = '';
    this.email = '';    
  }
}

// Interfaz para el Payload de Google
export interface GoogleLoginPayload {
    idToken: string;
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
  
//Login con Google ID Token
  /**
   * Envía el ID Token de Google al backend para la Vinculación de Cuentas.
   * El backend debe retornar la misma estructura LoginResponseDto.
   * @param idToken El token de identidad de Google.
   */
  LoginConGoogle(idToken: string): Observable<LoginResponseDto> {    
    // Construye el objeto que coincide con el record GoogleLoginRequest del backend
    const payload: GoogleLoginPayload = { idToken: idToken };        
    return this.http.post<LoginResponseDto>(`${AppSettings.API_ENDPOINT}/public/auth/google`, payload);
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