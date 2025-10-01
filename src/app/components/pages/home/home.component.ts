import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle'
import { FormsModule } from '@angular/forms';
//import { GoogleMapsService } from '../../services/google-maps.service';
import { MapComponent } from '../../map/map.component';
import { PaqueteModel } from '../../models/paqueteModel';
import { CatalogosService } from '../../../services/catalogos.service';
import { NotificationService } from '../../../services/core/notification.service';
import { ResultadoDto } from '../../../DTOs/response/resultadoDto';
@Component({
  selector: 'app-home',
  imports: [MatIconModule, MatDividerModule, MatButtonModule, MatCardModule, CommonModule,
    MatButtonToggleModule, FormsModule, MapComponent
  ],
  providers: [/*GoogleMapsService*/],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  slides = [
    {
      title: '<h1 class="title"> Oportuno </h1>',
      description: '<p>Tecnología al alcance de todos: Acortamos la brecha digital en tu comunidad.</p>',
      image: 'https://tlaxicom.com/img/slider/ift_permiso.JPG'
    },
    {
      title: '<h1 class="title"> Oportuno </h1>',
      description: '<p>Tecnología al alcance de todos: Acortamos la brecha digital en tu comunidad.</p>',
      image: 'https://tlaxicom.com/img/slider/slider1.webp'
    },
    {
      title: '<em> Interactividad </em>',
      description: `Las animaciones pueden ayudar a que un sitio web se sienta más interactivo y agradable a la vista.`,
      image: 'https://tlaxicom.com/img/slider/slider2.webp'
    },
    {
      title: 'Define la esencia de tu <em> Sitio Web </em>',
      description: `Un sitio web es la carta de presentación de tu negocio...`,
      image: 'https://tlaxicom.com/img/slider/slider3Cropped.webp'
    }
  ];

  paquetes: PaqueteModel[] = []
  /*[
    {
      idPaquete: 1,      
      title: 'Básico',      
      speed: '10 Megas',
      headerTextColor: '#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 1,
      tipo: 'Inalámbrico',
      costo: 350,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Equipo incluido',
        folio: '682174',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    },
    {
      idPaquete: 2,      
      title: 'Básico',      
      speed: '10 Megas',
      headerTextColor: '#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 1,
      tipo: 'Fibra',
      costo: 350,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Instalación gratuita',
        folio: '682175',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    },
    {
      idPaquete: 3,      
      title: 'Premium',      
      speed: '50 Megas',
      headerTextColor: 'p#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 1,
      tipo: 'Inalámbrico',
      costo: 500,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Router avanzado incluido',
        folio: '682176',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    },
    {
      idPaquete: 4,      
      title: 'Premium',      
      speed: '50 Megas',
      headerTextColor: 'p#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 2,
      tipo: 'Fibra',
      costo: 500,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Soporte prioritario',
        folio: '682177',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    },
    {
      idPaquete: 5,      
      title: 'Turbo',      
      speed: '100 Megas',
      headerTextColor: '#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 2,
      tipo: 'Fibra',
      costo: 700,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Equipo de última generación',
        folio: '682178',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    },
    {
      idPaquete: 6,      
      title: 'Turbo',      
      speed: '100 Megas',
      headerTextColor: '#ffff',
      headerBackground: '#005cbb',      
      mode: 'Ilimitado',
      idTipo: 2,
      tipo: 'Fibra',
      costo: 700,
      features: {
        banner: 'https://telmex.com/documents/d/hogar/promo_netflix',
        info: 'Instalación express',
        folio: '682179',
        textColor: '#000000'
      },
      buttons: {
        showContratar: true,
        showInfo: true
      }
    }
  ]*/

  activeIndex = 0;
  intervalId: any;

  idTipo: number = 1;


  constructor(private catalogosService: CatalogosService,
        private notificationService: NotificationService
      ) { }

  ngOnInit(): void {
    this.obtenerPaquetes();
    this.clearSlideInterval();
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }


  obtenerPaquetes(): void {
    this.catalogosService.obtenerPaquetes().subscribe((data: ResultadoDto) => {
      if (data.resultado === true) {   
        this.paquetes = data.obj as PaqueteModel[];              
      } else {
        this.notificationService. pushError("Error al obtener los paquetes: " + data.mensaje);
      }
    })
  }  
  
  ngOnDestroy(): void {
    this.clearSlideInterval();
  }

  clearSlideInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
    this.clearSlideInterval();
    this.intervalId = setInterval(() => this.nextSlide(), 5000);
  }
}
