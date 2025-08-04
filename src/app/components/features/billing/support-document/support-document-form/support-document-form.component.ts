import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseFormDirective } from '@directives';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

// Types
type Option = {
  id: number;
  name: string;
};

type Product = {
  type: string;
  product: string;
  description: string;
  quantity: number;
  unitValue: number;
  discount: number;
  cargo: string;
  retention: string;
  totalValue: number;
};

type PaymentMethod = {
  method: string;
  authorizationNumber: string;
  value: number;
};

type  productOptions ={
  id: number;
  name: string;
  code: string;
}

@Component({
  selector: 'app-support-document-form',
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
    ToastModule,
    CheckboxModule
  ],
  templateUrl: './support-document-form.component.html',
  styleUrl: './support-document-form.component.sass'
})
export class SupportDocumentFormComponent extends BaseFormDirective implements OnInit {
  typeOptions: Option[] = [];
  autoNumberOptions: Option[] = [];
  providerOptions: Option[] = [];
  costCenterOptions: Option[] = [];
  productTypeOptions: Option[] = [];
  taxChargeOptions: Option[] = [];
  taxRetentionOptions: Option[] = [];
  paymentMethodOptions: Option[] = [];
  providerBillOptions: Option[] = [];
  productsArray: Product[] = [];
  paymentMethodsArray: PaymentMethod[] = [];

  productOptions: productOptions[] = [];
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
      { id: 1, name: 'Factura de compra' },
      { id: 2, name: 'Nota crédito' },
      { id: 3, name: 'Nota débito' }
    ];

    this.autoNumberOptions = [
      { id: 1, name: 'SD-2023-001' },
      { id: 2, name: 'SD-2023-002' },
      { id: 3, name: 'SD-2023-003' }
    ];

    this.providerOptions = [
      { id: 1, name: 'Proveedor A' },
      { id: 2, name: 'Proveedor B' },
      { id: 3, name: 'Proveedor C' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Administración' },
      { id: 2, name: 'Ventas' },
      { id: 3, name: 'Marketing' }
    ];

    this.productTypeOptions = [
      { id: 1, name: 'Producto' },
      { id: 2, name: 'Servicio' },
      { id: 3, name: 'Material' }
    ];

    this.providerBillOptions = [
      { id: 1, name: 'FC'  },
      { id: 2, name: 'FA' },
      { id: 3, name: 'FB' }
    ];


    this.productOptions = [
      { id: 1, name: 'Producto A', code: 'PROD-001' },
      { id: 2, name: 'Producto B', code: 'PROD-002' },
      { id: 3, name: 'Servicio X', code: 'SERV-001' }
    ];

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

    this.paymentMethodOptions = [
      { id: 1, name: 'Transferencia bancaria' },
      { id: 2, name: 'Cheque' },
      { id: 3, name: 'Efectivo' }
    ];

    this.productsArray = [{
      type: '',
      product: '',
      description: '',
      quantity: 1,
      unitValue: 0,
      discount: 0,
      cargo: '',
      retention: '',
      totalValue: 0
    }];

    this.paymentMethodsArray = [{
      method: '',
      authorizationNumber: '',
      value: 0
    }];
  }

  initializeForm(): void {
    this.form = this.fb.group({
      type: ['', Validators.required],
      autoNumber: ['', Validators.required],
      date: [new Date(), Validators.required],
      providerBill: ['', Validators.required],
      provider: ['', Validators.required],
      costCenter: ['', Validators.required],
      percentageDiscount: [false],
      consective: ['', Validators.required],
      // Product form controls
      typeFact:['',Validators.required],
      productType: ['', Validators.required],
      product: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unitValue: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required,Validators.min(0)]],
      cargo: ['',Validators.required],
      retention: ['',Validators.required],

      totalValue: [0, [Validators.required,Validators.min(0)]],
      // Payment method form controls
      method: ['', Validators.required],
      authorizationNumber: ['',Validators.required],
      value: [0, [Validators.required, Validators.min(0)]]
    });
  }

  get totalValue(): number {
    let total = 0;
    this.productsArray.forEach(p => {
      const subtotal = (p.quantity || 0) * (p.unitValue || 0);
      const discount = subtotal * ((p.discount || 0) / 100);
      total += subtotal - discount;
    });
    return total;
  }

  addProduct(): void {
    this.productsArray.push({
      type: '',
      product: '',
      description: '',
      quantity: 1,
      unitValue: 0,
      discount: 0,
      cargo: '',
      retention: '',
      totalValue: 0
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
    this.router.navigate(['/support-documents/entities']);
  }

  save(): void {
    if (this.form.valid) {
      console.log('Documento de soporte guardado', this.form.value);
      // Save logic here
    }
  }

  saveAndSend(): void {
    if (this.form.valid) {
      console.log('Documento de soporte guardado y enviado', this.form.value);
      // Save and send logic here
    }
  }
}
