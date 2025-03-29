import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown'; // Changed from SelectModule
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar'; // Changed from DatePickerModule
import { CardModule } from 'primeng/card';
import { ISelectOption } from 'src/app/models/common.model';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-movements-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    SelectModule,
    DropdownModule,
    CalendarModule,
    DatePickerModule,
    CardModule,
    ButtonModule,
    TextareaModule
  ],
  templateUrl: './movements-form.component.html',
  styleUrl: './movements-form.component.sass'
})
export class MovementsFormComponent {
  form: FormGroup;

  receiptTypes: ISelectOption[] = [
    { name: 'Factura', code: 'FACT' },
    { name: 'Recibo', code: 'REC' },
    { name: 'Nota de crédito', code: 'NC' }
  ];

  accounts: ISelectOption[] = [
    { name: 'Cuenta 1', code: 'CT1' },
    { name: 'Cuenta 2', code: 'CT2' },
    { name: 'Cuenta 3', code: 'CT3' }
  ];

  costCenters: ISelectOption[] = [
    { name: 'Centro 1', code: 'CC1' },
    { name: 'Centro 2', code: 'CC2' },
    { name: 'Centro 3', code: 'CC3' }
  ];

  productsArray: any[] = [{
    account: '',
    thirdParty: '',
    detail: '',
    description: '',
    costCenter: '',
    debit: 0,
    credit: 0
  }];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      receiptType: [''],
      invoiceNumber: [''],
      date: [new Date()],
      observations: ['']
    });
  }

  get totalValue() {
    let total = 0;
    this.productsArray.forEach(element => {
      total += element.debit - element.credit;
    });
    return total.toFixed(2);
  }

  addProduct() {
    this.productsArray.push({
      account: '',
      thirdParty: '',
      detail: '',
      description: '',
      costCenter: '',
      debit: 0,
      credit: 0
    });
  }

  removeProduct(index: number) {
    if (this.productsArray.length > 1) {
      this.productsArray.splice(index, 1);
    }
  }
}
