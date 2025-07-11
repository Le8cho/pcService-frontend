import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    template: `<div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Clientes este mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ clientesMes ?? '-' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <div><span class="text-primary font-medium">Nuevos  </span> <span class="text-muted-color">en el mes</span></div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Operaciones este mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ operacionesMes ?? '-' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <div><span class="text-primary font-medium">Total  </span> <span class="text-muted-color">en el mes</span></div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Ganancia este mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ gananciaMes ?? '-' }}</div>
                        <div *ngIf="gananciaPorcentaje !== null" [ngClass]="gananciaPorcentaje >= 0 ? 'text-green-500' : 'text-red-500'" class="font-medium text-sm mt-1">
                          {{ gananciaPorcentaje >= 0 ? '+' : ''}}{{ gananciaPorcentaje }}% respecto al mes anterior
                        </div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-dollar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <div><span class="text-primary font-medium">Total  </span> <span class="text-muted-color">en el mes</span></div>
            </div>
        </div>
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Mantenimientos este mes</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ mantenimientosMes ?? '-' }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-wrench text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <div><span class="text-primary font-medium">Total  </span><span class="text-muted-color">en el mes</span></div>
            </div>
        </div>`
})
export class StatsWidget {
  @Input() clientesMes: number | null = null;
  @Input() operacionesMes: number | null = null;
  @Input() gananciaMes: number | null = null;
  @Input() gananciaPorcentaje: number | null = null;
  @Input() mantenimientosMes: number | null = null;
}
