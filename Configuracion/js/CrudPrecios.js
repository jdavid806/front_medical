async function cargarContenido() {
  let ruta = "http://dev.medicalsoft.ai/api/v1/admin/products";

  // Mapeo de valores en inglés a español
  const attentionTypeMap = {
    PROCEDURE: "Procedimiento",
    CONSULTATION: "Consulta",
  };

  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const result = await response.json();

    const tablaPrecios = document.getElementById("tablaPrecios");

    tablaPrecios.innerHTML = "";

    for (const producto of result.data) {
      let elemento = producto.attributes;

      let attentionTypeTranslated =
        attentionTypeMap[elemento.attention_type] || "Desconocido";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${elemento.name}</td>
        <td>${elemento.barcode}</td> 
        <td>${attentionTypeTranslated}</td>
        <td>${elemento.sale_price || "N/A"}</td>
        <td>${elemento.copaiment || "N/A"}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarProducto(${
              producto.id
            }, '${elemento.name}', '${elemento.barcode}', '${
        elemento.attention_type
      }', '${elemento.sale_price}', '${
        elemento.copaiment
      }')" data-bs-toggle="modal" data-bs-target="#modalPrice">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="eliminarPrecio(${
              producto.id
            })">
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
  let url = `http://dev.medicalsoft.ai/api/v1/admin/products/${id}`;
  EliminarDatos(url);
  cargarContenido();
}

async function updateProduct(id, productData) {
  let url = `http://dev.medicalsoft.ai/api/v1/admin/products/${id}`;
  actualizarDatos(url, productData);
  cargarContenido();
}

function editarProducto(id, name, barcode, attentionType, salePrice, copago) {
  document.getElementById("name").value = name;
  document.getElementById("curp").value = barcode;
  document.getElementById("attention_type").value = attentionType;
  document.getElementById("sale_price").value = salePrice || "";
  document.getElementById("copago").value = copago || "";

  // Agregar un input oculto con el ID del producto
  let hiddenInput = document.getElementById("product_id");
  if (!hiddenInput) {
    hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.id = "product_id";
    hiddenInput.name = "product_id";
    document.getElementById("createProductForm").appendChild(hiddenInput);
  }
  hiddenInput.value = id;
}

async function createProduct(product) {
  try {
    const respuesta = await fetch(
      "http://dev.medicalsoft.ai/api/v1/admin/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      }
    );

    // if (!respuesta.ok) {
    //   throw new Error(`Error ${respuesta.status}: ${respuesta.statusText}`);
    // }

    console.log(respuesta);
    

    const resultado = await respuesta.json();

    Swal.fire({
      icon: "success",
      title: "¡Guardado exitosamente!",
      text: "Los datos se han guardado correctamente.",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      location.reload();
    });
    return resultado;
  } catch (error) {
    console.error("Error al guardar los datos:", error);

    Swal.fire({
      icon: "error",
      title: "Error al guardar",
      text: "Hubo un problema al guardar los datos.",
      confirmButtonText: "Aceptar",
    });

    return null;
  }
  cargarContenido();
}
