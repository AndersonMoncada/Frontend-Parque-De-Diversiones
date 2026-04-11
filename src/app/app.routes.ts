import { Routes } from '@angular/router';
import { auditUserGuard } from './core/audit-user.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'app',
    canActivate: [auditUserGuard],
    loadComponent: () =>
      import('./features/shell/main-layout').then((m) => m.MainLayoutComponent),
    children: [
      { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-list').then((m) => m.UsuarioListComponent),
      },

      {
        path: 'titulares',
        loadComponent: () =>
          import('./features/titulares/titular-list').then((m) => m.TitularListComponent),
      },

      {
        path: 'visitantes',
        loadComponent: () =>
          import('./features/visitantes/visitante-list').then((m) => m.VisitanteListComponent),
      },

      {
        path: 'entradas',
        loadComponent: () =>
          import('./features/entradas/entrada-list').then((m) => m.EntradaListComponent),
      },

      {
        path: 'sedes',
        loadComponent: () =>
          import('./features/sedes/sede-list').then((m) => m.SedeListComponent),
      },

      {
        path: 'atracciones',
        loadComponent: () =>
          import('./features/atracciones/atraccion-list').then((m) => m.AtraccionListComponent),
      },

      {
        path: 'acuaticas',
        loadComponent: () =>
          import('./features/acuaticas/acuatica-list').then((m) => m.AcuaticaListComponent),
      },

      {
        path: 'electronicas',
        loadComponent: () =>
          import('./features/electronicas/electronica-list').then((m) => m.ElectronicaListComponent),
      },

      {
        path: 'mecanicas',
        loadComponent: () =>
          import('./features/mecanicas/mecanica-list').then((m) => m.MecanicaListComponent),
      },

      {
        path: 'fisicas',
        loadComponent: () =>
          import('./features/fisicas/fisica-list').then((m) => m.FisicaListComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'login' },
];