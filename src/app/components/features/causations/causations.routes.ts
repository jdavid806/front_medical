import { Routes } from '@angular/router';

export const causationsRoutes: Routes = [
  {
    path: 'causations',
    loadComponent: () =>
      import('./causations/causations.component').then((m) => m.CausationsComponent),
    children: [
      {
        path: '',
        redirectTo: '/causations/movements',
        pathMatch: 'full',
      },
      {
        path: 'movements',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./movements/movements-list/movements-list.component').then((m) => m.MovementsListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./movements/movements-form/movements-form.component').then((m) => m.MovementsFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./movements/movements-form/movements-form.component').then((m) => m.MovementsFormComponent),
          }
        ]
      },
      {
        path: 'accounting-account',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./accounting-account/accounting-account-list/accounting-account-list.component').then((m) => m.AccountinAccountListComponent),
          },
        ]
      },
      {
        path: 'balances',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./balances/balances-list/balances-list.component').then((m) => m.BalancesListComponent),
          },
        ]
      },
      {
        path: 'more',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./more-processes/more-processes.component').then((m) => m.MoreProcessesComponent),
          },
        ]
      },
      {
        path: 'credit-note',
        children: [
          {
            path: 'new',
            loadComponent: () =>
              import('./credit-note/credit-note-form/credit-note-form.component').then((m) => m.CreditNoteFormComponent),
          },
        ]
      },
      {
        path: 'debit-note',
        children: [
          {
            path: 'new',
            loadComponent: () =>
              import('./debit-note/debit-note-form/debit-note-form.component').then((m) => m.DebitNoteFormComponent),
          },
        ]
      },
    ],
  },
];
