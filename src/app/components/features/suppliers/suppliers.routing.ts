import { Routes, RouterModule} from '@angular/router';

export const suppliersRoutes: Routes = [
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./suppliers/suppliers.component').then((m) => m.SuppliersComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./table-supplier/table-supplier.component').then((m) => m.TableSupplierComponent),
      },
      // {
      //   path: 'new',
      //   loadComponent: () =>
      //     import('./movements/movements-form/movements-form.component').then((m) => m.MovementsFormComponent),
      // },
      // {
      //   path: ':id',
      //   loadComponent: () =>
      //     import('./movements/movements-form/movements-form.component').then((m) => m.MovementsFormComponent),
      // }
    ]
  }
];


