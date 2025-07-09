// models/gestion-servicios.interface.ts

// Interfaz para los datos que vienen del backend
export interface Servicio {
    id_operacion: number;
    id_servicio: string; // Ej: SV001
    cliente: string;
    detalle: string;
    tecnico_encargado: string; // <<< AÑADIDO
    duracion_estimada: string; // <<< AÑADIDO
    fecha: string; // Fecha en formato ISO (YYYY-MM-DDTHH:mm:ss)
    ingreso: number;
    egreso: number;
    id_cliente: number;
}

// Interfaz para el formulario de creación/edición
export interface ServicioForm {
    id_cliente: number | null; // ID numérico para el dropdown
    fecha: Date;
    detalle: string;
    tecnico_encargado: string; // <<< AÑADIDO
    duracion_estimada: string; // <<< AÑADIDO
    ingreso: number;
    egreso: number;
}

// Interfaz para la lista de clientes del dropdown
export interface Cliente {
    id_cliente: number;
    nombre: string;
    apellido: string;
}