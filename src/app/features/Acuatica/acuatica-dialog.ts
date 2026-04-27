import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AcuaticaService } from '../../core/services/Acuatica.service';
import { AcuaticaRead } from '../../models/api.models';

export interface AcuaticaDialogData { mode: 'create' | 'edit'; row?: AcuaticaRead; }

@Component({
  selector: 'app-acuatica-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Nueva' : 'Editar' }} Acuática</h2>

    <mat-dialog-content>
      <form [formGroup]="form"
            style="display:flex; flex-direction:column; gap:12px; padding-top:8px">

        @if (data.mode === 'create') {
          <mat-form-field>
            <mat-label>ID Atracción</mat-label>
            <input matInput formControlName="id_atraccion" />
          </mat-form-field>
        }

        <mat-form-field>
          <mat-label>Profundidad</mat-label>
          <input matInput type="number" formControlName="profundidad" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Capacidad</mat-label>
          <input matInput type="number" formControlName="capacidad" />
        </mat-form-field>

        <mat-form-field>
          <mat-label>Propulsión</mat-label>
          <input matInput formControlName="propulsion" />
        </mat-form-field>

      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class AcuaticaDialogComponent {
  private fb        = inject(FormBuilder);
  private svc       = inject(AcuaticaService);
  private dialogRef = inject(MatDialogRef);
  readonly data     = inject<AcuaticaDialogData>(MAT_DIALOG_DATA);

  form = this.fb.group({
    id_atraccion: ['', Validators.required],
    profundidad : [0,  Validators.required],
    capacidad   : [0,  Validators.required],
    propulsion  : ['', Validators.required],
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
        profundidad : v.profundidad!,
        capacidad   : v.capacidad!,
        propulsion  : v.propulsion!,
      }).subscribe(() => this.dialogRef.close(true));
    } else {
      this.svc.update(this.data.row!.id_acuatica, {
        profundidad: v.profundidad ?? undefined,
        capacidad  : v.capacidad   ?? undefined,
        propulsion : v.propulsion  ?? undefined,
      }).subscribe(() => this.dialogRef.close(true));
    }
  }

  cancel() { this.dialogRef.close(false); }
}