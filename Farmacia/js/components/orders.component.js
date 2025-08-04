import { formatFullName, formatDate, getStatusBadgeClass } from "../services/utils.service.js";

let allRecipes = [];

export function renderOrderList(recipes, onRecipeSelect) {
  allRecipes = recipes;
  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";

  recipes.forEach(recipe => {
    const { class: badgeClass, label: statusLabel } = getStatusBadgeClass(recipe.status);
    
    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item", "p-3", "border-bottom");
    orderItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h6>Receta #${recipe.id}</h6>
          <span class="badge ${badgeClass}">${statusLabel}</span>
          <div>Paciente: ${formatFullName(recipe.patient)}</div>
        </div>
        <div>${formatDate(recipe.created_at)}</div>
      </div>
    `;

    orderItem.addEventListener("click", () => {
      verifiedProducts.length = 0;  // Limpiar productos verificados al seleccionar nueva receta
      onRecipeSelect(recipe);
    });

    orderList.appendChild(orderItem);
  });
}


export function setupFilterDropdown() {
  const filterDropdownItems = document.querySelectorAll('.dropdown-item');
  
  filterDropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const status = item.getAttribute('data-status');
      
      const filteredRecipes = status === 'ALL' 
        ? allRecipes 
        : allRecipes.filter(recipe => recipe.status === status);
      
      // Esta función debería ser provista por el main.js
      window.filterRecipes(filteredRecipes);
    });
  });
}

