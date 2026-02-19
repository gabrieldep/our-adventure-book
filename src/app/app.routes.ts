import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/book/book.component').then((m) => m.BookComponent) },
  { path: '**', redirectTo: '' },
];
