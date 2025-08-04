import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core'; // Añadido ViewChild
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
import { ModalCreditNoteComponent } from '../modal-credit-note/modal-credit-note.component';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-credit-note-form',
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
    DatePickerModule,
    ModalCreditNoteComponent
  ],
  templateUrl: './credit-note-form.component.html',
  styleUrl: './credit-note-form.component.sass'
})
export class CreditNoteFormComponent extends BaseFormDirective implements OnInit {
  typeOptions: any[] = [];
  customers: any[] = [];
  moneySourceOptions: any[] = [];
  costCenterOptions: any[] = [];
  makepayment: any[] = [];
  customerDropdownOpen = false;

  @ViewChild(ModalCreditNoteComponent) modalCreditNote!: ModalCreditNoteComponent;

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
    this.typeOptions = [
      { id: 1, name: 'Tipo 1' },
      { id: 2, name: 'Tipo 2' },
      { id: 3, name: 'Tipo 3' }
    ];

    this.makepayment = [
      { id: 1, name: 'Abono Deuda' },
      { id: 2, name: 'Anticipo' },
      { id: 3, name: 'Avanzado (Impuestos, descuentos y ajustes)' },
    ];



    this.moneySourceOptions = [
      { id: 1, name: 'Banco' },
      { id: 2, name: 'Efectivo' },
      { id: 3, name: 'Transferencia' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Centro 1' },
      { id: 2, name: 'Centro 2' },
      { id: 3, name: 'Centro 3' }
    ];

    this.customers = [
      { id: 1, fullName: 'Juan Pérez'},
      { id: 2, fullName: 'María Gómez'},
      { id: 3, fullName: 'Carlos Ruiz'}
    ];
  }

  initializeForm() {
    this.form = this.fb.group({
      type: ['', Validators.required],
      make:['',Validators.required],
      customer: ['', Validators.required],
      moneySource: ['', Validators.required],
      invoiceNumber: [{value: 'FAC-001', disabled: true}],
      creationDate: ['', Validators.required],
      costCenter: ['', Validators.required],
      amountPaid: [0, [Validators.required, Validators.min(0)]],
      observations: ['']
    });
  }


  showNewCustomerDialog() {
    this.modalCreditNote.showDialog();
  }

  onCreditNoteCreated(newCreditNote: any) {
    console.log('Nueva nota de crédito creada:', newCreditNote);
    // Aquí puedes manejar los datos de la nueva nota de crédito
    // Por ejemplo, agregar el cliente a la lista si es necesario
  }

  toggleCustomerDropdown() {
    this.customerDropdownOpen = !this.customerDropdownOpen;
  }
}
