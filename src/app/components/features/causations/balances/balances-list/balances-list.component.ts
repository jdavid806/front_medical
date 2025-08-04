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

@Component({
  selector: 'app-balances-list',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, CardModule, InputTextModule],
  templateUrl: './balances-list.component.html',
  styleUrl: './balances-list.component.sass',
})
export class BalancesListComponent {
  @Input() isModalProductsClose = false;

  wordFilter: string = '';
  formattedItems: TableActions[] = [];

  isSummaryShopping = false;
  rowsSummaryShopping: any = null;
  columns!: ICustomTableColumn[];
  data: any[] = [];
  tableActions: TableActions[] = [];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.tableActions = [];

    this.columns = [
      { name: 'Nivel', key: 'level', width: '150px', type: 'text' },
      { name: 'tranactional', key: 'transaction', width: '150px', type: 'text' },
      { name: 'Código', key: 'code', width: '150px', type: 'text' },
      { name: 'Nombre', key: 'name', width: '150px', type: 'text' },
      { name: 'Saldo inicial', key: 'initialValue', width: '150px', type: 'text' },
      { name: 'Movimiento debito', key: 'debit', width: '150px', type: 'text' },
      { name: 'movimiento credito', key: 'credit', width: '150px', type: 'text' },
      { name: 'Saldo final', key: 'endValue', width: '150px', type: 'text' },
    ];

    this.data = [
      {
        id: 'F001',
        transaction: 'no',
        code: '1',
        name: 'Activo',
        initialValue: '65.000.000',
        debit: '25.000.000',
        credit: '15.000.000',
        endValue: '25.000.000'
      },
    ];

    //this.data = fakeData.map((invoice) => new Movements(invoice));
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
