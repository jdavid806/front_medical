async function cargarContenido() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/admin/products";

  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaPrecios = document.getElementById("tablaPrecios");
    for (const producto of result.data) {
      let elemento = producto.attributes;
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${elemento.name}</td>
        <td>${elemento.attention_type}</td>
        <td>${elemento.sale_price || "N/A"}</td>
         <td>
            <button class="btn btn-danger btn-sm" onclick="eliminarPrecio(${producto.id})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
      `;

      tablaPrecios.appendChild(row);
    }
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarPrecio(id) {
  try {
    const response = await fetch(
      `http://dev.medicalsoft.ai/api/v1/admin/products/${id}`,
      {
        method: "DELETE", // Método DELETE
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Verificamos si la respuesta es exitosa (código 2xx)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json(); // Si el servidor devuelve una respuesta JSON

    // Mostrar SweetAlert de éxito
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "El recurso se eliminó correctamente.",
      confirmButtonText: "Aceptar",
    });

    console.log("Recurso eliminado:", data);
  } catch (error) {
    console.error("Error al eliminar el recurso:", error);

    // Mostrar SweetAlert de error
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el recurso. Por favor, inténtalo de nuevo.",
      confirmButtonText: "Aceptar",
    });
  }
}
