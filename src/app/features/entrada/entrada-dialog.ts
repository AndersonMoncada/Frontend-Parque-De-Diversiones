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
import { AuditContextService } from '../../core/audit-context.service';
import { EntradaRead } from '../../models/api.models';

export interface EntradaDialogData {
  mode: 'create' | 'edit';
  row?: EntradaRead;
}

@Component({
  selector: 'app-entrada-dialog',
  standalone: true,
  imports: [
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
          <mat-error>Requerido</mat-error>
        </mat-form-field>

        @if (data.mode === 'create') {
          <mat-form-field>
            <mat-label>ID Titular (UUID)</mat-label>
            <input matInput formControlName="id_titular" />
            <mat-error>Requerido</mat-error>
          </mat-form-field>
        }

        <mat-slide-toggle formControlName="reingreso">
          Permite reingreso
        </mat-slide-toggle>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class EntradaDialogComponent {
  private readonly fb        = inject(FormBuilder);
  private readonly svc       = inject(EntradaService);
  private readonly audit     = inject(AuditContextService);
  private readonly dialogRef = inject(MatDialogRef<EntradaDialogComponent, boolean>);
  private readonly snack     = inject(MatSnackBar);

  readonly data = inject<EntradaDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    codigo    : ['', Validators.required],
    precio    : [0,  Validators.required],
    reingreso : [false],
    id_titular: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue({
        precio   : this.data.row.precio,
        reingreso: this.data.row.reingreso,
      });
      this.form.get('codigo')?.disable();
      this.form.get('id_titular')?.disable();
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const uid = this.audit.usuarioId();
    if (!uid) {
      this.snack.open('Sesión no encontrada', 'Cerrar', { duration: 3000 });
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      // Formato datetime completo que espera el backend
      const fechaAhora = new Date().toISOString(); // "2026-04-27T21:00:00.000Z"

      this.svc.create({
        codigo              : v.codigo,
        precio              : v.precio,
        reingreso           : v.reingreso,
        id_titular          : v.id_titular,
        id_usuario_creacion : uid,
        fecha               : fechaAhora,
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });

    } else {
      this.svc.update(this.data.row!.id_entrada, {
        precio   : v.precio,
        reingreso: v.reingreso,
      }).subscribe({
        next : () => this.dialogRef.close(true),
        error: (err: HttpErrorResponse) =>
          this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
      });
    }
  }

  cancel(): void { this.dialogRef.close(false); }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}