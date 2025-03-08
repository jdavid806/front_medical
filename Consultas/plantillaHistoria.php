<?php
include "../menu.php";
include "../header.php";

$recetas = [
  ['id' => 1, 'nombre' => 'Ibuprofeno', 'presentacion' => 'Tabletas 200mg', 'dosis' => '2 veces al día', 'fecha' => '2024-11-20', 'descripcion' => 'Receta para dolor de cabeza'],
  ['id' => 2, 'nombre' => 'Paracetamol', 'presentacion' => 'Tabletas 500mg', 'dosis' => 'Cada 8 horas', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para fiebre'],
  ['id' => 3, 'nombre' => 'Amoxicilina', 'presentacion' => 'Cápsulas 500mg', 'dosis' => '3 veces al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para infección respiratoria'],
  ['id' => 4, 'nombre' => 'Metformina', 'presentacion' => 'Tabletas 850mg', 'dosis' => '1 vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para diabetes tipo 2'],
  ['id' => 5, 'nombre' => 'Loratadina', 'presentacion' => 'Tabletas 10mg', 'dosis' => 'Una vez al día', 'fecha' => '2024-11-25', 'descripcion' => 'Receta para alergias'],
  ['id' => 6, 'nombre' => 'Omeprazol', 'presentacion' => 'Tabletas 20mg', 'dosis' => '1 vez al día antes de las comidas', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para acidez estomacal'],
  ['id' => 7, 'nombre' => 'Fluconazol', 'presentacion' => 'Cápsulas 150mg', 'dosis' => 'Una sola dosis', 'fecha' => '2024-11-26', 'descripcion' => 'Receta para infección vaginal'],
];

$paraclinicos = [
  [
    'id' => 1,
    'tipo' => 'Hemograma',
    'fecha' => '2024-11-20',
    'comentarios' => 'Valores dentro de los rangos normales'
  ],
  [
    'id' => 2,
    'tipo' => 'Química sanguínea',
    'fecha' => '2024-11-25',
    'comentarios' => 'Valores dentro de los rangos normales'
  ],
  [
    'id' => 3,
    'tipo' => 'Examen de orina',
    'fecha' => '2024-11-25',
    'comentarios' => 'Sin hallazgos patológicos'
  ],
  [
    'id' => 4,
    'tipo' => 'Ecografía abdominal',
    'fecha' => '2024-11-26',
    'comentarios' => 'Estudio sin hallazgos patológicos'
  ],
  [
    'id' => 5,
    'tipo' => 'Radiografía de tórax',
    'fecha' => '2024-11-26',
    'comentarios' => 'Estudio sin hallazgos patológicos'
  ],
];

?>

<style type="text/css">
  .custom-btn {
    width: 150px;
    /* Establece el ancho fijo */
    height: 40px;
    /* Establece la altura fija */
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin-bottom: 5px;
    /* Espaciado opcional entre botones */
  }

  .custom-btn i {
    margin-right: 5px;
    /* Espaciado entre el ícono y el texto */
  }
</style>
<div class="content">
  <div class="container">
    <nav class="mb-3" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
        <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
        <li class="breadcrumb-item"><a href="verPaciente?1">Miguel Angel Castro Franco</a></li>
        <li class="breadcrumb-item"><a href="consultas?1">Consultas</a></li>
        <li class="breadcrumb-item active" onclick="location.reload()">Nueva Consulta</li>
      </ol>
    </nav>
    <div class="row">
      <div class="col-12">
        <div class="row align-items-center justify-content-between">
          <div class="col-md-6">
            <h2 class="mb-0">Nueva Consulta</h2>
            <small>
              Miguel Angel Castro Franco
            </small>
          </div>
        </div>
      </div>
    </div>




    <div class="row g-0 g-md-4 g-xl-6 p-3">

      <div class="col-md-7 col-lg-7 col-xl-8">

        <div class="steps-container mb-4">
          <ul class="steps">
            <li class="step active" data-step="1">
              <span class="step-number">1</span>
              <span class="step-label">Contacto de Emergencia</span>
            </li>
            <li class="step" data-step="2">
              <span class="step-number">2</span>
              <span class="step-label">Antecedentes Personales</span>
            </li>
            <li class="step" data-step="3">
              <span class="step-number">3</span>
              <span class="step-label">Antecedentes Familiares</span>
            </li>
            <li class="step" data-step="4">
              <span class="step-number">3</span>
              <span class="step-label">Alergias y Medicamentos</span>
            </li>
            <li class="step" data-step="5">
              <span class="step-number">3</span>
              <span class="step-label">Afiliación</span>
            </li>
          </ul>
        </div>

        <div id="formContainer">
          <!-- Contenido dinamico -->
        </div>


      </div>

      <div class="col-md-5 col-lg-5 col-xl-4">
        <div class="sticky-leads-sidebar">
          <div class="lead-details-offcanvas bg-body scrollbar phoenix-offcanvas phoenix-offcanvas-fixed"
            id="productFilterColumn">
            <div class="card mb-3">
              <div class="card-body">
                <div class="row align-items-center g-3 text-center text-xxl-start">
                  <div class="col-12 col-xxl-auto">
                    <div class="avatar avatar-5xl"><img class="rounded-circle"
                        src="<?= $ConfigNominaUser['logoBase64'] ?>" alt="" /></div>
                  </div>
                  <div class="col-12 col-sm-auto flex-1">
                    <h3 class="fw-bold mb-2">Miguel Angel Castro Franco</h3>
                  </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-12 col-lg-12 col-xl-12">
        <div>
          <div class="container">
            <div class="row align-items-center">
              <div class="col-6">
                <div class="timer">
                  Tiempo en consulta: <span id="timer">00:00:00</span>
                </div>
              </div>
              <div class="col-3">
                <a href="consultas?1" class="btn btn-danger" id="cancelBtn">Cancelar consulta</a>
              </div>
              <div class="col-3">
                <button class="btn btn-primary" id="finishBtn" type="button" data-bs-toggle="modal"
                  data-bs-target="#finishModal">Terminar consulta</button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>


  <style>
    .profile-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid #ddd;
    }

    video {
      display: none;
      width: 100%;
      max-width: 300px;
      border-radius: 10px;
      border: 2px solid #ddd;
    }

    .steps-container {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 0.5rem;
    }

    .steps {
      list-style: none;
      display: flex;
      justify-content: space-between;
      padding: 0;
      margin: 0;
    }

    .step {
      text-align: center;
      position: relative;
      flex: 1;
    }

    .step-number {
      display: inline-block;
      width: 30px;
      height: 30px;
      line-height: 30px;
      border-radius: 50%;
      background-color: #e9ecef;
      color: #0d6efd;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .step.active .step-number {
      background-color: #0d6efd;
      color: #fff;
    }

    .wizard-step {
      display: none;
    }

    .wizard-step.active {
      display: block;
    }
  </style>



  <script>
    
    function generarFormulario(formConfig) {
      const form = document.createElement("form");
      form.id = formConfig.formId;
      form.className = "needs-validation";
      form.noValidate = true;

      const wizardContent = document.createElement("div");
      wizardContent.className = "wizard-content";

      formConfig.steps.forEach((stepConfig) => {
        const stepDiv = document.createElement("div");
        stepDiv.className = `wizard-step ${stepConfig.step === 1 ? "active" : ""}`;
        stepDiv.setAttribute("data-step", stepConfig.step);

        const stepTitle = document.createElement("h5");
        stepTitle.textContent = stepConfig.title;
        stepDiv.appendChild(stepTitle);

        // Si `fields` existe, renderizar los campos
        if (stepConfig.fields) {
          stepConfig.fields.forEach((field) => {
            agregarCampo(field, stepDiv);
          });
        }

        // Si `subsections` existe, renderizar subsecciones y sus campos
        if (stepConfig.subsections) {
          stepConfig.subsections.forEach((subsection) => {
            const subsectionTitle = document.createElement("h6");
            subsectionTitle.textContent = subsection.title;
            stepDiv.appendChild(subsectionTitle);

            subsection.fields.forEach((field) => {
              agregarCampo(field, stepDiv);
            });
          });
        }

        // Si `sections` existe, renderizar secciones y sus campos
        if (stepConfig.sections) {
          stepConfig.sections.forEach((section) => {
            const sectionDiv = document.createElement("div");

            const sectionTitle = document.createElement("h6");
            sectionTitle.textContent = section.label;
            sectionDiv.appendChild(sectionTitle);

            section.fields.forEach((field) => {
              agregarCampo(field, sectionDiv);
            });

            stepDiv.appendChild(sectionDiv);
          });
        }

        wizardContent.appendChild(stepDiv);
      });

      form.appendChild(wizardContent);
      return form;
    }

    // Función para agregar un campo al formulario
    function agregarCampo(field, parentElement) {
      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group mb-3";

      const formFloating = document.createElement("div");
      formFloating.className = "form-floating";

      let inputElement;
      if (field.type === "textarea") {
        inputElement = document.createElement("textarea");
        inputElement.style.height = "100px";
      } else if (field.type === "select") {
        inputElement = document.createElement("select");
        field.options.forEach((option) => {
          const optionElement = document.createElement("option");
          optionElement.value = option;
          optionElement.textContent = option;
          inputElement.appendChild(optionElement);
        });
      } else if (field.type === "checkbox") {
        inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        // Agregar el onchange aquí
        if (field.onchange) {
          inputElement.setAttribute("onchange", field.onchange);
        }
      } else {
        inputElement = document.createElement("input");
        inputElement.type = field.type;
      }

      inputElement.id = field.id;
      inputElement.name = field.id;
      inputElement.className = "form-control";
      inputElement.required = field.required || false;
      inputElement.placeholder = field.placeholder || "";

      const label = document.createElement("label");
      label.htmlFor = field.id;
      label.textContent = field.label || "";

      formFloating.appendChild(inputElement);
      formFloating.appendChild(label);

      if (field.required) {
        const invalidFeedback = document.createElement("div");
        invalidFeedback.className = "invalid-feedback";
        invalidFeedback.textContent = field.validation || "Este campo es obligatorio";
        formFloating.appendChild(invalidFeedback);
      }

      inputGroup.appendChild(formFloating);
      parentElement.appendChild(inputGroup);
    }


    // Función para navegar entre pasos
    function navegarPasos(direccion) {
      const pasos = document.querySelectorAll(".wizard-step");
      let pasoActual = document.querySelector(".wizard-step.active");

      if (direccion === "siguiente") {
        const siguientePaso = pasoActual.nextElementSibling;
        if (siguientePaso && siguientePaso.classList.contains("wizard-step")) {
          pasoActual.classList.remove("active");
          siguientePaso.classList.add("active");
        }
      } else if (direccion === "anterior") {
        const pasoAnterior = pasoActual.previousElementSibling;
        if (pasoAnterior && pasoAnterior.classList.contains("wizard-step")) {
          pasoActual.classList.remove("active");
          pasoAnterior.classList.add("active");
        }
      }
    }

    // Cargar el JSON desde otra carpeta
    async function cargarFormulario() {
      try {

        const response = await fetch("./Consultas/json/consultaPrueba.json");
        if (!response.ok) {
          throw new Error("No se pudo cargar el archivo JSON");
        }
        const formConfig = await response.json();


        const formContainer = document.getElementById("formContainer");


        const formulario = generarFormulario(formConfig);
        formContainer.appendChild(formulario);

        // Agregar botones de navegación
        const botonesNavegacion = `
          <div class="d-flex justify-content-between mt-4">
            <button type="button" class="btn btn-secondary" onclick="navegarPasos('anterior')">Anterior</button>
            <button type="button" class="btn btn-primary" onclick="navegarPasos('siguiente')">Siguiente</button>
          </div>
        `;
        formContainer.insertAdjacentHTML("beforeend", botonesNavegacion);
      } catch (error) {
        console.error("Error al cargar el formulario:", error);
      }
    }
    document.addEventListener("DOMContentLoaded", cargarFormulario);
  </script>



  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const timerElement = document.getElementById('timer');
      const finishBtn = document.getElementById('finishBtn');
      const modalTimer = document.getElementById('modalTimer');

      let startTime = new Date();

      function updateTimer() {
        const now = new Date();
        const elapsedTime = now - startTime;
        const hours = Math.floor(elapsedTime / 3600000);
        const minutes = Math.floor((elapsedTime % 3600000) / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }

      setInterval(updateTimer, 1000);

      finishBtn.addEventListener('click', () => {
        if (modalTimer) {
          modalTimer.value = timerElement.textContent; // Asignar valor al modal
        } else {
          console.log('Error al buscar el temporizador del modal.');
        }
      });
    });

  </script>


  <script>
    let currentStep = 1;

    const updateWizard = () => {
      // Actualizar los pasos visuales
      document.querySelectorAll('.step').forEach(step => {
        step.classList.toggle('active', step.dataset.step == currentStep);
      });

      // Mostrar el contenido correspondiente
      document.querySelectorAll('.wizard-step').forEach(step => {
        step.classList.toggle('active', step.dataset.step == currentStep);
      });

      // Controlar los botones
      document.getElementById('prevStep').disabled = currentStep === 1;
      document.getElementById('nextStep').classList.toggle('d-none', currentStep === 5);
      document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 5);
    };

    document.getElementById('nextStep').addEventListener('click', () => {
      const currentForm = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
      if (currentForm.querySelector(':invalid')) {
        currentForm.querySelector(':invalid').focus();
        currentForm.classList.add('was-validated');
      } else {
        currentStep++;
        updateWizard();
      }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
      currentStep--;
      updateWizard();
    });

    updateWizard();
  </script>


  <?php include "../footer.php";
  include "../Incapacidades/modalIncapacidad.php";
  include "../Recetas/modalReceta.php";
  include "../Paraclinicos/modalParaclinico.php";
  include "./modalTerminarConsulta.php";
  ?>