import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';      // ✅ para pipe date
import { FormsModule } from '@angular/forms';        // ✅ para ngModel
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';         // ✅ para p-table
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ApiService } from '../ServiciosSIST/api.service';
import { CalendarModule } from 'primeng/calendar';

import {
  LicenciaResumen,
  FiltroLicencias,
  TipoLicencia,
  Microsoft365,
  Windows,
  Antivirus,
  Cliente
} from '../../models/licencias/models';

@Component({
  selector: 'app-gestion-datos-licencias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    DropdownModule,
    DialogModule,
    ButtonModule,
    TagModule,
    TableModule,
    CalendarModule
  ],
  providers: [MessageService],  // ✅ agrega esto aquí
  templateUrl: './gestion-datos-licencias.component.html',
  
  styleUrls: ['./gestion-datos-licencias.component.scss']
})
export class GestionDatosLicenciasComponent implements OnInit {
  // Variables principales
  tipoLicenciaSeleccionado: string = '';
  licencias: LicenciaResumen[] = [];
  cargando: boolean = false;
  licenciasFiltradas: LicenciaResumen[] = [];
  
  // Variables para filtros
  mostrarOpcionesFiltro: boolean = false;
  filtroActual: FiltroLicencias = {};
  
  // Variables para diálogos de filtro
  mostrarDialogoFiltroFecha: boolean = false;
  mostrarDialogoFiltroDispositivos: boolean = false;
  mostrarDialogoFiltroDisponibilidad: boolean = false;
  
  // Variables para filtro de fecha
  tipoFiltroFecha: string = '';
  filtroFechaExacta: Date | null = null;
  filtroFechaInicio: Date | null = null;
  filtroFechaFin: Date | null = null;
  
  // Variables para filtro de dispositivos
  tipoFiltroDispositivos: string = '';
  filtroDispositivosExacto: number | null = null;
  filtroDispositivosMin: number | null = null;
  filtroDispositivosMax: number | null = null;
  
  // Variables para filtro de disponibilidad
  tipoFiltroDisponibilidad: string = '';
  filtroDisponibilidadExacta: number | null = null;
  filtroDisponibilidadMin: number | null = null;
  filtroDisponibilidadMax: number | null = null;
  
  // Opciones para dropdowns
  opcionesTipoFiltroFecha = [
    { label: 'Fecha exacta', value: 'exacta' },
    { label: 'Rango de fechas', value: 'rango' }
  ];
  
  opcionesTipoFiltroNumerico = [
    { label: 'Valor exacto', value: 'exacto' },
    { label: 'Rango de valores', value: 'rango' }
  ];

  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  dispositivosCliente: any[] = [];
  dispositivoSeleccionado: any = null;

  constructor(
    private licenciasService: ApiService,
    private messageService: MessageService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
  console.log('⚡ Componente GestionDatosLicenciasComponent inicializado');
  this.cargarClientes();
}

  seleccionarTipoLicencia(tipo: string): void {
    this.tipoLicenciaSeleccionado = tipo;
    this.limpiarFiltros();
    this.cargarLicencias();
  }

