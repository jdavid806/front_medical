<div class="modal fade modal-xl" id="modalEntity" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Facturación Entidad</h5>
        <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
        <!-- Indicadores de progreso -->
        <div class="steps-container mb-4">
          <ul class="steps">
            <li class="step active" data-step="1">
              <span class="step-number">1</span>
              <span class="step-label">Información básica</span>
            </li>
            <li class="step" data-step="2">
              <span class="step-number">2</span>
              <span class="step-label">Información de facturación</span>
            </li>
            <li class="step" data-step="3">
              <span class="step-number">3</span>
              <span class="step-label">Métodos de pago</span>
            </li>
            <!-- <li class="step" data-step="4">
              <span class="step-number">4</span>
              <span class="step-label">Hecho</span>
            </li> -->
          </ul>
        </div>

        <div class="wizard-content">
          <div class="wizard-step active" data-step="1">
            <div class="col-12 mb-3">
              <div class="card border border-light">
                <div class="card-body">
                  <h5 class="card-title">Información básica </h5>
                  <div class="row">
                    <div class="col-6">
                      <label class="form-label" for="fechaElaboracion">Fecha de elaboración</label>
                      <input class="form-control datetimepicker flatpickr-input" id="fechaElaboracion" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" value="" onchange="updateDate()" />

                    </div>
                    <!-- <div class="col-6">
                      <label class="form-label" for="fechaVencimiento">Fecha de vencimiento</label>
                      <input class="form-control datetimepicker flatpickr-input" id="fechaVencimiento" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                    </div> -->
                    <div class="col-6">
                      <label class="form-label" for="tipoFactura">Tipo factura</label>
                      <select class="form-select" id="tipoFactura">
                        <option selected disabled>Seleccione</option>
                        <option value="consumidor">Consumidor</option>
                        <option value="fiscal">Fiscal</option>
                        <option value="gubernamental">Gubernamental</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="entity">Entidad</label>
                      <select class="form-select" id="entity">
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="centroCosto">Centro de costo</label>
                      <select class="form-select" id="centroCosto">
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-12 mb-3">
              <div class="card border border-light">
                <div class="card-body">
                  <h5 class="card-title">Filtrar </h5>
                  <div class="row">
                    <div class="col-6">
                      <label class="form-label" for="patients">procedimientos</label>
                      <select class="form-select" id="procedure">
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="especialistas">Especialistas</label>
                      <select class="form-select" id="especialistas">
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="patients">Pacientes</label>
                      <select class="form-select" id="patients">
                        <!-- <option selected="">Seleccione</option>
                        <option value="1">Paciente 1</option>
                        <option value="2">Paciente 2</option>
                        <option value="3">Paciente 3</option> -->
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="fechasProcedimiento">Fecha incio - fin Procedimiento</label>
                      <input class="form-control datetimepicker flatpickr-input" id="fechasProcedimiento" type="text" placeholder="dd/mm/yyyy - dd/mm/yyyy" data-options="{&quot;mode&quot;:&quot;range&quot;,&quot;dateFormat&quot;:&quot;d/m/y&quot;,&quot;disableMobile&quot;:true}" readonly="readonly">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wizard-content">
          <div class="wizard-step" data-step="2">
            <div class="col-12 mb-3">
              <div class="card border border-light">
                <div class="card-body">
                  <!-- <h5 class="card-title"></h5> -->
                  <!-- Información de facturación -->
                  <div class="tab-pane" role="tabpanel" aria-labelledby="bootstrap-wizard-validation-tab2" id="bootstrap-wizard-validation-tab2">
                    <div class="card">
                      <div id="tableExample3" data-list="{&quot;valueNames&quot;:[&quot;name&quot;,&quot;email&quot;,&quot;age&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                        <div class="search-box mb-3 mx-auto">
                          <form class="position-relative">
                            <input class="form-control search-input search form-control-sm mt-3" type="search" placeholder="Search" aria-label="Search">
                            <svg class="svg-inline--fa fa-magnifying-glass search-box-icon" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="magnifying-glass" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg="">
                              <path fill="currentColor" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                            </svg><!-- <span class="fas fa-search search-box-icon"></span> Font Awesome fontawesome.com -->
                          </form>
                        </div>
                        <div class="table-responsive">
                          <table class="table table-striped table-sm fs-9 mb-0">
                            <thead>
                              <tr>
                                <th class="sort border-top border-translucent ps-3" data-sort="name">Paciente</th>
                                <th class="sort border-top" data-sort="email">Fecha</th>
                                <th class="sort border-top" data-sort="procedimiento">Procedimiento</th>
                                <th class="sort border-top" data-sort="autorizacion">Autorización</th>
                                <th class="sort border-top" data-sort="valorUnitario">Valor unitario</th>
                                <th class="sort border-top" data-sort="copago">Copago</th>
                                <th class="sort border-top" data-sort="valorTotal">Valor total</th>
                                <th class="sort text-end align-middle pe-0 border-top" scope="col"></th>
                              </tr>
                            </thead>
                            <tbody class="list-billing">
                              <tr>
                                <td class="align-middle ps-3 name">Anna</td>
                                <td class="align-middle email">2025-10-05</td>
                                <td class="align-middle age">Null</td>
                                <td class="align-middle age">Null</td>
                                <td class="align-middle age">2000</td>
                                <td class="align-middle age">100</td>
                                <td class="align-middle age">2000</td>
                                <td class="align-middle white-space-nowrap text-end pe-0">

                                  <div class="form-check">
                                    <input class="form-check-input" id="flexCheckDefault" type="checkbox" value="" />
                                  </div>
                                </td>
                              </tr>

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="wizard-content">
          <div class="wizard-step" data-step="3">
            <div class="col-12 mb-3">
              <div class="card border border-light">
                <div class="card-body">
                  <!-- <h5 class="card-title"></h5> -->
                  <div class="row">
                    <!-- <div class="col-6">
                      <label class="form-label" for="fechaVencimiento">Fecha de vencimiento</label>
                      <input class="form-control datetimepicker flatpickr-input" id="fechaVencimiento" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                    </div> -->
                    <!-- <div class="col-6">
                      <label class="form-label" for="metodoPago">Metodo de pago</label>
                      <select class="form-select" id="metodoPago">
                        <option disabled>Seleccione</option>
                        <option value="credito" selected>Crédito</option>
                        <option value="contado">Contado</option>
                      </select>
                    </div> -->
                    <div class="col-12">
                      <label class="form-label" for="metodoPagoCheck">¿Desea cambiar el metodo de pago de crédito a contado?</label>
                      <input class="form-check-input" id="metodoPagoCheck" type="checkbox" />
                    </div>

                    <input type="hidden" name="modoPago" id="modoPago" value="credito">

                    <div class="col-6" id="divMetodoPago" style="display: none;">
                      <label class="form-label" for="metodoPago">Metodo de pago</label>
                      <select class="form-select" id="metodoPago">
                        <option disabled>Seleccione</option>
                        <option value="metodo1" selected>Metodo 1</option>
                        <option value="metodo2">Metodo 2</option>
                      </select>
                    </div>
                    <div class="col-6 mt-3" id="divDiasPlazo">
                      <label for="diasPlazo" class="form-label">Plazo (dias)</label>
                      <input type="text" class="form-control" id="diasPlazo" name="diasPlazo">
                      <div class="invalid-feedback">Por favor ingrese el plazo.</div>
                    </div>
                    <div class="col-6 mt-3" id="divFechaVencimiento">
                      <label class="form-label" for="fechaVencimiento">Fecha de vencimiento</label>
                      <input class="form-control datetimepicker flatpickr-input" id="fechaVencimiento" type="text" placeholder="dd/mm/yyyy" data-options="{&quot;disableMobile&quot;:true,&quot;dateFormat&quot;:&quot;d/m/Y&quot;}" readonly="readonly">
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="taxCharge">Impuesto cargo</label>
                      <select class="form-control" id="taxCharge" name="taxCharge">
                        <option value="" disabled selected>Selecciona un impuesto</option>
                        <option value="1">IVA 21%</option>
                        <option value="2">IVA 10%</option>
                        <option value="3">IVA 4%</option>
                      </select>
                    </div>
                    <div class="col-6">
                      <label class="form-label" for="taxWithholding">Impuesto retencion</label>
                      <select class="form-control" name="taxWithholding" id="taxWithholding">
                        <option value="" disabled selected>Seleccione una retención de impuesto</option>
                        <option value="10">10% - Retención general</option>
                        <option value="15">15% - Retención profesionales</option>
                        <option value="19">19% - Retención empresarial</option>
                        <option value="24">24% - Retención especial</option>
                        <option value="5">5% - Retención reducida</option>
                        <option value="0">0% - Sin retención</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" id="prevStep" type="button" disabled>Anterior</button>
        <button class="btn btn-primary" id="nextStep" type="button">Siguiente</button>
        <button class="btn btn-secondary d-none" id="finishStep" type="submit"
          form="formNuevoPaquete">Finalizar</button>
      </div>
    </div>
  </div>
