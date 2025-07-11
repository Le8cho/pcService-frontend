import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-12 gap-6 mb-8">
      <div class="col-span-12 md:col-span-3">
        <div class="card p-4 flex flex-col gap-2">
          <div class="text-gray-500">Clientes este mes</div>
          <div class="text-3xl font-bold">{{ clientesMes }}</div>
          <div class="text-green-600">Operaciones en el mes</div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-3">
        <div class="card p-4 flex flex-col gap-2">
          <div class="text-gray-500">Operaciones este mes</div>
          <div class="text-3xl font-bold">{{ operacionesMes }}</div>
          <div class="text-green-600">Total en el mes</div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-3">
        <div class="card p-4 flex flex-col gap-2">
          <div class="text-gray-500">Ganancia este mes</div>
          <div class="text-3xl font-bold">{{ gananciaMes }}</div>
          <div class="text-green-600">+{{ gananciaPorcentaje }}% respecto al mes anterior</div>
          <div class="text-green-600">Total en el mes</div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-3">
        <div class="card p-4 flex flex-col gap-2">
          <div class="text-gray-500">Mantenimientos este mes</div>
          <div class="text-3xl font-bold">{{ mantenimientosMes }}</div>
          <div class="text-green-600">Total en el mes</div>
        </div>
      </div>
    </div>
  `
})
export class KpiCardsComponent {
  @Input() clientesMes: number | null = null;
  @Input() operacionesMes: number | null = null;
  @Input() gananciaMes: number | null = null;
  @Input() gananciaPorcentaje: number | null = null;
  @Input() mantenimientosMes: number | null = null;
} 