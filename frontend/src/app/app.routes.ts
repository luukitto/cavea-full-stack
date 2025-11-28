import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/inventory-list/inventory-list.component').then(
        (m) => m.InventoryListComponent
      )
  },
  {
    path: 'add',
    loadComponent: () =>
      import('./features/add-inventory/add-inventory.component').then(
        (m) => m.AddInventoryComponent
      )
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('./features/statistics/statistics.component').then(
        (m) => m.StatisticsComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
