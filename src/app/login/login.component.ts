// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Importa el servicio de autenticación desde la ubicación correcta
import { AuthService } from '../ServiciosSIST/auth.service'; 

// --- IMPORTACIONES DE PRIMENG ---
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';


@Component({
  selector: 'app-login',
  standalone: true, // Asegúrate de que el componente sea Standalone
  imports: [
    CommonModule, // Necesario para directivas como *ngIf
    ReactiveFormsModule, // Necesario para [formGroup] y formControlName
    InputTextModule, // Para la directiva pInputText
    ButtonModule, // Para el componente pButton y la propiedad [loading]
    MessageModule // Para el componente <p-message>
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Inyecta el servicio
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirigir al dashboard o página principal tras un login exitoso
        this.router.navigate(['']); // Cambiar '' por ruta principal
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
        console.error('Error de login:', err);
      }
    });
  }
}