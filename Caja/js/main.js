import { apiService } from "/Caja/js/services/api.service.js";
import { cartService } from "/Caja/js/components/cart.component.js";
import { uiService } from "/Caja/js/components/ui.component.js";
import { getLoggedInUser } from "/Caja/js/services/utils.service.js";
import { infoCompanyService } from "../../services/api/index.js";
import { generatePDFReceipts } from "../../funciones/funcionesJS/exportPDF.js";
import { formatDate } from "../../services/utilidades.js";
class POSApp {
  constructor() {
    this.selectedCategory = "Todos";
    this.searchTerm = "";
    this.iconMap = {
      efectivo: "fas fa-money-bill-wave",
      tarjeta: "fas fa-credit-card",
      factura: "fas fa-file-invoice",
      transferencia: "fas fa-university",
      cheque: "fas fa-receipt",
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
      const [categories, paymentMethods, patients, products] =
        await Promise.all([
          apiService.fetchCategories(),
          apiService.fetchPaymentMethods(),
          apiService.fetchPatients(),
          apiService.fetchProducts(),
        ]);

      this.productData = products.map((product) => ({
        id: product.id,
        name: product.name,
        category: product.product_type?.name || "Categoría desconocida",
        price: parseFloat(product.sale_price) || 0.0,
        image: product.file_url || "https://via.placeholder.com/80",
      }));

      uiService.renderCategories(categories, "category-buttons", (category) => {
        this.onCategorySelect(category);
      });

      uiService.renderPaymentMethods(
        paymentMethods,
        "payment-methods-container",
        this.iconMap
      );
      uiService.renderPatients(patients, "patient-select");
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  }

  setupEventListeners() {
    // Search input
    document.getElementById("searchInput").addEventListener("input", (e) => {
      this.searchTerm = e.target.value;
      this.renderProducts();
    });

    // Cart buttons
    document.getElementById("cancelBtn").addEventListener("click", () => {
      if (
        cartService.cart.length > 0 &&
        confirm("¿Está seguro de cancelar la venta?")
      ) {
        cartService.clearCart();
        this.renderCart();
      }
    });

    document.getElementById("payBtn").addEventListener("click", () => {
      if (cartService.cart.length === 0) {
        alert("El carrito está vacío.");
        return;
      }
      document.getElementById("paymentModal").style.display = "flex";
    });

    // Payment modal buttons
    document
      .getElementById("cancelPaymentBtn")
      .addEventListener("click", () => {
        document.getElementById("paymentModal").style.display = "none";
      });

    document
      .getElementById("confirmPaymentBtn")
      .addEventListener("click", () => {
        this.processPayment();
      });

    // Discount button
    document.getElementById("discountBtn").addEventListener("click", () => {
      this.applyDiscount();
    });
  }

  renderAll() {
    this.renderProducts();
    this.renderCart();
  }

  renderProducts() {
    const filteredProducts = this.productData.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      const matchesCategory =
        this.selectedCategory === "Todos" ||
        product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });

    uiService.renderProducts(
      filteredProducts,
      "productsContainer",
      (product) => {
        this.addToCart(product);
      }
    );
  }

  renderCart() {
    uiService.renderCart(
      cartService.cart,
      "cartItems",
      "emptyCart",
      (id) => this.removeFromCart(id),
      (id, quantity) => this.updateQuantity(id, quantity)
    );

    uiService.updateCartTotals(cartService.getTotals());
    const payBtn = document.getElementById("payBtn");
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
    document.querySelectorAll(".category-btn").forEach((btn) => {
      btn.classList.remove("btn-success", "btn-outline-secondary");
      btn.classList.add("btn-outline-secondary");
      if (btn.dataset.category === category) {
        btn.classList.remove("btn-outline-secondary");
        btn.classList.add("btn-success");
      }
    });

    this.selectedCategory = category;
    this.renderProducts();
  }

  applyDiscount() {
    const newDiscount = prompt(
      "Ingrese el porcentaje de descuento:",
      cartService.discountPercentage.toString()
    );
    if (newDiscount !== null) {
      const discountValue = parseFloat(newDiscount);
      if (!isNaN(discountValue)) {
        cartService.setDiscount(discountValue);
        this.renderCart();
      }
    }
  }

  async processPayment() {
    const selectedMethod = document.querySelector(".payment-method.selected");
    const selectedPatientId = document.getElementById("patient-select").value;

    if (!selectedMethod) {
      alert("Debe seleccionar un método de pago.");
      return;
    }

    if (!selectedPatientId) {
      alert("Debe seleccionar un cliente.");
      return;
    }

    const paymentMethodId = parseInt(selectedMethod.dataset.methodId);
    const { total } = cartService.getTotals();

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    try {
      // Obtener datos de billing por tipo
      const billingResponse = await apiService.getBillingByType("consumer");
      const billing = billingResponse.data;

      // Preparar payload
      const payload = {
        invoice: {
          user_id: 1,
          due_date: dueDate.toISOString(),
          observations: "Venta desde punto de venta",
          billing_type: "consumer",
          third_party_id: parseInt(selectedPatientId),
          billing: billing,
        },
        invoice_detail: cartService.cart.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          discount:
            (item.price * item.quantity * cartService.discountPercentage) / 100,
          tax_product: 0,
        })),
        payments: [
          {
            payment_method_id: paymentMethodId,
            payment_date: today.toISOString().split("T")[0],
            amount: total,
            notes: "Pago completo",
          },
        ],
      };

      const data = await apiService.createInvoice(payload);

      Swal.fire({
        title: "Factura Creada",
        text: `Factura creada con éxito. Código de factura: ${data.invoice.invoice_code}`,
        icon: "success",
        confirmButtonText: "Imprimir",
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          generarReciboPDF(data.invoice);
        }
      });

      cartService.clearCart();
      this.renderCart();
      document.getElementById("paymentModal").style.display = "none";
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      Swal.fire({
        title: "Error",
        text: "Error al procesar el pago: " + error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  }
}

