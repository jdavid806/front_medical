async function generarFatura(factura, generarDescarga) {
  try {
    // Crear un formulario oculto
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "../funciones/CrearFactura.php";
    form.target = "_blank";

    // Convertir datos a inputs ocultos (evita JSON)
    // Object.keys(datos).forEach((key) => {
    //   let input = document.createElement("input");
    //   input.type = "hidden";
    //   input.name = key;
    //   input.value =
    //     typeof datos[key] === "object"
    //       ? JSON.stringify(datos[key])
    //       : datos[key];
    //   form.appendChild(input);
    // });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

async function generarTicketFatura(factura, generarDescarga) {
  console.log(factura);
  try {
    // Crear un formulario oculto
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "../funciones/CrearTicketFactura.php";
    form.target = "_blank";

    // Convertir datos a inputs ocultos (evita JSON)
    // Object.keys(datos).forEach((key) => {
    //   let input = document.createElement("input");
    //   input.type = "hidden";
    //   input.name = key;
    //   input.value =
    //     typeof datos[key] === "object"
    //       ? JSON.stringify(datos[key])
    //       : datos[key];
    //   form.appendChild(input);
    // });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

async function generateInvoice(idCita, generarDescarga) {
  console.log("======================");
  console.log("dEBUG");
  console.log(idCita);
  console.log("======================");
  // generarFatura(factura, false);
}
