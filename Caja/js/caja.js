import { inventoryService } from "../../services/api/index.js";

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('category-buttons');

    fetch('https://dev.monaros.co/api/v1/admin/category-products')
        .then(response => response.json())
        .then(data => {
            data.forEach(category => {
                const button = document.createElement('button');
                button.className = 'btn btn-outline-secondary category-btn';
                button.dataset.category = category.name;
                button.textContent = category.name;
                container.appendChild(button);
            });
        })
        .catch(error => {
            console.error('Error cargando categorías:', error);
        });


    const $select = $('#patient-select');

    const containerPayment = document.getElementById('payment-methods-container');

    const iconMap = {
        'efectivo': 'fas fa-money-bill-wave',
        'tarjeta': 'fas fa-credit-card',
        'factura': 'fas fa-file-invoice',
        'transferencia': 'fas fa-university',
        'cheque': 'fas fa-receipt'
    };

    fetch('https://dev.monaros.co/api/v1/admin/payment-methods')
        .then(response => response.json())
        .then(data => {
            data.forEach(method => {
                const col = document.createElement('div');
                col.className = 'col-4';

                const methodDiv = document.createElement('div');
                methodDiv.className = 'payment-method';
                methodDiv.dataset.methodId = method.id;

                const key = method.method.toLowerCase();
                const iconClass = Object.keys(iconMap).find(k => key.includes(k)) ? iconMap[Object.keys(iconMap).find(k => key.includes(k))] : 'fas fa-question-circle';

                const icon = document.createElement('i');
                icon.className = iconClass;

                const span = document.createElement('span');
                span.className = 'small d-block mt-2';
                span.textContent = method.method;

                methodDiv.appendChild(icon);
                methodDiv.appendChild(span);
                col.appendChild(methodDiv);
                containerPayment.appendChild(col);

                // ✅ Evento para marcar como seleccionado
                methodDiv.addEventListener('click', () => {
                    containerPayment.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
                    methodDiv.classList.add('selected');
                });
            });
        })
        .catch(error => {
            console.error('Error cargando métodos de pago:', error);
        });

        fetch('https://dev.monaros.co/medical/patients')
        .then(res => res.json())
        .then(data => {
            const select = document.getElementById('patient-select');
            data.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = `${p.first_name} ${p.last_name} - ${p.document_number}`;

                select.appendChild(option);
            });

            // Inicializar Select2 DESPUÉS de llenar las opciones
            $('#patient-select').select2({
                width: '100%',
                placeholder: 'Seleccione un cliente'
            });
        });
});



// URL de la API
const apiUrl = 'https://dev.monaros.co/api/v1/admin/products/medicamentos';

// Variables globales
let productData = [];  // Definir productData aquí
let cart = [];
let discountPercentage = 0;
let selectedCategory = "Todos";
let searchTerm = "";

// Elementos DOM
const productsContainer = document.getElementById('productsContainer');
const cartItemsContainer = document.getElementById('cartItems');
const emptyCartMessage = document.getElementById('emptyCart');
const subtotalElement = document.getElementById('subtotal');
const discountElement = document.getElementById('discount');
const totalElement = document.getElementById('total');
const modalTotalElement = document.getElementById('modalTotal');
const paymentModal = document.getElementById('paymentModal');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.category-btn');
const payBtn = document.getElementById('payBtn');
const cancelBtn = document.getElementById('cancelBtn');
const discountBtn = document.getElementById('discountBtn');
const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');

// Inicializar la aplicación
function init() {
    fetchProducts();  // Cargar productos desde la API
    setupEventListeners();
}

// Configurar event listeners
function setupEventListeners() {
    // Búsqueda de productos
    searchInput.addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderProducts();
    });

    // Filtrado por categoría
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('btn-success', 'btn-outline-secondary'));
            categoryButtons.forEach(btn => btn.classList.add('btn-outline-secondary'));
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-success');
            selectedCategory = button.dataset.category;
            renderProducts();
        });
    });

    // Botones de carrito
    cancelBtn.addEventListener('click', () => {
        if (cart.length > 0 && confirm('¿Está seguro de cancelar la venta?')) {
            clearCart();
        }
    });

    payBtn.addEventListener('click', () => {
        modalTotalElement.textContent = totalElement.textContent;
        paymentModal.style.display = 'flex';
    });

    // Botones de modal de pago
    cancelPaymentBtn.addEventListener('click', () => {
        paymentModal.style.display = 'none';
    });

    confirmPaymentBtn.addEventListener('click', processPayment);

    // Botón de descuento
    discountBtn.addEventListener('click', applyDiscount);


}

// Obtener productos de la API
function fetchProducts() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            productData = data.map(product => ({
                id: product.id,
                name: product.name,
                category: product.product_type?.name || "Categoría desconocida",
                price: parseFloat(product.sale_price) || 0.00,
                image: product.file_url || "https://via.placeholder.com/80"
            }));
            renderProducts();
        })
        .catch(error => {
            console.error('Error al obtener los productos:', error);
        });
}


