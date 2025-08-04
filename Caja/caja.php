<?php
include "../menu.php";
include "../header.php";
//include "./includes/modals/NewCustomerModal.php";


$products = array(
    array(
        'number' => 1,
        'description' => 'Producto 1',
        'price' => 1000,
        'quantity' => 1,
        'discount' => 10
    ),
    array(
        'number' => 2,
        'description' => 'Producto 2',
        'price' => 1500,
        'quantity' => 2,
        'discount' => 5
    )
);

$cashBalance = 10000;

$password = "1234";

?>

<style>
    .btn-xs {
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
    }

    /* Estilo para el fondo blanco */
    body.modal-open {
        overflow: hidden;
        /* Evita el desplazamiento de la página */
    }

    .modal-backdrop {
        background-color: white;
        /* Fondo blanco */
        opacity: 1;
        /* Fondo completamente opaco */
    }
</style>
<div class="content">
    <div class="container-fluid">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="portada">Inicio</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Caja</li>
            </ol>
        </nav>
        <div class="pb-9">
            <div class="row">
                <div class="col-12">
                    <div class="col-10">
                        <div class="col-12 row col-md-auto">
                            <div class="col-6">
                                <h2 class="mb-0">Caja</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid mt-4">
                <h3 class="mb-4 text-center">Resumen de Operaciones</h3>
                <div class="px-3 mb-5">
                    <div class="row justify-content-center">
                        <div class="col-6 col-md-4 col-xxl-2 text-center border-translucent border-start-xxl border-end-xxl-0 pb-4">
                            <span class="far fa-money-bill-alt text-primary fa-lg"></span>
                            <h1 class="fs-6 pt-3" id="balanceInicial">0</h1> <!-- Balance inicial de caja -->
                            <p class="fs-9 mb-0">Balance inicial de caja</p>
                        </div>
                        <div class="col-6 col-md-4 col-xxl-2 text-center border-translucent border-start-xxl pb-4">
                            <span class="fas fa-box text-success fa-lg"></span>
                            <h1 class="fs-6 pt-3" id="productosVenta">0</h1> <!-- Productos en Venta -->
                            <p class="fs-9 mb-0">Productos en Venta</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-fluid mt-4">
                <div class="row g-2">
                    <div class="col-3">

                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">Medicamentos</h5>
                                <select class="form-select" id="customerSelect" data-choices='{"searchPlaceholderValue": "Buscar cliente..."}'>
                                    <option selected="selected">Seleccionar</option>
                                </select>
                                <button class="btn btn-primary w-100 rounded-pill" type="button" data-bs-toggle="modal" data-bs-target="#newCustomerModal"> Cargar receta</button>

                            </div>
                        </div>


                        <div class="card mt-3">
                            <div class="row g-0">
                                <div class="col-md-4">
                                    <img class="img-fluid h-100 rounded-start" src="./assets/img/ilustración-de-avatar.jpg" alt="...">
                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h4 class="card-title">Cliente</h4>
                                        <p class="card-text small">Wilmer Cruz</p>
                                        <p class="card-text small">V26784950</p>
                                        <p class="card-text small">0412-1234567</p>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div class="card mt-3">
                            <div class="card-body">
                                <div class="text-center">
                                    <img id="productImage" class="img-fluid rounded-start" src="./assets/img/image-not-found.png" alt="...">
                                </div>
                                <h4 id="productTitle" class="card-title mt-3">Producto</h4>
                                <p id="productNumber" class="card-text"><span class="fw-bold">Número: </span><small>1</small></p>
                                <p id="productDescription" class="card-text"><span class="fw-bold">Descripción: </span><small>Producto 1</small></p>
                                <p id="productPrice" class="card-text"><span class="fw-bold">Precio: </span><small>$ 1000</small></p>
                                <p id="productQuantity" class="card-text"><span class="fw-bold">Cantidad: </span><small>1</small></p>
                                <p id="productDiscount" class="card-text"><span class="fw-bold">Descuento: </span><small>10%</small></p>
                            </div>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h5 class="card-title">Lista de productos</h5>
                                    <input type="text" class="form-control w-25" placeholder="Buscar...">
                                </div>
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="small">#</th>
                                            <th scope="col" class="small">Descripción</th>
                                            <th scope="col" class="small">Precio</th>
                                            <th scope="col" class="small">Cantidad</th>
                                            <th scope="col" class="small">Descuento</th>
                                            <th scope="col" class="small">Total</th>
                                            <th scope="col" class="small">Acciones</th>
                                            <th scope="col" class="small"></th>
                                        </tr>
                                    </thead>
                                    <tbody id="productsTableBody">
                                        <!-- Las filas se agregarán dinámicamente aquí con JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-3">

                        <div class="card">
                            <div class="card-body text-center">
                                <h5 class="card-title">Resumen de venta</h5>
                                <div class="row">
                                    <div class="mx-auto col-6 col-md-4 col-xxl-2 text-center pb-4 pb-xxl-0">
                                        <span class="far fa-money-bill-alt text-primary fa-lg"></span>
                                        <h1 class="fs-8 pt-3 small" id="totalSales">0.00</h1> <!-- Total de Ventas -->
                                        <p class="fs-9 mb-0">Total Ventas</p>
                                    </div>
                                    <div class="mx-auto col-6 col-md-4 col-xxl-2 text-center pb-4 pb-xxl-0">
                                        <span class="fas fa-cart-arrow-down text-info fa-lg"></span>
                                        <h1 class="fs-8 pt-3 small" id="totalProducts">0</h1> <!-- Total de Productos -->
                                        <p class="fs-9 mb-0">Total Productos</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card mt-3">
                            <div class="card-body">
                                <h4 class="card-title">Método de Pago</h4>

                                <div class="row g-3">
                                    <div class="col-sm-3 col-md-6 col-lg-12">
                                        <label class="form-label" for="methodPayment">Método de pago</label>
                                        <select class="form-select" id="methodPayment">
                                            <option selected="selected">Seleccionar</option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>


                        <div class="card mt-3">
                            <div class="card-body text-center">
                                <h5 class="card-title">Pagos</h5>

                                <div class="input-group mb-3">
                                    <span class="input-group-text">Efectivo</span>
                                    <input type="number" class="form-control" id="montoRecibido" placeholder="Monto recibido">
                                    <button class="btn btn-outline-secondary" type="button" id="resetButton">
                                        <i class="fas fa-redo-alt"></i> <!-- Este ícono se cambiará dinámicamente -->
                                    </button>
                                </div>

                                <div class="mb-3">
                                    <label for="cambio" class="form-label">Cambio</label>
                                    <input type="text" class="form-control" id="cambio" value="$0.00" disabled>
                                </div>

                                <div class="d-grid gap-2">
                                    <button type="button" class="btn btn-secondary w-100 rounded-pill">CANCELAR F4</button>
                                    <button class="btn btn-primary w-100 rounded-pill" id="guardarButton" style="display: none;" type="button" id="payButton"><i class="fas fa-money-bill-wave"></i> Pagar</button>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<?php
