import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';

export interface UsuarioDialogData {
  mode: 'create' | 'edit';
  row?: any;
}

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 16px; padding-top: 8px;">
        <mat-form-field appearance="outline">
          <mat-label>Nombre de Usuario</mat-label>
          <input matInput formControlName="nombre_usuario" />
        </mat-form-field>

        <mat-form-field appearance="outline" *ngIf="data.mode === 'create'">
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="contrasena" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rol">
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="usuario">Usuario</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-slide-toggle *ngIf="data.mode === 'edit'" formControlName="activo" color="primary">
          Activo
        </mat-slide-toggle>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class UsuarioDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(UsuarioService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  form = this.fb.nonNullable.group({
    nombre_usuario: ['', Validators.required],
    contrasena: [''],
    rol: ['usuario', Validators.required],
    activo: [true],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        nombre_usuario: this.data.row.nombre_usuario,
        rol: this.data.row.rol,
        activo: this.data.row.activo ?? true,
      });
      this.form.get('contrasena')?.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create({
        nombre_usuario: v.nombre_usuario,
        contrasena: v.contrasena || '123456',
        rol: v.rol,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 })
      });
          } else {
      const updatePayload = {
        nombre_usuario: v.nombre_usuario,
        rol: v.rol,
        activo: v.activo,
        id_usuario_edita: this.data.row.id_usuario   // ← Campo obligatorio según tu backend
      };

      console.log('Payload enviado al update:', updatePayload);

      this.svc.update(this.data.row.id_usuario, updatePayload).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) => {
          console.error('Error completo del backend:', err.error);
          this.snack.open(this.msg(err), 'Cerrar', { duration: 8000 });
        }
      });
    }
  }

  cancel() { this.dialogRef.close(false); }

  private msg(err: any): string {
    const detail = err.error?.detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((x: any) => x.msg || JSON.stringify(x)).join(', ');
    }
    return err.message || 'Error al guardar el usuario';
  }
}