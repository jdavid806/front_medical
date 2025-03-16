async function generateInvoice(idCita, generarDescarga) {
  let url =
    obtenerRutaPrincipal() + `/medical/admissions/by-appointment/${idCita}`;

  try {
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "../funciones/CrearTicketFactura.php";
    form.target = "_blank";

    let inputRuta = document.createElement("input");
    inputRuta.type = "hidden";
    inputRuta.name = "rutaApi";
    inputRuta.value = url;
    form.appendChild(inputRuta);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error al generar la factura:", error);
  }
}
