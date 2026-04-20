import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AccedeService } from '../../core/services/accede.service';
import { AccedeRead } from '../../models/api.models';

export interface AccedeDialogData {
  mode: 'create'; 
  row?: AccedeRead;
}

@Component({
  selector: 'app-accede-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './accede-dialog.html',
})
export class AccedeDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(AccedeService);
  private readonly dialogRef = inject(MatDialogRef<AccedeDialogComponent, boolean>);
  private readonly snack = inject(MatSnackBar);

  readonly data = inject<AccedeDialogData>(MAT_DIALOG_DATA);

  readonly form = this.fb.nonNullable.group({
    id_entrada: ['', Validators.required],
    id_atraccion: ['', Validators.required],
  });

  cancel(): void {
    this.dialogRef.close(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    this.svc
      .create({
        id_entrada: v.id_entrada,
        id_atraccion: v.id_atraccion,
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