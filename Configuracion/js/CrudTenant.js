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
  const datos = {
    name: document.getElementById("nombre-consultorio").value,
    representatives: [
      {
        name: document.getElementById("nombre-representante").value,
        phone: document.getElementById("telefono-representante").value,
        email: document.getElementById("correo-representante").value,
        document_type: document.getElementById("tipoDocumento-representante")
          .value,
        document_number: document.getElementById("documento-representante")
          .value,
      },
    ],
    offices: [
      {
        name: "Main Office",
        document_type: document.getElementById("tipoDocumento-consultorio")
          .value,
        document_number: document.getElementById("documento-consultorio").value,
      },
    ],
    logo: document.getElementById("logo").files[0],
    marcaAgua: document.getElementById("marcaAgua").files[0],
  };
  return datos;
}

function capturarDatosFacturacion() {
  const datos = {
    billing: {
      dian_prefix: document.getElementById("prefijo").value,
      resolution_number: document.getElementById("numeroResolucion").value,
      invoice_from: document.getElementById("facturaDesde").value,
      invoice_to: document.getElementById("facturaHasta").value,
      resolution_date: document.getElementById("fechaResolucion").value,
      expiration_date: document.getElementById("fechaVencimiento").value,
    },
  };
  return datos;
}

function capturarDatosContacto() {
  const datos = {
    // contacts: [
    //   {
    //     type: WhatsApp,
    //     value: document.getElementById("telefono-consultorio").value,
    //     country: USA,
    //     city: New York
    //   }
    // ],
    // telefonoConsultorio: ,
    // correoConsultorio: document.getElementById("correo-consultorio").value,
    // direccionConsultorio: document.getElementById("direccion-consultorio")
    //   .value,
    // paisConsultorio: document.getElementById("pais-consultorio").value,
    // ciudadConsultorio: document.getElementById("ciudad-consultorio").value,
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
