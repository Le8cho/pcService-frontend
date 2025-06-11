// gestion-datos-mantenimiento.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

import { Mantenimiento, MantenimientoForm } from '../models/mantenimiento.interface';

@Component({
    selector: 'app-gestion-datos-mantenimiento',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
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
    providers: [MessageService, ConfirmationService]
})
export class GestionDatosMantenimientoComponent implements OnInit {

    mantenimientos: Mantenimiento[] = [];
    mantenimientoDialog: boolean = false;
    editMode: boolean = false;
    mantenimientoForm: MantenimientoForm = this.resetForm();
    selectedMantenimiento: Mantenimiento | null = null;
    searchTerm: string = '';
    loading: boolean = false;

    // Opciones para dropdowns
    frecuenciaOptions = [
        { label: 'Mensual', value: 'Mensual' },
        { label: 'Trimestral', value: 'Trimestral' },
        { label: 'Semestral', value: 'Semestral' },
        { label: 'Anual', value: 'Anual' }
    ];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadMantenimientos();
    }

    loadMantenimientos() {
        this.loading = true;
        // Datos de prueba
        setTimeout(() => {
            this.mantenimientos = [
                {
                    id_operacion: 1,
                    mantPrev: 'MP001',
                    cod_cliente: 'CL001',
                    nombre_cliente: 'Juan Pérez',
                    fecha: '2023-10-15',
                    equipos: 'Laptop Dell XPS',
                    ingreso: 2023.15,
                    egreso: 2023.10,
                    frecuencia: 'Mensual',
                    prox_mantenimiento: '2023-11-15',
                    id_cliente: 1,
                    tipo_operacion: 'MANTENIMIENTO'
                },
                {
                    id_operacion: 2,
                    mantPrev: 'MP002',
                    cod_cliente: 'CL002',
                    nombre_cliente: 'María García',  
                    fecha: '2023-10-18',
                    equipos: 'PC Desktop HP',
                    ingreso: 2023.18,
                    egreso: 2023.19,
                    frecuencia: 'Trimestral',
                    prox_mantenimiento: '2024-01-18',
                    id_cliente: 2,
                    tipo_operacion: 'MANTENIMIENTO'
                },
                {
                    id_operacion: 3,
                    mantPrev: 'MP003',
                    cod_cliente: 'CL003',
                    nombre_cliente: 'Carlos López',
                    fecha: '2023-10-20',
                    equipos: 'MacBook Pro',
                    ingreso: 2023.20,
                    egreso: 2023.21,
                    frecuencia: 'Semestral',
                    prox_mantenimiento: '2024-04-20',
                    id_cliente: 3,
                    tipo_operacion: 'MANTENIMIENTO'
                },
                {
                    id_operacion: 4,
                    mantPrev: 'MP004',
                    cod_cliente: 'CL004',
                    nombre_cliente: 'Ana Martínez',
                    fecha: '2023-10-22',
                    equipos: 'Lenovo ThinkPad',
                    ingreso: 2023.22,
                    egreso: 2023.23,
                    frecuencia: 'Mensual',
                    prox_mantenimiento: '2023-11-22',
                    id_cliente: 4,
                    tipo_operacion: 'MANTENIMIENTO'
                }
            ];
            this.loading = false;
        }, 1000);
    }

    openNew() {
        this.mantenimientoForm = this.resetForm();
        this.editMode = false;
        this.mantenimientoDialog = true;
    }

    editMantenimiento(mantenimiento: Mantenimiento) {
        this.selectedMantenimiento = mantenimiento;
        this.editMode = true;
        this.mantenimientoForm = {
            mantPrev: mantenimiento.mantPrev || '',
            cod_cliente: mantenimiento.cod_cliente || '',
            fecha_mantenimiento: new Date(mantenimiento.fecha || ''),
            equipos: mantenimiento.equipos || '',
            ingreso: mantenimiento.ingreso || 0,
            egreso: mantenimiento.egreso || 0,
            frecuencia: mantenimiento.frecuencia || '',
            prox_fecha: new Date(mantenimiento.prox_mantenimiento || '')
        };
        this.mantenimientoDialog = true;
    }

    deleteMantenimiento(mantenimiento: Mantenimiento) {
        this.confirmationService.confirm({
            message: `¿Está seguro de eliminar el mantenimiento ${mantenimiento.mantPrev}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.mantenimientos = this.mantenimientos.filter(val => val.id_operacion !== mantenimiento.id_operacion);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Mantenimiento eliminado',
                    life: 3000
                });
            }
        });
    }

    saveMantenimiento() {
        if (this.validateForm()) {
            if (this.editMode && this.selectedMantenimiento) {
                // Actualizar mantenimiento existente
                const index = this.mantenimientos.findIndex(m => m.id_operacion === this.selectedMantenimiento!.id_operacion);
                if (index !== -1) {
                    this.mantenimientos[index] = {
                        ...this.selectedMantenimiento,
                        mantPrev: this.mantenimientoForm.mantPrev,
                        cod_cliente: this.mantenimientoForm.cod_cliente,
                        fecha: this.mantenimientoForm.fecha_mantenimiento.toISOString().split('T')[0],
                        equipos: this.mantenimientoForm.equipos,
                        ingreso: this.mantenimientoForm.ingreso,
                        egreso: this.mantenimientoForm.egreso,
                        frecuencia: this.mantenimientoForm.frecuencia,
                        prox_mantenimiento: this.mantenimientoForm.prox_fecha.toISOString().split('T')[0]
                    };
                }
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Mantenimiento actualizado',
                    life: 3000
                });
            } else {
                // Crear nuevo mantenimiento
                const newMantenimiento: Mantenimiento = {
                    id_operacion: this.mantenimientos.length + 1,
                    mantPrev: this.mantenimientoForm.mantPrev,
                    cod_cliente: this.mantenimientoForm.cod_cliente,
                    nombre_cliente: 'Cliente Ejemplo', // En producción vendría del backend
                    fecha: this.mantenimientoForm.fecha_mantenimiento.toISOString().split('T')[0],
                    equipos: this.mantenimientoForm.equipos,
                    ingreso: this.mantenimientoForm.ingreso,
                    egreso: this.mantenimientoForm.egreso,
                    frecuencia: this.mantenimientoForm.frecuencia,
                    prox_mantenimiento: this.mantenimientoForm.prox_fecha.toISOString().split('T')[0],
                    id_cliente: 1, // En producción vendría del formulario
                    tipo_operacion: 'MANTENIMIENTO'
                };
                this.mantenimientos.push(newMantenimiento);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Exitoso',
                    detail: 'Mantenimiento creado',
                    life: 3000
                });
            }
            this.hideDialog();
        }
    }

    validateForm(): boolean {
        if (!this.mantenimientoForm.mantPrev || !this.mantenimientoForm.cod_cliente || 
            !this.mantenimientoForm.equipos || !this.mantenimientoForm.frecuencia) {
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
    }

    resetForm(): MantenimientoForm {
        return {
            mantPrev: '',
            cod_cliente: '',
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
        
        this.mantenimientos = this.mantenimientos.filter(m => 
            m.mantPrev?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            m.cod_cliente?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            m.nombre_cliente?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            m.equipos?.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
    }

    clearSearch() {
        this.searchTerm = '';
        this.loadMantenimientos();
    }
}