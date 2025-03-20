async function enviarDocumento(
  objecto,
  tipoDocumento,
  nombreObjecto,
  tipoImpresion,
  patient_id,
  user_id,
  titulo
) {
  const datosFormato = await generarFormato(objecto, nombreObjecto);

  const formData = new FormData();
  formData.append("titulo", "Incapacidad Médica");
  formData.append("consultorio", JSON.stringify(datosFormato.consultorio)); // Enviar como JSON
  formData.append("paciente", JSON.stringify(datosFormato.paciente));
  formData.append("doctor", JSON.stringify(datosFormato.doctor));
  formData.append("tipoImpresion", tipoImpresion);
  formData.append("tipoDocumento", tipoDocumento);

  try {
    let response = await fetch("../funciones/CrearDocumentoTemporal.php", {
      method: "POST",
      body: formData,
    });

    let resultado = await response.json();

    if (resultado.ruta) {
      enviarDocumentoConvertido(
        resultado.ruta,
        patient_id,
        titulo,
        nombreObjecto,
        objecto.id
      );
    } else {
      console.error("No se generó el documento correctamente");
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}

async function sendInvoice(idCita, patient_id) {
  let rutaPdf = await generarFacturaTemporal(idCita);
  if (rutaPdf != null) {
    const datosPaciente = await consultarDatosEnvioPaciente(patient_id);

    let numero_paciente = datosPaciente.telefono;

    let rutaFinal = reemplazarRuta(rutaPdf);

    const datosMensaje = {
      tenant_id: "1", // esto lo peuden mandar quemado la verad lo pedi porque no sabia como funcionaba la base XD
      type: "whatsapp",
      belongs_to: "facturacion-compartir",
    };

    let template = await obtenerTemplate(datosMensaje);

    let facturaId = await obtenerFacturaIdByCitaId(idCita);

    let mensaje = await convertirDatosVariables(
      template,
      "Factura",
      patient_id,
      facturaId
    );

    let mensajeFinal = convertirHtmlAWhatsapp(mensaje);

    enviarAnexo(mensajeFinal, numero_paciente, rutaFinal, "Factura");
  }
}
