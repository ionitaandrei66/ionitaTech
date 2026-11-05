import { Routes } from '@angular/router';

import { MainComponent } from './pages/main/main.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    title: 'Ionita Tech | Modern Software Services',
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
    title: 'Privacy Policy & Terms | Ionita Tech',
  },
  { path: '**', redirectTo: '' },
];