include "../footer.php";
include "./includes/modals/NewCustomerModal.php";
include "./includes/modals/AccesoCajaModal.php";
?>


<script>
    document.addEventListener('DOMContentLoaded', function() {

        // Abre el modal al cargar la página
        openModal('myModal');

        // Define la contraseña correcta (pasada desde PHP)
        const correctPassword = "<?php echo $password; ?>"; // Asegúrate de que $password esté definida en PHP

        // Maneja la verificación de la contraseña
        handlePasswordVerification(correctPassword);


        // Inicializa los valores de Balance inicial de caja y Productos en Venta
        initializeBalanceAndProducts();

        // Maneja el evento de guardar venta
        handleSaveSale('guardarButton', 'balanceInicial', 'productosVenta');

        // Maneja las acciones de la tabla de productos (aumentar, disminuir, eliminar)
        handleProductTableActions('productsTableBody');

        // Actualiza el resumen de ventas al cargar la página
        updateSaleSummary('productsTableBody', 'totalSales', 'totalProducts');

        // Maneja el cálculo del cambio y la visibilidad del botón "Guardar"
        handlePaymentInput('montoRecibido', 'cambio', 'totalSales', 'guardarButton');

        // Maneja el botón de reiniciar (borrar un número a la vez)
        handleResetButton('resetButton', 'montoRecibido', 'cambio', 'guardarButton');

        // Maneja la selección de un producto para actualizar la tarjeta
        handleProductSelection('productsTableBody', 'productImage', 'productTitle', 'productNumber', 'productDescription', 'productPrice', 'productQuantity', 'productDiscount');

        // Cargar los métodos de pago
        loadPaymentMethods();

        // Cargar los clientes
        loadCustomers();

        // Configurar la búsqueda de productos
        setupProductSearch();
    });

    // Función para inicializar los valores de Balance inicial de caja y Productos en Venta
    function initializeBalanceAndProducts() {
        const balanceInicialElement = document.getElementById('balanceInicial');
        const productosVentaElement = document.getElementById('productosVenta');

        if (balanceInicialElement && productosVentaElement) {
            // Balance inicial de caja (valor desde PHP)
            const cashBalance = <?php echo number_format($cashBalance, 2, '.', ''); ?>; // Asegúrate de que $cashBalance esté definida en PHP

            // Formatea el balance inicial en pesos colombianos con separadores de miles y dos decimales
            balanceInicialElement.textContent = cashBalance.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            // Productos en Venta (inicia en 0)
            productosVentaElement.textContent = '0';
        }
    }

    // Función para manejar el evento de guardar venta
    function handleSaveSale(buttonId, balanceInicialId, productosVentaId) {
        const guardarButton = document.getElementById(buttonId);
        const balanceInicialElement = document.getElementById(balanceInicialId);
        const productosVentaElement = document.getElementById(productosVentaId);

        if (!guardarButton || !balanceInicialElement || !productosVentaElement) return;

        guardarButton.addEventListener('click', function() {
            // Obtén los valores actuales de Balance inicial de caja y Productos en Venta
            let balanceInicial = parseFloat(balanceInicialElement.textContent) || 0;
            let productosVenta = parseInt(productosVentaElement.textContent) || 0;

            // Simula los valores de la venta actual (puedes reemplazar esto con los valores reales de la venta)
            const ventaActual = {
                totalVenta: 1500, // Total de la venta actual
                productosVendidos: 3 // Cantidad de productos vendidos en la venta actual
            };

            // Actualiza los valores de Balance inicial de caja y Productos en Venta
            balanceInicial += ventaActual.totalVenta;
            productosVenta += ventaActual.productosVendidos;

            // Muestra los nuevos valores en la vista
            balanceInicialElement.textContent = balanceInicial.toFixed(2);
            productosVentaElement.textContent = productosVenta;

            // Cierra el modal después de guardar la venta
            closeModal();
        });
    }

    // Función para abrir el modal
    function openModal(modalId) {
        let modalElement = document.getElementById(modalId);
        if (modalElement) {
            let modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static', // Evita que el modal se cierre al hacer clic fuera
                keyboard: false // Evita que el modal se cierre con la tecla ESC
            });
            modal.show();

            // Aplica el fondo blanco usando el backdrop de Bootstrap
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.style.backgroundColor = 'white'; // Fondo blanco
            }

            // Oculta el contenido del saldo al abrir el modal
            const saldoContent = document.getElementById('saldoContent');
            if (saldoContent) {
                saldoContent.style.display = 'none';
            }

            // Muestra el input de contraseña al abrir el modal
            const passwordInputContainer = document.getElementById('passwordInputContainer');
            if (passwordInputContainer) {
                passwordInputContainer.style.display = 'block';
            }
        }
    }

    // Función para manejar la verificación de la contraseña
    function handlePasswordVerification(correctPassword) {
        const aceptarButton = document.querySelector('#myModal .btn-primary');
        const passwordInput = document.getElementById('password');
        const saldoContent = document.getElementById('saldoContent');
        const passwordInputContainer = document.getElementById('passwordInputContainer');

        if (!aceptarButton || !passwordInput || !saldoContent || !passwordInputContainer) return;

        // Evento para el botón "Aceptar"
        aceptarButton.addEventListener('click', function() {
            if (passwordInputContainer.style.display !== 'none') {
                // Si el input de contraseña está visible, verifica la contraseña
                verifyPassword(correctPassword, passwordInput, saldoContent, passwordInputContainer, aceptarButton);
            } else {
                // Si el saldo está visible, cierra el modal
                closeModal();
            }
        });

        // Evento para el input de contraseña (verificar al presionar "Enter")
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                verifyPassword(correctPassword, passwordInput, saldoContent, passwordInputContainer, aceptarButton);
            }
        });
    }

    // Función para verificar la contraseña
    function verifyPassword(correctPassword, passwordInput, saldoContent, passwordInputContainer, aceptarButton) {
        if (passwordInput.value === correctPassword) {
            // Muestra el contenido del saldo y oculta el input de contraseña
            saldoContent.style.display = 'block';
            passwordInputContainer.style.display = 'none';

            // Cambia el texto del botón "Aceptar" a "Cerrar"
            aceptarButton.textContent = 'Cerrar';
        } else {
            alert('Contraseña incorrecta. Inténtalo de nuevo.');
            passwordInput.value = ''; // Limpia el input
            passwordInput.focus(); // Enfoca el input para intentar de nuevo
        }
    }

    // Función para cerrar el modal y eliminar el fondo blanco
    function closeModal() {
        const modalElement = document.getElementById('myModal');
        if (modalElement) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            // Restaura el fondo normal
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.style.backgroundColor = ''; // Restaura el color original
            }
        }
    }

    // Función para manejar las acciones de la tabla de productos
    function handleProductTableActions(tableBodyId) {
        const productsTableBody = document.getElementById(tableBodyId);

        if (!productsTableBody) return;

        // Delegación de eventos para manejar botones dinámicamente
        productsTableBody.addEventListener('click', (event) => {
            const target = event.target;

            // Verificamos si el clic fue en un botón
            const button = target.closest('button');
            if (!button) return;

            const row = button.closest('tr');
            if (!row) return;

            const quantityCell = row.querySelector('td:nth-child(4)');
            const totalCell = row.querySelector('td:nth-child(6)');
            const price = parseFloat(row.querySelector('td:nth-child(3)').textContent);
            const discount = parseFloat(row.querySelector('td:nth-child(5)').textContent.replace('%', ''));
            let quantity = parseInt(quantityCell.textContent);

            // Verificamos qué botón se hizo clic
            if (button.querySelector('.fa-plus')) {
                quantity++;
            } else if (button.querySelector('.fa-minus')) {
                if (quantity > 1) quantity--;
            } else if (button.querySelector('.fa-trash-alt')) {
                row.remove();
                updateSaleSummary(tableBodyId, 'totalSales', 'totalProducts'); // Actualiza el resumen al eliminar
                return;
            }

            // Actualizamos la cantidad y el total
            quantityCell.textContent = quantity;
            totalCell.textContent = calculateTotal(price, quantity, discount);

            // Actualiza el resumen de ventas después de modificar la tabla
            updateSaleSummary(tableBodyId, 'totalSales', 'totalProducts');
        });
    }

    // Función para calcular el total con descuento
    function calculateTotal(price, quantity, discount) {
        return (price * quantity * ((100 - discount) / 100)).toFixed(2);
    }

    // Función para actualizar el resumen de ventas
    function updateSaleSummary(tableBodyId, totalSalesId, totalProductsId) {
        const productsTableBody = document.getElementById(tableBodyId);
        const totalSalesElement = document.getElementById(totalSalesId);
        const totalProductsElement = document.getElementById(totalProductsId);

        if (!productsTableBody || !totalSalesElement || !totalProductsElement) return;

        let totalSales = 0;
        let totalProducts = 0;

        // Recorre todas las filas de la tabla
        productsTableBody.querySelectorAll('tr').forEach(row => {
            const quantity = parseInt(row.querySelector('td:nth-child(4)').textContent);
            const total = parseFloat(row.querySelector('td:nth-child(6)').textContent);

            totalSales += total; // Suma los totales de cada producto
            totalProducts += quantity; // Suma las cantidades de cada producto
        });

        // Formatea el total de ventas en pesos colombianos con separadores de miles y dos decimales
        totalSalesElement.textContent = totalSales.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        // Actualiza el total de productos vendidos
        totalProductsElement.textContent = totalProducts;
    }


    // Función para manejar el cálculo del cambio y la visibilidad del botón "Guardar"
    function handlePaymentInput(inputId, cambioId, totalSalesId, guardarButtonId) {
        const montoRecibidoInput = document.getElementById(inputId);
        const cambioInput = document.getElementById(cambioId);
        const totalSalesElement = document.getElementById(totalSalesId);
        const guardarButton = document.getElementById(guardarButtonId);

        if (!montoRecibidoInput || !cambioInput || !totalSalesElement || !guardarButton) return;

        montoRecibidoInput.addEventListener('input', function() {
            const montoRecibido = parseFloat(montoRecibidoInput.value) || 0;
            const totalVentas = parseFloat(totalSalesElement.textContent.replace(/[^0-9.-]+/g, "")) || 0;

            // Calcula el cambio
            const cambio = montoRecibido - totalVentas;
            cambioInput.value = cambio >= 0 ? cambio.toLocaleString('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) : "$0.00";

            // Muestra u oculta el botón "Guardar" según el monto recibido
            guardarButton.style.display = montoRecibido >= totalVentas ? 'block' : 'none';
        });
    }



    // Función para manejar el botón de reiniciar (borrar un número a la vez)
    function handleResetButton(buttonId, inputId, cambioId, guardarButtonId) {
        const resetButton = document.getElementById(buttonId);
        const montoRecibidoInput = document.getElementById(inputId);
        const cambioInput = document.getElementById(cambioId);
        const guardarButton = document.getElementById(guardarButtonId);

        if (!resetButton || !montoRecibidoInput || !cambioInput || !guardarButton) return;

        resetButton.addEventListener('click', function() {
            // Elimina un número a la vez del input de monto recibido
            const currentValue = montoRecibidoInput.value;
            montoRecibidoInput.value = currentValue.slice(0, -1); // Elimina el último carácter

            // Recalcula el cambio
            const montoRecibido = parseFloat(montoRecibidoInput.value) || 0;
            const totalVentas = parseFloat(document.getElementById('totalSales').textContent) || 0;
            const cambio = montoRecibido - totalVentas;
            cambioInput.value = cambio >= 0 ? `$${cambio.toFixed(2)}` : "$0.00";

            // Muestra u oculta el botón "Guardar" según el monto recibido
            guardarButton.style.display = montoRecibido >= totalVentas ? 'block' : 'none';
        });

        // Cambia el ícono del botón de reiniciar a uno de "borrar"
        resetButton.innerHTML = '<i class="fas fa-backspace"></i>'; // Ícono de retroceso (backspace)
    }

    // Función para manejar la selección de un producto y actualizar la tarjeta
    function handleProductSelection(tableBodyId, imageId, titleId, numberId, descriptionId, priceId, quantityId, discountId) {
        const productsTableBody = document.getElementById(tableBodyId);
        const productImage = document.getElementById(imageId);
        const productTitle = document.getElementById(titleId);
        const productNumber = document.getElementById(numberId);
        const productDescription = document.getElementById(descriptionId);
        const productPrice = document.getElementById(priceId);
        const productQuantity = document.getElementById(quantityId);
        const productDiscount = document.getElementById(discountId);

        if (!productsTableBody || !productImage || !productTitle || !productNumber || !productDescription || !productPrice || !productQuantity || !productDiscount) return;

        // Delegación de eventos para manejar clics en las filas de la tabla
        productsTableBody.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            if (!row) return;

            // Obtiene los datos del producto desde la fila seleccionada
            const number = row.querySelector('th:nth-child(1)').textContent; // # (primera columna)
            const description = row.querySelector('td:nth-child(2)').textContent; // Descripción (segunda columna)
            const price = row.querySelector('td:nth-child(3)').textContent; // Precio (tercera columna)
            const quantity = row.querySelector('td:nth-child(4)').textContent; // Cantidad (cuarta columna)
            const discount = row.querySelector('td:nth-child(5)').textContent; // Descuento (quinta columna)

            // Actualiza la tarjeta con los datos del producto
            productImage.src = "./assets/img/image-not-found.png"; // Puedes cambiar esto para cargar una imagen real
            productTitle.textContent = description; // Usamos la descripción como título
            productNumber.querySelector('small').textContent = number;
            productDescription.querySelector('small').textContent = description;
            productPrice.querySelector('small').textContent = `$ ${price}`;
            productQuantity.querySelector('small').textContent = quantity;
            productDiscount.querySelector('small').textContent = discount;
        });
    }

    // Función para cargar los métodos de pago
    function loadPaymentMethods() {
        fetch('http://localhost:8000/api/v1/payment-methods', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                const select = document.getElementById('methodPayment');
                select.innerHTML = '<option selected="selected">Seleccionar</option>'; // Resetear opciones

                // Llenar el select con los datos obtenidos
                data.forEach(method => {
                    const option = document.createElement('option');
                    option.value = method.id; // Asegúrate de que el endpoint devuelva un campo `id`
                    option.textContent = method.method; // Asegúrate de que el endpoint devuelva un campo `name`
                    select.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar los métodos de pago:', error);
            });
    }

    // Función para cargar los clientes
    function loadCustomers() {
        fetch('http://localhost:8000/api/v1/customer-branches', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => response.json())
            .then(responseData => {
                // console.log('Respuesta del endpoint:', responseData); // Inspecciona la respuesta
                const select = document.getElementById('customerSelect');
                select.innerHTML = '<option selected="selected">Seleccionar</option>'; // Resetear opciones

                // Acceder al arreglo de clientes dentro de "data"
                const data = responseData.data;

                if (Array.isArray(data)) {
                    console.log('Datos de clientes recibidos:', data); // Verifica los datos
                    // Llenar el select con los datos obtenidos
                    data.forEach(customer => {
                        const option = document.createElement('option');
                        option.value = customer.id; // Usar el ID del cliente
                        option.textContent = `${customer.first_name} ${customer.last_name}`; // Mostrar nombre completo
                        select.appendChild(option);
                    });

                    // Inicializar Choices después de cargar los datos
                    if (window.Choices) {
                        new Choices(select, {
                            searchPlaceholderValue: "Buscar cliente...",
                        });
                    }
                } else {
                    console.error('La respuesta no es un arreglo:', data);
                }
            })
            .catch(error => {
                console.error('Error al cargar los clientes:', error);
            });
    }

    function setupProductSearch() {
        const searchInput = document.querySelector('input[type="text"]');

        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.trim(); // Obtén el valor del input
                if (searchTerm) {
                    searchProducts(searchTerm); // Llama a la función de búsqueda
                } else {
                    clearTable(); // Limpia la tabla si no hay término de búsqueda
                }
            });
        }
    }

    function searchProducts(barcode) {
        fetch(`http://localhost:8000/api/v1/products/search?barcode=${barcode}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.statusText);
                }
                return response.json();
            })
            .then(responseData => {
                if (responseData.data && Array.isArray(responseData.data)) {
                    updateTable(responseData.data); // Pasa solo el arreglo `data`
                } else {
                    console.error('La respuesta no es un arreglo:', responseData);
                    clearTable(); // Limpia la tabla si la respuesta no es válida
                }
            })
            .catch(error => {
                console.error('Error al buscar productos:', error);
                clearTable(); // Limpia la tabla en caso de error
            });
    }

    function updateTable(products) {
        const tbody = document.getElementById('productsTableBody');
        if (tbody) {
            tbody.innerHTML = ''; // Limpia la tabla

            if (products && Array.isArray(products)) {
                products.forEach((product, index) => {
                    const attributes = product.attributes; // Accede a los atributos
                    const row = `
                    <tr>
                        <th scope="row" class="small">${index + 1}</th>
                        <td class="small">${attributes.name}</td>
                        <td class="small">${attributes.description}</td>
                        <td class="small">${attributes.barcode}</td>
                        <td class="small">${attributes.reference}</td>
                        <td>
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <button class="btn btn-primary me-1 mb-1 btn-sm small btn-xs" type="button"><i class="fas fa-plus"></i></button>
                                <button class="btn btn-info me-1 mb-1 btn-sm small btn-xs" type="button"><i class="fas fa-minus"></i></button>
                                <button class="btn btn-danger me-1 mb-1 btn-sm small btn-xs" type="button"><i class="far fa-trash-alt"></i></button>
                            </div>
                        </td>
                        <td class="small"></td>
                    </tr>
                `;
                    tbody.innerHTML += row; // Agrega la fila a la tabla
                });
            } else {
                console.error('Los productos no son un arreglo:', products);
            }
        }
    }

    function clearTable() {
        const tbody = document.getElementById('productsTableBody');
        if (tbody) {
            tbody.innerHTML = ''; // Limpia la tabla
        }
    }
</script>