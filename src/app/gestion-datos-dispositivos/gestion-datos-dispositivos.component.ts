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
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
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
    ConfirmDialogModule,
    InputTextModule,
    ToolbarModule,
    TooltipModule,
    RippleModule
  ],
  templateUrl: './gestion-datos-dispositivos.component.html',
  styleUrls: ['./gestion-datos-dispositivos.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class GestionDatosDispositivosComponent implements OnInit {
  dispositivos: any[] = [];
  dispositivosOriginales: any[] = [];
  mostrarDialogoDispositivo = false;
  editandoDispositivo = false;
  dispositivoSeleccionado: any = {};
  clienteOptions: any[] = []; // Opciones para el dropdown de clientes
  clienteMap: Map<number, string> = new Map(); // Mapa para ID -> Nombre del Cliente
  searchTerm: string = '';
  loading: boolean = false;

  // --- NUEVO: Filtros ---
  filtroTipo: string = '';
  filtroMarca: string = '';
  filtroCliente: number | null = null;
  ordenClientesDesc: boolean = true;

  tipoDispositivoOptions: any[] = [];
  marcaOptions: any[] = [];
  clientesOrdenadosOptions: any[] = [];

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadClientes();
    // Los tipos/marcas/filtros se llenan luego de cargar dispositivos
  }

  loadClientes() {
    this.apiService.verClienteDispositivos().subscribe({
      next: (data) => {
        // Opciones para el dropdown
        this.clienteOptions = data.map(cliente => ({
          label: `${cliente.nombre} ${cliente.apellido}`,
          value: cliente.id_cliente
        }));

        // Llenado del mapa de IDs a nombres
        data.forEach(cliente => {
          this.clienteMap.set(cliente.id_cliente, `${cliente.nombre} ${cliente.apellido}`);
        });

        // Cargar dispositivos después de cargar clientes
        this.cargarDispositivos();
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
    this.loading = true;
    this.apiService.getDispositivos().subscribe({
      next: (data) => {
        // Guardado de datos originales con nombres de clientes
        this.dispositivosOriginales = data.map(dispositivo => ({
          ...dispositivo,
          NOMBRE_CLIENTE: this.clienteMap.get(dispositivo.ID_CLIENTE) || `ID: ${dispositivo.ID_CLIENTE}`
        }));

        // Los datos mostrados son iguales a los originales al cargar
        this.dispositivos = [...this.dispositivosOriginales];
        this.prepararFiltros();
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
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

  // --- FILTROS Y ORDENAMIENTO ---
  prepararFiltros() {
    // Tipos de dispositivos
    const tiposSet = new Set(this.dispositivosOriginales.map(d => d.TIPO_DISPOSITIVO).filter(Boolean));
    this.tipoDispositivoOptions = Array.from(tiposSet).map(tipo => ({ label: tipo, value: tipo }));

    // Marcas
    const marcasSet = new Set(this.dispositivosOriginales.map(d => d.MARCA).filter(Boolean));
    this.marcaOptions = Array.from(marcasSet).map(marca => ({ label: marca, value: marca }));

    // Clientes con cantidad de dispositivos
    const clienteContador: { [key: number]: number } = {};
    this.dispositivosOriginales.forEach(d => {
      clienteContador[d.ID_CLIENTE] = (clienteContador[d.ID_CLIENTE] || 0) + 1;
    });

    let clientesArray = Object.keys(clienteContador).map(id => ({
      label: this.clienteMap.get(Number(id)) || `ID: ${id}`,
      value: Number(id),
      cantidad: clienteContador[Number(id)]
    }));

    clientesArray.sort((a, b) =>
      this.ordenClientesDesc
        ? b.cantidad - a.cantidad
        : a.cantidad - b.cantidad
    );
    this.clientesOrdenadosOptions = clientesArray;
  }

  toggleOrdenCliente() {
    this.ordenClientesDesc = !this.ordenClientesDesc;
    this.prepararFiltros();
    this.filtrarDispositivos();
  }

  filtrarDispositivos() {
    let filtrados = [...this.dispositivosOriginales];

    // Filtro tipo
    if (this.filtroTipo) {
      filtrados = filtrados.filter(d => d.TIPO_DISPOSITIVO === this.filtroTipo);
    }
    // Filtro marca
    if (this.filtroMarca) {
      filtrados = filtrados.filter(d => d.MARCA === this.filtroMarca);
    }
    // Filtro cliente
    if (this.filtroCliente) {
      filtrados = filtrados.filter(d => d.ID_CLIENTE === this.filtroCliente);
    }

    // Búsqueda textual (por término)
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtrados = filtrados.filter(dispositivo => {
        const nombreCliente = (this.clienteMap.get(dispositivo.ID_CLIENTE) || '').toLowerCase();
        return [
          dispositivo.ID_DISPOSITIVO?.toString().toLowerCase(),
          dispositivo.TIPO_DISPOSITIVO?.toLowerCase(),
          dispositivo.MARCA?.toLowerCase(),
          dispositivo.MODELO?.toLowerCase(),
          nombreCliente
        ].some(field => field.includes(term));
      });
    }
    this.dispositivos = filtrados;
  }

  limpiarFiltros() {
    this.filtroTipo = '';
    this.filtroMarca = '';
    this.filtroCliente = null;
    this.ordenClientesDesc = true;
    this.prepararFiltros();
    this.filtrarDispositivos();
  }

  clearSearch() {
    this.searchTerm = '';
    this.filtrarDispositivos();
  }

  // --- CRUD y Diálogo ---
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
