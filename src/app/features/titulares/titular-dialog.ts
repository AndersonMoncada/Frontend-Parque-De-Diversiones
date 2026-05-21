import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TitularService } from '../../core/services/titular.service';
import { TitularRead } from '../../models/api.models';
import { AuditContextService } from '../../core/audit-context.service';

export interface TitularDialogData { mode: 'create' | 'edit'; row?: TitularRead; }

@Component({
  selector: 'app-titular-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo' : 'Editar' }} Titular</h2>
    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cédula</mat-label>
          <input matInput formControlName="cedula" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="telefono" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class TitularDialogComponent {
  private fb       = inject(FormBuilder);
  private svc      = inject(TitularService);
  private dialogRef = inject(MatDialogRef);
  private snack    = inject(MatSnackBar);
  private audit    = inject(AuditContextService);

  readonly data = inject<TitularDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    nombre  : ['', Validators.required],
    cedula  : ['', Validators.required],
    telefono: [''],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
    }
  }

  save() {
    if (this.form.invalid) return;

    const v   = this.form.getRawValue();
    const uid = this.audit.usuarioId();

    if (!uid) {
      this.snack.open('Sesión no encontrada', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.data.mode === 'create') {
      this.svc.create({
        nombre              : v.nombre!,
        cedula              : v.cedula!,
        telefono            : v.telefono ?? null,
        id_usuario_creacion : uid,   // ← UUID real del usuario logueado
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row!.id_titular, {
        nombre  : v.nombre   ?? undefined,
        telefono: v.telefono ?? undefined,
         id_usuario_edita: uid, 
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    }
  }

  cancel() { this.dialogRef.close(false); }

  private msg(err: any): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message || 'Error';
  }
}