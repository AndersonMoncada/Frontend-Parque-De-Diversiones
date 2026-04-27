import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TitularService } from '../../core/services/titular.service';
import { TitularRead } from '../../models/api.models';

export interface TitularDialogData { mode: 'create' | 'edit'; row?: TitularRead; }

@Component({
  selector: 'app-titular-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule,
            MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo' : 'Editar' }} Titular</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Cédula</mat-label>
          <input matInput formControlName="cedula" />
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
  private fb = inject(FormBuilder);
  private svc = inject(TitularService);
  private dialogRef = inject(MatDialogRef);
  readonly data = inject<TitularDialogData>(MAT_DIALOG_DATA);

  private readonly USER_ID = 'sistema';

  form = this.fb.group({
    nombre: ['', Validators.required],
    cedula: ['', Validators.required],
    telefono: [''],
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
        nombre: v.nombre!,
        cedula: v.cedula!,
        telefono: v.telefono ?? null,
        id_usuario_creacion: this.USER_ID,
      }).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row!.id_titular, {
        nombre: v.nombre ?? undefined,
        telefono: v.telefono ?? undefined,
      }).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}