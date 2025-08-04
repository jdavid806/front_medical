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

// Tipos
type Option = {
  id: number;
  name: string;
};


type Procedure = {
  medicalPatient: string;
  date: string;
  medicalProcedure: string;
  autorizationNumber: string;
  quantity: number;
  value: number;
  totalValue: number;
};

type PaymentMethod = {
  paymentMethod: string;
  autorizationNumber: string;
  value: number;
};

@Component({
  selector: 'app-entities-invoice-form',
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
  templateUrl: './entities-invoice-form.component.html',
  styleUrl: './entities-invoice-form.component.sass'
})
export class EntitiesInvoiceFormComponent extends BaseFormDirective implements OnInit {
  sellerTypeOptions: Option[] = [];
  entityOptions: Option[] = [];
  costCenterOptions: Option[] = [];
  patientOptions: Option[] = [];
  procedureOptions: Option[] = [];
  specialistOptions: Option[] = [];
  paymentMethodOptions: Option[] = [];

  proceduresArray: Procedure[] = [];
  paymentMethodsArray: PaymentMethod[] = [];
  medicalPatientOptions: any[] = [];
  medicalProcedureOptions: any[] = [];
  autorizationNumberOptions: any[] = [];
  constructor(
    toastr: ToastModule,
    fb: FormBuilder,
    public translate: TranslateService,
    private router: Router
  ) {
    super(toastr, fb); // Se puede usar null si no usas toastr en este componente
  }

  ngOnInit(): void {
    this.initializeOptions();
    this.initializeForm();
  }

  initializeOptions(): void {
    this.sellerTypeOptions = [
      { id: 1, name: 'Médico' },
      { id: 2, name: 'Institución' },
      { id: 3, name: 'Proveedor' }
    ];

    this.entityOptions = [
      { id: 1, name: 'EPS Sura' },
      { id: 2, name: 'Coomeva' },
      { id: 3, name: 'Sanitas' },
      { id: 4, name: 'Nueva EPS' }
    ];

    this.costCenterOptions = [
      { id: 1, name: 'Consultorios' },
      { id: 2, name: 'Hospitalización' },
      { id: 3, name: 'Urgencias' },
      { id: 4, name: 'Laboratorio' }
    ];

    this.patientOptions = [
      { id: 1, name: 'Juan Pérez' },
      { id: 2, name: 'María Gómez' },
      { id: 3, name: 'Carlos Rojas' }
    ];

    this.procedureOptions = [
      { id: 1, name: 'Consulta general' },
      { id: 2, name: 'Examen de laboratorio' },
      { id: 3, name: 'Radiografía' },
      { id: 4, name: 'Ecografía' }
    ];

    this.specialistOptions = [
      { id: 1, name: 'Dr. Andrés López' },
      { id: 2, name: 'Dra. Sandra Martínez' },
      { id: 3, name: 'Dr. Carlos Ramírez' }
    ];

    this.paymentMethodOptions = [
      { id: 1, name: 'Transferencia bancaria' },
      { id: 2, name: 'Cheque' },
      { id: 3, name: 'Efectivo' },
      { id: 4, name: 'Tarjeta de crédito' }
    ];

    this.proceduresArray = [{
      medicalPatient: '',
      date: '',
      medicalProcedure: '',
      autorizationNumber: '',
      quantity: 0,
      totalValue: 0,
      value: 0
    }];

    this.paymentMethodsArray = [{
      paymentMethod: '',
      autorizationNumber: '',
      value: 0
    }];


    this.medicalPatientOptions = [
      { id: 1, name: 'Juan Pérez', document: '123456789' },
      { id: 2, name: 'María Gómez', document: '987654321' },
      { id: 3, name: 'Carlos Rojas', document: '456123789' },
      { id: 4, name: 'Ana López', document: '789456123' },
      { id: 5, name: 'Pedro Sánchez', document: '321654987' }
    ];

    this.medicalProcedureOptions = [
      { id: 1, code: 'CPT-99213', name: 'Consulta de oficina', value: 150000 },
      { id: 2, code: 'CPT-80048', name: 'Hemograma completo', value: 45000 },
      { id: 3, code: 'CPT-71020', name: 'Radiografía de tórax', value: 120000 },
      { id: 4, code: 'CPT-93000', name: 'Electrocardiograma', value: 80000 },
      { id: 5, code: 'CPT-99214', name: 'Consulta especializada', value: 250000 }
    ];

    this.autorizationNumberOptions = [
      { id: 1, number: 'AUT-2023-001', entity: 'EPS Sura', date: '2023-01-15' },
      { id: 2, number: 'AUT-2023-002', entity: 'Sanitas', date: '2023-02-20' },
      { id: 3, number: 'AUT-2023-003', entity: 'Coomeva', date: '2023-03-10' },
      { id: 4, number: 'AUT-2023-004', entity: 'Nueva EPS', date: '2023-04-05' },
      { id: 5, number: 'AUT-2023-005', entity: 'Savia Salud', date: '2023-05-12' }
    ];
  }

  initializeForm(): void {
    this.form = this.fb.group({
      sellerType: ['', Validators.required],
      entity: ['', Validators.required],
      preparationDate: [new Date(), Validators.required],
      expirationDate: [new Date(), Validators.required],
      costCenter: ['', Validators.required],
      procedureStartDate: [new Date(), Validators.required],
      procedureEndDate: [new Date(), Validators.required],
      patient: ['', Validators.required],
      procedure: ['', Validators.required],
      specialist: ['', Validators.required],
      procedures: this.fb.array([]),
      medicalpatient: ['', Validators.required],
      medicalprodedure: ['', Validators.required],
      date: [new Date(), Validators.required],
      autorizationnumber: ['', Validators.required],
      quantity: [0, Validators.required],
      value: [0, Validators.required],
      totalvalue: [0, Validators.required],
      paymentMethod: ['', Validators.required],
    });

  }




  get totalValue(): string {
    let total = 0;
    this.proceduresArray.forEach(p => {
      total += (p.quantity || 0) * (p.value || 0);
    });
    return total.toFixed(2);
  }

  addProcedure(){
    this.proceduresArray.push({
      medicalPatient: '',
      date: '',
      medicalProcedure: '',
      autorizationNumber: '',
      quantity: 0,
      value: 0,
      totalValue: 0
    });
  }

  removeProcedure(index: number): void {
    this.proceduresArray.splice(index, 1);
  }

  addPayment() {
    this.paymentMethodsArray.push({
      paymentMethod: '',
      autorizationNumber: '',
      value: 0
    });
  }

  removePayment(index: number): void {
    this.paymentMethodsArray.splice(index, 1);
  }

  cancel(): void {
    this.router.navigate(['/billing/entities']);
  }

  save(): void {
    if (this.form.valid) {
      console.log('Factura guardada', this.form.value);
      // Guardar lógica
    }
  }

  saveAndSend(): void {
    if (this.form.valid) {
      console.log('Factura guardada y enviada', this.form.value);
      // Guardar y enviar lógica
    }
  }
}
