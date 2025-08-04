import { formatDate, getLoggedInUser } from '../services/utils.service.js';
import { farmaciaService } from '../services/api.service.js';
import { paymentMethodService } from '../../../services/api/index.js'


window.verifiedProducts = [];
window.getVerifiedProducts = function () {
  return window.verifiedProducts;
};

export function renderRecipeModalContent(recipeItems, patient, prescriber) {
  const header = document.getElementById("recipeHeader");
  const container = document.getElementById("recipeContainer");

  if (!header || !container) {
    console.warn("Faltan elementos del DOM: 'recipeHeader' o 'recipeContainer'");
    return;
  }

  // Render encabezado
  header.innerHTML = `
    <div class="row">
      <div class="col-md-6 mb-3">
        <h6 class="text-primary mb-1">Paciente</h6>
        <div class="fw-semibold">${patient.first_name || ''} ${patient.last_name || ''}</div>
        <div class="text-muted small">Documento: ${patient.document_type || ''} ${patient.document_number || ''}</div>
        <div class="text-muted small">Nacimiento: ${patient.date_of_birth || ''}</div>
      </div>
      <div class="col-md-6 mb-3">
        <h6 class="text-primary mb-1">Prescriptor</h6>
        <div class="fw-semibold">${prescriber.first_name || ''} ${prescriber.last_name || ''}</div>
        <div class="text-muted small">${prescriber.specialty?.name || 'Sin especialidad'}</div>
        <div class="text-muted small">Email: ${prescriber.email || 'Sin correo'}</div>
      </div>
    </div>
  `;

  // Render lista de medicamentos sin tabla ni botones
  if (!recipeItems.length) {
    container.innerHTML = `<p class="text-center text-muted">No se ha elegido ningún elemento.</p>`;
    return;
  }

  container.innerHTML = recipeItems.map(item => `
    <div class="mb-3 p-3 border rounded-3">
      <div class="fw-medium">${item.medication} ${item.concentration}</div>
      <div class="text-muted small mb-2">${item.description || "Sin descripción"}</div>
      <div><strong>Cantidad:</strong> ${item.quantity}</div>
      <div><strong>Precio:</strong> ${item.price || "$0.00"}</div>
    </div>
  `).join("");
}

export function setupDeliveryModal() {
  document.getElementById("btnCompletarEntrega").addEventListener("click", async () => {
    const verifiedProducts = window.getVerifiedProducts();
    const paymentMethods = await paymentMethodService.getPaymentMethods();

    if (!verifiedProducts.length) {
      alert("No hay productos verificados");
      return;
    }

    renderDeliverySummary(verifiedProducts);
    renderPaymentMethods(paymentMethods);

    const modal = new bootstrap.Modal(document.getElementById("verifiedDeliveryModal"));
    modal.show();
  });
}

function renderDeliverySummary(products) {
  const tableBody = document.getElementById("deliveryCartBody");
  let total = 0;

  // Verificamos que la receta y sus items existan
  if (!window.currentRecipe || !Array.isArray(window.currentRecipe.recipe_items)) {
    console.error("Receta no definida o recipe_items inválidos");
    return;
  }

  tableBody.innerHTML = products.map(product => {
    const quantity = window.currentRecipe.recipe_items
      .filter(item => item.medication === product.name)
      .reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = quantity * product.price;
    total += subtotal;

    return `
      <tr>
        <td>${product.name}</td>
        <td>${quantity}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>$${subtotal.toFixed(2)}</td>
      </tr>
    `;
  }).join("");

  document.getElementById("deliveryTotalPrice").textContent = `$${total.toFixed(2)}`;
}

function renderPaymentMethods(paymentMethods) {
  if (!Array.isArray(paymentMethods)) {
    console.error("Se esperaba un array de métodos de pago:", paymentMethods);
    return;
  }

  const selectPayment = document.getElementById("paymentMethod");
  selectPayment.innerHTML = `
    <option value="" disabled selected>Seleccione un método</option>
  `;

  const transactionalMethods = paymentMethods.filter(method => method.category === "transactional");

  transactionalMethods.forEach(method => {
    const option = document.createElement("option");
    option.value = method.id;
    option.textContent = method.method;
    selectPayment.appendChild(option);
  });
}



