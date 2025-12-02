// map.component.ts
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapInfoWindow } from '@angular/google-maps';
import { PoligonosService } from '../../services/poligonos.service';
import { NotificationService } from '../../services/core/notification.service';

interface Zona {
  tipo: string;
  idTipo: number;
  nombre:String;
  poligono: any[];
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit {
  // Centro del mapa (Tlaxcala)
  center: google.maps.LatLngLiteral = {
    lat: 19.4722,
    lng: -97.93701
  };

  zoom = 12;

  // 🚩 Nueva bandera de control de estado
  isMapReady = false;
  // Bandera para saber si los datos ya se cargaron.
  private arePolygonsLoaded = false;

  // Referencia al componente de Angular Maps
  @ViewChild(GoogleMap) mapInstance!: GoogleMap;

  // 🚩 1. Usar @ViewChild para obtener la instancia del componente MapInfoWindow
    @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  // 🚩 2. Propiedad para almacenar la posición donde debe abrirse el tooltip
    infoWindowPosition: google.maps.LatLngLiteral = { lat: 0, lng:0 };
    
  // Opciones avanzadas del mapa
  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: false,
    mapTypeId: 'roadmap'
  };
  
  // 1. Propiedad para almacenar el polígono sobre el que está el ratón
  activeZone: Zona | null = null;
      
  // Datos de las zonas (luego vendrán de un servicio)
  zonas: Zona[] = [];

  constructor(private poligonosService: PoligonosService,
      private notificationService: NotificationService,
      private cdr: ChangeDetectorRef,
      private ngZone: NgZone
    ) { }
  
  /**
     * 🚩 MÉTODO DE CONTROL GIS: Llamado ÚNICAMENTE por el evento (mapInitialized) de Google.
     * Esto garantiza que la API de Google esté totalmente lista antes de cualquier manipulación.
     */
  onMapInitialized(): void {
    this.isMapReady = true;

    // 1. Si los polígonos ya llegaron antes de que el mapa se inicializara,
    // simplemente forzamos el redibujo.
    if (this.arePolygonsLoaded) {
      this.forzarRedibujoMapa();
      this.cdr.detectChanges();
    }
    // Si no han llegado, la llamada a forzarRedibujoMapa() se encargará de ello
    // en el callback de obtenerPoligonos.
  }
    
  // El método forzarRedibujoMapa se mantiene sin cambios
  forzarRedibujoMapa(): void {
    // 1. Obtener la referencia interna del objeto de Google Maps
    const gMap = this.mapInstance?.googleMap;

    // 2. Verificar si el objeto existe y si la API de Google está cargada
    if (gMap) {
      // Ejecución de la lógica dentro de NgZone para asegurar que Angular lo detecte
      this.ngZone.run(() => {
        console.log('Mapa forzado a redibujarse y centrarse.');

        // 3. Forzar el resize. 
        // Usamos 'gMap as google.maps.Map' para asegurar el tipado requerido 
        // por la función trigger, aunque ya sepamos que es un objeto de Google Maps.
        google.maps.event.trigger(gMap as google.maps.Map, 'resize');

        // 4. Setear el centro y el zoom
        // Dado que gMap ya es la instancia de google.maps.Map, tiene estos métodos.
        gMap.setCenter(this.center);
        gMap.setZoom(this.zoom);

        // Forzamos la detección de cambios de Angular
        this.cdr.detectChanges();
      });
    }
  }

  ngOnInit(): void {
    this.obtenerPoligonos(
      (listaPoligonos) => {
        this.zonas = listaPoligonos;
        this.arePolygonsLoaded = true; // Marca que los datos están listos

        // 2. Si el mapa ya está listo (isMapReady=true), forzamos el redibujo AHORA.
        if (this.isMapReady) {
          this.forzarRedibujoMapa();
        }

        // Forzamos la detección de cambios para dibujar los polígonos.
        this.cdr.detectChanges();
      },
      (message: string) => {
        this.notificationService.pushError(message);
      }
    );
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
        onError("Error al obtener los polígonos: " + data.mensaje);
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

  // Manejar clic en los polígonos
  onPolygonClick(zona: Zona): void {
    console.log('Polígono clickeado:', zona);
    // Aquí puedes mostrar un modal, tooltip, o hacer alguna acción
    alert(`Zona ${zona.tipo} (ID: ${zona.idTipo}) seleccionada`);
  }

  // Método para actualizar zonas dinámicamente (cuando tengas el servicio)
  actualizarZonas(nuevasZonas: Zona[]): void {
    this.zonas = nuevasZonas;
  }  

  // 2. Método para mostrar el InfoWindow (Tooltip)
  openInfoWindow(event: any, zona: Zona) {
    console.log("OPEN")
    // Cierra cualquier ventana que pudiera estar abierta
    this.infoWindow.close();

    // 1. Verificación de Nulidad: Aseguramos que las coordenadas existan.
    if (!event.latLng) {
      console.warn("Posición de mouseover no disponible.");
      return;
    }

    // 2. Procesa la posición
    // Aseguramos que el método toJSON exista antes de llamarlo, o si no, asumimos que ya es literal
    const latLng = (event.latLng && event.latLng.toJSON) 
                   ? event.latLng.toJSON() 
                   : event.latLng;

    this.activeZone = zona;
    this.infoWindowPosition = latLng;

    // 3. Abrir la ventana de información en esa posición.
    this.infoWindow.open();
  }

  // 3. Método para cerrar el InfoWindow (Tooltip)
  closeInfoWindow() {
    // Cierra la ventana
    this.infoWindow.close();

    // Limpia el contenido después de un breve retraso para evitar parpadeos
    setTimeout(() => {
      this.activeZone = null;
    }, 100);
  }
}