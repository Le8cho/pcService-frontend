// src/app/login/login.component.ts (Versión Final Integrada)
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../ServiciosSIST/auth.service';

// --- IMPORTACIONES DE PRIMENG (ADAPTADAS A LA PLANTILLA) ---
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox'; // Opcional, para el "Remember me"

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    // Módulos de Angular
    CommonModule,
    ReactiveFormsModule,

    // Módulos de PrimeNG
    InputTextModule,
    ButtonModule,
    MessageModule,
    RippleModule,
    PasswordModule,
    CheckboxModule // Opcional
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
        this.router.navigate(['/dashboard']); // Cambia '/dashboard' por tu ruta principal
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.error || 'No se pudo iniciar sesión. Inténtalo de nuevo.';
        console.error('Error de login:', err);
      }
    });
  }
}