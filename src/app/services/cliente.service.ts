import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cliente } from '../models/cliente.interface';

@Injectable({
    providedIn: 'root'
})
export class ClienteService {
    private clientes: Cliente[] = [
        {
            id: 'CLI-001',
            nombre: 'Roberto',
            apellido: 'Gómez',
            direccion: 'Av. Principal 123, Ciudad',
            celular: '555-123-4567',
            correo: 'roberto.gomez@email.com'
        },
        {
            id: 'CLI-002',
            nombre: 'Laura',
            apellido: 'Martínez',
            direccion: 'Calle Secundaria 456',
            celular: '555-987-6543',
            correo: 'laura.martinez@email.com'
        },
        {
            id: 'CLI-003',
            nombre: 'Miguel',
            apellido: 'Sánchez',
            direccion: 'Plaza Central 789, CL',
            celular: '555-456-7890',
            correo: 'miguel.sanchez@email.com'
        }
    ];

    private clientesSubject = new BehaviorSubject<Cliente[]>(this.clientes);
    public clientes$ = this.clientesSubject.asObservable();

    getClientes(): Observable<Cliente[]> {
        return this.clientes$;
    }

    agregarCliente(cliente: Cliente): void {
        const nuevoId = `CLI-${String(this.clientes.length + 1).padStart(3, '0')}`;
        const nuevoCliente = { ...cliente, id: nuevoId };
        this.clientes.push(nuevoCliente);
        this.clientesSubject.next([...this.clientes]);
    }

    actualizarCliente(cliente: Cliente): void {
        const index = this.clientes.findIndex(c => c.id === cliente.id);
        if (index !== -1) {
            this.clientes[index] = cliente;
            this.clientesSubject.next([...this.clientes]);
        }
    }

    eliminarCliente(id: string): void {
        this.clientes = this.clientes.filter(c => c.id !== id);
        this.clientesSubject.next([...this.clientes]);
    }

    buscarClientes(termino: string): Observable<Cliente[]> {
        const clientesFiltrados = this.clientes.filter(cliente =>
            cliente.nombre.toLowerCase().includes(termino.toLowerCase()) ||
            cliente.apellido.toLowerCase().includes(termino.toLowerCase()) ||
            cliente.correo.toLowerCase().includes(termino.toLowerCase())
        );
        return new BehaviorSubject(clientesFiltrados).asObservable();
    }
}
