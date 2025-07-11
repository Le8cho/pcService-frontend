import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../ServiciosSIST/api.service';

@Component({
    standalone: true,
    selector: 'app-notifications-widget',
    imports: [CommonModule],
    template: `<div class="card">
        <div class="flex items-center justify-between mb-6">
            <div class="font-semibold text-xl">Notifications</div>
        </div>

        <span class="block text-muted-color font-medium mb-4">LICENCIAS PRÓXIMAS A VENCER</span>
        <ul class="p-0 mx-0 mt-0 mb-6 list-none">
            <li *ngFor="let lic of licencias" class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-exclamation-triangle !text-xl text-orange-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">
                    {{ lic.cliente }}: <span class="text-surface-700 dark:text-surface-100">Avisar próxima renovación de licencia {{ lic.tipo }} el <span class="text-primary font-bold">{{ lic.fecha }}</span></span>
                </span>
            </li>
            <li *ngIf="licencias.length === 0" class="text-muted-color px-4 py-2">No hay licencias próximas a vencer.</li>
        </ul>

        <span class="block text-muted-color font-medium mb-4">MANTENIMIENTOS PRÓXIMOS</span>
        <ul class="p-0 m-0 list-none mb-6">
            <li *ngFor="let mant of mantenimientos" class="flex items-center py-2 border-b border-surface">
                <div class="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-full mr-4 shrink-0">
                    <i class="pi pi-wrench !text-xl text-blue-500"></i>
                </div>
                <span class="text-surface-900 dark:text-surface-0 leading-normal">
                    {{ mant.cliente }}: <span class="text-surface-700 dark:text-surface-100">Avisar próximo mantenimiento el <span class="text-primary font-bold">{{ mant.fecha }}</span></span>
                </span>
            </li>
            <li *ngIf="mantenimientos.length === 0" class="text-muted-color px-4 py-2">No hay mantenimientos próximos.</li>
        </ul>
    </div>`,
    providers: [ApiService]
})
export class NotificationsWidget implements OnInit {
    licencias: any[] = [];
    mantenimientos: any[] = [];

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getNotificacionesVencimientosSemana().subscribe({
            next: (data) => {
                this.licencias = data.licencias || [];
                this.mantenimientos = data.mantenimientos || [];
            },
            error: () => {
                this.licencias = [];
                this.mantenimientos = [];
            }
        });
    }
}