function generarReciboPDF(invoice) {
  // Plantilla de recibo de caja para productos vendidos
  const productsHTML = invoice.details
    .map(
      (detail) => `
    <div class="d-flex justify-content-between small">
        <span>${detail.product.name} x${detail.quantity}</span>
        <span>$ ${detail.subtotal}</span>
    </div>
`
    )
    .join("");

  const paymentsMethodsHTML = invoice.payment_methods
    .map(
      (paymentMethod) => `
    <div class="mb-2">
        <div>Método de pago: <span class="fw-bold">${paymentMethod.method}</span></div>
    </div>
`
    )
    .join("");

  const receiptHTML = `
    <style>
            .receipt-preview {
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    width: 100%;
                    max-width: 300px;
                    margin: 0 auto;
                    color: #000;
            }
            .receipt-header {
                    text-align: center;
                    margin-bottom: 10px;
            }
            .receipt-divider {
                    border-top: 1px dashed #000;
                    margin: 10px 0;
            }
            .fw-bold {
                    font-weight: bold;
            }
            .text-center {
                    text-align: center;
            }
            .d-flex {
                    display: flex;
            }
            .justify-content-between {
                    justify-content: space-between;
            }
            .mb-2 {
                    margin-bottom: 2px;
            }
            .mt-2 {
                    margin-top: 2px;
            }
            .small {
                    font-size: 12px;
            }
            .text-muted {
                    color: #6c757d;
            }
    </style>
    <div class="receipt-preview">
            <div class="receipt-header">
                    <div class="fw-bold">${
                      infoCompany.data[0].attributes.legal_name
                    }</div>
                    <div>${infoCompany.data[0].attributes.address}, ${
    infoCompany.data[0].attributes.city
  }</div>
                    <div>${infoCompany.data[0].attributes.phone}</div>
            </div>

            <div class="text-center mb-2">
                    <div class="fw-bold">RECIBO DE CAJA</div>
                    <div>No. Recibo: <span class="fw-bold">${
                      invoice.invoice_code
                    }</span></div>
                    <div>Resolución: <span class="small">${
                      invoice.resolution_number
                    }</span></div>
                    <div>Fecha: ${formatDate(invoice.created_at, true)}</div>
            </div>

            <div class="receipt-divider"></div>

            <div class="mb-2">
                    <div class="fw-bold">Productos Vendidos:</div>
                    <div>
                            ${productsHTML}
                    </div>
            </div>

            <div class="receipt-divider"></div>

            <div class="mb-2">
                    <div class="d-flex justify-content-between">
                            <span>Subtotal:</span>
                            <span>$${invoice.subtotal}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                            <span>Descuento:</span>
                            <span>-$${invoice.discount}</span>
                    </div>
                    <div class="d-flex justify-content-between">
                            <span>Impuestos:</span>
                            <span>$${invoice.iva}</span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold">
                            <span>TOTAL:</span>
                            <span>$${invoice.total_amount}</span>
                    </div>
            </div>

            <div class="receipt-divider"></div>

            <div class="mb-2">
                    <div class="fw-bold">Metodos de pago:</div>
                    <div>
                            ${paymentsMethodsHTML}
                    </div>
            </div>

            <div class="receipt-divider"></div>

            <div class="text-center small text-muted mt-2">
                    ¡Gracias por su compra!
            </div>
    </div>
`;
  const configPDF = {
    name: "Recibo de caja",
    dimensions: [0, 0, 226.77, 390],
  };

  generatePDFReceipts(receiptHTML, configPDF);
}

let infoCompany = null;

document.addEventListener("DOMContentLoaded", async () => {
  infoCompany = await infoCompanyService.getCompany();
});
// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const app = new POSApp();
  app.init();
});
