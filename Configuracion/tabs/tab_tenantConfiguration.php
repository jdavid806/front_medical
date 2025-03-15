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

          <form class="row g-3 needs-validation" novalidate id="company-general">
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
              <button class="btn btn-primary" type="submit" id="guardarInfoGeneral">Guardar</button>
            </div>
          </form>

        </div>

        <div class="tab-pane fade" id="facturacion-tab-pane" role="tabpanel" aria-labelledby="facturacion-tab">

          <ul class="nav nav-underline fs-9" id="tabFacturasConfig" role="tablist">
            <li class="nav-item" role="presentation"><a class="nav-link" id="consumidor-tab" data-bs-toggle="tab"
                href="#tab-consumidor" role="tab" aria-controls="tab-consumidor" aria-selected="false"
                tabindex="-1">Consumidor</a></li>
            <li class="nav-item" role="presentation"><a class="nav-link active" id="fiscal-tab" data-bs-toggle="tab"
                href="#tab-fiscal" role="tab" aria-controls="tab-fiscal" aria-selected="true">Fiscal</a></li>
            <li class="nav-item" role="presentation"><a class="nav-link" id="gubernamental-tab" data-bs-toggle="tab"
                href="#tab-gubernamental" role="tab" aria-controls="tab-gubernamental" aria-selected="false"
                tabindex="-1">Gubernamental</a></li>
            <li class="nav-item" role="presentation"><a class="nav-link" id="notaCredito-tab" data-bs-toggle="tab"
                href="#tab-notaCredito" role="tab" aria-controls="tab-notaCredito" aria-selected="false"
                tabindex="-1">Notas Credito</a></li>
          </ul>
          <div class="tab-content mt-3" id="tabFacturasConfigContent">

            <!-- Consumidor -->

            <div class="tab-pane fade" id="tab-consumidor" role="tabpanel" aria-labelledby="consumidor-tab">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label class="form-label" for="prefijoConsumidor">Prefijo DGII</label>
                  <input class="form-control" id="prefijoConsumidor" type="text" placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionConsumidor">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionConsumidor" type="text" placeholder="Ej: 1234567890"
                    required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeConsumidor">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeConsumidor" type="number" min="1" placeholder="Ej: 1001"
                    required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaConsumidor">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaConsumidor" type="number" min="1" placeholder="Ej: 2000"
                    required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionConsumidor">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionConsumidor" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoConsumidor">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoConsumidor" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>

            <div class="tab-pane fade show active" id="tab-fiscal" role="tabpanel" aria-labelledby="fiscal-tab">
              <form class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label class="form-label" for="prefijoFiscal">Prefijo DGII</label>
                  <input class="form-control" id="prefijoFiscal" type="text" placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionFiscal">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionFiscal" type="text" placeholder="Ej: 1234567890"
                    required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeFiscal">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeFiscal" type="number" min="1" placeholder="Ej: 1001"
                    required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaFiscal">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaFiscal" type="number" min="1" placeholder="Ej: 2000"
                    required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionFiscal">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionFiscal" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoFiscal">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoFiscal" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>
            <div class="tab-pane fade" id="tab-gubernamental" role="tabpanel" aria-labelledby="gubernamental-tab">

              <form class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label class="form-label" for="prefijoGubernamental">Prefijo DGII</label>
                  <input class="form-control" id="prefijoGubernamental" type="text" placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionGubernamental">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionGubernamental" type="text"
                    placeholder="Ej: 1234567890" required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeGubernamental">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeGubernamental" type="number" min="1"
                    placeholder="Ej: 1001" required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaGubernamental">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaGubernamental" type="number" min="1"
                    placeholder="Ej: 2000" required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionGubernamental">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionGubernamental" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoGubernamental">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoGubernamental" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>
            <div class="tab-pane fade" id="tab-notaCredito" role="tabpanel" aria-labelledby="notaCredito-tab">

              <form class="row g-3 needs-validation" novalidate>
                <div class="col-12">
                  <label class="form-label" for="prefijoNotaCredito">Prefijo DGII</label>
                  <input class="form-control" id="prefijoNotaCredito" type="text" placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionNotaCredito">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionNotaCredito" type="text" placeholder="Ej: 1234567890"
                    required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeNotaCredito">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeNotaCredito" type="number" min="1" placeholder="Ej: 1001"
                    required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaNotaCredito">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaNotaCredito" type="number" min="1" placeholder="Ej: 2000"
                    required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionNotaCredito">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionNotaCredito" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoNotaCredito">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoNotaCredito" type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>

          </div>

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
              <input class="form-control" id="correo-consultorio" type="email" placeholder="ejemplo@correo.com"
                required>
              <div class="invalid-feedback">Ingrese un correo electrónico válido.</div>
            </div>
            <div class="col-12">
              <label class="form-label" for="direccion-consultorio">Dirección</label>
              <input class="form-control" id="direccion-consultorio" type="text"
                placeholder="Ej: Calle 123 #45-67, Bogotá" required>
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
              <h5>Estado WhatsApp</h5>

              <div class="d-flex flex-column align-items-center text-center mt-4">
                <span id="goodIcon" class="d-none">
                  <i class="fas fa-check-circle text-success"
                    style="font-size: 100px; width: 100px; height: 100px;"></i>
                </span>
                <span id="badIcon" class="d-none">
                  <i class="fas fa-circle-xmark text-danger" style="font-size: 100px; width: 100px; height: 100px;"></i>
                </span>

                <div class="mt-3" aria-label="Botones-Conexion">
                  <button id="actionButton" class="d-none btn btn-danger">
                    <i class="fas fa-times-circle"></i> Quitar conexión
                  </button>
                  <button id="modalButton" class="d-none btn btn-warning" data-bs-toggle="modal"
                    data-bs-target="#modalVerQr">
                    <i class="fas fa-times-circle"></i> Conectar WhatsApp
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
          <div class="col-12">
            <button class="btn btn-primary" type="submit">Guardar sedes</button>
          </div>
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
    // Manejar el formulario de Información General
    handleForm("company-general", async (data) => {
      console.log("Enviando datos de Información General:", data);
    });

    handleForm("tab-fiscal", async (data) => {
      console.log("Enviando datos de Facturación Fiscal:", data);
    });

    handleForm("contacto-form", async (data) => {
      console.log("Enviando datos de Contacto:", data);
    });

    handleForm("smtp-form", async (data) => {
      console.log("Enviando datos de Configuración SMTP:", data);
    });

    // Manejar el formulario de Sedes
    handleForm("sedes-form", async (data) => {
      console.log("Enviando datos de Sedes:", data);
    });

    consultarQR();
    cargarDatosTenant();
  });