  cargarLicencias(): void {
    if (!this.tipoLicenciaSeleccionado) return;
    
    this.cargando = true;
    const tipoLicencia = this.tipoLicenciaSeleccionado as TipoLicencia;
    
    this.licenciasService.obtenerLicenciasPorTipo(tipoLicencia).subscribe({
      next: (licencias) => {
        this.licencias = licencias;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar licencias:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las licencias'
        });
        this.cargando = false;
      }
    });
  }

  obtenerNombreTipoLicencia(): string {
    switch (this.tipoLicenciaSeleccionado) {
      case 'antivirus':
        return 'Antivirus';
      case 'ofimatica':
        return 'Ofimática (M365)';
      case 'sistema_operativo':
        return 'Sistemas Operativos (Windows)';
      default:
        return '';
    }
  }

  // Métodos para mostrar diálogos de filtro
  mostrarFiltroFecha(): void {
    this.resetearFiltroFecha();
    this.mostrarDialogoFiltroFecha = true;
  }

  mostrarFiltroDispositivos(): void {
    this.resetearFiltroDispositivos();
    this.mostrarDialogoFiltroDispositivos = true;
  }

  mostrarFiltroDisponibilidad(): void {
    this.resetearFiltroDisponibilidad();
    this.mostrarDialogoFiltroDisponibilidad = true;
  }

  // Métodos para aplicar filtros
  aplicarFiltroFecha(): void {
    if (!this.tipoFiltroFecha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un tipo de filtro'
      });
      return;
    }
    let filtradas = this.licencias;
    if (this.tipoFiltroFecha === 'exacta' && this.filtroFechaExacta) {
      const fecha = this.filtroFechaExacta instanceof Date ? this.filtroFechaExacta : new Date(this.filtroFechaExacta);
      filtradas = filtradas.filter(l => {
        const licDate = new Date(l.fechaAdquisicion);
        return licDate.toDateString() === fecha.toDateString();
      });
    } else if (this.tipoFiltroFecha === 'rango' && this.filtroFechaInicio && this.filtroFechaFin) {
      const inicio = this.filtroFechaInicio instanceof Date ? this.filtroFechaInicio : new Date(this.filtroFechaInicio);
      const fin = this.filtroFechaFin instanceof Date ? this.filtroFechaFin : new Date(this.filtroFechaFin);
      filtradas = filtradas.filter(l => {
        const licDate = new Date(l.fechaAdquisicion);
        return licDate >= inicio && licDate <= fin;
      });
    }
    this.licencias = filtradas;
    this.mostrarDialogoFiltroFecha = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Filtro aplicado',
      detail: `Se encontraron ${filtradas.length} registros.`
    });
  }

  aplicarFiltroDispositivos(): void {
    if (!this.tipoFiltroDispositivos) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un tipo de filtro'
      });
      return;
    }

    const filtro: FiltroLicencias = {};
    
    if (this.tipoFiltroDispositivos === 'exacto' && this.filtroDispositivosExacto !== null) {
      filtro.totalDispositivos = this.filtroDispositivosExacto;
    } else if (this.tipoFiltroDispositivos === 'rango') {
      if (this.filtroDispositivosMin !== null) filtro.rangoDispositivosMin = this.filtroDispositivosMin;
      if (this.filtroDispositivosMax !== null) filtro.rangoDispositivosMax = this.filtroDispositivosMax;
    }

    this.aplicarFiltroGenerico(filtro, 'dispositivos');
    this.mostrarDialogoFiltroDispositivos = false;
  }

  aplicarFiltroDisponibilidad(): void {
    if (!this.tipoFiltroDisponibilidad) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Seleccione un tipo de filtro'
      });
      return;
    }

    const filtro: FiltroLicencias = {};
    
    if (this.tipoFiltroDisponibilidad === 'exacto' && this.filtroDisponibilidadExacta !== null) {
      filtro.disponibilidad = this.filtroDisponibilidadExacta;
    } else if (this.tipoFiltroDisponibilidad === 'rango') {
      if (this.filtroDisponibilidadMin !== null) filtro.rangoDisponibilidadMin = this.filtroDisponibilidadMin;
      if (this.filtroDisponibilidadMax !== null) filtro.rangoDisponibilidadMax = this.filtroDisponibilidadMax;
    }

    this.aplicarFiltroGenerico(filtro, 'disponibilidad');
    this.mostrarDialogoFiltroDisponibilidad = false;
  }

  aplicarFiltroGenerico(filtro: FiltroLicencias, tipoFiltro: string): void {
    if (!this.tipoLicenciaSeleccionado) return;
    
    this.cargando = true;
    const tipoLicencia = this.tipoLicenciaSeleccionado as TipoLicencia;
    
    let observable;
    
    switch (tipoFiltro) {
      case 'fecha':
        observable = this.licenciasService.filtrarPorFechaAdquisicion(tipoLicencia, filtro);
        break;
      case 'dispositivos':
        observable = this.licenciasService.filtrarPorTotalDispositivos(tipoLicencia, filtro);
        break;
      case 'disponibilidad':
        observable = this.licenciasService.filtrarPorDisponibilidad(tipoLicencia, filtro);
        break;
      default:
        this.cargando = false;
        return;
    }
    
    observable.subscribe({
      next: (licencias) => {
        this.licencias = licencias;
        this.filtroActual = filtro;
        this.cargando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Filtro aplicado. Se encontraron ${licencias.length} registros`
        });
      },
      error: (error) => {
        console.error('Error al aplicar filtro:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo aplicar el filtro'
        });
        this.cargando = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.filtroActual = {};
    this.mostrarOpcionesFiltro = false;
    this.resetearTodosFiltros();
    this.cargarLicencias();
  }

  // Métodos para resetear filtros
  resetearFiltroFecha(): void {
    this.tipoFiltroFecha = '';
    this.filtroFechaExacta = null;
    this.filtroFechaInicio = null;
    this.filtroFechaFin = null;
  }

  resetearFiltroDispositivos(): void {
    this.tipoFiltroDispositivos = '';
    this.filtroDispositivosExacto = null;
    this.filtroDispositivosMin = null;
    this.filtroDispositivosMax = null;
  }

  resetearFiltroDisponibilidad(): void {
    this.tipoFiltroDisponibilidad = '';
    this.filtroDisponibilidadExacta = null;
    this.filtroDisponibilidadMin = null;
    this.filtroDisponibilidadMax = null;
  }

  resetearTodosFiltros(): void {
    this.resetearFiltroFecha();
    this.resetearFiltroDispositivos();
    this.resetearFiltroDisponibilidad();
  }

  // Métodos auxiliares
  obtenerSeveridadDisponibilidad(disponibilidad: number): string {
    if (disponibilidad === 0) return 'danger';
    if (disponibilidad <= 5) return 'warning';
    return 'success';
  }

  verDetalles(licencia: LicenciaResumen): void {
    // Implementar lógica para ver detalles de la licencia
    console.log('Ver detalles de licencia:', licencia);
    this.messageService.add({
      severity: 'info',
      summary: 'Información',
      detail: `Mostrando detalles de licencia ${licencia.idLicencia}`
    });
  }


registroLicenciaDialog: boolean = false;
nuevaLicencia: any = {}; // Puedes tipar mejor según el tipo de licencia

  cargarClientes(): void {
    this.apiService.getClientes().subscribe(data => {
      // Normaliza los nombres de las propiedades y crea un campo para mostrar en el dropdown
      this.clientes = data.map((c: any) => ({
        ...c,
        idCliente: c.ID_CLIENTE ?? c.idCliente ?? null,
        displayName: (c.NOMBRE || c.nombre || '') + ' ' + (c.APELLIDO || c.apellido || '')
      }));
    });
  }


onClienteChange(cliente: any) {
  this.clienteSeleccionado = cliente;
  this.dispositivoSeleccionado = null;
  this.dispositivosCliente = [];
  const idCliente = cliente?.idCliente ?? cliente?.ID_CLIENTE;
  if (idCliente) {
    this.apiService.getDispositivos().subscribe(dispositivos => {
      this.dispositivosCliente = dispositivos.filter(d =>
        d.ID_CLIENTE == idCliente || d.idCliente == idCliente
      );
    });
  }
}



MostrarRegistro(): void {
  // Inicializa la nueva licencia con la fecha actual y tiempo por defecto
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = (hoy.getMonth() + 1).toString().padStart(2, '0');
  const dd = hoy.getDate().toString().padStart(2, '0');
  const fechaActual = `${yyyy}-${mm}-${dd}`;
  this.nuevaLicencia = {
    fechaInicio: fechaActual,
    tiempoLicencia: '1a',
    fechaFin: '',
    fechaAviso: '',
    idCliente: null,
    ingreso: null, // Nuevo campo
    egreso: null   // Nuevo campo
  };
  this.clienteSeleccionado = null;
  this.recalcularFechaFin();
  this.registroLicenciaDialog = true;
}

recalcularFechaFin(): void {
  if (!this.nuevaLicencia.fechaInicio || !this.nuevaLicencia.tiempoLicencia) return;
  const inicio = new Date(this.nuevaLicencia.fechaInicio);
  let fin = new Date(inicio);
  switch (this.nuevaLicencia.tiempoLicencia) {
    case '6m':
      fin.setMonth(fin.getMonth() + 6);
      break;
    case '1a':
      fin.setFullYear(fin.getFullYear() + 1);
      break;
    case '2a':
      fin.setFullYear(fin.getFullYear() + 2);
      break;
    case '3a':
      fin.setFullYear(fin.getFullYear() + 3);
      break;
  }
  // Formatea la fecha a yyyy-MM-dd
  const yyyy = fin.getFullYear();
  const mm = (fin.getMonth() + 1).toString().padStart(2, '0');
  const dd = fin.getDate().toString().padStart(2, '0');
  this.nuevaLicencia.fechaFin = `${yyyy}-${mm}-${dd}`;
}

guardarLicencia(): void {
  // Asignar idCliente y idDispositivo
  this.nuevaLicencia.idCliente = this.clienteSeleccionado?.idCliente ?? null;
  this.nuevaLicencia.idDispositivo = this.dispositivoSeleccionado?.ID_DISPOSITIVO ?? null;

  console.log('DEBUG: Datos a enviar en nuevaLicencia:', this.nuevaLicencia);

  // Seleccionar el método de registro según el tipo de licencia
  let registroObservable;

  switch (this.tipoLicenciaSeleccionado) {
    case 'antivirus':
      registroObservable = this.licenciasService.registrarAntivirus(this.nuevaLicencia);
      break;
    case 'ofimatica':
      registroObservable = this.licenciasService.registrarOfimatica(this.nuevaLicencia);
      break;
    case 'sistema_operativo':
      registroObservable = this.licenciasService.registrarSistemaOperativo(this.nuevaLicencia);
      break;
    default:
      console.error('Tipo de licencia no válido');
      return;
  }

  // Realizar el registro
  registroObservable.subscribe({
    next: (resp) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: `Licencia ${this.obtenerNombreTipoLicencia()} registrada`
      });
      this.registroLicenciaDialog = false;
      this.cargarLicencias();
    },
    error: (err) => {
      console.error('Error al registrar licencia:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo registrar la licencia'
      });
    }
  });
}
// Agrega estos nuevos métodos a tu clase, justo antes del último cierre de llave (})
verificarVencimientos(): void {
  this.cargando = true;
  this.licenciasService.verificarVencimientosLicencias().subscribe({
    next: (resultado) => {
      this.messageService.add({
        severity: 'success',
        summary: 'Verificación completada',
        detail: `Se verificaron ${resultado.totalLicencias} licencias próximas a vencer`
      });
      this.cargando = false;
    },
    error: (error) => {
      console.error('Error al verificar vencimientos:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudieron verificar las licencias'
      });
      this.cargando = false;
    }
  });
}

  enviarAlerta(licencia: LicenciaResumen): void {
    this.cargando = true;
    this.licenciasService.enviarAlertaManual(licencia.idLicencia).subscribe({
      next: (resultado) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Alerta enviada',
          detail: `Se envió correo a ${resultado.cliente}`
        });
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al enviar alerta:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo enviar la alerta'
        });
        this.cargando = false;
      }
    });
  }
}
