export class MedicationPrescriptionManager {
  constructor(data) {
    this.data = data;
  }
  get products() {
    return this.data.recipe_items;
  }
  get patient() {
    return {
      name: `${this.data.patient.first_name || ''} ${this.data.patient.middle_name || ''} ${this.data.patient.last_name || ''} ${this.data.patient.second_last_name || ''}`,
      email: this.data.patient.email,
      phone: this.data.patient.whatsapp,
      address: this.data.patient.address
    };
  }
  get prescriber() {
    return {
      name: `${this.data.prescriber.first_name || ''} ${this.data.prescriber.middle_name || ''} ${this.data.prescriber.last_name || ''} ${this.data.prescriber.second_last_name || ''}`,
      email: this.data.prescriber.email,
      phone: this.data.prescriber.phone,
      address: this.data.prescriber.address
    };
  }
  get statusLabel() {
    const statusMap = {
      'PENDING': 'Pendiente',
      'DELIVERED': 'Entregado'
    };
    return statusMap[this.data.status] || this.data.status;
  }
  get statusSeverity() {
    const severityMap = {
      'PENDING': 'warning',
      'DELIVERED': 'success'
    };
    return severityMap[this.data.status] || 'secondary';
  }
}