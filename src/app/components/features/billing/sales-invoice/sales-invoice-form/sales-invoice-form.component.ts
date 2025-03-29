import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { CardModule } from 'primeng/card';
import { ISelectOption } from 'src/app/models/common.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sales-invoice-form',
  imports: [FormsModule, ReactiveFormsModule, InputTextModule, SelectModule, DatePickerModule, CardModule, ButtonModule],
  templateUrl: './sales-invoice-form.component.html',
  styleUrl: './sales-invoice-form.component.sass',
})
export class SalesInvoiceFormComponent {
  form: FormGroup;
  selectedDate: Date = new Date();

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

  paymentMethodsArray: any[] = [{
    product: '',
    quantity: 0,
    price: 0,
    discount: 0,
    iva: 0,
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

    // Inicializa selectedDate con la fecha actual
    this.selectedDate = new Date();

  }
  get totalValue() {
    let total = 0;
    this.productsArray.forEach(element => {
      const quantity = Number(element.quantity) || 0;
      const price = Number(element.price) || 0;
      total += quantity * price;
    });

    // Formatea el total para que siempre tenga 2 decimales
    return total.toFixed(2);
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

  addPayment() {
    this.paymentMethodsArray.push({
      method: '',
      authorizationNumber: '',
      value: 0,
    });
  }

  removePayment(index: number) {
    this.paymentMethodsArray.splice(index, 1);
  }


  getFormattedDate(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0'); // Día con 2 dígitos
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mes con 2 dígitos
    const year = date.getFullYear(); // Año con 4 dígitos
    return `${day}/${month}/${year}`; // Formato dd/mm/aaaa
  }

  get formattedDate() {
    return this.getFormattedDate(this.selectedDate);
  }

   // Métodos para los botones del total a pagar
   cancel() {
    console.log("Acción cancelada");
  }

  save() {
    console.log("Factura guardada", this.form.value);
  }

  saveAndSend() {
    console.log("Factura guardada y enviada", this.form.value);
  }
}
