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

    let products = [];
    let currentPage = 1;
    const perPage = 5;
    const tableBody = document.querySelector(".list");
    const prevButton = document.getElementById("prevPage");
    const nextButton = document.getElementById("nextPage");
    const currentPageSpan = document.getElementById("currentPage");
    const totalPagesSpan = document.getElementById("totalPages");

    async function fetchProducts() {
        try {
            const response = await inventoryService.getAll();
            products = response.data;
            updatePagination();
            renderProductsTable();
        } catch (error) {
            console.error("Error al obtener productos:", error);
            alert("No se pudieron cargar los productos.");
        }
    }

    function updatePagination() {
        const totalPages = Math.ceil(products.length / perPage);
        totalPagesSpan.textContent = totalPages || 1;
        currentPageSpan.textContent = currentPage;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages || totalPages === 0;
    }

    function renderProductsTable() {
        tableBody.innerHTML = products.length === 0
            ? `<tr><td colspan="7" class="text-center">No hay productos disponibles.</td></tr>`
            : products.slice((currentPage - 1) * perPage, currentPage * perPage)
            .map(product => {
                const attributes = product.attributes;
                return `
                    <tr class="table-row selectable-row">
                        <td class="align-middle ps-3">${attributes.name || "Sin nombre"}</td>
                        <td class="align-middle text-end">${attributes.stock || "N/A"}</td>
                        <td class="align-middle text-end">${attributes.weight ? `${attributes.weight} g` : "N/A"}</td>
                        <td class="align-middle text-end">${attributes.capacity ? `${attributes.capacity} ml` : "N/A"}</td>
                        <td class="align-middle text-end">${attributes.concentration || "N/A"}</td>
                        <td class="align-middle text-end">${attributes.purchase_price || "N/A"}</td>
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
            renderProductsTable();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(products.length / perPage)) {
            currentPage++;
            updatePagination();
            renderProductsTable();
        }
    });

    await fetchProducts();
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