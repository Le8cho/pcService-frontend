// models/mantenimiento.interface.ts

// Modelo base para Cliente
export interface Cliente {
    id_cliente?: number;
    nombre: string;
    apellido: string;
    celular: string;
    direccion?: string;
    correo?: string;
}

// Modelo base para Dispositivo
export interface Dispositivo {
    id_dispositivo?: number;
    id_cliente: number;
    tipo_dispositivo?: string;
    marca?: string;
    modelo?: string;
}

// Modelo principal de Mantenimiento (lo que devuelve el backend)
export interface Mantenimiento {
    // Campos de OPERACIONES (herencia)
    id_operacion?: number;
    id_cliente: number;
    fecha?: string; // Fecha del mantenimiento en formato ISO
    tipo_operacion: 'MANTENIMIENTO';
    ingreso?: number;
    egreso?: number;
    
    // Campos específicos de MANTENIMIENTOS
    descripcion?: string;
    frecuencia?: string;
    prox_mantenimiento?: string; // Próxima fecha en formato ISO
    tipo_mantenimiento?: string;
    
    // Campos adicionales para la vista (joins con otras tablas)
    mant_prev?: string; // ID de mantenimiento para mostrar (ej: MP001)
    cod_cliente?: string; // Código del cliente para mostrar (ej: CL001)
    nombre_cliente?: string; // Nombre completo del cliente
    equipos?: string; // Descripción de equipos para mostrar
}

// Modelo para el formulario (lo que usa el componente internamente)
export interface MantenimientoForm {
    mantPrev: string; // Solo para mostrar, se genera automáticamente
    cod_cliente: number; // ID numérico del cliente para el dropdown
    fecha_mantenimiento: Date;
    equipos: string;
    ingreso: number;
    egreso: number;
    frecuencia: string;
    prox_fecha: Date;
    descripcion: string; // Descripción del mantenimiento
}

// Modelo para crear un nuevo mantenimiento (payload al backend)
export interface CreateMantenimientoRequest {
    id_cliente: number;
    descripcion: string;
    frecuencia: string;
    prox_mantenimiento?: string; // Fecha en formato YYYY-MM-DD
    tipo_mantenimiento?: string;
    ingreso?: number;
    egreso?: number;
    fecha?: string; // Fecha en formato YYYY-MM-DD
}

// Modelo para actualizar un mantenimiento existente
export interface UpdateMantenimientoRequest {
    descripcion?: string;
    frecuencia?: string;
    prox_mantenimiento?: string;
    tipo_mantenimiento?: string;
    ingreso?: number;
    egreso?: number;
    fecha?: string;
}

// Modelo para la relación many-to-many Mantenimiento-Dispositivo
export interface MantenimientoDispositivo {
    id_mantenimiento_disp?: number;
    id_operacion: number; // FK a MANTENIMIENTOS
    id_dispositivo: number; // FK a DISPOSITIVOS
}

// Enums para mayor type safety
export enum TipoMantenimiento {
    PREVENTIVO = 'PREVENTIVO',
    CORRECTIVO = 'CORRECTIVO',
    PREDICTIVO = 'PREDICTIVO'
}

export enum FrecuenciaMantenimiento {
    MENSUAL = 'Mensual',
    BIMESTRAL = 'Bimestral',
    TRIMESTRAL = 'Trimestral',
    SEMESTRAL = 'Semestral',
    ANUAL = 'Anual'
}