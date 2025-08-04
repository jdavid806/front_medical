import { inventoryService } from "../../services/api/index.js";


document.addEventListener("DOMContentLoaded", async () => {
    const formProducto = document.getElementById("formNuevoProducto");
    let editingProductId = null;

    formProducto.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!formProducto.checkValidity()) {
            formProducto.classList.add("was-validated");
            return;
        }

        const productoData = {
            name: document.getElementById("nombreProducto").value,
            product_type_id: document.getElementById("tipoProducto").value,
            stock: document.getElementById("stockProducto").value,
            expiration_date: document.getElementById("fechaCaducidad").value,
            batch_number: document.getElementById("loteProducto").value,
            description: document.getElementById("descripcionProducto").value || null,
            price_purchase: document.getElementById("precioCompraProducto").value,
            price_sale: document.getElementById("precioVentaProducto").value,
            weight: document.getElementById("pesoProducto").value,
            capacity: document.getElementById("capacidadProducto").value,
            concentration: document.getElementById("concentracionProducto").value
        };

        try {
            if (editingProductId) {
                await inventoryService.updateProduct(editingProductId, productoData);
                await Swal.fire({ title: "¡Éxito!", text: "Producto actualizado correctamente.", icon: "success", timer: 2000, showConfirmButton: false });
            } else {
                await inventoryService.storeProduct(productoData);
                await Swal.fire({ title: "¡Éxito!", text: "Producto registrado exitosamente.", icon: "success", timer: 2000, showConfirmButton: false });
            }

            const modalElement = document.getElementById("modalNuevoProducto");
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.hide();
            formProducto.reset();
            formProducto.classList.remove("was-validated");
            editingProductId = null;
            await fetchProducts();
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("Error al guardar el producto. Intente de nuevo.");
        }
    });
});