async function cargarDatosTenant() {
  let ruta = obtenerRutaPrincipal() + "/api/v1/admin/payment-methods";
  console.log("cargando");

  // try {
  //   const response = await fetch(ruta);
  //   if (!response.ok) {
  //     throw new Error("Error en la solicitud");
  //   }
  //   const result = await response.json();

  //   const tablaMetodosPago = document.getElementById("tablaMetodosPago");

  //   tablaMetodosPago.innerHTML = "";

  //   for (const producto of result) {
  //     const row = document.createElement("tr");
  //     row.innerHTML = `
  //       <td>${producto.method}</td>
  //       <td>${producto.accounting_account}</td>
  //       <td>N/A</td>
  //       <td>${producto.description || "N/A"}</td>
  //       <td>
  //           <button class="btn btn-primary btn-sm" onclick="editarMetodo(${
  //             producto.id
  //           }, '${producto.method}', '${
  //       producto.accounting_account
  //     }', 'N/A', '${
  //       producto.description
  //     }')" data-bs-toggle="modal" data-bs-target="#crearMetodoPago">
  //               <i class="fa-solid fa-pen"></i>
  //           </button>
  //           <button class="btn btn-danger btn-sm" onclick="eliminarMetodo(${
  //             producto.id
  //           })">
  //               <i class="fa-solid fa-trash"></i>
  //           </button>
  //       </td>
  //     `;

  //     tablaMetodosPago.appendChild(row);
  //   }
  // } catch (error) {
  //   console.error("Hubo un problema con la solicitud:", error);
  // }
}

function capturarDatosInformacionGeneral() {
  // const datos = {
  //   nombreRepresentante: document.getElementById("nombre-representante").value,
  //   telefonoRepresentante: document.getElementById("telefono-representante")
  //     .value,
  //   correoRepresentante: document.getElementById("correo-representante").value,
  //   tipoDocumentoRepresentante: document.getElementById(
  //     "tipoDocumento-representante"
  //   ).value,
  //   documentoRepresentante: document.getElementById("documento-representante")
  //     .value,
  //   nombreConsultorio: document.getElementById("nombre-consultorio").value,
  //   tipoDocumentoConsultorio: document.getElementById(
  //     "tipoDocumento-consultorio"
  //   ).value,
  //   documentoConsultorio: document.getElementById("documento-consultorio")
  //     .value,
  //   logo: document.getElementById("logo").files[0], // Archivo de imagen
  //   marcaAgua: document.getElementById("marcaAgua").files[0], // Archivo de imagen
  // };
  return "probando data";
}

function capturarDatosInformacionGeneral() {
  const datos = {
    representatives: [capturarDatosRepresentante()],
    offices: [capturarDatosOficina()],
    billings: [
      capturarDatosFacturacionConsumidor(),
      capturarDatosFacturacionFiscal(),
      capturarDatosFacturacionGubernamental(),
      capturarDatosFacturacionCredito(),
    ],
    contacts: [capturarDatosContacto()],
    communication: capturarDatosSMTP(),
    branches: sedesArray, //Esta variable esta declarada en el archivo configuracion/modales/modalAgregarSede.php,
    // logo: document.getElementById('logo').files[0],
    // marcaAgua: document.getElementById('marcaAgua').files[0],
  };
  return datos;
}

function capturarDatosOficina() {
  const datos = {
    name: document.getElementById("nombre-consultorio").value,
    document_type: document.getElementById("tipoDocumento-consultorio").value,
    document_number: document.getElementById("documento-consultorio").value,
  };

  return datos;
}

function capturarDatosRepresentante() {
  const datos = {
    name: document.getElementById("nombre-representante").value,
    phone: document.getElementById("telefono-representante").value,
    email: document.getElementById("correo-representante").value,
    document_type: document.getElementById("tipoDocumento-representante").value,
    document_number: document.getElementById("documento-representante").value,
  };
  return datos;
}

function capturarDatosFacturacionConsumidor() {
  const datos = {
    dian_prefix: document.getElementById("prefijoConsumidor").value,
    resolution_number: document.getElementById("numeroResolucionConsumidor")
      .value,
    invoice_from: document.getElementById("facturaDesdeConsumidor").value,
    invoice_to: document.getElementById("facturaHastaConsumidor").value,
    type: 4,
    resolution_date: document.getElementById("fechaResolucionConsumidor").value,
    expiration_date: document.getElementById("fechaVencimientoConsumidor")
      .value,
  };
  return datos;
}

function capturarDatosFacturacionGubernamental() {
  const datos = {
    dian_prefix: document.getElementById("prefijoGubernamental").value,
    resolution_number: document.getElementById("numeroResolucionGubernamental")
      .value,
    invoice_from: document.getElementById("facturaDesdeGubernamental").value,
    invoice_to: document.getElementById("facturaHastaGubernamental").value,
    type: 1,
    resolution_date: document.getElementById("fechaResolucionGubernamental")
      .value,
    expiration_date: document.getElementById("fechaVencimientoGubernamental")
      .value,
  };
  return datos;
}

function capturarDatosFacturacionFiscal() {
  const datos = {
    dian_prefix: document.getElementById("prefijoFiscal").value,
    resolution_number: document.getElementById("numeroResolucionFiscal").value,
    invoice_from: document.getElementById("facturaDesdeFiscal").value,
    invoice_to: document.getElementById("facturaHastaFiscal").value,
    type: 2,
    resolution_date: document.getElementById("fechaResolucionFiscal").value,
    expiration_date: document.getElementById("fechaVencimientoFiscal").value,
  };
  return datos;
}

function capturarDatosFacturacionCredito() {
  const datos = {
    dian_prefix: document.getElementById("prefijoNotaCredito").value,
    resolution_number: document.getElementById("numeroResolucionNotaCredito")
      .value,
    invoice_from: document.getElementById("facturaDesdeNotaCredito").value,
    invoice_to: document.getElementById("facturaHastaNotaCredito").value,
    type: 3,
    resolution_date: document.getElementById("fechaResolucionNotaCredito")
      .value,
    expiration_date: document.getElementById("fechaVencimientoNotaCredito")
      .value,
  };
  return datos;
}

function capturarDatosContacto() {
  const datos = {
    type: "WhatsApp",
    value: document.getElementById("telefono-consultorio").value,
    country: document.getElementById("pais-consultorio").value,
    city: document.getElementById("ciudad-consultorio").value,
  };
  return datos;
}

function capturarDatosSMTP() {
  const datos = {
    smtpServidor: document.getElementById("smtpServidor").value,
    smtpPuerto: document.getElementById("smtpPuerto").value,
    smtpSeguridad: document.getElementById("smtpSeguridad").value,
    smtpUsuario: document.getElementById("smtpUsuario").value,
    smtpClave: document.getElementById("smtpClave").value,
  };
  return datos;
}
