import { Routes } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { HOME_SEO, PRIVACY_SEO, SEO_ROUTE_DATA_KEY } from './pages/shared/const/seo';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { [SEO_ROUTE_DATA_KEY]: HOME_SEO },
  },
  {
    path: 'privacy',
    loadComponent: () => import('./pages/privacy/privacy.component').then((m) => m.PrivacyComponent),
    data: { [SEO_ROUTE_DATA_KEY]: PRIVACY_SEO },
  },
  { path: '**', redirectTo: '' },
];
