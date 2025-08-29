import { clinicalRecordService } from "../../services/api/index.js";
import { AlertManager } from "../../services/alertManager.js";

let formValues = {};

// let start = new Date().getTime();
// let timerInterval;
// let tiempoTranscurrido = 0;

// function formatTime(totalSegundos) {
//   let horas = Math.floor(totalSegundos / 3600);
//   let remainingSeconds = totalSegundos % 3600;
//   let minutos = Math.floor(remainingSeconds / 60);
//   let segundos = remainingSeconds % 60;
//   return `${horas.toString().padStart(2, "0")}:${minutos
//     .toString()
//     .padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
// }

// function iniciarCronometro() {
//   timerInterval = setInterval(() => {
//     let now = new Date().getTime();
//     tiempoTranscurrido = Math.floor((now - start) / 1000);
//     document.getElementById("timer").textContent =
//       formatTime(tiempoTranscurrido);
//   }, 1000);
// }

// document.addEventListener("DOMContentLoaded", function () {
//   iniciarCronometro();
// });

document.addEventListener("DOMContentLoaded", async function () {
  const params = new URLSearchParams(window.location.search);
  const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;
  // console.log("Historia: ", jsonPath);
  const dataHistoryPreaddmission = await historyPreadmission();
  console.log("Preadmision: ", dataHistoryPreaddmission);
  // const timerElement = document.getElementById('timer');
  // const finishBtn = document.getElementById('finishBtn');
  // const modalTimer = document.getElementById('modalTimer');
  // let startTime = new Date();

  try {
    const response = await fetch(jsonPath);
    const formData = await response.json();
    // console.log("Formdata: ", formData);

    generateForm(formData.form1);
    // updateTimer();

    // document.getElementById("finalizarConsulta").addEventListener("click", function () {
    //     captureFormValues(formData.form1);
    //     console.log("Valores capturados:", formValues);
    //     clinicalRecordService.createForParent(1, {
    //         "clinical_record_type_id": 1,
    //         "created_by_user_id": 1,
    //         "branch_id": 1,
    //         "data": formValues
    //     }).then(() => AlertManager.success({
    //         text: 'Se ha creado el registro exitosamente',
    //         onClose: () => {
    //             window.location.reload();
    //         }
    //     })).catch(err => {
    //         if (err.data?.errors) {
    //             AlertManager.formErrors(err.data.errors);
    //         } else {
    //             AlertManager.error({
    //                 text: err.message || 'Ocurrió un error inesperado'
    //             });
    //         }
    //     });
    // });
  } catch (error) {
    console.error("Error cargando el JSON:", error);
  }

  const agregarNotaBtn = document.getElementById("agregarNotaBtn");

  if (agregarNotaBtn) {
    agregarNotaBtn.addEventListener("click", agregarNota);
  }

  const agregarObservacionBtn = document.getElementById(
    "agregarObservacionBtn"
  );

  if (agregarObservacionBtn) {
    agregarObservacionBtn.addEventListener("click", agregarObservacion);
  }

  const agregarInformeBtn = document.getElementById("agregarInforme");

  if (agregarInformeBtn) {
    agregarInformeBtn.addEventListener("click", agregarInforme);
  }

  // Agregar event listeners a todos los radio buttons
  document
    .querySelectorAll(
      'input[name="actividadMuscular"], input[name="respiratorios"], input[name="circulatorios"], input[name="estadoConciencia"], input[name="colorMucosas"]'
    )
    .forEach((radio) => {
      radio.addEventListener("change", calcularTotal);
    });

  const tensionSistolica = document.getElementById("tensionSistólica");
  const tensionDiastolica = document.getElementById("tensionDiastólica");

  if (tensionSistolica && tensionDiastolica) {
    tensionSistolica.addEventListener("input", calcularPAM);
    tensionDiastolica.addEventListener("input", calcularPAM);
  }
  // console.log("Preadmision: ", dataHistoryPreaddmission);
  const pesoInput = document.getElementById("peso") || 0;
  const alturaInput = document.getElementById("altura") || 0;
  const glucemiaInput = document.getElementById("glucemia") || 0;
  pesoInput.value = dataHistoryPreaddmission?.weight || 0;
  alturaInput.value = dataHistoryPreaddmission?.size || 0;
  if (glucemiaInput) {
    glucemiaInput.value = dataHistoryPreaddmission?.glycemia || 0;
  }

  if (pesoInput && alturaInput) {
    pesoInput.addEventListener("input", actualizarIMC);
    alturaInput.addEventListener("input", actualizarIMC);

    actualizarIMC();
  }
  const sistolicaInput = document.getElementById("presionArterialSistolica");
  const diastolicaInput = document.getElementById("presionArterialDiastolica");
  sistolicaInput.value =
    dataHistoryPreaddmission?.extra_data?.tensionSistolica || 0;
  diastolicaInput.value =
    dataHistoryPreaddmission?.extra_data?.tensionDiastolica || 0;

  if (sistolicaInput && diastolicaInput) {
    sistolicaInput.addEventListener("input", actualizarTensionArterialMedia);
    diastolicaInput.addEventListener("input", actualizarTensionArterialMedia);

    actualizarTensionArterialMedia();
  }
  catchExtraDataToInputs(dataHistoryPreaddmission?.extra_data);
});

function catchExtraDataToInputs(extraData){
    Object.keys(extraData).forEach(key => {
        let inputById = document.getElementById(key);
        let inputByName = inputById ? null : document.querySelector(`input[name="${key}"]`);

        if (inputById) {
            inputById.value = extraData[key];
        } else if (inputByName) {
            inputByName.value = extraData[key];
        }
    });
}

async function historyPreadmission() {
  const params = new URLSearchParams(window.location.search);
  let historyPreadmissionHttp =
    obtenerRutaPrincipal() +
    "/medical/history-preadmissions/last-history/" +
    params.get("patient_id") +
    "/1";

  let historyPreadmission;
  try {
    historyPreadmission = await obtenerDatos(historyPreadmissionHttp);
  } catch (error) {
    console.error("Error fetching history preadmission:", error);
    historyPreadmission = null;
  }

  return historyPreadmission;
}

function createSelect(field) {
  const div = document.createElement("div");
  // div.className = "mb-3 form-floating";
  if (!field.class) {
    // div.className = "mb-3 form-floating";
    div.className = "col-12 mb-3";
  } else {
    div.className = field.class;
  }

  const select = document.createElement("select");
  select.className = "form-select";
  select.id = field.id;
  select.name = field.id;

  const defaultOption = document.createElement("option");
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.value = "";
  defaultOption.textContent = "Seleccione";
  select.appendChild(defaultOption);

  field.options.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.text;
    select.appendChild(opt);
  });

  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", field.id);
  labelEl.className = "form-label";
  labelEl.textContent = field.label;
  // labelEl.style = "margin-left: 20px";

  div.appendChild(labelEl);
  div.appendChild(select);
  return div;
}

// function createSelect(id, label, options) {
//     const div = document.createElement("div");
//     div.className = "mb-3 form-floating";

//     const select = document.createElement("select");
//     select.className = "form-select";
//     select.id = id;
//     select.name = id;

//     const defaultOption = document.createElement("option");
//     defaultOption.selected = true;
//     defaultOption.disabled = true;
//     defaultOption.value = "";
//     defaultOption.textContent = "Seleccione";
//     select.appendChild(defaultOption);

//     options.forEach((option) => {
//         const opt = document.createElement("option");
//         opt.value = option.value;
//         opt.textContent = option.text;
//         select.appendChild(opt);
//     });

//     const labelEl = document.createElement("label");
//     labelEl.setAttribute("for", id);
//     labelEl.className = "form-label";
//     labelEl.textContent = label;

