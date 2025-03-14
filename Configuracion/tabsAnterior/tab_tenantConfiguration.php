<style>
  /* Fija el ancho de la lista de tabs */
  #tabs-typeMessages {
    min-width: 200px;
    /* Ajusta este valor según lo necesites */
    max-width: 250px;
  }

  /* Asegura que los botones dentro de los tabs ocupen todo el ancho */
  #tabs-typeMessages .nav-link {
    width: 100%;
    text-align: left;
    /* Opcional, alinea los íconos y texto a la izquierda */
  }

  .verCompleto {
    width: 100%;
    table-layout: fixed;
  }

  #comunicacion-tab-pane .row {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qr-container {
    text-align: center;
  }

  .qr-container img {
    max-width: 150px;
    margin-top: 10px;
  }
</style>


<div class="row gx-3 gy-4 mb-5">
  <div class="card mb-3 p-3">
    <div class="d-flex">
      <!-- Tabs -->
      <ul class="nav nav-underline fs-9 flex-column me-3" id="tabs-typeMessages" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="general-tab" data-bs-toggle="tab" data-bs-target="#general-tab-pane"
            type="button" role="tab" aria-controls="general-tab-pane" aria-selected="true">
            <i class="fa-solid fa-circle-info"></i> Información General
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="facturacion-tab" data-bs-toggle="tab" data-bs-target="#facturacion-tab-pane"
            type="button" role="tab" aria-controls="facturacion-tab-pane" aria-selected="false">
            <i class="fa-solid fa-file-invoice"></i> Facturación
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="contacto-tab" data-bs-toggle="tab" data-bs-target="#contacto-tab-pane"
            type="button" role="tab" aria-controls="contacto-tab-pane" aria-selected="false">
            <i class="fa-solid fa-address-book"></i> Contacto
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="comunicacion-tab" data-bs-toggle="tab" data-bs-target="#comunicacion-tab-pane"
            type="button" role="tab" aria-controls="comunicacion-tab-pane" aria-selected="false">
            <i class="fa-solid fa-envelopes-bulk"></i> Comunicaciones
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="sedes-tab" data-bs-toggle="tab" data-bs-target="#sedes-tab-pane" type="button"
            role="tab" aria-controls="sedes-tab-pane" aria-selected="false">
            <i class="fa-solid fa-location-dot"></i> Sedes
          </button>
        </li>
      </ul>

      <!-- Contenido de los tabs -->
      <div class="tab-content" id="typeMessages-tabContent">

        <div class="tab-pane fade show active" id="general-tab-pane" role="tabpanel" aria-labelledby="general-tab">

          <form class="row g-3 needs-validation" novalidate>
            <h5>Datos Representante</h5>
            <div class="col-12">
              <label class="form-label" for="nombre-representante">Nombre</label>
              <input class="form-control" id="nombre-representante" type="text" placeholder="Jhon Doe" required>
              <div class="invalid-feedback">El Nombre del Representante no puede estar Vacio.</div>
            </div>
            <div class="col-6">
              <label class="form-label" for="telefono-representante">Telefono</label>
              <input class="form-control" id="telefono-representante" type="tel" placeholder="+57 300 123 4567">
            </div>
            <div class="col-6">
              <label class="form-label" for="correo-representante">Correo</label>
              <input class="form-control" id="correo-representante" type="email" placeholder="ejemplo@correo.com">
            </div>
            <div class="col-md-6">
              <label class="form-label" for="tipoDocumento-representante">Tipo Documento</label>
              <select class="form-control" id="tipoDocumento-representante" required>
                <option value="">Seleccione un tipo de documento</option>
                <option value="passport">Pasaporte</option>
                <option value="dni">Documento Nacional de Identidad (DNI)</option>
                <option value="id-card">Tarjeta de Identificación (ID Card)</option>
                <option value="ssn">Número de Seguro Social (SSN)</option>
                <option value="curp">CURP</option>
                <option value="rfc">RFC</option>
                <option value="cedula">Cédula de Ciudadanía</option>
                <option value="nit">NIT</option>
                <option value="ine">INE</option>
                <option value="cpf">CPF</option>
                <option value="cuil">CUIL</option>
                <option value="ruc">RUC</option>
                <option value="run">RUN</option>
                <option value="nif">NIF</option>
                <option value="nie">NIE</option>
                <option value="sin">SIN</option>
              </select>
              <div class="invalid-feedback">Seleccione un Tipo de Documento.</div>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label" for="documento-representante">Documento</label>
              <input class="form-control" id="documento-representante" type="text" placeholder="123456789" required>
              <div class="invalid-feedback">El Documento del Representante no puede estar Vacio.</div>
            </div>
            <h5>Datos Consultorio</h5>
            <div class="col-12">
              <label class="form-label" for="nombre-consultorio">Nombre Comercial</label>
              <input class="form-control" id="nombre-consultorio" type="text" placeholder="Nombre Consultorio" required>
              <div class="invalid-feedback">El nombre del Consultorio no puede estar Vacio.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="tipoDocumento-consultorio">Tipo Documento</label>
              <select class="form-control" id="tipoDocumento-consultorio" required>
                <option value="">Seleccione un tipo de documento</option>
                <option value="rfc">RFC</option>
                <option value="ruc_peru">RUC</option>
                <option value="ruc_ecuador">RUC</option>
                <option value="cuit">CUIT</option>
                <option value="rut">RUT</option>
                <option value="nit_colombia">NIT</option>
                <option value="rnc">RNC</option>
                <option value="ruc_panama">RUC</option>
                <option value="ruc_bolivia">NIT</option>
                <option value="ruc_paraguay">RUC</option>
                <option value="ruc_uruguay">RUT</option>
                <option value="ruc_venezuela">RIF</option>
              </select>
              <div class="invalid-feedback">Seleccione un Tipo de Documento.</div>
            </div>
            <div class="col-6">
              <label class="form-label" for="documento-consultorio">Documento</label>
              <input class="form-control" id="documento-consultorio" type="text" placeholder="123456789" required>
              <div class="invalid-feedback">El Documento del Representante no puede estar Vacio.</div>
            </div>
            <div class="col-12">
              <label class="form-label">Logo</label>
              <input type="file" class="form-control" id="logo" accept="image/*"
                onchange="previewImage(event, 'logoPreview')">
              <img id="logoPreview" src="#" class="img-fluid mt-2 d-none border" alt="Vista previa del logo">
            </div>
            <div class="col-12">
              <label class="form-label">Marca de Agua</label>
              <input type="file" class="form-control" id="marcaAgua" accept="image/*"
                onchange="previewImage(event, 'marcaAguaPreview')">
              <img id="marcaAguaPreview" src="#" class="img-fluid mt-2 d-none border"
                alt="Vista previa de la marca de agua">
            </div>
            <div class="col-12">
              <button class="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>

        </div>

        <div class="tab-pane fade" id="facturacion-tab-pane" role="tabpanel" aria-labelledby="facturacion-tab">

          <form class="row g-3 needs-validation" novalidate>
            <div class="col-12">
              <label class="form-label" for="prefijo">Prefijo DIAN</label>
              <input class="form-control" id="prefijo" type="text" placeholder="Ej: ABC" required>
              <div class="invalid-feedback">Favor ingrese el prefijo DIAN.</div>
            </div>
            <div class="col-12">
              <label class="form-label" for="numeroResolucion">Número Resolución</label>
              <input class="form-control" id="numeroResolucion" type="text" placeholder="Ej: 1234567890" required>
              <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="facturaDesde">Facturas Desde</label>
              <input class="form-control" id="facturaDesde" type="number" min="1" placeholder="Ej: 1001" required>
              <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="facturaHasta">Facturas Hasta</label>
              <input class="form-control" id="facturaHasta" type="number" min="1" placeholder="Ej: 2000" required>
              <div class="invalid-feedback">Ingrese el número final de facturas.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="fechaResolucion">Fecha Resolución</label>
              <input class="form-control" id="fechaResolucion" type="date" required>
              <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="fechaVencimiento">Fecha Vencimiento</label>
              <input class="form-control" id="fechaVencimiento" type="date" required>
              <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
            </div>
            <div class="col-12">
              <button class="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>

        </div>

        <div class="tab-pane fade" id="contacto-tab-pane" role="tabpanel" aria-labelledby="contacto-tab">

          <form class="row g-3 needs-validation" novalidate>
            <div class="col-md-6">
              <label class="form-label" for="telefono-consultorio">WhatsApp</label>
              <input class="form-control" id="telefono-consultorio" type="tel" placeholder="+57 300 123 4567" required>
              <div class="invalid-feedback">Ingrese un número de WhatsApp válido.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="correo-consultorio">Correo Electrónico</label>
              <input class="form-control" id="correo-consultorio" type="email" placeholder="ejemplo@correo.com" required>
              <div class="invalid-feedback">Ingrese un correo electrónico válido.</div>
            </div>
            <div class="col-12">
              <label class="form-label" for="direccion-consultorio">Dirección</label>
              <input class="form-control" id="direccion-consultorio" type="text" placeholder="Ej: Calle 123 #45-67, Bogotá"
                required>
              <div class="invalid-feedback">Ingrese una dirección válida.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="pais-consultorio">País</label>
              <select class="form-control" id="pais-consultorio" required>
                <option value="">Seleccione un país</option>
                <option value="CO">Colombia</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
                <option value="CL">Chile</option>
                <option value="PE">Perú</option>
              </select>
              <div class="invalid-feedback">Seleccione un país.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="ciudad-consultorio">Ciudad</label>
              <input class="form-control" id="ciudad-consultorio" type="text" placeholder="Ej: Medellín" required>
              <div class="invalid-feedback">Ingrese una ciudad válida.</div>
            </div>
            <div class="col-12">
              <button class="btn btn-primary" type="submit">Guardar</button>
            </div>
          </form>

        </div>

        <div class="tab-pane fade" id="comunicacion-tab-pane" role="tabpanel" aria-labelledby="comunicacion-tab">
          <div class="row">
            <!-- Sección de Vincular WhatsApp -->
            <div class="col-md-6 qr-container">
              <h5>Vincular WhatsApp</h5>
              <p>Escanea este código QR para vincular tu cuenta de WhatsApp.</p>

              <div class="d-flex flex-column align-items-center text-center mt-4">
                <span id="statusIcon">
                  <i class="fas fa-check-circle text-success"
                    style="font-size: 100px; width: 100px; height: 100px;"></i>
                </span>

                <!-- Imagen QR -->
                <img src="" alt="Código QR" id="qrWhatsApp" class="mt-3 img-fluid" style="max-width: 200px;">

                <div class="mt-3" aria-label="Botones-Conexion">
                  <button id="actionButton" class="btn btn-danger">
                    <i class="fas fa-times-circle"></i> Quitar conexión
                  </button>
                </div>
              </div>


            </div>

            <!-- Formulario de Configuración SMTP -->
            <div class="col-md-6">
              <h5>Configuración de Correo SMTP</h5>
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label class="form-label" for="smtpServidor">Servidor SMTP</label>
                  <input class="form-control" id="smtpServidor" type="text" placeholder="smtp.ejemplo.com" required>
                  <div class="invalid-feedback">Ingrese el servidor SMTP.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="smtpPuerto">Puerto</label>
                  <input class="form-control" id="smtpPuerto" type="number" placeholder="587" required>
                  <div class="invalid-feedback">Ingrese el puerto SMTP.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="smtpSeguridad">Seguridad</label>
                  <select class="form-control" id="smtpSeguridad" required>
                    <option value="">Seleccione una opción</option>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">Ninguna</option>
                  </select>
                  <div class="invalid-feedback">Seleccione un tipo de seguridad.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="smtpUsuario">Correo Electrónico</label>
                  <input class="form-control" id="smtpUsuario" type="email" placeholder="usuario@ejemplo.com" required>
                  <div class="invalid-feedback">Ingrese un correo válido.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="smtpClave">Contraseña</label>
                  <input class="form-control" id="smtpClave" type="password" placeholder="********" required>
                  <div class="invalid-feedback">Ingrese la contraseña SMTP.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="sedes-tab-pane" role="tabpanel" aria-labelledby="sedes-tab">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5>Listado de Sedes</h5>
            <button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#crearSede">
              <i class="fa-solid fa-plus"></i> Agregar Sede
            </button>
          </div>
          <table class="table" id="tablaSedes">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>WhatsApp</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Representante</th>
                <th>Teléfono Rep.</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Filas dinámicas aquí -->
            </tbody>
          </table>

        </div>

      </div>
    </div>
  </div>
</div>
<script>
  function previewImage(event, previewId) {
    const input = event.target;
    const preview = document.getElementById(previewId);

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("d-none");
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    const user_id = 1;

    consultarQR(user_id);
  });

  

</script>