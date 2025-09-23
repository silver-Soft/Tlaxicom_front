import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PoligonosService } from '../../../services/poligonos.service';
import { ResultadoDto } from '../../../DTOs/response/resultadoDto';
import { NotificationService } from '../../../services/core/notification.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';
import { PoligonoModel } from '../../models/poligonoModel';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-admin-poligonos',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatCardModule, CommonModule,
    MatTooltipModule, MatTableModule, MatMenuModule, GoogleMap, GoogleMapsModule, MatSidenavModule,
  MatToolbarModule, MatListModule],
  templateUrl: './admin-poligonos.component.html',
  styleUrl: './admin-poligonos.component.scss'
})
export class AdminPoligonosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'acciones'];
  center: google.maps.LatLngLiteral = {
    lat: 19.4722,
    lng: -97.93701
  };
  zoom = 12;

  @ViewChild('googleMap', { static: false }) googleMap!: GoogleMap;
  polygonEditor?: google.maps.Polygon;

  poligonoModel: PoligonoModel = new PoligonoModel();

  poligonoSeleccionado: PoligonoModel = new PoligonoModel();
  polygonRef!: google.maps.Polygon;

  poligonos = new MatTableDataSource<any>([]);

  constructor(private poligonosService: PoligonosService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.obtenerPoligonos(
      (listaPoligonos) => {
        this.poligonos.data = listaPoligonos;
      },
      (message: string) => {
        this.notificationService.pushError(message);
      }
    )
  }

  // Activar edición de una zona
  editarZona(poligonoModel: PoligonoModel) {
    this.poligonoModel = { ...poligonoModel }; // Clonar objeto para evitar referencias
    if (this.polygonEditor) {
      this.polygonEditor.setMap(null);
    }

    const map = this.googleMap.googleMap!; // instancia nativa del mapa
    this.polygonEditor = new google.maps.Polygon({
      paths: poligonoModel.poligono,
      map,
      editable: true,
      draggable: false,
      strokeColor: this.getStrokeColor(poligonoModel.tipo),
      fillColor: this.getFillColor(poligonoModel.tipo),
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillOpacity: 0.35,
    });

    // Enfocar polígono
    const bounds = new google.maps.LatLngBounds();
    this.polygonEditor.getPath().forEach((latlng) => bounds.extend(latlng));
    map.fitBounds(bounds);
  }

  // Obtener nuevas coordenadas
  obtenerCoordenadasEditadas() {
    if (!this.polygonEditor) return [];
    return this.polygonEditor.getPath().getArray().map((latLng) => ({
      latitude: latLng.lat(),
      longitude: latLng.lng(),
    }));
  }

  guardarPoligono(){
    const nuevasCoordenadas = this.obtenerCoordenadasEditadas();

    console.log('Nuevas coordenadas:', nuevasCoordenadas);

  }

  reiniciarPoligono(){
    this.editarZona(this.poligonoModel);
  }

  cancelarEdicion() {
    if (this.polygonEditor) {
      this.polygonEditor.setMap(null);
      this.polygonEditor = undefined;
      this.poligonoModel = new PoligonoModel();
    }
  }

  editarAtributos(){

  }
  
  obtenerPoligonos(onSuccess: (listaPoligonos: any) => void, onError: (message: string) => void) {
    this.poligonosService.getPoligonos().subscribe((data: any) => {
      if (data.resultado === true) {
        const poligonos = data.obj.map((p: any) => ({
          ...p,
          poligono: p.poligono.map((pt: any) => ({
            lat: Number(pt.latitude),
            lng: Number(pt.longitude)
          }))
        }));
        onSuccess(poligonos);
      } else {
        onError(data.mensaje);
      }
    })
  }

  // Método para obtener color del borde según el tipo
  getStrokeColor(tipo: string): string {
    return tipo === "wireless" ? "#13cb2c" : "#00a6ff";
  }

  // Método para obtener color de relleno según el tipo
  getFillColor(tipo: string): string {
    return tipo === "wireless" ? "#70ff00" : "#006cff";
  }
}
