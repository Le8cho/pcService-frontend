import { Component, OnInit } from '@angular/core';
import { NotificationsWidget } from '../pages/dashboard/components/notificationswidget';
import { StatsWidget } from '../pages/dashboard/components/statswidget';
import { RecentSalesWidget } from '../pages/dashboard/components/recentsaleswidget';
import { BestSellingWidget } from '../pages/dashboard/components/bestsellingwidget';
import { RevenueStreamWidget } from '../pages/dashboard/components/revenuestreamwidget';
import { ApiService } from '../ServiciosSIST/api.service';

@Component({
    selector: 'app-estadistico',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <app-stats-widget class="contents"
                [clientesMes]="clientesMes"
                [operacionesMes]="operacionesMes"
                [gananciaMes]="gananciaMes"
                [gananciaPorcentaje]="gananciaPorcentaje"
                [mantenimientosMes]="mantenimientosMes"
            />
            <div class="col-span-12 xl:col-span-6">
                <app-recent-sales-widget />
                <app-best-selling-widget />
            </div>
            <div class="col-span-12 xl:col-span-6">
                <app-revenue-stream-widget />
                <app-notifications-widget />
            </div>
        </div>
    `,
    providers: [ApiService]
})
export class EstadisticoComponent implements OnInit {
  clientesMes: number | null = null;
  operacionesMes: number | null = null;
  gananciaMes: number | null = null;
  gananciaPorcentaje: number | null = null;
  mantenimientosMes: number | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getEstadisticasMes().subscribe({
      next: (data) => {
        this.clientesMes = data.clientesMes ?? null;
        this.operacionesMes = data.operacionesMes ?? null;
        this.gananciaMes = data.gananciaMes ?? null;
      },
      error: (err) => {
        this.clientesMes = this.operacionesMes = this.gananciaMes = null;
      }
    });
    this.apiService.getGananciaMesVsAnterior().subscribe({
      next: (data) => {
        this.gananciaPorcentaje = data.porcentaje ?? null;
      },
      error: () => {
        this.gananciaPorcentaje = null;
      }
    });
    this.apiService.getMantenimientosMes().subscribe({
      next: (data) => {
        this.mantenimientosMes = data.mantenimientosMes ?? null;
      },
      error: () => {
        this.mantenimientosMes = null;
      }
    });
  }
}
