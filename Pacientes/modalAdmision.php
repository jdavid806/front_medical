<?php
// Array de antecedentes con id, valor y nombre
$antecedentes = [
  ["id" => 1, "valor" => "ASMA", "nombre" => "ASMA"],
  ["id" => 2, "valor" => "HTA", "nombre" => "HTA"],
  ["id" => 3, "valor" => "Diabetes", "nombre" => "Diabetes"],
  ["id" => 4, "valor" => "Hipotiroidismo", "nombre" => "Hipotiroidismo"],
  ["id" => 5, "valor" => "Tabaquismo", "nombre" => "Tabaquismo"],
  ["id" => 6, "valor" => "Licor", "nombre" => "Licor"]
];
?>

<div class="modal fade modal-xl" id="modalAdmision" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Admisión </h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <!-- Indicadores de progreso -->
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

        <!-- Contenido de los pasos -->
        <form id="formNuevoPaciente" class="needs-validation" novalidate>
          <div class="wizard-content">

            <div class="wizard-step active" data-step="1">
              <div class="row">

                <div class="col-8 col-sm-6">
                

                  <div class="input-group mb-3">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="primerNombre" required name="primerNombre">
                      <label for="primerNombre" class="form-label">Primer nombre</label>
                      <div class="invalid-feedback">Por favor agregue el primer nombre.</div>
                    </div>
                    <div class="form-floating">
                      <input type="text" class="form-control" id="segundoNombre" name="segundoNombre">
                      <label for="segundoNombre" class="form-label">Segundo Nombre</label>
                    </div>
                  </div>

                  <div class="input-group mb-3">
                    <div class="form-floating">
                      <input type="text" class="form-control" id="primerApellido" required name="primerApellido">
                      <label for="primerApellido" class="form-label">Primer apellido</label>
                      <div class="invalid-feedback">Por favor agregue el primer apellido.</div>
                    </div>
                    <div class="form-floating">
                      <input type="text" class="form-control" id="segundoApellido" name="segundoApellido">
                      <label for="segundoApellido" class="form-label">Segundo apellido</label>
                    </div>
                  </div>                


                  <div class="mb-2 form-floating">
                    <input class="form-control" id="direccion" name="direccion" type="text" />
                    <label class="form-label" for="direccion">Correo</label>
                  </div>

                  <div class="mb-2 form-floating">
                    <input class="form-control" id="telefonoEmergencia" name="telefonoEmergencia" type="text" />
                    <label class="form-label" for="telefonoEmergencia">Telefono</label>
                  </div>
                  <div class="mb-2 form-floating">
                    <input class="form-control" id="parentescoEmergencia" name="parentescoEmergencia" type="text" />
                    <label class="form-label" for="parentescoEmergencia">Parentesco</label>
                  </div>

                </div>

                <div class="col-4 col-sm-6">

                  <div class="row justify-content-center">
                    <div class="col-md-6 text-center">
                      <h2>Imagen de Perfil</h2>
                      <!-- Imagen de previsualización -->
                      <div class="mt-3">
                        <img id="profilePreview" src="https://via.placeholder.com/150" alt="Previsualización"
                          class="profile-img">
                      </div>
                      <!-- Video para captura -->
                      <div class="mt-3">
                        <video id="camera" autoplay></video>
                      </div>
                      <!-- Botones de acción -->
                      <div class="mt-4">
                        <label for="uploadImage" class="btn btn-primary me-2">
                          <i class="fa-solid fa-upload me-1"></i> Subir Imagen
                        </label>
                        <div class="icon-container" id="takePhoto">
                          <i class="fa-solid fa-camera fs-4"></i>
                        </div>
                        <div class="icon-container d-none" id="capturePhoto">
                          <i class="fa-solid fa-check fs-4 text-success"></i>
                        </div>
                      </div>
                      <!-- Input oculto para subir imagen -->
                      <input type="file" id="uploadImage" class="d-none" accept="image/*">
                    </div>
                  </div>

                </div>
              </div>

            </div>

            

            <div class="wizard-step" data-step="2">

              <div class="mb-2">
                <label class="form-check-label" for="esDonante">¿Es donante?</label>
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" id="esDonante"
                    onchange="setupToggleSwitch('esDonante', ['tipoSangre']);" type="checkbox" />
                </div>

                <div id="tipoSangre" class="d-none mb-2">
                  <div class="mb-2 form-floating">
                    <select class="form-select" id="tipoSangre" name="tipoSangre">
                      <option selected disabled value="">Seleccione</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="ND">No definido</option>
                    </select>
                    <label for="tipoSangre" class="form-label">Tipo de Sangre</label>
                  </div>

                </div>
              </div>

              <div class="mb-2">
                <label class="form-check-label" for="condicionEspecialCheck">¿Paciente presenta alguna condición
                  especial?</label>
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" id="condicionEspecialCheck"
                    onchange="setupToggleSwitch('condicionEspecialCheck', ['cualCondicion']);" type="checkbox" />
                </div>

                <div id="cualCondicion" class="d-none">

                  <div class="form-floating">

                    <textarea class="form-control" id="condicionEspecial" name="condicionEspecial"
                      style="height: 100px"></textarea>

                    <label for="condicionEspecial">¿Cuál?</label>
                  </div>

                </div>
              </div>

              <div class="mb-2">
                <label class="form-check-label" for="tieneAlergiasCheck">¿Paciente tiene alergias?</label>
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" id="tieneAlergiasCheck"
                    onchange="setupToggleSwitch('tieneAlergiasCheck', ['tieneAlergias']);" type="checkbox" />
                </div>

                <div id="tieneAlergias" class="d-none">

                  <div class="form-floating">

                    <textarea class="form-control" id="alergias" name="alergias" style="height: 100px"></textarea>

                    <label for="alergias">¿Cuáles?</label>
                  </div>

                </div>
              </div>

              <div class="mb-2">
                <label class="form-check-label" for="tieneCirugiasCheck">¿Paciente tiene cirugías?</label>
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" id="tieneCirugiasCheck"
                    onchange="setupToggleSwitch('tieneCirugiasCheck', ['tieneCirugias']);" type="checkbox" />
                </div>

                <div id="tieneCirugias" class="d-none">

                  <div class="form-floating">

                    <textarea class="form-control" id="cirugias" name="cirugias" style="height: 100px"></textarea>

                    <label for="cirugias">¿Cuáles?</label>
                  </div>

                </div>
              </div>

              <div class="mb-2">
                <label class="form-check-label" for="tieneAntecedentesCheck">¿Antecedentes?</label>
                <div class="form-check form-switch mb-2">
                  <input class="form-check-input" id="tieneAntecedentesCheck"
                    onchange="setupToggleSwitch('tieneAntecedentesCheck', ['tieneAntecedentes']);" type="checkbox" />
                </div>

                <div id="tieneAntecedentes" class="d-none">

                  <div class="form-check form-check-inline">

                    <?php foreach ($antecedentes as $antecedente): ?>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" name="antecedentes[]"
                          id="antecedentes<?php echo $antecedente['id']; ?>"
                          value="<?php echo htmlspecialchars($antecedente['id'] . ',' . $antecedente['valor'] . ',' . $antecedente['nombre']); ?>" />
                        <label class="form-check-label" for="checkbox<?php echo $antecedente['id']; ?>">
                          <?php echo htmlspecialchars($antecedente['nombre']); ?>
                        </label>
                      </div>
                    <?php endforeach; ?>

                  </div>

                </div>
              </div>

            </div>

            <div class="wizard-step" data-step="3">

              <div class="mb-2 form-floating">
                <select class="form-select" id="EPS" name="EPS">
                  <option selected disabled value="">Seleccione</option>
                  <option value="Sanitas">Sanitas</option>
                  <option value="Sura">Sura</option>
                  <option value="Compensar">Compensar</option>
                  <option value="Nueva EPS">Nueva EPS</option>
                  <option value="Coomeva">Coomeva</option>
                </select>
                <label for="EPS" class="form-label">Entidad prestadora de salud (EPS)</label>
              </div>

              <div class="mb-2 form-floating">
                <select class="form-select" id="AFP" name="AFP">
                  <option selected disabled value="">Seleccione</option>
                  <option value="Colpensiones">Colpensiones</option>
                  <option value="Porvenir">Porvenir</option>
                  <option value="Protección">Protección</option>
                  <option value="Skandia">Skandia</option>
                  <option value="Old Mutual">Old Mutual</option>
                </select>
                <label for="AFP" class="form-label">Administradora de fondos de pensiones (AFP)</label>
              </div>

              <div class="mb-2 form-floating">
                <select class="form-select" id="ARL" name="ARL">
                  <option selected disabled value="">Seleccione</option>
                  <option value="Sura">Sura</option>
                  <option value="Colpatria">Colpatria</option>
                  <option value="Bolívar">Bolívar</option>
                  <option value="Axa Colpatria">Axa Colpatria</option>
                  <option value="ARL Positiva">ARL Positiva</option>
                </select>
                <label for="ARL" class="form-label">Administradoras de riesgos laborales (ARL)</label>
              </div>

              <div class="mb-2 form-floating">
                <select class="form-select" id="tipoAfiliado" name="tipoAfiliado">
                  <option selected disabled value="">Seleccione</option>
                  <option value="Cotizante">Cotizante</option>
                  <option value="Beneficiario">Beneficiario</option>
                  <option value="Independiente">Independiente</option>
                  <option value="Pensionado">Pensionado</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
                <label for="tipoAfiliado" class="form-label">Tipo de afiliado</label>
              </div>

              <div class="mb-2 form-floating">
                <select class="form-select" id="sucursal" name="sucursal">
                  <option selected disabled value="">Seleccione</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                  <option value="Barranquilla">Barranquilla</option>
                  <option value="Cartagena">Cartagena</option>
                </select>
                <label for="sucursal" class="form-label">Sucursal</label>
              </div>


            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
        <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
        <button class="btn btn-secondary d-none" id="finishStep" type="submit" form="wizardForm">Finalizar</button>
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
    document.getElementById('nextStep').classList.toggle('d-none', currentStep === 3);
    document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 3);
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

  document.getElementById('modalCrearPaciente').addEventListener('submit', function (event) {
    if (!this.checkValidity()) {
      event.preventDefault();
      this.classList.add('was-validated');
    }
  });

  updateWizard();
</script>
<script>
  const profilePreview = document.getElementById('profilePreview');
  const uploadImage = document.getElementById('uploadImage');
  const takePhoto = document.getElementById('takePhoto');
  const capturePhoto = document.getElementById('capturePhoto');
  const camera = document.getElementById('camera');
  let stream;

  // Manejar carga de imagen
  uploadImage.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  // Activar la cámara
  takePhoto.addEventListener('click', async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      camera.srcObject = stream;
      camera.style.display = "block";
      takePhoto.classList.add("d-none");
      capturePhoto.classList.remove("d-none");
    } catch (err) {
      alert('No se pudo acceder a la cámara: ' + err.message);
    }
  });

  // Capturar foto
  capturePhoto.addEventListener('click', () => {
    const canvas = document.createElement('canvas');
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(camera, 0, 0, canvas.width, canvas.height);

    // Mostrar la foto capturada
    profilePreview.src = canvas.toDataURL('image/png');

    // Detener la cámara
    stream.getTracks().forEach(track => track.stop());
    camera.style.display = "none";
    capturePhoto.classList.add("d-none");
    takePhoto.classList.remove("d-none");
  });
</script>

