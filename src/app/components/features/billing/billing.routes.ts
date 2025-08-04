import { Routes } from '@angular/router';

export const billingRoutes: Routes = [
  {
    path: 'billing',
    loadComponent: () =>
      import('./billing/billing.component').then((m) => m.BillingComponent),
    children: [
      {
        path: '',
        redirectTo: '/billing/sales',
        pathMatch: 'full',
      },
      {
        path: 'sales',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./sales-invoice/sales-invoice-list/sales-invoice-list.component').then((m) => m.SalesInvoiceListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./sales-invoice/sales-invoice-form/sales-invoice-form.component').then((m) => m.SalesInvoiceFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./sales-invoice/sales-invoice-form/sales-invoice-form.component').then((m) => m.SalesInvoiceFormComponent),
          }
        ]
      },
      {
        path: 'entities',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./entities-invoice/entities-invoice-list/entities-invoice-list.component').then((m) => m.EntitiesInvoiceListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./entities-invoice/entities-invoice-form/entities-invoice-form.component').then((m) => m.EntitiesInvoiceFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./entities-invoice/entities-invoice-form/entities-invoice-form.component').then((m) => m.EntitiesInvoiceFormComponent),
          }
        ]
      },
      {
        path: 'recurring',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./recurring-invoice/recurring-invoice-list/recurring-invoice-list.component').then((m) => m.RecurringInvoiceListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./recurring-invoice/recurring-invoice-form/recurring-invoice-form.component').then((m) => m.RecurringInvoiceFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./recurring-invoice/recurring-invoice-form/recurring-invoice-form.component').then((m) => m.RecurringInvoiceFormComponent),
          }
        ]
      },
      {
        path: 'purchase',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./purchase-invoice/purchase-invoice-list/purchase-invoice-list.component').then((m) => m.PurchaseInvoiceListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./purchase-invoice/purchase-invoice-form/purchase-invoice-form.component').then((m) => m.PurchaseInvoiceFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./purchase-invoice/purchase-invoice-form/purchase-invoice-form.component').then((m) => m.PurchaseInvoiceFormComponent),
          }
        ]
      },
      {
        path: 'support',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./support-document/support-document-list/support-document-list.component').then((m) => m.SupportDocumentListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./support-document/support-document-form/support-document-form.component').then((m) => m.SupportDocumentFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./support-document/support-document-form/support-document-form.component').then((m) => m.SupportDocumentFormComponent),
          }
        ]
      },
      {
        path: 'quotes',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./quotes-invoice/quotes-invoice-list/quotes-invoice-list.component').then((m) => m.QuotesInvoiceListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./quotes-invoice/quotes-invoice-form/quotes-invoice-form.component').then((m) => m.QuotesInvoiceFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./quotes-invoice/quotes-invoice-form/quotes-invoice-form.component').then((m) => m.QuotesInvoiceFormComponent),
          }
        ]
      },
      {
        path: 'referrals',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./referrals/referrals-list/referrals-list.component').then((m) => m.ReferralsListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./referrals/referrals-form/referrals-form.component').then((m) => m.ReferralsFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./referrals/referrals-form/referrals-form.component').then((m) => m.ReferralsFormComponent),
          }
        ]
      },
      {
        path: 'purchase-orders',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./puchase-order/purchase-order-list/purchase-order-list.component').then((m) => m.PurchaseOrderListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./puchase-order/purchase-order-form/purchase-order-form.component').then((m) => m.PurchaseOrderFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./puchase-order/purchase-order-form/purchase-order-form.component').then((m) => m.PurchaseOrderFormComponent),
          }
        ]
      },
      {
        path: 'debit-credit',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./debit-credit/debit-credit-list/debit-credit-list.component').then((m) => m.DebitCreditListComponent),
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./debit-credit/debit-credit-form/debit-credit-form.component').then((m) => m.DebitCreditFormComponent),
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./debit-credit/debit-credit-form/debit-credit-form.component').then((m) => m.DebitCreditFormComponent),
          }
        ]
      },
    ],
  },
];
