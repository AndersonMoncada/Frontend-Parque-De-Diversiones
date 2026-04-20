import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },

  { path: 'usuarios', loadComponent: () => import('./features/usuarios/usuario-list').then(m => m.UsuarioListComponent) },
  { path: 'titulares', loadComponent: () => import('./features/titulares/titular-list').then(m => m.TitularListComponent) },
  { path: 'visitantes', loadComponent: () => import('./features/visitantes/visitante-list').then(m => m.VisitanteListComponent) },

  { path: 'electronicas', loadComponent: () => import('./features/electronicas/electronica-list').then(m => m.ElectronicaListComponent) },
  { path: 'mecanicas', loadComponent: () => import('./features/mecanicas/mecanica-list').then(m => m.MecanicaListComponent) },
  { path: 'fisicas', loadComponent: () => import('./features/fisicas/fisica-list').then(m => m.FisicaListComponent) },

  { path: '**', redirectTo: 'usuarios' }
];