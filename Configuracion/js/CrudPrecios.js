async function cargarContenido() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/admin/products";

  const attentionTypeMap = {
    PROCEDURE: "Procedimiento",
    CONSULTATION: "Consulta",
  };

  try {
    const response = await fetch(ruta);
    if (!response.ok) throw new Error("Error en la solicitud");

    const result = await response.json();
    const tablaPrecios = document.getElementById("tablaPrecios");
    tablaPrecios.innerHTML = "";

    for (const producto of result.data) {
      let elemento = producto.attributes;
      let attentionTypeTranslated =
        attentionTypeMap[elemento.attention_type] || "Desconocido";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="name">${elemento.name}</td>
        <td class="barcode">${elemento.barcode}</td>
        <td class="attentionType">${attentionTypeTranslated}</td>
        <td class="salePrice">${elemento.sale_price || "N/A"}</td>
        <td class="copayment">${elemento.copayment || "N/A"}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editarProducto(${
              producto.id
            }, 
            '${elemento.name}', '${elemento.barcode}', 
            '${elemento.attention_type}', '${elemento.sale_price}', 
            '${elemento.copayment}', '${elemento.tax_charge_id}')" 
            data-bs-toggle="modal" data-bs-target="#modalPrice">
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

    // Inicia la paginación con List.js
    new List("preciosTable", {
      valueNames: [
        "name",
        "barcode",
        "attentionType",
        "salePrice",
        "copayment",
      ],
      page: 5,
      pagination: true,
    });
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function eliminarPrecio(id) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/products/${id}`;
  EliminarDatos(url);
  cargarContenido();
}

async function updateProduct(id, productData) {
  let url = obtenerRutaPrincipal() + `/api/v1/admin/products/${id}`;
  actualizarDatos(url, productData);
  cargarContenido();
}

function editarProducto(
  id,
  name,
  barcode,
  attentionType,
  salePrice,
  copago,
  tax_charge_id
) {
  document.getElementById("name").value = name;
  document.getElementById("curp").value = barcode;
  document.getElementById("attention_type").value = attentionType;
  document.getElementById("sale_price").value = salePrice || "";
  document.getElementById("copago").value = copago || "";

  let taxSelect = document.getElementById("taxProduct_type");

  function setTaxValue() {
    if (
      [...taxSelect.options].some((option) => option.value == tax_charge_id)
    ) {
      taxSelect.value = tax_charge_id;
    }
  }

  if (taxSelect.options.length > 0) {
    setTaxValue();
  } else {
    setTimeout(setTaxValue, 500); // Esperar 500ms para que se carguen las opciones
  }

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
  guardarDatos(obtenerRutaPrincipal() + "/api/v1/admin/products", product);
  cargarContenido();
}

async function cargarSelectsPrecios() {
  let rutaEntidades = obtenerRutaPrincipal() + "/medical/entities";
  let rutaImpuestos = obtenerRutaPrincipal() + "/api/v1/admin/tax-charges";
  let rutaRetenciones =
    obtenerRutaPrincipal() + "/api/v1/admin/tax-withholdings";

  let entidades = await obtenerDatos(rutaEntidades);
  let impuestos = await obtenerDatos(rutaImpuestos);
  let retenciones = await obtenerDatos(rutaRetenciones);

  cargarSelect("entity-product", entidades.data, "Seleccione una entidad");
  cargarSelect("taxProduct_type", impuestos.data, "Seleccione un impuesto");
  cargarSelect("tax_type", impuestos.data, "Seleccione un impuesto");
  cargarSelect("retention_type", retenciones.data, "Seleccione una retención");
}
