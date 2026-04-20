import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ElectronicaService } from '../../core/services/electronica.service';

export interface ElectronicaDialogData { mode: 'create' | 'edit'; row?: any; }

@Component({
  selector: 'app-electronica-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './electronica-dialog.html',
})
export class ElectronicaDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(ElectronicaService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<ElectronicaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    id_atraccion: ['', Validators.required],
    experiencia: ['', Validators.required],
    equipamiento: [''],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) this.form.patchValue(this.data.row);
  }

  save() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    if (this.data.mode === 'create') {
      this.svc.create(value).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row.id_electronica, value).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}