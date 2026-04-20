import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FisicaService } from '../../core/services/fisica.service';

@Component({
  selector: 'app-fisica-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './fisica-dialog.html',
})
export class FisicaDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(FisicaService);
  private dialogRef = inject(MatDialogRef);

  form = this.fb.group({
    id_atraccion: ['', Validators.required],
  });

  save() {
    if (this.form.invalid) return;
    this.svc.create(this.form.getRawValue()).subscribe(() => this.dialogRef.close(true));
  }

  cancel() { this.dialogRef.close(false); }
}