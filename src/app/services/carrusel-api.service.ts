import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../appSettings';

export interface ResultadoApi<T> {
  resultado: boolean;
  mensaje: string;
  stackTrace: string | null;
  obj: T;
}

@Injectable({ providedIn: 'root' })
export class CarruselApiService {

  constructor(private http: HttpClient) {}

  nuevoCarrusel(payload: any): Observable<ResultadoApi<any>> {
     const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem("token") });

    return this.http.post<ResultadoApi<any>>(`${AppSettings.API_ENDPOINT}/api/nuevoCarrusel`, payload, { headers });
  }

  obtenerDetalleCarrusel(idCarrusel: number): Observable<ResultadoApi<any>> {
     const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem("token") });

    return this.http.get<ResultadoApi<any>>(`${AppSettings.API_ENDPOINT}/api/detalleCarrusel/${idCarrusel}`, { headers });
  }

  actualizarCarrusel(idCarrusel: number, payload: any): Observable<ResultadoApi<any>> {
     const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem("token") });

    return this.http.put<ResultadoApi<any>>(`${AppSettings.API_ENDPOINT}/api/carruseles/actualizar/${idCarrusel}`, payload, { headers });
  }

  getUbicaciones(): Observable<ResultadoApi<any[]>> {
     const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem("token") });

    return this.http.get<ResultadoApi<any[]>>(`${AppSettings.API_ENDPOINT}/api/carruseles/ubicaciones`, { headers });
  }
}