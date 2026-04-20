import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TitularService } from '../../core/services/titular.service';

export interface TitularDialogData { mode: 'create' | 'edit'; row?: any; }

@Component({
  selector: 'app-titular-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './titular-dialog.html',
})
export class TitularDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(TitularService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<TitularDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    nombre: ['', Validators.required],
    cedula: ['', Validators.required],
    telefono: [''],
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
      this.svc.update(this.data.row.id_titular, value).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}