import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AppSettings } from '../appSettings';
import { NotificationService } from './core/notification.service';
//import { NotificationService } from './core/notification.service';
@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private get token(): string | null {
    return sessionStorage.getItem("token");
  }
  constructor(
    private http: HttpClient,
    protected _notificationService: NotificationService
  ) { }

  obtenerTiposConexion(): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.get(
      AppSettings.API_ENDPOINT + '/api/obtenerTiposConexion',{ headers: headers }
    ).pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }

  obtenerPaquetes(): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.get(
      AppSettings.API_ENDPOINT + '/public/obtenerPaquetes').pipe(
      catchError(error => {
        console.log(error);
        return this.handleError(error);
      })
    );
  }
  
  obtenerMetodosPago(): Observable<any> {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + this.token });
    return this.http.get(
      AppSettings.API_ENDPOINT + '/api/obtenerMetodosPago',{ headers: headers }
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