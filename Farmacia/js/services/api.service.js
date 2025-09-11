const BASE_URL = window.location.origin;

export const farmaciaService = {
    getAllRecipes: async (status = "ALL") => {
        const response = await fetch(`${BASE_URL}/medical/recipes?type=general&status=${status}`);
        return await response.json();
    },

    searchProducts: async (name, concentration) => {
        const response = await fetch(
            `${BASE_URL}/api/v1/admin/products/searchProduct?name=${encodeURIComponent(
                name
            )}&concentration=${encodeURIComponent(concentration)}`
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
            body: JSON.stringify(products),
        });
        return await response.json();
    },

    getAllMedicaments: async () => {
        const response = await fetch(
            `${BASE_URL}/api/v1/admin/products/medicamentos`
        );
        return await response.json();
    },

    createInvoice: async (invoicePayload) => {
        const responseInvoicen = await fetch(
            `${BASE_URL}/api/v1/admin/invoices/sales`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(invoicePayload),
            }
        );
        return await responseInvoicen.json();
    },

    getBillingByType: async (type) => {
        const response = await fetch(
            `${BASE_URL}/medical/companies/1/billings/by-type/${type}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return await response.json();
    },

    changeStatus: async (status, recipe_id) => {
        const response = await fetch(
            `${BASE_URL}/medical/recipes/${recipe_id}/update-status`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: status }),
            }
        );
        return await response.json();
    },

    verifyProducts: async ({ name, concentration, quantity }) => {
        const response = await fetch(
            `${BASE_URL}/api/v1/admin/products/check/verify-product?name=${encodeURIComponent(name)}&concentration=${encodeURIComponent(concentration)}&quantity_to_verify=${encodeURIComponent(quantity)}`
        );
        const data = await response.json();
        return {
            data,
            status: response.status,
            success: response.ok,
        };
    },

    getProductsWithAvailableStock: async ({ productTypeNames }) => {
        const response = await fetch(
            `${BASE_URL}/api/v1/admin/products/with/available-stock/${encodeURIComponent(productTypeNames)}`
        );
        return await response.json();
    },
};
