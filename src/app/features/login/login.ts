import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuditContextService } from '../../core/audit-context.service';
import { UsuarioService } from '../../core/services/usuario.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  template: `
    <div style="
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
    ">
      <mat-card style="width: 380px; padding: 24px;">
        <mat-card-header>
          <mat-card-title style="font-size:22px; margin-bottom:16px">
            🎡 Parque de Diversiones
          </mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form"
                (ngSubmit)="onSubmit()"
                style="display:flex; flex-direction:column; gap:16px; margin-top:16px">

            <mat-form-field appearance="outline">
              <mat-label>Usuario</mat-label>
              <input matInput formControlName="nombre_usuario" autocomplete="username" />
              <mat-error>Requerido</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Contraseña</mat-label>
              <input matInput type="password"
                     formControlName="contrasena"
                     autocomplete="current-password" />
              <mat-error>Requerido</mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">
              Ingresar
            </button>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrl: './login.scss',
})
export class LoginComponent {
  private fb    = inject(FormBuilder);
  private router = inject(Router);
  private snack  = inject(MatSnackBar);
  private audit  = inject(AuditContextService);
  private usuarioSvc = inject(UsuarioService);

  form = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena    : ['', Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) {
      this.snack.open('Completa todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    const { nombre_usuario } = this.form.getRawValue();

    // Busca el usuario en la lista para obtener su ID real
    this.usuarioSvc.list().subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(
          (u) => u.nombre_usuario === nombre_usuario
        );

        if (!usuario) {
          this.snack.open('Usuario no encontrado', 'Cerrar', { duration: 3000 });
          return;
        }

        // Guarda el ID en el contexto de auditoría
        this.audit.select(usuario.id_usuario);
        this.snack.open(`Bienvenido, ${usuario.nombre_usuario}`, 'OK', { duration: 2000 });

        setTimeout(() => this.router.navigate(['/app']), 800);
      },
      error: () => {
        this.snack.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
      },
    });
  }
}