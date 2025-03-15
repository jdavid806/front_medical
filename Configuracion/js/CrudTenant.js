async function cargarDatosTenant() {
  let ruta = obtenerRutaPrincipal() + "/medical/companies";
  try {
    const response = await fetch(ruta);
    const data = await response.json();

    // Asignar los datos a los campos del formulario de Información General
    document.getElementById("nombre-representante").value =
      data.representatives[0].name;
    document.getElementById("telefono-representante").value =
      data.representatives[0].phone;
    document.getElementById("correo-representante").value =
      data.representatives[0].email;
    document.getElementById("tipoDocumento-representante").value =
      data.representatives[0].document_type;
    document.getElementById("documento-representante").value =
      data.representatives[0].document_number;
    document.getElementById("nombre-consultorio").value = data.name;
    document.getElementById("tipoDocumento-consultorio").value =
      data.document_type;
    document.getElementById("documento-consultorio").value =
      data.document_number;

    // Asignar los datos a los campos del formulario de Contacto
    document.getElementById("telefono-consultorio").value = data.phone;
    document.getElementById("correo-consultorio").value = data.email;
    document.getElementById("direccion-consultorio").value = data.address;
    document.getElementById("pais-consultorio").value = data.country;
    document.getElementById("ciudad-consultorio").value = data.city;

    // Asignar los datos a los campos del formulario de Configuración SMTP
    document.getElementById("smtpServidor").value =
      data.communication.smtp_server;
    document.getElementById("smtpPuerto").value = data.communication.port;
    document.getElementById("smtpSeguridad").value =
      data.communication.security;
    document.getElementById("smtpUsuario").value = data.communication.email;
    document.getElementById("smtpClave").value = data.communication.password;

    // Asignar los datos a los campos de Facturación (Fiscal, Consumidor, Gubernamental, Notas de Crédito)
    data.billings.forEach((billing, index) => {
      const formId = `form-${billing.type.toLowerCase()}`;
      document.querySelector(`#${formId} #prefijo${billing.type}`).value =
        billing.dian_prefix;
      document.querySelector(
        `#${formId} #numeroResolucion${billing.type}`
      ).value = billing.resolution_number;
      document.querySelector(`#${formId} #facturaDesde${billing.type}`).value =
        billing.invoice_from;
      document.querySelector(`#${formId} #facturaHasta${billing.type}`).value =
        billing.invoice_to;
      document.querySelector(
        `#${formId} #fechaResolucion${billing.type}`
      ).value = billing.resolution_date;
      document.querySelector(
        `#${formId} #fechaVencimiento${billing.type}`
      ).value = billing.expiration_date;
    });

    // Asignar los datos a los campos de Sedes
    // const tablaSedes = document.querySelector("#tablaSedes tbody");
    // data.branches.forEach((branch, index) => {
    //   const row = document.createElement("tr");
    //   row.innerHTML = `
    //     <td>${index + 1}</td>
    //     <td>${branch.name}</td>
    //     <td>${branch.email}</td>
    //     <td>${branch.whatsapp}</td>
    //     <td>${branch.address}</td>
    //     <td>${branch.city}</td>
    //     <td>${branch.representatives[0].name}</td>
    //     <td>${branch.representatives[0].phone}</td>
    //     <td>
    //       <button class="btn btn-sm btn-primary">Editar</button>
    //       <button class="btn btn-sm btn-danger">Eliminar</button>
    //     </td>
    //   `;
    //   tablaSedes.appendChild(row);
    // });
  } catch (error) {
    console.error("Error al cargar los datos del tenant:", error);
  }
}

