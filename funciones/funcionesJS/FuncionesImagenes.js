async function getFileUrl(file_id) {
  let url = obtenerRutaPrincipal() + `/api/v1/files/${file_id}/view`;
  try {
    let datosImagen = await obtenerDatos(url);
    return datosImagen.file_url;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log("La imagen no existe (404).");
    } else {
      console.error("Ocurrió un error al cargar la imagen:", error);
    }
  }
}

function getUrlImage(minioUrl, withProtocol = false) {

  const host = window.location.hostname.replace(/\./g, "-");
  const scheme = window.location.protocol;

  return `${scheme}//${window.location.hostname}/bucket/${host}/${minioUrl}`;
}

async function guardarArchivo(formData, returnFullData = false) {
  let tenant = obtenerTenant();
  formData.append("tenant_id", tenant);

  try {
    let url = obtenerRutaPrincipal() + `/api/v1/files/`;
    let response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    let result = await response.json();

    if (!returnFullData) {
      return result.file.file_url;
    } else {
      return result;
    }
  } catch (error) {
    console.error("Error en la subida del archivo:", error);
  }
}

async function guardarArchivoUsuario(id_input, user_id) {
  let fileInput = document.getElementById(id_input);
  let file = fileInput.files[0];

  if (!file) {
    return;
  }

  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\User");
  formData.append("model_id", user_id);
  return guardarArchivo(formData);
}

async function guardarArchivoPaciente(id_input, patient_id, file = null) {
  let fileToStore = file;
  if (!fileToStore) {
    fileToStore = document.getElementById(id_input).files[0];
  }
  if (!file) {
    return;
  }
  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\Patient");
  formData.append("model_id", patient_id);
  return guardarArchivo(formData);
}

async function guardarArchivoExamen(id_input, examen_id) {
  let fileInput = document.getElementById(id_input);
  let file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor seleccione un archivo antes de continuar.",
    });
    return;
  }

  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\ExamOrder");
  formData.append("model_id", examen_id);
  return guardarArchivo(formData);
}

async function guardarArchivoClinico(id_input, record_id) {
  let fileInput = document.getElementById(id_input);
  let file = fileInput.files[0];

  if (!file) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Por favor seleccione un archivo antes de continuar.",
    });
    return;
  }

  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\ClinicalRecord");
  formData.append("model_id", record_id);
  return guardarArchivo(formData);
}

async function guardarDocumentoAdmision(id_input, record_id) {
  let fileInput = document.getElementById(id_input);
  let file = fileInput.files[0];

  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\Admission");
  formData.append("model_id", record_id);
  return guardarArchivo(formData);
}

async function guardarResultadoRecetaExamen(id_input, record_id) {
  let fileInput = document.getElementById(id_input);
  let file = fileInput.files[0];

  let formData = new FormData();
  formData.append("file", file);
  formData.append("model_type", "App\\Models\\ExamRecipeResult");
  formData.append("model_id", record_id);

  return guardarArchivo(formData);
}
