import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BaseFormDirective } from '@directives';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

// Definición de tipos
type TypeOption = {
  id: number;
  name: string;
};

type InvoiceOption = {
  id: number;
  number: string;
  date: Date;
};

type Customer = {
  id: number;
  fullName: string;
};

type ContactOption = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

type CostCenterOption = {
  id: number;
  name: string;
};

type SellerOption = {
  id: number;
  name: string;
};

type DianReasonOption = {
  id: number;
  name: string;
  code: string;
};

type ProductOption = {
  id: number;
  name: string;
  code: string;
};

type ChargeTaxOption = {
  id: number;
  name: string;
  rate: number;
};

type WithholdingTaxOption = {
  id: number;
  name: string;
  rate: number;
};

type PaymentMethodOption = {
  id: number;
  name: string;
};

type Procedure = {
  product: string;
  description: string;
  quantity: number;
  unitValue: number;
  discount: number;
  chargeTax: string;
  withholdingTax: string;
  totalValue: number;
};

type PaymentMethod = {
  method: string;
  authorizationNumber: string;
  value: number;
};

@Component({
  selector: 'app-debit-credit-form',
  standalone: true,
  imports: [
    ButtonModule,
    TranslateModule,
    ToastModule,
    CardModule,
    InputTextModule,
    DropdownModule,
    ReactiveFormsModule,
    InputNumberModule,
    CalendarModule,
    TableModule,
    TagModule,
    CommonModule,
    RouterLink,
    TextareaModule,
    OverlayPanelModule,
    DialogModule,
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './debit-credit-form.component.html',
  styleUrl: './debit-credit-form.component.sass'
})
export class DebitCreditFormComponent extends BaseFormDirective implements OnInit {
  // Definición de propiedades con tipos
  invoiceOptions: InvoiceOption[] = [];
  typeOptions: TypeOption[] = [];
  customers: Customer[] = [];
  contactOptions: ContactOption[] = [];
  costCenterOptions: CostCenterOption[] = [];
  sellerOptions: SellerOption[] = [];
  dianReasonOptions: DianReasonOption[] = [];
  productOptions: ProductOption[] = [];
  chargeTaxOptions: ChargeTaxOption[] = [];
  withholdingTaxOptions: WithholdingTaxOption[] = [];
  paymentMethodOptions: PaymentMethodOption[] = [];

  proceduresArray: Procedure[] = [];
  paymentMethodsArray: PaymentMethod[] = [];

  constructor(
    toastr: ToastModule,
    fb: FormBuilder,
    public translate: TranslateService,
    private router: Router
  ) {
    super(toastr, fb);
  }

  ngOnInit() {
    this.initializeOptions();
    this.initializeForm();
  }

  initializeOptions() {
    // Inicialización de opciones con datos de ejemplo
    this.invoiceOptions = [
      { id: 1, number: 'FAC-001-0000001', date: new Date('2023-01-15') },
      { id: 2, number: 'FAC-001-0000002', date: new Date('2023-02-20') },
      { id: 3, number: 'FAC-001-0000003', date: new Date('2023-03-10') },
    ];

    this.typeOptions = [
      { id: 1, name: 'Nota de débito' },
      { id: 2, name: 'Nota de crédito' }
    ];

    this.customers = [
      { id: 1, fullName: 'Cliente Corporativo S.A.' },
      { id: 2, fullName: 'Distribuidora Nacional' },
      { id: 3, fullName: 'Importaciones del Sur' },
      { id: 4, fullName: 'Exportaciones Norte' }
    ];

    this.contactOptions = [
      { id: 1, name: 'Juan Pérez', email: 'juan@cliente.com', phone: '3001234567' },
      { id: 2, name: 'María Gómez', email: 'maria@cliente.com', phone: '3007654321' },
      { id: 3, name: 'Carlos Rojas', email: 'carlos@cliente.com', phone: '3109876543' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Ventas Nacionales' },
      { id: 2, name: 'Exportaciones' },
      { id: 3, name: 'Marketing' },
      { id: 4, name: 'Logística' }
    ];

    this.sellerOptions = [
      { id: 1, name: 'Vendedor 1' },
      { id: 2, name: 'Vendedor 2' },
      { id: 3, name: 'Vendedor 3' }
    ];

    this.dianReasonOptions = [
      { id: 1, name: 'Devolución', code: '1' },
      { id: 2, name: 'Descuento', code: '2' },
      { id: 3, name: 'Ajuste de precio', code: '3' },
      { id: 4, name: 'Intereses', code: '4' }
    ];

    this.productOptions = [
      { id: 1, name: 'Producto A', code: 'PROD001' },
      { id: 2, name: 'Producto B', code: 'PROD002' },
      { id: 3, name: 'Producto C', code: 'PROD003' }
    ];

    this.chargeTaxOptions = [
      { id: 1, name: 'IVA 19%', rate: 19 },
      { id: 2, name: 'IVA 5%', rate: 5 },
      { id: 3, name: 'Exento', rate: 0 }
    ];

    this.withholdingTaxOptions = [
      { id: 1, name: 'Retención 1%', rate: 1 },
      { id: 2, name: 'Retención 2%', rate: 2 },
      { id: 3, name: 'Retención 5%', rate: 5 },
      { id: 4, name: 'No aplica', rate: 0 }
    ];

    this.paymentMethodOptions = [
      { id: 1, name: 'Efectivo' },
      { id: 2, name: 'Tarjeta de crédito' },
      { id: 3, name: 'Transferencia bancaria' },
      { id: 4, name: 'Cheque' }
    ];

    // Inicialización de arrays para procedimientos y métodos de pago
    this.proceduresArray = [{
      product: '',
      description: '',
      quantity: 0,
      unitValue: 0,
      discount: 0,
      chargeTax: '',
      withholdingTax: '',
      totalValue: 0
    }];

    this.paymentMethodsArray = [{
      method: '',
      authorizationNumber: '',
      value: 0
    }];
  }

  initializeForm() {
    this.form = this.fb.group({
      // Información general
      invoice: ['', Validators.required],
      noteNumber: ['', Validators.required],
      type: ['', Validators.required],
      customer: ['', Validators.required],
      contact: ['', Validators.required],
      creationDate: [new Date(), Validators.required],
      costCenter: ['', Validators.required],
      seller: ['', Validators.required],
      // cufe: [''],
      invoiceDate: [new Date(), Validators.required],
      // dianReason: ['', Validators.required],
      invoiceNumber: ['', Validators.required],

      // Información de facturación (procedimientos)
      product: [''],
      description: [''],
      quantity: [0],
      unitValue: [0],
      discount: [0],
      chargeTax: [''],
      withholdingTax: [''],
      totalValue: [0],

      // Métodos de pago
      paymentMethod: [''],
      authorizationNumber: [''],
      paymentValue: [0]
    });
  }

  get totalValue() {
    let total = 0;
    this.proceduresArray.forEach(procedure => {
      const quantity = Number(procedure.quantity) || 0;
      const unitValue = Number(procedure.unitValue) || 0;
      const discount = Number(procedure.discount) || 0;

      const subtotal = quantity * unitValue;
      const discountAmount = subtotal * (discount / 100);

      total += subtotal - discountAmount;
    });
    return total.toFixed(2);
  }

  addProcedure() {
    this.proceduresArray.push({
      product: '',
      description: '',
      quantity: 0,
      unitValue: 0,
      discount: 0,
      chargeTax: '',
      withholdingTax: '',
      totalValue: 0
    });
  }

  removeProcedure(index: number) {
    if (this.proceduresArray.length > 1) {
      this.proceduresArray.splice(index, 1);
    }
  }

  addPayment() {
    this.paymentMethodsArray.push({
      method: '',
      authorizationNumber: '',
      value: 0
    });
  }

  removePayment(index: number) {
    if (this.paymentMethodsArray.length > 1) {
      this.paymentMethodsArray.splice(index, 1);
    }
  }

  cancel() {
    this.router.navigate(['/billing/debit-credit-notes']);
  }

  save() {
    if (this.form.valid) {
      console.log("Nota guardada", this.form.value);
      // Lógica para guardar la nota
    }
  }

  saveAndSend() {
    if (this.form.valid) {
      console.log("Nota guardada y enviada", this.form.value);
      // Lógica para guardar y enviar la nota
    }
  }
}
