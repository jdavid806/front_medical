<div class="modal fade" id="solicitudInsumoAdmin" tabindex="-1" aria-labelledby="solicitudInsumoAdminLabel"
    aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="solicitudInsumoAdminLabel">Solicitud de insumos</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="requestInsumo">
                    <div class="mb-3">
                        <label for="productSelect" class="form-label">Seleccionar Insumo</label>
                        <select id="productSelect" class="form-select">
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Cantidad</label>
                        <input type="number" id="quantity" class="form-control" min="1">
                    </div>
                    <button type="button" id="addInsumo" class="btn btn-secondary">Añadir Insumo</button>

                    <div class="mt-3" id="divInsumosAgregados" style="display: none;">
                        <h4 class="text-center">Insumos agregados</h4>
                    </div>

                    <div class="mb-3">
                        <label for="observations" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observations"></textarea>
                    </div>
                    <button id="enviarSolicitudAdmin" type="button" class="btn btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    </div>
</div>



<script>
    const productSelect = document.getElementById("productSelect");
    const addInsumoButton = document.getElementById("addInsumo");
    const divInsumosAgregados = document.getElementById("divInsumosAgregados");
    const enviarSolicitudButton = document.getElementById("enviarSolicitudAdmin");
    const observaciones = document.getElementById("observations");

    const addedInsumos = [];

    // Función para obtener los productos y cargar en el select
    let choicesInstance; // para almacenar y reutilizar el componente

    const loadProducts = async () => {
        try {
            const res = await fetch("https://dev.monaros.co/api/v1/admin/products/insumos");
            const products = await res.json();

            // Limpiar el select
            productSelect.innerHTML = "";

            // Agregar opciones
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });

            // Inicializar Choices.js
            if (choicesInstance) {
                choicesInstance.destroy(); // Destruye la instancia anterior si existe
            }

            choicesInstance = new Choices(productSelect, {
                searchEnabled: true,
                placeholderValue: 'Seleccione un insumo',
                itemSelectText: ''
            });

        } catch (error) {
            console.error("Error cargando productos:", error);
        }
    };


    // Cargar los productos al abrir el modal
    const openModal = () => {
        loadProducts();
        divInsumosAgregados.style.display = "none";
        divInsumosAgregados.innerHTML = ""; // Limpiar contenido
        addedInsumos.length = 0; // Limpiar lista de insumos agregados
    };

    // Mostrar insumos agregados
    const showAddedInsumos = (productId, quantity) => {
        const productOption = productSelect.querySelector(`option[value="${productId}"]`);
        const productName = productOption ? productOption.text : 'Producto desconocido';
        const insumoList = document.createElement('li');
        insumoList.textContent = `${productName} (x${quantity})`;

        if (!divInsumosAgregados.querySelector("ul")) {
            const ul = document.createElement("ul");
            divInsumosAgregados.appendChild(ul);
        }
        divInsumosAgregados.querySelector("ul").appendChild(insumoList);
        divInsumosAgregados.style.display = "block";
    };

    // Event listener para el botón de "Añadir Insumo"
    addInsumoButton.addEventListener("click", () => {
        const productId = productSelect.value;
        const quantity = document.getElementById("quantity").value;

        if (productId && quantity && quantity > 0) {
            // Evitar duplicados
            const exists = addedInsumos.find(item => item.product_id === productId);
            if (!exists) {
                addedInsumos.push({ product_id: productId, quantity: quantity });
                showAddedInsumos(productId, quantity);
            } else {
                alert("Este insumo ya fue agregado.");
            }
        } else {
            alert("Por favor, seleccione un insumo y cantidad válida.");
        }
    });

    // Event listener para el botón "Enviar Solicitud"
    enviarSolicitudButton.addEventListener("click", async () => {
        if (addedInsumos.length === 0) {
            alert("No has agregado ningún insumo.");
            return;
        }

        const payload = {
            status: "pendiente",
            delivery_date: null,
            observations: observaciones.value,
            products: addedInsumos
        };

        try {
            const res = await fetch("https://dev.monaros.co/api/v1/admin/medical-supplies/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Solicitud enviada correctamente.");
                openModal(); // Limpiar formulario
                bootstrap.Modal.getInstance(document.getElementById("solicitudInsumoAdmin")).hide(); // Cerrar modal
            } else {
                const errorData = await res.json();
                console.error("Error en la respuesta:", errorData);
                alert("Error al enviar la solicitud.");
            }
        } catch (error) {
            console.error("Error enviando la solicitud:", error);
            alert("Ocurrió un error al enviar la solicitud.");
        }
    });

    // Inicializar el modal
    const modal = new bootstrap.Modal(document.getElementById("solicitudInsumoAdmin"));
    document.getElementById("solicitudInsumoAdmin").addEventListener("show.bs.modal", openModal);
</script>