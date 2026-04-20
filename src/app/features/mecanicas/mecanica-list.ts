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
import { MecanicaService } from '../../core/services/mecanica.service';
import { MecanicaRead } from '../../models/api.models';
import { MecanicaDialogComponent } from './mecanica-dialog';

@Component({
  selector: 'app-mecanica-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './mecanica-list.html',
})
export class MecanicaListComponent implements AfterViewInit {
  private readonly svc = inject(MecanicaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  displayedColumns = ['id_atraccion', 'acciones'];
  dataSource = new MatTableDataSource<MecanicaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar mecánicas', 'Cerrar'); }
    });
  }

  nuevo() {
    this.dialog.open(MecanicaDialogComponent, { width: '400px' })
      .afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}