import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { ApiService } from '../../../ServiciosSIST/api.service';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [ChartModule],
    template: `<div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Ingresos por Tipo de Operación (Últimos 4 meses)</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`,
    providers: [ApiService]
})
export class RevenueStreamWidget implements OnInit, OnDestroy {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    constructor(public layoutService: LayoutService, private apiService: ApiService) {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.apiService.getIngresosUltimos4Meses().subscribe({
            next: (data) => this.setChartData(data),
            error: () => this.setChartData(null)
        });
    }

    setChartData(data: any) {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        if (!data) {
            this.chartData = { labels: [], datasets: [] };
            return;
        }
        this.chartData = {
            labels: data.meses,
            datasets: [
                {
                    type: 'bar',
                    label: 'Venta',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                    data: data.ingresos.VENTA,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Mantenimiento',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                    data: data.ingresos.MANTENIMIENTO,
                    barThickness: 32
                },
                {
                    type: 'bar',
                    label: 'Servicio',
                    backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
                    data: data.ingresos.SERVICIO,
                    borderRadius: {
                        topLeft: 8,
                        topRight: 8,
                        bottomLeft: 0,
                        bottomRight: 0
                    },
                    borderSkipped: false,
                    barThickness: 32
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: textColor
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: 'transparent',
                        borderColor: 'transparent'
                    }
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: textMutedColor
                    },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    initChart() {
        // Se inicializa con datos reales en loadData()
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
