import { apiService } from '/Caja/js/services/api.service.js';
import { cartService } from '/Caja/js/components/cart.component.js';
import { uiService } from '/Caja/js/components/ui.component.js';
import { getLoggedInUser } from '/Caja/js/services/utils.service.js';

class POSApp {
    constructor() {
        this.selectedCategory = "Todos";
        this.searchTerm = "";
        this.iconMap = {
            'efectivo': 'fas fa-money-bill-wave',
            'tarjeta': 'fas fa-credit-card',
            'factura': 'fas fa-file-invoice',
            'transferencia': 'fas fa-university',
            'cheque': 'fas fa-receipt'
        };
        this.productData = [];
    }

    async init() {
        await this.loadInitialData();
        this.setupEventListeners();
        this.renderAll();
    }

    async loadInitialData() {
        try {
            const [categories, paymentMethods, patients, products] = await Promise.all([
                apiService.fetchCategories(),
                apiService.fetchPaymentMethods(),
                apiService.fetchPatients(),
                apiService.fetchProducts()
            ]);

            this.productData = products.map(product => ({
                id: product.id,
                name: product.name,
                category: product.product_type?.name || "Categoría desconocida",
                price: parseFloat(product.sale_price) || 0.00,
                image: product.file_url || "https://via.placeholder.com/80"
            }));

            uiService.renderCategories(categories, 'category-buttons', (category) => {
                this.onCategorySelect(category);
            });

            uiService.renderPaymentMethods(paymentMethods, 'payment-methods-container', this.iconMap);
            uiService.renderPatients(patients, 'patient-select');
        } catch (error) {
            console.error('Error loading initial data:', error);
        }
    }

    setupEventListeners() {
        // Search input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value;
            this.renderProducts();
        });

        // Cart buttons
        document.getElementById('cancelBtn').addEventListener('click', () => {
            if (cartService.cart.length > 0 && confirm('¿Está seguro de cancelar la venta?')) {
                cartService.clearCart();
                this.renderCart();
            }
        });

        document.getElementById('payBtn').addEventListener('click', () => {
            if (cartService.cart.length === 0) {
                alert('El carrito está vacío.');
                return;
            }
            document.getElementById('paymentModal').style.display = 'flex';
        });

        // Payment modal buttons
        document.getElementById('cancelPaymentBtn').addEventListener('click', () => {
            document.getElementById('paymentModal').style.display = 'none';
        });

        document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
            this.processPayment();
        });

        // Discount button
        document.getElementById('discountBtn').addEventListener('click', () => {
            this.applyDiscount();
        });
    }

    renderAll() {
        this.renderProducts();
        this.renderCart();
    }

    renderProducts() {
        const filteredProducts = this.productData.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = this.selectedCategory === "Todos" || product.category === this.selectedCategory;
            return matchesSearch && matchesCategory;
        });

        uiService.renderProducts(filteredProducts, 'productsContainer', (product) => {
            this.addToCart(product);
        });
    }

    renderCart() {
        uiService.renderCart(
            cartService.cart,
            'cartItems',
            'emptyCart',
            (id) => this.removeFromCart(id),
            (id, quantity) => this.updateQuantity(id, quantity)

        );

        uiService.updateCartTotals(cartService.getTotals());
        const payBtn = document.getElementById('payBtn');
        if (payBtn) {
            payBtn.disabled = cartService.cart.length === 0;
        }

    }

    addToCart(product) {
        cartService.addItem(product);
        this.renderCart();
    }

    removeFromCart(id) {
        cartService.removeItem(id);
        this.renderCart();
    }

    updateQuantity(id, newQuantity) {
        cartService.updateQuantity(id, newQuantity);
        this.renderCart();
    }

    onCategorySelect(category) {
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('btn-success', 'btn-outline-secondary');
            btn.classList.add('btn-outline-secondary');
            if (btn.dataset.category === category) {
                btn.classList.remove('btn-outline-secondary');
                btn.classList.add('btn-success');
            }
        });

        this.selectedCategory = category;
        this.renderProducts();
    }

    applyDiscount() {
        const newDiscount = prompt("Ingrese el porcentaje de descuento:", cartService.discountPercentage.toString());
        if (newDiscount !== null) {
            const discountValue = parseFloat(newDiscount);
            if (!isNaN(discountValue)) {
                cartService.setDiscount(discountValue);
                this.renderCart();
            }
        }
    }

    async processPayment() {
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

        const paymentMethodId = parseInt(selectedMethod.dataset.methodId);
        const { total } = cartService.getTotals();

        const today = new Date();
        const dueDate = new Date();
        dueDate.setDate(today.getDate() + 30);

        try {
            // Obtener datos de billing por tipo
            const billingResponse = await apiService.getBillingByType('consumer');
            const billing = billingResponse.data;


            // Preparar payload
            const payload = {
                invoice: {
                    user_id: 1,
                    due_date: dueDate.toISOString(),
                    observations: "Venta desde punto de venta",
                    billing_type: "consumer",
                    third_party_id: parseInt(selectedPatientId),
                    billing: billing  
                },
                invoice_detail: cartService.cart.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    unit_price: item.price,
                    discount: (item.price * item.quantity * cartService.discountPercentage) / 100,
                    tax_product: 0
                })),
                payments: [{
                    payment_method_id: paymentMethodId,
                    payment_date: today.toISOString().split('T')[0],
                    amount: total,
                    notes: "Pago completo"
                }]
            };


            const data = await apiService.createInvoice(payload);

            Swal.fire({
                title: 'Factura Creada',
                text: `Factura creada con éxito. Código de factura: ${data.invoice.invoice_code}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });

            cartService.clearCart();
            this.renderCart();
            document.getElementById('paymentModal').style.display = 'none';

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

}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new POSApp();
    app.init();
});