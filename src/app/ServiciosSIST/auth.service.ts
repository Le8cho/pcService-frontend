import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:5000/api/auth';
  private readonly TOKEN_KEY = 'pcservice_auth_token';

  constructor(private http: HttpClient) { }

  login(credentials: {nombre_usuario: string, contrasena: string}): Observable<{token: string}> {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Guardar el token en localStorage al iniciar sesión
        if (response.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
      })
    );
  }

  logout(): void {
    // Eliminar el token de localStorage al cerrar sesión
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    // Comprobar si hay un token
    return !!this.getToken();
  }
}
