import { inventoryService } from "../../services/api/index.js";

console.log("Ejecutando script");

document.addEventListener("DOMContentLoaded", async () => {
    const formVacuna = document.getElementById("formNuevaVacuna");
    let editingProductId = null;
    fetchVaccines();
    formVacuna.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!formVacuna.checkValidity()) {
            formVacuna.classList.add("was-validated");
            return;
        }

        const vacunaData = {
            name: document.getElementById("nombreVacuna").value,
            product_type_id: 3,
            type: document.getElementById("tipoVacuna").value,
            stock: document.getElementById("stockVacuna").value,
            expiration_date: document.getElementById("fechaCaducidadVacuna").value,
            batch_number: document.getElementById("loteVacuna").value,
            description: document.getElementById("descripcionVacuna").value || null,
            price_purchase: document.getElementById("precioCompraVacuna").value,
            price_sale: document.getElementById("precioVentaVacuna").value,
        };

        try {
            if (editingProductId) {
                await inventoryService.updateProduct(editingProductId, vacunaData);
                await Swal.fire("¡Éxito!", "Vacuna actualizada correctamente.", "success");
            } else {
                await inventoryService.storeProduct(vacunaData);
                await Swal.fire("¡Éxito!", "Vacuna registrada exitosamente.", "success");
            }

            const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById("modalNuevaVacuna"));
            modal.hide();
            formVacuna.reset();
            formVacuna.classList.remove("was-validated");
            editingProductId = null;
            await fetchVaccines();
        } catch (error) {
            console.error("Error al guardar vacuna:", error);
            alert("Error al guardar la vacuna. Intente de nuevo.");
        }
    });

    let vaccines = [];
    let currentPage = 1;
    const perPage = 5;
    const tableBody = document.querySelector(".list");
    // const prevButton = document.getElementById("prevPage");
    // const nextButton = document.getElementById("nextPage");
    // const currentPageSpan = document.getElementById("currentPage");
    // const totalPagesSpan = document.getElementById("totalPages");
    
    async function fetchVaccines() {
        try {
            const response = await inventoryService.getVaccines();
            vaccines = response?.data || [];
            updatePagination();
            renderVaccinesTable();
        } catch (error) {
            console.error("Error al obtener vacunas:", error);
        }
    }
    

    function updatePagination() {
        const totalPages = Math.ceil(vaccines.length / perPage);
        totalPagesSpan.textContent = totalPages || 1;
        currentPageSpan.textContent = currentPage;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage >= totalPages || totalPages === 0;
    }

    function renderVaccinesTable() {
        tableBody.innerHTML = vaccines.length === 0
            ? `<tr><td colspan="7" class="text-center">No hay vacunas disponibles.</td></tr>`
            : vaccines.slice((currentPage - 1) * perPage, currentPage * perPage)
            .map(product => {
                return `
                    <tr class="table-row selectable-row">
                        <td class="align-middle ps-3">${product.name || "Sin nombre"}</td>
                        <td class="align-middle text-end">${product.stock || "N/A"}</td>
                        <td class="align-middle text-end">${formatDate(product.expiration_date)}</td>
                        <td class="text-end align-middle pe-3">
                            <button class="btn btn-sm btn-primary editar-producto" data-id="${product.id}">Editar</button>
                            <button class="btn btn-sm btn-danger eliminar-producto" data-id="${product.id}">Eliminar</button>
                        </td>
                    </tr>`;
            })
            
    }

    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            renderVaccinesTable();
        }
    });

    nextButton.addEventListener("click", () => {
        if (currentPage < Math.ceil(vaccines.length / perPage)) {
            currentPage++;
            updatePagination();
            renderVaccinesTable();
        }
    });

    tableBody.addEventListener("click", async (event) => {
        event.preventDefault();
        const target = event.target;
    
        if (target.classList.contains("eliminar-producto")) {
            const productId = target.dataset.id;
            if (!productId) return;
    
            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, eliminar",
                cancelButtonText: "Cancelar",
            });
    
            if (result.isConfirmed) {
                try {
                    await inventoryService.deleteProduct(productId);
                    await Swal.fire("¡Eliminado!", "La vacuna ha sido eliminada correctamente.", "success");
                    await fetchVaccines();
                } catch (error) {
                    console.error("Error al eliminar vacuna:", error);
                    await Swal.fire("Error", "Hubo un problema al eliminar la vacuna.", "error");
                }
            }
        }
    });

    await fetchVaccines();
});
