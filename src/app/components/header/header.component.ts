import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule, RouterModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  esDispositivoMovil: boolean = false;
  constructor(    
    private observer: BreakpointObserver,
  ) {
    this.observer.observe(['(max-width: 800px)']).subscribe(result => {
      this.esDispositivoMovil = result.matches;
    });
  }
}
