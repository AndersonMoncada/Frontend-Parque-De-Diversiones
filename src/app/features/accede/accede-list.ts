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

import { AccedeService } from '../../core/services/accede.service';
import { AccedeRead } from '../../models/api.models';
import { AccedeDialogComponent, AccedeDialogData } from './accede-dialog';

@Component({
  selector: 'app-accede-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './accede-list.html',
  styleUrl: './accede-list.scss',
})
export class AccedeListComponent implements AfterViewInit {
  private readonly svc = inject(AccedeService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'id_entrada',
    'id_atraccion',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<AccedeRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

reload(): void {
  const idEntrada = prompt('Ingrese ID de la entrada');

    if (!idEntrada) {
        this.loading = false;
        return;
    }

  this.loading = true;

  this.svc.getByEntrada(idEntrada).subscribe({
    next: (rows) => {
      this.dataSource.data = rows;
      this.loading = false;
    },
    error: (err: HttpErrorResponse) => {
      this.loading = false;
      this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 });
    },
  });
}

  nuevo(): void {
    this.open({ mode: 'create' });
  }

  private open(data: AccedeDialogData): void {
    this.dialog
      .open(AccedeDialogComponent, { width: '480px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

eliminar(row: AccedeRead): void {
  if (!confirm(`¿Eliminar relación?`)) return;

  this.svc.delete(row.id_entrada, row.id_atraccion).subscribe({
    next: () => {
      this.snack.open('Accede eliminado', 'OK', { duration: 3000 });
      this.reload();
    },
    error: (err: HttpErrorResponse) =>
      this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
  });
}

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}