//     div.appendChild(select);
//     div.appendChild(labelEl);
//     return div;
// }

function createDropzone(field) {
  // Crear el elemento div principal
  const div = document.createElement("div");
  div.className = "dropzone dropzone-multiple p-0 dz-clickable";
  div.id = field.id;
  div.setAttribute("data-dropzone", "data-dropzone");

  // Crear el mensaje de dropzone
  const messageDiv = document.createElement("div");
  messageDiv.className = "dz-message";
  messageDiv.setAttribute("data-dz-message", "data-dz-message");

  // Crear la imagen del ícono
  const icon = document.createElement("img");
  icon.className = "me-2";
  icon.src = field.iconSrc || "../../../assets/img/icons/cloud-upload.svg";
  icon.width = 25;
  icon.alt = "";

  // Agregar el ícono y el texto al mensaje
  messageDiv.appendChild(icon);
  messageDiv.appendChild(
    document.createTextNode(field.message || "Cargar archivos")
  );

  // Crear modal de previsualización de la imagen
  const previewModal = document.createElement("div");
  previewModal.className = "modal fade";
  previewModal.id = `${field.id}-preview-modal`;
  previewModal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista Previa</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-center">
            <img id="${field.id}-full-preview" class="img-fluid" src="" alt="Vista previa">
          </div>
        </div>
      </div>
    `;

  // Agregar modal al documento
  document.body.appendChild(previewModal);

  // Agregar todos los elementos al div principal
  div.appendChild(messageDiv);

  // Configurar Dropzone con opciones adicionales
  const dropzoneInstance = new Dropzone(div, {
    url: field.uploadUrl || "/upload",
    paramName: "file",
    maxFilesize: field.maxFilesize || 10,
    acceptedFiles: field.acceptedFiles || "image/*",
    dictDefaultMessage: "Arrastra los archivos aquí para subirlos.",
    dictFallbackMessage:
      "Tu navegador no soporta la funcionalidad de arrastrar y soltar archivos.",
    dictInvalidFileType: "Tipo de archivo no permitido.",
    dictFileTooBig:
      "El archivo es demasiado grande ({{filesize}}MB). El tamaño máximo permitido es {{maxFilesize}}MB.",
    dictResponseError: "Error al subir el archivo.",

    // Personalizar la previsualización para agregar botones de acciones
    previewTemplate: `
        <div class="dz-preview dz-file-preview d-flex align-items-center mb-2 position-relative">
          <div class="dz-image me-2" style="max-width: 80px; max-height: 80px;">
            <img data-dz-thumbnail class="img-fluid" />
          </div>
          <div class="dz-details-wrapper position-relative flex-grow-1" style="height: 80px; max-width: calc(100% - 210px); overflow: hidden;">
            <div class="dz-details bg-dark bg-opacity-75 text-white p-1 text-center w-100" style="font-size: 0.7rem;">
              <div class="dz-filename text-truncate"><span data-dz-name></span></div>
              <div class="dz-size" style="font-size: 0.6rem;"><span data-dz-size></span></div>
            </div>
          </div>
          <div class="dz-actions d-flex justify-content-end gap-2" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
            <!-- Botones con un pequeño espacio entre ellos -->
            <button type="button" class="btn btn-info btn-sm d-flex justify-content-center align-items-center p-1 dz-preview-btn" style="width: 50px; height: 30px;" data-bs-toggle="modal">
              <i class="far fa-eye"></i>
            </button>
            <button type="button" class="btn btn-danger btn-sm d-flex justify-content-center align-items-center p-1" style="width: 50px; height: 30px;" data-dz-remove>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
        </div>
      `,

    // Agregar eventos personalizados
    init: function () {
      // Manejar la eliminación de archivos
      this.on("removedfile", function (file) {
        // Lógica opcional para eliminar del servidor
        if (file.serverFileName) {
          fetch("/delete-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ filename: file.serverFileName }),
          })
            .then((response) => response.json())
            .then((data) => {})
            .catch((error) => {
              console.error("Error al eliminar el archivo:", error);
            });
        }
      });

      // Configurar eventos de vista previa
      this.on("addedfile", function (file) {
        // Seleccionar elementos relevantes
        const previewButton =
          file.previewElement.querySelector(".dz-preview-btn");
        const detailsWrapper = file.previewElement.querySelector(
          ".dz-details-wrapper"
        );
        const detailsDiv = file.previewElement.querySelector(".dz-details");

        // Configurar el evento de clic para abrir la vista previa
        previewButton.addEventListener("click", function () {
          // Obtener la referencia del modal y la imagen
          const modal = document.getElementById(`${field.id}-preview-modal`);
          const fullPreviewImg = document.getElementById(
            `${field.id}-full-preview`
          );

          // Establecer la imagen en el modal
          fullPreviewImg.src = file.dataURL;

          // Usar Bootstrap Modal para mostrar (asume que Bootstrap JS está incluido)
          const modalInstance = new bootstrap.Modal(modal);
          modalInstance.show();
        });
      });
    },
  });

  return div;
}

function createSingleFileDropzone(field) {
  // Crear el elemento div principal
  const div = document.createElement("div");
  div.className =
    "dropzone dropzone-single p-0 dz-clickable position-relative overflow-hidden d-flex flex-column align-items-center";
  div.id = field.id;
  div.setAttribute("data-dropzone", "data-dropzone");
  div.style.minHeight = "550px";
  div.style.border = "none";
  div.style.outline = "none";

  // Crear el contenedor de previsualización
  const previewContainer = document.createElement("div");
  previewContainer.className = "dz-preview-container position-relative w-100";
  previewContainer.style.height = "500px";
  previewContainer.style.display = "flex";
  previewContainer.style.alignItems = "center";
  previewContainer.style.justifyContent = "center";

  // Crear el mensaje de dropzone
  const messageDiv = document.createElement("div");
  messageDiv.className =
    "dz-message d-flex flex-column align-items-center justify-content-center text-center";

  // Crear la imagen del ícono
  const icon = document.createElement("img");
  icon.className = "mb-2";
  icon.src = field.iconSrc || "../../../assets/img/icons/cloud-upload.svg";
  icon.width = 50;
  icon.alt = "Upload icon";

  // Crear el texto del mensaje
  const messageText = document.createElement("span");
  messageText.textContent =
    field.message || "Arrastra tu archivo aquí o haz clic para seleccionar";

  // Crear el contenedor de imagen previa
  const previewImageContainer = document.createElement("div");
  previewImageContainer.className =
    "dz-preview-image position-absolute w-100 h-100 d-none";
  previewImageContainer.style.top = "0";
  previewImageContainer.style.left = "0";

  const previewImage = document.createElement("img");
  previewImage.className = "img-fluid w-100 h-100 object-fit-contain";

  // Crear contenedor para los botones
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "mt-3 d-none d-flex gap-2 justify-content-center";

  // Crear botón de cambiar imagen
  const changeImageButton = document.createElement("button");
  changeImageButton.className = "btn btn-primary btn-sm";
  changeImageButton.innerHTML =
    '<i class="fas fa-sync-alt me-2"></i>Cambiar imagen';

  // Crear botón de eliminar imagen
  const deleteImageButton = document.createElement("button");
  deleteImageButton.className = "btn btn-danger btn-sm";
  deleteImageButton.innerHTML =
    '<i class="fas fa-trash-alt me-2"></i>Eliminar imagen';

  // Agregar elementos
  messageDiv.appendChild(icon);
  messageDiv.appendChild(messageText);

  buttonContainer.appendChild(changeImageButton);
  buttonContainer.appendChild(deleteImageButton);

  previewImageContainer.appendChild(previewImage);
  previewContainer.appendChild(messageDiv);
  previewContainer.appendChild(previewImageContainer);

  div.appendChild(previewContainer);
  div.appendChild(buttonContainer);

  // Configurar Dropzone
  const dropzoneInstance = new Dropzone(div, {
    url: field.uploadUrl || "/upload",
    paramName: "file",
    maxFilesize: field.maxFilesize || 10,
    acceptedFiles: field.acceptedFiles || "image/*",
    maxFiles: 1, // Limitar a un solo archivo
    dictDefaultMessage: "Arrastra tu archivo aquí o haz clic para seleccionar",
    dictInvalidFileType: "Tipo de archivo no permitido",
    dictFileTooBig:
      "El archivo es demasiado grande ({{filesize}}MB). El tamaño máximo permitido es {{maxFilesize}}MB",

    // Desactivar previewTemplate predeterminado
    previewTemplate: "<div></div>",

    // Configuración personalizada
    clickable: true,
    createImageThumbnails: false,

    // Eventos personalizados
    init: function () {
      const dropzone = this;
      const message = messageDiv;
      const previewCont = previewImageContainer;
      const dropzoneElement = div;
      const changeBtn = buttonContainer;
      const changeImageBtn = changeImageButton;
      const deleteImageBtn = deleteImageButton;

      // Evento cuando se agrega un archivo
      this.on("addedfile", function (file) {
        // Ocultar completamente el mensaje y los elementos de dropzone
        message.style.display = "none";
        dropzoneElement.classList.remove("dz-clickable");

        // Mostrar imagen de previsualización
        previewCont.classList.remove("d-none");
        previewImage.src = URL.createObjectURL(file);

        // Mostrar botones de cambiar y eliminar imagen
        changeBtn.classList.remove("d-none");
      });

      // Evento de eliminación de archivo
      this.on("removedfile", function () {
        // Restaurar mensaje y elementos de dropzone
        message.style.display = "flex";
        dropzoneElement.classList.add("dz-clickable");

        // Ocultar previsualización
        previewCont.classList.add("d-none");
        previewImage.src = "";

        // Ocultar botones de cambiar y eliminar imagen
        changeBtn.classList.add("d-none");
      });

      // Configurar botón de cambiar imagen
      changeImageBtn.addEventListener("click", function () {
        // Abrir diálogo de selección de archivos
        dropzone.hiddenFileInput.click();
      });

      // Configurar botón de eliminar imagen
      deleteImageBtn.addEventListener("click", function () {
        // Eliminar todos los archivos
        dropzone.removeAllFiles(true);
      });
    },
  });

  return div;
}

function createImageField(field) {
  const div = document.createElement("div");
  div.className = "mb-3";

  const img = document.createElement("img");
  img.id = field.id;
  // img.name = field.name;
  img.src = field.src;
  img.alt = field.alt;
  img.className = "img-fluid"; // Bootstrap para que sea responsiva
  img.style.width = field.width || "100px";
  img.style.height = field.height || "100px";

  const labelEl = document.createElement("label");
  labelEl.setAttribute("for", field.id);
  labelEl.className = "form-label";
  labelEl.textContent = field.label;

  div.appendChild(labelEl);
  div.appendChild(img);

  return div;
}

function createCheckboxWithSubfields(field) {
  let fieldDiv = document.createElement("div");
  // fieldDiv.classList.add("form-check", "mb-3", "p-0");
  if (field.class) {
    fieldDiv.classList.add(field.class);
  } else {
    fieldDiv.classList.add("form-check", "mb-3", "p-0", "col-12");
  }

  let checkbox = document.createElement("input");
  checkbox.classList.add("form-check-input");
  checkbox.setAttribute("id", field.id);
  checkbox.setAttribute("name", field.name);
  checkbox.setAttribute("type", "checkbox");

  let label = document.createElement("label");
  label.classList.add("form-check-label", "mt-0", "mb-0");
  label.setAttribute("for", field.id);
  label.textContent = field.label;

  let switchDiv = document.createElement("div");
  switchDiv.classList.add("form-check", "form-switch", "mb-2");
  switchDiv.appendChild(checkbox);

  fieldDiv.appendChild(label);
  fieldDiv.appendChild(switchDiv);

  let subFieldsContainer = document.createElement("div");
  subFieldsContainer.setAttribute("id", `${field.id}-subfields`);
  subFieldsContainer.classList.add("d-none");
  subFieldsContainer.classList.add("row");

  if (field.toggleFields) {
    field.toggleFields.forEach((subField) => {
      let subFieldDiv = document.createElement("div");
      if (subField.class) {
        subFieldDiv.classList.add(subField.class);
      } else {
        subFieldDiv.classList.add("mb-2", "col-12");
      }

      if (subField.type === "select") {
        let select = document.createElement("select");
        select.classList.add("form-select", "mb-3");
        select.setAttribute("id", subField.id);
        select.setAttribute("name", subField.name);

        let defaultOptionSub = document.createElement("option");
        defaultOptionSub.selected = true;
        defaultOptionSub.disabled = true;
        defaultOptionSub.value = "";
        defaultOptionSub.textContent = "Seleccione";
        select.appendChild(defaultOptionSub);

        // Agregar opciones al select
        subField.options.forEach((optionText) => {
          let option = document.createElement("option");
          option.value = optionText.value;
          option.textContent = optionText.text;
          select.appendChild(option);
        });

        let selectLabel = document.createElement("label");
        selectLabel.setAttribute("for", subField.id);
        selectLabel.textContent = subField.label;
        selectLabel.classList.add("form-label", "mt-4");

        subFieldDiv.appendChild(selectLabel);
        subFieldDiv.appendChild(select);
      } else if (subField.type === "textarea") {
        let textarea = document.createElement("textarea");
        textarea.classList.add("rich-text");
        textarea.setAttribute("id", subField.id);
        textarea.setAttribute("name", subField.name);
        textarea.setAttribute("style", "height: 50px");

        if (subField.placeholder) {
          textarea.setAttribute("placeholder", subField.placeholder);
        }

        let textareaLabel = document.createElement("label");
        textareaLabel.setAttribute("for", subField.id);
        textareaLabel.textContent = subField.label;
        textareaLabel.classList.add("form-label");

        subFieldDiv.appendChild(textareaLabel);
        subFieldDiv.appendChild(textarea);
      } else if (subField.type === "radio") {
        // Nuevo manejo para botones de radio
        const radioGroupContainer = document.createElement("div");
        if (subField.class) {
          radioGroupContainer.className = subField.class;
        } else {
          radioGroupContainer.className = "mb-3 col-12";
        }

        // Crear la etiqueta del grupo
        const radioGroupLabel = document.createElement("label");
        radioGroupLabel.className = "form-label";
        radioGroupLabel.textContent = subField.label;
        radioGroupContainer.appendChild(radioGroupLabel);

        // Contenedor para los radio buttons
        const radioButtonsContainer = document.createElement("div");
        radioButtonsContainer.className = "radio-group-container";

        // Crear cada botón de radio
        subField.options.forEach((option, index) => {
          const radioDiv = document.createElement("div");
          radioDiv.className = "form-check form-check-inline";

          const input = document.createElement("input");
          input.className = "form-check-input";
          input.type = "radio";
          input.id = `${subField.id}_${index}`;
          input.name = subField.id; // Todos los radios del mismo grupo comparten el nombre
          input.value = option.value;

          // Manejar opciones preseleccionadas
          if (option.selected) {
            input.checked = true;
          }

          // Manejar opciones deshabilitadas
          if (option.disabled) {
            input.disabled = true;
          }

          const label = document.createElement("label");
          label.className = "form-check-label";
          label.setAttribute("for", `${subField.id}_${index}`);
          label.textContent = option.text;

          // Agregar eventos si están definidos
          if (subField.onChange) {
            input.addEventListener("change", (e) => {
              subField.onChange(e, option.value);
            });
          }

          radioDiv.appendChild(input);
          radioDiv.appendChild(label);
          radioButtonsContainer.appendChild(radioDiv);
        });

        radioGroupContainer.appendChild(radioButtonsContainer);
        subFieldsContainer.appendChild(radioGroupContainer);
      } else {
        // Manejo de campos de tipo input estándar
        let inputFieldDiv = document.createElement("div");
        if (subField.class) {
          inputFieldDiv.classList.add("mb-2", subField.class);
        } else {
          inputFieldDiv.classList.add("mb-2");
        }

        const input = document.createElement("input");
        input.type = subField.type;
        input.id = subField.id;
        input.name = subField.id;
        input.className = "form-control";
        if (subField.readonly) input.readOnly = true;

        const inputLabel = document.createElement("label");
        inputLabel.htmlFor = subField.id;
        inputLabel.innerText = subField.label;
        inputLabel.className = "form-label";
        if (subField.class) {
          inputLabel.style.marginLeft = "20px";
        } else {
          inputLabel.style.marginLeft = "0px";
        }

        inputFieldDiv.appendChild(inputLabel);
        inputFieldDiv.appendChild(input);
        subFieldsContainer.appendChild(inputFieldDiv);
      }

      // Solo agregamos subFieldDiv si no es un campo de radio (ya que los radio se han tratado de forma especial)
      if (subField.type !== "radio") {
        subFieldsContainer.appendChild(subFieldDiv);
      }
    });
  }

  fieldDiv.appendChild(subFieldsContainer);

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      subFieldsContainer.classList.remove("d-none");
    } else {
      subFieldsContainer.classList.add("d-none");
    }
  });

  return fieldDiv;
}

function createDynamicTable(field) {
  // Crear el contenedor principal de la tabla
  const tableContainer = document.createElement("div");
  tableContainer.classList.add("table-responsive");

  // Crear la tabla
  const table = document.createElement("table");
  table.classList.add("table", "table-bordered", "table-striped");
  table.id = field.id;

  // Crear el cuerpo de la tabla
  const tbody = document.createElement("tbody");

  // Verificar si hay celdas definidas
  if (field.cells && field.cells.length > 0) {
    // Determinar el número máximo de columnas
    const maxColumns = Math.max(...field.cells.map((row) => row.length));

    // Crear filas
    field.cells.forEach((rowData) => {
      const tableRow = document.createElement("tr");

      // Iterar sobre las celdas de la fila
      rowData.forEach((cellConfig) => {
        const td = document.createElement("td");

        // Manejar diferentes tipos de campos
        switch (cellConfig.type) {
          case "text":
            td.textContent = cellConfig.value || "";
            break;

          case "textarea":
            const textarea = document.createElement("textarea");
            textarea.classList.add("form-control");
            textarea.value = cellConfig.value || "";
            textarea.id = cellConfig.id || "";
            textarea.name = cellConfig.name || "";

            if (cellConfig.placeholder) {
              textarea.placeholder = cellConfig.placeholder;
            }

            td.appendChild(textarea);
            break;

          case "input":
            const input = document.createElement("input");
            input.type = cellConfig.inputType || "text";
            input.classList.add("form-control");
            input.value = cellConfig.value || "";
            input.id = cellConfig.id || "";
            input.name = cellConfig.name || "";

            if (cellConfig.placeholder) {
              input.placeholder = cellConfig.placeholder;
            }

            if (cellConfig.readonly) {
              input.readOnly = true;
            }

            td.appendChild(input);
            break;

          case "select":
            const select = document.createElement("select");
            select.classList.add("form-select");
            select.id = cellConfig.id || "";
            select.name = cellConfig.name || "";

            // Opción por defecto
            const defaultOption = document.createElement("option");
            defaultOption.textContent = "Seleccione";
            defaultOption.value = "";
            select.appendChild(defaultOption);

            // Agregar opciones
            if (cellConfig.options) {
              cellConfig.options.forEach((option) => {
                const optionElement = document.createElement("option");
                optionElement.value = option.value;
                optionElement.textContent = option.text;

                // Marcar como seleccionada si coincide con el valor
                if (option.value === cellConfig.value) {
                  optionElement.selected = true;
                }

                select.appendChild(optionElement);
              });
            }

            td.appendChild(select);
            break;

          default:
            td.textContent = cellConfig.value || "";
        }

        // Aplicar clases personalizadas si se proporcionan
        if (cellConfig.class) {
          td.classList.add(cellConfig.class);
        }

        tableRow.appendChild(td);
      });

      tbody.appendChild(tableRow);
    });
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  return tableContainer;
}

// function createTextareaField(field) {
//   // Crear el contenedor principal para el textarea
//   let fieldDiv = document.createElement("div");
//   // fieldDiv.classList.add("form-floating", "mb-3");
//   if (field.class) {
//     fieldDiv.classList.add(field.class);
//   } else {
//     fieldDiv.classList.add("col-12", "mb-3");
//   }
//   // Crear el textarea
//   let textarea = document.createElement("textarea");
//   textarea.classList.add("form-control");
//   textarea.setAttribute("id", field.id);
//   textarea.setAttribute("name", field.name);
//   textarea.setAttribute("style", "height: 100px");

//   if (field.placeholder) {
//     textarea.setAttribute("placeholder", field.placeholder);
//   }

//   // Crear la etiqueta para el textarea
//   let label = document.createElement("label");
//   label.setAttribute("for", field.id);
//   label.textContent = field.label;
//   label.style.marginTop = "25px";
//   label.style.fontWeight = "20px";
//   label.classList.add("form-label");
//   // if(field.class){
//   // }
//   // label.style.paddingBottom = "20px";

//   // Agregar el textarea y la etiqueta al contenedor
//   fieldDiv.appendChild(label);
//   fieldDiv.appendChild(textarea);

//   return fieldDiv;
// }

function createTextareaField(field) {
  let fieldDiv = document.createElement("div");
  if (field.class) {
    fieldDiv.classList.add(field.class);
  } else {
    fieldDiv.classList.add("col-12", "mb-3");
  }

  let label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;
  label.classList.add("form-label");
  fieldDiv.appendChild(label);

  // Contenedor para textarea y botón de micrófono
  let textareaContainer = document.createElement("div");
  textareaContainer.classList.add("textarea-with-mic");
  textareaContainer.style.position = "relative";

  let textarea = document.createElement("textarea");
  textarea.classList.add("form-control");
  textarea.setAttribute("id", field.id);
  textarea.setAttribute("name", field.name);
  textarea.setAttribute("style", "height: 100px; padding-right: 40px;"); // Espacio para el botón

  if (field.placeholder) {
    textarea.setAttribute("placeholder", field.placeholder);
  }

  // Botón de micrófono
  let micButton = document.createElement("button");
  micButton.innerHTML = '<i class="fas fa-microphone"></i>';
  micButton.type = "button";
  micButton.classList.add("mic-button");
  micButton.title = "Dictado por voz";
  
  // Posicionar el botón dentro del textarea
  micButton.style.position = "absolute";
  micButton.style.right = "10px";
  micButton.style.top = "60px";
  micButton.id = "mic-button";
  micButton.style.background = "none";
  micButton.style.border = "none";
  micButton.style.cursor = "pointer";
  micButton.style.color = "#132030"; 
  micButton.style.fontSize = "1rem";

  textareaContainer.appendChild(textarea);
  textareaContainer.appendChild(micButton);
  fieldDiv.appendChild(textareaContainer);

  // Variables para controlar el estado del reconocimiento
  let recognition = null;
  let isListening = false;

  // Añadir funcionalidad de voz
  micButton.addEventListener("click", function() {
    if (!isListening) {
      startRecognition();
    } else {
      stopRecognition();
    }
  });

  function startRecognition() {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'es-ES';
    recognition.continuous = true; // Para que no se detenga automáticamente
    recognition.interimResults = true; // Para obtener resultados provisionales

    recognition.onresult = function(event) {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }
      if (transcript) {
        const editor = tinymce.get(textarea.id);
        if (editor) {
          editor.insertContent(transcript);
        } else {
          document.getElementById(textarea.id).value += transcript;
        }
      }
    };

    recognition.onerror = function(event) {
      console.error('Error en reconocimiento de voz:', event.error);
      stopRecognition();
    };

    recognition.onend = function() {
      if (isListening) {
        recognition.start(); // Reinicia si aún está en modo escucha
      }
    };

    recognition.start();
    isListening = true;
    micButton.style.color = "#dc3545"; 
    micButton.title = "Detener dictado";
  }

  function stopRecognition() {
    if (recognition) {
      recognition.stop();
    }
    isListening = false;
    micButton.style.color = "#132030"; 
    micButton.title = "Dictado por voz";
  }

  return fieldDiv;
}

function createProgressBar(field) {
  // Crear el contenedor principal de la barra de progreso
  const progressContainer = document.createElement("div");

  // Asignar clases, siguiendo la misma lógica que createSelect
  if (!field.class) {
    progressContainer.className = "progress mt-2";
  } else {
    progressContainer.className = "progress " + field.class;
  }

  // Establecer altura de la barra, valor por defecto: 20px
  progressContainer.style.height = field.height || "20px";

  // Eliminar cualquier padding interno
  progressContainer.style.padding = "0";

  progressContainer.style.width = "98%";

  // Centrar el contenedor horizontalmente
  progressContainer.style.margin = "0 auto";

  // Crear la barra de progreso interna
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar " + (field.bgColor || "bg-success");
  progressBar.id = field.id;
  progressBar.role = "progressbar";

  // Inicializar con 0% de ancho
  progressBar.style.width = "0%";
  progressBar.setAttribute("aria-valuenow", 0);
  progressBar.setAttribute("aria-valuemin", 0);
  progressBar.setAttribute("aria-valuemax", 100);

  // Eliminar padding interno de la barra de progreso
  progressBar.style.padding = "0";

  // Asegurar que no haya espacios internos
  progressBar.style.margin = "0";
  progressBar.style.boxSizing = "border-box";

  // Añadir la barra al contenedor
  progressContainer.appendChild(progressBar);

  return progressContainer;
}

function createDateTimeField(field) {
  // Crear el contenedor principal
  let fieldDiv = document.createElement("div");
  if (field.class) {
    fieldDiv.classList.add(field.class);
  } else {
    fieldDiv.classList.add("col-12", "mb-3");
  }

  // Crear el input - usamos datetime-local para fecha y hora
  let input = document.createElement("input");
  input.classList.add("form-control");

  // Permitir configurar si es solo fecha o fecha+hora
  input.setAttribute("type", "datetime-local");
  input.setAttribute("id", field.id);
  input.setAttribute("name", field.name);

  // Configurar valor mínimo y máximo si se especifican
  if (field.min) input.setAttribute("min", field.min);
  if (field.max) input.setAttribute("max", field.max);

  if (field.placeholder) {
    input.setAttribute("placeholder", field.placeholder);
  }

  // Función para establecer la fecha y hora actual en formato adecuado para input datetime-local
  function setCurrentDateTime() {
    const now = new Date();
    // Formato requerido para datetime-local: YYYY-MM-DDThh:mm
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Crear string en formato YYYY-MM-DDThh:mm
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    input.value = formattedDateTime;

    // Disparar evento change para detectar el cambio
    const event = new Event("change");
    input.dispatchEvent(event);

    if (field.onChange) {
      field.onChange(formattedDateTime);
    }
  }

  // Establecer fecha y hora actual al crear el campo
  setCurrentDateTime();

  // Configurar intervalo para actualizar cada minuto
  const intervalId = setInterval(setCurrentDateTime, 60000);

  // Guardar el ID del intervalo para poder limpiarlo cuando sea necesario
  fieldDiv.dataset.intervalId = intervalId;

  // Método para limpiar el intervalo
  fieldDiv.cleanup = function () {
    clearInterval(intervalId);
  };

  // Crear la etiqueta
  let label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;
  label.classList.add("form-label");

  // Agregar elementos al contenedor
  fieldDiv.appendChild(label);
  fieldDiv.appendChild(input);

  return fieldDiv;
}

function createTimePickerField(field) {
  // Crear el contenedor principal
  let fieldDiv = document.createElement("div");
  if (field.class) {
    fieldDiv.classList.add(field.class);
  } else {
    fieldDiv.classList.add("col-12", "mb-3");
  }

  // Crear la etiqueta
  let label = document.createElement("label");
  label.setAttribute("for", field.id);
  label.textContent = field.label;
  label.classList.add("form-label");

  // Crear el input para el time picker
  let input = document.createElement("input");
  input.classList.add("form-control", "datetimepicker", "flatpickr-input");
  input.setAttribute("type", "text");
  input.setAttribute("id", field.id);
  input.setAttribute("name", field.name);
  input.setAttribute("readonly", "readonly");

  if (field.placeholder) {
    input.setAttribute("placeholder", field.placeholder);
  } else {
    input.setAttribute("placeholder", "hh:mm");
  }

  // Configurar las opciones de flatpickr
  const options = {
    enableTime: true,
    noCalendar: true,
    dateFormat: "H:i",
    disableMobile: true,
    ...field.options, // Permite extender o sobrescribir las opciones predeterminadas
  };

  // Convertir las opciones a un atributo data-options
  input.setAttribute("data-options", JSON.stringify(options));

  // Inicializar flatpickr
  const flatpickrInstance = flatpickr(input, options);

  // Función para establecer la hora actual
  function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Formatear la hora según el formato especificado
    const formattedTime = `${hours}:${minutes}`;

    // Actualizar el valor en flatpickr
    flatpickrInstance.setDate(formattedTime, true);

    if (field.onChange) {
      field.onChange(formattedTime);
    }
  }

  // Establecer la hora actual al crear el campo si se solicita
  if (field.setCurrentTime) {
    setCurrentTime();
  }

  // Configurar manejador de eventos para cambios
  input.addEventListener("change", function (e) {
    if (field.onChange) {
      field.onChange(input.value);
    }
  });

  // Método para limpiar recursos si es necesario
  fieldDiv.cleanup = function () {
    flatpickrInstance.destroy();
  };

  // Agregar elementos al contenedor
  fieldDiv.appendChild(label);
  fieldDiv.appendChild(input);

  return fieldDiv;
}

function createIconButton(field) {
  // Crear el contenedor principal
  let containerDiv = document.createElement("div");
  containerDiv.classList.add("text-end");

  // Crear el botón
  let button = document.createElement("button");
  button.classList.add("btn", "btn-secondary", "me-1", "mb-1");
  button.setAttribute("type", "button");

  // Crear el icono
  let icon = document.createElement("i");
  icon.classList.add("fas", "fa-plus");

  // Configuraciones opcionales
  if (field.buttonClass) {
    button.className = field.buttonClass; // Sobrescribe todas las clases
  }

  if (field.buttonType) {
    button.setAttribute("type", field.buttonType);
  }

  if (field.iconClass) {
    icon.className = field.iconClass;
  }

  if (field.id) {
    button.setAttribute("id", field.id);
  }

  if (field.onClick) {
    button.addEventListener("click", field.onClick);
  }

  // Ensamblar los elementos
  button.appendChild(icon);
  containerDiv.appendChild(button);

  return containerDiv;
}

function createRadioGroup(field) {
  // Crear el contenedor principal
  const div = document.createElement("div");
  if (!field.class) {
    div.className = "col-12 mb-3";
  } else {
    div.className = field.class;
  }

  // Crear la etiqueta del grupo
  const groupLabel = document.createElement("label");
  groupLabel.className = "form-label";
  groupLabel.textContent = field.label;
  div.appendChild(groupLabel);

  // Crear un contenedor para los radio buttons
  const radioContainer = document.createElement("div");
  radioContainer.className = "radio-group-container";

  // Crear cada botón de radio con su etiqueta
  field.options.forEach((option, index) => {
    const radioDiv = document.createElement("div");
    radioDiv.className = "form-check form-check-inline";

    const input = document.createElement("input");
    input.className = "form-check-input";
    input.type = "radio";
    input.id = `${field.id}_${index}`;
    input.name = field.id; // Todos los radios del mismo grupo tienen el mismo name
    input.value = option.value;

    // Manejar opciones preseleccionadas
    if (option.selected) {
      input.checked = true;
    }

    // Manejar opciones deshabilitadas
    if (option.disabled) {
      input.disabled = true;
    }

    const label = document.createElement("label");
    label.className = "form-check-label";
    label.setAttribute("for", `${field.id}_${index}`);
    label.textContent = option.text;

    // Agregar eventos si están definidos
    if (field.onChange) {
      input.addEventListener("change", (e) => {
        field.onChange(e, option.value);
      });
    }

    // Ensamblar el botón de radio con su etiqueta
    radioDiv.appendChild(input);
    radioDiv.appendChild(label);
    radioContainer.appendChild(radioDiv);
  });

  div.appendChild(radioContainer);
  return div;
}

function generateForm(formData) {
  const tabsContainer = document.getElementById("tabsContainer");
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = "";
  tabsContainer.innerHTML = "";
  formContainer.className = "";

  const navTabs = document.createElement("ul");
  navTabs.className = "nav nav-underline fs-9";
  navTabs.id = "customTabs";

  const tabContent = document.createElement("div");
  tabContent.className = "tab-content mt-4 w-100";
  tabContent.style.fontSize = "500px";

  formData.tabs.forEach((tab, index) => {
    const tabId = `tab-${tab.tab.replace(/\s+/g, "-")}`;
    const tabLink = document.createElement("li");
    tabLink.className = "nav-item";

    const link = document.createElement("a");
    link.className = `nav-link ${index === 0 ? "active" : ""}`;
    link.id = `${tabId}-tab`;
    link.dataset.bsToggle = "tab";
    link.href = `#${tabId}`;
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", tabId);
    link.setAttribute("aria-selected", index === 0 ? "true" : "false");
    link.textContent = tab.tab;

    tabLink.appendChild(link);
    navTabs.appendChild(tabLink);

    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
    tabPane.id = tabId;
    tabPane.setAttribute("role", "tabpanel");
    tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);

    const cardRow = document.createElement("div");
    cardRow.className = "row";
    Object.keys(tab).forEach((key) => {
      if (key.startsWith("card")) {
        tab[key].forEach((card) => {
          const cardDiv = document.createElement("div");
          if (!card.class) {
            cardDiv.className = "col-12 col-md-6 col-lg-6 mb-3";
          } else {
            cardDiv.className = card.class + " mb-3";
          }

          const cardElement = document.createElement("div");
          cardElement.className = "card";

          const cardBody = document.createElement("div");
          cardBody.className = "card-body row";

          const cardTitle = document.createElement("h5");
          cardTitle.className = "card-title";
          cardTitle.innerText = card.title;
          cardBody.appendChild(cardTitle);

          if (card.fields && card.fields.length) {
            card.fields.forEach((field) => {
              let fieldDiv;

              if (field.type === "select") {
                fieldDiv = createSelect(field);
              } else if (field.type === "checkbox") {
                fieldDiv = createCheckboxWithSubfields(field);
              } else if (field.type === "textarea") {
                fieldDiv = createTextareaField(field);
                fieldDiv.querySelector("textarea").classList.add("rich-text");
              } else if (field.type === "image") {
                fieldDiv = createImageField(field);
              } else if (field.type === "file") {
                fieldDiv = createDropzone(field);
              } else if (field.type === "fileS") {
                fieldDiv = createSingleFileDropzone(field);
              } else if (field.type === "progressbar") {
                fieldDiv = createProgressBar(field);
              } else if (field.type === "dateC") {
                fieldDiv = createDateTimeField(field);
              } else if (field.type === "hours") {
                fieldDiv = createTimePickerField(field);
              } else if (field.type === "buttonI") {
                fieldDiv = createIconButton(field);
              } else if (field.type === "radio") {
                fieldDiv = createRadioGroup(field);
              } else if (field.type === "label") {
                fieldDiv = document.createElement("div");
                if (field.class) {
                  fieldDiv.classList.add("mb-2", field.class, "mt-4");
                } else {
                  fieldDiv.classList.add("mb-2");
                }
                const label = document.createElement("label");
                label.htmlFor = field.id;
                label.innerText = field.label;
                label.className = "form-label";
                if (field.class) {
                  label.style.marginLeft = "20px";
                } else {
                  label.style.marginLeft = "0px";
                }

                fieldDiv.appendChild(label);
              } else {
                fieldDiv = document.createElement("div");
                if (field.class) {
                  fieldDiv.classList.add("mb-2", field.class);
                } else {
                  fieldDiv.classList.add("mb-2");
                }
                const input = document.createElement("input");
                input.type = field.type;
                input.id = field.id;
                input.name = field.id;
                input.className = "form-control";
                if (field.readonly) input.readOnly = true;

                const label = document.createElement("label");
                label.htmlFor = field.id;
                label.innerText = field.label;
                label.className = "form-label";
                if (field.class) {
                  label.style.marginLeft = "20px";
                } else {
                  label.style.marginLeft = "0px";
                }

                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);
              }

              cardBody.appendChild(fieldDiv);
            });
          }

          cardElement.appendChild(cardBody);
          cardDiv.appendChild(cardElement);
          cardRow.appendChild(cardDiv);
        });
      }
    });

    tabPane.appendChild(cardRow);
    tabContent.appendChild(tabPane);
  });

  formContainer.appendChild(navTabs);
  formContainer.appendChild(tabContent);

  // Agregar botones de navegación
  const navigationButtons = document.createElement("div");
  navigationButtons.className = "d-flex justify-content-end mt-4 mb-3";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.className = "btn btn-secondary me-2";
  prevButton.id = "prevTabButton";

  // Agregar icono al botón Anterior
  const prevIcon = document.createElement("i");
  prevIcon.className = "fas fa-arrow-left";
  prevButton.appendChild(prevIcon);
  prevButton.innerHTML += "";

  // Deshabilitar el botón anterior en el primer tab
  prevButton.disabled = true;

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.className = "btn btn-primary";
  nextButton.id = "nextTabButton";

  // Agregar icono al botón Siguiente
  nextButton.innerHTML = "";
  const nextIcon = document.createElement("i");
  nextIcon.className = "fas fa-arrow-right";
  nextButton.appendChild(nextIcon);

  // Deshabilitar el botón siguiente en el último tab si sólo hay un tab
  nextButton.disabled = formData.tabs.length <= 1;

  if (formData.tabs.length === 1) {
    const finishButton = document.getElementById("finishBtn");
    const herramientasIABtn = document.getElementById("herramientasIABtn");
    prevButton.style.display = "none";
    nextButton.style.display = "none";
    finishButton.disabled = false;
    herramientasIABtn.disabled = false;
  }

  navigationButtons.appendChild(prevButton);
  navigationButtons.appendChild(nextButton);

  formContainer.appendChild(navigationButtons);

  // Inicializar eventos para los botones
  initTabNavigation(formData.tabs.length);

  initTinyMCE();
}

