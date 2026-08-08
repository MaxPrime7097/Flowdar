import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

// Routes et guards (Frontend Specifications v3, section 3)
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/carte/carte').then((m) => m.Carte),
  },
  {
    path: 'alerte/:id',
    loadComponent: () => import('./features/alerte-detail/alerte-detail').then((m) => m.AlerteDetail),
  },
  {
    path: 'preventives',
    loadComponent: () =>
      import('./features/alertes-preventives/alertes-preventives').then((m) => m.AlertesPreventives),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications').then((m) => m.Notifications),
  },
  {
    path: 'guide-prevention',
    loadComponent: () =>
      import('./features/guide-prevention/guide-prevention').then((m) => m.GuidePrevention),
  },
  {
    path: 'itineraire',
    loadComponent: () => import('./features/itineraire/itineraire').then((m) => m.Itineraire),
  },
  {
    path: 'historique',
    loadComponent: () => import('./features/historique/historique').then((m) => m.Historique),
  },
  {
    path: 'signaler',
    loadComponent: () => import('./features/signalement/signalement').then((m) => m.Signalement),
    canActivate: [authGuard],
  },
  {
    path: 'profil',
    loadComponent: () => import('./features/profil/profil').then((m) => m.Profil),
    canActivate: [authGuard],
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.Auth),
    canActivate: [noAuthGuard],
  },
  { path: '**', redirectTo: '' },
];
