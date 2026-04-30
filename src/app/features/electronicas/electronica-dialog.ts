import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ElectronicaService } from '../../core/services/electronica.service';

export interface ElectronicaDialogData {
  mode: 'create' | 'edit';
  row?: any;
}

@Component({
  selector: 'app-electronica-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './electronica-dialog.html',
})
export class ElectronicaDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(ElectronicaService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<ElectronicaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.nonNullable.group({
    id_atraccion: ['', Validators.required],
    experiencia: ['', Validators.required],
    equipamiento: [''],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
      this.form.get('id_atraccion')?.disable();
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create({
        id_atraccion: v.id_atraccion,
        experiencia: v.experiencia,
        equipamiento: v.equipamiento || null,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 })
      });
    } else {
      this.svc.update(this.data.row.id_electronica, {
        experiencia: v.experiencia,
        equipamiento: v.equipamiento || null,
      }).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 })
      });
    }
  }

  cancel() { this.dialogRef.close(false); }

  private msg(err: any): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x: any) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message || 'Error al guardar';
  }
}