// Función para inicializar la navegación entre tabs
function initTabNavigation(totalTabs) {
  const prevButton = document.getElementById("prevTabButton");
  const nextButton = document.getElementById("nextTabButton");

  prevButton.addEventListener("click", () => {
    navigateTab(-1, totalTabs);
  });

  nextButton.addEventListener("click", () => {
    navigateTab(1, totalTabs);
  });

  // Actualizar estado de los botones cuando cambie el tab manualmente
  const tabLinks = document.querySelectorAll("#customTabs .nav-link");
  tabLinks.forEach((link) => {
    link.addEventListener("shown.bs.tab", () => {
      updateButtonsState(totalTabs);
    });
  });
}

// Función para navegar entre tabs
function navigateTab(direction, totalTabs) {
  const activeTab = document.querySelector("#customTabs .nav-link.active");
  const tabs = Array.from(document.querySelectorAll("#customTabs .nav-link"));
  const currentIndex = tabs.indexOf(activeTab);
  const newIndex = currentIndex + direction;

  if (newIndex >= 0 && newIndex < totalTabs) {
    // Usar Bootstrap para activar el tab
    const nextTabElement = tabs[newIndex];
    const nextTab = new bootstrap.Tab(nextTabElement);
    nextTab.show();

    // Actualizar estado de los botones
    updateButtonsState(totalTabs);
  }
}

