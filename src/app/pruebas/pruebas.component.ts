import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardsComponent } from './kpi-cards.component';
import { BestProductsComponent } from './best-products.component';
import { DwRevenueStreamWidget } from './dw-revenue-stream-widget';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule, KpiCardsComponent, BestProductsComponent, DwRevenueStreamWidget],
  templateUrl: './pruebas.component.html',
  styleUrl: './pruebas.component.scss'
})
export class PruebasComponent implements OnInit {
  clientesMes: number | null = null;
  operacionesMes: number | null = null;
  gananciaMes: number | null = null;
  gananciaPorcentaje: number | null = null;
  mantenimientosMes: number | null = null;

  topClientes = [
    { nombre: '', correo: '', total_gastado: '' },
    { nombre: '', correo: '', total_gastado: '' },
    { nombre: '', correo: '', total_gastado: '' }
  ];

  bestProducts: { nombre: string, porcentaje: number, color: string }[] = [];
  pivotGanancia: any[] = [];
  columnasPivot: string[] = ['SERVICIO', 'MANTENIMIENTO', 'VENTA'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/clientes_mes')
      .subscribe(resp => this.clientesMes = resp.items[0]?.total_clientes ?? null);
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/operaciones_mes')
      .subscribe(resp => this.operacionesMes = resp.items[0]?.total_operaciones ?? null);
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/ganancia_mes')
      .subscribe(resp => this.gananciaMes = resp.items[0]?.ganancia_mes ?? null);
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/ganancia_porcentaje')
      .subscribe(resp => this.gananciaPorcentaje = resp.items[0]?.porcentaje ?? null);
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/total_mantenimientos_mes')
      .subscribe(resp => this.mantenimientosMes = resp.items[0]?.total_mantenimientos ?? null);
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/best_products')
      .subscribe(resp => {
        const colores = ['#ff9800', '#00bcd4', '#9c27b0', '#4caf50', '#e91e63'];
        this.bestProducts = (resp.items || []).map((item: any, i: number) => ({
          nombre: item.tipo_licencia,
          porcentaje: item.cantidad,
          color: colores[i % colores.length]
        }));
      });
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/top_clientes_mes')
      .subscribe(resp => {
        this.topClientes = (resp.items || []).map((item: any) => ({
          nombre: item.nombre,
          correo: item.correo,
          total_gastado: item.total_gastado
        }));
      });
    this.http.get<any>('https://gb77f1bf3fd1479-pcservicedwh.adb.sa-santiago-1.oraclecloudapps.com/ords/pcserviceuser/api_kpi/ganancia_tipo_operacion')
      .subscribe(resp => {
        this.pivotGanancia = resp.items || [];
      });
  }
}
