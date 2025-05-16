import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatIconModule, MatDividerModule, MatButtonModule, MatCardModule, CommonModule],
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

  activeIndex = 0;
  intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => this.nextSlide(), 5000); // cambio cada 5 segundos
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  nextSlide(): void {
    this.activeIndex = (this.activeIndex + 1) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.activeIndex = index;
  }
}
