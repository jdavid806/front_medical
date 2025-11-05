export class CashRegisterProductHelper {
  static calculateTotal(products) {
    return products.reduce((acc, product) => acc + product.price * product.quantity, 0);
  }
}