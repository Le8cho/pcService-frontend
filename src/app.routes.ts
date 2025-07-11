import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { GestionDatosLicenciasComponent } from './app/gestion-datos-licencias/gestion-datos-licencias.component';
import { GestionDatosDispositivosComponent } from './app/gestion-datos-dispositivos/gestion-datos-dispositivos.component';
import { EstadisticoComponent } from './app/estadistico/estadistico.component';

import { LoginComponent } from './app/login/login.component';

import { GestionDatosServiciosComponent } from './app/gestion-datos-servicios/gestion-datos-servicios.component';

import { GestionDatosClientesComponent } from './app/gestion-datos-clientes/gestion-datos-clientes.component';
import { GestionDatosMantenimientoComponent } from './app/gestion-datos-mantenimiento/gestion-datos-mantenimiento.component';



export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', component: EstadisticoComponent },
            { path: 'dashboard', component: Dashboard },
            { path: 'clientes', component: GestionDatosClientesComponent },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: 'gestion-datos-licencias', component: GestionDatosLicenciasComponent },
            { path: 'licencias', component: GestionDatosLicenciasComponent },
            { path: 'gestion-datos-dispositivos', component: GestionDatosDispositivosComponent },
            { path: 'gestion-servicios', component: GestionDatosServiciosComponent },
            { path: 'gestion-mantenimientos', component: GestionDatosMantenimientoComponent },
            { path: 'estadistico', component: EstadisticoComponent },
  
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: 'login', component: LoginComponent}, /* Leo */
    { path: '**', redirectTo: '/notfound' }
];