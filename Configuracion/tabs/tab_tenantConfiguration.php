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
          <button class="nav-link" id="representante-tab" data-bs-toggle="tab" data-bs-target="#representante-tab-pane"
            type="button" role="tab" aria-controls="representante-tab-pane" aria-selected="false">
            <i class="fa-solid fa-address-book"></i> Representante
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="comunicacion-tab" data-bs-toggle="tab" data-bs-target="#comunicacion-tab-pane"
            type="button" role="tab" aria-controls="comunicacion-tab-pane" aria-selected="false">
            <i class="fa-solid fa-envelopes-bulk"></i> Comunicaciones
          </button>
        </li>
        <!-- <li class="nav-item" role="presentation">
          <button class="nav-link" id="sedes-tab" data-bs-toggle="tab" data-bs-target="#sedes-tab-pane" type="button"
            role="tab" aria-controls="sedes-tab-pane" aria-selected="false">
            <i class="fa-solid fa-location-dot"></i> Sedes
          </button>
        </li> -->
      </ul>

      <!-- Contenido de los tabs -->
      <div class="tab-content" id="typeMessages-tabContent">

        <input type="hidden" id="id_Empresa" value="">
        <div class="tab-pane fade show active" id="general-tab-pane" role="tabpanel" aria-labelledby="general-tab">

          <form class="row g-3 needs-validation" novalidate id="form-general">
            <h5>Datos Consultorio</h5>
            <div class="col-12">
              <label class="form-label" for="nombre-consultorio">Nombre Comercial</label>
              <input class="form-control" id="nombre-consultorio" name="nombre-consultorio" type="text"
                placeholder="Nombre Consultorio" required>
              <div class="invalid-feedback">El nombre del Consultorio no puede estar Vacio.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="tipoDocumento-consultorio">Tipo Documento</label>
              <select class="form-control" id="tipoDocumento-consultorio" name="tipoDocumento-consultorio" required>
                <option value="">Seleccione un tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="PASSPORT">PASAPORTE</option>
                <option value="NIT">NIT</option>
              </select>
              <div class="invalid-feedback">Seleccione un Tipo de Documento.</div>
            </div>
            <div class="col-6">
              <label class="form-label" for="documento-consultorio">Documento</label>
              <input class="form-control" id="documento-consultorio" name="documento-consultorio" type="text"
                placeholder="123456789" required>
              <div class="invalid-feedback">El Documento del consultorio no puede estar Vacio.</div>
            </div>
            <h5>Configuración General</h5>
            <div class="col-md-6">
              <label class="form-label" for="telefono-consultorio">WhatsApp</label>
              <input class="form-control" id="telefono-consultorio" name="telefono-consultorio" type="tel"
                placeholder="+57 300 123 4567" required>
              <div class="invalid-feedback">Ingrese un número de WhatsApp válido.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="correo-consultorio">Correo Electrónico</label>
              <input class="form-control" id="correo-consultorio" name="correo-consultorio" type="email"
                placeholder="ejemplo@correo.com" required>
              <div class="invalid-feedback">Ingrese un correo electrónico válido.</div>
            </div>
            <div class="col-12">
              <label class="form-label" for="direccion-consultorio">Dirección</label>
              <input class="form-control" id="direccion-consultorio" name="direccion-consultorio" type="text"
                placeholder="Ej: Calle 123 #45-67, Bogotá" required>
              <div class="invalid-feedback">Ingrese una dirección válida.</div>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="pais-consultorio">País</label>
              <select class="form-control" id="pais-consultorio" name="pais-consultorio" required>
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
              <input class="form-control" id="ciudad-consultorio" name="ciudad-consultorio" type="text"
                placeholder="Ej: Medellín" required>
              <div class="invalid-feedback">Ingrese una ciudad válida.</div>
            </div>
            <div class="col-12">
              <label class="form-label">Logo</label>
              <input type="file" class="form-control" id="logo" name="logo" accept="image/*"
                onchange="previewImage(event, 'logoPreview')">
              <img id="logoPreview" src="#" class="img-fluid mt-2 d-none border" alt="Vista previa del logo">
            </div>
            <div class="col-12">
              <label class="form-label">Marca de Agua</label>
              <input type="file" class="form-control" id="marcaAgua" name="marcaAgua" accept="image/*"
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
            <li class="nav-item" role="presentation"><a class="nav-link active" id="fiscal-tab" data-bs-toggle="tab"
                href="#tab-fiscal" role="tab" aria-controls="tab-fiscal" aria-selected="true">Fiscal</a></li>
            <li class="nav-item" role="presentation"><a class="nav-link" id="consumidor-tab" data-bs-toggle="tab"
                href="#tab-consumidor" role="tab" aria-controls="tab-consumidor" aria-selected="false"
                tabindex="-1">Consumidor</a></li>
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
              <form class="row g-3 needs-validation" novalidate id="form-consumidor">
                <input type="hidden" name="" id="idFacturaConsumidor" value="">
                <div class="col-6">
                  <label class="form-label" for="prefijoConsumidor">Prefijo DGII</label>
                  <input class="form-control" id="prefijoConsumidor" name="prefijoConsumidor" type="text"
                    placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="cuentaConsumidor">Cuenta Contable</label>
                  <input class="form-control" id="cuentaConsumidor" name="cuentaConsumidor" type="text"
                    placeholder="Ej: 1-0001-0001" required>
                  <div class="invalid-feedback">Favor ingrese la cuenta contable.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionConsumidor">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionConsumidor" name="numeroResolucionConsumidor"
                    type="text" placeholder="Ej: 1234567890" required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeConsumidor">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeConsumidor" name="facturaDesdeConsumidor" type="number"
                    min="1" placeholder="Ej: 1001" required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaConsumidor">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaConsumidor" name="facturaHastaConsumidor" type="number"
                    min="1" placeholder="Ej: 2000" required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionConsumidor">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionConsumidor" name="fechaResolucionConsumidor"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoConsumidor">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoConsumidor" name="fechaVencimientoConsumidor"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>

            <div class="tab-pane fade show active" id="tab-fiscal" role="tabpanel" aria-labelledby="fiscal-tab">
              <form class="row g-3 needs-validation" novalidate id="form-fiscal">
                <input type="hidden" id="idFacturaFiscal" value="">
                <div class="col-6">
                  <label class="form-label" for="prefijoFiscal">Prefijo DGII</label>
                  <input class="form-control" id="prefijoFiscal" name="prefijoFiscal" type="text" placeholder="Ej: ABC"
                    required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="cuentaFiscal">Cuenta Contable</label>
                  <input class="form-control" id="cuentaFiscal" name="cuentaFiscal" type="text"
                    placeholder="Ej: 1-0001-0001" required>
                  <div class="invalid-feedback">Favor ingrese la cuenta contable.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionFiscal">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionFiscal" name="numeroResolucionFiscal" type="text"
                    placeholder="Ej: 1234567890" required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeFiscal">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeFiscal" name="facturaDesdeFiscal" type="number" min="1"
                    placeholder="Ej: 1001" required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaFiscal">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaFiscal" name="facturaHastaFiscal" type="number" min="1"
                    placeholder="Ej: 2000" required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionFiscal">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionFiscal" name="fechaResolucionFiscal" type="date"
                    required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoFiscal">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoFiscal" name="fechaVencimientoFiscal" type="date"
                    required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>
            <div class="tab-pane fade" id="tab-gubernamental" role="tabpanel" aria-labelledby="gubernamental-tab">

              <form class="row g-3 needs-validation" novalidate id="form-gubernamental">
                <input type="hidden" name="" id="idFacturaGubernamental" value="">
                <div class="col-6">
                  <label class="form-label" for="prefijoGubernamental">Prefijo DGII</label>
                  <input class="form-control" id="prefijoGubernamental" name="prefijoGubernamental" type="text"
                    placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="cuentaGubernamental">Cuenta Contable</label>
                  <input class="form-control" id="cuentaGubernamental" name="cuentaGubernamental" type="text"
                    placeholder="Ej: 1-0001-0001" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionGubernamental">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionGubernamental" name="numeroResolucionGubernamental"
                    type="text" placeholder="Ej: 1234567890" required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeGubernamental">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeGubernamental" name="facturaDesdeGubernamental"
                    type="number" min="1" placeholder="Ej: 1001" required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaGubernamental">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaGubernamental" name="facturaHastaGubernamental"
                    type="number" min="1" placeholder="Ej: 2000" required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionGubernamental">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionGubernamental" name="fechaResolucionGubernamental"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoGubernamental">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoGubernamental" name="fechaVencimientoGubernamental"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>
            <div class="tab-pane fade" id="tab-notaCredito" role="tabpanel" aria-labelledby="notaCredito-tab">

              <form class="row g-3 needs-validation" novalidate id="form-notaCredito">
                <input type="hidden" name="" id="idNotaCredito" value="">
                <div class="col-6">
                  <label class="form-label" for="prefijoNotaCredito">Prefijo DGII</label>
                  <input class="form-control" id="prefijoNotaCredito" name="prefijoNotaCredito" type="text"
                    placeholder="Ej: ABC" required>
                  <div class="invalid-feedback">Favor ingrese el prefijo DGII.</div>
                </div>
                <div class="col-6">
                  <label class="form-label" for="cuentaNotaCredito">Cuenta Contable</label>
                  <input class="form-control" id="cuentaNotaCredito" name="cuentaNotaCredito" type="text"
                    placeholder="Ej: 1-0001-0001" required>
                  <div class="invalid-feedback">Favor ingresar la cuenta contable.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="numeroResolucionNotaCredito">Número Resolución</label>
                  <input class="form-control" id="numeroResolucionNotaCredito" name="numeroResolucionNotaCredito"
                    type="text" placeholder="Ej: 1234567890" required>
                  <div class="invalid-feedback">Favor ingrese el número de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaDesdeNotaCredito">Facturas Desde</label>
                  <input class="form-control" id="facturaDesdeNotaCredito" name="facturaDesdeNotaCredito" type="number"
                    min="1" placeholder="Ej: 1001" required>
                  <div class="invalid-feedback">Ingrese el número inicial de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="facturaHastaNotaCredito">Facturas Hasta</label>
                  <input class="form-control" id="facturaHastaNotaCredito" name="facturaHastaNotaCredito" type="number"
                    min="1" placeholder="Ej: 2000" required>
                  <div class="invalid-feedback">Ingrese el número final de facturas.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaResolucionNotaCredito">Fecha Resolución</label>
                  <input class="form-control" id="fechaResolucionNotaCredito" name="fechaResolucionNotaCredito"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de resolución.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="fechaVencimientoNotaCredito">Fecha Vencimiento</label>
                  <input class="form-control" id="fechaVencimientoNotaCredito" name="fechaVencimientoNotaCredito"
                    type="date" required>
                  <div class="invalid-feedback">Seleccione la fecha de vencimiento.</div>
                </div>
                <div class="col-12">
                  <button class="btn btn-primary" type="submit">Guardar</button>
                </div>
              </form>
            </div>

          </div>

        </div>

        <div class="tab-pane fade" id="representante-tab-pane" role="tabpanel" aria-labelledby="representante-tab">

          <form class="row g-3 needs-validation" novalidate id="form-representante">
            <input type="hidden" name="" id="representanteId" value="">
            <div class="col-12">
              <label class="form-label" for="nombre-representante">Nombre</label>
              <input class="form-control" id="nombre-representante" name="nombre-representante" type="text"
                placeholder="Jhon Doe" required>
              <div class="invalid-feedback">El Nombre del Representante no puede estar Vacio.</div>
            </div>
            <div class="col-6">
              <label class="form-label" for="telefono-representante">Telefono</label>
              <input class="form-control" id="telefono-representante" name="telefono-representante" type="tel"
                placeholder="+57 300 123 4567">
            </div>
            <div class="col-6">
              <label class="form-label" for="correo-representante">Correo</label>
              <input class="form-control" id="correo-representante" name="correo-representante" type="email"
                placeholder="ejemplo@correo.com">
            </div>
            <div class="col-md-6">
              <label class="form-label" for="tipoDocumento-representante">Tipo Documento</label>
              <select class="form-control" id="tipoDocumento-representante" name="tipoDocumento-representante" required>
                <option value="">Seleccione un tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="PASSPORT">PASAPORTE</option>
                <option value="NIT">NIT</option>
                <option value="CC">CEDULA DE CIUDADANIA</option>
              </select>
              <div class="invalid-feedback">Seleccione un Tipo de Documento.</div>
            </div>
            <div class="col-6 mb-3">
              <label class="form-label" for="documento-representante">Documento</label>
              <input class="form-control" id="documento-representante" name="documento-representante" type="text"
                placeholder="123456789" required>
              <div class="invalid-feedback">El Documento del Representante no puede estar Vacio.</div>
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
              <form class="row g-3 needs-validation" novalidate id="form-smtp">
                <input type="hidden" name="" id="smtpId" value="">
                <div class="col-12">
                  <label class="form-label" for="smtpServidor">Servidor SMTP</label>
                  <input class="form-control" id="smtpServidor" name="smtpServidor" type="text"
                    placeholder="smtp.ejemplo.com" required>
                  <div class="invalid-feedback">Ingrese el servidor SMTP.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="smtpPuerto">Puerto</label>
                  <input class="form-control" id="smtpPuerto" name="smtpPuerto" type="number" placeholder="587"
                    required>
                  <div class="invalid-feedback">Ingrese el puerto SMTP.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="smtpSeguridad">Seguridad</label>
                  <select class="form-control" id="smtpSeguridad" name="smtpSeguridad" required>
                    <option value="">Seleccione una opción</option>
                    <option value="tls">TLS</option>
                    <option value="ssl">SSL</option>
                    <option value="none">Ninguna</option>
                  </select>
                  <div class="invalid-feedback">Seleccione un tipo de seguridad.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="smtpUsuario">Correo Electrónico</label>
                  <input class="form-control" id="smtpUsuario" name="smtpUsuario" type="email"
                    placeholder="usuario@ejemplo.com" required>
                  <div class="invalid-feedback">Ingrese un correo válido.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="smtpClave">Contraseña</label>
                  <input class="form-control" id="smtpClave" name="smtpClave" type="password" placeholder="********"
                    required>
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
    handleForm("form-general", async (data) => {
      const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      };

      const logoFile = document.getElementById("logo").files[0];
      const marcaAguaFile = document.getElementById("marcaAgua").files[0];

      let logoBase64 = null;
      let marcaAguaBase64 = null;

      if (logoFile) {
        logoBase64 = await fileToBase64(logoFile);
      }

      if (marcaAguaFile) {
        marcaAguaBase64 = await fileToBase64(marcaAguaFile);
      }

      let infoGeneral = {
        name: data.nombreconsultorio,
        document_type: data.tipoDocumentoconsultorio,
        document_number: data.documentoconsultorio,
        logo: logoBase64,
        watermark: marcaAguaBase64,
        phone: data.telefonoconsultorio,
        email: data.correoconsultorio,
        address: data.direccionconsultorio,
        country: data.paisconsultorio,
        city: data.ciudadconsultorio
      };
      updateEmpresa(infoGeneral);
      cargarDatosTenant();
    });

    handleForm("form-fiscal", async (data) => {
      let id = document.getElementById("idFacturaFiscal").value;
      let infoGeneral = {
        dian_prefix: data.prefijoFiscal,
        resolution_number: data.numeroResolucionFiscal,
        invoice_from: data.facturaDesdeFiscal,
        invoice_to: data.facturaHastaFiscal,
        type: "tax_invoice",
        resolution_date: data.fechaResolucionFiscal,
        expiration_date: data.fechaVencimientoFiscal
      };
      if (id != null) {
        updateTipoFacturas(id, infoGeneral);
      } else {
        createTipoFacturas(infoGeneral);
      }
      cargarDatosTenant();
    });

    // Manejar el formulario de Facturación Consumidor
    handleForm("form-consumidor", async (data) => {
      let id = document.getElementById("idFacturaConsumidor").value;
      let infoGeneral = {
        dian_prefix: data.prefijoConsumidor,
        resolution_number: data.numeroResolucionConsumidor,
        invoice_from: data.facturaDesdeConsumidor,
        invoice_to: data.facturaHastaConsumidor,
        type: "consumer",
        resolution_date: data.fechaResolucionConsumidor,
        expiration_date: data.fechaVencimientoConsumidor
      };

      if (id != null) {
        updateTipoFacturas(id, infoGeneral);
      } else {
        createTipoFacturas(infoGeneral);
      }
      cargarDatosTenant();
    });

    // Manejar el formulario de Facturación Gubernamental
    handleForm("form-gubernamental", async (data) => {
      let id = document.getElementById("idFacturaGubernamental").value;
      let infoGeneral = {
        dian_prefix: data.prefijoGubernamental,
        resolution_number: data.numeroResolucionGubernamental,
        invoice_from: data.facturaDesdeGubernamental,
        invoice_to: data.facturaHastaGubernamental,
        type: "government_invoice",
        resolution_date: data.fechaResolucionGubernamental,
        expiration_date: data.fechaVencimientoGubernamental
      };

      if (id != null) {
        updateTipoFacturas(id, infoGeneral);
      } else {
        createTipoFacturas(infoGeneral);
      }
      cargarDatosTenant();
    });

    // Manejar el formulario de Notas de Crédito
    handleForm("form-notaCredito", async (data) => {
      let id = document.getElementById("idNotaCredito").value;
      let infoGeneral = {
        dian_prefix: data.prefijoNotaCredito,
        resolution_number: data.numeroResolucionNotaCredito,
        invoice_from: data.facturaDesdeNotaCredito,
        invoice_to: data.facturaHastaNotaCredito,
        type: "credit_note",
        resolution_date: data.fechaResolucionNotaCredito,
        expiration_date: data.fechaVencimientoNotaCredito
      };

      if (id != null) {
        updateTipoFacturas(id, infoGeneral);
      } else {
        createTipoFacturas(infoGeneral);
      }
      cargarDatosTenant();
    });

    // Manejar el formulario de representante
    handleForm("form-representante", async (data) => {
      let id = document.getElementById("representanteId").value;
      let representative = {
        name: data.nombrerepresentante,
        phone: data.telefonorepresentante,
        email: data.correorepresentante,
        document_type: data.tipoDocumentorepresentante,
        document_number: data.documentorepresentante,
      };

      if (id != null) {
        updateRepresentante(representative);
      } else {
        createRepresentante(representative);
      }
      cargarDatosTenant();
    });

    // Manejar el formulario de Configuración SMTP
    handleForm("form-smtp", async (data) => {
      let id = document.getElementById("smtpId").value;

      let configSmtp = {
        smtp_server: data.smtpServidor,
        port: data.smtpPuerto,
        security: data.smtpSeguridad,
        email: data.smtpUsuario,
        password: data.smtpClave
      };

      if (id != null) {
        updateSmtp(configSmtp);
      } else {
        createSmtp(configSmtp);
      }
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
        const newKey = key.replace(/-/g, "");
        formDataObject[newKey] = value;
      });

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