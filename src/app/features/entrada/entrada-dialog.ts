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
import { EntradaService } from '../../core/services/entrada.service';
import { EntradaRead } from '../../models/api.models';

export interface EntradaDialogData {
  mode: 'create' | 'edit';
  row?: EntradaRead;
}

@Component({
  selector: 'app-entrada-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './entrada-dialog.html',
})
export class EntradaDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EntradaService);
  private readonly audit = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<EntradaDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<EntradaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    codigo: ['', Validators.required],
    precio: [0, Validators.required],
    reingreso: [false],
    id_titular: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      const r = this.data.row;
      this.form.patchValue({
        codigo: r.codigo,
        precio: r.precio,
        reingreso: r.reingreso,
        id_titular: r.id_titular,
        
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
  
private msg(err: HttpErrorResponse): string {
  const d = err.error?.detail;
  if (typeof d === 'string') return d;
  if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
  return err.message;
}

save(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const uid = this.audit.usuarioId();
  if (!uid) {
    this.snack.open('Seleccione usuario en la barra superior.', 'OK');
    return;
  }

  const v = this.form.getRawValue();

  if (this.data.mode === 'create') {
    this.svc
      .create({
        codigo: v.codigo,
        precio: v.precio,
        reingreso: v.reingreso,
        id_titular: v.id_titular,
        id_usuario_creacion: uid,
      })
      .subscribe({
        next: () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    return;
  }
  

  this.svc
    .update(this.data.row!.id_entrada, {
      codigo: v.codigo,
      precio: v.precio,
      reingreso: v.reingreso,
      id_titular: v.id_titular,
      id_usuario_edita: uid,
    })
    .subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
}
}