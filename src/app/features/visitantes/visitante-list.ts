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
import { VisitanteService } from '../../core/services/visitante.service';
import { VisitanteRead } from '../../models/api.models';
import { VisitanteDialogComponent, VisitanteDialogData } from './visitante-dialog';

@Component({
  selector: 'app-visitante-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './visitante-list.html',
})
export class VisitanteListComponent implements AfterViewInit {
  private readonly svc = inject(VisitanteService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  displayedColumns = ['nombre_visitante', 'edad', 'estatura', 'id_titular', 'acciones'];
  dataSource = new MatTableDataSource<VisitanteRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar visitantes', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: VisitanteRead) { this.openDialog('edit', row); }

  private openDialog(mode: 'create' | 'edit', row?: VisitanteRead) {
    this.dialog.open(VisitanteDialogComponent, {
      width: '520px',
      data: { mode, row }
    }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}