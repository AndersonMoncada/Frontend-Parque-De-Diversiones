import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';

export interface UsuarioDialogData { mode: 'create' | 'edit'; row?: UsuarioRead; }

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule,
            MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo' : 'Editar' }} Usuario</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field>
          <mat-label>Nombre de usuario</mat-label>
          <input matInput formControlName="nombre_usuario" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Contraseña</mat-label>
          <input matInput type="password" formControlName="contrasena" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Rol</mat-label>
          <mat-select formControlName="rol">
            <mat-option value="admin">Admin</mat-option>
            <mat-option value="usuario">Usuario</mat-option>
          </mat-select>
        </mat-form-field>
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
  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena: [''],
    rol: ['usuario', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
    }
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc.create({
        nombre_usuario: v.nombre_usuario!,
        contrasena: v.contrasena ?? '',
        rol: v.rol ?? 'usuario',
      }).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row!.id_usuario, {
        nombre_usuario: v.nombre_usuario ?? undefined,
        contrasena: v.contrasena ?? undefined,
        rol: v.rol ?? undefined,
      }).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}