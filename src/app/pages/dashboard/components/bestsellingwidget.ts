import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { ApiService } from '../../../ServiciosSIST/api.service';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: ` <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Best Selling Products</div>
        </div>
        <ul class="list-none p-0 m-0">
            <li *ngFor="let lic of licencias; let i = index" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">{{ lic.nombre }}</span>
                    <div class="mt-1 text-muted-color">Licencia</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div [ngClass]="getBarColor(i)" class="h-full" [style.width.%]="lic.porcentaje"></div>
                    </div>
                    <span [ngClass]="getTextColor(i)" class="ml-4 font-medium">%{{ lic.porcentaje }}</span>
                </div>
            </li>
        </ul>
    </div>`,
    providers: [ApiService]
})
export class BestSellingWidget implements OnInit {
    licencias: any[] = [];

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getPorcentajeVentasLicenciasMes().subscribe({
            next: (data) => this.licencias = data,
            error: () => this.licencias = []
        });
    }

    getBarColor(i: number): string {
        // Colores distintos para cada barra
        return [
            'bg-orange-500', // Antivirus
            'bg-cyan-500',   // Microsoft 365
            'bg-purple-500'  // Windows
        ][i] || 'bg-primary';
    }
    getTextColor(i: number): string {
        return [
            'text-orange-500',
            'text-cyan-500',
            'text-purple-500'
        ][i] || 'text-primary';
    }
}
