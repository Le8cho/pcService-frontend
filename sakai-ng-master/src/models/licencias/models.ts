// models/licencias.models.ts

export interface Cliente {
  idCliente: number;
  nombre: string;
  apellido: string;
  celular: string;
  direccion?: string;
  correo?: string;
}

export interface Dispositivo {
  idDispositivo: number;
  idCliente: number;
  tipoDispositivo: string;
  marca: string;
  modelo: string;
}

export interface Operacion {
  idOperacion: number;
  idCliente: number;
  fecha: Date;
  tipoOperacion: string;
  ingreso?: number;
  egreso?: number;
}

export interface Venta {
  idOperacion: number;
  idLicencia: string;
}

export interface Microsoft365 {
  idLicencia: string;
  detalles: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaAviso: Date;
  emailCtaCliente: string;
  passwCtaCliente: string;
  normM365: string;
  userM365: string;
  passM365: string;
}

export interface Windows {
  idLicencia: string;
  detalles: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaAviso: Date;
  tiempoLicencia: string;
  soActivado: string;
  key: string;
  keyTipo: string;
}

export interface Antivirus {
  idLicencia: string;
  detalles: string;
  fechaInicio: Date;
  fechaFin: Date;
  fechaAviso: Date;
  tiempoLicencia: string;
  nombreAntivirus: string;
  userAntivirus: string;
}

// Interfaces para las vistas del componente
export interface LicenciaResumen {
  idLicencia: string;
  tipoLicencia: string;
  fechaAdquisicion: Date;
  totalDispositivos: number;
  disponibilidad: number;
  cliente: string;
  detalles: string;
  fechaVencimiento: Date;
}

export interface FiltroLicencias {
  fechaInicio?: Date;
  fechaFin?: Date;
  totalDispositivos?: number;
  rangoDispositivosMin?: number;
  rangoDispositivosMax?: number;
  disponibilidad?: number;
  rangoDisponibilidadMin?: number;
  rangoDisponibilidadMax?: number;
}

export enum TipoLicencia {
  ANTIVIRUS = 'antivirus',
  OFIMATICA = 'ofimatica',
  SISTEMA_OPERATIVO = 'sistema_operativo'
}