</script>

<script>
  function handleForm(formId, callback) {
    const form = document.getElementById(formId);

    if (!form) {
      console.warn(`El formulario con ID ${formId} no existe en el DOM`);
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const formDataObject = {};

      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

      console.log(`Datos del formulario ${formId}:`, formDataObject);

      try {
        if (callback) {
          await callback(formDataObject);
        }

        form.reset();

      } catch (error) {
        console.error(`Error al procesar el formulario ${formId}:`, error);
        alert(`Error al procesar el formulario: ${error.message}`);
      }
    });
  }
</script>

<!-- <script>
  
  document.addEventListener("DOMContentLoaded", function () {
    // Formulario de Información General
    document.getElementById('general-tab-pane').querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      const datos = capturarDatosInformacionGeneral();
      // guardarDatos(
      //   obtenerRutaPrincipal() + "/medical/companies/",
      //   retencion
      // );
      // console.log('Datos Información General:', datos);
      // Aquí puedes enviar los datos a tu backend o hacer lo que necesites
    });

    // Formulario de Facturación
    document.getElementById('facturacion-tab-pane').querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      const datos = capturarDatosFacturacion();
      console.log('Datos Facturación:', datos);
    });

    // Formulario de Contacto
    document.getElementById('contacto-tab-pane').querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      const datos = capturarDatosContacto();
      console.log('Datos Contacto:', datos);
    });

    // Formulario de Configuración SMTP
    document.getElementById('comunicacion-tab-pane').querySelector('form').addEventListener('submit', function (event) {
      event.preventDefault();
      const datos = capturarDatosSMTP();
      console.log('Datos SMTP:', datos);
    });
  });

  document.getElementById('guardarInfoGeneral').addEventListener('click', function () {
    const datosGuardar = capturarDatosInformacionGeneral();
    console.log(datosGuardar);
  })
</script> -->