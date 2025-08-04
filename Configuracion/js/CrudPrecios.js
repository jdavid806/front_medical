let listInstance;
let preciosEntidades = [];

function agregarFilaEntidad() {
  let entidadId = document.getElementById("entity-product").value;
  let entidadNombre = document.getElementById("entity-product").selectedOptions[0].text;

  let precio = document.getElementById("entity-product_price").value;

  let impuestoId = document.getElementById("tax_type").value;
  let impuestoNombre = document.getElementById("tax_type").selectedOptions[0]?.text || "N/A";

  let retencionId = document.getElementById("retention_type").value;
  let retencionNombre = document.getElementById("retention_type").selectedOptions[0]?.text || "N/A";

  preciosEntidades.push({
    entity_id: entidadId,
    price: precio,
    tax_charge_id: impuestoId,
    withholding_tax_id: retencionId,
  });

  let tabla = document.getElementById("tablaPreciosEntidades");
  let fila = `<tr>
                    <td>${entidadNombre}</td>
                    <td>${precio}</td>
                    <td>${impuestoNombre}</td>
                    <td>${retencionNombre}</td>
                    <td>
                        <button type='button' class='btn btn-danger btn-sm' onclick='eliminarFilaEntidad(${preciosEntidades.length - 1})'>
                            Eliminar
                        </button>
                    </td>
                </tr>`;

  tabla.innerHTML += fila;

  // Limpiar los campos después de agregar la fila
  document.getElementById("entity-product_price").value = "";
  document.getElementById("tax_type").value = "";
  document.getElementById("retention_type").value = "";
}

function eliminarFilaEntidad(index) {
  preciosEntidades.splice(index, 1);
  document.getElementById("tablaPreciosEntidades").deleteRow(index);
}

