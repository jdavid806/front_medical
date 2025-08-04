import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
  retencion: string;
  totalValue: number;
};

type PaymentMethod = {
  method: string;
  authorizationNumber: string;
  value: number;
};

type ProductType = {
  id: number;
  name: string;
  code: string;
};



@Component({
  selector: 'app-purchase-order-form',
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
    CheckboxModule,
    FormsModule
  ],
  templateUrl: './purchase-order-form.component.html',
  styleUrl: './purchase-order-form.component.sass'
})
export class PurchaseOrderFormComponent extends BaseFormDirective implements OnInit {
  typeOptions: Option[] = [];
  invoiceNumberOptions: Option[] = [];
  providerOptions: Option[] = [];
  costCenterOptions: Option[] = [];
  contactOptions: Option[] = [];
  productTypeOptions: Option[] = [];
  paymentMethodOptions: Option[] = [];
  taxChargeOptions: Option[] = [];
  taxRetentionOptions: Option[] = [];


  productsArray: Product[] = [];
  paymentMethodsArray: PaymentMethod[] = [];
  productOptions: ProductType[] = [];
  //TOTAL
  totalBruto: number = 0;
  descuentos: number = 0;
  subTotal: number = 0;
  retelIVA: number | null = null;
  retelICA: number | null = null;
  totalNeto: number = 0
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
      { id: 1, name: 'OC-1-Orden Compra Inicial' },
      { id: 2, name: 'OC-2-Orden Compra Intermedia' },
      { id: 3, name: 'OC-3-Orden Compra Final' }
    ];

    this.invoiceNumberOptions = [
      { id: 1, name: 'FAC-2023-001' },
      { id: 2, name: 'FAC-2023-002' },
      { id: 3, name: 'FAC-2023-003' },
      { id: 4, name: 'FAC-2023-004' }
    ];

    this.providerOptions = [
      { id: 1, name: 'Proveedor A' },
      { id: 2, name: 'Proveedor B' },
      { id: 3, name: 'Proveedor C' },
      { id: 4, name: 'Proveedor D' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Administración' },
      { id: 2, name: 'Ventas' },
      { id: 3, name: 'Marketing' },
      { id: 4, name: 'TI' }
    ];

    this.contactOptions = [
      { id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María Gómez' },
      { id: 3, name: 'Carlos Rojas' }
    ];

    this.productTypeOptions = [
      { id: 1, name: 'Producto' },
      { id: 2, name: 'Servicio' },
      { id: 3, name: 'Material' }
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


    this.productOptions = [
      { id: 1, name: 'Producto A', code: 'PROD-001' },
      { id: 2, name: 'Producto B', code: 'PROD-002' },
      { id: 3, name: 'Producto C', code: 'PROD-003' },
      { id: 4, name: 'Producto X', code: 'SERV-0022' }
    ];

    this.paymentMethodOptions = [
      { id: 1, name: 'Transferencia bancaria' },
      { id: 2, name: 'Cheque' },
      { id: 3, name: 'Efectivo' },
      { id: 4, name: 'Tarjeta de crédito' }
    ];

    this.productsArray = [{
      type: '',
      product: '',
      description: '',
      quantity: 1,
      unitValue: 0,
      discount: 0,
      cargo: '',
      retencion: '',
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
      id: ['', Validators.required],
      date: [new Date(), Validators.required],
      providerInvoice: ['', Validators.required],
      provider: ['', Validators.required],
      costCenter: ['', Validators.required],
      contact: ['', Validators.required],
      providerPerItem: [false],
      taxIncluded: [false],
      percentageDiscount: [false],
      supplierinvoice: ['', Validators.required],
      consective: ['', Validators.required],

      // Product form controls
      productType: ['', Validators.required],
      product: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitValue: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required,Validators.min(0)]],
      cargo: ['',Validators.required],
      retencion: ['',Validators.required],
      totalValue: [0, [Validators.required,Validators.min(0)]],


      //total Compra
      totalBrut:[0, [Validators.required,Validators.min(0)]],
      discountsTotal:[0, [Validators.required,Validators.min(0)]],
      subTotal:[0, [Validators.required,Validators.min(0)]],
      retelIVA:[0, [Validators.required,Validators.min(0)]],
      retelICA:[0, [Validators.required,Validators.min(0)]],

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
      retencion: '',
      totalValue: 0
    });
  }

  removeProduct(index: number): void {
    this.productsArray.splice(index, 1);
    this.calculateTotal();
  }



  calculateTotal(): void {
    // Implement logic to calculate total based on products
    // This can be called when quantity, unitValue or discount changes
  }

  cancel(): void {
    this.router.navigate(['/purchases/entities']);
  }

  save(): void {
    if (this.form.valid) {
      console.log('Factura de compra guardada', this.form.value);
      // Save logic here
    }
  }

  calcularTotalNeto() {
    this.subTotal = this.totalBruto - this.descuentos;
    this.totalNeto = this.subTotal - (this.retelIVA || 0) - (this.retelICA || 0);
  }

  saveAndSend(): void {
    if (this.form.valid) {
      console.log('Factura de compra guardada y enviada', this.form.value);
      // Save and send logic here
    }
  }
}
