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

