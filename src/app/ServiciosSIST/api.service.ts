import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  LicenciaResumen, 
  FiltroLicencias, 
  TipoLicencia,
  Microsoft365,
  Windows,
  Antivirus 
}  from '../../models/licencias/models';


import { Servicio, ServicioForm } from '../models/servicio.interface';
import { Mantenimiento, MantenimientoForm, Cliente, Dispositivo } from '../models/mantenimiento.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000/api';

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Métodos para gestionar datos de clientes

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
   obtenerLicenciasPorTipo(tipo: TipoLicencia): Observable<LicenciaResumen[]> {
    return this.http.get<LicenciaResumen[]>(`${this.apiUrl}/licencias/${tipo}`);
  }

  // Filtrar licencias por fecha de adquisición
  filtrarPorFechaAdquisicion(tipo: TipoLicencia, filtro: FiltroLicencias): Observable<LicenciaResumen[]> {
    let params = new HttpParams();
    
    if (filtro.fechaInicio) {
      params = params.set('fechaInicio', filtro.fechaInicio.toISOString());
    }
    if (filtro.fechaFin) {
      params = params.set('fechaFin', filtro.fechaFin.toISOString());
    }

    return this.http.get<LicenciaResumen[]>(`${this.apiUrl}/licencias/${tipo}/filtrar-fecha`, { params });
  }

  // Filtrar licencias por total de dispositivos
  filtrarPorTotalDispositivos(tipo: TipoLicencia, filtro: FiltroLicencias): Observable<LicenciaResumen[]> {
    let params = new HttpParams();
    
    if (filtro.totalDispositivos !== undefined) {
      params = params.set('totalDispositivos', filtro.totalDispositivos.toString());
    }
    if (filtro.rangoDispositivosMin !== undefined) {
      params = params.set('rangoMin', filtro.rangoDispositivosMin.toString());
    }
    if (filtro.rangoDispositivosMax !== undefined) {
      params = params.set('rangoMax', filtro.rangoDispositivosMax.toString());
    }

    return this.http.get<LicenciaResumen[]>(`${this.apiUrl}/licencias/${tipo}/filtrar-dispositivos`, { params });
  }

  // Filtrar licencias por disponibilidad
  filtrarPorDisponibilidad(tipo: TipoLicencia, filtro: FiltroLicencias): Observable<LicenciaResumen[]> {
    let params = new HttpParams();
    
    if (filtro.disponibilidad !== undefined) {
      params = params.set('disponibilidad', filtro.disponibilidad.toString());
    }
    if (filtro.rangoDisponibilidadMin !== undefined) {
      params = params.set('rangoMin', filtro.rangoDisponibilidadMin.toString());
    }
    if (filtro.rangoDisponibilidadMax !== undefined) {
      params = params.set('rangoMax', filtro.rangoDisponibilidadMax.toString());
    }

    return this.http.get<LicenciaResumen[]>(`${this.apiUrl}/licencias/${tipo}/filtrar-disponibilidad`, { params });
  }

  // Registrar nuevas licencias
  registrarAntivirus(antivirus: Antivirus): Observable<any> {
    return this.http.post(`${this.apiUrl}/licencias/registrar-antivirus`, antivirus);
  }

  registrarOfimatica(ofimatica: Microsoft365): Observable<any> {
    return this.http.post(`${this.apiUrl}/licencias/registrar-ofimatica`, ofimatica);
  }

  registrarSistemaOperativo(windows: Windows): Observable<any> {
    return this.http.post(`${this.apiUrl}/licencias/registrar-sistema-operativo`, windows);
  }


  // Obtener detalles específicos por tipo de licencia
  obtenerDetallesAntivirus(idLicencia: string): Observable<Antivirus> {
    return this.http.get<Antivirus>(`${this.apiUrl}/licencias/antivirus/${idLicencia}`);
  }

  obtenerDetallesMicrosoft365(idLicencia: string): Observable<Microsoft365> {
    return this.http.get<Microsoft365>(`${this.apiUrl}/licencias/microsoft365/${idLicencia}`);
  }

  obtenerDetallesWindows(idLicencia: string): Observable<Windows> {
    return this.http.get<Windows>(`${this.apiUrl}/licencias/windows/${idLicencia}`);
  }



/*
Servicios de Gestión de Datos Dispositivos
*/

// Obtener todos los dispositivos
getDispositivos(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/dispositivos`);
}

// Crear un nuevo dispositivo
createDispositivo(dispositivo: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/dispositivos`, dispositivo);
}

// Actualizar un dispositivo existente
updateDispositivo(dispositivo: any): Observable<any> {
  return this.http.put(`${this.apiUrl}/dispositivos/${dispositivo.ID_DISPOSITIVO}`, dispositivo);
}

// Eliminar un dispositivo
deleteDispositivo(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/dispositivos/${id}`);
}

/*
Servicios de Gestión de Datos Login
*/

  // Obtener todos los clientes
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientes`);
  }

  // Obtener clientes para dispositivos
  verClienteDispositivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clientesDispositivos`);
  }




// En api.service.ts, agrega estos métodos a la clase ApiService

// Agrega estos métodos a tu ApiService:

  verificarVencimientosLicencias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/licencias/verificar-vencimientos`);
  }

  enviarAlertaManual(idLicencia: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/licencias/enviar-alerta/${idLicencia}`, {});
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
    getClientesServicio(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>('/clientesServicios');
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
      descripcion: mantenimiento.descripcion,
      frecuencia: mantenimiento.frecuencia,
      prox_mantenimiento: mantenimiento.prox_mantenimiento,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'PREVENTIVO',
      ingreso: mantenimiento.ingreso || null,
      egreso: mantenimiento.egreso || null,
      fecha: mantenimiento.fecha,
      id_dispositivo: mantenimiento.id_dispositivo // <-- AGREGADO
    };
    return this.apiService.post<any>('/mantenimientos', payload);
  }

  updateMantenimiento(id: number, mantenimiento: any): Observable<any> {
    const payload = {
      descripcion: mantenimiento.descripcion,
      frecuencia: mantenimiento.frecuencia,
      prox_mantenimiento: mantenimiento.prox_mantenimiento,
      tipo_mantenimiento: mantenimiento.tipo_mantenimiento || 'PREVENTIVO',
      ingreso: mantenimiento.ingreso || null,
      egreso: mantenimiento.egreso || null,
      fecha: mantenimiento.fecha,
      id_dispositivo: mantenimiento.id_dispositivo // <-- AGREGADO
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
  getClientesMantenimiento(): Observable<Cliente[]> {
    return this.apiService.get<Cliente[]>('/clientesMantenimiento');
  }
  getDispositivosByCliente(clienteId: number): Observable<Dispositivo[]> {
    return this.apiService.get<Dispositivo[]>(`/dispositivo/cliente/${clienteId}`);
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


 