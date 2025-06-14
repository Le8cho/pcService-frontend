// gestion-datos-servicios.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Importar
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown'; // Importar
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';

import { Servicio, ServicioForm, Cliente } from '../models/servicio.interface';
import { ServicioService } from '../ServiciosSIST/api.service'; // Importar servicio

@Component({
    selector: 'app-gestion-datos-servicios',
    standalone: true,
    imports: [
        CommonModule, FormsModule, HttpClientModule, TableModule, ToastModule,
        CalendarModule, DialogModule, ButtonModule, DropdownModule, InputTextModule,
        ToolbarModule, ConfirmDialogModule, TooltipModule, RippleModule
    ],
    templateUrl: './gestion-datos-servicios.component.html',
    styleUrls: ['./gestion-datos-servicios.component.scss'],
    providers: [MessageService, ConfirmationService, ServicioService] // Añadir ApiService
})
export class GestionDatosServiciosComponent implements OnInit {

    servicios: Servicio[] = [];
    serviciosOriginales: Servicio[] = [];
    servicioDialog: boolean = false;
    editMode: boolean = false;
    servicioForm: ServicioForm = this.resetForm();
    selectedServicio: Servicio | null = null;
    searchTerm: string = '';
    loading: boolean = false;

    clienteOptions: any[] = []; // Opciones para el dropdown

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private servicioService: ServicioService // Inyectar servicio
    ) {}

    ngOnInit() {
        this.loadServicios();
        this.loadClientes();
    }

    loadServicios() {
        this.loading = true;
        this.servicioService.getServicios().subscribe({
            next: data => {
                this.serviciosOriginales = data;
                this.servicios = data.map(s => ({
                    ...s,
                    fecha: new Date(s.fecha).toLocaleDateString('es-ES')
                }));
                this.loading = false;
            },
            error: err => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los servicios' });
                console.error(err);
            }
        });
    }

    loadClientes() {
        this.servicioService.getClientes().subscribe(data => {
            this.clienteOptions = data.map(cliente => ({
                label: `${cliente.nombre} ${cliente.apellido}`,
                value: cliente.id_cliente
            }));
        });
    }

    openNew() {
        this.servicioForm = this.resetForm();
        this.editMode = false;
        this.servicioDialog = true;
    }

    editServicio(servicio: Servicio) {
        this.selectedServicio = servicio;
        this.editMode = true;
        const servicioOriginal = this.serviciosOriginales.find(s => s.id_operacion === servicio.id_operacion);
        if (servicioOriginal) {
            this.servicioForm = {
                id_cliente: servicioOriginal.id_cliente,
                fecha: new Date(servicioOriginal.fecha), // Usar fecha original
                detalle: servicioOriginal.detalle,
                tecnico_encargado: servicioOriginal.tecnico_encargado, // <<< AÑADIDO
                duracion_estimada: servicioOriginal.duracion_estimada, // <<< AÑADIDO
                ingreso: servicioOriginal.ingreso,
                egreso: servicioOriginal.egreso
            };
        } else {
            // Fallback si no se encuentra el original
            this.servicioForm = {
                id_cliente: servicio.id_cliente,
                fecha: new Date(), // Fecha actual como fallback
                detalle: servicio.detalle,
                tecnico_encargado: servicio.tecnico_encargado, // <<< AÑADIDO
                duracion_estimada: servicio.duracion_estimada, // <<< AÑADIDO
                ingreso: servicio.ingreso,
                egreso: servicio.egreso
            };
        }
        this.servicioDialog = true;
    }

    saveServicio() {
        if (!this.validateForm()) return;

        const apiCall = this.editMode
            ? this.servicioService.updateServicio(this.selectedServicio!.id_operacion, this.servicioForm)
            : this.servicioService.createServicio(this.servicioForm);

        apiCall.subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Servicio ${this.editMode ? 'actualizado' : 'creado'}` });
                this.hideDialog();
                this.loadServicios();
            },
            error: err => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: `No se pudo guardar el servicio` });
                console.error(err);
            }
        });
    }
    
    deleteServicio(servicio: Servicio) {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el servicio ${servicio.id_servicio}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.servicioService.deleteServicio(servicio.id_operacion).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Servicio eliminado' });
                        this.loadServicios();
                    },
                    error: err => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar el servicio' });
                        console.error(err);
                    }
                });
            }
        });
    }

    searchServicios() {
        if (!this.searchTerm.trim()) {
            this.loadServicios();
            return;
        }
        this.loading = true;
        this.servicioService.searchServicios(this.searchTerm).subscribe({
            next: data => {
                this.servicios = data.map(s => ({ ...s, fecha: new Date(s.fecha).toLocaleDateString('es-ES') }));
                this.loading = false;
            },
            error: err => {
                this.loading = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error en la búsqueda' });
            }
        });
    }

    clearSearch() {
        this.searchTerm = '';
        this.loadServicios();
    }
    
    validateForm(): boolean {
        if (!this.servicioForm.id_cliente || !this.servicioForm.detalle) {
            this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor complete todos los campos requeridos (*)' });
            return false;
        }
        return true;
    }

    hideDialog() {
        this.servicioDialog = false;
    }

    resetForm(): ServicioForm {
        return {
            id_cliente: null,
            fecha: new Date(),
            detalle: '',
            tecnico_encargado: '',
            duracion_estimada: '',
            ingreso: 0,
            egreso: 0
        };
    }
}