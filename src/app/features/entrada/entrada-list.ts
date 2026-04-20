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

import { EntradaService } from '../../core/services/entrada.service';
import { EntradaRead } from '../../models/api.models';
import { EntradaDialogComponent, EntradaDialogData } from './entrada-dialog';

@Component({
  selector: 'app-entrada-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './entrada-list.html',
  styleUrl: './entrada-list.scss',
})
export class EntradaListComponent implements AfterViewInit {
  private readonly svc = inject(EntradaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  readonly displayedColumns = [
    'codigo',
    'precio',
    'reingreso',
    'id_titular',
    'fecha',
    'acciones',
  ];
  readonly dataSource = new MatTableDataSource<EntradaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  constructor() {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.svc.list().subscribe({
      next: (rows: EntradaRead[]) => {
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

  editar(row: EntradaRead): void {
    this.open({ mode: 'edit', row });
  }

  private open(data: EntradaDialogData): void {
    this.dialog
      .open(EntradaDialogComponent, { width: '480px', data })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.reload());
  }

  eliminar(row: EntradaRead): void {
    if (!confirm(`¿Eliminar entrada ${row.codigo}?`)) return;
    this.svc.delete(row.id_entrada).subscribe({
      next: () => {
        this.snack.open('Entrada eliminada', 'OK', { duration: 3000 });
        this.reload();
      },
      error: (err: HttpErrorResponse) => this.snack.open(this.msg(err), 'Cerrar', { duration: 6000 }),
    });
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}