// Función para actualizar el estado de los botones
function updateButtonsState(totalTabs) {
  const activeTab = document.querySelector("#customTabs .nav-link.active");
  const tabs = Array.from(document.querySelectorAll("#customTabs .nav-link"));
  const currentIndex = tabs.indexOf(activeTab);

  const prevButton = document.getElementById("prevTabButton");
  const nextButton = document.getElementById("nextTabButton");
  const finishButton = document.getElementById("finishBtn");
  const herramientasIABtn = document.getElementById("herramientasIABtn");

  // Deshabilitar botón anterior en el primer tab
  prevButton.disabled = currentIndex === 0;

  // Deshabilitar botón siguiente en el último tab
  nextButton.disabled = currentIndex === totalTabs - 1;

  // Control del botón finalizar (siempre visible pero solo activo en último paso)
  finishButton.disabled = currentIndex !== totalTabs - 1;

  // Control del botón herramientas IA
  herramientasIABtn.disabled = currentIndex !== totalTabs - 1;
}

function initTinyMCE() {
  tinymce.init({
    selector: ".rich-text",
    height: 200,
    menubar: false,
    toolbar:
      "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist",
    plugins: "lists link image",
    branding: false,
  });
}

function captureFormValues(formData) {
  formData.tabs.forEach((tab) => {
    Object.keys(tab).forEach((card) => {
      if (typeof tab[card] === "object") {
        tab[card].forEach((card) => {
          card.fields.forEach((field) => {
            if (
              field.type === "checkbox" &&
              document.getElementById(field.id).checked
            ) {
              field.toggleFields.forEach((toggleField) => {
                if (toggleField.type === "select") {
                  formValues[toggleField.name] = document.getElementById(
                    toggleField.id
                  ).value;
                } else if (toggleField.type === "textarea") {
                  formValues[toggleField.name] = document.getElementById(
                    toggleField.id
                  ).value;
                }
              });
            } else if (field.type !== "checkbox") {
              formValues[field.name] = document.getElementById(field.id).value;

              const editor = tinymce.get(field.id);
              if (editor) {
                formValues[field.name] = editor.getContent();
              }
            }
          });
        });
      }
    });
  });
  return formValues;
}

