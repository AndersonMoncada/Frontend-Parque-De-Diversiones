import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.invalid) {
      this.snack.open('Completa todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    // Login temporal (mientras no tengas backend real)
    this.snack.open('Inicio de sesión simulado', 'OK', { duration: 2000 });
    
    // Redirige al área principal
    setTimeout(() => {
      this.router.navigate(['/app']);
    }, 800);
  }
}