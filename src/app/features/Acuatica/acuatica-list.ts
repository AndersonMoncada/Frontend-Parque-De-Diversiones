import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { AcuaticaService } from '../../core/services/Acuatica.service';
import { AcuaticaRead } from '../../models/api.models';
import { AcuaticaDialogComponent, AcuaticaDialogData } from './acuatica-dialog';

@Component({
  selector: 'app-acuatica-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
      <h2>Atracciones Acuáticas</h2>
      <button mat-raised-button color="primary" (click)="nuevo()">
        <mat-icon>add</mat-icon> Nueva
      </button>
    </div>

    @if (loading) {
      <div style="text-align:center">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
    } @else {
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z2" style="width:100%">

        <ng-container matColumnDef="id_atraccion">
          <th mat-header-cell *matHeaderCellDef>ID Atracción</th>
          <td mat-cell *matCellDef="let r">{{ r.id_atraccion }}</td>
        </ng-container>

        <ng-container matColumnDef="profundidad">
          <th mat-header-cell *matHeaderCellDef>Profundidad</th>
          <td mat-cell *matCellDef="let r">{{ r.profundidad }}</td>
        </ng-container>

        <ng-container matColumnDef="capacidad">
          <th mat-header-cell *matHeaderCellDef>Capacidad</th>
          <td mat-cell *matCellDef="let r">{{ r.capacidad }}</td>
        </ng-container>

        <ng-container matColumnDef="propulsion">
          <th mat-header-cell *matHeaderCellDef>Propulsión</th>
          <td mat-cell *matCellDef="let r">{{ r.propulsion }}</td>
        </ng-container>

        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let r">
            <button mat-icon-button (click)="editar(r)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminar(r)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let r; columns: displayedColumns"></tr>
      </table>

      <mat-paginator [pageSizeOptions]="[10, 25, 50]" showFirstLastButtons></mat-paginator>
    }
  `,
})
export class AcuaticaListComponent implements AfterViewInit {
  private readonly svc    = inject(AcuaticaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack  = inject(MatSnackBar);

  displayedColumns = ['id_atraccion', 'profundidad', 'capacidad', 'propulsion', 'acciones'];
  dataSource = new MatTableDataSource<AcuaticaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: AcuaticaRead) { this.openDialog('edit', row); }

  eliminar(row: AcuaticaRead) {
    if (!confirm('¿Eliminar acuática?')) return;
    this.svc.delete(row.id_acuatica).subscribe({
      next: () => { this.snack.open('Eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: () => this.snack.open('Error al eliminar', 'Cerrar')
    });
  }

  private openDialog(mode: 'create' | 'edit', row?: AcuaticaRead) {
    this.dialog.open(AcuaticaDialogComponent, {
      width: '500px',
      data: { mode, row } as AcuaticaDialogData
    }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}