import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FisicaService } from '../../core/services/fisica.service';
import { FisicaRead } from '../../models/api.models';


export interface FisicaDialogData { mode: 'create' | 'edit'; row?: FisicaRead; }

@Component({
  selector: 'app-fisica-dialog',
  standalone: true,
  imports: [
 
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva' : 'Editar' }} Física</h2>
    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">
        <mat-form-field>
          <mat-label>ID Atracción</mat-label>
          <input matInput formControlName="id_atraccion" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class FisicaDialogComponent {
  private fb = inject(FormBuilder);
  private svc = inject(FisicaService);
  private dialogRef = inject(MatDialogRef);
  readonly data = inject<FisicaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    id_atraccion: ['', Validators.required],
  });

  constructor() {
    if (this.data.mode === 'edit' && this.data.row) {
      this.form.patchValue(this.data.row);
      this.form.get('id_atraccion')?.disable();
    }
  }

  save() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();

    if (this.data.mode === 'create') {
      this.svc.create({
        id_atraccion: v.id_atraccion!,
      }).subscribe(() => this.dialogRef.close(true));
    } else {
      // Física no tiene update en el modelo, solo create/delete
      this.dialogRef.close(true);
    }
  }

  cancel() { this.dialogRef.close(false); }
}