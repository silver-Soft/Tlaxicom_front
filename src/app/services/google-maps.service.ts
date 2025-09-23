// google-maps.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Zona {
  tipo: string;
  idTipo: number;
  coordenadas: [number, number][];
}

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {
  private apiUrl = 'api/zonas'; // URL de tu endpoint

  constructor(private http: HttpClient) {}

  getZonas(): Observable<Zona[]> {
    return this.http.get<Zona[]>(this.apiUrl);
  }

  // Método adicional si necesitas enviar datos
  saveZona(zona: Zona): Observable<any> {
    return this.http.post(this.apiUrl, zona);
  }
  
}