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
import { MatDialog } from '@angular/material/dialog';
import { ModAtributosPoligonoComponent } from '../../../dialogs/admin-poligonos/mod-atributos-poligono/mod-atributos-poligono.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AddUpdatePoligonoRequest } from '../../../DTOs/request/addUpdatePoligonoRequest';

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
  drawingManager?: google.maps.drawing.DrawingManager;

  poligonoModel: PoligonoModel = new PoligonoModel();

  poligonoSeleccionado: PoligonoModel = new PoligonoModel();
  polygonRef!: google.maps.Polygon;

  poligonos = new MatTableDataSource<any>([]);
  esDispositivoMovil: any;
  agregandoPoligono: boolean = false;
  polygon?: google.maps.Polygon;

  constructor(private poligonosService: PoligonosService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private observer : BreakpointObserver,
  ) { 
    this.observer.observe(['(max-width : 800px)']).subscribe(res => {
    this.esDispositivoMovil = res.matches;
  });
  }

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
      strokeColor: this.getStrokeColor(poligonoModel.idTipo),
      fillColor: this.getFillColor(poligonoModel.idTipo),
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
    if(this.agregandoPoligono){      
      console.log('New poligono:\n', JSON.stringify(this.poligonoModel));
      this.editarAtributos()
    }else{
      const nuevasCoordenadas = this.obtenerCoordenadasEditadas();    
      const poligonoModel = new PoligonoModel();
      poligonoModel.idPoligono = this.poligonoModel.idPoligono;
      poligonoModel.poligono = nuevasCoordenadas;
      console.log('Update poligono:\n', JSON.stringify(poligonoModel));
      this.actualizarPoligono(poligonoModel); 
    }     
  }

  reiniciarPoligono(){
    this.editarZona(this.poligonoModel);
  }

  reiniciarEdicion() {
    if (this.polygonEditor) {
      this.polygonEditor.setMap(null);
      this.polygonEditor = undefined;
      this.poligonoModel = new PoligonoModel();
    }
  }  

  editarAtributos(){
    const dialogConfig = {
        width: this.esDispositivoMovil ? '90vw' : 'auto', 
        height: 'auto', 
        maxWidth: '100%', 
        maxHeight: '100%', 
        panelClass: 'dialog-responsive',
        autoFocus: false, 
        disableClose: true,
        data: { 
          poligonoModel: this.poligonoModel
        }        
      };

    const dialogRef = this.dialog.open(ModAtributosPoligonoComponent, dialogConfig)
      dialogRef.afterClosed().subscribe(dialogResponse => {
        if (dialogResponse != undefined) {
          if (dialogResponse.result == true) {
            let poligonoModel = new PoligonoModel();
            poligonoModel = { ...dialogResponse.data };

            if(this.agregandoPoligono){
              poligonoModel.poligono = this.poligonoModel.poligono.map((latLng) => ({
                latitude: latLng.lat(),
                longitude: latLng.lng(),
              }));
              console.log('Nuevo poligono:\n', JSON.stringify(poligonoModel));
              this.registrarPoligono(poligonoModel);              
            }else{
              console.log('Update detalles poligono:\n', JSON.stringify(poligonoModel));            
              this.actualizarDetallesPoligono(poligonoModel);          
            }                        
          }
        } else {
          console.log(JSON.stringify(dialogResponse))
        }
      });
  }

  nuevoPoligono(){    
    this.reiniciarEdicion();
    this.agregandoPoligono = true;

    const map = this.googleMap.googleMap!;

     // Crear DrawingManager solo para polígonos
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [google.maps.drawing.OverlayType.POLYGON],
      },
      polygonOptions: {
        editable: true,
        draggable: false,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
      },
    });

    this.drawingManager.setMap(map);

     // Evento: cuando el usuario termina de dibujar un polígono
    this.drawingManager.addListener('overlaycomplete', (event: google.maps.drawing.OverlayCompleteEvent) => {
    if (event.type === google.maps.drawing.OverlayType.POLYGON) {
      // Guardamos directamente el polígono creado
      this.polygon = event.overlay as google.maps.Polygon;

      // Hacemos editable y arrastrable
      this.polygon.setEditable(true);
      this.polygon.setDraggable(true);

      // Actualizar tu modelo con las coordenadas      
      this.poligonoModel.poligono = this.polygon.getPath().getArray()    
    }
  });
  }

  cerrarRegistroPoligono() {
    // Cancelar si ya hay un polígono dibujado
    this.agregandoPoligono = false;
    if (this.polygon) {
      this.polygon.setMap(null); // Elimina el polígono del mapa
      this.polygon = undefined;
    }
    // Cancelar si estoy en medio de dibujar un polígono
    if (this.drawingManager) {
      this.drawingManager.setDrawingMode(null); // 🔑 Sale del modo "dibujo"
      this.drawingManager.setMap(null);         // Quita el control de la UI si quieres
      this.drawingManager = undefined;
    }
    // Reset del modelo
    this.poligonoModel = new PoligonoModel();
  }

  registrarPoligono(poligonoModel: AddUpdatePoligonoRequest){
    this.poligonosService.nuevoPoligono(poligonoModel).subscribe((data: any) => {
      if (data.resultado === true) {
        this.notificationService.pushSuccess(data.mensaje);        
        this.obtenerPoligonos(
          (listaPoligonos) => {
            this.poligonos.data = listaPoligonos;
          },
          (message: string) => {
            this.notificationService.pushError(message);
          }
        )     
        this.cerrarRegistroPoligono();   
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    })    
  }

  confirmarEliminarPoligono(poligonoModel: PoligonoModel){
    this.notificationService.pedirConfirmacion(
      'Confirmar eliminación',
      "¿Estás seguro de que deseas eliminar el polígono "+ poligonoModel.nombre+"? Esta acción no se puede deshacer.",
      'question',
      true      
  ).then((confirmed) => {
      if (confirmed) {
        this.eliminarPoligono(poligonoModel);
      } 
  });
}
  eliminarPoligono(poligonoModel: PoligonoModel){
    this.poligonosService.eliminarPoligono(poligonoModel).subscribe((data: any) => {
      if (data.resultado === true) {
        this.notificationService.pushSuccess(data.mensaje);        
        this.obtenerPoligonos(
          (listaPoligonos) => {
            this.poligonos.data = listaPoligonos;
          },
          (message: string) => {
            this.notificationService.pushError(message);
          }
        )     
        this.reiniciarEdicion(); 
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    }) 
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

  actualizarPoligono(poligonoModel: PoligonoModel) {
    this.poligonosService.actualizarPoligono(poligonoModel).subscribe((data: any) => {
      if (data.resultado === true) {
        this.notificationService.pushSuccess(data.mensaje);
        
        this.obtenerPoligonos(
          (listaPoligonos) => {
            this.poligonos.data = listaPoligonos;
            this.poligonoModel = this.poligonos.data.find(p => p.idPoligono === poligonoModel.idPoligono);
            this.editarZona(this.poligonoModel);
          },
          (message: string) => {
            this.notificationService.pushError(message);
          }
        )        
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    })
  }

  actualizarDetallesPoligono(poligonoModel: PoligonoModel) {
    this.poligonosService.actualizarDetallesPoligono(poligonoModel).subscribe((data: any) => {
      if (data.resultado === true) {
        this.notificationService.pushSuccess(data.mensaje);
        this.obtenerPoligonos(
          (listaPoligonos:any) => {
            this.poligonos.data = listaPoligonos;
            this.poligonoModel = this.poligonos.data.find(p => p.idPoligono === poligonoModel.idPoligono);
            this.editarZona(this.poligonoModel);
          },
          (message: string) => {
            this.notificationService.pushError(message);
          }
        )
      } else {
        this.notificationService.pushError(data.mensaje);
      }
    })
  }

  // Método para obtener color del borde según el tipo
  getStrokeColor(idTipo: number): string {
    return idTipo === 1 ? "#13cb2c" : "#00a6ff";
  }

  // Método para obtener color de relleno según el tipo
  getFillColor(idTipo: number): string {
    return idTipo === 1 ? "#70ff00" : "#006cff";
  }
}
