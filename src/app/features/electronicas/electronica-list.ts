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
import { ElectronicaService } from '../../core/services/electronica.service';
import { ElectronicaRead } from '../../models/api.models';
import { ElectronicaDialogComponent, ElectronicaDialogData } from './electronica-dialog';

@Component({
  selector: 'app-electronica-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './electronica-list.html',
})
export class ElectronicaListComponent implements AfterViewInit {
  private readonly svc = inject(ElectronicaService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

  displayedColumns = ['id_atraccion', 'experiencia', 'equipamiento', 'acciones'];
  dataSource = new MatTableDataSource<ElectronicaRead>([]);
  loading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() { this.dataSource.paginator = this.paginator; }

  constructor() { this.reload(); }

  reload() {
    this.loading = true;
    this.svc.list().subscribe({
      next: (data) => { this.dataSource.data = data; this.loading = false; },
      error: () => { this.loading = false; this.snack.open('Error al cargar electrónicas', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: ElectronicaRead) { this.openDialog('edit', row); }

  private openDialog(mode: 'create' | 'edit', row?: ElectronicaRead) {
    this.dialog.open(ElectronicaDialogComponent, { width: '500px', data: { mode, row } })
      .afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}