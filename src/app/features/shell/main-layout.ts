import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary">
      <span>🎡 Parque de Diversiones</span>
      <span style="flex:1"></span>
      <button mat-button (click)="logout()">
        <mat-icon>logout</mat-icon> Salir
      </button>
    </mat-toolbar>

    <mat-sidenav-container style="height: calc(100vh - 64px)">
      <mat-sidenav mode="side" opened style="width:220px; padding:10px">
        <mat-nav-list>
          <a mat-list-item routerLink="/app/usuarios">
            <mat-icon>people</mat-icon> Usuarios
          </a>
          <a mat-list-item routerLink="/app/titulares">
            <mat-icon>person</mat-icon> Titulares
          </a>
          <a mat-list-item routerLink="/app/visitantes">
            <mat-icon>group</mat-icon> Visitantes
          </a>
          <a mat-list-item routerLink="/app/entradas">
            <mat-icon>confirmation_number</mat-icon> Entradas
          </a>
          <a mat-list-item routerLink="/app/sedes">
            <mat-icon>location_on</mat-icon> Sedes
          </a>
          <a mat-list-item routerLink="/app/atracciones">
            <mat-icon>attractions</mat-icon> Atracciones
          </a>
          <a mat-list-item routerLink="/app/acuaticas">
            <mat-icon>pool</mat-icon> Acuáticas
          </a>
          <a mat-list-item routerLink="/app/electronicas">
            <mat-icon>videogame_asset</mat-icon> Electrónicas
          </a>
          <a mat-list-item routerLink="/app/mecanicas">
            <mat-icon>settings</mat-icon> Mecánicas
          </a>
          <a mat-list-item routerLink="/app/fisicas">
            <mat-icon>fitness_center</mat-icon> Físicas
          </a>
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content style="padding:24px">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
})
export class MainLayoutComponent {
  constructor(private router: Router) {}

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}