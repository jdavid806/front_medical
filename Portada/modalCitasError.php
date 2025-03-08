<div class="modal fade" id="wizardError" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="modalCrearCitaHeader">Nueva Cita</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="card theme-wizard mb-5" data-theme-wizard="data-theme-wizard">
        <div class="card-header bg-body-highlight pt-3 pb-2 border-bottom-0">
          <ul class="nav justify-content-between nav-wizard nav-wizard-success" role="tablist">
            <li class="nav-item" role="presentation"><a class="nav-link active fw-semibold"
                href="#bootstrap-wizard-tab1" data-bs-toggle="tab" data-wizard-step="1" aria-selected="true" role="tab">
                <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span
                      class="nav-item-circle">1
                      <path fill="currentColor"
                        d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z">
                      </path>
                      </svg>
                    </span></span><span class="d-none d-md-block mt-1 fs-9">Cita</span></div>
              </a></li>
            <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab2"
                data-bs-toggle="tab" data-wizard-step="2" aria-selected="false" tabindex="-1" role="tab">
                <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span
                      class="nav-item-circle">2
                      <path fill="currentColor"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z">
                      </path>
                      </svg>
                    </span></span><span class="d-none d-md-block mt-1 fs-9">Paciente</span></div>
              </a></li>
            <li class="nav-item" role="presentation"><a class="nav-link fw-semibold" href="#bootstrap-wizard-tab3"
                data-bs-toggle="tab" data-wizard-step="3" aria-selected="false" tabindex="-1" role="tab">
                <div class="text-center d-inline-block"><span class="nav-item-circle-parent"><span
                      class="nav-item-circle">3
                      <path fill="currentColor"
                        d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z">
                      </path>
                      </svg>
                    </span></span><span class="d-none d-md-block mt-1 fs-9">Doctor (a)</span></div>
              </a></li>
          </ul>
        </div>
        <div class="card-body pt-4 pb-0">
          <div class="tab-content">
            <div class="tab-pane active" role="tabpanel" aria-labelledby="bootstrap-wizard-tab1"
              id="bootstrap-wizard-tab1">
              <form class="needs-validation" id="wizardFormCitas" novalidate="" data-wizard-form="1">
                <div class="mb-2">
                  <label class="col-form-label pt-0">Tipo de cita</label>
                  <div class="text-center" role="group">
                    <input type="radio" class="btn-check" name="tipoCita" id="presencial" autocomplete="off" required>
                    <label class="btn btn-outline-secondary rounded-pill me-1 mb-1" for="presencial">Presencial</label>

                    <input type="radio" class="btn-check" name="tipoCita" id="domiciliaria" autocomplete="off">
                    <label class="btn btn-outline-secondary rounded-pill me-1 mb-1"
                      for="domiciliaria">Domiciliaria</label>

                    <input type="radio" class="btn-check" name="tipoCita" id="virtual" autocomplete="off">
                    <label class="btn btn-outline-secondary rounded-pill me-1 mb-1" for="virtual">Virtual</label>
                  </div>
                </div>
                <div class="mb-2">
                  <label class="form-label" for="motivoConsulta">Motivo de Consulta</label>

                  <select class="form-select" id="motivoConsulta" required="required" name="motivoConsulta">
                    <option selected="" disabled="" value="">Seleccione</option>
                    <option>Consulta general</option>
                    <option>Consulta Odontologia</option>
                    <option>Consulta Estetica</option>
                  </select>
                  <div class="invalid-feedback">Por favor seleccione un motivo de consulta.</div>
                </div>
                <div class="mb-2">

                  <label class="form-label" for="fechaCita">Fecha de la consulta</label>
                  <input class="form-control datetimepicker flatpickr-input" id="fechaCita" name="fechaCita" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                  <div class="invalid-feedback">Por favor selecciona la fecha de la consulta.</div>
                </div>
                <div class="mb-2">
                  <label class="form-label" for="consulta-hora">Hora de la consulta</label>
                  <input class="form-control datetimepicker flatpickr-input" id="consulta-hora" name="consulta-hora" type="text" placeholder="hour : minute" data-options="{&quot;enableTime&quot;:true,&quot;noCalendar&quot;:true,&quot;dateFormat&quot;:&quot;H:i&quot;,&quot;disableMobile&quot;:true}" readonly="readonly">

                  <div class="invalid-feedback">Por favor selecciona la hora de la consulta.</div>

                </div>
              </form>
            </div>

            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab2" id="bootstrap-wizard-tab2">
              <form id="wizardPaciente" novalidate="" data-wizard-form="2">
                <nav class="nav nav-underline">
                  <a class="nav-link active" id="paciente-existente-tab" data-bs-toggle="tab" href="#paciente-existente"
                    role="tab" aria-controls="paciente-existente" aria-selected="true">Paciente Existente</a>
                  <a class="nav-link" id="nuevo-paciente-tab" data-bs-toggle="tab" href="#nuevo-paciente" role="tab"
                    aria-controls="nuevo-paciente" aria-selected="false">Nuevo
                    Paciente</a>
                </nav>

                <div class="tab-content mt-3" id="pacienteTabContent">
                  <!-- Tab Paciente Existente -->
                  <div class="tab-pane fade show active" id="paciente-existente" role="tabpanel"
                    aria-labelledby="paciente-existente-tab">
                    <div class="mb-2">
                      <label for="selectPaciente" class="form-label">Seleccione un paciente</label>
                      <select class="form-select" id="selectPaciente" name="selectPaciente">
                        <option selected disabled value="">Seleccione</option>
                        <option value="1">Paciente 1</option>
                        <option value="2">Paciente 2</option>
                        <option value="3">Paciente 3</option>
                      </select>
                    </div>
                    <div class="mb-2">
                      <label for="telefonoPaciente" class="form-label">Whatsapp</label>
                      <input type="tel" class="form-control" id="telefonoPaciente" name="telefonoPaciente">
                    </div>
                    <div class="mb-2">
                      <label for="correoPaciente" class="form-label">Correo Electrónico</label>
                      <input type="email" class="form-control" id="correoPaciente" name="correoPaciente">
                    </div>
                  </div>

                  <!-- Tab Nuevo Paciente -->
                  <div class="tab-pane fade needs-validation" id="nuevo-paciente" role="tabpanel"
                    aria-labelledby="nuevo-paciente-tab">
                    <div class="mb-2">
                      <label for="tipoDocumento" class="form-label">Seleccione un paciente</label>
                      <select class="form-select" id="tipoDocumento" name="tipoDocumento">
                        <option selected disabled value="">Seleccione</option>
                        <option value="1">cedula Ciudadania</option>
                        <option value="2">Tarjeta identidad</option>
                        <option value="3">Cedula extranjueria</option>
                      </select>
                    </div>
                    <div class="mb-2">
                      <label for="numeroDocumento" class="form-label">Numero de documento</label>
                      <input type="number" class="form-control" id="numeroDocumento" name="numeroDocumento" required>
                    </div>
                    <div class="mb-2">
                      <label for="nombrePaciente" class="form-label">Nombre Completo</label>
                      <input type="text" class="form-control" id="nombrePaciente" name="nombrePaciente" required>
                    </div>
                    <div class="mb-2">
                      <label for="telefonoPaciente" class="form-label">Teléfono</label>
                      <input type="tel" class="form-control" id="telefonoPaciente" name="telefonoPaciente" required>
                      <div class="invalid-feedback">Por favor ingrese el teléfono del paciente.</div>
                    </div>
                    <div class="mb-2">
                      <label for="correoPaciente" class="form-label">Correo Electrónico</label>
                      <input type="email" class="form-control" id="correoPaciente" name="correoPaciente" required>
                      <div class="invalid-feedback">Por favor ingrese un correo válido.</div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-tab3" id="bootstrap-wizard-tab3">
              <form id="wizardFormDoctor" novalidate="" data-wizard-form="1">
                <div class="mb-2">
                  <label class="form-label" for="doctor">Doctor(a)</label>

                  <select class="form-select" id="doctor" required="required" name="doctor">
                    <option selected="" disabled="" value="">Seleccione</option>
                    <option>Doctor juan</option>
                    <option>Doctor Carlos</option>
                    <option>Doctor juan Carlos</option>
                  </select>
                </div>
              </form>

              <div class="d-flex justify-content-end mt-3">
                <button type="button" class="btn btn-secondary me-2" id="cancelarBtn">Cancelar</button>
                <button type="submit" class="btn btn-primary" id="guardarBtn">Guardar</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer border-top-0" data-wizard-footer="data-wizard-footer">
          <div class="d-flex pager wizard list-inline mb-0">
            <button class="d-none btn btn-link ps-0" type="button" data-wizard-prev-btn="data-wizard-prev-btn"><svg
                class="svg-inline--fa fa-chevron-left me-1" data-fa-transform="shrink-3" aria-hidden="true"
                focusable="false" data-prefix="fas" data-icon="chevron-left" role="img"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""
                style="transform-origin: 0.3125em 0.5em;">
                <g transform="translate(160 256)">
                  <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                    <path fill="currentColor"
                      d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                      transform="translate(-160 -256)"></path>
                  </g>
                </g>
              </svg>Previous</button>
            <div class="flex-1 text-end">
              <button class="btn btn-primary px-6 px-sm-6" type="submit"
                data-wizard-next-btn="data-wizard-next-btn">Next<svg class="svg-inline--fa fa-chevron-right ms-1"
                  data-fa-transform="shrink-3" aria-hidden="true" focusable="false" data-prefix="fas"
                  data-icon="chevron-right" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                  data-fa-i2svg="" style="transform-origin: 0.3125em 0.5em;">
                  <g transform="translate(160 256)">
                    <g transform="translate(0, 0)  scale(0.8125, 0.8125)  rotate(0 0 0)">
                      <path fill="currentColor"
                        d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                        transform="translate(-160 -256)"></path>
                    </g>
                  </g>
                </svg></button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>