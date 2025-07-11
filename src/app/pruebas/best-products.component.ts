import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-best-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 mb-8">
      <h3 class="text-lg font-bold mb-4">Best Selling Products</h3>
      <div *ngFor="let prod of bestProducts" class="flex items-center mb-2">
        <div class="flex-1">
          <div class="font-semibold">{{ prod.nombre }}</div>
          <div class="text-xs text-gray-500">Licencia</div>
        </div>
        <div class="flex-1 flex items-center">
          <div class="w-32 h-2 bg-gray-200 rounded mr-2">
            <div class="h-2 rounded" [ngStyle]="{'width': prod.porcentaje + '%', 'background': prod.color}"></div>
          </div>
          <span [ngStyle]="{'color': prod.color}">%{{ prod.porcentaje }}</span>
        </div>
      </div>
    </div>
  `
})
export class BestProductsComponent {
  @Input() bestProducts: { nombre: string, porcentaje: number, color: string }[] = [];
} 