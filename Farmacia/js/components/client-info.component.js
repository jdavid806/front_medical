import {formatDate, formatFullName, getStatusBadgeClass, getLoggedInUser } from "../services/utils.service.js";

export function updateClientInfo(patient) {
  const container = document.querySelector("#client-info");
  container.innerHTML = `
    <h6>Información del Cliente</h6>
    <div class="mb-3">
      <div class="fw-bold">${formatFullName(patient)}</div>
      <div>${patient.email || "Sin email"}</div>
      <div>${patient.whatsapp || "Sin whatsapp"}</div>
    </div>
  `;
}

export function updatePrescriberInfo(prescriber) {
  document.querySelector("#prescriber-name").textContent = 
    formatFullName(prescriber || {});
  document.querySelector("#prescriber-specialty").textContent = 
    prescriber?.specialty?.name || "Sin especialidad";
}



export function updateOrderHeaderInfo(recipe) {
  // Pedido
  const pedidoTitle = document.querySelector("#pedido-numero");
  const pedidoStatus = document.querySelector("#pedido-status"); 
  const pedidoDate = document.querySelector("#pedido-fecha"); 

  pedidoTitle.textContent = `Pedido #${recipe.id}`;

  const { class: badgeClass, label: statusLabel } = getStatusBadgeClass(recipe.status);
  pedidoStatus.className = `badge ${badgeClass} ms-2`;
  pedidoStatus.textContent = statusLabel;

  pedidoDate.textContent = `Creado: ${formatDate(recipe.created_at)}`;

  // Receta
  const recetaTitle = document.querySelector("#receta-numero"); // .fw-medium
  const recetaInfo = document.querySelector("#receta-info"); // .text-muted.small

  recetaTitle.textContent = `Receta #-${String(recipe.id).padStart(4, "0")}`;
  recetaInfo.textContent = `${formatFullName(recipe.prescriber)} - ${formatDate(recipe.created_at)}`;
}

export function updateVerifiedInfo() {
  const user = getLoggedInUser();
  const container = document.querySelector("#verificado-info");

  if (user && container) {
    const name = formatFullName(user);
    const now = formatDate(new Date()); // Usa tu formateador
    container.textContent = `Verificada por: ${name} - ${now}`;
  }
}