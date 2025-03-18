let formValues = {};

document.addEventListener("DOMContentLoaded", async function () {
    console.log('xdxdxddd');

    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;

    console.log("Cargado", jsonPath);
    try {
        const response = await fetch(jsonPath);
        const formData = await response.json();

        generateForm(formData.form1);
        let ruta = obtenerRutaPrincipal() + "/medical/clinical-records/" + params.get("clinicalRecordId");

        try {
            const response = await fetch(ruta);
            const data = await response.json();

            formValues = data.data;

            fillFormWithData(formData.form1);
            console.log('Historia clinica: ', data);
        } catch (error) {
            console.error("Hubo un problema con la solicitud:", error);
        }
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }

    const pesoInput = document.getElementById("peso");
    const alturaInput = document.getElementById("altura");

    if (pesoInput && alturaInput) {
        pesoInput.addEventListener("input", actualizarIMC);
        alturaInput.addEventListener("input", actualizarIMC);

        actualizarIMC();
    }
    const sistolicaInput = document.getElementById("presionArterialSistolica");
    const diastolicaInput = document.getElementById("presionArterialDiastolica");

    if (sistolicaInput && diastolicaInput) {
        sistolicaInput.addEventListener("input", actualizarTensionArterialMedia);
        diastolicaInput.addEventListener("input", actualizarTensionArterialMedia);

        actualizarTensionArterialMedia();
    }
});

// Función para rellenar el formulario con los datos y deshabilitar los campos
function fillFormWithData(formData) {
    formData.tabs.forEach((tab) => {
        Object.keys(tab).forEach((key) => {
            if (key.startsWith("card")) {
                tab[key].forEach((card) => {
                    card.fields.forEach((field) => {
                        const fieldElement = document.getElementById(field.id);
                        if (fieldElement) {
                            // Rellenar el campo con el valor correspondiente
                            if (field.type === "checkbox") {
                                fieldElement.checked = formValues[field.id] || false;
                            } else if (field.type === "select") {
                                fieldElement.value = formValues[field.id] || "";
                            } else if (field.type === "textarea") {
                                const editor = tinymce.get(field.id);
                                if (editor) {
                                    editor.setContent(formValues[field.id] || "");
                                    console.log(editor);

                                } else {
                                    fieldElement.value = formValues[field.id] || "";
                                }
                            } else {
                                fieldElement.value = formValues[field.id] || "";
                            }

                            // Deshabilitar el campo
                            fieldElement.disabled = true;

                            // Manejar campos dependientes de un checkbox
                            if (field.type === "checkbox" && field.toggleFields) {
                                const subFieldsContainer = document.getElementById(`${field.id}-subfields`);
                                if (subFieldsContainer) {
                                    if (fieldElement.checked) {
                                        subFieldsContainer.classList.remove("d-none");
                                    } else {
                                        subFieldsContainer.classList.add("d-none");
                                    }

                                    field.toggleFields.forEach((subField) => {
                                        const subFieldElement = document.getElementById(subField.id);
                                        if (subFieldElement) {
                                            subFieldElement.value = formValues[subField.id] || "";
                                            subFieldElement.disabled = true;
                                        }
                                    });
                                }
                            }
                        }
                    });
                });
            }
        });
    });
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

    div.appendChild(labelEl);
    div.appendChild(select);
    return div;
}

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
                console.log("Archivo eliminado:", file.name);

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
                        .then((data) => {
                            console.log("Archivo eliminado del servidor:", data);
                        })
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
    div.style.minHeight = "550px"; // Aumentar altura para incluir botón
    div.style.border = "none"; // Eliminar borde
    div.style.outline = "none"; // Eliminar contorno

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
            } else {
                // Aquí es donde agregamos el input, tal como lo solicitaste
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

            subFieldsContainer.appendChild(subFieldDiv);
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

function createTextareaField(field) {
    // Crear el contenedor principal para el textarea
    let fieldDiv = document.createElement("div");
    // fieldDiv.classList.add("form-floating", "mb-3");
    if (field.class) {
        fieldDiv.classList.add(field.class);
    } else {
        fieldDiv.classList.add("col-12", "mb-3");
    }
    // Crear el textarea
    let textarea = document.createElement("textarea");
    textarea.classList.add("form-control");
    textarea.setAttribute("id", field.id);
    textarea.setAttribute("name", field.name);
    textarea.setAttribute("style", "height: 100px");

    if (field.placeholder) {
        textarea.setAttribute("placeholder", field.placeholder);
    }

    // Crear la etiqueta para el textarea
    let label = document.createElement("label");
    label.setAttribute("for", field.id);
    label.textContent = field.label;
    label.style.marginTop = "25px";
    label.style.fontWeight = "20px";
    label.classList.add("form-label");
    // if(field.class){
    // }
    // label.style.paddingBottom = "20px";

    // Agregar el textarea y la etiqueta al contenedor
    fieldDiv.appendChild(label);
    fieldDiv.appendChild(textarea);

    return fieldDiv;
}

function generateForm(formData) {
    console.log('Formdata: ', formData);

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

    // Deshabilitar botón anterior en el primer tab
    prevButton.disabled = currentIndex === 0;

    // Deshabilitar botón siguiente en el último tab
    nextButton.disabled = currentIndex === totalTabs - 1;
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
        disabled: true
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
    console.log("funcion" + formValues);
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

function calcularTensionArterialMedia(sistolica, diastolica) {
    const tam = ((2 * diastolica) + sistolica) / 3;

    return Math.round(tam * 100) / 100;
}

function actualizarTensionArterialMedia() {
    const sistolicaInput = document.getElementById("presionArterialSistolica");
    const diastolicaInput = document.getElementById("presionArterialDiastolica");
    const tamInput = document.getElementById("tensionArterialMedia");

    if (sistolicaInput && diastolicaInput && tamInput) {
        const sistolica = parseFloat(sistolicaInput.value);
        const diastolica = parseFloat(diastolicaInput.value);

        if (!isNaN(sistolica) && !isNaN(diastolica) && sistolica > 0 && diastolica > 0) {
            const tam = calcularTensionArterialMedia(sistolica, diastolica);
            tamInput.value = tam;
        } else {
            tamInput.value = "";
        }
    }
}