
// gestion-datos-mantenimiento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

import { Mantenimiento, MantenimientoForm, Cliente } from '../models/mantenimiento.interface';
import { MantenimientoService } from '../ServiciosSIST/api.service';

@Component({
    selector: 'app-gestion-datos-mantenimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        TableModule,
        ToastModule,
        CalendarModule,
        DialogModule,
        ButtonModule,
        DropdownModule,
        InputTextModule,
        ToolbarModule,
        ConfirmDialogModule,
        TooltipModule,
        RippleModule
    ],
    templateUrl: './gestion-datos-mantenimiento.component.html',
    styleUrls: ['./gestion-datos-mantenimiento.component.scss'],
    providers: [MessageService, ConfirmationService, MantenimientoService]
})
export class GestionDatosMantenimientoComponent implements OnInit {

    mantenimientos: Mantenimiento[] = [];
    clientes: Cliente[] = [];
    mantenimientoDialog: boolean = false;
    editMode: boolean = false;
    mantenimientoForm: MantenimientoForm = this.resetForm();
    selectedMantenimiento: Mantenimiento | null = null;
    searchTerm: string = '';
    loading: boolean = false;

    clienteSeleccionado: Cliente | null = null;
    dispositivosCliente: any[] = [];
    dispositivoSeleccionado: any = null;

    // Opciones para dropdowns
    frecuenciaOptions = [
        { label: 'Mensual', value: 'Mensual' },
        { label: 'Bimestral', value: 'Bimestral' },
        { label: 'Trimestral', value: 'Trimestral' },
        { label: 'Semestral', value: 'Semestral' },
        { label: 'Anual', value: 'Anual' }
    ];

