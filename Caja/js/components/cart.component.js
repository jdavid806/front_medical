export const cartService = {
  cart: [],
  discountPercentage: 0,

  addItem(product) {
    const existingItem = this.cart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      });
    }
  },

  removeItem(id) {
    this.cart = this.cart.filter(item => item.id !== id);
  },

  updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;

    const item = this.cart.find(item => item.id === id);
    if (item) {
      item.quantity = newQuantity;
    }
  },

  clearCart() {
    this.cart = [];
    this.discountPercentage = 0;
  },

  setDiscount(discount) {
    this.discountPercentage = discount;
  },

  getTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * this.discountPercentage) / 100;
    const total = subtotal - discountAmount;

    return { subtotal, discountAmount, total };
  }
};