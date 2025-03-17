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

// async function createEmpresa(infoGeneral, representative) {
//   let rutaRepresentante =
//     obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/representative`;

//   let datosEmpresa = await obtenerDatos(rutaCompanie);
//   let datosRepresentante = await obtenerDatos(rutaRepresentante);

//   if (datosEmpresa && datosEmpresa.data && datosEmpresa.data.id) {
//     actualizarDatos(rutaCompanie, infoGeneral);
//   } else {
//     let dataEnvio = { name: infoGeneral.name };
//     await guardarDatos(rutaCompanie, dataEnvio);
//   }

//   if (
//     !datosRepresentante ||
//     !datosRepresentante.data ||
//     (Array.isArray(datosRepresentante.data) &&
//       datosRepresentante.data.length === 0)
//   ) {
//     await guardarDatos(rutaRepresentante, representative);
//   } else {
//   }
// }

async function updateEmpresa(infoGeneral) {
  let idEmpresa = document.getElementById("id_Empresa").value;
  let rutaCompanie = obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}`;
  actualizarDatos(rutaCompanie, infoGeneral);
}

// Representante
async function createRepresentante(representante) {
  let url = obtenerRutaRepresentante();
  guardarDatos(url, representante);
}

async function updateRepresentante(representante) {
  let url = obtenerRutaRepresentante();
  actualizarDatos(url, representante);
}

async function consultarRepresentanteExiste() {
  let url = obtenerRutaRepresentante();
  let datosRepresentante = await obtenerDatos(url);
  if (datosRepresentante == null) {
    return false;
  }
  return true;
}

function obtenerRutaRepresentante() {
  let idEmpresa = document.getElementById("id_Empresa").value;
  return (
    obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/representative`
  );
}

// Facturas
async function updateTipoFacturas(configFactura) {
  let url = obtenerRutaFacturas(id);
  actualizarDatos(url, configFactura);
}

async function createTipoFacturas(configFactura) {
  let url = obtenerRutaFacturas();
  guardarDatos(url, configFactura);
}

function consultarConfigFacturaExiste() {
  let url = obtenerRutaFacturas(id);
  let data = obtenerDatos(url);
  console.log(data);
}

function obtenerRutaFacturas(id) {
  let idEmpresa = document.getElementById("id_Empresa").value;
  if (id != null) {
    return (
      obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/billings/${id}`
    );
  }
  return obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/billings`;
}

// smtp
async function createSmtp(smtpConfig) {
  let url = obtenerRutaComunciaciones();
  guardarDatos(url, smtpConfig);
}

async function updateSmtp(smtpConfig) {
  let url = obtenerRutaComunciaciones();
  actualizarDatos(url, smtpConfig);
}

async function consultarSmtpExiste() {
  let url = obtenerRutaComunciaciones();
  try {
    let datosSmtp = await obtenerDatos(url);
    console.log(datosSmtp);
    return false;
  } catch (error) {
    return true;
  }
}

function obtenerRutaComunciaciones() {
  let idEmpresa = document.getElementById("id_Empresa").value;
  return (
    obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/communication`
  );
}
