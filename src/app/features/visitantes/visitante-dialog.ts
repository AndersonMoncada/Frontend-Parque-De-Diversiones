import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { VisitanteService } from '../../core/services/visitante.service';

export interface VisitanteDialogData { mode: 'create' | 'edit'; row?: any; }

@Component({
  selector: 'app-visitante-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './visitante-dialog.html',
})
export class VisitanteDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(VisitanteService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<VisitanteDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    nombre_visitante: ['', Validators.required],
    edad: [0, [Validators.required, Validators.min(0)]],
    estatura: [0, [Validators.required, Validators.min(0)]],
    id_titular: [''],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
    }
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create(value).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row.id_visitante, value).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}