function calcularIMC(pesoLibras, altura) {
  const pesoKg = pesoLibras * 0.45359237;

  const alturaMts = altura / 100;

  const imc = pesoKg / (alturaMts * alturaMts);

  return Math.round(imc * 100) / 100;
}

function actualizarIMC() {
  const pesoInput = document.getElementById("peso");
  const alturaInput = document.getElementById("altura");
  const imcInput = document.getElementById("imc");

  if (pesoInput && alturaInput && imcInput) {
    const pesoLibras = parseFloat(pesoInput.value);
    const altura = parseFloat(alturaInput.value);

    if (!isNaN(pesoLibras) && !isNaN(altura) && altura > 0) {
      const imc = calcularIMC(pesoLibras, altura);
      imcInput.value = imc;
    } else {
      imcInput.value = "";
    }
  }
}

function calcularGrasaCorporal(edad, sexo, imc) {
  let factorSexo = sexo.toLowerCase() === "hombre" ? 1 : 0;
  // Calcular el porcentaje de grasa corporal
  let grasaCorporal = 1.2 * imc + 0.23 * edad - 10.8 * factorSexo - 5.4;

  // Redondear a dos decimales
  return grasaCorporal.toFixed(2) + "%";
}

function calcularTensionArterialMedia(sistolica, diastolica) {
  const tam = (2 * diastolica + sistolica) / 3;

  return Math.round(tam * 100) / 100;
}

