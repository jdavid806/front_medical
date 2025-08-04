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
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  selector: 'app-debit-note-form',
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
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './debit-note-form.component.html',
  styleUrl: './debit-note-form.component.sass',
})
export class DebitNoteFormComponent
  extends BaseFormDirective
  implements OnInit
{
  moneySourceOptions: any[] = [];
  costCenterOptions: any[] = [];
  typeOptions: any[] = [];
  clientsOptions: any[] = [];
  makepayment: any[] = [];

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
    this.moneySourceOptions = [
      { id: 1, name: 'Efectivo', account: '11050501' },
      { id: 2, name: 'Tarjeta debito', account: '11050502' },
      { id: 3, name: 'Tarjeta Credito', account: '11050503' },
      { id: 4, name: 'Enviame', account: '1105050322' },
      { id: 5, name: 'Addi', account: '1105050312' },
      { id: 6, name: 'Cruce Con Priviet', account: '1105052412' },
    ];

    this.makepayment = [
      { id: 1, name: 'Abono Deuda' },
      { id: 2, name: 'Anticipo' },
      { id: 3, name: 'Avanzado (Impuestos, descuentos y ajustes)' },
    ];

    this.costCenterOptions = [
      { id: 1, code: '1-1', name: 'Administración' },
      { id: 2, code: '2-2', name: 'Productopolis' },
      { id: 3, code: '3-3', name: 'Perfumes' },
    ];

    this.typeOptions = [
      { id: 1, name: 'RC-RECIBO DE PAGO' },
      { id: 2, name: 'RV-RECIBO DE VENTA' },
      { id: 3, name: 'RA-REICBO DE AJUSTE ' },
    ];

    this.clientsOptions = [
      { id: 1, fullName: 'Javier Antonio Moreno' },
      { id: 2, fullName: 'Ariana Arango Caro' },
      { id: 3, fullName: 'Alexandra Milena Avila' },
    ];
  }

  initializeForm() {
    this.form = this.fb.group({
      moneySource: ['', Validators.required],
      costCenter: ['', Validators.required],
      type: ['', Validators.required],
      make: ['', Validators.required],
      clients: ['', Validators.required],
      invoiceNumber: [
        {
          value: 'DN-' + Math.floor(1000 + Math.random() * 9000),
          disabled: true,
        },
      ],
      creationDate: ['', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      observations: ['', Validators.required],
    });
  }

  showNewCustomerDialog() {
    console.log('Mostrar diálogo para nuevo cliente');
  }
}
