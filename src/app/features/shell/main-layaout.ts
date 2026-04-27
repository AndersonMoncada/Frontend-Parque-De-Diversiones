import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuditContextService } from '../../core/audit-context.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioRead } from '../../models/api.models';

const SIDEBAR_KEY = 'shell_sidebar_collapsed';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent implements OnInit, AfterViewInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  readonly audit: AuditContextService = inject(AuditContextService);
  readonly usuarios = signal<UsuarioRead[]>([]);

  /** Menú lateral estrecho (solo iconos) o ancho (icono + texto). */
  readonly sidebarCollapsed = signal(
    typeof localStorage !== 'undefined' && localStorage.getItem(SIDEBAR_KEY) === '1',
  );

readonly nav = [
  { path: '/app/usuarios', label: 'Usuarios', icon: 'people' },
  { path: '/app/titulares', label: 'Titulares', icon: 'badge' },
  { path: '/app/visitantes', label: 'Visitantes', icon: 'groups' },
  { path: '/app/entradas', label: 'Entradas', icon: 'confirmation_number' },
  { path: '/app/sedes', label: 'Sedes', icon: 'location_city' },
  { path: '/app/atracciones', label: 'Atracciones', icon: 'attractions' },
  { path: '/app/acuaticas', label: 'Acuáticas', icon: 'pool' },
  { path: '/app/electronicas', label: 'Electrónicas', icon: 'memory' },
  { path: '/app/mecanicas', label: 'Mecánicas', icon: 'precision_manufacturing' },
  { path: '/app/fisicas', label: 'Físicas', icon: 'fitness_center' },
];

  ngOnInit(): void {
    this.usuarioService.list().subscribe({
      next: (rows) => this.usuarios.set(rows),
      error: (err: HttpErrorResponse) =>
        this.snack.open(this.msg(err), 'Cerrar', { duration: 5000 }),
    });
  }

  toggleSidebar(): void {
    const next = !this.sidebarCollapsed();
    this.sidebarCollapsed.set(next);
    localStorage.setItem(SIDEBAR_KEY, next ? '1' : '0');
  }

  onUsuarioAudit(id: string): void {
    this.audit.select(id);
  }

  logout(): void {
    this.audit.clear();
    void this.router.navigateByUrl('/login');
  }

  private msg(err: HttpErrorResponse): string {
    const d = err.error?.detail;
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) return d.map((x) => x.msg ?? JSON.stringify(x)).join('; ');
    return err.message;
  }
}