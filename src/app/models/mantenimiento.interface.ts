// models/cliente.model.ts
export interface Cliente {
    id_cliente?: number;
    nombre: string;
    apellido: string;
    celular: string;
    direccion?: string;
    correo?: string;
}

// models/dispositivo.model.ts
export interface Dispositivo {
    id_dispositivo?: number;
    id_cliente: number;
    tipo_dispositivo?: string;
    marca?: string;
    modelo?: string;
}

// models/mantenimiento.model.ts
export interface Mantenimiento {
    // Campos de OPERACIONES (herencia)
    id_operacion?: number;
    id_cliente: number;
    fecha?: string; // Fecha del mantenimiento
    tipo_operacion: 'MANTENIMIENTO';
    ingreso?: number;
    egreso?: number;
    
    // Campos específicos de MANTENIMIENTOS
    descripcion?: string;
    frecuencia?: string;
    prox_mantenimiento?: string; // Próxima fecha
    tipo_mantenimiento?: string;
    
    // Campos adicionales para la vista (joins)
    mantPrev?: string; // ID de mantenimiento para mostrar (ej: MP001)
    cod_cliente?: string; // Código del cliente para mostrar
    nombre_cliente?: string; // Nombre completo del cliente
    equipos?: string; // Descripción de equipos para mostrar
}

// models/mantenimiento-form.model.ts
export interface MantenimientoForm {
    mantPrev: string;
    cod_cliente: string;
    fecha_mantenimiento: Date;
    equipos: string;
    ingreso: number;
    egreso: number;
    frecuencia: string;
    prox_fecha: Date;
}

// models/mantenimiento-dispositivo.model.ts
export interface MantenimientoDispositivo {
    id_mantenimiento_disp?: number;
    id_operacion: number;
    id_dispositivo: number;
}