import { farmaciaService } from "../../services/api/index.js";
import { inventoryService } from "../../services/api/index.js";

document.addEventListener("DOMContentLoaded", async () => {

    try {
        const response = await farmaciaService.getAllRecipes();
        const farmaciaRecipes = Array.isArray(response) ? response : response?.data || [];
        await cargarMedicamentos();

 

        if (!Array.isArray(farmaciaRecipes)) {
            console.error("Error: La API no devolvió un array válido", farmaciaRecipes);
            return;
        }

        renderOrderList(farmaciaRecipes);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
    }
});


function renderOrderList(recipes) {
    const orderList = document.querySelector(".order-list");

    if (!orderList) {
        console.error("Error: No se encontró el contenedor '.order-list' en el DOM.");
        return;
    }

    orderList.innerHTML = ""; // Limpiar lista antes de renderizar

    recipes.forEach(recipe => {
        const patientName = formatFullName(recipe.patient);
        const statusClass = getStatusBadgeClass(recipe.status);
        const formattedDate = formatDate(recipe.created_at);

        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item", "p-3", "border-bottom");
        orderItem.dataset.recipeId = recipe.id; // Guardar ID en data-attribute
        orderItem.dataset.patientInfo = JSON.stringify(recipe.patient); // Guardar paciente en data-attribute

        orderItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="d-flex align-items-center">
                        <h6 class="mb-0">Receta #${recipe.id}</h6>
                        <span class="badge ${statusClass} ms-2 status-badge">
                            ${recipe.status || "Desconocido"}
                        </span>
                    </div>
                    <div class="text-muted small"><strong>Paciente:</strong> <span class="text-dark">${patientName}</span></div>
                </div>
                <div class="text-end">
                    <div class="small fw-bold">${formattedDate}</div>
                </div>
            </div>
        `;

        // Agregar evento de clic a cada receta
        orderItem.addEventListener("click", () => {
            updateClientInfo(recipe.patient);
            renderMedicationTable(recipe.recipe_items);
        });

        orderList.appendChild(orderItem);
    });
}

// Función para actualizar la tarjeta con la información del paciente
function updateClientInfo(patient) {
    if (!patient) {
        console.error("Error: Paciente no encontrado.");
        return;
    }

    const clientInfoContainer = document.querySelector("#client-info"); // Asegúrate de que la tarjeta tenga este ID

    if (!clientInfoContainer) {
        console.error("Error: No se encontró el contenedor de información del cliente.");
        return;
    }

    clientInfoContainer.innerHTML = `
        <h6 class="card-title">Información del Cliente</h6>
        <div class="mb-3">
            <div class="fw-bold">${formatFullName(patient)}</div>
            <div>${patient.email || "Sin email"}</div>
            <div>${patient.whatsapp ? `+${patient.whatsapp}` : "Sin teléfono"}</div>
        </div>
        <h6 class="card-title">Método de Entrega</h6>
        <div class="d-flex align-items-center">
            <i class="fas fa-store text-primary me-2"></i>
            <span>Recoger en tienda</span>
        </div>
    `;
}

// Función para renderizar la tabla de medicamentos de la receta
function renderMedicationTable(recipeItems) {
    console.log("Renderizando tabla de medicamentos...", recipeItems);
    const tableBody = document.querySelector(".table tbody");

    if (!tableBody) {
        console.error("Error: No se encontró la tabla de medicamentos.");
        return;
    }

    tableBody.innerHTML = ""; // Limpiar tabla antes de agregar los nuevos medicamentos

    if (!Array.isArray(recipeItems) || recipeItems.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay medicamentos en esta receta.</td></tr>`;
        return;
    }

    recipeItems.forEach(item => {
        const verificationBadge = item.verified
            ? `<span class="badge bg-success">Verificado</span>`
            : `<span class="badge bg-secondary">Pendiente</span>`;

        const verifyButton = item.verified
            ? `<button class="btn btn-sm btn-outline-primary"><i class="fas fa-redo"></i></button>`
            : `<button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#verificationModal">
                    <i class="fas fa-check me-1"></i> Verificar
                </button>`;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="fw-medium">${item.medication + " " + item.concentration || "Desconocido"}</div>
                <div class="text-muted small">${item.description || "Sin descripción"}</div>
            </td>
            <td>${item.quantity || "N/A"}</td>
            <td>$${item.price ? item.price.toFixed(2) : "0.00"}</td>
            <td>${verificationBadge}</td>
            <td>${verifyButton}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Función para formatear el nombre completo del paciente
function formatFullName(person) {
    if (!person) return "No disponible";
    return `${person.first_name || ""} ${person.middle_name || ""} ${person.last_name || ""} ${person.second_last_name || ""}`.trim();
}

// Función para obtener la clase de estado
function getStatusBadgeClass(status) {
    switch (status?.toLowerCase()) {
        case "en espera":
            return "bg-primary";
        case "prioritario":
            return "bg-warning text-dark";
        case "receta especial":
            return "bg-info";
        default:
            return "bg-secondary";
    }
}


function formatDate(dateString) {
    if (!dateString) return "Sin fecha";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

async function cargarMedicamentos() {
    try {
        const response = await inventoryService.getAll();
        let medicines = response.data.filter(product => product.attributes.product_type_id == 4);

        console.log("Medicamentos cargados:", medicines);

        if (!Array.isArray(medicines)) {
            console.error("Error: La API no devolvió un array válido", medicines);
            return;
        }

        const selectMedicamento = document.getElementById("medicamentoSelect");
        selectMedicamento.innerHTML = '<option value="">Buscar medicamento...</option>'; // Resetear opciones

        medicines.forEach(med => {
            const option = document.createElement("option");
            option.value = med.id;
            option.textContent = `${med.attributes.name} - ${med.attributes.description || "Sin descripción"}`;
            option.dataset.name = med.attributes.name;
            option.dataset.description = med.attributes.description || "Sin descripción";
            option.dataset.lote = med.attributes.lote || "No disponible";
            option.dataset.expiracion = med.attributes.expiration_date || "";
            selectMedicamento.appendChild(option);
        });

        // Inicializar Select2 en el select
        $("#medicamentoSelect").select2({
            width: '100%',
            placeholder: "Buscar medicamento...",
            allowClear: true
        });

        // Evento para actualizar el modal cuando se seleccione un medicamento
        selectMedicamento.addEventListener("change", function () {
            const selectedOption = this.options[this.selectedIndex];

            if (selectedOption.value) {
                document.getElementById("medicamentoNombre").textContent = selectedOption.dataset.name;
                document.getElementById("medicamentoDescripcion").textContent = selectedOption.dataset.description;
                document.getElementById("medicamentoLote").value = selectedOption.dataset.lote;
                document.getElementById("medicamentoFechaVenc").value = selectedOption.dataset.expiracion;
            } else {
                // Si no se selecciona nada, mostrar valores por defecto
                document.getElementById("medicamentoNombre").textContent = "Seleccione un medicamento";
                document.getElementById("medicamentoDescripcion").textContent = "Descripción aquí...";
                document.getElementById("medicamentoLote").value = "";
                document.getElementById("medicamentoFechaVenc").value = "";
            }
        });

    } catch (error) {
        console.error("Error al obtener los medicamentos:", error);
    }
}

// Llamar la función al cargar la página
document.addEventListener("DOMContentLoaded", cargarMedicamentos);





