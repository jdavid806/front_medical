import { inventoryService } from "../../services/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {
    const formMedicamento = document.getElementById("formNuevoMedicamento");
    let editingProductId = null;

    formMedicamento.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!formMedicamento.checkValidity()) {
            formMedicamento.classList.add("was-validated");
            return;
        }

        const medicamentoData = {
            name: document.getElementById("nombreMedicamento").value,
            product_type_id: 4,
            type: document.getElementById("tipoMedicamento").value,
            stock: document.getElementById("stockMedicamento").value,
            expiration_date: document.getElementById("fechaCaducidad").value,
            batch_number: document.getElementById("loteMedicamento").value,
            description: document.getElementById("descripcionMedicamento").value || null,
            price_purchase: document.getElementById("precioCompraMedicamento").value,
            price_sale: document.getElementById("precioVentaMedicamento").value,
            weight: document.getElementById("pesoMedicamento").value,
            capacity: document.getElementById("capacidadMedicamento").value,
            concentration: document.getElementById("concentracionMedicamento").value
        };

        try {
            if (editingProductId) {
                await inventoryService.updateProduct(editingProductId, medicamentoData);
                await Swal.fire({
                    title: "¡Éxito!",
                    text: "Medicamento actualizado correctamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                await inventoryService.storeProduct(medicamentoData);
                await Swal.fire({
                    title: "¡Éxito!",
                    text: "Medicamento registrado exitosamente.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
            

            const modalElement = document.getElementById("modalNuevoMedicamento");
            const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
            modal.hide();
            formMedicamento.reset();
            formMedicamento.classList.remove("was-validated");
            editingProductId = null;
            await fetchMedicines();
        } catch (error) {
            console.error("Error al guardar medicamento:", error);
            alert("Error al guardar el medicamento. Intente de nuevo.");
        }
    });

    let medicines = [];
    let currentPage = 1;
    const perPage = 5;

    const tableBody = document.querySelector(".list");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const currentPageSpan = document.getElementById("currentPage");
    const totalPagesSpan = document.getElementById("totalPages");
    const alertaProductos = document.getElementById("alertaProductos");

    async function fetchMedicines() {
        try {
            const response = await inventoryService.getAll();
            medicines = response.data.filter(product => product.attributes.product_type_id == 4);

            updatePagination();
            renderMedicinesTable();
            checkExpiringProducts();
        } catch (error) {
            console.error("Error al obtener productos:", error);
            showError("No se pudieron cargar los productos.");
        }
    }

    function updatePagination() {
        const totalPages = Math.ceil(medicines.length / perPage);
        totalPagesSpan.textContent = totalPages || 1;
        currentPageSpan.textContent = currentPage;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages || totalPages === 0;
    }

    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date) ? "N/A" : date.toISOString().split("T")[0];
    }

    function renderMedicinesTable() {
        tableBody.innerHTML = medicines.length === 0
            ? `<tr><td colspan="7" class="text-center">No hay medicamentos disponibles.</td></tr>`
            : medicines.slice((currentPage - 1) * perPage, currentPage * perPage)
            .map(product => {
                const attributes = product.attributes;
                return `
                    <tr class="table-row selectable-row">
                        <td class="align-middle ps-3">${attributes.name || "Sin nombre"}</td>
                        <td class="align-middle text-end">${attributes.stock || "N/A"}</td>
                        <td class="align-middle text-end">${attributes.weight ? `${attributes.weight} g` : "N/A"}</td>
                        <td class="align-middle text-end">${attributes.capacity ? `${attributes.capacity} ml` : "N/A"}</td>
                        <td class="align-middle text-end">${attributes.concentration || "N/A"}</td>
                        <td class="align-middle text-end">${formatDate(attributes.expiration_date)}</td>
                        <td class="text-end align-middle pe-3">
                            <div class="dropdown">
                                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">Acciones</button>
                                <ul class="dropdown-menu">
                                    <li><a class="dropdown-item editar-producto" href="#" data-id="${product.id}">Editar</a></li>
                                    <li><a class="dropdown-item eliminar-producto" href="#" data-id="${product.id}">Eliminar</a></li>
                                </ul>
                            </div>
                        </td>
                    </tr>`;
            }).join("");
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            renderMedicinesTable();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(medicines.length / perPage)) {
            currentPage++;
            updatePagination();
            renderMedicinesTable();
        }
    });

    tableBody.addEventListener("click", async (event) => {
        event.preventDefault();
        const target = event.target;
    
        if (target.classList.contains("eliminar-producto")) {
            const productId = target.dataset.id;
            if (!productId) return;
    
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
    
            if (result.isConfirmed) {
                try {
                    await inventoryService.deleteProduct(productId);
                    await Swal.fire({
                        title: "¡Eliminado!",
                        text: "El medicamento ha sido eliminado correctamente.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    await fetchMedicines();
                } catch (error) {
                    console.error("Error al eliminar medicamento:", error);
                    await Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el medicamento.",
                        icon: "error"
                    });
                }
            }
        }
    });
    

    await fetchMedicines();

    function checkExpiringProducts() {
        const today = new Date();
        const threshold = new Date();
        threshold.setDate(today.getDate() + 30);

        const expiringMedicines = medicines.filter(product => {
            const expirationDate = new Date(product.attributes.expiration_date);
            return expirationDate <= threshold && expirationDate >= today;
        });

        alertaProductos.innerHTML = expiringMedicines.length > 0 ?
            `<div class="alert alert-warning">⚠️ ${expiringMedicines.length} medicamento(s) próximo(s) a vencer.</div>` : "";
    }


    document.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("editar-producto")) {
        event.preventDefault();
        const productId = target.dataset.id;
        if (!productId) return;

        try {
            editingProductId = productId;  
            const medicamento = await inventoryService.getById(productId);

            // Llenar formulario con los datos del medicamento
            document.getElementById("nombreMedicamento").value = medicamento.name || "";
            document.getElementById("tipoMedicamento").value = medicamento.medical_form_id || "";
            document.getElementById("stockMedicamento").value = medicamento.stock || "";
            document.getElementById("fechaCaducidad").value = medicamento.expiration_date || "";
            document.getElementById("loteMedicamento").value = medicamento.sanitary_registration || "";
            document.getElementById("descripcionMedicamento").value = medicamento.description || "";
            document.getElementById("pesoMedicamento").value = medicamento.weight || "";
            document.getElementById("capacidadMedicamento").value = medicamento.capacity || "";
            document.getElementById("concentracionMedicamento").value = medicamento.concentration || "";
            document.getElementById("precioCompraMedicamento").value = medicamento.purchase_price || "";
            document.getElementById("precioVentaMedicamento").value = medicamento.sale_price || "";

            document.getElementById("medicamentoPreview").src = medicamento.image || "https://via.placeholder.com/150";

            // Mostrar el modal manualmente
            const modal = new bootstrap.Modal(document.getElementById("modalNuevoMedicamento"));
            modal.show();
        } catch (error) {
            console.error("Error al cargar datos del medicamento:", error);
            Swal.fire("Error", "No se pudo cargar la información del medicamento.", "error");
        }
    }
});

    
});
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".list"); // Tabla de productos
    const cardTitle = document.querySelector(".card-title");
    const cardImage = document.getElementById("vacunaImage");
    const tipoProducto = document.getElementById("tipoProducto");
    const stockProducto = document.getElementById("stockProducto");
    const precioProducto = document.getElementById("precioProducto");
    const verDetalleBtn = document.querySelector(".ver-detalle");

    let selectedProduct = null; // Para almacenar el producto seleccionado

    // Escuchar clics en la tabla para actualizar la tarjeta
    tableBody.addEventListener("click", (event) => {
        const row = event.target.closest("tr");
        if (!row) return;

        const productId = row.querySelector(".editar-producto").dataset.id;
        if (!productId) return;

        inventoryService.getById(productId).then(product => {
            selectedProduct = product; // Guardar para mostrar en el modal después

            // Actualizar la tarjeta con la información del producto
            cardTitle.textContent = product.name || "Producto sin nombre";
            tipoProducto.textContent = product.medical_form_id || "N/A";
            stockProducto.textContent = product.stock || "N/A";
            precioProducto.textContent = `$${product.sale_price || "N/A"}`;
            cardImage.src = product.image || "https://via.placeholder.com/200x150";
            
            // Habilitar el botón de "Ver más"
            verDetalleBtn.dataset.id = productId;
            verDetalleBtn.disabled = false;
        }).catch(error => {
            console.error("Error al obtener detalles del producto:", error);
        });
    });

    // Mostrar detalles en el modal al hacer clic en "Ver más"
    verDetalleBtn.addEventListener("click", () => {
        if (!selectedProduct) return;

        // Llenar el modal con los datos del producto
        document.getElementById("modalProductoId").textContent = selectedProduct.id || "-";
        document.getElementById("modalProductoNombre").textContent = selectedProduct.name || "-";
        document.getElementById("modalProductoDescripcion").textContent = selectedProduct.description || "-";
        document.getElementById("modalCodigoBarras").textContent = selectedProduct.barcode || "-";
        document.getElementById("modalStock").textContent = selectedProduct.stock || "-";
        document.getElementById("modalStockMin").textContent = selectedProduct.stock_min || "-";
        document.getElementById("modalStockMax").textContent = selectedProduct.stock_max || "-";
        document.getElementById("modalPrecioCompra").textContent = `$${selectedProduct.purchase_price || "-"}`;
        document.getElementById("modalPrecioVenta").textContent = `$${selectedProduct.sale_price || "-"}`;
        document.getElementById("modalEstado").textContent = selectedProduct.status || "-";
        document.getElementById("modalLaboratorio").textContent = selectedProduct.laboratory || "-";
        document.getElementById("modalMarca").textContent = selectedProduct.brand || "-";
        document.getElementById("modalProveedor").textContent = selectedProduct.supplier || "-";
        document.getElementById("modalRegistroSanitario").textContent = selectedProduct.sanitary_registration || "-";
        document.getElementById("modalExpiracion").textContent = selectedProduct.expiration_date || "-";
        document.getElementById("modalConcentracion").textContent = selectedProduct.concentration || "-";
        document.getElementById("modalReceta").textContent = selectedProduct.requires_prescription ? "Sí" : "No";
    });
});
