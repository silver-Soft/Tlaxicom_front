import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AdminPoligonosComponent } from './components/pages/admin-poligonos/admin-poligonos.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'AdminPoligonos', component: AdminPoligonosComponent },
];
