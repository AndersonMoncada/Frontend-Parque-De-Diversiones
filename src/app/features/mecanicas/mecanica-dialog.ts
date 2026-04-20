import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MecanicaService } from '../../core/services/mecanica.service';

@Component({
  selector: 'app-mecanica-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './mecanica-dialog.html',
})
export class MecanicaDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(MecanicaService);
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