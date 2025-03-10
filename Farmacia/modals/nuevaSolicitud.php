<div class="modal fade" id="newRequestModal" tabindex="-1" aria-labelledby="newRequestModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="newRequestModalLabel">Nueva Solicitud</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Formulario para ingresar los productos -->
                <form id="requestForm">
                    <!-- Select de productos -->
                    <div class="mb-3">
                        <label for="productSelect" class="form-label">Seleccionar Producto</label>
                        <select id="productSelect" class="form-select">
                            <!-- Opciones de productos se agregarán dinámicamente aquí -->
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="quantity" class="form-label">Cantidad</label>
                        <input type="number" id="quantity" class="form-control" min="1" value="1">
                    </div>
                    <button type="button" id="addProduct" class="btn btn-secondary">Añadir Producto</button>

                    <div id="selectedProducts" class="mt-3">
                        <!-- Aquí se listarán los productos seleccionados -->
                    </div>

                    <div class="mb-3">
                        <label for="observations" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observations"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    </div>
</div>


<script type="module">
    import { inventoryService } from "../../services/api/index.js";
    import { suppliesService } from "../../services/api/index.js";
    console.log("entro");
    document.addEventListener('DOMContentLoaded', function () {
        fetchProducts(); // Llama a la función para cargar los productos una vez el DOM esté listo
    });


    let selectedProducts = []; // Array para almacenar los productos seleccionados


    async function fetchProducts() {
        try {
            const response = await inventoryService.getAll();
            const products = response.data.filter(product => product.attributes.product_type_id == 6);

            console.log("Productos", products);

            const selectElement = document.getElementById("productSelect");

            // Limpiar el select antes de llenarlo
            selectElement.innerHTML = '<option value="">Seleccionar Producto</option>'; // Opcional: primera opción vacía

            // Agregar las opciones al select
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.attributes.name; // Asumiendo que el nombre del producto está aquí
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            showError("No se pudieron cargar los productos.");
        }
    }

    // Función para añadir productos seleccionados al listado
    document.getElementById("addProduct").addEventListener("click", function () {
        const productId = document.getElementById("productSelect").value;
        const quantity = document.getElementById("quantity").value;

        if (productId && quantity > 0) {
            const selectedProduct = {
                product_id: productId,
                quantity: quantity
            };
            selectedProducts.push(selectedProduct);
            displaySelectedProducts();

            document.getElementById("productSelect").value = "";
            document.getElementById("quantity").value = 1;
        } else {
            alert("Por favor, selecciona un producto y cantidad válida.");
        }
    });

    // Función para mostrar los productos seleccionados
    function displaySelectedProducts() {
        const selectedProductsContainer = document.getElementById("selectedProducts");
        selectedProductsContainer.innerHTML = ""; // Limpiar la lista antes de mostrarla

        selectedProducts.forEach(product => {
            const productRow = document.createElement("div");
            productRow.classList.add("d-flex", "justify-content-between", "mb-2");

            const productText = document.createElement("span");
            productText.textContent = `Producto ID: ${product.product_id}, Cantidad: ${product.quantity}`;

            const removeButton = document.createElement("button");
            removeButton.classList.add("btn", "btn-sm", "btn-danger");
            removeButton.textContent = "Eliminar";
            removeButton.addEventListener("click", function () {
                removeProduct(product);
            });

            productRow.appendChild(productText);
            productRow.appendChild(removeButton);
            selectedProductsContainer.appendChild(productRow);
        });
    }

    // Función para eliminar un producto de la lista
    function removeProduct(product) {
        selectedProducts = selectedProducts.filter(p => p !== product);
        displaySelectedProducts();
    }

    // Al enviar el formulario, preparar los datos y enviarlos
    document.getElementById("requestForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const requestData = {
            status: "pendiente",
            delivery_date: null,
            observations: document.getElementById("observations").value,
            products: selectedProducts
        };

        suppliesService.storeSupply(requestData)
            .then(response => {
                console.log("Solicitud enviada con éxito", response);
                alert('Solicitud enviada con éxito');
                $('#newRequestModal').modal('hide');
            })
            .catch(error => {
                console.error("Error al enviar la solicitud:", error);
                alert('Hubo un error al enviar la solicitud');
            });
    });

    // Llamar a la función para llenar el select al cargar la página
    fetchProducts();


</script>