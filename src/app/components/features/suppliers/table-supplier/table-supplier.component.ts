import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';

interface Supplier {
  id: number;
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
  email: string;
  estado: string;
}

@Component({
  selector: 'app-table-supplier',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    TagModule
  ],
  templateUrl: './table-supplier.component.html',
  styleUrls: ['./table-supplier.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TableSupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  selectedSuppliers: Supplier[] = [];
  loading: boolean = true;
  displayDialog: boolean = false;
  nuevoSupplier: Supplier = this.emptySupplier();

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.loading = true;
    setTimeout(() => {
      this.suppliers = this.generateMockData();
      this.loading = false;
    }, 1000);
  }

  generateMockData(): Supplier[] {
    return [
      { id: 1, nombre: 'Proveedor Uno S.A.', ruc: '20123456789', direccion: 'Av. Principal 123', telefono: '987654321', email: 'proveedor1@example.com', estado: 'Activo' },
      { id: 2, nombre: 'Suministros Dos Ltda.', ruc: '20234567890', direccion: 'Calle Secundaria 456', telefono: '987654322', email: 'proveedor2@example.com', estado: 'Inactivo' },
      { id: 3, nombre: 'Distribuidora Tres', ruc: '20345678901', direccion: 'Jr. Comercial 789', telefono: '987654323', email: 'proveedor3@example.com', estado: 'Activo' },
      { id: 4, nombre: 'Comercial Cuatro S.A.S.', ruc: '20456789012', direccion: 'Av. Industrial 101', telefono: '987654324', email: 'proveedor4@example.com', estado: 'Pendiente' },
      { id: 5, nombre: 'Empresa Cinco', ruc: '20567890123', direccion: 'Calle Los Olivos 202', telefono: '987654325', email: 'proveedor5@example.com', estado: 'Activo' },
    ];
  }

  emptySupplier(): Supplier {
    return {
      id: 0,
      nombre: '',
      ruc: '',
      direccion: '',
      telefono: '',
      email: '',
      estado: 'Activo'
    };
  }

  showDialogToAdd() {
    this.nuevoSupplier = this.emptySupplier();
    this.displayDialog = true;
  }

  save() {
    if (this.nuevoSupplier.nombre.trim() && this.nuevoSupplier.ruc.trim()) {
      if (this.nuevoSupplier.id === 0) {
        // Agregar nuevo
        this.nuevoSupplier.id = this.generateNewId();
        this.suppliers = [...this.suppliers, this.nuevoSupplier];
        this.showSuccessMessage('Proveedor agregado correctamente');
      } else {
        // Editar existente
        const index = this.suppliers.findIndex(p => p.id === this.nuevoSupplier.id);
        this.suppliers[index] = {...this.nuevoSupplier};
        this.suppliers = [...this.suppliers];
        this.showSuccessMessage('Proveedor actualizado correctamente');
      }
      this.displayDialog = false;
    }
  }

  generateNewId(): number {
    const maxId = Math.max(...this.suppliers.map(s => s.id), 0);
    return maxId + 1;
  }

  editSupplier(supplier: Supplier) {
    this.nuevoSupplier = {...supplier};
    this.displayDialog = true;
  }

  deleteSupplier(supplier: Supplier) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al proveedor <strong>${supplier.nombre}</strong> con RUC ${supplier.ruc}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, Eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.suppliers = this.suppliers.filter(p => p.id !== supplier.id);
        this.selectedSuppliers = this.selectedSuppliers.filter(p => p.id !== supplier.id);
        // Cambiado a showErrorMessage para que sea rojo
        this.showErrorMessage('Proveedor eliminado', `El proveedor "${supplier.nombre}" ha sido eliminado permanentemente`);
      },
      reject: () => {
        this.showInfoMessage('Eliminación cancelada', 'La eliminación fue cancelada');
      }
    });
  }

  // Agrega este nuevo método para mostrar advertencias
  showErrorMessage(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',  // Usamos 'error' para color rojo
      summary: summary,
      detail: detail,
      life: 3000,
      closable: true
    });
  }

  showSuccessMessage(detail: string) {
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: detail,
      life: 3000
    });
  }

  showInfoMessage(summary: string, detail: string) {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: detail,
      life: 2000
    });
  }

  getSeverity(estado: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | undefined {
    switch (estado) {
      case 'Activo':
        return 'success';
      case 'Inactivo':
        return 'danger';
      case 'Pendiente':
        return 'warn';
      default:
        return 'info';
    }
  }
}
