import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../ServiciosSIST/api.service';

@Component({
  selector: 'app-gestion-datos-dispositivos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DialogModule
  ],
  templateUrl: './gestion-datos-dispositivos.component.html',
  styleUrls: ['./gestion-datos-dispositivos.component.scss']
})
export class GestionDatosDispositivosComponent implements OnInit {
  dispositivos: any[] = [];
  mostrarDialogoDispositivo = false;
  editandoDispositivo = false;
  dispositivoSeleccionado: any = {};

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarDispositivos();
  }

  cargarDispositivos() {
    this.apiService.getDispositivos().subscribe(data => {
      this.dispositivos = data;
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
    if (this.editandoDispositivo) {
      this.apiService.updateDispositivo(this.dispositivoSeleccionado).subscribe(() => {
        this.cargarDispositivos();
        this.mostrarDialogoDispositivo = false;
      });
    } else {
      this.apiService.createDispositivo(this.dispositivoSeleccionado).subscribe(() => {
        this.cargarDispositivos();
        this.mostrarDialogoDispositivo = false;
      });
    }
  }

  eliminarDispositivo(id: number) {
    this.apiService.deleteDispositivo(id).subscribe(() => {
      this.cargarDispositivos();
    });
  }

  cerrarDialogoDispositivo() {
    this.mostrarDialogoDispositivo = false;
  }
}
