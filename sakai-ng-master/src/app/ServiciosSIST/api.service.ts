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


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  // Métodos para gestionar datos de clientes



/*
Servicios de Gestión de Datos Clientes
*/


/*
Servicios de Gestión de Datos Servicios
*/

/*
Servicios de Gestión de Datos Mantenimiento
*/

/*
Servicios de Gestión de Datos Licencias
*/

  // Obtener licencias por tipo
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

  // Registrar nueva licencia
 registrarAntivirus(antivirus: Antivirus): Observable<any> {
  return this.http.post(`${this.apiUrl}/licencias/registrar-antivirus`, antivirus);
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

}