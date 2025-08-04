import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule, FormArray, FormControl } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  selector: 'app-modal-credit-note',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DialogModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    StepsModule,
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './modal-credit-note.component.html',
  styleUrls: ['./modal-credit-note.component.scss']
})
export class ModalCreditNoteComponent {
  @Output() creditNoteCreated = new EventEmitter<any>();
  @Output() onHide = new EventEmitter<void>();

  visible = false;
  currentStep = 0;
  steps: MenuItem[] = [
    { label: 'Información Básica' },
    { label: 'Datos de Facturación' }
  ];

  // Opciones para los selects
  typeOptions = [
    { label: 'Tipo 1', value: 1 },
    { label: 'Tipo 2', value: 2 },
    { label: 'Tipo 3', value: 3 }
  ];

  documentTypeOptions = [
    { label: 'Cédula', value: 'CC' },
    { label: 'NIT', value: 'NIT' },
    { label: 'Pasaporte', value: 'PA' },
    { label: 'Cédula Extranjería', value: 'CE' }
  ];

  cityOptions = [
    { label: 'Bogotá', value: 'BOG' },
    { label: 'Medellín', value: 'MED' },
    { label: 'Cali', value: 'CAL' },
    { label: 'Barranquilla', value: 'BAQ' },
    { label: 'Santa Marta', value: 'SAN' },
    { label: 'Cartagena', value: 'CAR' }
  ];

  regimenOptions = [
    { label: 'Simplificado', value: 'SIM' },
    { label: 'Común', value: 'COM' },
    { label: 'Gran Contribuyente', value: 'GRA' }
  ];

  responsibilityOptions = [
    { label: '0-13 : Gran Contribuyente', value: '0-13' },
    { label: '0-15 : Autorretenedor', value: '0-15' },
    { label: '0-23 : Agente de Retención IVA', value: '0-23' },
    { label: '0-47 : Régimen Simple de Tributación', value: '0-47' }
  ];

  basicInfoForm: FormGroup;
  billingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService
  ) {
    this.basicInfoForm = this.fb.group({
      type: ['', Validators.required],
      documentType: ['', Validators.required],
      contactName: ['', Validators.required],
      city: ['', Validators.required],
      documentNumber: ['', [Validators.required, Validators.min(1)]],
      contactLastName: ['', Validators.required],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });

    // Inicializar el FormArray con controles explícitos
    const responsibilityControls = this.responsibilityOptions.map(() => new FormControl(false));
    this.billingForm = this.fb.group({
      billingContactName: ['', Validators.required],
      billingContactLastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      billingPhoneNumber: ['', Validators.required],
      regimenType: ['', Validators.required],
      fiscalResponsibilities: this.fb.array(responsibilityControls, Validators.required)
    });
  }

  // Getter para acceder al FormArray con tipo explícito
  get fiscalResponsibilities(): FormArray<FormControl<boolean>> {
    return this.billingForm.get('fiscalResponsibilities') as FormArray<FormControl<boolean>>;
  }

  showDialog() {
    this.visible = true;
    this.currentStep = 0;
    this.basicInfoForm.reset();
    this.billingForm.reset();
  }

  hideDialog() {
    this.visible = false;
    this.onHide.emit();
  }

  nextStep() {
    if (this.currentStep === 0 && this.basicInfoForm.valid) {
      this.currentStep++;
      // Copiar datos del primer formulario al segundo
      this.billingForm.patchValue({
        billingContactName: this.basicInfoForm.value.contactName,
        billingContactLastName: this.basicInfoForm.value.contactLastName,
        billingPhoneNumber: this.basicInfoForm.value.phoneNumber
      });
    }
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  onSubmit() {
    if (this.basicInfoForm.valid && this.billingForm.valid) {
      const formData = {
        ...this.basicInfoForm.value,
        ...this.billingForm.value,
        selectedResponsibilities: this.getSelectedResponsibilities()
      };
      this.creditNoteCreated.emit(formData);
      this.hideDialog();
    }
  }

  getSelectedResponsibilities(): string[] {
    return this.fiscalResponsibilities.value
      .map((checked: boolean, i: number) => checked ? this.responsibilityOptions[i].value : null)
      .filter((v: string | null) => v !== null);
  }

  get isFirstStep(): boolean {
    return this.currentStep === 0;
  }

  get isLastStep(): boolean {
    return this.currentStep === this.steps.length - 1;
  }
}
