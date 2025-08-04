 import {
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ICustomTableColumn, TableActions } from 'src/app/models/common.model';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { IMovements, Movements } from 'src/app/models/movements';
import { SplitButtonModule } from 'primeng/splitbutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-movements-list',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CardModule, InputTextModule,SplitButtonModule ],
  templateUrl: './movements-list.component.html',
  styleUrl: './movements-list.component.sass',
})
export class MovementsListComponent {
  @Input() isModalProductsClose = false;

  wordFilter: string = '';
  formattedItems: TableActions[] = [];
  items: MenuItem[] = []
  isSummaryShopping = false;
  rowsSummaryShopping: any = null;
  columns!: ICustomTableColumn[];
  data: Movements[] = [];
  tableActions: TableActions[] = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.initializeMenuItems();
    this.tableActions = [];

    this.columns = [
      { name: '# Factura', key: 'id', width: '150px', type: 'text' },
      { name: 'Fecha', key: 'parsedDate', width: '150px', type: 'text' },
      { name: 'Cliente', key: 'client', width: '150px', type: 'text' },
      { name: 'Monto factura', key: 'value', width: '150px', type: 'text' },
      {
        name: 'Tipo factura',
        key: 'invoiceType',
        width: '150px',
        type: 'text',
      },
      {
        name: 'Estado factura',
        key: 'invoiceStatus',
        width: '150px',
        type: 'text',
        dotColor: [
          { Aceptada: 'p-text-success-color' },
          { Emitida: 'p-text-warn-color' },
          { Realizada: 'p-text-help-color' },
          { Cancelada: 'p-text-danger-color' },
        ]
      },
    ];

    let fakeData: IMovements[] = [
      {
        id: 'F001',
        date: '2025-01-01',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3065',
      },
      {
        id: 'F002',
        date: '2025-01-02',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3065',
      },
      {
        id: 'F003',
        date: '2025-01-03',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3065',
      },
      {
        id: 'F001',
        date: '2025-01-01',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3066',
      },
      {
        id: 'F002',
        date: '2025-01-02',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3066',
      },
      {
        id: 'F003',
        date: '2025-01-03',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3066',
      },
      {
        id: 'F001',
        date: '2025-01-01',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3067',
      },
      {
        id: 'F002',
        date: '2025-01-02',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3067',
      },
      {
        id: 'F003',
        date: '2025-01-03',
        accountingAccount: 'Billetera mensajeria',
        accountingCode: '111234890',
        branchOffice: '1',
        centerCorst: 'Productopolis',
        clientId: '1.000.000.000',
        description: '33822PC',
        detail: '1-1089 Cuota: 1',
        thirdName: 'Daniela Angel',
        cost: 0,
        voucher: 'CC-1-3067',
      },
    ];

    this.data = fakeData.map((invoice) => new Movements(invoice));
  }

  initializeMenuItems(): void {
    this.items = [
      {
        label: 'Recibo caja',
        icon: 'pi pi-money-bill',
        command: () => {
          this.onNewReceipt('pago');
        }
      },
      {
        label: 'Recibo pago',
        icon: 'pi pi-credit-card',
        command: () => {
          this.onNewReceipt('caja');
        }
      }
    ];
  }


  onNewReceipt(type: string): void {
    switch (type) {
      case 'caja':
        this.router.navigate(['causations/credit-note/new']);
        break;
      case 'pago':
        this.router.navigate(['causations/debit-note/new']);
        break;
    }
  }

  onNewSelected() {
    this.router.navigate(['causations/movements/new']);
  }

  trackByAction(index: number, item: any): string {
    return item;
  }

  onActionSelected(action: TableActions) {
  }

  onChangeWord() {
    console.log('change word', this.wordFilter)
  }
}
