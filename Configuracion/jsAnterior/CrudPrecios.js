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
        <td>${elemento.price_entity || "N/A"}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarProducto(${
              producto.id
            }, '${elemento.name}', '${elemento.barcode}', '${
        elemento.attention_type
      }', '${elemento.sale_price}', '${
        elemento.price_entity
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
  cargarContenido()
}

async function updateProduct(id, productData) {
  let url = `http://dev.medicalsoft.ai/api/v1/admin/products/${id}`;
  actualizarDatos(url, productData);
  cargarContenido()
}

function editarProducto(
  id,
  name,
  barcode,
  attentionType,
  salePrice,
  priceEntity
) {
  document.getElementById("name").value = name;
  document.getElementById("curp").value = barcode;
  document.getElementById("attention_type").value = attentionType;
  document.getElementById("sale_price").value = salePrice || "";
  document.getElementById("price_entity").value = priceEntity || "";

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
