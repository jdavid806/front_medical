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