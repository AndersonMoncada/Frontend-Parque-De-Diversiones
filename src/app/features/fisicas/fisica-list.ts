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
import { FisicaService } from '../../core/services/fisica.service';
import { FisicaRead } from '../../models/api.models';
import { FisicaDialogComponent } from './fisica-dialog';

@Component({
  selector: 'app-fisica-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './fisica-list.html',
})
export class FisicaListComponent implements AfterViewInit {
  private readonly svc = inject(FisicaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  displayedColumns = ['id_atraccion', 'acciones'];
  dataSource = new MatTableDataSource<FisicaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Error al cargar atracciones físicas', 'Cerrar');
      }
    });
  }

  nuevo() {
    this.dialog.open(FisicaDialogComponent, { width: '400px' })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: FisicaRead) {
    if (!confirm(`¿Eliminar atracción física ${row.id_atraccion}?`)) return;

    this.svc.delete(row.id_fisica).subscribe({
      next: () => {
        this.snack.open('Atracción eliminada correctamente', 'OK', { duration: 3000 });
        this.reload();
      },
      error: () => this.snack.open('Error al eliminar', 'Cerrar')
    });
  }
}