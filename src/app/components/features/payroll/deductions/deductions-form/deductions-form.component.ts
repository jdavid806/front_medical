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
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-deductions-form',
  imports: [
    ButtonModule,
    TranslateModule,
    ToastModule,
    CommonModule,
    RouterLink,
    CardModule,
    TextareaModule,
    InputTextModule,
    SelectModule,
    ReactiveFormsModule,
    InputNumberModule,
  ],
  templateUrl: './deductions-form.component.html',
  styleUrl: './deductions-form.component.sass',
})
export class DeductionsFormComponent
  extends BaseFormDirective
  implements OnInit
{
  discountOptions: any[] = [];
  applicableOptions: any[] = [];
  workerOptions: any[] = [];

  constructor(
    toastr: ToastModule,
    fb: FormBuilder,
    public translate: TranslateService,
    private router: Router
  ) {
    super(toastr, fb);
  }

  ngOnInit() {
    this.discountOptions = [
      { id: 1, name: 'Porcentaje de salario' },
      { id: 2, name: 'Monto fijo' },
    ];
    this.applicableOptions = [
      { id: 1, name: 'Todos' },
      { id: 2, name: 'Indicar trabajadores' },
      { id: 3, name: 'Rango salarial' },
    ];
    this.workerOptions = [
      { id: 1, name: 'Alejandro' },
      { id: 2, name: 'Miguel' },
      { id: 3, name: 'Carlos' },
    ];
    this.form = this.fb.group({
      name: ['', Validators.required],
      discountTo: ['', [Validators.required]],
      value: [0, [Validators.required]],
      percentage: [0, [Validators.required]],
      applicableTo: ['', [Validators.required]],
      worker: ['', [Validators.required]],
      salaryRangeStart: [0],
      salaryRangeEnd: [0],
      notes: [''], 
    });
  }

  save() {
    this.router.navigate(['./payroll/deductions']);
    console.log(this.form);
  }
}