</div>

<style>
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

<script type="module">
  import {
    entityService,
    productService,
    userService,
    patientService,
    costCenterService,
    billingService
  } from "../../services/api/index.js";


  document.addEventListener('DOMContentLoaded', function() {
    createSelectEntities();
    cargarProcedimientos();
    cargarEspecialistas();
    cargarPacientes();
    cargarCentrosCosto();
  })

  async function createSelectEntities() {
    const entities = await entityService.getAll();

    const select = document.getElementById("entity");
    select.innerHTML = '<option selected disabled>Seleccione</option>';

    if (entities.data.length) {

      entities.data.forEach(entity => {
        const option = document.createElement("option");
        option.value = entity.id;
        option.textContent = entity.name;
        select.appendChild(option);
      });

    }
    configurarSelectEntites();
  }

  function configurarSelectEntites() {
    // Obtenemos la referencia al select
    const select = document.getElementById('entity');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(select, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  async function cargarCentrosCosto() {
    const centrosCosto = await costCenterService.getCostCenterAll();

    const select = document.getElementById("centroCosto");
    select.innerHTML = '<option selected disabled>Seleccione</option>';

    if (centrosCosto.data.length) {

      centrosCosto.data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item.name + ' - ' + item.code;
        select.appendChild(option);
      });

    }
    configurarSelectCentroCosto();
  }

  function configurarSelectCentroCosto() {
    // Obtenemos la referencia al select
    const select = document.getElementById('centroCosto');

    if (typeof Choices !== 'undefined') {
      const choices = new Choices(select, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  async function cargarProcedimientos() {
    const selectProcedimientos = document.getElementById('procedure');
    let procedimientos = await productService.getAllProducts();

    procedimientos = procedimientos.data.filter(item => item.attributes.attention_type === "PROCEDURE");


    if (procedimientos.length) {

      procedimientos.forEach(procedure => {
        const option = document.createElement("option");
        option.value = procedure.id;
        option.textContent = procedure.attributes.name;
        selectProcedimientos.appendChild(option);
      });

    }
    configurarSelectProcedimientosMultiple();
  }

  function configurarSelectProcedimientosMultiple() {
    const procedure = document.getElementById('procedure');

    procedure.setAttribute('multiple', 'multiple');

    // Choices.js
    if (typeof Choices !== 'undefined') {
      const choices = new Choices(procedure, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  async function cargarEspecialistas() {
    const selectEspecialistas = document.getElementById('especialistas');
    const especialistas = await userService.getAllUsers();

    especialistas.forEach(especialista => {
      const optionEsp = document.createElement('option');

      optionEsp.value = especialista.id;
      optionEsp.textContent = especialista.first_name + " " + especialista.last_name + " - " + especialista.specialty.name;

      selectEspecialistas.appendChild(optionEsp);
    });
    configurarSelectEspecialistasMultiple();
  }

  async function cargarPacientes() {
    const selectPacientes = document.getElementById('patients');
    const pacientes = await patientService.getAll();


    pacientes.forEach(paciente => {
      const optionPac = document.createElement('option');

      optionPac.value = paciente.id;
      optionPac.textContent = paciente.first_name + " " + paciente.last_name;

      selectPacientes.appendChild(optionPac);
    });
    configurarSelectPacientesMultiple();
  }



  function configurarSelectEspecialistasMultiple() {
    const especialistas = document.getElementById('especialistas');

    especialistas.setAttribute('multiple', 'multiple');

    // Choices.js
    if (typeof Choices !== 'undefined') {
      const choices = new Choices(especialistas, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  function configurarSelectPacientesMultiple() {
    const patients = document.getElementById('patients');

    patients.setAttribute('multiple', 'multiple');

    // Choices.js
    if (typeof Choices !== 'undefined') {
      const choices = new Choices(patients, {
        removeItemButton: true,
        placeholder: true
      });
    }
  }

  document.getElementById('nextStep').addEventListener('click', async function() {
    const activeStep = document.querySelector('.nav-link.active'); // Selecciona el paso activo

    if (activeStep) {
      switch (activeStep.dataset.wizardStep) {
        case "1":
          const paramsFilter = obtenerFiltros();
          await queryBillingReport(paramsFilter);
          break;
        default:
          break;
      }
    }

  });

  function obtenerFiltros() {
    const procedureSelect = document.getElementById('procedure');
    const selectedProcedures = Array.from(procedureSelect.selectedOptions).map(option => option.value);
    const especialistasSelect = document.getElementById('especialistas');
    const selectedEspecialistas = Array.from(especialistasSelect.selectedOptions).map(option => option.value);
    const pacientesSelect = document.getElementById('patients');
    const selectedPacientes = Array.from(pacientesSelect.selectedOptions).map(option => option.value);
    const fechasProcedimientos = document.getElementById('fechasProcedimiento').value;
    const [fechaInicio, fechaFin] = fechasProcedimientos.split(' to ').map(fecha => {
      const [dia, mes, año] = fecha.split('/');
      return `20${año}-${mes}-${dia}`;
    });

    const paramsFilter = {
      end_date: fechaFin,
      start_date: fechaInicio,
      patient_ids: selectedPacientes,
      product_ids: selectedProcedures,
      user_ids: selectedEspecialistas,
    }

    return paramsFilter;
  }

  async function queryBillingReport(paramsFilter) {
    let dataBillingReport = await billingService.getBillingReport(paramsFilter);
    dataBillingReport = dataBillingReport.filter(item => item.type == "entity" && item.authorization_number != null);


    populateBillingTable(dataBillingReport);
  }

  function populateBillingTable(data) {
    const tbody = document.querySelector('.list-billing');
    tbody.innerHTML = ''; // Limpiar tabla existente

    data.forEach(item => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
            <td class="align-middle ps-3 name">${item.patient.first_name} ${item.patient.last_name}</td>
            <td class="align-middle email">${item.authorization_date}</td>
            <td class="align-middle email">${item.billed_procedure[0].product.name}</td>
            <td class="align-middle age">${item.authorization_number}</td>
            <td class="align-middle age">${item.billed_procedure[0].unit_price}</td>
            <td class="align-middle age">${item.billed_procedure[0].amount}</td>
            <td class="align-middle age">$${item.billed_procedure[0].amount}</td>
            <td class="align-middle white-space-nowrap text-end pe-0">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox">
                </div>
            </td>
        `;

      tbody.appendChild(tr);
    });
  }
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

  updateWizard();

  document.getElementById("fechaElaboracion").value = new Date().toLocaleDateString('es-ES');


  const entidades = [{
      id: 1,
      nombre: "Entidad 1"
    },
    {
      id: 2,
      nombre: "Entidad 2"
    },
    {
      id: 3,
      nombre: "Entidad 3"
    }
  ];

  const centrosCosto = [{
      id: 1,
      nombre: "Centro de costo 1"
    },
    {
      id: 2,
      nombre: "Centro de costo 2"
    },
    {
      id: 3,
      nombre: "Centro de costo 3"
    }
  ];

  const procedimientos = [{
      id: 1,
      nombre: "procedimiento 1"
    },
    {
      id: 2,
      nombre: "procedimiento 2"
    },
    {
      id: 3,
      nombre: "procedimiento 3"
    }
  ];
  const especialistas = [{
      id: 1,
      nombre: "especialista 1"
    },
    {
      id: 2,
      nombre: "especialista 2"
    },
    {
      id: 3,
      nombre: "especialista 3"
    }
  ];
  const pacientes = [{
      id: 1,
      nombre: "Paciente 1"
    },
    {
      id: 2,
      nombre: "Paciente 2"
    },
    {
      id: 3,
      nombre: "Paciente 3"
    }
  ];

  const impuestos = [{
      id: 1,
      nombre: "Impuesto 1"
    },
    {
      id: 2,
      nombre: "Impuesto 2"
    },
    {
      id: 3,
      nombre: "Impuesto 3"
    }
  ];

  function cargarImpuestosCargo() {
    const selectImpuestosCargo = document.getElementById('taxCharge');

    selectImpuestosCargo.innerHTML = '';

    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Seleccione los impuestos";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;

    selectImpuestosCargo.appendChild(placeholderOption);

    impuestos.forEach(impuesto => {
      const optionPro = document.createElement('option');

      optionPro.value = impuesto.id;

      optionPro.textContent = impuesto.nombre;

      selectImpuestosCargo.appendChild(optionPro);
    });
  }

  const metodoPagoCheck = document.getElementById('metodoPagoCheck');

  function cambiarMetodo() {
    const divMetodoPago = document.getElementById('divMetodoPago');
    const metodoPago = document.getElementById('metodoPago');
    const divDiasPlazo = document.getElementById('divDiasPlazo');
    const diasPlazo = document.getElementById('diasPlazo');
    const divFechaVencimiento = document.getElementById('divFechaVencimiento');
    const fechaVencimiento = document.getElementById('fechaVencimiento');
    const modoPago = document.getElementById('modoPago');

    if (metodoPagoCheck.checked) {
      divMetodoPago.style.display = 'block';
      metodoPago.required = true;
      divDiasPlazo.style.display = 'none';
      divFechaVencimiento.style.display = 'none';
      modoPago.value = 'contado';
    } else {
      divMetodoPago.style.display = 'none';
      divDiasPlazo.style.display = 'block';
      diasPlazo.required = true;
      divFechaVencimiento.style.display = 'block';
      fechaVencimiento.required = true;
      modoPago.value = 'credito';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    metodoPagoCheck.addEventListener('change', cambiarMetodo);
    cambiarMetodo();

    const diasPlazoInput = document.getElementById('diasPlazo');
    const fechaVencimientoInput = document.getElementById('fechaVencimiento');

    // Verificar si flatpickr está inicializado en el input de fecha
    let flatpickrInstance = fechaVencimientoInput._flatpickr;

    function calcularFechaVencimiento() {
      // Obtener el valor de días de plazo y convertirlo a número
      const diasPlazo = parseInt(diasPlazoInput.value, 10);

      // Verificar si el valor es un número válido
      if (!isNaN(diasPlazo)) {
        // Obtener la fecha actual
        const fechaActual = new Date();

        // Calcular la nueva fecha sumando los días de plazo
        const fechaVencimiento = new Date(fechaActual);
        fechaVencimiento.setDate(fechaActual.getDate() + diasPlazo);

        // Si flatpickr está disponible, usarlo para establecer la fecha
        if (flatpickrInstance) {
          flatpickrInstance.setDate(fechaVencimiento);
        } else {
          // Formatear la fecha manualmente en formato dd/mm/yyyy
          const dia = String(fechaVencimiento.getDate()).padStart(2, '0');
          const mes = String(fechaVencimiento.getMonth() + 1).padStart(2, '0'); // +1 porque los meses van de 0-11
          const año = fechaVencimiento.getFullYear();

          // Asignar la fecha formateada al input
          fechaVencimientoInput.value = `${dia}/${mes}/${año}`;
        }
      }
    }

    // Asignar evento input y change al campo de días de plazo
    diasPlazoInput.addEventListener('input', calcularFechaVencimiento);
    diasPlazoInput.addEventListener('change', calcularFechaVencimiento);

    // Calcular inicialmente en caso de que haya un valor predeterminado
    calcularFechaVencimiento();
  });

  function capturarDatos() {
    const fechaElaboracion = document.getElementById('fechaElaboracion').value;
    const tipoFactura = document.getElementById('tipoFactura').value;
    const entity = document.getElementById('entity').value;
    const centroCosto = document.getElementById('centroCosto').value;

    // Capturar valores y texto de selects múltiples, filtrando los valores vacíos
    const procedureSelect = document.getElementById('procedure');
    const proceduresData = Array.from(procedureSelect.selectedOptions)
      .filter(option => option.value !== "")
      .map(option => ({
        value: option.value,
        text: option.textContent
      }));

    const especialistasSelect = document.getElementById('especialistas');
    const especialistasData = Array.from(especialistasSelect.selectedOptions)
      .filter(option => option.value !== "")
      .map(option => ({
        value: option.value,
        text: option.textContent
      }));

    const patientsSelect = document.getElementById('patients');
    const patientsData = Array.from(patientsSelect.selectedOptions)
      .filter(option => option.value !== "")
      .map(option => ({
        value: option.value,
        text: option.textContent
      }));

    const fechasProcedimiento = document.getElementById('fechasProcedimiento').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value;

    // Extraer solo los valores y textos para usar en datos y visualización
    const procedures = proceduresData.map(item => item.value);
    const proceduresText = proceduresData.map(item => item.text);

    const especialistas = especialistasData.map(item => item.value);
    const especialistasText = especialistasData.map(item => item.text);

    const patients = patientsData.map(item => item.value);
    const patientsText = patientsData.map(item => item.text);

    const datos = {
      fechaElaboracion,
      tipoFactura,
      entity,
      centroCosto,
      procedures,
      especialistas,
      patients,
      fechasProcedimiento,
      metodoPago,
      fechaVencimiento
    };

    let htmlContent = `
    <div style="text-align: left;">
      <p><strong>Fecha de Elaboración:</strong> ${fechaElaboracion}</p>
      <p><strong>Tipo de Factura:</strong> ${tipoFactura}</p>
      <p><strong>Entidad:</strong> ${entity}</p>
      <p><strong>Centro de Costo:</strong> ${centroCosto}</p>
      <p><strong>Procedimientos:</strong> ${proceduresText.join(', ')}</p>
      <p><strong>Especialistas:</strong> ${especialistasText.join(', ')}</p>
      <p><strong>Pacientes:</strong> ${patientsText.join(', ')}</p>
      <p><strong>Fechas de Procedimiento:</strong> ${fechasProcedimiento}</p>
      <p><strong>Método de Pago:</strong> ${metodoPago}</p>
      <p><strong>Fecha de Vencimiento:</strong> ${fechaVencimiento}</p>
    </div>
  `;

    Swal.fire({
      title: 'Resumen factura',
      html: htmlContent,
      icon: 'info',
      confirmButtonText: 'Confirmar',
      confirmButtonColor: '#132030',
      width: '600px'
    }).then((res) => {
      if (res.isConfirmed) {
        window.location.reload();
      }
    });

    return datos;
  }
  const finishStep = document.getElementById('finishStep');
  finishStep.addEventListener("click", capturarDatos);

  document.addEventListener("DOMContentLoaded", function() {
    cargarImpuestosCargo();
  });
</script>




<!-- <script>
  // ? /////////////// ======== ///////////////////////////
  // ? /////////////// MODAL    ////////////////////////
  // ? /////////////// ======== ///////////////////////////
  function resetModalFacturaEmpresa() {
    indiceFila = 0;
    indiceFilaMP = 0;
    $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").html("");
    $("#modalNuevaFacturaEmpresa #tbody-modal-medios-pago").html("");

    $("#modalNuevaFacturaEmpresa #modal-resumen-total-pagado").html("0.00");
    $("#modalNuevaFacturaEmpresa #total-pagado").val(0);


    // AnadirFila();
    AnadirFilaMetodos("modalNuevaFacturaEmpresa")
  }

  function seleccionarCheckboxMultiple(checked, clase) {
    let elementos = $(`.${clase}`);
    elementos.each(function() {
      this.checked = checked;
    });
    calcularTotalSeleccionado();
  }


  function filtrarPacientes(idEmpresa) {
    let selectPacientes = $("#filtroEmpresapaciente option");

    // Si idEmpresa es 0 o está vacío, mostrar todas las opciones
    if (idEmpresa === "0" || idEmpresa === "") {
      selectPacientes.show();
    } else {
      selectPacientes.each(function() {
        const dataEmpresa = $(this).data("empresa");
        // Mostrar la opción si coincide con idEmpresa, ocultar si no
        if (dataEmpresa == idEmpresa || dataEmpresa == "") {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    }
  }

  // ? AQUI FORMAMOS UN ARRAY PARA CREAR EL LISTADO DE FACTURAS CON NUMEROS DE AUTORIZACION
  function obtenerJsonFacturasEmpresa() {
    const filas = $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion tr");
    let data = {};
    let isValid = true;

    filas.each(function() {
      if (!isValid) return;

      const fila = $(this);
      const idFila = fila.attr("id");
      const indice = idFila.replace("filaF", "");

      const numeroAutorizacion = $(`input[name='FacturasSeleccionadas[${indice}][nAutorizacion]']`);
      const facturaId = $(`input[name='FacturasSeleccionadas[${indice}][facturaId]']`);
      const clienteId = fila.attr("data-clienteid");
      const procedimientoId = fila.attr("data-procedimientoid");


      console.log("numeroAutorizacion =>" + numeroAutorizacion);
      console.log("facturaId =>" + facturaId);



      if (facturaId.is(":checked")) {
        if (numeroAutorizacion.val() === '') {
          isValid = false; // Validation fails
          return false; // Exit the loop
        } else {
          const procedimiento = {
            facturaId: Number(facturaId.attr("data-idfactura")),
            numeroAutorizacion: numeroAutorizacion.val(),
            clienteId: Number(clienteId),
            procedimientoId: Number(procedimientoId)
          };

          data[indice] = procedimiento;
        }
      }
    });

    return isValid ? JSON.stringify(data) : false; // Return data or false
  }



  function tabularDatosFacturaEntidad() {
    let datos = <?= $dataJsonSimuladaFacturas ?>;
    console.log("datos =>" + datos);
    let keysData = Object.keys(datos);


    keysData.forEach(key => {
      let data = datos[key];

      let valorTotal = Number(data.valor) * Number(data.cantidad) - Number(data.descuento);
      let fila = `<tr id="filaF${data.facturaId}" data-empresaid="${data.empresaId}" data-especialista="${data.especialistaId}" data-clienteid="${data.clienteId}" data-fecha="${data.fecha}" data-procedimientoid="${data.procedimientoId}">
                    <td style="padding:10px !important">
                      <select class="underline-input">
                        <option value="${data.clienteId}">${data.nombreCliente}</option>
                      </select>
                    </td> 
                    <td style="padding:10px !important"><input class="underline-input" type="date" readonly value="${data.fecha}"></td> 
                    <td style="padding:10px !important">
                      <select class="underline-input">
                        <option value="${data.procedimientoId}">${data.procedimientoNombre}</option>
                      </select>
                    </td> 
                    <td style="padding:10px !important"><input class="underline-input" onkeyup="calcularTotalSeleccionado()" name="FacturasSeleccionadas[${data.facturaId}][nAutorizacion]" type="text" value=""></td>                     
                    <td style="padding:10px !important"><input class="underline-input" type="number" readonly value="${data.valor}"></td> 
                    <td style="padding:10px !important">
                      <input class="underline-input" type="number" readonly value="${valorTotal}">
                    </td> 
                    <td style="padding:10px !important">
                      <input class="checkbox_multiple_empresa" name="FacturasSeleccionadas[${data.facturaId}][facturaId]" onchange="calcularTotalSeleccionado()" type="checkbox" data-idfactura="${data.facturaId}" value="${valorTotal}">
                    </td> 
                  </tr>`;
      $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").append(fila);
    })

  }


  function guardarFacturaEmpresa() {
    if ($("#facturasSeleccionadas").val() == 'false' || $("#facturasSeleccionadas").val() == '' || $("#facturasSeleccionadas").val() == false) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe completar los numeros de autorizacion de las facturas seleccionada'
      });
      return false;
    }


    let idS = ["tipoComprobante", "centro_costo", "vendedor_id", "entidadId", "numeroAutorizacion", "total-neto", "facturasSeleccionadas", "total-pagado", "fechaElaboracion", "fechaVencimiento", "usuario_id"];
    let next = true;
    let data = {};
    idS.forEach(element => {
      if (!next) return;
      let key = element;
      let selector = $("#modalNuevaFacturaEmpresa #" + element);
      let value = selector.val();

      if (selector.attr("required") && value == "") {
        next = false;
        return;
      }



      data[key] = key == "facturasSeleccionadas" ? JSON.parse(value) : value;
    });

    if (!next) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No puede dejar campos vacios'
      });
      return false;
    }

    let metodosPago = {};
    next = true;
    const filasMP = $("#modalNuevaFacturaEmpresa #tbody-modal-medios-pago tr")
    filasMP.each(function() {
      // Usar `this` dentro de `each` ya hace referencia a cada fila
      let fila = $(this); // Asegúrate de envolver `this` en `$()`
      let idFila = fila.attr("id");
      let indice = idFila.replace("filaMP", "");

      // Corrige el selector para obtener el valor del método de pago y el valor de pago
      let metodoPago = $(`select[name='MetodosPago[${indice}][idMetodoPago]']`).val();
      let valorMetodo = $(`input[name='MetodosPago[${indice}][valorPago]']`).val();
      let numeroComprobante = $(`input[name='MetodosPago[${indice}][numeroComprobante]']`).val();


      if (metodoPago !== "") {
        if (valorMetodo != "0" && valorMetodo != "") {
          let nuevoMP = {
            metodoPago,
            valorMetodo,
            numeroComprobante
          };

          metodosPago[indice] = nuevoMP;
        } else {
          return false;
        }
      }
    });


    if (!next) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que algun metodo de pago está en 0 o vacío'
      });
      return false;
    }


    data.metodosPago = metodosPago;

    console.log("DATA PARA GUARDAR");
    console.log(data);
    // Swal.fire({ icon: 'success', title: 'Correcto', text: 'Factura generada correctamente'});
    // return data;
    $.ajax({
      url: 'Facturacion/FE_Ajax_FacturacionEntidad.php',
      type: 'POST',
      data: JSON.stringify(data), // Envía la data en formato JSON


      success: function(response) {
        console.log('Respuesta del servidor:', response);
        Swal.fire({
          icon: 'success',
          title: 'Correcto',
          text: 'Factura generada correctamente'
        });

        resetModalFacturaEmpresa();
        $('#modalNuevaFacturaEmpresa').modal('hide'); // Ocultar el modal después de enviar la cita
        location.reload(); // Recargar la página después de actualizar la cita
      },
      error: function(xhr, status, error) {
        console.error('Error en la petición:', error);
      }
    });

    return data;

  }




  function calcularTotalSeleccionado() {
    let checkboxes = $('.checkbox_multiple_empresa');
    let valortotal = 0;

    console.log("checkboxes");
    console.log(checkboxes);


    // Usamos each de jQuery para iterar sobre los checkboxes
    checkboxes.each(function() {
      if (this.checked) {
        valortotal += Number($(this).val());
        console.log("Iterando en calcularTotalSeleccionado" + Number($(this).val()));
        console.log("valorSumar => " + valortotal);
        console.log("valortotal => " + valortotal);

      }
    });

    console.log("El json es: ");
    console.log(obtenerJsonFacturasEmpresa());


    // Actualizar el total y el campo oculto
    $("#modalNuevaFacturaEmpresa #total-neto-inner").html(valortotal.toFixed(2));
    $("#modalNuevaFacturaEmpresa #modal-resumen-total-facturado").html(valortotal.toFixed(2));
    $("#modalNuevaFacturaEmpresa #total-neto").val(valortotal);
    $("#modalNuevaFacturaEmpresa #facturasSeleccionadas").val(obtenerJsonFacturasEmpresa());
  }


  function filtrarTablaModalEmpresa() {

    let filtroEmpresaId = $("#entidadId").val();
    let filtroEmpresafechaInicio = $("#filtroEmpresafechaInicio").val();
    let filtroEmpresafechaFin = $("#filtroEmpresafechaFin").val();
    let filtroEmpresapaciente = $("#filtroEmpresapaciente").val();
    let filtroEmpresaprocedimiento = $("#filtroEmpresaprocedimiento").val();
    let filtroEmpresaespecialista = $("#filtroEmpresaespecialista").val();

    // seleccionarNadaCheckbox("checkbox_multiple_empresa");
    seleccionarCheckboxMultiple(false, "checkbox_multiple_empresa");


    $('#modalNuevaFacturaEmpresa #tbody-modal-facturacion tr').each(function() {
      const fila = $(this);
      const data_empresaid = fila.attr("data-empresaid");
      const data_clienteid = fila.attr("data-clienteid");
      const data_especialista = fila.attr("data-especialista");
      const data_fecha = fila.attr("data-fecha");
      const data_procedimientoid = fila.attr("data-procedimientoid");

      // Obtener la fecha de la fila
      const fechaFila = new Date(data_fecha);
      const fechaInicio = new Date(filtroEmpresafechaInicio);
      const fechaFin = new Date(filtroEmpresafechaFin);

      // Inicializar visibilidad de la fila
      let mostrarFila = true;

      // Filtrar por fecha
      if (filtroEmpresafechaInicio !== "" && filtroEmpresafechaFin !== "") {
        if (fechaFila < fechaInicio || fechaFila > fechaFin) {
          mostrarFila = false;
        }
      }

      // Filtrar por paciente
      if (filtroEmpresapaciente.length > 0 && !filtroEmpresapaciente.includes("0") && !filtroEmpresapaciente.includes("")) {
        if (!filtroEmpresapaciente.includes(data_clienteid)) {
          mostrarFila = false;
        }
      }


      // Filtrar por procedimiento
      // if (filtroEmpresaprocedimiento !== "" && filtroEmpresaprocedimiento !== "0") {
      if (filtroEmpresaprocedimiento.length > 0 && !filtroEmpresaprocedimiento.includes("0") && !filtroEmpresaprocedimiento.includes("")) {
        // if (data_procedimientoid !== filtroEmpresaprocedimiento) {
        if (!filtroEmpresaprocedimiento.includes(data_procedimientoid)) {
          mostrarFila = false;
        }
      }

      if (filtroEmpresaId !== "" && filtroEmpresaId !== "0") {
        if (data_empresaid !== filtroEmpresaId) {
          mostrarFila = false;
        }
      }

      if (filtroEmpresaespecialista !== "" && filtroEmpresaespecialista !== "0") {
        if (data_especialista !== filtroEmpresaespecialista) {
          mostrarFila = false;
        }
      }

      // Mostrar u ocultar la fila según los filtros
      if (mostrarFila) {
        fila.show();
      } else {
        fila.hide();
      }
    });
  }

  function AbrirModalFacuraEmpresa() {
    $("#modalNuevaFacturaEmpresa #vendedor_id").html(obtenerOptionsVendedores("Seleccione")).val("").change();








    $("#modalNuevaFacturaEmpresa #entidadId").val("").change();
    $("#modalNuevaFacturaEmpresa #tbody-modal-facturacion").html("");
    $("#modalNuevaFacturaEmpresa #tipoComprobante").val("Factura_Entidad").change();
    $("#filtroEmpresapaciente").html(obtenerOptionsCliente());
    $("#filtroEmpresaprocedimiento").html(obtenerOptionsProcedimiento());
    $("#filtroEmpresaespecialista").html(obtenerOptionsEspecialista());
    $("#modalNuevaFacturaEmpresa #centro_costo").html(obtenerOptionsCentrosCosto());
    $("#modalNuevaFacturaEmpresa #modal-resumen-n-autorizacion").html(($("#numeroAutorizacion").val() != '' ? $("#numeroAutorizacion").val() : 'No aplica'));

    tabularDatosFacturaEntidad();
    filtrarTablaModalEmpresa();
    paginacionModal("modalNuevaFacturaEmpresa", "modalFacturaEmpresa_p", 3) /// funcion para generar las paginaciones del modal => se encuentra en includeGeneralesModalFE.php

  }



  $(document).ready(function() {
    // AnadirFila();
    $('#modalNuevaFacturaEmpresa').on('hidden.bs.modal', function() {
      resetModalFacturaEmpresa()
    });

    $('#modalNuevaFacturaEmpresa').on('shown.bs.modal', function() {
      AnadirFilaMetodos("modalNuevaFacturaEmpresa");
      AbrirModalFacuraEmpresa();
    });

    selectToModal("modalNuevaFacturaEmpresa", "select2ModalEmpresa");


  });
</script> -->