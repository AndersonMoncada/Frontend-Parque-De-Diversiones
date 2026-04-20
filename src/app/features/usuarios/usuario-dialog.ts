import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UsuarioService } from '../../core/services/usuario.service';

export interface UsuarioDialogData { mode: 'create' | 'edit'; row?: any; }

@Component({
  selector: 'app-usuario-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule],
  templateUrl: './usuario-dialog.html',
})
export class UsuarioDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(UsuarioService);
  private dialogRef = inject(MatDialogRef);
  private snack = inject(MatSnackBar);
  readonly data = inject<UsuarioDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    nombre_usuario: ['', Validators.required],
    contrasena: [''],
    rol: ['usuario', Validators.required],
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
      this.svc.update(this.data.row.id_usuario, value).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}