export function renderReceiptModal(recipe) {
  const modalBody = document.querySelector("#receiptModal .modal-body");

  if (!modalBody) {
    console.error("Error: No se encontró el contenedor del modal.");
    return;
  }

  const patientName = `${recipe.patient.first_name} ${recipe.patient.middle_name || ''} ${recipe.patient.last_name} ${recipe.patient.second_last_name || ''}`.trim();
  const patientPhone = recipe.patient.whatsapp;

  const orderId = recipe.id;
  const orderDate = new Date().toLocaleDateString();  // FECHA DE HOY

  const prescriberName = `${recipe.prescriber.first_name} ${recipe.prescriber.last_name}`;

  const loggedInUser = getLoggedInUser();
  const attendedBy = loggedInUser ? `${loggedInUser.first_name} ${loggedInUser.last_name}` : 'Desconocido';

  let subtotal = 0;
  let itemsHTML = '';

  const verifiedProducts = typeof window.getVerifiedProducts === 'function'
    ? window.getVerifiedProducts()
    : [];

  if (Array.isArray(verifiedProducts) && verifiedProducts.length > 0) {
    verifiedProducts.forEach(product => {
      const productPrice = product.price || 0;
      const quantity = product.quantity || 1; // Por si acaso quantity no está definido
      const itemSubtotal = quantity * productPrice;
      subtotal += itemSubtotal;

      itemsHTML += `
        <div class="d-flex justify-content-between mt-2">
          <span>${product.name} ${product.concentration}</span>
          <span>$${itemSubtotal.toFixed(2)}</span>
        </div>
        <div class="small text-muted">${quantity} x $${productPrice.toFixed(2)}</div>
      `;
    });
  } else {
    itemsHTML = '<div class="text-muted">No se encontraron productos verificados.</div>';
  }

  const taxes = subtotal.toFixed(2);
  const discount = 0.00;
  const total = (subtotal + parseFloat(taxes) - discount).toFixed(2);

  modalBody.innerHTML = `
    <div class="receipt-preview">
      <div class="receipt-header">
        <div class="fw-bold">FARMACIA CENODE</div>
        <div>Av. Principal 123, Ciudad</div>
        <div>Tel: +1 234 567 890</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="text-center mb-2">
        <div class="fw-bold">RECIBO DE ENTREGA</div>
        <div>Pedido: #${orderId}</div>
        <div>Fecha: ${orderDate}</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="mb-2">
        <div>Cliente: ${patientName}</div>
        <div>Tel: ${patientPhone}</div>
      </div>

      <div class="receipt-divider"></div>

      <div class="mb-2">
        ${itemsHTML}
      </div>

      <div class="receipt-divider"></div>

      <div class="mb-2">
        <div class="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Impuestos:</span>
          <span>$${taxes}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Descuento:</span>
          <span>-$${discount.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between fw-bold">
          <span>TOTAL:</span>
          <span>$${total}</span>
        </div>
      </div>

      <div class="receipt-divider"></div>

      <div class="mb-2">
        <div>Atendido por: ${attendedBy}</div>
      </div>
    </div>
  `;
}


