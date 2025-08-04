<div class="modal fade modal-xl" id="modalNuevoProducto" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo producto</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Datos Generales</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Información producto</span>
                        </li>
                        <li class="step" data-step="3">
                            <span class="step-number">3</span>
                            <span class="step-label">Información precio</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoProducto" class="needs-validation" novalidate>
  <div class="wizard-content">

    <!-- Paso 1: Datos Generales -->
    <div class="wizard-step active" data-step="1">
      <div class="row">
        <div class="col-8 col-sm-6">

          <div class="input-group">
            <div class="form-floating">
              <input type="text" class="form-control" id="name" name="name" required>
              <label for="name">Nombre del producto</label>
              <div class="invalid-feedback">Ingrese el nombre del producto.</div>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <textarea class="form-control" id="description" name="description" rows="3"></textarea>
              <label for="description">Descripción</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="reference" name="reference">
              <label for="reference">Referencia</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <select class="form-select" id="controlled_product" name="controlled_product" required>
                <option value="" disabled selected>Seleccione</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
              <label for="controlled_product">¿Es un producto controlado?</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input type="number" class="form-control" name="weight" id="weight" step="any" min="0">
              <label for="weight">Peso</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input type="number" class="form-control" name="capacity" id="capacity" step="any" min="0">
              <label for="capacity">Capacidad</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <input type="text" class="form-control" id="concentration" name="concentration">
              <label for="concentration">Concentración</label>
            </div>
          </div>

          <div class="input-group mt-3">
            <div class="form-floating">
              <select class="form-select" id="prescription" name="prescription" required>
                <option value="" disabled selected>Seleccione</option>
                <option value="1">Requiere fórmula</option>
                <option value="0">Sin fórmula</option>
              </select>
              <label for="prescription">Prescripción médica</label>
            </div>
          </div>

        </div>

        <!-- Imagen -->
        <div class="col-4 col-sm-6">
          <div class="text-center">
            <h5>Imagen del producto</h5>
            <img id="vacunaPreview" src="https://via.placeholder.com/150" alt="Previsualización" class="profile-img mt-3">
            <div class="mt-3">
              <label for="uploadVacunaImage" class="btn btn-primary">
                <i class="fa fa-upload"></i> Subir Imagen
              </label>
              <input type="file" id="uploadVacunaImage" class="d-none" accept="image/*" name="file_url">
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Paso 2: Identificación -->
    <div class="wizard-step" data-step="2">

      <div class="form-group mb-3">
        <label for="barcode">Código de barras</label>
        <input class="form-control" id="barcode" name="barcode" type="text">
      </div>

      <div class="form-group mb-3">
        <label for="components">Componentes</label>
        <textarea class="form-control" id="components" name="components" rows="2"></textarea>
      </div>

      <div class="form-group mb-3">
        <label for="minimum_stock">Stock mínimo</label>
        <input class="form-control" type="number" id="minimum_stock" name="minimum_stock" min="0">
      </div>

      <div class="form-group mb-3">
        <label for="maximum_stock">Stock máximo</label>
        <input class="form-control" type="number" id="maximum_stock" name="maximum_stock" min="0">
      </div>

      <div class="form-group mb-3">
        <label for="stock">Stock actual</label>
        <input class="form-control" type="number" id="stock" name="stock" min="0">
      </div>

      <div class="form-group mb-3">
        <label for="stock_alert">Alerta de stock</label>
        <input class="form-control" type="number" id="stock_alert" name="stock_alert" min="0">
      </div>

      <div class="form-group mb-3">
        <label for="expiration_date">Fecha de caducidad</label>
        <input type="date" class="form-control" id="expiration_date" name="expiration_date">
      </div>

      <div class="form-group mb-3">
        <label for="sanitary_registration">Registro sanitario</label>
        <input type="text" class="form-control" id="sanitary_registration" name="sanitary_registration">
      </div>
    </div>

    <!-- Paso 3: Precios y asociaciones -->
    <div class="wizard-step" data-step="3">

      <div class="form-group mb-3">
        <label for="purchase_price">Precio de compra</label>
        <input class="form-control" type="number" step="0.01" id="purchase_price" name="purchase_price">
      </div>

      <div class="form-group mb-3">
        <label for="sale_price">Precio de venta</label>
        <input class="form-control" type="number" step="0.01" id="sale_price" name="sale_price">
      </div>

      <div class="form-group mb-3">
        <label for="sale_purchase_status">Estado de venta/compra</label>
        <select class="form-select" id="sale_purchase_status" name="sale_purchase_status">
          <option value="both">Compra y Venta</option>
          <option value="sale_only">Solo Venta</option>
          <option value="purchase_only">Solo Compra</option>
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="quantity">Cantidad</label>
        <input class="form-control" type="number" id="quantity" name="quantity">
      </div>

      <div class="form-group mb-3">
        <label for="supplier_id">Proveedor</label>
        <select class="form-select" id="supplier_id" name="supplier_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="attention_type">Tipo de atención</label>
        <input class="form-control" type="text" id="attention_type" name="attention_type">
      </div>

      <div class="form-group mb-3">
        <label for="copayment">Copago</label>
        <input class="form-control" type="number" step="0.01" id="copayment" name="copayment">
      </div>

      <div class="form-group mb-3">
        <label for="tax_charge_id">Impuesto</label>
        <select class="form-select" id="tax_charge_id" name="tax_charge_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="presentation">Presentación</label>
        <input class="form-control" id="presentation" name="presentation" type="text">
      </div>

      <div class="form-group mb-3">
        <label for="exam_type_id">Tipo de examen</label>
        <select class="form-select" id="exam_type_id" name="exam_type_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="medical_form_id">Forma médica</label>
        <select class="form-select" id="medical_form_id" name="medical_form_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="laboratory_id">Laboratorio</label>
        <select class="form-select" id="laboratory_id" name="laboratory_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="brand_id">Marca</label>
        <select class="form-select" id="brand_id" name="brand_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="concentration_type_id">Tipo de concentración</label>
        <select class="form-select" id="concentration_type_id" name="concentration_type_id">
          <option value="">Seleccione</option>
          <!-- Opciones dinámicas -->
        </select>
      </div>

      <div class="form-group mb-3">
        <label for="product_type_id">Tipo de producto</label>
        <select class="form-select" id="product_type_id" name="product_type_id" required>
          <option value="">Seleccione</option>
          <option value="1">Medicamento</option>
          <option value="2">Vacuna</option>
          <option value="3">Suministro</option>
          <option value="4">Otro</option>
        </select>
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

<script type="module" src="./Inventario/js/inventarioGeneral.js"></script>

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

    // document.getElementById('modalGrupoVacuna').addEventListener('submit', function(event) {
    //     if (!this.checkValidity()) {
    //         event.preventDefault();
    //         this.classList.add('was-validated');
    //     }
    // });

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
            stream = await navigator.mediaDevices.getUserMedia({
                video: true
            });
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