async function cargarDatosTenant() {
  let ruta = obtenerRutaPrincipal() + "/medical/companies";
  try {
    const response = await fetch(ruta);
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    const datosEmpresa = await response.json();

    if (datosEmpresa && datosEmpresa.data) {
      let dataEmpresa = datosEmpresa.data[0];

      console.log("Debug");

      console.log(dataEmpresa);

      // Asignar los datos a los campos del formulario de Información General
      document.getElementById("id_Empresa").value = dataEmpresa.id;
      document.getElementById("nombre-consultorio").value = dataEmpresa.name;
      document.getElementById("tipoDocumento-consultorio").value =
        dataEmpresa.document_type;
      document.getElementById("documento-consultorio").value =
        dataEmpresa.document_number;

      // Asignar los datos del representante
      if (dataEmpresa.representative) {
        document.getElementById("nombre-representante").value =
          dataEmpresa.representative.name;
        document.getElementById("telefono-representante").value =
          dataEmpresa.representative.phone;
        document.getElementById("correo-representante").value =
          dataEmpresa.representative.email;
        document.getElementById("tipoDocumento-representante").value =
          dataEmpresa.representative.document_type;
        document.getElementById("documento-representante").value =
          dataEmpresa.representative.document_number;
      }

      // Asignar los datos a los campos del formulario de Contacto
      document.getElementById("telefono-consultorio").value = dataEmpresa.phone;
      document.getElementById("correo-consultorio").value = dataEmpresa.email;
      document.getElementById("direccion-consultorio").value =
        dataEmpresa.address;
      document.getElementById("pais-consultorio").value = dataEmpresa.country;
      document.getElementById("ciudad-consultorio").value = dataEmpresa.city;

      // Asignar los datos a los campos del formulario de Configuración SMTP
      if (dataEmpresa.communication) {
        document.getElementById("smtpServidor").value =
          dataEmpresa.communication.smtp_server;
        document.getElementById("smtpPuerto").value =
          dataEmpresa.communication.port;
        document.getElementById("smtpSeguridad").value =
          dataEmpresa.communication.security;
        document.getElementById("smtpUsuario").value =
          dataEmpresa.communication.email;
        document.getElementById("smtpClave").value =
          dataEmpresa.communication.password;
      }

      // Asignar los datos a los campos de Facturación (Fiscal, Consumidor, Gubernamental, Notas de Crédito)
      if (dataEmpresa.billings && dataEmpresa.billings.length > 0) {
        dataEmpresa.billings.forEach((billing) => {
          const formId = `form-${billing.type.toLowerCase()}`;
          document.querySelector(`#${formId} #prefijo${billing.type}`).value =
            billing.dian_prefix;
          document.querySelector(
            `#${formId} #numeroResolucion${billing.type}`
          ).value = billing.resolution_number;
          document.querySelector(
            `#${formId} #facturaDesde${billing.type}`
          ).value = billing.invoice_from;
          document.querySelector(
            `#${formId} #facturaHasta${billing.type}`
          ).value = billing.invoice_to;
          document.querySelector(
            `#${formId} #fechaResolucion${billing.type}`
          ).value = billing.resolution_date;
          document.querySelector(
            `#${formId} #fechaVencimiento${billing.type}`
          ).value = billing.expiration_date;
        });
      }

      // Asignar los datos a los campos de Sedes
      const tablaSedes = document.querySelector("#tablaSedes tbody");
      if (dataEmpresa.branches && dataEmpresa.branches.length > 0) {
        dataEmpresa.branches.forEach((branch, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${index + 1}</td>
            <td>${branch.name}</td>
            <td>${branch.email}</td>
            <td>${branch.whatsapp}</td>
            <td>${branch.address}</td>
            <td>${branch.city}</td>
            <td>${branch.representative ? branch.representative.name : ""}</td>
            <td>${branch.representative ? branch.representative.phone : ""}</td>
            <td>
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-danger">Eliminar</button>
            </td>
          `;
          tablaSedes.appendChild(row);
        });
      }
    } else {
      Swal.fire({
        title: "¡Atención!",
        text: "Debes crear el nombre del consultorio para continuar.",
        input: "text",
        inputPlaceholder: "Nombre del consultorio",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showCancelButton: false,
        confirmButtonText: "Guardar",
        inputValidator: (value) => {
          if (!value) {
            return "¡El nombre del consultorio es obligatorio!";
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          let dataEnvio = {
            name: result.value.trim(),
          };

          guardarDatos(ruta, dataEnvio);
        }
      });
    }
  } catch (error) {
    console.error("Error al cargar los datos del tenant:", error);
  }
}

async function createEmpresa(infoGeneral, representative) {
  let idEmpresa = document.getElementById("id_Empresa").value;
  let rutaCompanie = obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}`;
  let rutaRepresentante =
    obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/representative`;

  let datosEmpresa = await obtenerDatos(rutaCompanie);
  let datosRepresentante = await obtenerDatos(rutaRepresentante);

  if (datosEmpresa && datosEmpresa.data && datosEmpresa.data.id) {
    actualizarDatos(rutaCompanie, infoGeneral);
  } else {
    let dataEnvio = { name: infoGeneral.name };
    await guardarDatos(rutaCompanie, dataEnvio);
  }

  if (
    !datosRepresentante ||
    !datosRepresentante.data ||
    (Array.isArray(datosRepresentante.data) &&
      datosRepresentante.data.length === 0)
  ) {
    await guardarDatos(rutaRepresentante, representative);
  } else {
  }
}

// function capturarDatosInformacionGeneral() {
//   const datos = {
//     name: document.getElementById("nombre-consultorio").value,
//     representatives: [
//       {
//         name: document.getElementById("nombre-representante").value,
//         phone: document.getElementById("telefono-representante").value,
//         email: document.getElementById("correo-representante").value,
//         document_type: document.getElementById("tipoDocumento-representante")
//           .value,
//         document_number: document.getElementById("documento-representante")
//           .value,
//       },
//     ],
//     offices: [
//       {
//         name: "Main Office",
//         document_type: document.getElementById("tipoDocumento-consultorio")
//           .value,
//         document_number: document.getElementById("documento-consultorio").value,
//       },
//     ],
//     logo: document.getElementById("logo").files[0],
//     marcaAgua: document.getElementById("marcaAgua").files[0],
//   };
//   return datos;
// }

// function capturarDatosFacturacion() {
//   const datos = {
//     billing: {
//       dian_prefix: document.getElementById("prefijo").value,
//       resolution_number: document.getElementById("numeroResolucion").value,
//       invoice_from: document.getElementById("facturaDesde").value,
//       invoice_to: document.getElementById("facturaHasta").value,
//       resolution_date: document.getElementById("fechaResolucion").value,
//       expiration_date: document.getElementById("fechaVencimiento").value,
//     },
//   };
//   return datos;
// }

// function capturarDatosContacto() {
//   const datos = {
//     // contacts: [
//     //   {
//     //     type: WhatsApp,
//     //     value: document.getElementById("telefono-consultorio").value,
//     //     country: USA,
//     //     city: New York
//     //   }
//     // ],
//     // telefonoConsultorio: ,
//     // correoConsultorio: document.getElementById("correo-consultorio").value,
//     // direccionConsultorio: document.getElementById("direccion-consultorio")
//     //   .value,
//     // paisConsultorio: document.getElementById("pais-consultorio").value,
//     // ciudadConsultorio: document.getElementById("ciudad-consultorio").value,
//   };
//   return datos;
// }

// function capturarDatosSMTP() {
//   const datos = {
//     smtpServidor: document.getElementById("smtpServidor").value,
//     smtpPuerto: document.getElementById("smtpPuerto").value,
//     smtpSeguridad: document.getElementById("smtpSeguridad").value,
//     smtpUsuario: document.getElementById("smtpUsuario").value,
//     smtpClave: document.getElementById("smtpClave").value,
//   };
//   return datos;
// }
