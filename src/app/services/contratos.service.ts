import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppSettings } from '../appSettings';
import { NotificationService } from './core/notification.service';
//import { NotificationService } from './core/notification.service';
@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  private get token(): string | null {
    return sessionStorage.getItem("token");
  }
  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService
  ) { }

  nuevoContrato(body:any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.post(
      AppSettings.API_ENDPOINT + '/api/nuevoContrato', body, { headers: headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  eliminarContrato(id:string): Observable<any> { 
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.delete(`${AppSettings.API_ENDPOINT}/api/eliminarContrato/${id}`, { headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }
  
  buscarContratoPorCriterio(body:any): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.post(
      AppSettings.API_ENDPOINT + '/api/buscarContratos', body, { headers: headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtenerContratos(): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.get(
      AppSettings.API_ENDPOINT + '/api/obtenerContratos',{ headers: headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtenerUrlContrato(id:string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.get(`${AppSettings.API_ENDPOINT}/api/contrato/${id}`, { headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

   protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this._notificationService.pushError("No hay comunicación");
    } else {
      if (error.status === AppSettings.CODE_WRONG_REQUEST) {
        this._notificationService.pushError("Solicitud errónea");
      } else if (error.status === AppSettings.CODE_WITHOUT_AUTHORIZATION) {
        this._notificationService.pushError("Solicitud no autorizada");
      } else {
        this._notificationService.pushError("Ha ocurrido un error, vuelva a intentarlo más tarde");
      }
    }

    return throwError('ERROR');
  }
}