async function cargarContenido() {
  const ruta = obtenerRutaPrincipal() + "/api/v1/admin/products/servicios";

  const attentionTypeMap = {
    PROCEDURE: "Procedimiento",
    CONSULTATION: "Consulta",
    LABORATORY: "Laboratorio",
  };

  try {
    const response = await fetch(ruta);
    if (!response.ok) throw new Error("Error en la solicitud");

    const result = await response.json();
    const tablaPrecios = document.getElementById("tablaPrecios");

    // Agrega animación de salida
    tablaPrecios.classList.add("fade-out");

    setTimeout(() => {
      tablaPrecios.innerHTML = "";

      // Verifica si hay productos, si no, muestra una fila de "sin datos"
      if (result.length === 0) {
        tablaPrecios.innerHTML = `
          <tr>
            <td colspan="6" class="text-center">No hay productos disponibles</td>
          </tr>`;
      } else {
        for (const producto of result) {
          let attentionTypeTranslated =
            attentionTypeMap[producto.attention_type] || "Desconocido";

          const row = document.createElement("tr");
          row.innerHTML = `
            <td class="name">${producto.name}</td>
            <td class="barcode">${producto.barcode}</td>
            <td class="attentionType">${attentionTypeTranslated}</td>
            <td class="salePrice">${producto.sale_price || "N/A"}</td>
            <td class="copayment">${producto.copayment || "N/A"}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editarProducto(${producto.id
            })" 
                data-bs-toggle="modal" data-bs-target="#modalPrice">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-danger btn-sm" onclick="eliminarPrecio(${producto.id
            })">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
          `;
          tablaPrecios.appendChild(row);
        }
      }

      // Destruye cualquier instancia previa de List.js (si existe)
      if (listInstance && typeof listInstance.destroy === "function") {
        listInstance.destroy();
      }

      // Crea una nueva instancia de List.js
      listInstance = new List("preciosTable", {
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

      listInstance.update();

      // Agrega clase para animación de entrada
      tablaPrecios.classList.remove("fade-out");
      tablaPrecios.classList.add("fade-in");
    }, 300); // Espera 300ms para la animación de salida
  } catch (error) {
    console.error("Hubo un problema con la solicitud:", error);
  }
}

async function cargarEntidadesCrudPrecios(entidadesProducto) {
  preciosEntidades = [];

  let rutaEntidades = obtenerRutaPrincipal() + "/medical/entities";

  try {
    const responseEntidades = await fetch(rutaEntidades);
    if (!responseEntidades.ok) throw new Error("Error en la solicitud");

    const entidades = await responseEntidades.json();

    entidadesProducto.forEach((entidad) => {
      let entidadId = entidad.entity_id;
      let entidadNombre = entidades.data.find((e) => e.id == entidad.entity_id).name || "N/A";
      let impuestoId = entidad.tax_charge_id;
      let retencionId = entidad.withholding_tax_id;

      let precio = entidad.price;

      let impuestoNombre = entidad.tax_charge?.name || "N/A";
      let retencionNombre = entidad.withholding_tax?.name || "N/A";

      preciosEntidades.push({
        entity_id: entidadId,
        price: precio,
        tax_charge_id: impuestoId,
        withholding_tax_id: retencionId,
      });

      let tabla = document.getElementById("tablaPreciosEntidades");
      let fila = `<tr>
                  <td>${entidadNombre}</td>
                  <td>${precio}</td>
                  <td>${impuestoNombre}</td>
                  <td>${retencionNombre}</td>
                  <td>
                      <button type='button' class='btn btn-danger btn-sm' onclick='eliminarFilaEntidad(${preciosEntidades.length - 1
        })'>
                          Eliminar
                      </button>
                  </td>
              </tr>`;

      tabla.innerHTML += fila;
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
  //const ruta = obtenerRutaPrincipal() + `api/v1/admin/products/${id}/update-with-entities`;

  actualizarDatos(url, productData);
  cargarContenido();
}

async function createProduct(product) {
  try {
    let url = obtenerRutaPrincipal() + `/api/v1/admin/product-create-entities`;
    await guardarDatos(url, product);
  } catch (error) {
    throw error;
  }
}

async function editarProducto(id) {
  //const ruta = obtenerRutaPrincipal() + `/api/v1/admin/products/${id}`;
  const ruta =
    obtenerRutaPrincipal() + `api/v1/admin/products/${id}/update-with-entities`;
  const rutaProducts = obtenerRutaPrincipal() + `/api/v1/admin/products/${id}`;

  let producto = await obtenerDatos(rutaProducts);

  if (!producto) {
    console.error("Error: No se pudo obtener el producto.");
    return;
  }

  let tabla = document.getElementById("tablaPreciosEntidades");
  tabla.innerHTML = "";

  cargarEntidadesCrudPrecios(producto.entities);

  if (producto.attention_type === "LABORATORY") {
    document.getElementById("priceSection").style.display = "none";
    document.getElementById("copagoSection").style.display = "none";
    document.getElementById("purchasePriceSection").style.display = "none";
    document.getElementById("toggleEntitiesSection").style.display = "none";
    document.getElementById("toggleImpuestoSection").style.display = "none";
  } else {
    document.getElementById("priceSection").style.display = "block";
    document.getElementById("copagoSection").style.display = "block";
    document.getElementById("purchasePriceSection").style.display = "block";
    document.getElementById("toggleEntitiesSection").style.display = "block";
    document.getElementById("toggleImpuestoSection").style.display = "block";
  }

  if (producto.entities.length > 0) {
    document.getElementById("toggleEntities").checked = true;
    document.getElementById("entity-productSection").style.display = "block";
  }

  document.getElementById("name").value = producto.name || "";
  document.getElementById("curp").value = producto.barcode || "";
  document.getElementById("attention_type").value = producto.attention_type || "";
  document.getElementById("sale_price").value = producto.sale_price || "";
  document.getElementById("copago").value = producto.copayment || "";
  document.getElementById("purchase_price").value = producto.purchase_price || "";
  // document.getElementById("tax_charge_id").value = producto.tax_charge.id || "";

  const examTypeSection = document.getElementById("examTypeSection");
  const examTypeElement = document.getElementById("exam_type_id");
  const examTypeIdValue = producto.exam_type_id || "";

  examTypeSection.style.display =
    producto.attention_type === "PROCEDURE" ? "block" : "none";

  if (examTypeElement.choicesInstance) {
    examTypeElement.choicesInstance.setChoiceByValue(+examTypeIdValue);
  } else {
    examTypeElement.value = +examTypeIdValue;
  }

  // Control del input oculto
  let hiddenInput =
    document.getElementById("product_id") ||
    (() => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.id = "product_id";
      input.name = "product_id";
      document.getElementById("createProductForm").appendChild(input);
      return input;
    })();

  hiddenInput.value = id;
}

async function cargarSelectsPrecios() {
  let rutaEntidades = obtenerRutaPrincipal() + "/medical/entities";
  let rutaImpuestos = obtenerRutaPrincipal() + "/api/v1/admin/tax-charges";
  let rutaRetenciones =
    obtenerRutaPrincipal() + "/api/v1/admin/tax-withholdings";
  let rutaExamenes = obtenerRutaPrincipal() + "/medical/exam-types";

  let entidades = await obtenerDatos(rutaEntidades);
  let impuestos = await obtenerDatos(rutaImpuestos);
  let retenciones = await obtenerDatos(rutaRetenciones);
  let examenes = await obtenerDatos(rutaExamenes);

  cargarSelect("entity-product", entidades.data, "Seleccione una entidad");
  cargarSelect("taxProduct_type", impuestos.data, "Seleccione un impuesto");
  cargarSelect("tax_type", impuestos.data, "Seleccione un impuesto");
  cargarSelect("retention_type", retenciones.data, "Seleccione una retención");
  cargarSelect("exam_type_id", examenes, "Seleccione un examen");
}
