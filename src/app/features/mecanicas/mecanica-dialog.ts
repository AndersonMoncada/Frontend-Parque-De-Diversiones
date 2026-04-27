import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MecanicaService } from '../../core/services/mecanica.service';
import { MecanicaRead } from '../../models/api.models';

export interface MecanicaDialogData { mode: 'create' | 'edit'; row?: MecanicaRead; }

@Component({
  selector: 'app-mecanica-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>Nueva Mecánica</h2>

    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">
        <mat-form-field>
          <mat-label>ID Atracción</mat-label>
          <input matInput formControlName="id_atraccion" />
          <mat-error>Requerido</mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">
        Guardar
      </button>
    </mat-dialog-actions>
  `,
})
export class MecanicaDialogComponent {
  private fb         = inject(FormBuilder);
  private svc        = inject(MecanicaService);
  private dialogRef  = inject(MatDialogRef);
  readonly data      = inject<MecanicaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    id_atraccion: ['', Validators.required],
  });

  constructor() {
    if (this.data?.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
      this.form.get('id_atraccion')?.disable();
    }
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    this.svc.create({
      id_atraccion: v.id_atraccion!,
    }).subscribe(() => this.dialogRef.close(true));
  }

  cancel() { this.dialogRef.close(false); }
}