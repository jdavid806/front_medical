const BASE_URL = window.location.origin;

export const farmaciaService = {
  getAllRecipes: async () => {
    const response = await fetch(`${BASE_URL}/medical/recipes?type=general`);
    return await response.json();
  },

  searchProducts: async (name, concentration) => {
    const response = await fetch(
      `${BASE_URL}/api/v1/admin/products/searchProduct?name=${encodeURIComponent(name)}&concentration=${encodeURIComponent(concentration)}`
    );
    return await response.json();
  },

  getPaymentMethods: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/payment-methods`);
    return await response.json();
  },

  completeDelivery: async (products) => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/pharmacy/sell`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products })
    });
    return await response.json();
  },

  getAllMedicaments: async () => {
    const response = await fetch(`${BASE_URL}/api/v1/admin/products/medicamentos`);
    return await response.json();
  },

  createInvoice: async (invoicePayload) => {
    const responseInvoicen = await fetch(`${BASE_URL}/api/v1/admin/invoices/sales`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invoicePayload)
    });
    return await responseInvoicen.json();
  }
  
};
