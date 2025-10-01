import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError, timeout } from 'rxjs';
import { AppSettings } from '../appSettings';
import { NotificationService } from './core/notification.service';
import { ResultadoDto } from '../DTOs/response/resultadoDto';
import { AddUpdatePoligonoRequest } from '../DTOs/request/addUpdatePoligonoRequest';
import { PoligonoModel } from '../components/models/poligonoModel';
//import { NotificationService } from './core/notification.service';
@Injectable({
  providedIn: 'root'
})
export class PoligonosService {
  private token = sessionStorage.getItem("token")
headers: HttpHeaders = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService
  ) {}

  getPoligonos(): Observable<any> {    
    return this.http.get(
      AppSettings.API_ENDPOINT + '/public/obtenerPoligonos').pipe(
      timeout(30000), // Timeout de 30 segundos
      retry(2),
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  actualizarPoligono(body: AddUpdatePoligonoRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + '/api/actualizarPoligono',body,{ headers: this.headers }
    ).pipe(
      timeout(30000),
      catchError(error => {                
        return this.handleError(error);
      })
    );
  }  

  actualizarDetallesPoligono(body: AddUpdatePoligonoRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + '/api/actualizarDetallesPoligono',body,{ headers: this.headers }
    ).pipe(
      timeout(30000),
      catchError(error => {                
        return this.handleError(error);
      })
    );
  }

  nuevoPoligono(body: AddUpdatePoligonoRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + '/api/nuevoPoligono',body,{ headers: this.headers }
    ).pipe(
      timeout(30000),
      catchError(error => {                
        return this.handleError(error);
      })
    );
  }

  eliminarPoligono(body: AddUpdatePoligonoRequest): Observable<any> {
    return this.http.post(AppSettings.API_ENDPOINT + '/api/eliminarPoligono',body,{ headers: this.headers }
    ).pipe(
      timeout(30000),
      catchError(error => {                
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