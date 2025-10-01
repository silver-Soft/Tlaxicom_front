import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { AppSettings } from '../appSettings';
import { NotificationService } from './core/notification.service';
//import { NotificationService } from './core/notification.service';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private token = sessionStorage.getItem("token")
headers: HttpHeaders = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService
  ) {}

   obtenerMenu(idMenu:number): Observable<any> {    
    return this.http.get(
      AppSettings.API_ENDPOINT + '/public/obtenerMenu/'+idMenu,{ headers: this.headers }
    ).pipe(
      timeout(30000), // Timeout de 30 segundos
      retry(2),
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtenerMenuPublico(): Observable<any> {    
    return this.http.get(
      AppSettings.API_ENDPOINT + '/public/obtenerMenuPublico'
    ).pipe(
      timeout(30000), // Timeout de 30 segundos
      retry(2),
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
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