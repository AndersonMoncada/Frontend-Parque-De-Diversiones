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
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';
import { UsuarioDialogComponent, UsuarioDialogData } from './usuario-dialog';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatSnackBarModule],
  templateUrl: './usuario-list.html',
})
export class UsuarioListComponent implements AfterViewInit {
  private readonly svc = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);
  private readonly snack = inject(MatSnackBar);

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
      error: (e: HttpErrorResponse) => { this.loading = false; this.snack.open('Error al cargar usuarios', 'Cerrar'); }
    });
  }

  nuevo() { this.openDialog('create'); }
  editar(row: UsuarioRead) { this.openDialog('edit', row); }
  
  eliminar(row: UsuarioRead) {
    if (!confirm(`¿Eliminar usuario ${row.nombre_usuario}?`)) return;

    this.svc.delete(row.id_usuario).subscribe({
      next: () => {
        this.snack.open('Usuario eliminado', 'OK', { duration: 3000 });
        this.reload();
      },
      error: () => this.snack.open('Error al eliminar', 'Cerrar')
    });
  }

  private openDialog(mode: 'create' | 'edit', row?: UsuarioRead) {
    this.dialog.open(UsuarioDialogComponent, {
      width: '480px',
      data: { mode, row }
    }).afterClosed().pipe(filter(Boolean)).subscribe(() => this.reload());
  }
}