import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseFormDirective } from '@directives';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { Third } from 'src/app/models/third';
import { HttpThirdService } from '@services';
import { ThirdComponent } from '@shared';

// Types
type Option = {
  id: number;
  name: string;
};

type Product = {
  product: string;
  description: string;
  quantity: number;
  unitValue: number;
  discount: number;
  cargo: string;
  retention: string;
  totalValue: number;
};

type ProductOption={
  id: number;
  name: string;
code: string;
}

@Component({
  selector: 'app-quotes-invoice-form',
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
    DialogModule
  ],
  templateUrl: './quotes-invoice-form.component.html',
  styleUrl: './quotes-invoice-form.component.sass'
})
export class QuotesInvoiceFormComponent extends BaseFormDirective implements OnInit {
  typeOptions: Option[] = [];
  contactOptions: Option[] = [];
  costCenterOptions: Option[] = [];
  sellerOptions: Option[] = [];
  productOptions: ProductOption[] = [];
  taxChargeOptions: Option[] = [];
  taxRetentionOptions: Option[] = [];

  thirds: Third[] = [];
  productsArray: Product[] = [];
  thirdModal: boolean = false;

  constructor(
    toastr: ToastModule,
    fb: FormBuilder,
    public translate: TranslateService,
    private router: Router,
    private httpThirdService: HttpThirdService
  ) {
    super(toastr, fb);
  }

  ngOnInit(): void {
    this.initializeOptions();
    this.initializeForm();
    this.getThirds();
  }

  initializeOptions(): void {
    this.typeOptions = [
      { id: 1, name: 'Cotización estándar' },
      { id: 2, name: 'Cotización urgente' },
      { id: 3, name: 'Cotización proforma' }
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

    this.productOptions = [
      { id: 1, name: 'Producto A', code: 'PROD-001' },
      { id: 2, name: 'Producto B', code: 'PROD-002' },
      { id: 3, name: 'Servicio X', code: 'SERV-001' }
    ];

    this.productsArray = [{
      product: '',
      description: '',
      quantity: 1,
      unitValue: 0,
      discount: 0,
      cargo: '',
      retention: '',
      totalValue: 0
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
      // Product form controls
      product: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitValue: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.required,Validators.min(0)]],
      cargo: ['',Validators.required],
      retention: ['',Validators.required],
      totalValue: [0,[Validators.required,Validators.min(0)]]
    });
  }

  getThirds(): void {
    this.httpThirdService.get().subscribe({
      next: (value: Third[]) => {
        if (value) {
          this.thirds = value;
        }
      },
      error: (err) => {
        console.error(err);
      },
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

  calculateTotal(): void {
    // Implement logic to calculate total based on products
  }

  showThirdModal(): void {
    this.thirdModal = true;
  }

  closeDialog(value: boolean): void {
    if(value) {
      this.thirdModal = false;
      this.getThirds(); // Refresh thirds list after adding a new one
    }
  }

  cancel(): void {
    this.router.navigate(['/quotes/entities']);
  }

  save(): void {
    if (this.form.valid) {
      console.log('Cotización guardada', this.form.value);
      // Save logic here
    }
  }

  saveAndSend(): void {
    if (this.form.valid) {
      console.log('Cotización guardada y enviada', this.form.value);
      // Save and send logic here
    }
  }
}
