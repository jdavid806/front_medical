import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { billingRoutes } from './components/features/billing/billing.routes';
import { payrollRoutes } from './components/features/payroll/payroll.routes';
import { causationsRoutes } from './components/features/causations/causations.routes';
import { reportsRoutes } from './components/features/reports/reports.routes';
import { configRoutes } from './components/features/config/billing.routes';
import { suppliersRoutes } from './components/features/suppliers/suppliers.routing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/billing/sales',
    pathMatch: 'full',
  },
  ...billingRoutes,
  ...causationsRoutes,
  ...payrollRoutes,
  ...reportsRoutes,
  ...configRoutes,
  ...suppliersRoutes
];

NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
});
