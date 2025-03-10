async function crearDocumento(
  objecto,
  tipoDocumento,
  nombreObjecto,
  tipoImpresion,
  titulo
) {
  // Objeto con los datos
  const datosFormato = await generarFormato(objecto, nombreObjecto);

  //nota si lees esto y no sabes que hace los ... esto lo que ahce es expandir los datos que
  // retorno del array de generarForamto asi de esta manera nos evitamos crear funciones con
  // miles de parametos c;
  const datos = {
    titulo,
    ...datosFormato,
    tipoImpresion,
    tipoDocumento,
  };

  try {
    // Crear un formulario oculto
    let form = document.createElement("form");
    form.method = "POST";
    form.action = "../funciones/CrearDocumento.php";
    form.target = "_blank";

    // Convertir datos a inputs ocultos (evita JSON)
    Object.keys(datos).forEach((key) => {
      let input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value =
        typeof datos[key] === "object"
          ? JSON.stringify(datos[key])
          : datos[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
}
