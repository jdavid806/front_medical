import { farmaciaService } from "../services/api.service.js";
import { populateMedicationSelect } from './modals.component.js'; // ajusta el path si es necesario

let verifiedProducts = [];

export function renderMedicationTable(recipeItems) {
  const tableBody = document.querySelector(".table tbody");
  tableBody.innerHTML = "";

  if (recipeItems.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td colspan="5" class="text-center text-muted">No se han encontrado medicamentos en esta recetas</td>
    `;
    tableBody.appendChild(row);
    return;
  }

  recipeItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.medication} ${item.concentration}</td>
      <td>${item.quantity}</td>
      <td>$${(item.price || 0).toFixed(2)}</td>
      <td><span class="badge ${item.verified ? 'bg-success' : 'bg-secondary'}">
        ${item.verified ? 'Verificado' : 'Pendiente'}
      </span></td>
      <td>
        ${item.verified ? '' : `
          <button class="btn btn-sm btn-primary btn-verificar"
            data-id="${item.id}" 
            data-name="${item.medication}" 
            data-concentration="${item.concentration}">
            <i class="fas fa-check"></i> Verificar
          </button>
        `}
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  setupVerificationButtons();
}

function setupVerificationButtons() {
  document.querySelectorAll(".btn-verificar").forEach(button => {
    button.addEventListener("click", async () => {
      const name = button.getAttribute("data-name");
      const concentration = button.getAttribute("data-concentration");

      try {
        const result = await farmaciaService.searchProducts(name, concentration);

        if (result.data?.length > 0) {
          const product = result.data[0];
          const salePrice = product.attributes.sale_price;

          // Guardar en el arreglo de productos verificados
          verifiedProducts.push({
            id: product.id,
            name: product.attributes.name,
            price: salePrice
          });

          // Cambiar estado del botón
          button.innerHTML = '<i class="fas fa-check"></i>';
          button.classList.remove("btn-primary");
          button.classList.add("btn-outline-primary");
          button.disabled = true;

          // Actualizar badge
          const row = button.closest("tr");
          const badge = row.querySelector(".badge");
          badge.className = "badge bg-success";
          badge.textContent = "Verificado";

          // Actualizar precio en la celda
          const priceCell = row.querySelector("td:nth-child(3)");
          priceCell.textContent = salePrice.toFixed(2);
        } else {
          // Producto no encontrado, mostrar alerta con SweetAlert2
          const swalResult = await Swal.fire({
            title: 'Producto no encontrado',
            text: '¿Deseas buscar el producto manualmente?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, buscar manualmente',
            cancelButtonText: 'Cancelar'
          });

          if (swalResult.isConfirmed) {
        
            window.buttonToUpdate = button;
          
    
            const modal = new bootstrap.Modal(document.getElementById('verificationModal'));
          
            document.getElementById('medicamentoNombre').textContent = name;
            document.getElementById('medicamentoDescripcion').textContent = concentration;
          
            await populateMedicationSelect();
            modal.show();
          }
        }
      } catch (error) {
        console.error("Error verificando producto:", error);
        Swal.fire('Error', 'Ocurrió un error al verificar el producto.', 'error');
      }
    });
  });
}


export function getVerifiedProducts() {
  return verifiedProducts;
}