import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ISelectOption } from 'src/app/models/common.model';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-movements-form',
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, CardModule, ButtonModule, TextareaModule],
  templateUrl: './movements-form.component.html',
  styleUrl: './movements-form.component.sass',
})
export class MovementsFormComponent {
  form: FormGroup;

  products: ISelectOption[] = [{
    name: 'Product 1',
    code: '001',
  }, {
    name: 'Product 2',
    code: '002',
  }, {
    name: 'Product 3',
    code: '003',
  }];

  productsArray: any[] = [{
    method: '',
    authorizationNumber: '',
    value: 0,
  }];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      receiptType: this.fb.control(''),
      id: this.fb.control(''),
      customer: this.fb.control(''),
      receiver: this.fb.control(''),
      seller: this.fb.control(''),
      costCenter: this.fb.control(''),
      date: this.fb.control(new Date()),
    });
  }

  get totalValue() {
    let total = 0;
    this.productsArray.forEach(element => {
      total += element.quantity * element.price;
    });

    return total;
  }

  addProduct() {
    this.productsArray.push({
      product: '',
      quantity: 0,
      price: 0,
      discount: 0,
      iva: 0,
    });
  }

  removeProduct(index: number) {
    this.productsArray.splice(index, 1);
  }
}
