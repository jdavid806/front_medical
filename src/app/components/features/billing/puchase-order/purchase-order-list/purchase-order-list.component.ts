import {
  Component,
  Input,
} from '@angular/core';
import { BaseListDirective } from '../../../../../directives/directives/base-list.directive';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CustomTableComponent } from '@shared';
import { ICustomTableColumn, TableActions } from 'src/app/models/common.model';
import { ISalesInvoice, SalesInvoice } from 'src/app/models/sales-invoice';
import { Router } from '@angular/router';
import { IPurchaseInvoice, PurchaseInvoice } from 'src/app/models/purchase-invoice';

@Component({
  selector: 'app-purchase-order-list',
  imports: [CommonModule, ToastModule, TableModule, CustomTableComponent],
  templateUrl: './purchase-order-list.component.html',
  styleUrl: './purchase-order-list.component.sass',
})
export class PurchaseOrderListComponent
  extends BaseListDirective {
  @Input() isModalProductsClose = false;

  isSummaryShopping = false;
  rowsSummaryShopping: any = null;
  columns!: ICustomTableColumn[];
  dataTest: PurchaseInvoice[] = [];
  tableActions: TableActions[] = ['edit', 'delete', 'download'];

  constructor(toast: ToastModule, private router: Router) {
    super(toast);
  }

  ngOnInit(): void {
    this.columns = [
      { name: '# No.Orden', key: 'id', width: "150px", type: 'text' },
      { name: '# Comprobante', key: 'id', width: "150px", type: 'text' },
      { name: 'Producto', key: 'parsedDate', width: "150px", type: 'text' },
      { name: 'Identificación', key: 'providerId', width: "150px", type: 'text' },
      { name: 'Surcursal', key: 'provider', width: "150px", type: 'text' },
      { name: 'Valor Total', key: 'value', width: "150px", type: 'text' },
    ];

    let fakeData: IPurchaseInvoice[] = [
      {
        id: 'F001',
        date: '2025-01-01',
        providerId: '1.000.000.000',
        provider: 'Casa medica',
        value: 1500.0,
        invoiceType: 'Electrónica',
        invoiceStatus: 'Aceptada',
      },
      {
        id: 'F002',
        date: '2025-01-02',
        providerId: '1.000.000.000',
        provider: 'Casa medica',
        value: 2300.5,
        invoiceType: 'Electrónica',
        invoiceStatus: 'Cancelada',
      },
      {
        id: 'F003',
        date: '2025-01-03',
        providerId: '1.000.000.000',
        provider: 'Casa medica',
        value: 780.75,
        invoiceType: 'Manual',
        invoiceStatus: 'Cancelada',
      },
      {
        id: 'F004',
        date: '2025-01-04',
        providerId: '1.000.000.000',
        provider: 'Casa medica',
        value: 3250.0,
        invoiceType: 'Electrónica',
        invoiceStatus: 'Emitida',
      },
      {
        id: 'F005',
        date: '2025-01-05',
        providerId: '1.000.000.000',
        provider: 'Casa medica',
        value: 1200.0,
        invoiceType: 'Manual',
        invoiceStatus: 'Cancelada',
      },
    ];

    this.dataTest = fakeData.map((invoice) => new PurchaseInvoice(invoice));
  }

  onNewSelect() {
    this.router.navigate(['billing/purchase-orders/new']);
  }
}
