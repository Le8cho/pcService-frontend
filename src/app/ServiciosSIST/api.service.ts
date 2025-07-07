import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Servicio, ServicioForm, Cliente } from '../models/servicio.interface';
import { Mantenimiento, MantenimientoForm, Cliente, Dispositivo } from '../models/mantenimiento.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000/api';

  constructor(private http: HttpClient) { }

  // Métodos base para HTTP que pueden usar otros servicios
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { params });
  }


  post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}


/*
Servicios de Gestión de Datos Clientes
*/


/*
Servicios de Gestión de Datos Servicios
*/
@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  constructor(private apiService: ApiService) { }

  // CRUD Servicios
  getServicios(): Observable<Servicio[]> {
    return this.apiService.get<Servicio[]>('/servicios');
  }

  createServicio(servicio: any): Observable<any> {
    const payload = {
      id_cliente: servicio.id_cliente,
      detalle: servicio.detalle || servicio.descripcion,
      tecnico_encargado: servicio.tecnico_encargado || servicio.tecnico,
      duracion_estimada: servicio.duracion_estimada || servicio.duracion,
      ingreso: servicio.ingreso || null,
      egreso: servicio.egreso || null,
      fecha: servicio.fecha ? 
        this.formatDateForBackend(servicio.fecha) : null
    };
    return this.apiService.post<any>('/servicios', payload);
  }

  updateServicio(id: number, servicio: any): Observable<any> {
    const payload = {
      detalle: servicio.detalle || servicio.descripcion,
      tecnico_encargado: servicio.tecnico_encargado || servicio.tecnico,
      duracion_estimada: servicio.duracion_estimada || servicio.duracion,
      ingreso: servicio.ingreso || null,
      egreso: servicio.egreso || null,
      fecha: servicio.fecha ? 
        this.formatDateForBackend(servicio.fecha) : null
    };
    return this.apiService.put<any>(`/servicios/${id}`, payload);
  }

  deleteServicio(id: number): Observable<any> {
    return this.apiService.delete<any>(`/servicios/${id}`);
  }

  // Búsqueda
  searchServicios(term: string): Observable<Servicio[]> {
    const params = new HttpParams().set('search', term);
    return this.apiService.get<Servicio[]>('/servicios/search', params);
  }
  
  // Datos relacionados
  getClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>('/clientes');
  }

  // Helper para formatear fechas
  private formatDateForBackend(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString(); // Envía en formato ISO 8601
    }
    return date;
  }
  
  // Helper para generar código de cliente
  generateClienteCode(id: number): string {
    return `C${id.toString().padStart(4, '0')}`;
  }
}

/*
Servicios de Gestión de Datos Mantenimiento
*/
@Injectable({
  providedIn: 'root'
})
export class MantenimientoService {
  constructor(private apiService: ApiService) { }

  // CRUD Mantenimientos
  getMantenimientos(): Observable<Mantenimiento[]> {
    return this.apiService.get<Mantenimiento[]>('/mantenimientos');
  }

  getMantenimientoById(id: number): Observable<Mantenimiento> {
    return this.apiService.get<Mantenimiento>(`/mantenimientos/${id}`);
  }

  createMantenimiento(mantenimiento: any): Observable<any> {
    const payload = {
      id_cliente: mantenimiento.id_cliente,
      descripcion: mantenimiento.equipos || mantenimiento.descripcion,
      frecuencia: mantenimiento.frecuencia,
      prox_mantenimiento: mantenimiento.prox_fecha ? 
        this.formatDateForBackend(mantenimiento.prox_fecha) : null,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'PREVENTIVO',
      ingreso: mantenimiento.ingreso || null,
      egreso: mantenimiento.egreso || null,
      fecha: mantenimiento.fecha_mantenimiento ? 
        this.formatDateForBackend(mantenimiento.fecha_mantenimiento) : null
    };
    return this.apiService.post<any>('/mantenimientos', payload);
  }


  updateMantenimiento(id: number, mantenimiento: any): Observable<any> {
    const payload = {
      descripcion: mantenimiento.equipos || mantenimiento.descripcion,
      frecuencia: mantenimiento.frecuencia,
      prox_mantenimiento: mantenimiento.prox_fecha ? 
        this.formatDateForBackend(mantenimiento.prox_fecha) : null,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'PREVENTIVO',
      ingreso: mantenimiento.ingreso || null,
      egreso: mantenimiento.egreso || null,
      fecha: mantenimiento.fecha_mantenimiento ? 
        this.formatDateForBackend(mantenimiento.fecha_mantenimiento) : null
    };
    return this.apiService.put<any>(`/mantenimientos/${id}`, payload);
  }

  deleteMantenimiento(id: number): Observable<any> {
    return this.apiService.delete<any>(`/mantenimientos/${id}`);
  }

  // Búsquedas y filtros
  searchMantenimientos(term: string): Observable<Mantenimiento[]> {
    const params = new HttpParams().set('search', term);
    return this.apiService.get<Mantenimiento[]>('/mantenimientos/search', params);
  }

  getMantenimientosProximosVencer(dias: number = 7): Observable<Mantenimiento[]> {
    const params = new HttpParams().set('dias', dias.toString());
    return this.apiService.get<Mantenimiento[]>('/mantenimientos/proximos-vencer', params);
  }

  // Métodos auxiliares para obtener datos relacionados
  getClientes(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>('/clientes');
  }

  getDispositivosByCliente(clienteId: number): Observable<Dispositivo[]> {
    return this.apiService.get<Dispositivo[]>(`/dispositivos/cliente/${clienteId}`);
  }

  // Método helper para formatear fechas
  private formatDateForBackend(date: Date | string): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    }
    return date;
  }

  // Método helper para convertir cliente ID desde código (CL001 -> 1)
  extractClienteId(codCliente: string): number {
    if (codCliente && codCliente.startsWith('CL')) {
      return parseInt(codCliente.substring(2));
    }
    return parseInt(codCliente) || 0;
  }

  // Método helper para generar código de cliente (1 -> CL001)
  generateClienteCode(id: number): string {
    return `CL${id.toString().padStart(3, '0')}`;
  }
}
/*
Servicios de Gestión de Datos Licencias

*/


/*
Servicios de Gestión de Datos Dispositivos
*/


/*
Servicios de Gestión de Datos Login
*/