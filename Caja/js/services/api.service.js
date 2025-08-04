const BASE_URL = window.location.origin;

export const apiService = {
  async fetchCategories() {
    const response = await fetch(`${BASE_URL}/api/v1/admin/category-products`);
    return response.json();
  },

  async fetchPaymentMethods() {
    const response = await fetch(`${BASE_URL}/api/v1/admin/payment-methods`);
    return response.json();
  },

  async fetchPatients() {
    const response = await fetch(`${BASE_URL}/medical/patients`);
    return response.json();
  },

  async fetchProducts() {
    const response = await fetch(`${BASE_URL}/api/v1/admin/products/medicamentos`);
    return response.json();
  },

  async createInvoice(payload) {
    const response = await fetch(`${BASE_URL}/api/v1/admin/invoices/sales`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    return response.json();
  },
  async getBillingByType(type)  {
  const response = await fetch(`${BASE_URL}/medical/companies/1/billings/by-type/${type}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await response.json();
}
};
