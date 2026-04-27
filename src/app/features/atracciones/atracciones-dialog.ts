import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AtraccionService } from '../../core/services/atracciones.service';
import { AtraccionRead } from '../../models/api.models';
import { CommonModule } from '@angular/common';

export interface AtraccionDialogData {
  mode: 'create' | 'edit';
  row?: AtraccionRead;
}

@Component({
  selector: 'app-atraccion-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva' : 'Editar' }} Atracción</h2>

    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">

        <mat-form-field>
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Edad mínima</mat-label>
          <input matInput type="number" formControlName="edad_minima" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Estatura mínima (cm)</mat-label>
          <input matInput type="number" formControlName="estatura_minima" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        <mat-form-field *ngIf="data.mode === 'create'">
          <mat-label>ID Sede</mat-label>
          <input matInput formControlName="id_sede" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class AtraccionDialogComponent {
  private readonly fb        = inject(FormBuilder);
  private readonly svc       = inject(AtraccionService);
  private readonly dialogRef = inject(MatDialogRef<AtraccionDialogComponent, boolean>);
  private readonly snack     = inject(MatSnackBar);

  readonly data = inject<AtraccionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre         : ['', Validators.required],
    edad_minima    : [0,  Validators.required],
    estatura_minima: [0,  Validators.required],
    id_sede        : ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
      this.form.get('id_sede')?.disable();
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create({
        nombre         : v.nombre,
        edad_minima    : v.edad_minima,
        estatura_minima: v.estatura_minima,
        id_sede        : v.id_sede,
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    this.svc.update(this.data.row!.id_atraccion, {
      nombre         : v.nombre,
      edad_minima    : v.edad_minima,
      estatura_minima: v.estatura_minima,
    }).subscribe({
      next : () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}