function actualizarTensionArterialMedia() {
  const sistolicaInput = document.getElementById("presionArterialSistolica");
  const diastolicaInput = document.getElementById("presionArterialDiastolica");
  const tamInput = document.getElementById("tensionArterialMedia");

  if (sistolicaInput && diastolicaInput && tamInput) {
    const sistolica = parseFloat(sistolicaInput.value);
    const diastolica = parseFloat(diastolicaInput.value);

    if (
      !isNaN(sistolica) &&
      !isNaN(diastolica) &&
      sistolica > 0 &&
      diastolica > 0
    ) {
      const tam = calcularTensionArterialMedia(sistolica, diastolica);
      tamInput.value = tam;
    } else {
      tamInput.value = "";
    }
  }
}

function calcularTotal() {
  const valorActividadMuscular =
    parseInt(
      document.querySelector('input[name="actividadMuscular"]:checked')?.value
    ) || 0;
  const valorRespiratorios =
    parseInt(
      document.querySelector('input[name="respiratorios"]:checked')?.value
    ) || 0;
  const valorCirculatorios =
    parseInt(
      document.querySelector('input[name="circulatorios"]:checked')?.value
    ) || 0;
  const valorEstadoConciencia =
    parseInt(
      document.querySelector('input[name="estadoConciencia"]:checked')?.value
    ) || 0;
  const valorColorMucosa =
    parseInt(
      document.querySelector('input[name="colorMucosas"]:checked')?.value
    ) || 0;
  let totalEscala = document.querySelector('label[for="totalEscala"]');
  const progresoEscala = document.getElementById("progresoEscala");

  const total =
    valorActividadMuscular +
    valorRespiratorios +
    valorCirculatorios +
    valorEstadoConciencia +
    valorColorMucosa;

  if (totalEscala.textContent.includes(":")) {
    const textoBase = totalEscala.textContent.split(":")[0].trim();
    totalEscala.textContent = `${textoBase}: ${total}`;
  } else {
    totalEscala.textContent = `Total: ${total}`;
  }

  let porcentaje = total * 10;
  if (progresoEscala) {
    progresoEscala.style.width = porcentaje + "%";
  }
}

