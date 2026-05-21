import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { filter } from 'rxjs/operators';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';
import { UsuarioDialogComponent, UsuarioDialogData } from './usuario-dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px">
      <h2>Usuarios</h2>
      <button mat-raised-button color="primary" (click)="nuevo()">
        <mat-icon>add</mat-icon> Nuevo
      </button>
    </div>

    <div style="text-align:center" *ngIf="loading">
      <mat-spinner diameter="40"></mat-spinner>
    </div>

    <table mat-table [dataSource]="dataSource" *ngIf="!loading"
           class="mat-elevation-z2" style="width:100%">

      <ng-container matColumnDef="nombre_usuario">
        <th mat-header-cell *matHeaderCellDef>Usuario</th>
        <td mat-cell *matCellDef="let r">{{ r.nombre_usuario }}</td>
      </ng-container>

      <ng-container matColumnDef="rol">
        <th mat-header-cell *matHeaderCellDef>Rol</th>
        <td mat-cell *matCellDef="let r">{{ r.rol }}</td>
      </ng-container>

      <ng-container matColumnDef="activo">
        <th mat-header-cell *matHeaderCellDef>Estado</th>
        <td mat-cell *matCellDef="let r">{{ r.activo ? 'Activo' : 'Inactivo' }}</td>
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
  `,
})
export class UsuarioListComponent implements AfterViewInit {
  private readonly svc    = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snack  = inject(MatSnackBar);

  displayedColumns = ['nombre_usuario', 'rol', 'activo', 'acciones'];
  dataSource = new MatTableDataSource<UsuarioRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar usuarios', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: UsuarioRead) { this.openDialog('edit', row); }

  eliminar(row: UsuarioRead) {
    if (!confirm(`¿Eliminar usuario ${row.nombre_usuario}?`)) return;
    this.svc.delete(row.id_usuario).subscribe({
      next: () => { this.snack.open('Usuario eliminado', 'OK', { duration: 3000 }); this.reload(); },
      error: () => this.snack.open('Error al eliminar', 'Cerrar'),
    });
  }

  private openDialog(mode: 'create' | 'edit', row?: UsuarioRead) {
    this.dialog.open(UsuarioDialogComponent, {
      width: '500px',
      data: { mode, row } as UsuarioDialogData,
    }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}