// Renderizar productos filtrados
function renderProducts() {
    const filteredProducts = productData.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    productsContainer.innerHTML = '';

    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col';
        productCard.innerHTML = `
            <div class="card h-100 product-card">
                <div class="card-body">
                    <div class="text-center mb-3">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid" style="height: 80px; object-fit: contain;">
                    </div>
                    <h6 class="card-title">${product.name}</h6>
                    <p class="card-text small text-muted">${product.category}</p>
                    <p class="card-text text-success fw-bold">$${product.price.toFixed(2)}</p>
                </div>
            </div>
        `;
        productCard.addEventListener('click', () => addToCart(product));
        productsContainer.appendChild(productCard);
    });
}

// Agregar producto al carrito
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    renderCart();
    updateCartTotals();
}

// Renderizar carrito
function renderCart() {
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        payBtn.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        payBtn.disabled = false;

        // Limpiar contenedor de items (excepto el mensaje de vacío)
        const cartItems = Array.from(cartItemsContainer.children);
        cartItems.forEach(item => {
            if (item !== emptyCartMessage) {
                item.remove();
            }
        });

        // Agregar items al carrito
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <h6 class="mb-0">${item.name}</h6>
                    <button class="btn btn-sm text-danger p-0" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted small">$${item.price.toFixed(2)} x ${item.quantity}</span>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="btn btn-outline-secondary disabled">${item.quantity}</span>
                        <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }
}

// Eliminar producto del carrito
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
    updateCartTotals();
}

// Actualizar cantidad de un producto
function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;

    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        renderCart();
        updateCartTotals();
    }
}

// Actualizar totales del carrito
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discountAmount;

    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    discountElement.textContent = `-$${discountAmount.toFixed(2)}`;
    totalElement.textContent = `$${total.toFixed(2)}`;
}

// Aplicar descuento
function applyDiscount() {
    const newDiscount = prompt("Ingrese el porcentaje de descuento:", discountPercentage.toString());
    if (newDiscount !== null) {
        const discountValue = parseFloat(newDiscount);
        if (!isNaN(discountValue) && discountValue >= 0 && discountValue <= 100) {
            discountPercentage = discountValue;
            updateCartTotals();
        }
    }
}

// Procesar pago
// function processPayment() {
//     alert(`Pago procesado correctamente. Total: ${totalElement.textContent}`);
//     clearCart();
//     paymentModal.style.display = 'none';
// }

// Limpiar carrito
function clearCart() {
    cart = [];
    discountPercentage = 0;
    renderCart();
    updateCartTotals();
}
// Procesar pago
// Procesar pago
async function processPayment() {
    const selectedMethod = document.querySelector('.payment-method.selected');
    const selectedPatientId = document.getElementById('patient-select').value;

    if (!selectedMethod) {
        alert('Debe seleccionar un método de pago.');
        return;
    }

    if (!selectedPatientId) {
        alert('Debe seleccionar un cliente.');
        return;
    }

    const paymentMethodId = selectedMethod.dataset.methodId;

    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }

    // Calcular totales
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = (subtotal * discountPercentage) / 100;
    const total = subtotal - discountAmount;

    // Obtener fecha actual en formato YYYY-MM-DD
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // 30 días para vencimiento
    
    // Preparar payload según estructura del endpoint
    const payload = {
        invoice: {
            user_id: 1, // Deberías obtener este ID del usuario logueado
            due_date: dueDate.toISOString().split('T')[0],
            observations: "Venta desde punto de venta",
            invoice_code: "INV-" + Date.now(), // o el formato que manejes
            resolution_number: "RES-2025-01", // Ajusta esto según tu configuración
            type: "ELECTRONIC" // o "MANUAL", según sea el caso
        },
        invoice_detail: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            unit_price: item.price,
            discount: (item.price * item.quantity * discountPercentage) / 100
        })),
        payments: [{
            payment_method_id: parseInt(paymentMethodId),
            payment_date: today.toISOString().split('T')[0],
            amount: total,
            notes: "Pago completo"
        }]
    };

    try {
        const response = await fetch('https://dev.monaros.co/api/v1/admin/invoices/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('auth_token')
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Respuesta con error:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Usar SweetAlert2 para mostrar el mensaje de éxito
        Swal.fire({
            title: 'Factura Creada',
            text: `Factura creada con éxito. Código de factura: ${data.invoice.invoice_code}`,
            icon: 'success',
            confirmButtonText: 'Imprimir',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
            generarReciboPDF(data);
            }
        });

        clearCart();
        paymentModal.style.display = 'none';
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        Swal.fire({
            title: 'Error',
            text: 'Error al procesar el pago: ' + error.message,
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function generarReciboPDF(data){
console.log("data", data);
}


// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', init);
