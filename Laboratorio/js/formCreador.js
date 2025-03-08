let formValues = {};

document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/formData.json`;

    try {
        const response = await fetch(jsonPath);
        const formData = await response.json();
        generateForm(formData.form1);
        addCustomField();
        // updateTimer();
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
    let fieldDiv = document.createElement("div");
    fieldDiv.classList.add("form-floating", "mb-3");

    // Crear el textarea
    let textarea = document.createElement("textarea");
    textarea.classList.add("rich-text");
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

    // Inicializar TinyMCE si es necesario
    setTimeout(() => {
        if (typeof tinymce !== "undefined") {
            tinymce.init({
                selector: `#${field.id}`,
                menubar: false,
                plugins: "autoresize link image",
                toolbar: "bold italic underline | link image | undo redo",
                height: 200
            });
        }
    }, 0);

    return fieldDiv;
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
                            fieldDiv = createTextareaField(field);
                        }

                        cardBody.appendChild(fieldDiv);
                    });

                    // Botón para agregar campo a la tarjeta
                    const addFieldButton = document.createElement("button");
                    addFieldButton.className = "btn btn-primary btn-sm mt-2";
                    addFieldButton.innerText = "Agregar Campo";
                    addFieldButton.onclick = function () {
                        showAddFieldModal(cardBody);
                    };
                    cardBody.appendChild(addFieldButton);

                    cardElement.appendChild(cardBody);
                    cardDiv.appendChild(cardElement);
                    cardRow.appendChild(cardDiv);
                });
            }
        });

        tabPane.appendChild(cardRow);

        const addCardButtonContainer = document.createElement("div");
        addCardButtonContainer.className = "text-center mt-3";

        const addCardButton = document.createElement("button");
        addCardButton.className = "btn btn-primary btn-add-card";
        addCardButton.innerText = "Agregar Tarjeta";
        addCardButton.onclick = function () {
            addNewCard(tabPane);
        };

        addCardButtonContainer.appendChild(addCardButton);
        tabPane.appendChild(addCardButtonContainer);

        tabContent.appendChild(tabPane);
    });

    formContainer.appendChild(navTabs);
    formContainer.appendChild(tabContent);

    // Crear y agregar el botón de "Agregar Pestaña" al final de las pestañas
    addAddTabButton(navTabs);

    initTinyMCE();
}

function addAddTabButton(navTabs) {
    // Crear contenedor para el botón
    const addTabButtonContainer = document.createElement("li");
    addTabButtonContainer.className = "nav-item";

    const addTabButton = document.createElement("button");
    addTabButton.className = "btn btn-primary";
    addTabButton.innerText = "Agregar Pestaña";
    addTabButton.onclick = function () {
        addNewTab(navTabs);
    };

    addTabButtonContainer.appendChild(addTabButton);
    
    // Mover el botón siempre al final de la lista
    navTabs.appendChild(addTabButtonContainer);
}

// Función para agregar una nueva pestaña
function addNewTab(navTabs) {
    const tabId = `tab-${Date.now()}`;

    // Crear la nueva pestaña en la barra de navegación
    const tabLink = document.createElement("li");
    tabLink.className = "nav-item";

    const link = document.createElement("a");
    link.className = "nav-link";
    link.id = `${tabId}-tab`;
    link.dataset.bsToggle = "tab";
    link.href = `#${tabId}`;
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", tabId);
    link.setAttribute("aria-selected", "false");
    link.textContent = prompt("Ingrese el nombre de la nueva pestaña:");

    tabLink.appendChild(link);
    navTabs.insertBefore(tabLink, navTabs.lastElementChild); // Insertar antes del último elemento, que es el botón de agregar

    // Crear el contenido de la nueva pestaña
    const tabContent = document.getElementById("formContainer").querySelector(".tab-content");
    const tabPane = document.createElement("div");
    tabPane.className = "tab-pane fade";
    tabPane.id = tabId;
    tabPane.setAttribute("role", "tabpanel");
    tabPane.setAttribute("aria-labelledby", `${tabId}-tab`);

    const cardRow = document.createElement("div");
    cardRow.className = "row";
    tabPane.appendChild(cardRow);

    tabContent.appendChild(tabPane);

    // Actualizar los atributos de aria-selected en el tab que acaba de ser agregado
    link.setAttribute("aria-selected", "true");

    // Activa la pestaña recién creada (mostrando su contenido)
    const activeTab = navTabs.querySelector(".nav-link.active");
    if (activeTab) {
        activeTab.classList.remove("active");
    }
    link.classList.add("active");

    const activeTabContent = tabContent.querySelector(".tab-pane.show.active");
    if (activeTabContent) {
        activeTabContent.classList.remove("show", "active");
    }
    tabPane.classList.add("show", "active");

    // Agregar una tarjeta por defecto si lo deseas
    addNewCard(tabPane);
}


