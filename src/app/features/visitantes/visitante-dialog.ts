import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitanteService } from '../../core/services/visitante.service';
import { AuditContextService } from '../../core/audit-context.service';

export interface VisitanteDialogData {
  mode: 'create' | 'edit';
  row?: any;
}

@Component({
  selector: 'app-visitante-dialog',
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
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo' : 'Editar' }} Visitante</h2>
    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">
        <mat-form-field>
          <mat-label>Nombre visitante</mat-label>
          <input matInput formControlName="nombre_visitante" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Edad</mat-label>
          <input matInput type="number" formControlName="edad" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Estatura (cm)</mat-label>
          <input matInput type="number" formControlName="estatura" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
        @if (data.mode === 'create') {
          <mat-form-field>
            <mat-label>ID Titular</mat-label>
            <input matInput formControlName="id_titular" />
            <mat-error>Requerido</mat-error>
          </mat-form-field>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class VisitanteDialogComponent {
  private fb        = inject(FormBuilder);
  private svc       = inject(VisitanteService);
  private dialogRef = inject(MatDialogRef);
  private snack     = inject(MatSnackBar);
  private audit     = inject(AuditContextService);

  readonly data = inject<VisitanteDialogData>(MAT_DIALOG_DATA);

  form = this.fb.nonNullable.group({
    nombre_visitante: ['', Validators.required],
    edad            : [0,  [Validators.required, Validators.min(0)]],
    estatura        : [0,  [Validators.required, Validators.min(0)]],
    id_titular      : ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        nombre_visitante: this.data.row.nombre_visitante,
        edad            : this.data.row.edad,
        estatura        : this.data.row.estatura,
      });
      // En edición id_titular no se cambia
      this.form.get('id_titular')?.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v   = this.form.getRawValue();
    const uid = this.audit.usuarioId();

    if (!uid) {
      this.snack.open('Sesión no encontrada', 'Cerrar', { duration: 3000 });
      return;
    }

    if (this.data.mode === 'create') {
      this.svc.create({
        nombre_visitante    : v.nombre_visitante,
        edad                : v.edad,
        estatura            : v.estatura,
        id_titular          : v.id_titular,
        id_usuario_creacion : uid,  // ← UUID real
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    } else {
      this.svc.update(this.data.row.id_visitante, {
        nombre_visitante : v.nombre_visitante,
        edad             : v.edad,
        estatura         : v.estatura,
        id_usuario_edita : uid,  // ← UUID real
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