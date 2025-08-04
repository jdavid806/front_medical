document.addEventListener("DOMContentLoaded", () => {
  const productTypeId = 4; // Medicamentos

  // 🔧 Funciones auxiliares
  const showError = (message = "Ocurrió un error inesperado") => {
    Swal.fire({ title: "Error", text: message, icon: "error" });
  };

  const showSuccess = (message) => {
    Swal.fire({ title: "Éxito", text: message, icon: "success" });
  };

  // 💾 Guardar (crear o editar)
  document.getElementById("medicineForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("productId").value;
    const medicamentoData = {
      name: document.getElementById("nombreMedicamento").value,
      code: document.getElementById("codigoMedicamento").value,
      laboratory: document.getElementById("laboratorioMedicamento").value,
      stock: Number(document.getElementById("stockMedicamento").value),
      purchase_price: Number(document.getElementById("precioCompraMedicamento").value),
      sale_price: Number(document.getElementById("precioVentaMedicamento").value),
      expiration_date: document.getElementById("fechaVencimientoMedicamento").value,
      lot: document.getElementById("loteMedicamento").value,
      weight: Number(document.getElementById("pesoMedicamento").value),
      capacity: Number(document.getElementById("capacidadMedicamento").value),
      image: document.getElementById("imagenMedicamento").value || null,
      product_type_id: productTypeId,
    };

    try {
      const url = id ? `/api/products/${id}` : "/api/products";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(medicamentoData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const msg = id ? "actualizado" : "creado";
      showSuccess(`Medicamento ${msg} correctamente`);

      bootstrap.Modal.getInstance(document.getElementById("medicineModal")).hide();
      fetchMedicines();
    } catch (error) {
      showError(error.message);
    }
  });
});
