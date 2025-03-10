import { inventoryService } from "../../services/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {
    const customerSelect = document.getElementById("customerSelect");
    const choices = new Choices(customerSelect, {
        removeItemButton: true,
        searchPlaceholderValue: "Buscar cliente...",
    });

    async function loadCustomers() {
        try {
       
            const response = await inventoryService.getAll(); 
            const customers = response.data; 

            choices.clearStore();
            choices.setChoices(
                customers.map(customer => ({
                    value: customer.id,
                    label: customer.name, 
                })),
                "value",
                "label",
                true
            );
        } catch (error) {
            console.error("Error cargando clientes:", error);
        }
    }

    // 🔹 Cargar los clientes al iniciar la página
    loadCustomers();
});

