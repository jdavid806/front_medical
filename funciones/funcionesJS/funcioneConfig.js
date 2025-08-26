async function cargarQr(imagen) {
  const datosApi = await consultarDatosWhatssap("connect");

  const imgElement = document.getElementById("qrWhatsApp");

  if (!imgElement) {
    console.error("No se encontró el elemento con el ID especificado");
    return;
  }

  try {
    const response = await fetch(datosApi.apiInstance, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: datosApi.apiKey,
      },
    });

    const result = await response.json();

    if (result.base64) {
      imgElement.src = result.base64;
    }
  } catch (error) {
    console.error("Error al cargar el QR:", error);
  }
}

function cerrarModalWhatsapp() {
  $("#modalVerQr").modal("hide");
  setTimeout(() => consultarQR(), 1000);
}

async function consultarQR() {
  const goodIcon = document.getElementById("goodIcon");
  const badIcon = document.getElementById("badIcon");
  const modalButton = document.getElementById("modalButton");
  const actionButton = document.getElementById("actionButton");
  const createInstanceButton = document.getElementById("createInstanceButton");

  const modalVerQr = document.getElementById("modalVerQr");

  let status = await consultarWhatssapConectado();

  console.log("status", status);


  if (status == "CONECTADA") {
    if (modalVerQr.classList.contains("show")) {
      cerrarModalWhatsapp();
    } else {
      goodIcon.classList.remove("d-none");
      actionButton.classList.remove("d-none");

      badIcon.classList.add("d-none");
      modalButton.classList.add("d-none");
      createInstanceButton.classList.add("d-none")

      actionButton.onclick = () => cerrarPuerto();
    }
  } else if (status == "NO-CONECTADA") {
    badIcon.classList.remove("d-none");
    modalButton.classList.remove("d-none");

    goodIcon.classList.add("d-none");
    actionButton.classList.add("d-none");
    createInstanceButton.classList.add("d-none")

    cargarQr();
  } else if (status == "NO-CREADA") {
    console.log("no ta creada xdx");

    badIcon.classList.remove("d-none");
    createInstanceButton.classList.remove("d-none");

    goodIcon.classList.add("d-none");
    actionButton.classList.add("d-none");
    modalButton.classList.add("d-none")

    cargarQr();
  }
}

async function cerrarPuerto() {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Esta acción Desconectara la conexión.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, desconectar",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const datosApi = await consultarDatosWhatssap("logout");
        await fetch(datosApi.apiInstance, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            apikey: datosApi.apiKey,
          },
        });
        Swal.fire(
          "¡Desconectado exitosamente!",
          "La sesión se ha desconectado correctamente.",
          "success"
        ).then(() => {
          location.reload();
        });
      } catch (error) {
        console.error("Error al cerrar sesión:", error);
        Swal.fire(
          "Error",
          "No se pudo desconectar. Inténtalo de nuevo.",
          "error"
        );
      }
    }
  });
}
