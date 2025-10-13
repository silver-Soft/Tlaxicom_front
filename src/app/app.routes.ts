import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { AdminPoligonosComponent } from './components/pagesAdmin/admin-poligonos/admin-poligonos.component';
import { LoginComponent } from './components/pagesAdmin/login/login.component';
import { DashboardComponent } from './components/pagesAdmin/dashboard/dashboard.component';
import { ContratosComponent } from './components/pagesAdmin/contratos/contratos.component';
import { CrearContratoComponent } from './components/pagesAdmin/contratos/crear-contrato/crear-contrato.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'inicio', component: HomeComponent },
    { path: 'login', component: LoginComponent, pathMatch: 'full' },
    { path: 'adminPoligonos', component: AdminPoligonosComponent, pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' },
    { path: 'contratos', component: ContratosComponent, pathMatch: 'full' },
    { path: 'contratos/crearContrato', component: CrearContratoComponent, pathMatch: 'full' },
    
];