function agregarNota() {
  const fechaNota = document.getElementById("fechaNota");
  const medicamentoNota = document.getElementById("medicamentoNota");
  const observacionesEnfermeria = tinymce.get("observacionesEnfermeria");
  const valorFecha = fechaNota.value;
  const valorMedicamento = medicamentoNota.value;
  const valorObservaciones = observacionesEnfermeria.getContent();
  // console.log("Observaciones ", valorObservaciones);

  if (!valorFecha || !valorMedicamento || !valorObservaciones) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const fechaFormateada = new Date(valorFecha).toLocaleString();

  // Verificar si ya existe la tabla, si no, crearla
  let tabla = document.getElementById("tablaNotes");
  let contenedorTabla;

  if (!tabla) {
    contenedorTabla = document.createElement("div");
    contenedorTabla.className = "table-responsive text-center mt-3";
    contenedorTabla.id = "contenedorTablaNotes";

    tabla = document.createElement("table");
    tabla.id = "tablaNotes";
    tabla.className = "table";
    tabla.style.width = "100%";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["#", "Fecha - Hora", "Medicamento", "Observaciones"];
    const widths = ["10%", "25%", "25%", "40%"];

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.width = widths[index];
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "tablaNotesBody";
    tabla.appendChild(tbody);

    // Agregar la tabla al contenedor y luego el contenedor después del botón
    contenedorTabla.appendChild(tabla);
    const boton = document.getElementById("agregarNotaBtn");
    boton.parentNode.insertBefore(contenedorTabla, boton.nextSibling);
  } else {
    contenedorTabla = document.getElementById("contenedorTablaNotes");
  }

  const tbody = document.getElementById("tablaNotesBody");

  const rowCount = tbody.children.length + 1;

  const newRow = document.createElement("tr");

  const celdaIndice = document.createElement("td");
  celdaIndice.textContent = rowCount;
  newRow.appendChild(celdaIndice);

  const celdaFecha = document.createElement("td");
  celdaFecha.textContent = fechaFormateada;
  newRow.appendChild(celdaFecha);

  const celdaMedicamento = document.createElement("td");
  celdaMedicamento.textContent = valorMedicamento;
  newRow.appendChild(celdaMedicamento);

  const celdaObservaciones = document.createElement("td");
  celdaObservaciones.innerHTML = valorObservaciones;
  newRow.appendChild(celdaObservaciones);

  tbody.appendChild(newRow);

  // fechaNota.value = "";
  medicamentoNota.value = "";
  observacionesEnfermeria.setContent("");
}
function agregarObservacion() {
  const fechaObservacion = document.getElementById("fechaObservacion");
  const observacionesPost = tinymce.get("observacionesPost");
  const valorFechaObs = fechaObservacion.value;
  const valorObservacionesPost = observacionesPost.getContent();
  // console.log("Observaciones ", valorObservacionesPost);

  if (!valorObservacionesPost) {
    alert("Por favor, completa todos los campos");
    return;
  }

  const fechaFormateada = new Date(valorFechaObs).toLocaleString();

  // Verificar si ya existe la tabla, si no, crearla
  let tabla = document.getElementById("tablaObservaciones");
  let contenedorTabla;

  if (!tabla) {
    contenedorTabla = document.createElement("div");
    contenedorTabla.className = "table-responsive text-center mt-3";
    contenedorTabla.id = "contenedorTablaObservaciones";

    tabla = document.createElement("table");
    tabla.id = "tablaObservaciones";
    tabla.className = "table";
    tabla.style.width = "100%";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["#", "Fecha - Hora", "Observaciones"];
    const widths = ["10%", "30%", "60%"];

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.width = widths[index];
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "tablaObservacionesBody";
    tabla.appendChild(tbody);

    // Agregar la tabla al contenedor y luego el contenedor después del botón
    contenedorTabla.appendChild(tabla);
    const boton = document.getElementById("agregarObservacionBtn");
    boton.parentNode.insertBefore(contenedorTabla, boton.nextSibling);
  } else {
    contenedorTabla = document.getElementById("contenedorTablaObservaciones");
  }

  const tbody = document.getElementById("tablaObservacionesBody");

  const rowCount = tbody.children.length + 1;

  const newRow = document.createElement("tr");

  const celdaIndice = document.createElement("td");
  celdaIndice.textContent = rowCount;
  newRow.appendChild(celdaIndice);

  const celdaFecha = document.createElement("td");
  celdaFecha.textContent = fechaFormateada;
  newRow.appendChild(celdaFecha);

  const celdaObservaciones = document.createElement("td");
  celdaObservaciones.innerHTML = valorObservacionesPost;
  newRow.appendChild(celdaObservaciones);

  tbody.appendChild(newRow);

  // fechaObservacion.value = "";
  observacionesPost.setContent("");
}

