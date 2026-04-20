import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuditContextService } from '../../core/audit-context.service';
import { AtraccionService } from '../../core/services/atracciones.service';
import { AtraccionRead } from '../../models/api.models';

export interface AtraccionDialogData {
  mode: 'create' | 'edit';
  row?: AtraccionRead;
}

@Component({
  selector: 'app-atraccion-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  ],
  templateUrl: './atracciones-dialog.html',
})
export class AtraccionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(AtraccionService);
  private readonly dialogRef = inject(MatDialogRef<AtraccionDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<AtraccionDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    edad_minima: [0, Validators.required],
    estatura_minima: [0, Validators.required],
    id_sede: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        nombre: r.nombre,
        edad_minima: r.edad_minima,
        estatura_minima: r.estatura_minima,
        id_sede: r.id_sede,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const v = this.form.getRawValue();

  if (this.data.mode === 'create') {
    this.svc
      .create({
        nombre: v.nombre,
        edad_minima: v.edad_minima,
        estatura_minima: v.estatura_minima,
        id_sede: v.id_sede,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    return;
  }

  this.svc
    .update(this.data.row!.id_atraccion, {
      nombre: v.nombre,
      edad_minima: v.edad_minima,
      estatura_minima: v.estatura_minima,
      // ⚠ id_sede normalmente no se actualiza (según tu API)
    })
    .subscribe({
      next: () => this.dialogRef.close(true),
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