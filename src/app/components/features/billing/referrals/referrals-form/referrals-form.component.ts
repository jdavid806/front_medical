import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseFormDirective } from '@directives';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ISelectOption } from 'src/app/models/common.model';

// Types
type Option = {
  id: number;
  name: string;
  code?: string;
};

type Product = {
  product: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  iva: string;
  retention: string;
};

type PaymentMethod = {
  method: string;
  authorizationNumber: string;
  value: number;
};

@Component({
  selector: 'app-referrals-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    DatePickerModule,
    CardModule,
    ButtonModule,
    SelectModule,
    TranslateModule,
    RouterLink,
    ToastModule
  ],
  templateUrl: './referrals-form.component.html',
  styleUrl: './referrals-form.component.sass'
})
export class ReferralsFormComponent extends BaseFormDirective implements OnInit {
  typeOptions: Option[] = [];
  numberOptions: Option[] = [];
  customerOptions: Option[] = [];
  contactOptions: Option[] = [];
  costCenterOptions: Option[] = [];
  sellerOptions: Option[] = [];
  reasonOptions: Option[] = [];
  taxChargeOptions: Option[] = [];
  taxRetentionOptions: Option[] = [];
  productOptions: ISelectOption[] = [];
  paymentMethodOptions: Option[] = [];

  productsArray: Product[] = [];
  paymentMethodsArray: PaymentMethod[] = [];

  constructor(
    toastr: ToastModule,
    fb: FormBuilder,
    public translate: TranslateService,
    private router: Router
  ) {
    super(toastr, fb);
  }

  ngOnInit(): void {
    this.initializeOptions();
    this.initializeForm();
  }

  initializeOptions(): void {
    this.typeOptions = [
      { id: 1, name: 'Remisión estándar' },
      { id: 2, name: 'Remisión especial' },
      { id: 3, name: 'Remisión urgente' }
    ];

    this.numberOptions = [
      { id: 1, name: 'REM-2023-001' },
      { id: 2, name: 'REM-2023-002' },
      { id: 3, name: 'REM-2023-003' }
    ];

    this.customerOptions = [
      { id: 1, name: 'Cliente A' },
      { id: 2, name: 'Cliente B' },
      { id: 3, name: 'Cliente C' }
    ];

    this.contactOptions = [
      { id: 1, name: 'Contacto A' },
      { id: 2, name: 'Contacto B' },
      { id: 3, name: 'Contacto C' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Ventas' },
      { id: 2, name: 'Marketing' },
      { id: 3, name: 'Administración' }
    ];

    this.sellerOptions = [
      { id: 1, name: 'Vendedor A' },
      { id: 2, name: 'Vendedor B' },
      { id: 3, name: 'Vendedor C' }
    ];

    this.reasonOptions = [
      { id: 1, name: 'Muestra comercial' },
      { id: 2, name: 'Garantía' },
      { id: 3, name: 'Devolución' }
    ];

    this.productOptions = [
      { name: 'Product 1', code: '001' },
      { name: 'Product 2', code: '002' },
      { name: 'Product 3', code: '003' }
    ];

    this.paymentMethodOptions = [
      { id: 1, name: 'Transferencia bancaria' },
      { id: 2, name: 'Cheque' },
      { id: 3, name: 'Efectivo' }
    ];

    this.productsArray = [{
      product: '',
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      iva: '',
      retention: ''
    }];

    this.paymentMethodsArray = [{
      method: '',
      authorizationNumber: '',
      value: 0
    }];

    this.taxChargeOptions = [
      { id: 1, name: 'IVA 19%' },
      { id: 2, name: 'ICA' },
      { id: 3, name: 'Impoconsumo' }
    ];

    this.taxRetentionOptions = [
      { id: 1, name: 'Retención IVA' },
      { id: 2, name: 'Retención ICA' },
      { id: 3, name: 'Retención Fuente' }
    ];
  }

  initializeForm(): void {
    this.form = this.fb.group({
      receiptType: ['', Validators.required],
      id: ['', Validators.required],
      customer: ['', Validators.required],
      receiver: ['', Validators.required],
      seller: ['', Validators.required],
      costCenter: ['', Validators.required],
      date: [new Date(), Validators.required],
      reason: ['', Validators.required],
      // Product form controls
      product: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required,Validators.min(0)]],
      iva: ['', Validators.required],
      retention: ['', Validators.required],
      // Payment method form controls
      method: ['', Validators.required],
      authorizationNumber: ['', Validators.required],
      value: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get totalValue(): number {
    let total = 0;
    this.productsArray.forEach(p => {
      const subtotal = (p.quantity || 0) * (p.price || 0);
      const discount = subtotal * ((p.discount || 0) / 100);
      total += subtotal - discount;
    });
    return total;
  }

  addProduct(): void {
    this.productsArray.push({
      product: '',
      description: '',
      quantity: 1,
      price: 0,
      discount: 0,
      iva: '',
      retention: ''
    });
  }

  removeProduct(index: number): void {
    this.productsArray.splice(index, 1);
    this.calculateTotal();
  }

  addPayment(): void {
    this.paymentMethodsArray.push({
      method: '',
      authorizationNumber: '',
      value: 0
    });
  }

  removePayment(index: number): void {
    this.paymentMethodsArray.splice(index, 1);
  }

  calculateTotal(): void {
    // Implement logic to calculate total based on products
  }

  cancel(): void {
    this.router.navigate(['/referrals/entities']);
  }

  save(): void {
    if (this.form.valid) {
      console.log('Remisión guardada', this.form.value);
      // Save logic here
    }
  }

  saveAndSend(): void {
    if (this.form.valid) {
      console.log('Remisión guardada y enviada', this.form.value);
      // Save and send logic here
    }
  }
}
