import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitanteService } from '../../core/services/visitante.service';
import { VisitanteRead } from '../../models/api.models';

export interface VisitanteDialogData { mode: 'create' | 'edit'; row?: VisitanteRead; }

@Component({
  selector: 'app-visitante-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule,
            MatFormFieldModule, MatInputModule, MatSnackBarModule],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nuevo' : 'Editar' }} Visitante</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display:flex;flex-direction:column;gap:12px;padding-top:8px">
        <mat-form-field>
          <mat-label>Nombre visitante</mat-label>
          <input matInput formControlName="nombre_visitante" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Edad</mat-label>
          <input matInput type="number" formControlName="edad" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>Estatura (cm)</mat-label>
          <input matInput type="number" formControlName="estatura" />
        </mat-form-field>
        <mat-form-field>
          <mat-label>ID Titular</mat-label>
          <input matInput formControlName="id_titular" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class VisitanteDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(VisitanteService);
  private dialogRef = inject(MatDialogRef);
  readonly data = inject<VisitanteDialogData>(MAT_DIALOG_DATA);

  // ID fijo temporal hasta conectar auth real
  private readonly USER_ID = 'sistema';

  form = this.fb.group({
    nombre_visitante: ['', Validators.required],
    edad: [0, [Validators.required, Validators.min(0)]],
    estatura: [0, [Validators.required, Validators.min(0)]],
    id_titular: ['', Validators.required],
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
        nombre_visitante: v.nombre_visitante!,
        edad: v.edad!,
        estatura: v.estatura!,
        id_titular: v.id_titular!,
        id_usuario_creacion: this.USER_ID,
      }).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row!.id_visitante, {
        nombre_visitante: v.nombre_visitante ?? undefined,
        edad: v.edad ?? undefined,
        estatura: v.estatura ?? undefined,
        id_usuario_edita: this.USER_ID,
      }).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}