    clienteOptions: any[] = [];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private mantenimientoService: MantenimientoService
    ) {}

    ngOnInit() {
        this.loadClientes();
        this.loadMantenimientos();
    }

    loadClientes() {
        this.mantenimientoService.getClientesMantenimiento().subscribe({
            next: (clientes) => {
                this.clientes = clientes; // Populate the 'clientes' array
                this.clienteOptions = clientes.map(cliente => ({
                    label: `${cliente.nombre} ${cliente.apellido} (${this.mantenimientoService.generateClienteCode(cliente.id_cliente || 0)})`,
                    value: cliente.id_cliente
                }));
            },
            error: (error) => {
                console.error('Error al cargar clientes:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los clientes',
                    life: 3000
                });
            }
        });
    }

    loadMantenimientos() {
        this.loading = true;
        this.mantenimientoService.getMantenimientos().subscribe({
            next: (mantenimientos) => {
                this.mantenimientos = mantenimientos;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error al cargar mantenimientos:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudieron cargar los mantenimientos',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    openNew() {
        this.mantenimientoForm = this.resetForm();
        this.editMode = false;
        this.mantenimientoDialog = true;
        this.clienteSeleccionado = null;
        this.dispositivoSeleccionado = null;
        this.dispositivosCliente = [];
    }

    onClienteChange(event: any) {
        const clienteId = event.value; // Assuming event.value contains the client ID
        this.dispositivoSeleccionado = null;
        this.dispositivosCliente = [];
        if (clienteId) {
            this.mantenimientoService.getDispositivosByCliente(clienteId).subscribe({
                next: (dispositivos) => {
                    this.dispositivosCliente = dispositivos.map(d => ({
                        ...d,
                        displayName: `${d.marca} ${d.modelo} (${d.tipo_dispositivo})`
                    }));
                },
                error: (error) => {
                    console.error('Error al cargar dispositivos:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los dispositivos del cliente',
                        life: 3000
                    });
                }
            });
        }
    }

    editMantenimiento(mantenimiento: Mantenimiento) {
        this.selectedMantenimiento = mantenimiento;
        this.editMode = true;
        
        // Convertir el código de cliente (CL001) a ID numérico
        const clienteId = this.mantenimientoService.extractClienteId(mantenimiento.cod_cliente || '');
        
        // Set clienteSeleccionado
        this.clienteSeleccionado = this.clientes.find(c => c.id_cliente === clienteId) || null;

        this.mantenimientoForm = {
            mantPrev: mantenimiento.mant_prev || '',
            cod_cliente: clienteId,
            fecha_mantenimiento: new Date(mantenimiento.fecha || ''),
            equipos: mantenimiento.equipos || '',
            ingreso: mantenimiento.ingreso || 0,
            egreso: mantenimiento.egreso || 0,
            frecuencia: mantenimiento.frecuencia || '',
            prox_fecha: new Date(mantenimiento.prox_mantenimiento || '')
        };

        // Trigger onClienteChange to load devices for the selected client
        if (this.clienteSeleccionado) {
            this.onClienteChange({ value: this.clienteSeleccionado.id_cliente });
        }

        // Set dispositivoSeleccionado after devices are loaded
        if (mantenimiento.equipos) {
            setTimeout(() => {
                const foundDevice = this.dispositivosCliente.find(d => d.displayName === mantenimiento.equipos);
                if (foundDevice) {
                    this.dispositivoSeleccionado = foundDevice;
                } else {
                    console.warn(`Dispositivo '${mantenimiento.equipos}' no encontrado en las opciones para el cliente ${clienteId}`);
                    this.dispositivoSeleccionado = null;
                }
            }, 100); // Small delay to ensure options are populated
        }
        this.mantenimientoDialog = true;
    }

    deleteMantenimiento(mantenimiento: Mantenimiento) {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el mantenimiento ${mantenimiento.mant_prev}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (mantenimiento.id_operacion) {
                    this.mantenimientoService.deleteMantenimiento(mantenimiento.id_operacion).subscribe({
                        next: () => {
                            this.mantenimientos = this.mantenimientos.filter(val => val.id_operacion !== mantenimiento.id_operacion);
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Exitoso',
                                detail: 'Mantenimiento eliminado',
                                life: 3000
                            });
                        },
                        error: (error) => {
                            console.error('Error al eliminar:', error);
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'No se pudo eliminar el mantenimiento',
                                life: 3000
                            });
                        }
                    });
                }
            }
        });
    }

    saveMantenimiento() {
        if (this.validateForm()) {
            // Set equipos from selected device's displayName before creating formData
            this.mantenimientoForm.equipos = this.dispositivoSeleccionado ? this.dispositivoSeleccionado.displayName : '';

            const formData = {
                id_cliente: this.mantenimientoForm.cod_cliente,
                equipos: this.mantenimientoForm.equipos, // Send the descriptive string
                frecuencia: this.mantenimientoForm.frecuencia,
                fecha_mantenimiento: this.mantenimientoForm.fecha_mantenimiento,
                prox_fecha: this.mantenimientoForm.prox_fecha,
                ingreso: this.mantenimientoForm.ingreso,
                egreso: this.mantenimientoForm.egreso
            };

            if (this.editMode && this.selectedMantenimiento) {
                // Actualizar mantenimiento existente
                this.mantenimientoService.updateMantenimiento(this.selectedMantenimiento.id_operacion!, formData).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Mantenimiento actualizado',
                            life: 3000
                        });
                        this.hideDialog();
                        this.loadMantenimientos(); // Recargar la lista
                    },
                    error: (error) => {
                        console.error('Error al actualizar:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo actualizar el mantenimiento',
                            life: 3000
                        });
                    }
                });
            } else {
                // Crear nuevo mantenimiento
                this.mantenimientoService.createMantenimiento(formData).subscribe({
                    next: (response) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Exitoso',
                            detail: 'Mantenimiento creado',
                            life: 3000
                        });
                        this.hideDialog();
                        this.loadMantenimientos(); // Recargar la lista
                    },
                    error: (error) => {
                        console.error('Error al crear:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'No se pudo crear el mantenimiento',
                            life: 3000
                        });
                    }
                });
            }
        }
    }

    validateForm(): boolean {
        if (!this.mantenimientoForm.cod_cliente || !this.dispositivoSeleccionado || 
            !this.mantenimientoForm.frecuencia) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor complete todos los campos requeridos',
                life: 3000
            });
            return false;
        }
        return true;
    }

    hideDialog() {
        this.mantenimientoDialog = false;
        this.editMode = false;
        this.selectedMantenimiento = null;
        this.mantenimientoForm = this.resetForm();
        this.clienteSeleccionado = null;
        this.dispositivoSeleccionado = null;
        this.dispositivosCliente = [];
    }

    resetForm(): MantenimientoForm {
        return {
            mantPrev: '', // Se generará automáticamente en el backend
            cod_cliente: 0,
            fecha_mantenimiento: new Date(),
            equipos: '',
            ingreso: 0,
            egreso: 0,
            frecuencia: '',
            prox_fecha: new Date()
        };
    }

    searchMantenimientos() {
        if (!this.searchTerm.trim()) {
            this.loadMantenimientos();
            return;
        }
        
        this.loading = true;
        this.mantenimientoService.searchMantenimientos(this.searchTerm).subscribe({
            next: (mantenimientos) => {
                this.mantenimientos = mantenimientos;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error en búsqueda:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error al buscar mantenimientos',
                    life: 3000
                });
                this.loading = false;
            }
        });
    }

    clearSearch() {
        this.searchTerm = '';
        this.loadMantenimientos();
    }

    // Método helper para obtener el nombre del cliente por ID
    getClienteNameById(clienteId: number): string {
        const cliente = this.clientes.find(c => c.id_cliente === clienteId);
        return cliente ? `${cliente.nombre} ${cliente.apellido}` : '';
    }
}   

