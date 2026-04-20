import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { filter } from 'rxjs/operators';
import { TitularService } from '../../core/services/titular.service';
import { TitularRead } from '../../models/api.models';
import { TitularDialogComponent, TitularDialogData } from './titular-dialog';

@Component({
  selector: 'app-titular-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './titular-list.html',
})
export class TitularListComponent implements AfterViewInit {
  private readonly svc = inject(TitularService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  displayedColumns = ['nombre', 'cedula', 'telefono', 'acciones'];
  dataSource = new MatTableDataSource<TitularRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar titulares', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: TitularRead) { this.openDialog('edit', row); }

  eliminar(row: TitularRead) {
    if (!confirm(`¿Eliminar usuario ${row.nombre}?`)) return;

    this.svc.delete(row.id_titular).subscribe({
      next: () => {
        this.snack.open('titular eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: () => this.snack.open('Error al eliminar', 'Cerrar')
    });
  }
  private openDialog(mode: 'create' | 'edit', row?: TitularRead) {
    this.dialog.open(TitularDialogComponent, {
      width: '500px',
      data: { mode, row }
    }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}