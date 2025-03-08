function getQueryParameter() {
  const path = window.location.pathname;
  const segments = path.split("/");
  let formName = segments[segments.length - 1];
  formName = formName.replace("consulta", "");
  console.log("El formulario es: " + formName);
  return formName;
}

document.addEventListener("DOMContentLoaded", () => {
  const formName = getQueryParameter("form") || "defaultForm";
  const userRole = "doctor";
  console.log("El rol del usuario es: " + userRole);

  fetch(`./Consultas/json/formConfig${formName}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No se pudo cargar el archivo JSON");
      }
      return response.json();
    })
    .then((config) => {
      generateForm(config, userRole);
      changeName(formName);
    })
    .catch((error) => console.error("Error al cargar el JSON:", error));
});

function changeName(name) {
  const titleElement = document.getElementById("tituloConsulta");
  if (titleElement) {
    titleElement.textContent = name;
  }
}

function createSelect(id, label, options) {
  const div = document.createElement("div");
  div.className = "mb-5 form-floating";

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

function generateForm(config, userRole) {
  const container = document.getElementById("formContainer");
  container.innerHTML = ""; // Limpia el contenido previo

  const navTabs = document.createElement("ul");
  navTabs.className = "nav nav-underline fs-9";
  const tabContent = document.createElement("div");
  tabContent.className = "tab-content";

  config.tabs.forEach((tab, index) => {
    // Crear enlace de la pestaña
    const tabLink = document.createElement("li");
    tabLink.className = "nav-item";

    const link = document.createElement("a");
    link.className = "nav-link";
    link.id = `${tab.id}-tab`;
    link.dataset.bsToggle = "tab";
    link.href = `#${tab.id}`;
    link.setAttribute("role", "tab");
    link.setAttribute("aria-controls", tab.id);
    link.setAttribute("aria-selected", index === 0 ? "true" : "false");
    link.textContent = tab.label;

    tabLink.appendChild(link);
    navTabs.appendChild(tabLink);

    // Crear el contenido de la pestaña
    const tabPane = document.createElement("div");
    tabPane.className = `tab-pane fade ${index === 0 ? "show active" : ""}`;
    tabPane.id = tab.id;
    tabPane.setAttribute("role", "tabpanel");
    tabPane.setAttribute("aria-labelledby", `${tab.id}-tab`);

    const cardsContainer = document.createElement("div");
    //SI no existe el atributo class en la pestaña, se asigna el valor por defecto
    cardsContainer.className =
      card.class || "d-flex justify-content-between gap-2";

    tab.cards.forEach((card) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";
      cardDiv.style.width = "50%";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("h5");
      cardTitle.className = "card-title";
      cardTitle.innerText = card.title;

      cardBody.appendChild(cardTitle);

      card.fields.forEach((field) => {
        // Verificar si el rol tiene acceso a este campo
        if (field.visibility && !field.visibility.includes(userRole)) {
          return; // Si no tiene acceso, omitir este campo
        }

        const fieldDiv = document.createElement("div");
        fieldDiv.className = "form-floating mb-3";

        if (field.type === "select") {
          // Llamar a createSelect si es un select
          const selectDiv = createSelect(field.id, field.label, field.options);
          cardBody.appendChild(selectDiv);
        } else {
          // Si no es select, crear el input normalmente
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
          cardBody.appendChild(fieldDiv);
        }
      });

      cardDiv.appendChild(cardBody);
      cardsContainer.appendChild(cardDiv);
    });

    tabPane.appendChild(cardsContainer);
    tabContent.appendChild(tabPane);
  });

  container.appendChild(navTabs);
  container.appendChild(tabContent);
}
