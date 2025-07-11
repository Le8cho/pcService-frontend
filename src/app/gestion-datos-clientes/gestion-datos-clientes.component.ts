
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Cliente } from '../models/cliente.interface';
import { ClienteService } from '../services/cliente.service';

@Component({
    selector: 'app-gestion-datos-clientes',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        ToastModule,
        ToolbarModule
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './gestion-datos-clientes.component.html',
    styleUrl: './gestion-datos-clientes.component.scss'
})
export class GestionDatosClientesComponent implements OnInit {
    clientes: Cliente[] = [];
    clienteSeleccionado: Cliente = this.inicializarCliente();
    mostrarDialog: boolean = false;
    modoEdicion: boolean = false;
    terminoBusqueda: string = '';
    loading: boolean = false;

    constructor(
        private clienteService: ClienteService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.cargarClientes();
    }

    cargarClientes() {
        this.loading = true;
        this.clienteService.getClientes().subscribe({
            next: (clientes) => {
                this.clientes = clientes;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    inicializarCliente(): Cliente {
        return {
            nombre: '',
            apellido: '',
            direccion: '',
            celular: '',
            correo: ''
        };
    }

    nuevoCliente() {
        this.clienteSeleccionado = this.inicializarCliente();
        this.modoEdicion = false;
        this.mostrarDialog = true;
    }

    editarCliente(cliente: Cliente) {
        this.clienteSeleccionado = { ...cliente };
        this.modoEdicion = true;
        this.mostrarDialog = true;
    }

    guardarCliente() {
        if (this.validarCliente()) {
            if (this.modoEdicion) {
                this.clienteService.actualizarCliente(this.clienteSeleccionado).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Cliente actualizado',
                            detail: 'Los datos del cliente han sido actualizados exitosamente'
                        });
                        this.cargarClientes();
                        this.ocultarDialog();
                    }
                });
            } else {
                this.clienteService.agregarCliente(this.clienteSeleccionado).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Cliente registrado',
                            detail: 'Cliente registrado exitosamente'
                        });
                        this.cargarClientes();
                        this.ocultarDialog();
                    }
                });
            }
        }
    }

    eliminarCliente(cliente: Cliente) {
        this.confirmationService.confirm({
            message: `¿Está seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?<br><span style="color:#b91c1c;">Esta acción no se puede deshacer.</span>`,
            header: 'Eliminar Cliente',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                if (cliente.id_cliente) {
                    this.clienteService.eliminarCliente(cliente.id_cliente).subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Cliente eliminado',
                                detail: 'Cliente eliminado exitosamente'
                            });
                            this.cargarClientes();
                        },
                        error: (err) => {
                            // Manejo de error por restricción de integridad
                            if (err.error && err.error.error && err.error.error.includes('ORA-02292')) {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'No se puede eliminar',
                                    detail: 'No se puede eliminar el cliente porque tiene operaciones asociadas.'
                                });
                            } else {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Ocurrió un error al eliminar el cliente.'
                                });
                            }
                        }
                    });
                }
            }
        });
    }

    buscarClientes() {
        if (this.terminoBusqueda.trim()) {
            this.loading = true;
            this.clienteService.getClientes().subscribe({
                next: (clientes: Cliente[]) => {
                    this.clientes = clientes.filter(cliente =>
                        cliente.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
                        cliente.apellido.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
                        cliente.correo.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
                        cliente.id_cliente?.toString().includes(this.terminoBusqueda)
                    );
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        } else {
            this.cargarClientes();
        }
    }

    clearSearch() {
        this.terminoBusqueda = '';
        this.cargarClientes();
    }

    ocultarDialog() {
        this.mostrarDialog = false;
        this.clienteSeleccionado = this.inicializarCliente();
    }

    validarCliente(): boolean {
        if (!this.clienteSeleccionado.nombre.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El nombre es requerido'
            });
            return false;
        }
        if (!this.clienteSeleccionado.apellido.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El apellido es requerido'
            });
            return false;
        }
        if (!this.clienteSeleccionado.correo.trim()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El correo es requerido'
            });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.clienteSeleccionado.correo)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Ingrese un correo válido'
            });
            return false;
        }
        return true;
    }
}

