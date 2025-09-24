import { userService } from "../../services/api/index.js";
export class MedicalSupplyManager {
  constructor(data) {
    this.data = data;
    const asyncScope = async () => {
      const user = await userService.getByExternalId(data.requested_by);
      this.requestedBy = {
        name: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`,
        email: user.email || '--',
        phone: user.phone || '--',
        address: user.address || '--'
      };
    };
    asyncScope();
  }
  get products() {
    return this.data.products;
  }
  get requestedBy() {
    return this.requestedBy_;
  }
  set requestedBy(value) {
    this.requestedBy_ = value;
  }
  get statusLabel() {
    const statusMap = {
      'pendiente': 'Pendiente',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'entregado': 'Entregado'
    };
    return statusMap[this.data.status] || this.data.status;
  }
  get statusSeverity() {
    const severityMap = {
      'pendiente': 'warning',
      'aprobado': 'success',
      'rechazado': 'danger',
      'entregado': 'info'
    };
    return severityMap[this.data.status] || 'secondary';
  }
  getSubtotal() {
    return this.data.products.reduce((total, item) => total + item.product?.sale_price * item.quantity, 0);
  }
}