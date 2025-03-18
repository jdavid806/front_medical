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

      // console.log("debug", datosEmpresa);
      // Asignar los datos a los campos del formulario de Información General
      document.getElementById("id_Empresa").value = dataEmpresa.id;
      document.getElementById("nombre-consultorio").value = dataEmpresa.name;
      document.getElementById("tipoDocumento-consultorio").value =
        dataEmpresa.document_type;
      document.getElementById("documento-consultorio").value =
        dataEmpresa.document_number;

      // Asignar los datos del representante
      if (dataEmpresa.representative) {
        document.getElementById("representanteId").value =
          dataEmpresa.representative.id;
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
        document.getElementById("smtpId").value = dataEmpresa.communication.id;
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
          // nota del desarrollador sé que habra alguna mejor manera de ahcer esto pero tengo sueño XD
          switch (billing.type) {
            case "tax_invoice":
              document.getElementById("idFacturaFiscal").value = billing.id;
              document.getElementById("prefijoFiscal").value =
                billing.dian_prefix;
              document.getElementById("numeroResolucionFiscal").value =
                billing.resolution_number;
              document.getElementById("facturaDesdeFiscal").value =
                billing.invoice_from;
              document.getElementById("facturaHastaFiscal").value =
                billing.invoice_to;
              document.getElementById("fechaResolucionFiscal").value =
                billing.resolution_date;
              document.getElementById("fechaVencimientoFiscal").value =
                billing.expiration_date;
              break;
            case "consumer":
              document.getElementById("idFacturaConsumidor").value = billing.id;
              document.getElementById("prefijoConsumidor").value =
                billing.dian_prefix;
              document.getElementById("numeroResolucionConsumidor").value =
                billing.resolution_number;
              document.getElementById("facturaDesdeConsumidor").value =
                billing.invoice_from;
              document.getElementById("facturaHastaConsumidor").value =
                billing.invoice_to; // fechaVencimientoConsumidor
              document.getElementById("fechaResolucionConsumidor").value =
                billing.resolution_date;
              document.getElementById("fechaVencimientoConsumidor").value =
                billing.expiration_date;
              break;
            case "government_invoice":
              document.getElementById("idFacturaGubernamental").value =
                billing.id;
              document.getElementById("prefijoGubernamental").value =
                billing.dian_prefix;
              document.getElementById("numeroResolucionGubernamental").value =
                billing.resolution_number;
              document.getElementById("facturaDesdeGubernamental").value =
                billing.invoice_from;
              document.getElementById("facturaHastaGubernamental").value =
                billing.invoice_to;
              document.getElementById("fechaResolucionGubernamental").value =
                billing.resolution_date;
              document.getElementById("fechaVencimientoGubernamental").value =
                billing.expiration_date;
              break;
            case "credit_note":
              document.getElementById("idNotaCredito").value = billing.id;
              document.getElementById("prefijoNotaCredito").value =
                billing.dian_prefix;
              document.getElementById("numeroResolucionNotaCredito").value =
                billing.resolution_number;
              document.getElementById("facturaDesdeNotaCredito").value =
                billing.invoice_from;
              document.getElementById("facturaHastaNotaCredito").value =
                billing.invoice_to; // fechaVencimientoNotaCredito
              document.getElementById("fechaResolucionNotaCredito").value =
                billing.resolution_date;
              document.getElementById("fechaVencimientoNotaCredito").value =
                billing.expiration_date;
              break;
          }
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
  cargarDatosTenant();
}

async function updateRepresentante(representante) {
  let url = obtenerRutaRepresentante();
  actualizarDatos(url, representante);
  cargarDatosTenant();
}

function obtenerRutaRepresentante() {
  let idEmpresa = document.getElementById("id_Empresa").value;
  return (
    obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/representative`
  );
}

// Facturas
async function updateTipoFacturas(id, configFactura) {
  let url = obtenerRutaFacturas(id);
  actualizarDatos(url, configFactura);
  cargarDatosTenant();
}

async function createTipoFacturas(configFactura) {
  let url = obtenerRutaFacturas();
  guardarDatos(url, configFactura);
  cargarDatosTenant();
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
  cargarDatosTenant();
}

async function updateSmtp(smtpConfig) {
  let url = obtenerRutaComunciaciones();
  actualizarDatos(url, smtpConfig);
  cargarDatosTenant();
}

function obtenerRutaComunciaciones() {
  let idEmpresa = document.getElementById("id_Empresa").value;
  return (
    obtenerRutaPrincipal() + `/medical/companies/${idEmpresa}/communication`
  );
}
