import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://127.0.0.1:5000/clientes'; // SIN /api, SIN /api/clientes

  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl + '/');
  }

  agregarCliente(cliente: Cliente): Observable<any> {
    return this.http.post(this.apiUrl + '/', cliente);
  }

  actualizarCliente(cliente: Cliente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${cliente.id_cliente}`, cliente);
  }

  eliminarCliente(id_cliente: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id_cliente}`);
  }
}
