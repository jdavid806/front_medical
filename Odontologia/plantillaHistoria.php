<?php
include "../menu.php";
include "../header.php";
include "../NotasEnfermeria/notasEnfermeria.php";
$historialData = [
    [
        "titulo" => "Historial",
        "eventos" => [
            ["titulo" => "Consulta", "descripcion" => "Fecha: 2024-01-01", "start" => "2024-01-01"],
            ["titulo" => "Limipieza", "descripcion" => "Fecha Aplicación: 2024-01-15", "start" => "2024-01-15"],
            ["titulo" => "Pŕoxima cita", "descripcion" => "Fecha: 2024-03-01", "start" => "2024-03-01"]
        ]
    ]
];

// Convertimos el array PHP en JSON
$jsonData = json_encode($historialData);
?>


<link rel="stylesheet" href="./vacunas/css/vacunaStyle.css">



<div class="componete mt-5">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3 mt-5" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
                </ol>
            </nav>
        </div>
        <div class="row w-100">
            <div class="col-4">
                <div class="sticky-leads-sidebar mt-5">
                    <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed" id="productFilterColumn">
                        <div class="d-flex justify-content-between align-items-center mb-2 d-md-none">
                            <h3 class="mb-0">Información del Paciente</h3>
                            <button class="btn p-0" data-phoenix-dismiss="offcanvas"><span class="uil uil-times fs-7"></span></button>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="row align-items-center g-3 text-center text-xxl-start">
                                    <div class="col-12 col-xxl-auto">
                                        <div class="avatar avatar-5xl"><img class="rounded-circle" src="../../assets/img/team/33.webp" alt=""></div>
                                    </div>
                                    <div class="col-12 col-sm-auto flex-1">
                                        <h3 class="fw-bolder mb-2">Jefferson Dávila</h3>
                                        <p class="mb-0">RH O+</p><a class="fw-bold" href="#!"></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-5">
                                    <h3>Información General</h3>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-envelope-alt"> </span>
                                        <h5 class="text-body-highlight mb-0">Email</h5>
                                    </div><a href="mailto:shatinon@jeemail.com:">jefer@gmail.com</a>
                                </div>
                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-phone"> </span>
                                        <h5 class="text-body-highlight mb-0">Celular</h5>
                                    </div><a href="tel:+1234567890">+57305.....</a>
                                </div>

                                <div class="mb-4">
                                    <div class="d-flex align-items-center mb-1"><span class="me-2 uil uil-clock"></span>
                                        <h5 class="text-body-highlight mb-0">Ultima Consulta</h5>
                                    </div>
                                    <p class="mb-0 text-body-secondary">12 November 2021, 10:54 AM</p>
                                </div>

                            </div>
                        </div>
                        <div class="card mb-3">
                            <div class="card-body">
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Genero
                                    </div>
                                    <div>
                                        Masculino
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Edad
                                    </div>
                                    <div>
                                        21 Años
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Tipo de Sangre
                                    </div>
                                    <div>
                                        A Positivo
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Condicion Especial
                                    </div>
                                    <div>
                                        TDHA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Antecedentes
                                    </div>
                                    <div>
                                        TDHA, ASMA, HTA
                                    </div>
                                </div>
                                <div class="mb-4 border-bottom d-flex justify-content-between gap-3">
                                    <div class="fw-semibold">
                                        Whatsapp
                                    </div>
                                    <div>
                                        +57350........
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button class="btn btn-primary" type="button">
                                        <i class="fas fa-pencil"></i> &nbsp; Editar información
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="phoenix-offcanvas-backdrop d-lg-none top-0" data-phoenix-backdrop="data-phoenix-backdrop"></div>
                </div>
            </div>
            <div class="col-8">
                <h3>Historial de Odontologia</h3>
                <ul class="nav nav-underline fs-9" id="myTab" role="tablist">
                    <li class="nav-item"><a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#tab-home" role="tab" aria-controls="tab-home" aria-selected="true">Linea de Tiempo</a></li>
                    <li class="nav-item"><a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#tab-profile" role="tab" aria-controls="tab-profile" aria-selected="false">Nueva Historia</a></li>

                </ul>
                <div class="tab-content mt-3" id="myTabContent">
                    <div class="tab-pane fade show active" id="tab-home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="accordion" id="accordionHistorial">
                            <!-- El contenido será generado dinámicamente -->
                        </div>
                    </div>
                    <div class="tab-pane fade" id="tab-profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div id="crearHistoriaOdontologia">
                        <div id="tratamiento-3" class="tratamiento-div">
                    <form class="needs-validation">
                        <div class="tab-content mt-3" id="myTabContent">
                            <div class="tab-pane fade active show" id="signosVitalesTab" role="tabpanel"
                                aria-labelledby="signosVitales-tab">
                                <div class="d-flex justify-content-between gap-2 row" id="formContainer">

                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary" type="submit">Guardar Historia</button>
                    </form>
                </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>

</div>

<script>
    const historialData = <?php echo $jsonData; ?>;
</script>
<script src="./vacunas/scripts/vacunacionScripts.js"></script>

<script>
    const accordionContainer = document.getElementById("accordionHistorial");

historialData.forEach((section, index) => {
    const isActive = index === 0 ? "show" : "";
    const isCollapsed = index !== 0 ? "collapsed" : "";

    const accordionItem = `
     <div class="card">
      <div class="accordion-item">
          <h2 class="accordion-header" id="heading${index}">
              <button class="accordion-button ${isCollapsed}" type="button" 
                      data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                      aria-expanded="${index === 0
        }" aria-controls="collapse${index}">
                  ${section.titulo}
              </button>
          </h2>
          <div id="collapse${index}" class="accordion-collapse collapse ${isActive}" 
               aria-labelledby="heading${index}" data-bs-parent="#accordionHistorial">
              <div class="accordion-body">
                  <ul class="timeline">
                      ${section.eventos
            .map(
                (evento) => `
                              <li class="timeline-item">
                                  <h5 class="fw-bold">${evento.titulo}</h5>
                                  <p class="text-muted mb-1">${evento.descripcion}</p>
                              </li>`
            )
            .join("")}
                  </ul>
              </div>
          </div>
      </div>
     </div>
  `;
    accordionContainer.innerHTML += accordionItem;
});
</script>

<script>
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
      cardDiv.style.width = "20rem";

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
}

</script>



<?php
include "../footer.php";
include "./modalNuevaVacuna.php";
?>