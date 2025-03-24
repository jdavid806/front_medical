<style>
  #tabs-configEncuentsa {
    width: 200px;
    /* Ajusta este valor según el diseño deseado */
  }

  #tabs-configEncuentsa .nav-link {
    white-space: nowrap;
    /* Evita que el texto se divida en varias líneas */
  }
</style>
<div class="card mb-3 p-3">
  <div class="d-flex">
    <ul class="nav nav-underline fs-9 flex-column me-3" id="tabs-configEncuentsa" role="tablist">
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-pane"
          type="button" role="tab" aria-controls="general-tab-pane" aria-selected="true">
          <i class="fa-solid fa-circle-info"></i> Configuración Mensajes
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button class="nav-link" id="facturacion-tab" data-bs-toggle="tab" data-bs-target="#facturacion-tab-pane"
          type="button" role="tab" aria-controls="facturacion-tab-pane" aria-selected="false">
          <i class="fa-solid fa-file-invoice"></i> Configuracion Encuesta
        </button>
      </li>
    </ul>
    <div class="tab-content mt-3" id="configTabsContent">
      <!-- Configuración Mensaje -->
      <div class="tab-pane fade show active" id="general-tab-pane" role="tabpanel" aria-labelledby="general-tab">
        <div class="card">
          <div class="card-body">
            <!-- Tabs horizontales -->
            <ul class="nav nav-underline" id="myTabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button class="nav-link active" id="envio-tab" data-bs-toggle="tab" data-bs-target="#envio-pane"
                  type="button" role="tab" aria-controls="envio-pane" aria-selected="true">
                  <i class="fas fa-paper-plane"></i> Envío
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button class="nav-link" id="finalizada-tab" data-bs-toggle="tab" data-bs-target="#finalizada-pane"
                  type="button" role="tab" aria-controls="finalizada-pane" aria-selected="false">
                  <i class="fas fa-check-circle"></i> Encuesta completada
                </button>
              </li>
            </ul>

            <!-- Contenido de los tabs -->
            <div class="tab-content" id="myTabsContent">
              <!-- Tab de Envío -->
              <div class="tab-pane fade show active" id="envio-pane" role="tabpanel" aria-labelledby="envio-tab">
                <div class="card mt-3">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div class="rich-text-react me-3" id="envio-content"></div>
                      <div>
                        <div class="mb-2">
                          <label class="form-label">Tipo Plantilla</label>
                          <select class="form-select" id="plantilla-envio">
                            <option value="whatsapp">WhatsApp</option>
                            <option value="correo">Correo</option>
                          </select>
                        </div>
                        <button class="btn btn-success mt-2 w-100" id="guardar-envio">
                          <i class="fas fa-save"></i> Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tab de Encuesta completada -->
              <div class="tab-pane fade" id="finalizada-pane" role="tabpanel" aria-labelledby="finalizada-tab">
                <div class="card mt-3">
                  <div class="card-body">
                    <div class="d-flex justify-content-between">
                      <div class="rich-text-react me-3" id="finalizada-content"></div>
                      <div>
                        <div class="mb-2">
                          <label class="form-label">Tipo Plantilla</label>
                          <select class="form-select" id="plantilla-finalizada">
                            <option value="whatsapp">WhatsApp</option>
                            <option value="correo">Correo</option>
                          </select>
                        </div>
                        <button class="btn btn-success mt-2 w-100" id="guardar-finalizada">
                          <i class="fas fa-save"></i> Guardar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Configuración Encuesta -->
      <div class="tab-pane fade" id="facturacion-tab-pane" role="tabpanel" aria-labelledby="facturacion-tab">
        <div class="card w-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div id="preguntas-container" class="flex-grow-1 me-3">
                <!-- Aquí se añadirán las preguntas dinámicamente -->
              </div>
              <div>
                <button class="btn btn-primary" id="añadir-pregunta">
                  <i class="fas fa-plus"></i> Añadir Pregunta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    const preguntasContainer = document.getElementById('preguntas-container');
    const añadirPreguntaBtn = document.getElementById('añadir-pregunta');
    let preguntaCount = 0;

    añadirPreguntaBtn.addEventListener('click', function () {
      if (preguntaCount >= 5) {
        Swal.fire({
          icon: 'warning',
          title: 'Límite alcanzado',
          text: 'Solo se permiten un máximo de 5 preguntas.',
          confirmButtonText: 'Entendido'
        });
        return;
      }

      preguntaCount++;
      const preguntaHTML = `
        <div class="card mb-3" id="pregunta-${preguntaCount}">
          <div class="card-body">
            <div class="mb-2">
              <label class="form-label">Pregunta ${preguntaCount}</label>
              <input type="text" class="form-control pregunta-nombre" placeholder="Nombre de la pregunta">
            </div>
            <div class="mb-2">
              <label class="form-label">Tipo de Pregunta</label>
              <select class="form-select pregunta-tipo">
                <option value="texto">Texto</option>
                <option value="seleccion-multiple">Selección Múltiple</option>
                <option value="seleccion-unica">Selección Única</option>
              </select>
            </div>
            <div class="mb-2 opciones-container" style="display: none;">
              <label class="form-label">Opciones</label>
              <input type="text" class="form-control opciones-input" placeholder="Opción 1, Opción 2, ...">
            </div>
            <div class="d-flex justify-content-between">
              <button class="btn btn-success guardar-pregunta">
                <i class="fas fa-save"></i> Guardar
              </button>
              <button class="btn btn-danger borrar-pregunta">
                <i class="fas fa-trash"></i> Borrar
              </button>
            </div>
          </div>
        </div>
      `;
      preguntasContainer.insertAdjacentHTML('beforeend', preguntaHTML);

      // Mostrar/ocultar el campo de opciones según el tipo de pregunta
      const preguntaTipo = document.querySelector(`#pregunta-${preguntaCount} .pregunta-tipo`);
      preguntaTipo.addEventListener('change', function () {
        const opcionesContainer = document.querySelector(`#pregunta-${preguntaCount} .opciones-container`);
        if (this.value === 'seleccion-multiple' || this.value === 'seleccion-unica') {
          opcionesContainer.style.display = 'block';
        } else {
          opcionesContainer.style.display = 'none';
        }
      });

      // Guardar pregunta
      const guardarPreguntaBtn = document.querySelector(`#pregunta-${preguntaCount} .guardar-pregunta`);
      guardarPreguntaBtn.addEventListener('click', function () {
        const preguntaNombre = document.querySelector(`#pregunta-${preguntaCount} .pregunta-nombre`).value;
        const preguntaTipo = document.querySelector(`#pregunta-${preguntaCount} .pregunta-tipo`).value;
        const opciones = document.querySelector(`#pregunta-${preguntaCount} .opciones-input`)?.value.split(',').map(op => op.trim()) || [];

        console.log({
          id: `pregunta-${preguntaCount}`,
          nombre: preguntaNombre,
          tipo: preguntaTipo,
          opciones: opciones
        });
      });

      // Borrar pregunta
      const borrarPreguntaBtn = document.querySelector(`#pregunta-${preguntaCount} .borrar-pregunta`);
      borrarPreguntaBtn.addEventListener('click', function () {
        document.getElementById(`pregunta-${preguntaCount}`).remove();
        preguntaCount--;
      });
    });
  });
</script>