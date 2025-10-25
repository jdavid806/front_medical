export class MedicalSupplyManager {
  constructor(data) {
    this.data = data;
    // const asyncScope = async () => {
    //     if (!data.requested_by) return;
    //     const user: UserDto = await userService.getByExternalId(data.requested_by);
    //     this.requestedBy = {
    //         name: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`,
    //         email: user.email || '--',
    //         phone: user.phone || '--',
    //         address: user.address || '--'
    //     };
    // }
    //asyncScope();
  }
  get products() {
    return this.data.products;
  }
  get requestedBy() {
    return {
      id: this.data.requested_by_user?.id || '--',
      name: `${this.data.requested_by_user?.first_name || ''} ${this.data.requested_by_user?.middle_name || ''} ${this.data.requested_by_user?.last_name || ''} ${this.data.requested_by_user?.second_last_name || ''}`,
      email: this.data.requested_by_user?.email || '--',
      phone: this.data.requested_by_user?.phone || '--',
      address: this.data.requested_by_user?.address || '--',
      external_id: this.data.requested_by_user?.external_id || '--'
    };
  }
  get statusLabel() {
    const statusMap = {
      'pendiente': 'Pendiente',
      'parcialmente_entregado': 'Parcialmente entregado',
      'aprobado': 'Aprobado',
      'rechazado': 'Rechazado',
      'entregado': 'Entregado'
    };
    return statusMap[this.data.status] || this.data.status;
  }
  get statusSeverity() {
    const severityMap = {
      'pendiente': 'warning',
      'parcialmente_entregado': 'warning',
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