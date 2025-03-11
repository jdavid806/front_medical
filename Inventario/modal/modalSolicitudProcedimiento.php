<div class="modal fade" id="solicitudInsumoProcedimiento" tabindex="-1" aria-labelledby="solicitudInsumoProcedimientoLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="solicitudInsumoProcedimientoLabel">Solicitud de insumo por procedimiento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="requestForm">
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

                    <!-- <div id="selectedProducts" class="mt-3">
                    </div> -->

                    <div class="mb-3">
                        <label for="observations" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observations"></textarea>
                    </div>
                    <button id="enviarSolicitudAdmin" type="submit" class="btn btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    </div>
</div>


<!-- <script type="module">
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
    document.getElementById("addInsumo").addEventListener("click", function () {
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
                $('#solicitudInsumoProcedimiento').modal('hide');
            })
            .catch(error => {
                console.error("Error al enviar la solicitud:", error);
                alert('Hubo un error al enviar la solicitud');
            });
    });

    // Llamar a la función para llenar el select al cargar la página
    fetchProducts();


</script> -->

<script>
    function cargarOpcionesSelect() {
        const insumosAdministrativos = [
            "Papelería",
            "Carpetas",
            "Bolígrafos",
            "Post-it",
            "Toner",
            "Papel",
            "Archivadores",
            "Plumones",
            "Grapadoras",
            "Calculadora",
            "Reglas",
            "Cinta adhesiva",
            "Sillas",
            "Mesas",
            "Estanterías",
            "Pizarras",
            "Rotuladores",
            "Papel de impresión"
        ];

        const selectElement = document.getElementById('productSelect');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        insumosAdministrativos.forEach((insumo, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = insumo;
            selectElement.appendChild(option);
        });
    }

    cargarOpcionesSelect();

    function agregarInsumo() {
        const productSelect = document.getElementById('productSelect');
        const quantityInput = document.getElementById('quantity');
        const divInsumosAgregados = document.getElementById('divInsumosAgregados');

        const productoSeleccionado = productSelect.options[productSelect.selectedIndex].text;
        const productoValor = productSelect.value;
        const cantidad = quantityInput.value;

        if (productoValor === "" || cantidad === "" || cantidad <= 0) {
            alert("Por favor, seleccione un producto y especifique una cantidad válida.");
            return;
        }

        let tabla = divInsumosAgregados.querySelector('table');

        if (!tabla) {
            tabla = document.createElement('table');
            tabla.className = 'table';
            tabla.innerHTML = `
            <thead>
                <tr>
                    <th width="50%">Producto</th>
                    <th width="30%">Cantidad</th>
                    <th width="20%">Acciones</th>
                </tr>
            </thead>
            <tbody id="tablaInsumosBody">
            </tbody>
        `;
            divInsumosAgregados.appendChild(tabla);
        }

        const tablaBody = document.getElementById('tablaInsumosBody') || tabla.querySelector('tbody');

        const nuevaFila = document.createElement('tr');
        nuevaFila.innerHTML = `
        <td width="50%">${productoSeleccionado}</td>
        <td width="30%">${cantidad}</td>
        <td width="20%">
            <button class="btn btn-danger btn-sm eliminar-insumo"><i class="fas fa-trash"></i></button>
        </td>
    `;

        nuevaFila.querySelector('.eliminar-insumo').addEventListener('click', function() {
            nuevaFila.remove();

            if (tablaBody.children.length === 0) {
                divInsumosAgregados.style.display = 'none';
            }
        });

        tablaBody.appendChild(nuevaFila);

        divInsumosAgregados.style.display = 'block';

        productSelect.selectedIndex = 0;
        quantityInput.value = '';
    }

    document.getElementById('addInsumo').addEventListener('click', agregarInsumo);

    function enviarSolicitudAdmin() {
        const tablaBody = document.getElementById('tablaInsumosBody');
        const observaciones = document.getElementById('observations').value;

        if (!tablaBody || tablaBody.children.length === 0) {
            alert("No hay insumos agregados para enviar.");
            return;
        }

        const insumosSeleccionados = [];

        Array.from(tablaBody.children).forEach((fila, index) => {
            const celdas = fila.querySelectorAll('td');

            const insumo = {
                id: index + 1,
                producto: celdas[0].textContent,
                cantidad: parseInt(celdas[1].textContent)
            };

            insumosSeleccionados.push(insumo);
        });

        const solicitudData = {
            fecha: new Date().toISOString(),
            totalInsumos: insumosSeleccionados.length,
            insumos: insumosSeleccionados,
            observaciones: observaciones
        };

        console.log("Datos de la solicitud de insumos administrativos:");
        console.log(solicitudData);

        alert("Solicitud enviada con éxito.");
    }

    document.getElementById('enviarSolicitudAdmin').addEventListener('click', enviarSolicitudAdmin);
</script>