export async function populateMedicationSelect() {
  const select = document.getElementById("medicamentoSelect");
  select.innerHTML = '<option value="">Cargando medicamentos...</option>';

  try {
    const medicamentos = await farmaciaService.getAllMedicaments();
    if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
      select.innerHTML = '<option value="">No hay medicamentos disponibles</option>';
      return;
    }

    select.innerHTML = '<option value="">Seleccione un medicamento</option>';
    medicamentos.forEach(med => {
      const option = document.createElement("option");
      option.value = med.id;
      option.textContent = `${med.name} - ${med.concentration}`;
      option.dataset.name = med.name;
      option.dataset.concentration = med.concentration;

      option.setAttribute("data-sale_price", med.sale_price);
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando medicamentos:", error);
    select.innerHTML = '<option value="">Error al cargar medicamentos</option>';
  }
}


const verifyButton = document.getElementById("verifyButton");

verifyButton.addEventListener("click", () => {
  const select = document.getElementById("medicamentoSelect");
  const selectedOption = select.options[select.selectedIndex];

  if (!selectedOption || !selectedOption.value) {
    Swal.fire("Error", "Debes seleccionar un medicamento", "warning");
    return;
  }



  const selectedProduct = {
    id: selectedOption.value,
    name: selectedOption.dataset.name,
    concentration: selectedOption.dataset.concentration,
    price: parseFloat(selectedOption.dataset.sale_price || "0") || 0
  };

  if (!window.verifiedProducts) window.verifiedProducts = [];
  window.verifiedProducts.push(selectedProduct);
  // Usamos el botón guardado en window
  const button = window.buttonToUpdate;

  if (button) {
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.classList.remove("btn-primary");
    button.classList.add("btn-outline-primary");
    button.disabled = true;

    const row = button.closest("tr");
    const badge = row.querySelector(".badge");
    badge.className = "badge bg-success";
    badge.textContent = "Verificado";

    const priceCell = row.querySelector("td:nth-child(3)");
    priceCell.textContent = selectedProduct.price.toFixed(2);
  }

  Swal.fire("Verificado", "Medicamento agregado correctamente", "success");

  const modalEl = document.getElementById("verificationModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();

  // Limpiar variable global
  window.buttonToUpdate = null;
});
document.getElementById("submitDeliveryBtn").addEventListener("click", async () => {
  try {
    if (!Array.isArray(verifiedProducts) || verifiedProducts.length === 0) {
      Swal.fire("Advertencia", "No hay productos verificados para entregar.", "warning");
      return;
    }

    if (!window.currentRecipe) {
      Swal.fire("Error", "No se ha seleccionado una receta.", "error");
      return;
    }

    const recipe = window.currentRecipe;

    // Obtener ID del método de pago seleccionado en el modal
    const paymentMethodId = parseInt(document.getElementById("paymentMethod")?.value);
    if (!paymentMethodId) {
      Swal.fire("Advertencia", "Debe seleccionar un método de pago.", "warning");
      return;
    }

    // 1. Preparar productos a entregar
    const productPayload = verifiedProducts.map(prod => {
      const row = document.querySelector(`tr[data-product-id='${prod.id}']`);
      const quantity = row ? parseInt(row.querySelector("input.quantity-input").value || 1) : 1;

      return {
        id: prod.id,
        quantity
      };
    });

    // 2. Enviar solicitud de entrega
    const deliveryResult = await farmaciaService.completeDelivery(productPayload);

    if (deliveryResult.status !== "DELIVERED" && deliveryResult.status !== "PARTIALLY_DELIVERED") {
      Swal.fire("Error", "No se pudo completar la entrega.", "error");
      return;
    }

    // 3. Mostrar advertencias si hubo productos sin stock
    let outOfStockIds = [];
    if (Array.isArray(deliveryResult.products) && deliveryResult.products.length > 0) {
      const outOfStockMessages = deliveryResult.products
        .filter(p => p.status === "OUT_OF_STOCK")
        .map(p => {
          outOfStockIds.push(parseInt(p.id));
          return `Producto ID ${p.id}: ${p.message || "Sin stock disponible."}`;
        }).join("<br>");

      if (outOfStockMessages) {
        Swal.fire("Entrega parcial", `Algunos productos no fueron entregados:<br>${outOfStockMessages}`, "warning");
      }
    }

    // 4. Construir invoice_detail solo con productos entregados
    const invoice_detail = verifiedProducts
      .filter(prod => !outOfStockIds.includes(prod.id))
      .map(prod => {
        const row = document.querySelector(`tr[data-product-id='${prod.id}']`);
        const quantity = row ? parseInt(row.querySelector("input.quantity-input").value || 1) : 1;

        return {
          product_id: prod.id,
          deposit_id: 1,
          quantity,
          unit_price: prod.price,
          discount: 0
        };
      });

    // Si no quedó ningún producto para facturar
    if (invoice_detail.length === 0) {
      Swal.fire("Sin factura", "Ningún producto fue entregado, no se generó la factura.", "info");
      return;
    }

    // 5. Construir invoice
    const invoice = {
      resolution_number: "RES-2025-02",
      invoice_code: "0000",
      type: "invoice_farmacy",
      user_id: getLoggedInUser().id,
      due_date: new Date().toISOString(),
      observations: `Factura de compra ${recipe.id}`,
      payment_method_id: paymentMethodId
    };

    // 6. Calcular total y construir payments
    const totalAmount = invoice_detail.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

    const payments = [{
      payment_method_id: paymentMethodId,
      payment_date: new Date().toISOString(),
      amount: totalAmount,
      notes: `Pago de receta ${recipe.id}`
    }];

    // 7. Enviar factura
    const facturaPayload = {
      invoice,           // ya es el objeto plano con los datos de la factura
      invoice_detail,    // array de productos entregados
      retentions: { retention_type: 0 },
      payments           // array con el método de pago y monto
    };
    
    const facturaResult = await farmaciaService.createInvoice(facturaPayload);

    // 8. Mensaje final
    const finalMessage = deliveryResult.status === "PARTIALLY_DELIVERED"
      ? "Entrega parcial registrada. Se facturaron los productos disponibles."
      : "La entrega y factura fueron registradas correctamente.";

    Swal.fire("Éxito", finalMessage, "success");

    // Limpiar estado
    verifiedProducts.length = 0;
    window.currentRecipe = null;
    document.querySelector("#receiptModal .modal-body").innerHTML = "";
    document.getElementById("paymentMethod").value = "";

  } catch (error) {
    console.error("Error al entregar pedido:", error);
    Swal.fire("Error", "Ocurrió un error inesperado al procesar la entrega.", "error");
  }
});



