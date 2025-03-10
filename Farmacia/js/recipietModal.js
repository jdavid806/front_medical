window.pedidoSeleccionado = null; // 🟢 Guardará el pedido seleccionado

// 🟢 Detectar clic en cualquier pedido
document.querySelectorAll("[data-pedido-id]").forEach((fila) => {
    fila.addEventListener("click", function () {
        const pedidoId = this.getAttribute("data-pedido-id"); // Obtener ID del pedido
        seleccionarPedido(pedidoId);
    });
});
window.pedidoSeleccionado = null; 

function seleccionarPedido(recipe) {
    console.log("🟢 Seleccionando pedido:", recipe);

    if (!recipe) {
        console.error("⚠️ Pedido no encontrado.");
        return;
    }

    window.pedidoSeleccionado = recipe; // ✅ Guardamos el pedido seleccionado
    console.log("✅ Pedido seleccionado:", window.pedidoSeleccionado);
}


// 🟢 Llenar el modal cuando se abre
document.getElementById("modalReceta").addEventListener("show.bs.modal", function () {
    console.log("📌 Intentando abrir modal con receta:", window.pedidoSeleccionado);

    if (!window.pedidoSeleccionado || !window.pedidoSeleccionado.receta) {
        console.error("⚠️ No hay receta activa.");
        return;
    }

    const receta = window.pedidoSeleccionado.receta; // 🟢 Tomamos la receta del pedido seleccionado
    const modalTitle = document.getElementById("modalRecetaTitle");
    const tableBody = document.getElementById("recipeTableBody");

    modalTitle.textContent = `Receta #${receta.id}`;
    tableBody.innerHTML = "";

    if (!receta.recipe_items || receta.recipe_items.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay medicamentos en esta receta</td></tr>`;
        return;
    }

    receta.recipe_items.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <div class="fw-medium">${item.medication}</div>
                <div class="text-muted small">${item.medication_type}</div>
            </td>
            <td>${item.quantity}</td>
            <td>${item.concentration}</td>
            <td>${item.frequency} - ${item.duration} días</td>
            <td>${item.take_every_hours} horas</td>
            <td class="text-muted">${item.observations || "Ninguna"}</td>
        `;

        tableBody.appendChild(row);
    });
});
