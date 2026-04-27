import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EntradaService } from '../../core/services/entrada.service';
import { EntradaRead } from '../../models/api.models';
import { CommonModule } from '@angular/common';

export interface EntradaDialogData {
  mode: 'create' | 'edit';
  row?: EntradaRead;
}

@Component({
  selector: 'app-entrada-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva' : 'Editar' }} Entrada</h2>
    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">

        @if (data.mode === 'create') {
          <mat-form-field>
            <mat-label>Código</mat-label>
            <input matInput formControlName="codigo" />
            <mat-error>Requerido</mat-error>
          </mat-form-field>
}

        <mat-form-field>
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="precio" />
        </mat-form-field>

        <mat-form-field *ngIf="data.mode === 'create'">
          <mat-label>ID Titular</mat-label>
          <input matInput formControlName="id_titular" />
        </mat-form-field>

        <mat-form-field *ngIf="data.mode === 'create'">
          <mat-label>ID Usuario Creación</mat-label>
          <input matInput formControlName="id_usuario_creacion" />
        </mat-form-field>

        <label style="display:flex; align-items:center; gap:8px">
          <mat-slide-toggle formControlName="reingreso">Reingreso</mat-slide-toggle>
        </label>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class EntradaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EntradaService);
  private readonly dialogRef = inject(MatDialogRef<EntradaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EntradaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    codigo: ['', Validators.required],
    precio: [0, Validators.required],
    reingreso: [false],
    id_titular: ['', Validators.required],
    id_usuario_creacion: ['sistema'],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        precio: this.data.row.precio,
        reingreso: this.data.row.reingreso,
      });
      // En edición estos campos no se usan
      this.form.get('codigo')?.disable();
      this.form.get('id_titular')?.disable();
      this.form.get('id_usuario_creacion')?.disable();
    }
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      // Genera fecha actual en formato ISO
      const fechaHoy = new Date().toISOString().split('T')[0];

      this.svc.create({
        codigo: v.codigo,
        precio: v.precio,
        reingreso: v.reingreso,
        id_titular: v.id_titular,
        id_usuario_creacion: v.id_usuario_creacion,
        fecha: fechaHoy,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
      return;
    }

    // Solo precio y reingreso son editables según EntradaUpdate
    this.svc.update(this.data.row!.id_entrada, {
      precio: v.precio,
      reingreso: v.reingreso,
    }).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}