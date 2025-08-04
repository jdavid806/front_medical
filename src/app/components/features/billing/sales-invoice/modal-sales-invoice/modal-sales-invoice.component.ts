import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-modal-sales-invoice',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    InputMaskModule,
    FormsModule,
    ToastModule
  ],
  templateUrl: './modal-sales-invoice.component.html',
  styleUrls: ['./modal-sales-invoice.component.sass'],
  providers: [MessageService]
})
export class ModalSalesInvoiceComponent {
  visible: boolean = false;

  newContact = {
    nombre: '',
    apellido: '',
    email: '',
    celular: '',
    notas: ''
  };

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    // Reset form
    this.newContact = {
      nombre: '',
      apellido: '',
      email: '',
      celular: '',
      notas: ''
    };
  }

  saveContact() {
    // Aquí iría la lógica para guardar el contacto
    console.log('Contacto guardado:', this.newContact);

    // Mostrar mensaje de éxito
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Contacto creado correctamente'
    });

    this.hideDialog();
  }

  constructor(private messageService: MessageService) {}
}
