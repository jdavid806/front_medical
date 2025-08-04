import { suppliesService } from "../../services/api/index.js";
import { inventoryService } from "../../services/api/index.js";


let selectedRecipe = null;

function aPesos(valor) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(valor);
}


document.addEventListener("DOMContentLoaded", async () => {
    try {
  
        const response = await suppliesService.getAllSupplies();
        const farmaciaRecipes = Array.isArray(response) ? response : response?.data || [];
        await cargarInsumos();
        setInterval(updateDateTime, 1000);



        updateDateTime();


        if (!Array.isArray(farmaciaRecipes)) {
            console.error("Error: La API no devolvió un array válido", farmaciaRecipes);
            return;
        }

        renderOrderList(farmaciaRecipes);
    } catch (error) {
        console.error("Error al obtener recetas:", error);
    }
});



//Renderizar la lista de insumos

function sumatoria(productos) {
    let  total = 0
    const impuesto = 0
    const descuento = 0
    const subTotal = productos.reduce((acc, item) => {
        return acc + (typeof item.precio === 'number' ? item.precio : 0);
    }, 0);
    document.getElementById('subtotal').textContent = aPesos(subTotal);
    document.getElementById('impuesto').textContent = aPesos(impuesto);
    document.getElementById('descuento').textContent = aPesos(descuento);
    total = +subTotal - +descuento + +impuesto
    document.getElementById('total').textContent = aPesos(total);
}



function renderOrderList(recipes) {
    const orderList = document.querySelector(".order-list");

    if (!orderList) {
        console.error("Error: No se encontró el contenedor '.order-list' en el DOM.");
        return;
    }

    orderList.innerHTML = ""; // Limpiar lista antes de renderizar

    recipes.forEach(recipe => {
        console.log(recipe);
        const statusClass = getStatusBadgeClass(recipe.status);
        const formattedDate = formatDate(recipe.created_at);

        const orderItem = document.createElement("div");
        orderItem.classList.add("order-item", "p-3", "border-bottom");
        orderItem.dataset.recipeId = recipe.id;
        orderItem.dataset.patientInfo = JSON.stringify(recipe.patient);

        orderItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="d-flex align-items-center">
                        <h6 class="mb-0">Solicitud #${recipe.id}</h6>
                        <span class="badge ${statusClass} ms-2 status-badge">
                            ${recipe.status || "Desconocido"}
                        </span>
                    </div>
                    <div class="text-muted small"><strong>Observaciones:</strong> <span class="text-dark">${recipe.observations}</span></div>
                    <div class="text-muted small"><strong>Fecha de solicitud:</strong> <span class="text-dark">${formattedDate}</span></div>
                </div>
                <div class="text-end">
                    <div class="small fw-bold">${formattedDate}</div>
                    <button class="btn btn-danger btn-sm mt-2 cancelButton">Cancelar</button>
                </div>
            </div>
        `;

        // Evento de clic para seleccionar la receta
        orderItem.addEventListener("click", () => {
            console.log(recipe)
            selectedRecipe = recipe; // Guardar la receta seleccionada
            updateClientInfo(recipe.patient);
            renderMedicationTable(recipe.products);
        });

        // Evento al botón de cancelar
        orderItem.querySelector(".cancelButton").addEventListener("click", (e) => {
            e.stopPropagation(); // Evitar que el clic también dispare el evento del item de la receta
            showCancelConfirmation(recipe);
        });

        orderList.appendChild(orderItem);
    });
}

// Evento al botón "Completar entrega"
document.getElementById("completeDeliveryBtn").addEventListener("click", () => {
    if (selectedRecipe) {
        validateDelivery(selectedRecipe);
    } else {
        Swal.fire({
            title: 'Error',
            text: 'Por favor, selecciona una solicitud antes de completar la entrega.',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
        });
    }
});

function showCancelConfirmation(recipe) {
    Swal.fire({
        title: '¿Estás seguro que deseas cancelar?',
        text: `La solicitud #${recipe.id} será cancelada.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, regresar',
    }).then((result) => {
        if (result.isConfirmed) {

            suppliesService.cancelSupply(recipe.id)
                .then(() => {

                    Swal.fire({
                        title: 'Solicitud cancelada',
                        text: `La solicitud #${recipe.id} ha sido cancelada con éxito.`,
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });             
                    cancelRecipeRequest(recipe);
                })
                .catch((error) => {
                    console.error("Error al cancelar la solicitud:", error);
                    Swal.fire({
                        title: 'Error',
                        text: 'Hubo un error al cancelar la solicitud.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                });
        }
    });
}


function validateDelivery(recipe) {
    suppliesService.validateSupply(recipe.id)
        .then((response) => {
            const apiMessage = response.data?.original?.message || "Entrega validada exitosamente";

            Swal.fire({
                title: 'Entrega validada',
                text: apiMessage,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            });
        })
        .catch((error) => {
            console.error("Error al validar la entrega:", error);
            const errorMessage = error.response?.data?.original?.message || 'Hubo un error al validar la entrega.';

            Swal.fire({
                title: 'Error',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        });
}


function updateClientInfo(patient) {
    console.log(patient)
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
        <h6 class="card-title">Información de la entrega</h6>
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



// Función para renderizar la tabla de insumos
function renderMedicationTable(recipeItems) {
    //Calcular el total de items
    sumatoria(recipeItems)
    const tableBody = document.querySelector(".table tbody");
    const verifyButtonContainer = document.querySelector("#verifyButtonContainer");

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
        const statusBadge = item.verified
            ? `<span class="badge bg-success">Verificado</span>`
            : `<span class="badge bg-secondary">Pendiente</span>`;

        const row = document.createElement("tr");
        const medication = item.medication ?? '';
        const concentration = item.medication ?? '';
        let textoMostrar = medication + ' ' + concentration
        row.innerHTML = `
            <td>
                
                <div class="fw-medium">${textoMostrar}</div>
                <div class="text-muted small">${item.description || "Sin descripción"}</div>
            </td>
            <td>${item.quantity || "N/A"}</td>
            <td>${statusBadge}</td>
        `;

        tableBody.appendChild(row);
    });

    // Coloca el botón de verificación al final de la tabla
    if (verifyButtonContainer) {
        verifyButtonContainer.innerHTML = `
            <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#verificationModal">
                <i class="fas fa-check me-1"></i> Verificar
            </button>
        `;
    }
}



// Función para obtener la clase de estado
function getStatusBadgeClass(status) {
    switch (status?.toLowerCase()) {
        case "pendiente":
            return "bg-primary";
        case "prioritario":
            return "bg-warning text-dark";
        case "cancelado":
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



async function cargarInsumos() {
    try {
        const response = await inventoryService.getAll();
        let medicines = response.data.filter(product => product.attributes.product_type_id == 4);

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
function updateDateTime() {
    const currentDate = new Date();

    // Obtener fecha en formato dd/mm/yyyy
    const formattedDate = currentDate.toLocaleDateString("es-ES");

    // Obtener hora en formato hh:mm:ss
    const formattedTime = currentDate.toLocaleTimeString("es-ES");

    // Actualizar los elementos del DOM
    document.getElementById("currentDate").textContent = formattedDate;
    document.getElementById("currentTime").textContent = formattedTime;
}

// Llamar a la función para actualizar la fecha y hora cada segundo



