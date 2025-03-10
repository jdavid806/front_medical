import { clinicalRecordService } from "../../services/api/index.js";

let formValues = {};

document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/formData.json`;
    // const timerElement = document.getElementById('timer');
    // const finishBtn = document.getElementById('finishBtn');
    // const modalTimer = document.getElementById('modalTimer');
    // let startTime = new Date();
    try {
        const response = await fetch(jsonPath);
        const formData = await response.json();

        generateForm(formData.form1);
        // updateTimer();

        document.getElementById("finalizarConsulta").addEventListener("click", function () {
            captureFormValues(formData.form1);
            console.log("Valores capturados:", formValues);
            clinicalRecordService.create({
                "clinical_record_type_id": 1,
                "created_by_user_id": 1,
                "branch_id": 1,
                "data": formValues
            }).then(() => AlertManager.success({
                text: 'Se ha creado el registro exitosamente',
                onClose: () => {
                    window.location.reload();
                }
            })).catch(err => {
                if (err.data?.errors) {
                    AlertManager.formErrors(err.data.errors);
                } else {
                    AlertManager.error({
                        text: err.message || 'Ocurrió un error inesperado'
                    });
                }
            });
        });
    } catch (error) {
        console.error("Error cargando el JSON:", error);
    }
});

function createSelect(id, label, options) {
    const div = document.createElement("div");
    div.className = "mb-3 form-floating";

    const select = document.createElement("select");
    select.className = "form-select";
    select.id = id;
    select.name = id;

    const defaultOption = document.createElement("option");
    defaultOption.selected = true;
    defaultOption.disabled = true;
    defaultOption.value = "";
    defaultOption.textContent = "Seleccione";
    select.appendChild(defaultOption);

    options.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        select.appendChild(opt);
    });

    const labelEl = document.createElement("label");
    labelEl.setAttribute("for", id);
    labelEl.className = "form-label";
    labelEl.textContent = label;

    div.appendChild(select);
    div.appendChild(labelEl);
    return div;
}
function createImageField(field) {
    const div = document.createElement("div");
    div.className = "mb-3";

    const img = document.createElement("img");
    img.id = field.id;
    img.name = field.name;
    img.src = field.src;
    img.alt = field.alt;
    img.className = "img-fluid";  // Bootstrap para que sea responsiva
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
    fieldDiv.classList.add("form-check", "mb-3", "p-0");


    let checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input");
    checkbox.setAttribute("id", field.id);
    checkbox.setAttribute("name", field.name);
    checkbox.setAttribute("type", "checkbox");

    let label = document.createElement("label");
    label.classList.add("form-check-label", "mt-2");
    label.setAttribute("for", field.id);
    label.textContent = field.label;

    let switchDiv = document.createElement("div");
    switchDiv.classList.add("form-check", "form-switch", "mb-2");
    switchDiv.appendChild(checkbox);

    fieldDiv.appendChild(switchDiv);
    fieldDiv.appendChild(label);

    let subFieldsContainer = document.createElement("div");
    subFieldsContainer.setAttribute("id", `${field.id}-subfields`);
    subFieldsContainer.classList.add("d-none");

    if (field.toggleFields) {
        field.toggleFields.forEach(subField => {
            let subFieldDiv = document.createElement("div");
            subFieldDiv.classList.add("mb-2", "form-floating");

            if (subField.type === "select") {
                let select = document.createElement("select");
                select.classList.add("form-select");
                select.setAttribute("id", subField.id);
                select.setAttribute("name", subField.name);

                // Agregar opciones al select
                subField.options.forEach(optionText => {
                    let option = document.createElement("option");
                    option.value = optionText;
                    option.textContent = optionText;
                    select.appendChild(option);
                });

                let selectLabel = document.createElement("label");
                selectLabel.setAttribute("for", subField.id);
                selectLabel.textContent = subField.label;

                subFieldDiv.appendChild(select);
                subFieldDiv.appendChild(selectLabel);
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

                subFieldDiv.appendChild(textarea);
                subFieldDiv.appendChild(textareaLabel);
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
    fieldDiv.classList.add("form-floating", "mb-3");

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
    // label.style.paddingBottom = "20px";


    // Agregar el textarea y la etiqueta al contenedor
    fieldDiv.appendChild(textarea);
    fieldDiv.appendChild(label);

    return fieldDiv;
}

function createDropzoneField(field) {
    // Crear el contenedor principal del formulario
    let form = document.createElement("form");
    form.classList.add("dropzone", "dropzone-multiple", "p-0", "dz-clickable", "dz-file-processing");
    form.setAttribute("id", field.id);
    form.setAttribute("data-dropzone", "data-dropzone");
    form.setAttribute("action", field.action || "#!");

    // Crear el mensaje de Dropzone
    let dzMessage = document.createElement("div");
    dzMessage.classList.add("dz-message");
    dzMessage.setAttribute("data-dz-message", "data-dz-message");

    let img = document.createElement("img");
    img.classList.add("me-2");
    img.setAttribute("src", "../../../assets/img/icons/cloud-upload.svg");
    img.setAttribute("width", "25");
    img.setAttribute("alt", "Upload icon");

    dzMessage.appendChild(img);
    dzMessage.appendChild(document.createTextNode("Drop your files here"));

    // Crear el contenedor de vista previa de archivos
    let dzPreviewContainer = document.createElement("div");
    dzPreviewContainer.classList.add("dz-preview", "dz-preview-multiple", "m-0", "d-flex", "flex-column");

    // Estructura de vista previa de archivo
    let filePreview = `
        <div class="d-flex mb-3 pb-3 border-bottom border-translucent media">
            <div class="border p-2 rounded-2 me-2">
                <img class="rounded-2 dz-image" src="../../../assets/img/icons/file.png" alt="..." data-dz-thumbnail="data-dz-thumbnail">
            </div>
            <div class="flex-1 d-flex flex-between-center">
                <div>
                    <h6 data-dz-name="data-dz-name">Filename.jpg</h6>
                    <div class="d-flex align-items-center">
                        <p class="mb-0 fs-9 text-body-quaternary lh-1" data-dz-size="data-dz-size"><strong>0.3</strong> MB</p>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress=""></span></div>
                    </div>
                    <span class="fs-10 text-danger" data-dz-errormessage="data-dz-errormessage"></span>
                </div>
                <div class="dropdown">
                    <button class="btn btn-link text-body-tertiary btn-sm dropdown-toggle btn-reveal dropdown-caret-none" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end border border-translucent py-2">
                        <a class="dropdown-item" href="#!" data-dz-remove="data-dz-remove">Remove File</a>
                    </div>
                </div>
            </div>
        </div>`;

    dzPreviewContainer.innerHTML = filePreview;

    // Agregar los elementos al formulario
    form.appendChild(dzMessage);
    form.appendChild(dzPreviewContainer);

    return form;
}


function generateForm(formData) {
    const tabsContainer = document.getElementById("tabsContainer");
    const formContainer = document.getElementById("formContainer");
    formContainer.innerHTML = "";
    tabsContainer.innerHTML = "";

    const navTabs = document.createElement("ul");
    navTabs.className = "nav nav-tabs";
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
                    cardDiv.className = "col-12 col-md-6 col-lg-4 mb-3";

                    const cardElement = document.createElement("div");
                    cardElement.className = "card";

                    const cardBody = document.createElement("div");
                    cardBody.className = "card-body";

                    const cardTitle = document.createElement("h5");
                    cardTitle.className = "card-title";
                    cardTitle.innerText = card.title;
                    cardBody.appendChild(cardTitle);

                    card.fields.forEach((field) => {
                        let fieldDiv;

                        if (field.type === "select") {
                            fieldDiv = createSelectField(field);
                        } else if (field.type === "checkbox") {
                            fieldDiv = createCheckboxWithSubfields(field);
                        } else if (field.type === "textarea") {
                            fieldDiv = createTextareaField(field);
                            fieldDiv.querySelector('textarea').classList.add('rich-text');
                        } else if (field.type === "image") {
                            fieldDiv = createImageField(field);
                        } else if (field.type === "file") {
                            fieldDiv = createDropzoneField(field);
                        } else {
                            fieldDiv = document.createElement("div");
                            fieldDiv.className = "form-floating mb-3";

                            const input = document.createElement("input");
                            input.type = field.type;
                            input.id = field.id;
                            input.name = field.id;
                            input.className = "form-control";
                            if (field.readonly) input.readOnly = true;

                            const label = document.createElement("label");
                            label.htmlFor = field.id;
                            label.innerText = field.label;

                            fieldDiv.appendChild(input);
                            fieldDiv.appendChild(label);
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

    initTinyMCE();
}





function initTinyMCE() {
    tinymce.init({
        selector: '.rich-text',
        height: 150,
        menubar: false,
        toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist',
        plugins: 'lists link image',
        branding: false,
    });
}

// function updateTimer() {
//     const now = new Date();
//     const elapsedTime = now - startTime;
//     const hours = Math.floor(elapsedTime / 3600000);
//     const minutes = Math.floor((elapsedTime % 3600000) / 60000);
//     const seconds = Math.floor((elapsedTime % 60000) / 1000);
//     timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
// }

// setInterval(updateTimer, 1000);

// finishBtn.addEventListener('click', () => {
//     if (modalTimer) {
//         modalTimer.value = timerElement.textContent;
//     } else {
//         console.log('Error al buscar el temporizador del modal.');
//     }
// });