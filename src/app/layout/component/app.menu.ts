import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu implements OnInit {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Funciones',
                items: [
                    { label: 'Clientes', icon: 'pi pi-fw pi-users', routerLink: ['/clientes'] },
                    { label: 'Gestión de Licencias', icon: 'pi pi-fw pi-key', routerLink: ['/gestion-datos-licencias'] },
                    { label: 'Gestión de Dispositivos', icon: 'pi pi-fw pi-desktop', routerLink: ['/gestion-datos-dispositivos'] },
                    { label: 'Gestión de Servicios', icon: 'pi pi-fw pi-wrench', routerLink: ['/gestion-servicios'] },
                    { label: 'Gestión de Mantenimientos', icon: 'pi pi-fw pi-calendar', routerLink: ['/gestion-mantenimientos'] }
                ]
            }
        ];
    }
}