function agregarInforme() {
  const tipoInforme = document.getElementById("tipoInforme");
  const especialidad = document.getElementById("especialidad");
  const tipoTitulo = document.getElementById("tipoTitulo");
  const detalle = tinymce.get("detalle");
  const valorTipoInforme = tipoInforme.value;
  const valorEspecialidad = especialidad.value;
  const valorTipoTitulo = tipoTitulo.value;
  const valorDetalle = detalle.getContent();
  // console.log("Detalle: ", detalle);
  // console.log("Detalle value: ", detalle.getContent());
  // console.log("Observaciones ", valorObservacionesPost);

  if (!valorDetalle) {
    alert("Por favor, completa todos los campos");
    return;
  }

  // Verificar si ya existe la tabla, si no, crearla
  let tabla = document.getElementById("tablaInforme");
  let contenedorTabla;

  if (!tabla) {
    contenedorTabla = document.createElement("div");
    contenedorTabla.className = "table-responsive text-center mt-3";
    contenedorTabla.id = "contenedorTablaInforme";

    tabla = document.createElement("table");
    tabla.id = "tablaInforme";
    tabla.className = "table";
    tabla.style.width = "100%";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = ["#", "Tipo/Titulo", "Detalle"];
    const widths = ["10%", "30%", "60%"];

    headers.forEach((headerText, index) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.width = widths[index];
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    tabla.appendChild(thead);

    const tbody = document.createElement("tbody");
    tbody.id = "tablaInformeBody";
    tabla.appendChild(tbody);

    // Agregar la tabla al contenedor y luego el contenedor después del botón
    contenedorTabla.appendChild(tabla);
    const boton = document.getElementById("agregarInforme");
    boton.parentNode.insertBefore(contenedorTabla, boton.nextSibling);
  } else {
    contenedorTabla = document.getElementById("contenedorTablaInforme");
  }

  const tbody = document.getElementById("tablaInformeBody");

  const rowCount = tbody.children.length + 1;

  const newRow = document.createElement("tr");

  const celdaIndice = document.createElement("td");
  celdaIndice.textContent = rowCount;
  newRow.appendChild(celdaIndice);

  const celdaTipoTitulo = document.createElement("td");
  celdaTipoTitulo.textContent = valorTipoTitulo;
  newRow.appendChild(celdaTipoTitulo);

  const celdaDetalle = document.createElement("td");
  celdaDetalle.innerHTML = valorDetalle;
  newRow.appendChild(celdaDetalle);

  tbody.appendChild(newRow);

  tipoTitulo.value = "";
  detalle.setContent("");
}

function calcularPAM() {
  // Obtener los elementos por ID
  const tensionSistolica = document.getElementById("tensionSistólica");
  const tensionDiastolica = document.getElementById("tensionDiastólica");
  const pamResultado = document.getElementById("pam");
  const tensionArterialMedia = document.getElementById("tensionArterialMedia");

  // Obtener los valores como números
  const sistolica = parseFloat(tensionSistolica.value) || 0;
  const diastolica = parseFloat(tensionDiastolica.value) || 0;

  // Calcular la PAM usando la fórmula: PAM = (Sistólica + 2*Diastólica) / 3
  let pam = 0;
  if (sistolica > 0 && diastolica > 0) {
    pam = (sistolica + 2 * diastolica) / 3;
    // Redondear a cuatro decimales
    pam = parseFloat(pam.toFixed(4));
  }

  if (pamResultado) {
    pamResultado.value = pam;
  }

  if (tensionArterialMedia) {
    tensionArterialMedia.value = pam;
  }
}
