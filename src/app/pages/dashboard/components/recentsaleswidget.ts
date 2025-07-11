import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ApiService } from '../../../ServiciosSIST/api.service';

@Component({
    standalone: true,
    selector: 'app-recent-sales-widget',
    imports: [CommonModule, TableModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Top Clientes (Mes Actual)</div>
        <p-table [value]="clientes" [paginator]="true" [rows]="5" responsiveLayout="scroll">
            <ng-template pTemplate="header">
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Total Gastado</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-cliente>
                <tr>
                    <td>{{ cliente.nombre }} {{ cliente.apellido }}</td>
                    <td>{{ cliente.correo }}</td>
                    <td>{{ cliente.total_gastado | currency: 'USD' }}</td>
                </tr>
            </ng-template>
        </p-table>
    </div>`,
    providers: [ApiService]
})
export class RecentSalesWidget implements OnInit {
    clientes: any[] = [];

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getTopClientesGastoMes().subscribe({
            next: (data) => this.clientes = data,
            error: () => this.clientes = []
        });
    }
}
