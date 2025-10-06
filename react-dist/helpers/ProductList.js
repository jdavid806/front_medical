export class MedicalSupplyManager {
  constructor(data) {
    this.data = data;
  }
  getSubtotal() {
    return this.data.products.reduce((total, item) => total + item.product.sale_price * item.quantity, 0);
  }
}