import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ApiService } from '../ServiciosSIST/api.service';

@Component({
  selector: 'app-gestion-datos-dispositivos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule
  ],
  templateUrl: './gestion-datos-dispositivos.component.html',
  styleUrls: ['./gestion-datos-dispositivos.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class GestionDatosDispositivosComponent implements OnInit {
  dispositivos: any[] = [];
  mostrarDialogoDispositivo = false;
  editandoDispositivo = false;
  dispositivoSeleccionado: any = {};
  clienteOptions: any[] = []; // Opciones para el dropdown de clientes

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.cargarDispositivos();
    this.loadClientes();
  }

  loadClientes() {
    this.apiService.verClienteDispositivos().subscribe({
      next: (data) => {
        this.clienteOptions = data.map(cliente => ({
          label: `${cliente.nombre} ${cliente.apellido} (ID: ${cliente.id_cliente})`,
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

  cargarDispositivos() {
    this.apiService.getDispositivos().subscribe({
      next: (data) => {
        this.dispositivos = data;
      },
      error: (error) => {
        console.error('Error al cargar dispositivos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los dispositivos',
          life: 3000
        });
      }
    });
  }

  abrirDialogoDispositivo() {
    this.editandoDispositivo = false;
    this.dispositivoSeleccionado = {};
    this.mostrarDialogoDispositivo = true;
  }

  editarDispositivo(dispositivo: any) {
    this.editandoDispositivo = true;
    this.dispositivoSeleccionado = { ...dispositivo };
    this.mostrarDialogoDispositivo = true;
  }

  guardarDispositivo() {
    if (!this.validateForm()) return;

    const apiCall = this.editandoDispositivo
      ? this.apiService.updateDispositivo(this.dispositivoSeleccionado)
      : this.apiService.createDispositivo(this.dispositivoSeleccionado);

    apiCall.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Dispositivo ${this.editandoDispositivo ? 'actualizado' : 'creado'} correctamente`,
          life: 3000
        });
        this.cargarDispositivos();
        this.mostrarDialogoDispositivo = false;
      },
      error: (error) => {
        console.error('Error al guardar dispositivo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `No se pudo ${this.editandoDispositivo ? 'actualizar' : 'crear'} el dispositivo`,
          life: 3000
        });
      }
    });
  }

  eliminarDispositivo(id: number) {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el dispositivo con ID ${id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.apiService.deleteDispositivo(id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Dispositivo eliminado correctamente',
              life: 3000
            });
            this.cargarDispositivos();
          },
          error: (error) => {
            console.error('Error al eliminar dispositivo:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el dispositivo',
              life: 3000
            });
          }
        });
      }
    });
  }

  validateForm(): boolean {
    if (!this.dispositivoSeleccionado.ID_CLIENTE || 
        !this.dispositivoSeleccionado.TIPO_DISPOSITIVO || 
        !this.dispositivoSeleccionado.MARCA || 
        !this.dispositivoSeleccionado.MODELO) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Por favor complete todos los campos requeridos',
        life: 3000
      });
      return false;
    }
    return true;
  }

  cerrarDialogoDispositivo() {
    this.mostrarDialogoDispositivo = false;
  }
}
