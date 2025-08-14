import { farmaciaService } from "./services/api.service.js";
import {
  renderOrderList,
  setupFilterDropdown,
} from "./components/orders.component.js";
import {
  renderMedicationTable,
  getVerifiedProducts,
} from "./components/medication.component.js";
import {
  updateClientInfo,
  updatePrescriberInfo,
  updateOrderHeaderInfo,
  updateVerifiedInfo,
} from "./components/client-info.component.js";
import {
  setupDeliveryModal,
  renderRecipeModalContent,
  renderReceiptModal,
} from "./components/modals.component.js";

// Variables globales
window.allRecipes = [];
window.currentRecipe = null;
window.verifiedProducts = window.verifiedProducts || [];
window.getVerifiedProducts = function () {
  return window.verifiedProducts;
};

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await farmaciaService.getAllRecipes("PENDING");

    window.allRecipes = Array.isArray(response)
      ? response
      : response?.data || [];

    renderOrderList(window.allRecipes, (recipe) => {
      const items = Array.isArray(recipe.recipe_items)
        ? recipe.recipe_items
        : [];

      window.currentRecipe = recipe;
      updateClientInfo(recipe.patient);
      renderMedicationTable(items);
      updatePrescriberInfo(recipe.prescriber);
      updateOrderHeaderInfo(recipe);
      renderRecipeModalContent(items, recipe.patient, recipe.prescriber);
    });

    updateVerifiedInfo();
    setupFilterDropdown();

    setupDeliveryModal();
  } catch (error) {
    console.error("Error inicializando:", error);
  }

  document.getElementById("btnVerReceta").addEventListener("click", () => {
    const recipe = window.currentRecipe;
    if (!recipe) {
      alert("Primero selecciona una receta.");
      return;
    }

    renderRecipeModalContent(
      recipe.recipe_items,
      recipe.patient,
      recipe.prescriber,
      recipe
    );

    const modal = new bootstrap.Modal(document.getElementById("modalReceta"));
    modal.show();
  });

  document.getElementById("viewReceiptBtn").addEventListener("click", () => {
    const recipe = window.currentRecipe;

    if (!recipe) {
      alert("Primero selecciona una receta.");
      return;
    }

    renderReceiptModal(recipe);

    const receiptModal = new bootstrap.Modal(
      document.getElementById("receiptModal")
    );
    receiptModal.show();
  });

  const searchOrder = document.getElementById("searchOrder");
  searchOrder.addEventListener("keyup", function () {
    const searchTerm = this.value.toLowerCase();
    const orderItems = document.querySelectorAll(".order-item");

    orderItems.forEach((item) => {
      const orderNumber =
        item.querySelector("h6")?.textContent.toLowerCase() || "";
      const patientText =
        item.querySelector("div div")?.textContent.toLowerCase() || ""; // ese div contiene "Paciente: Juan Pérez"

      if (
        orderNumber.includes(searchTerm) ||
        patientText.includes(searchTerm)
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });
  });
});

// Función para filtrar (usada por el dropdown)
window.filterRecipes = (filteredRecipes) => {
  renderOrderList(filteredRecipes, (recipe) => {
    window.currentRecipe = recipe;

    const items = Array.isArray(recipe.recipe_items)
      ? recipe.recipe_items
      : [];

    updateClientInfo(recipe.patient);
    renderMedicationTable(items);
    updatePrescriberInfo(recipe.prescriber);
    updateOrderHeaderInfo(recipe);
    renderRecipeModalContent(items, recipe.patient, recipe.prescriber);
  });
};