function generarJSONFinal() {
  const infoGeneral = {
    name: document.getElementById("nombre-consultorio").value,
    document_type: document.getElementById("tipoDocumento-consultorio").value,
    document_number: document.getElementById("documento-consultorio").value,
    logo: document.getElementById("logoPreview").src || "",
    watermark: document.getElementById("marcaAguaPreview").src || "",
    phone: document.getElementById("telefono-consultorio").value,
    email: document.getElementById("correo-consultorio").value,
    address: document.getElementById("direccion-consultorio").value,
    country: document.getElementById("pais-consultorio").value,
    city: document.getElementById("ciudad-consultorio").value,
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
    billings: [],
    communication: {
      smtp_server: document.getElementById("smtpServidor").value,
      port: document.getElementById("smtpPuerto").value,
      security: document.getElementById("smtpSeguridad").value,
      email: document.getElementById("smtpUsuario").value,
      password: document.getElementById("smtpClave").value,
    },
    branches: [],
  };

  // Agregar datos de facturación
  const tiposFacturacion = [
    "Fiscal",
    "Consumidor",
    "Gubernamental",
    "NotaCredito",
  ];
  tiposFacturacion.forEach((tipo) => {
    const formId = `form-${tipo.toLowerCase()}`;
    const form = document.getElementById(formId);
    if (form) {
      infoGeneral.billings.push({
        dian_prefix: document.querySelector(`#${formId} #prefijo${tipo}`).value,
        resolution_number: document.querySelector(
          `#${formId} #numeroResolucion${tipo}`
        ).value,
        invoice_from: document.querySelector(`#${formId} #facturaDesde${tipo}`)
          .value,
        invoice_to: document.querySelector(`#${formId} #facturaHasta${tipo}`)
          .value,
        type: tipo,
        resolution_date: document.querySelector(
          `#${formId} #fechaResolucion${tipo}`
        ).value,
        expiration_date: document.querySelector(
          `#${formId} #fechaVencimiento${tipo}`
        ).value,
      });
    }
  });

  // Agregar datos de sedes
  const filasSedes = document.querySelectorAll("#tablaSedes tbody tr");
  filasSedes.forEach((fila) => {
    const celdas = fila.querySelectorAll("td");
    infoGeneral.branches.push({
      name: celdas[1].textContent,
      email: celdas[2].textContent,
      whatsapp: celdas[3].textContent,
      address: celdas[4].textContent,
      city: celdas[5].textContent,
      representatives: [
        {
          name: celdas[6].textContent,
          phone: celdas[7].textContent,
        },
      ],
    });
  });

  return infoGeneral;
}

function handleForm(formId, callback) {
  const form = document.getElementById(formId);

  if (!form) {
    console.warn(`El formulario con ID ${formId} no existe en el DOM`);
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const formDataObject = {};

    formData.forEach((value, key) => {
      const newKey = key.replace(/-/g, "");
      formDataObject[newKey] = value;
    });

    try {
      if (callback) {
        await callback(formDataObject);
      }

      const jsonFinal = generarJSONFinal();

      let ruta = obtenerRutaPrincipal() + "/medical/companies";
      let datosEmpresa = await obtenerDatos(ruta);

      console.log("Debug");
      console.log("========================");

      console.log(datosEmpresa);

      // guardarDatos(ruta, jsonFinal);
      // const response = await fetch("/api/guardar-tenant", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(jsonFinal),
      // });

      // if (response.ok) {
      //   alert("Datos guardados correctamente");
      // } else {
      //   alert("Error al guardar los datos");
      // }

      form.reset();
    } catch (error) {
      console.error(`Error al procesar el formulario ${formId}:`, error);
      alert(`Error al procesar el formulario: ${error.message}`);
    }
  });
}

async function createEmpresa(data) {
  let ruta = obtenerRutaPrincipal() + "/medical/companies";

  let datosEmpresa = await obtenerDatos(ruta);

  if (
    datosEmpresa &&
    Array.isArray(datosEmpresa.data) &&
    datosEmpresa.data.length > 0
  ) {
    actualizarDatos(ruta, data);
  } else {
    let dataEnvio = {
      name: data.name,
      document_type: data.document_type,
      document_number: data.document_number,
    };
    guardarDatos(ruta, dataEnvio);
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
