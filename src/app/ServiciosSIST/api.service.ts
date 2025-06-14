import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Servicio, ServicioForm, Cliente } from '../models/servicio.interface';
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


/*
Servicios de Gestión de Datos Licencias

*/


/*
Servicios de Gestión de Datos Dispositivos
*/


/*
Servicios de Gestión de Datos Login
*/