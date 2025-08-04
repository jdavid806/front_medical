import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ModalSalesInvoiceComponent } from '../modal-sales-invoice/modal-sales-invoice.component';


// Definición de tipos
type TypeOption = {
  id: number;
  name: string;
};

type Customer = {
  id: number;
  fullName: string;
};

type MoneySourceOption = {
  id: number;
  name: string;
};

type CostCenterOption = {
  id: number;
  name: string;
};

type MakePaymentOption = {
  id: number;
  name: string;
};

type Product = {
  name: string;
  code: string;
};

type PaymentMethod = {
  method: string;
  authorizationNumber: string;
  value: number;
};

type InvoiceProduct = {
  product: string;
  quantity: number;
  price: number;
  discount: number;
  iva: number;
};

@Component({
  selector: 'app-sales-invoice-form',
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
    ButtonModule,
    ModalSalesInvoiceComponent,
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
  templateUrl: './sales-invoice-form.component.html',
  styleUrl: './sales-invoice-form.component.sass'
})
export class SalesInvoiceFormComponent extends BaseFormDirective implements OnInit {
  // Definición de propiedades con tipos
  typeOptions: TypeOption[] = [];
  customers: Customer[] = [];
  moneySourceOptions: MoneySourceOption[] = [];
  costCenterOptions: CostCenterOption[] = [];
  makepaymentOptions: MakePaymentOption[] = [];
  products: Product[] = [];
  recipientOptions: Product[] = [];
  sellerOptions: Product[] = [];
  ivaOptions: TypeOption[] = [];
  retentionTaxOptions: TypeOption[] = [];

  productsArray: InvoiceProduct[] = [];
  paymentMethodsArray: PaymentMethod[] = [];
  formattedDate: Date = new Date();
  customerDropdownOpen = false;
  @ViewChild(ModalSalesInvoiceComponent)
  private modalSalesInvoice!: ModalSalesInvoiceComponent;
  openNewContactModal() {
    this.modalSalesInvoice.showDialog();
  }

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
    // Inicialización de opciones con tipos definidos
    this.typeOptions = [
      { id: 1, name: 'Factura electrónica' },
      { id: 2, name: 'Nota de crédito' },
      { id: 3, name: 'Nota de débito' },
      { id: 4, name: 'Comprobante de retención' }
    ];

    this.makepaymentOptions = [
      { id: 1, name: 'Efectivo' },
      { id: 2, name: 'Tarjeta de crédito' },
      { id: 3, name: 'Transferencia bancaria' },
      { id: 4, name: 'Cheque' }
    ];

    this.moneySourceOptions = [
      { id: 1, name: 'Banco' },
      { id: 2, name: 'Efectivo' },
      { id: 3, name: 'Transferencia' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Ventas Nacionales' },
      { id: 2, name: 'Exportaciones' },
      { id: 3, name: 'Marketing' },
      { id: 4, name: 'Logística' }
    ];

    this.customers = [
      { id: 1, fullName: 'Cliente Corporativo S.A.' },
      { id: 2, fullName: 'Distribuidora Nacional' },
      { id: 3, fullName: 'Importaciones del Sur' },
      { id: 4, fullName: 'Exportaciones Norte' }
    ];

    this.products = [
      { name: 'Producto 1', code: '001' },
      { name: 'Producto 2', code: '002' },
      { name: 'Producto 3', code: '003' },
      { name: 'Producto 4', code: '004' },
      { name: 'Producto 5', code: '005' }
    ];

    this.recipientOptions = [
      { name: 'Sucursal Principal', code: 'DES001' },
      { name: 'Almacén Central', code: 'DES002' },
      { name: 'Oficina Administrativa', code: 'DES003' },
      { name: 'Punto de Venta 1', code: 'DES004' }
    ];

    this.sellerOptions = [
      { name: 'Juan Pérez', code: 'VEN001' },
      { name: 'María Gómez', code: 'VEN002' },
      { name: 'Carlos Rojas', code: 'VEN003' },
      { name: 'Ana Martínez', code: 'VEN004' }
    ];

    this.ivaOptions = [
      { id: 0, name: '0%' },
      { id: 12, name: '12%' },
      { id: 14, name: '14%' }
    ];

    this.retentionTaxOptions = [
      { id: 0, name: 'No aplica' },
      { id: 1, name: '1%' },
      { id: 2, name: '2%' },
      { id: 5, name: '5%' },
      { id: 10, name: '10%' }
    ];

    // Inicialización de arrays para productos y métodos de pago
    this.productsArray = [{
      product: '',
      quantity: 0,
      price: 0,
      discount: 0,
      iva: 0,
    }];

    this.paymentMethodsArray = [{
      method: '',
      authorizationNumber: '',
      value: 0,
    }];
  }

  initializeForm() {
    this.form = this.fb.group({
      receiptType: ['', Validators.required],
      // invoiceNumber:  ['',Validators.required],
      type: ['', Validators.required],
      seller: ['', Validators.required],
      addressee: ['', Validators.required],
      costcenter:['',Validators.required],
      creationDate: ['', Validators.required],
      products:['',Validators.required],
      amount: ['', Validators.required],
      unitvalue: ['', Validators.required],
      discount: ['', Validators.required],
      iva: ['', Validators.required],
      withholdingtax: ['', Validators.required],
      totalvalue: ['', Validators.required],
      id: [''],
      customer: ['', Validators.required],
      costCenter: ['', Validators.required],
      date: [new Date(), Validators.required],
      expirationonDate: [new Date(), Validators.required],
    });
  }

  // Resto de métodos (addProduct, removeProduct, etc.) permanecen igual
  get totalValue() {
    let total = 0;
    this.productsArray.forEach(element => {
      const quantity = Number(element.quantity) || 0;
      const price = Number(element.price) || 0;
      total += quantity * price;
    });
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


  onCreditNoteCreated(newCreditNote: any) {
    console.log('Nueva nota de crédito creada:', newCreditNote);
  }

  toggleCustomerDropdown() {
    this.customerDropdownOpen = !this.customerDropdownOpen;
  }

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
