export interface MantenimientoDispositivo {
    id_mantenimiento_disp?: number;
    id_operacion: number; // FK a MANTENIMIENTOS
    id_dispositivo: number; // FK a DISPOSITIVOS
}