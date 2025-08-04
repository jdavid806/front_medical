import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BaseFormDirective } from '@directives';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';

interface Invoice {
  code: string;
  name: string;
  description?: string;
}

interface PeriodicityOption {
  code: string;
  name: string;
}

@Component({
  selector: 'app-recurring-invoice-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    CheckboxModule,
    CardModule,
    ButtonModule,
    RouterLink,
    TranslateModule,
    ToastModule
  ],
  templateUrl: './recurring-invoice-form.component.html',
  styleUrls: ['./recurring-invoice-form.component.sass']
})
export class RecurringInvoiceFormComponent extends BaseFormDirective implements OnInit {
  invoiceOptions: Invoice[] = [];
  periodicityOptions: PeriodicityOption[] = [
    { code: 'once', name: 'Una sola vez' },
    { code: 'biweekly', name: 'Quincenal' },
    { code: 'monthly', name: 'Mensual' },
    { code: 'bimonthly', name: 'Bimestral' },
    { code: 'quarterly', name: 'Trimestral' },
    { code: 'semiannual', name: 'Semestral' },
    { code: 'annual', name: 'Anual' }
  ];

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

  initializeForm() {
    this.form = this.fb.group({
      invoiceNumber: ['', Validators.required],
      descriptions: ['', Validators.required],
      createNewModel: [false],
      periodicity: [''],
      frequency: [1, [Validators.min(1)]],
      repeatIndefinitely: [false]
    });

    // Deshabilitar campos de recurrencia inicialmente
  }

  initializeOptions() {
    // Mock data for invoices dropdown
    this.invoiceOptions = [
      { code: 'FV-2023-001', name: 'Factura 001 - Cliente A' },
      { code: 'FV-2023-002', name: 'Factura 002 - Cliente B', description: 'Servicios de consultoría' },
      { code: 'FV-2023-003', name: 'Factura 003 - Cliente C' },
      { code: 'FV-2023-004', name: 'Factura 004 - Cliente D', description: 'Desarrollo software' },
      { code: 'FV-2023-005', name: 'Factura 005 - Cliente E' }
    ];
  }

  toggleRecurrenceFields() {
    const createNewModel = this.form.get('createNewModel')?.value;

    if (createNewModel) {
      this.form.get('periodicity')?.enable();
      this.form.get('periodicity')?.setValidators([Validators.required]);
      this.form.get('frequency')?.enable();
      this.form.get('repeatIndefinitely')?.enable();
    } else {
      this.form.get('periodicity')?.disable();
      this.form.get('periodicity')?.clearValidators();
      this.form.get('frequency')?.disable();
      this.form.get('repeatIndefinitely')?.disable();
      this.form.get('repeatIndefinitely')?.setValue(false);
    }

    this.form.get('periodicity')?.updateValueAndValidity();
  }

  toggleFrequencyField() {
    const repeatIndefinitely = this.form.get('repeatIndefinitely')?.value;

    if (repeatIndefinitely) {
      this.form.get('frequency')?.disable();
      this.form.get('frequency')?.clearValidators();
    } else {
      this.form.get('frequency')?.enable();
      this.form.get('frequency')?.setValidators([Validators.required, Validators.min(1)]);
    }

    this.form.get('frequency')?.updateValueAndValidity();
  }

  cancel() {
    console.log("Acción cancelada");
  }

  save() {
    console.log("Factura guardada", this.form.value);
  }

  getInvoiceDisplay(invoice: Invoice): string {
    return invoice.description
      ? `${invoice.name} (${invoice.description})`
      : invoice.name;
  }
}