function addNewCard(tabPane) {
    const cardId = `card-${Date.now()}`;

    // 📌 Buscar el row existente dentro de la pestaña
    let cardRow = tabPane.querySelector(".row");
    
    if (!cardRow) {
        // Si no existe, lo creamos
        cardRow = document.createElement("div");
        cardRow.className = "row";
        tabPane.insertBefore(cardRow, tabPane.querySelector(".text-center.mt-3"));
    }

    // Crear columna para la card
    const cardDiv = document.createElement("div");
    cardDiv.className = "col-12 col-md-6 col-lg-4 mb-3";

    const cardElement = document.createElement("div");
    cardElement.className = "card";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.innerText = prompt("Ingrese el nombre de la tarjeta:", "Nueva Tarjeta");

    cardBody.appendChild(cardTitle);

    // Botón para agregar campos
    const addFieldButton = document.createElement("button");
    addFieldButton.className = "btn btn-primary btn-sm mt-2";
    addFieldButton.innerText = "Agregar Campo";
    addFieldButton.onclick = function () {
        showAddFieldModal(cardBody);
    };

    cardBody.appendChild(addFieldButton);
    cardElement.appendChild(cardBody);
    cardDiv.appendChild(cardElement);
    
    cardRow.appendChild(cardDiv);
}




function addCustomField(targetContainer, modal) {
    const fieldType = document.getElementById("fieldType").value;
    const fieldLabel = document.getElementById("fieldLabel").value;
    let newField;

    if (!fieldLabel.trim()) {
        alert("Debe ingresar una etiqueta para el campo.");
        return;
    }

    const fieldId = `field-${Date.now()}`;

    switch (fieldType) {
        case "text":
            newField = createTextareaField({ id: fieldId, name: fieldId, label: fieldLabel });
            break;
        case "textarea":
            newField = createTextareaField({ id: fieldId, name: fieldId, label: fieldLabel });
            break;
        case "select":
            const options = document.getElementById("selectOptions").value
                .split(",")
                .map(opt => ({ value: opt.trim(), text: opt.trim() }));
            newField = createSelect(fieldId, fieldLabel, options);
            break;
        case "checkbox":
            newField = createCheckboxWithSubfields({ id: fieldId, name: fieldId, label: fieldLabel });
            break;
        default:
            alert("Tipo de campo no válido.");
            return;
    }

    // Obtener el botón "Agregar Campo"
    const addFieldButton = targetContainer.querySelector(".btn-primary");

    if (addFieldButton) {
        // Insertar el nuevo campo antes del botón
        targetContainer.insertBefore(newField, addFieldButton);
    } else {
        targetContainer.appendChild(newField);
    }

    bootstrap.Modal.getInstance(modal).hide();
}






function showAddFieldModal(targetContainer) {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "addFieldModal";
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Agregar Nuevo Campo</h5>
                    <button type="button" class="close" data-bs-dismiss="modal">&times;</button>
                </div>
                <div class="modal-body">
                    <label>Tipo de Campo:</label>
                    <select id="fieldType" class="form-select">
                        <option value="text">Texto</option>
                        <option value="textarea">Área de Texto</option>
                        <option value="select">Seleccionable</option>
                        <option value="checkbox">Checkbox</option>
                    </select>

                    <label class="mt-2">Etiqueta:</label>
                    <input type="text" id="fieldLabel" class="form-control">

                    <div id="selectOptionsContainer" class="d-none mt-2">
                        <label>Opciones (separadas por comas):</label>
                        <input type="text" id="selectOptions" class="form-control">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button class="btn btn-primary" id="saveFieldButton">Guardar</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();

    document.getElementById("fieldType").addEventListener("change", function () {
        const selectOptionsContainer = document.getElementById("selectOptionsContainer");
        selectOptionsContainer.classList.toggle("d-none", this.value !== "select");
    });

    modal.dataset.targetContainer = targetContainer;


    document.getElementById("saveFieldButton").addEventListener("click", function () {
        addCustomField(targetContainer, modal);
    });
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

