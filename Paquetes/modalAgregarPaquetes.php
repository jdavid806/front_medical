<div class="modal fade modal-xl" id="modalAgregarPaquetes" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Paquete</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <!-- Indicadores de progreso -->
                <div class="steps-container mb-4">
                    <ul class="steps">
                        <li class="step active" data-step="1">
                            <span class="step-number">1</span>
                            <span class="step-label">Datos del paquete</span>
                        </li>
                        <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Cantidades</span>
                        </li>
                    </ul>
                </div>

                <!-- Contenido de los pasos -->
                <form id="formNuevoPaquete" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">

                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="nombrePaquete" required name="nombrePaquete">
                                            <label for="nombrePaquete" class="form-label">Nombre del paquete</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre del paquete.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="CupsCie" id="CupsCie" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <option value="cie11">CIE-11</option>
                                                <option value="cups">CUPS</option>
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">Relacionar a</label>
                                            <div class="invalid-feedback">Por favor seleccione lo que desea incluir al paquete.</div>
                                        </div>
                                    </div>
                                </div>



                                <div class="col-6 mt-3" id="divCie" style="display: none;">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="selectCie" id="selectCie">
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- Los options se generan desde el script -->
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">CIE-11</label>
                                            <div class="invalid-feedback">Por favor seleccione un diagnóstico.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6 mt-3" id="divCups" style="display: none;">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="selectCups" id="selectCups">
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- Los options se generan desde el script -->
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">CUPS</label>
                                            <div class="invalid-feedback">Por favor seleccione un procedimiento.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6" style="display: none;" id="divCodeCup">
                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="codeCup" placeholder="Ingrese el código" />
                                            <label for="codeCup" class="form-label">Código cup</label>
                                        </div>
                                        <input type="button" id="btnBuscarCup" class="btn btn-primary" value="Buscar">
                                    </div>
                                </div>

                                <div class="col-6" style="display: none;" id="divCodeCie">
                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="codeCie" placeholder="Ingrese el código" />
                                            <label for="codeCie" class="form-label">Código Cie11</label>
                                        </div>
                                        <input type="button" id="btnBuscarCie" class="btn btn-primary" value="Buscar">
                                    </div>
                                </div>

                                <div class="m-2" id="contentCup">

                                </div>

                                <div class="m-2" id="contentCie">

                                </div>

                                <div class="input-group mt-3">
                                    <div class="form-floating">
                                        <div class="row">
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkMedicamentos" type="checkbox" />
                                                    <label class="form-check-label" for="checkMedicamentos">Medicamentos</label>
                                                </div>
                                            </div>
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkExamenes" type="checkbox" />
                                                    <label class="form-check-label" for="checkExamenes">Exámenes</label>
                                                </div>
                                            </div>
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkVacunas" type="checkbox" />
                                                    <label class="form-check-label" for="checkVacunas">Vacunas</label>
                                                </div>
                                            </div>
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkInsumos" type="checkbox" />
                                                    <label class="form-check-label" for="checkInsumos">Insumos</label>
                                                </div>
                                            </div>
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkIncapacidad" type="checkbox" />
                                                    <label class="form-check-label" for="checkIncapacidad">Incapacidad</label>
                                                </div>
                                            </div>
                                            <div class="col-4 mt-2">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkRemision" type="checkbox" />
                                                    <label class="form-check-label" for="checkRemision">Remisión</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="divSelects" style="display: none;">
                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <div class="" id="divSelectMedicamentos" style="display: none;">
                                                <select class="form-select" id="selectMedicamentos">
                                                    <!-- <option value="" disabled>Seleccione los medicamentos</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectExamenes" style="display: none;">
                                                <select class="form-select" id="selectExamenes">
                                                    <!-- <option value="" selected disabled>Seleccione los exámenes</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectVacunas" style="display: none;">
                                                <select class="form-select" id="selectVacunas">
                                                    <!-- <option value="" selected disabled>Seleccione las vacunas</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelecInsumos" style="display: none;">
                                                <select class="form-select" id="selectInsumos">
                                                    <!-- <option value="" selected disabled>Seleccione los insumos</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" style="display: none;" id="divIncapacidad">
                                                <?php include "../Incapacidades/formIncapacidad.php" ?>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div class="mt-3" id="divRemision">
                                    <div id="formRemision"></div>
                                </div>
                            </div>
                        </div>
                        <div class="wizard-step" data-step="2">

                            <div id="divCantidadMedicamentos" style="display: none;">
                            </div>

                            <div id="divCantidadVacunas" style="display: none;">
                            </div>

                            <div id="divCantidadInsumos" style="display: none;">
                            </div>

                        </div>
                    </div>
                </form>
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
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        remissionsForm
    } from './react-dist/remissions/RemissionsForm.js';

    ReactDOMClient.createRoot(document.getElementById('formRemision')).render(React.createElement(remissionsForm));
</script>

<script type="module">
    import {
        cie11Service,
        cupsService,
        packagesService,
        examenTypeService
    } from './services/api/index.js';

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
        document.getElementById('nextStep').classList.toggle('d-none', currentStep === 2);
        document.getElementById('finishStep').classList.toggle('d-none', currentStep !== 2);
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

    let medicamentos = [];
    let vacunas = [];
    let insumos = [];
    let examenes = [];

    document.addEventListener('DOMContentLoaded', async function() {

        document.getElementById('contentFecha').style.display = 'none';

        medicamentos = await packagesService.getPackagesByMedications();
        vacunas = await packagesService.getPackagesByVaccines();
        insumos = await packagesService.getPackagesBySupplies();
        examenes = await examenTypeService.getExamenTypes();

        /**
         * Función para cargar los medicamentos en el select
         */
        function cargarMedicamentos() {
            // Obtenemos la referencia al select
            const selectMedicamentos = document.getElementById('selectMedicamentos');

            // Limpiamos todas las opciones existentes
            selectMedicamentos.innerHTML = '';

            // Creamos la opción placeholder
            const placeholderOption = document.createElement('option');
            placeholderOption.value = "";
            placeholderOption.textContent = "Seleccione los medicamentos";
            placeholderOption.disabled = true;
            placeholderOption.selected = true;

            // Añadimos el placeholder como primera opción
            selectMedicamentos.appendChild(placeholderOption);

            // Recorremos el array de medicamentos y creamos las opciones
            if (medicamentos.length > 0) {
                medicamentos.forEach(medicamento => {
                    const optionMeds = document.createElement('option');

                    // Usamos el nombre como value
                    optionMeds.value = medicamento.name + ' - ' + medicamento.id;

                    // Mostramos información adicional en el texto visible
                    optionMeds.textContent = `${medicamento.name} - (${medicamento.concentration ? medicamento.concentration : 'sin concentracion'}) (${medicamento.presentation ? medicamento.presentation : 'sin presentacion'})`;

                    // Añadimos la opción al select
                    selectMedicamentos.appendChild(optionMeds);
                });
            } else {
                const noDataOption = document.createElement('option');
                noDataOption.value = "";
                noDataOption.textContent = "No hay medicamentos disponibles";
                noDataOption.disabled = true;
                selectMedicamentos.appendChild(noDataOption);
            }
        }

        /**
         * Función para cargar los examenes en el select
         */
        function cargarExamenes() {
            const selectExamenes = document.getElementById('selectExamenes');

            selectExamenes.innerHTML = '';

            const placeholderOptionExs = document.createElement('option');
            placeholderOptionExs.value = "";
            placeholderOptionExs.textContent = "Seleccione los Exámenes";
            placeholderOptionExs.disabled = true;
            placeholderOptionExs.selected = true;

            selectExamenes.appendChild(placeholderOptionExs);

            if (examenes.length > 0) {
                examenes.forEach(examen => {
                    const optionExs = document.createElement('option');

                    optionExs.value = examen.id;

                    optionExs.textContent = examen.name;

                    selectExamenes.appendChild(optionExs);
                });
            } else {
                const noDataOption = document.createElement('option');
                noDataOption.value = "";
                noDataOption.textContent = "No hay exámenes disponibles";
                noDataOption.disabled = true;
                selectExamenes.appendChild(noDataOption);
            }
        }

        /**
         * Función para cargar las vacunas en el select
         */
        function cargarVacunas() {
            const selectVacunas = document.getElementById('selectVacunas');

            selectVacunas.innerHTML = '';

            const placeholderOptionVac = document.createElement('option');
            placeholderOptionVac.value = "";
            placeholderOptionVac.textContent = "Seleccione las Vacunas";
            placeholderOptionVac.disabled = true;
            placeholderOptionVac.selected = true;

            selectVacunas.appendChild(placeholderOptionVac);

            if (vacunas.length > 0) {
                vacunas.forEach(vacuna => {
                    const optionVac = document.createElement('option');

                    optionVac.value = vacuna.name + ' - ' + vacuna.id;

                    optionVac.textContent = vacuna.name;

                    selectVacunas.appendChild(optionVac);
                });
            } else {
                const noDataOption = document.createElement('option');
                noDataOption.value = "";
                noDataOption.textContent = "No hay vacunas disponibles";
                noDataOption.disabled = true;
                selectVacunas.appendChild(noDataOption);
            }
        }

        /**
         * Función para cargar los insumos en el select
         */
        function cargarInsumos() {
            const selectInsumos = document.getElementById('selectInsumos');

            selectInsumos.innerHTML = '';

            const placeholderOptionIns = document.createElement('option');
            placeholderOptionIns.value = "";
            placeholderOptionIns.textContent = "Seleccione los Insumos";
            placeholderOptionIns.disabled = true;
            placeholderOptionIns.selected = true;

            selectInsumos.appendChild(placeholderOptionIns);

            if (insumos.length) {
                insumos.forEach(insumo => {
                    const optionIns = document.createElement('option');

                    optionIns.value = insumo.name + ' - ' + insumo.id;

                    optionIns.textContent = insumo.name;

                    selectInsumos.appendChild(optionIns);
                });
            } else {
                const noDataOption = document.createElement('option');
                noDataOption.value = "";
                noDataOption.textContent = "No hay insumos disponibles";
                noDataOption.disabled = true;
                selectInsumos.appendChild(noDataOption);
            }
        }

        function configurarSelectMedicamentosMultiple() {
            // Obtenemos la referencia al select
            const selectMedicamentos = document.getElementById('selectMedicamentos');

            // Añadimos el atributo multiple
            selectMedicamentos.setAttribute('multiple', 'multiple');

            // Si estás usando alguna biblioteca como Choices.js
            if (typeof Choices !== 'undefined') {
                const choices = new Choices(selectMedicamentos, {
                    removeItemButton: true,
                    placeholder: true
                });
            }
        }

        function configurarSelectExamenesMultiple() {
            const selectExamenes = document.getElementById('selectExamenes');

            selectExamenes.setAttribute('multiple', 'multiple');

            if (typeof Choices !== 'undefined') {
                const choices = new Choices(selectExamenes, {
                    removeItemButton: true,
                    placeholder: true
                });
            }
        }

        function configurarSelectVacunasMultiple() {
            const selectVacunas = document.getElementById('selectVacunas');

            selectVacunas.setAttribute('multiple', 'multiple');

            if (typeof Choices !== 'undefined') {
                const choices = new Choices(selectVacunas, {
                    removeItemButton: true,
                    placeholder: true
                });
            }
        }

        function configurarSelectInsumosMultiple() {
            const selectInsumos = document.getElementById('selectInsumos');

            selectInsumos.setAttribute('multiple', 'multiple');

            if (typeof Choices !== 'undefined') {
                const choices = new Choices(selectInsumos, {
                    removeItemButton: true,
                    placeholder: true
                });
            }
        }

        cargarMedicamentos();
        cargarExamenes();
        cargarVacunas();
        cargarInsumos();

        configurarSelectMedicamentosMultiple();
        configurarSelectExamenesMultiple();
        configurarSelectVacunasMultiple();
        configurarSelectInsumosMultiple();

    });



    const procedimientos = [{
            codigo: "001010",
            nombre: "Consulta general"
        },
        {
            codigo: "001020",
            nombre: "Ecografía abdominal"
        },
        {
            codigo: "001030",
            nombre: "Electrocardiograma"
        },
        {
            codigo: "001040",
            nombre: "Ecocardiograma"
        },
        {
            codigo: "001050",
            nombre: "Biopsia tumoral"
        },
        {
            codigo: "001060",
            nombre: "Radiografía de tórax"
        },
        {
            codigo: "001070",
            nombre: "Papanicolaou"
        },
        {
            codigo: "001080",
            nombre: "Colposcopía"
        },
        {
            codigo: "001090",
            nombre: "Mastografía"
        },
        {
            codigo: "001100",
            nombre: "Tomografía computarizada"
        }
    ];

    const diagnosticos = [{
            codigo: "1A00",
            nombre: "COVID-19, enfermedad por coronavirus"
        },
        {
            codigo: "A00",
            nombre: "Cólera"
        },
        {
            codigo: "B20",
            nombre: "Infección por el virus de la inmunodeficiencia humana (VIH)"
        },
        {
            codigo: "C50",
            nombre: "Cáncer de mama"
        },
        {
            codigo: "D50",
            nombre: "Anemia por deficiencia de hierro"
        },
        {
            codigo: "E11",
            nombre: "Diabetes mellitus tipo 2"
        },
        {
            codigo: "F32",
            nombre: "Episodio depresivo mayor"
        },
        {
            codigo: "G40",
            nombre: "Epilepsia"
        },
        {
            codigo: "I10",
            nombre: "Hipertensión esencial (primaria)"
        },
        {
            codigo: "J44",
            nombre: "Enfermedad pulmonar obstructiva crónica (EPOC)"
        }
    ];





    document.addEventListener('DOMContentLoaded', function() {
        const selectCupsCie = document.getElementById('CupsCie');
        const divCie = document.getElementById('divCie');
        const divCups = document.getElementById('divCups');
        const divCodeCup = document.getElementById('divCodeCup');
        const divCodeCie = document.getElementById('divCodeCie');
        const selectCie = document.getElementById('selectCie');
        const selectCups = document.getElementById('selectCups');
        const nextStep = document.getElementById('nextStep');
        const notaRem = document.getElementById('note');

        selectCupsCie.addEventListener('change', function() {

            if (this.value === 'cie11') {
                divCodeCie.style.display = 'block';
                divCodeCup.style.display = 'none';
            } else if (this.value === 'cups') {
                divCodeCup.style.display = 'block';
                divCodeCie.style.display = 'none';
            }
        });


        // Función para manejar el evento click del botón guardar
        document.getElementById('nextStep').addEventListener('click', function() {
            const diasIncapacidad = document.getElementById('dias').value;
            const motivoIncapacidad = document.getElementById('reason').value;
            // const userRemision = document.getElementById('user').value;
            // const specialityRemision = document.getElementById('userSpecialty').value;
            // const noteRemision = document.getElementById('note').value;
            // Capturo los valores de los campos individuales
            const nombrePaquete = document.getElementById('nombrePaquete').value.trim();
            const cupsCie = document.getElementById('CupsCie').value;
            const selectCie = document.getElementById('selectCie').value;
            const selectCups = document.getElementById('selectCups').value;

            // Capturo los valores de los selects múltiples
            const medicamentosSeleccionados = obtenerSeleccionados('selectMedicamentos');
            const examenesSeleccionados = obtenerSeleccionados('selectExamenes');
            const vacunasSeleccionadas = obtenerSeleccionados('selectVacunas');
            const insumosSeleccionados = obtenerSeleccionados('selectInsumos');

            const datosPaquete = {
                nombrePaquete,
                cupsCie,
                selectCie,
                selectCups,
                medicamentos: medicamentosSeleccionados,
                examenes: examenesSeleccionados,
                vacunas: vacunasSeleccionadas,
                insumos: insumosSeleccionados,
                diasIncapacidad: diasIncapacidad,
                motivoIncapacidad: motivoIncapacidad,
                // usuarioRemision: userRemision,
                // especialidadRemision: specialityRemision,
                // notaRemision: noteRemision
            };

            // Mostrar todos los elementos seleccionados
            mostrarElementosSeleccionados(
                nombrePaquete,
                cupsCie,
                selectCie,
                selectCups,
                medicamentosSeleccionados,
                examenesSeleccionados,
                vacunasSeleccionadas,
                insumosSeleccionados,
                datosPaquete
            );

            sessionStorage.setItem('datosPaquete', JSON.stringify(datosPaquete));
        });



        /**
         * Función para obtener los valores seleccionados de un select múltiple
         * @param {string} selectId - El ID del elemento select
         * @return {Array} - Array con los valores seleccionados
         */
        function obtenerSeleccionados(selectId) {
            const select = document.getElementById(selectId);

            // Si el select no existe, devolver array vacío
            if (!select) return [];

            // Obtener todas las opciones seleccionadas
            const seleccionados = [];
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].selected && select.options[i].value !== "") {
                    seleccionados.push(select.options[i].value);
                }
            }

            return seleccionados;
        }

        /**
         * Función para mostrar todos los elementos seleccionados
         */
        function mostrarElementosSeleccionados(
            nombrePaquete,
            cupsCie,
            selectCie,
            selectCups,
            medicamentos,
            examenes,
            vacunas,
            insumos,
            datosPaquete
        ) {

            validarDatosPaquete(datosPaquete);
            mostrarMedicamentos(medicamentos);
        }


        cargarCups();
        cargarCie();
        controlarVisibilidadSelectores();



        document.getElementById('checkMedicamentos').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkExamenes').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkVacunas').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkInsumos').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkIncapacidad').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkRemision').addEventListener('change', controlarVisibilidadSelectores);
    });


    function cargarCups() {
        procedimientos.forEach(procedimiento => {
            const optionCups = document.createElement('option');
            const selectCups = document.getElementById('selectCups');
            optionCups.value = procedimiento.codigo;
            optionCups.textContent = procedimiento.codigo + " - " + procedimiento.nombre;
            selectCups.appendChild(optionCups);
        })
    }

    function cargarCie() {
        diagnosticos.forEach(diagnostico => {
            const optionCie = document.createElement('option');
            const selectCie = document.getElementById('selectCie');
            optionCie.value = diagnostico.codigo;
            optionCie.textContent = diagnostico.codigo + " - " + diagnostico.nombre;
            selectCie.appendChild(optionCie);
        })
    }

    const checkMedicamentos = document.getElementById('checkMedicamentos');
    const checkExamenes = document.getElementById('checkExamenes');
    const checkVacunas = document.getElementById('checkVacunas');
    const checkInsumos = document.getElementById('checkInsumos');
    const checkIncapacidad = document.getElementById('checkIncapacidad');
    const checkRemision = document.getElementById('checkRemision');

    function controlarVisibilidadSelectores() {
        // Obtenemos el elemento contenedor principal
        const divSelects = document.getElementById('divSelects');

        // Obtenemos los estados de los switches
        const estadoMedicamentos = document.getElementById('checkMedicamentos').checked;
        const estadoExamenes = document.getElementById('checkExamenes').checked;
        const estadoVacunas = document.getElementById('checkVacunas').checked;
        const estadoInsumos = document.getElementById('checkInsumos').checked;
        const estadoIncapacidad = document.getElementById('checkIncapacidad').checked;
        const estadoRemision = document.getElementById('checkRemision').checked;

        // Obtenemos los divs que contienen los selectores
        const divMedicamentos = document.getElementById('divSelectMedicamentos');
        const divExamenes = document.getElementById('divSelectExamenes');
        const divVacunas = document.getElementById('divSelectVacunas');
        const divInsumos = document.getElementById('divSelecInsumos');
        const divIncapacidad = document.getElementById('divIncapacidad');
        const divRemision = document.getElementById('divRemision');
        if (divRemision.style.display === 'none') {
            const notaRemision = document.getElementById('note');
            notaRemision.required = false;
        }

        // Verificamos si al menos un switch está activado para mostrar u ocultar el card principal
        const alMenosUnoActivado = estadoMedicamentos || estadoExamenes || estadoVacunas || estadoInsumos || estadoIncapacidad || estadoRemision;
        divSelects.style.display = alMenosUnoActivado ? 'block' : 'none';
        // const remisionActivo = estadoRemision;
        // divRemision = remisionActivo ? 'block' : 'none';

        // Controlamos la visibilidad de cada div según el estado de su switch correspondiente
        divMedicamentos.style.display = estadoMedicamentos ? 'block' : 'none';
        divExamenes.style.display = estadoExamenes ? 'block' : 'none';
        divVacunas.style.display = estadoVacunas ? 'block' : 'none';
        divInsumos.style.display = estadoInsumos ? 'block' : 'none';
        divIncapacidad.style.display = estadoIncapacidad ? 'block' : 'none';
        divRemision.style.display = estadoRemision ? 'block' : 'none';

    }





    const divCantidadMedicamentos = document.getElementById('divCantidadMedicamentos');
    const divCantidadVacunas = document.getElementById('divCantidadVacunas');
    const divCantidadInsumos = document.getElementById('divCantidadInsumos');

    function validarDatosPaquete(datosPaquete) {
        // Verificar que datosPaquete no sea null o undefined
        if (!datosPaquete) {
            // Si no existe el objeto datosPaquete, ocultar todos los divs
            divCantidadMedicamentos.style.display = "none";
            divCantidadVacunas.style.display = "none";
            divCantidadInsumos.style.display = "none";
            return;
        }

        // Medicamentos
        if (datosPaquete.medicamentos && datosPaquete.medicamentos.length > 0) {
            divCantidadMedicamentos.style.display = "block";
            mostrarMedicamentos(datosPaquete.medicamentos);
        } else {
            divCantidadMedicamentos.style.display = "none";
        }

        // Vacunas
        if (datosPaquete.vacunas && datosPaquete.vacunas.length > 0) {
            divCantidadVacunas.style.display = "block";
            mostrarVacunas(datosPaquete.vacunas);
        } else {
            divCantidadVacunas.style.display = "none";
        }

        // Insumos
        if (datosPaquete.insumos && datosPaquete.insumos.length > 0) {
            divCantidadInsumos.style.display = "block";
            mostrarInsumos(datosPaquete.insumos);
        } else {
            divCantidadInsumos.style.display = "none";
        }
    }


    function mostrarMedicamentos(medicamentos) {
        // Limpiar el contenido previo del div
        divCantidadMedicamentos.innerHTML = "";

        // Agregar título para el formulario de medicamentos
        const tituloMedicamentos = document.createElement("h4");
        tituloMedicamentos.textContent = "Ingrese la información para cada medicamento";
        divCantidadMedicamentos.appendChild(tituloMedicamentos);

        // Contenedor de las tarjetas con clases de Bootstrap
        const contenedor = document.createElement("div");
        contenedor.className = "row justify-content-center"; // Bootstrap row
        // Crear una tarjeta por cada medicamento
        medicamentos.forEach((medicamento, index) => {
            const medicamentoData = medicamento.split(' - ');
            const name = medicamentoData[0];
            const id = medicamentoData[1];
            const cardContainer = document.createElement("div");
            cardContainer.className = "col-md-12 mb-3"; // Columna responsive para cada tarjeta

            const card = document.createElement("div");
            card.className = "card card-medicamento p-3 shadow-sm"; // Clases de Bootstrap para diseño

            // Nombre del medicamento
            const nombreMed = document.createElement("h5");
            nombreMed.textContent = name || "Medicamento sin nombre";
            nombreMed.className = "text-center mb-3";
            card.appendChild(nombreMed);

            // Contenedor de los campos con Bootstrap
            const formRow = document.createElement("div");
            formRow.className = "row";

            // Campo de concentración
            const divConcentracion = document.createElement("div");
            divConcentracion.className = "col-6 mb-3";
            const inputConcentracion = document.createElement("input");
            inputConcentracion.type = "text";
            inputConcentracion.placeholder = "Concentración";
            inputConcentracion.className = "form-control";
            inputConcentracion.id = `concentracion-${index}`;
            inputConcentracion.value = medicamento.concentration || '';
            divConcentracion.appendChild(inputConcentracion);

            // Campo hidden para el ID del medicamento
            const inputId = document.createElement("input");
            inputId.type = "hidden";
            inputId.id = `medicamento_id-${index}`;
            inputId.value = id || '';
            card.appendChild(inputId);

            // Campo de frecuencia (Select)
            const divFrecuencia = document.createElement("div");
            divFrecuencia.className = "col-6 mb-3";
            const selectFrecuencia = document.createElement("select");
            selectFrecuencia.className = "form-control";
            selectFrecuencia.id = `frecuencia-${index}`;
            const opcionesFrecuencia = ["Seleccione", "Diaria", "Semanal", "Mensual"];
            opcionesFrecuencia.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.toLowerCase();
                option.textContent = opcion;
                selectFrecuencia.appendChild(option);
            });
            divFrecuencia.appendChild(selectFrecuencia);

            // Campo de presentación (Select)
            const divPresentacion = document.createElement("div");
            divPresentacion.className = "col-6 mb-3";
            const selectPresentacion = document.createElement("select");
            selectPresentacion.className = "form-control";
            selectPresentacion.id = `presentacion-${index}`;
            const opcionesPresentacion = ["Seleccione", "Crema", "Jarabe", "Inyeccion", "Tabletas"];
            opcionesPresentacion.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.toLowerCase();
                option.textContent = opcion;
                selectPresentacion.appendChild(option);
            });
            divPresentacion.appendChild(selectPresentacion);

            // Campo de cantidad (input)
            const divCantidad = document.createElement("div");
            divCantidad.className = "col-6 mb-3";
            divCantidad.style.display = "none"; // Oculto por defecto
            const inputCantidad = document.createElement("input");
            inputCantidad.type = "text1";
            inputCantidad.placeholder = "Cantidad";
            inputCantidad.className = "form-control";
            inputCantidad.id = `cantidad-${index}`;
            divCantidad.appendChild(inputCantidad);

            // Campo de "Tomar cada" (select)
            const divTomarCada = document.createElement("div");
            divTomarCada.className = "col-6 mb-3";
            divTomarCada.style.display = "none"; // Oculto por defecto
            const selectTomarCada = document.createElement("select");
            selectTomarCada.className = "form-control";
            selectTomarCada.id = `tomarCada-${index}`;
            const opcionesTomarCada = ["1 hora", "2 horas", "3 horas", "4 horas", "5 horas", "6 horas", "7 horas", "8 horas", "9 horas", "10 horas", "12 horas", "24 horas"];
            opcionesTomarCada.forEach(opcion => {
                const option = document.createElement("option");
                option.value = opcion.toLowerCase();
                option.textContent = opcion;
                selectTomarCada.appendChild(option);
            });
            divTomarCada.appendChild(selectTomarCada);

            // Evento para mostrar/ocultar campos según la selección
            selectPresentacion.addEventListener('change', function() {
                const seleccion = this.value;
                divCantidad.style.display = (seleccion === 'crema' || seleccion === 'jarabe' || seleccion === 'inyeccion') ? 'block' : 'none';
                divTomarCada.style.display = (seleccion === 'jarabe' || seleccion === 'tabletas') ? 'block' : 'none';
            });

            // Campo de duración en días
            const divDuracion = document.createElement("div");
            divDuracion.className = "col-6 mb-3";
            const inputDuracion = document.createElement("input");
            inputDuracion.type = "number";
            inputDuracion.placeholder = "Duración (días)";
            inputDuracion.className = "form-control";
            inputDuracion.id = `duracion-${index}`;
            divDuracion.appendChild(inputDuracion);

            // Campo de indicaciones
            const divIndicaciones = document.createElement("div");
            divIndicaciones.className = "col-12 mb-3";
            const textareaIndicaciones = document.createElement("textarea");
            textareaIndicaciones.placeholder = "Indicaciones";
            textareaIndicaciones.className = "form-control";
            textareaIndicaciones.id = `indicaciones-${index}`;
            textareaIndicaciones.rows = 2;
            divIndicaciones.appendChild(textareaIndicaciones);

            // Agregar los campos a la fila
            formRow.appendChild(divConcentracion);
            formRow.appendChild(divFrecuencia);
            formRow.appendChild(divDuracion);
            formRow.appendChild(divPresentacion);
            formRow.appendChild(divCantidad);
            formRow.appendChild(divTomarCada);
            formRow.appendChild(divIndicaciones);

            // Agregar fila al card
            card.appendChild(formRow);
            cardContainer.appendChild(card);
            contenedor.appendChild(cardContainer);
        });

        // Agregar el contenedor al div principal
        divCantidadMedicamentos.appendChild(contenedor);
    }


    function mostrarVacunas(vacunas) {
        divCantidadVacunas.innerHTML = "";

        divCantidadVacunas.style.textAlign = "center";

        const tituloVacunas = document.createElement("h4");
        tituloVacunas.textContent = "Ingrese la cantidad para cada vacuna";
        tituloVacunas.className = "mt-3";
        divCantidadVacunas.appendChild(tituloVacunas);

        const tablaVacunas = document.createElement("table");
        tablaVacunas.style.width = "80%";
        tablaVacunas.style.margin = "0 auto";
        tablaVacunas.style.borderCollapse = "collapse";
        tablaVacunas.style.marginTop = "15px";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const thNombre = document.createElement("th");
        thNombre.textContent = "Vacuna";
        thNombre.style.padding = "10px";
        thNombre.style.backgroundColor = "#f2f2f2";
        thNombre.style.borderBottom = "1px solid #ddd";
        thNombre.style.width = "75%";

        const thCantidad = document.createElement("th");
        thCantidad.textContent = "Cantidad";
        thCantidad.style.padding = "10px";
        thCantidad.style.backgroundColor = "#f2f2f2";
        thCantidad.style.borderBottom = "1px solid #ddd";
        thCantidad.style.width = "25%";

        headerRow.appendChild(thNombre);
        headerRow.appendChild(thCantidad);
        thead.appendChild(headerRow);
        tablaVacunas.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (const [index, vacuna] of vacunas.entries()) {

            const vacunaData = vacuna.split(' - ');
            const name = vacunaData[0];
            const id = vacunaData[1];

            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdVac = 'cantidad_vacuna_' + vacuna.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = name || "Vacuna sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%";

            const inputId = document.createElement("input");
            inputId.type = "hidden";
            inputId.value = id;
            inputId.id = `vacuna_id_${index}`;
            row.appendChild(inputId);

            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%";

            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.dataset.vacuna = vacuna;
            inputCantidad.id = inputIdVac;
            inputCantidad.className = "input-cantidad-vacuna";
            inputCantidad.style.width = "100px";
            inputCantidad.style.padding = "5px";
            inputCantidad.style.textAlign = "center";
            inputCantidad.style.borderRadius = "4px";
            inputCantidad.style.border = "1px solid #ccc";

            tdCantidad.appendChild(inputCantidad);

            row.appendChild(tdNombre);
            row.appendChild(tdCantidad);

            tbody.appendChild(row);
        }

        tablaVacunas.appendChild(tbody);

        divCantidadVacunas.appendChild(tablaVacunas);
    }

    function mostrarInsumos(insumos) {
        divCantidadInsumos.innerHTML = "";

        divCantidadInsumos.style.textAlign = "center";

        const tituloInsumos = document.createElement("h4");
        tituloInsumos.textContent = "Ingrese la cantidad para cada insumo";
        tituloInsumos.className = "mt-3";
        divCantidadInsumos.appendChild(tituloInsumos);

        const tablaInsumos = document.createElement("table");
        tablaInsumos.style.width = "80%";
        tablaInsumos.style.margin = "0 auto";
        tablaInsumos.style.borderCollapse = "collapse";
        tablaInsumos.style.marginTop = "15px";

        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        const thNombre = document.createElement("th");
        thNombre.textContent = "Insumo";
        thNombre.style.padding = "10px";
        thNombre.style.backgroundColor = "#f2f2f2";
        thNombre.style.borderBottom = "1px solid #ddd";
        thNombre.style.width = "75%";

        const thCantidad = document.createElement("th");
        thCantidad.textContent = "Cantidad";
        thCantidad.style.padding = "10px";
        thCantidad.style.backgroundColor = "#f2f2f2";
        thCantidad.style.borderBottom = "1px solid #ddd";
        thCantidad.style.width = "25%";

        headerRow.appendChild(thNombre);
        headerRow.appendChild(thCantidad);
        thead.appendChild(headerRow);
        tablaInsumos.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (const [index, insumo] of insumos.entries()) {

            const insumoData = insumo.split(' - ');
            const name = insumoData[0];
            const id = insumoData[1];

            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdIns = 'cantidad_insumo_' + insumo.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = name || "Insumo sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%";

            const inputId = document.createElement("input");
            inputId.type = "hidden";
            inputId.value = id;
            inputId.id = `insumo_id_${index}`;
            row.appendChild(inputId);

            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%";

            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.dataset.insumo = insumo;
            inputCantidad.id = inputIdIns;
            inputCantidad.className = "input-cantidad-insumo";
            inputCantidad.style.width = "100px";
            inputCantidad.style.padding = "5px";
            inputCantidad.style.textAlign = "center";
            inputCantidad.style.borderRadius = "4px";
            inputCantidad.style.border = "1px solid #ccc";

            tdCantidad.appendChild(inputCantidad);

            row.appendChild(tdNombre);
            row.appendChild(tdCantidad);

            tbody.appendChild(row);
        }

        tablaInsumos.appendChild(tbody);

        divCantidadInsumos.appendChild(tablaInsumos);
    }

    document.getElementById('finishStep').addEventListener('click', function() {
        // Recuperar datosPaquete del sessionStorage
        const datosPaquete = JSON.parse(sessionStorage.getItem('datosPaquete')) || {};
        event.preventDefault();

        // Obtener todos los inputs de cantidad de medicamentos
        const inputsCantidadMeds = document.querySelectorAll('.input-cantidad-medicamento');
        const inputsCantidadVacs = document.querySelectorAll('.input-cantidad-vacuna');
        const inputsCantidadIns = document.querySelectorAll('.input-cantidad-insumo');

        // Crear objetos para las cantidades
        const medicamentosConCantidad = {};
        const vacunasConCantidad = {};
        const insumosConCantidad = {};

        inputsCantidadMeds.forEach(input => {
            const nombreMedicamento = input.dataset.medicamento;
            const cantidadMedicamentos = parseInt(input.value) || 0;
            medicamentosConCantidad[nombreMedicamento] = cantidadMedicamentos;
        });

        inputsCantidadVacs.forEach(input => {
            const nombreVacuna = input.dataset.vacuna;
            const cantidadVacunas = parseInt(input.value) || 0;
            vacunasConCantidad[nombreVacuna] = cantidadVacunas;
        });

        inputsCantidadIns.forEach(input => {
            const nombreInsumo = input.dataset.insumo;
            const cantidadInsumos = parseInt(input.value) || 0;
            insumosConCantidad[nombreInsumo] = cantidadInsumos;
        });

        let relacionPaquete = '';
        if (datosPaquete.cupsCie === 'cie11') {
            relacionPaquete = `<strong>Relacionado a:</strong> CIE-11<br>
                         <strong>CIE-11:</strong> ${datosPaquete.selectCie || 'No especificado'}`;
        } else if (datosPaquete.cupsCie === 'cups') {
            relacionPaquete = `<strong>Relacionado a:</strong> CUPS<br>
                         <strong>CUPS:</strong> ${datosPaquete.selectCups || 'No especificado'}`;
        } else {
            relacionPaquete = 'Relación no especificada';
        }

        // Crear el contenido HTML para el resumen
        let contenidoResumen = `
        <div style="text-align: left; padding: 10px;">
            <h3 style="margin-bottom: 15px;">Resumen del Paquete</h3>
            
            <div style="margin-bottom: 15px;">
                <strong>Nombre:</strong> ${datosPaquete.nombrePaquete || 'No especificado'}<br>
                ${relacionPaquete}
            </div>
    `;

        // Agregar medicamentos si existen
        if (datosPaquete.medicamentos && datosPaquete.medicamentos.length > 0) {
            contenidoResumen += `
            <div style="margin-bottom: 15px;">
                <strong>Medicamentos:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaquete.medicamentos.forEach(med => {
                const cantidad = medicamentosConCantidad[med] || 0;
                contenidoResumen += `<li>${med} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumen += `
                </ul>
            </div>
        `;
        }

        // Agregar exámenes si existen
        if (datosPaquete.examenes && datosPaquete.examenes.length > 0) {
            contenidoResumen += `
            <div style="margin-bottom: 15px;">
                <strong>Exámenes:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaquete.examenes.forEach(exam => {
                contenidoResumen += `<li>${exam}</li>`;
            });

            contenidoResumen += `
                </ul>
            </div>
        `;
        }

        // Agregar vacunas si existen
        if (datosPaquete.vacunas && datosPaquete.vacunas.length > 0) {
            contenidoResumen += `
            <div style="margin-bottom: 15px;">
                <strong>Vacunas:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaquete.vacunas.forEach(vac => {
                const cantidad = vacunasConCantidad[vac] || 0;
                contenidoResumen += `<li>${vac} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumen += `
                </ul>
            </div>
        `;
        }

        // Agregar insumos si existen
        if (datosPaquete.insumos && datosPaquete.insumos.length > 0) {
            contenidoResumen += `
            <div style="margin-bottom: 15px;">
                <strong>Insumos:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaquete.insumos.forEach(ins => {
                const cantidad = insumosConCantidad[ins] || 0;
                contenidoResumen += `<li>${ins} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumen += `
                </ul>
            </div>
        `;
        }

        // Agregar incapacidad si existe
        if (datosPaquete.diasIncapacidad && datosPaquete.diasIncapacidad.length > 0) {
            contenidoResumen += `
            <div style="margin-bottom: 15px;">
                <strong>Incapacidad:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
                <li>Dias: ${datosPaquete.diasIncapacidad}</li>
                <li>Motivo: ${datosPaquete.motivoIncapacidad}</li>
        `;

            // Agregar remision si existe
            // if (datosPaquete.diasIncapacidad && datosPaquete.diasIncapacidad.length > 0) {
            //     contenidoResumen += `
            //     <div style="margin-bottom: 15px;">
            //         <strong>Incapacidad:</strong>
            //         <ul style="margin-top: 5px; padding-left: 20px;">
            //         <li>Dias: ${datosPaquete.diasIncapacidad}</li>
            //         <li>Motivo: ${datosPaquete.motivoIncapacidad}</li>
            // `;

            // datosPaquete.insumos.forEach(ins => {
            //     const cantidad = insumosConCantidad[ins] || 0;
            //     contenidoResumen += `<li>${ins} - Cantidad: ${cantidad}</li>`;
            // });

            contenidoResumen += `
                </ul>
            </div>
        `;
        }

        contenidoResumen += `</div>`;

        Swal.fire({
            title: 'Paquete Creado',
            html: contenidoResumen,
            icon: 'success',
            width: '600px',
            confirmButtonText: 'Finalizar',
            confirmButtonColor: '#4CAF50'
        }).then((result) => {
            if (result.isConfirmed) {

                window.location.reload();
            }
        });

    });
</script>

<script type="module">
    let choicesExamenes;
    import {
        cie11Service,
        cupsService,
        packagesService
    } from './services/api/index.js';
    import {
        getUserLogged
    } from './services/utilidades.js';
    let timeout;
    let userLogged;
    document.addEventListener('DOMContentLoaded', function() {
        userLogged = getUserLogged();
    })
    document.getElementById('btnBuscarCup').addEventListener('click', function() {
        queryCups();
    });
    document.getElementById('btnBuscarCie').addEventListener('click', function() {
        queryCie();
    });

    async function queryCups() {

        const codeType = document.getElementById('codeCup').value;
        const contentCup = document.getElementById('contentCup');
        const contentCie = document.getElementById('contentCie');

        contentCup.innerHTML = "";
        contentCie.innerHTML = "";

        if (codeType.trim() === "") return; // Evita llamadas innecesarias si el input está vacío

        try {
            const response = await cupsService.getCupsByCode(codeType);

            if (response && Array.isArray(response) && response.length > 0) {
                const cup = response[0]; // Suponiendo que solo necesitas el primer resultado

                contentCup.innerHTML = `
                    <div class="card p-2">
                        <h3 style="font-weight: bold; font-size: 20px">${cup.Nombre}</h3>
                        <p style="margin: 5px 0;"><strong>Código CUP:</strong> ${cup.Codigo}</p>
                        <p style="margin: 5px 0;"><strong>Descripción:</strong> ${cup.Descripcion}</p>
                    </div>
                `;
            } else {
                contentCup.innerHTML = `
                    <p style="color: red; margin-top: 10px;">No se encontró información para el código ingresado.</p>
                `;
            }

        } catch (error) {
            console.error("Error al obtener datos:", error);
            contentCup.innerHTML = `<p style="color: red; margin-top: 10px;">Error al cargar los datos.</p>`;
        }

    }

    async function queryCie() {

        const codeType = document.getElementById('codeCie').value;
        const contentCie = document.getElementById('contentCie');
        const contentCup = document.getElementById('contentCup');

        contentCie.innerHTML = "";
        contentCup.innerHTML = "";

        if (codeType.trim() === "") return;

        try {
            const response = await cie11Service.getCie11ByCode(codeType);

            if (response && Array.isArray(response) && response.length > 0) {
                const cup = response[0]; // Suponiendo que solo necesitas el primer resultado

                contentCie.innerHTML = `
                    <div class="card p-2">
                        <h3 style="font-weight: bold; font-size: 20px">${cup.codigo}</h3>
                        <p style="margin: 5px 0;"><strong>Descripción:</strong> ${cup.descripcion}</p>
                    </div>
                `;
            } else {
                contentCie.innerHTML = `
                    <p style="color: red; margin-top: 10px;">No se encontró información para el código ingresado.</p>
                `;
            }

        } catch (error) {
            console.error("Error al obtener datos:", error);
            contentCie.innerHTML = `<p style="color: red; margin-top: 10px;">Error al cargar los datos.</p>`;
        }

    }

    function obtenerDatosVacunas() {
        const datos = [];
        // Seleccionar todos los inputs de cantidad
        const inputsCantidad = document.querySelectorAll('.input-cantidad-vacuna');

        inputsCantidad.forEach(input => {
            const cantidad = parseInt(input.value);

            // Validar que la cantidad sea un número válido
            if (!isNaN(cantidad) && cantidad >= 1) {
                // Obtener la fila padre
                const fila = input.closest('tr');

                // Buscar el input hidden con el ID de la vacuna
                const idVacunaInput = fila.querySelector('input[type="hidden"]');

                if (idVacunaInput) {
                    datos.push({
                        id: idVacunaInput.value,
                        quantity: `${cantidad}`,
                        type: 'Vacunas'
                    });
                }
            }
        });

        return datos;
    }

    function obtenerDatosInsumos() {
        const datos = [];
        // Seleccionar todos los inputs de cantidad de insumos
        const inputsCantidad = document.querySelectorAll('.input-cantidad-insumo');

        inputsCantidad.forEach(input => {
            const cantidad = parseInt(input.value);

            // Validar que la cantidad sea un número válido
            if (!isNaN(cantidad) && cantidad >= 1) {
                // Obtener la fila padre
                const fila = input.closest('tr');

                // Buscar el input hidden con el ID del insumo
                const idInsumoInput = fila.querySelector('input[type="hidden"]');

                if (idInsumoInput) {
                    datos.push({
                        id: idInsumoInput.value,
                        quantity: `${cantidad}`,
                        type: 'Insumos'
                    });
                }
            }
        });

        return datos;
    }

    function obtenerSeleccionados(selectId) {
        const select = document.getElementById(selectId);

        // Si el select no existe, devolver array vacío
        if (!select) return [];

        // Obtener todas las opciones seleccionadas
        const seleccionados = [];
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].selected && select.options[i].value !== "") {
                seleccionados.push(select.options[i].value);
            }
        }

        return seleccionados;
    }

    function obtenerValoresMedicamentos() {
        const medicamentosData = [];
        const tarjetas = document.querySelectorAll(".card-medicamento");
        const datosVacunas = obtenerDatosVacunas();
        const datosInsumos = obtenerDatosInsumos();
        const examenes = obtenerSeleccionados('selectExamenes')
        const incapacidades = [{
            id: 1,
            type: "Incapacidad",
            prescriptions: {
                days_incapacity: document.getElementById('dias').value,
                reason: document.getElementById('reason').value
            }
        }];

        let specialty_id = document.getElementById('userSpecialty') ? document.getElementById('userSpecialty').value.split(' - ').pop() : "";
        let user = document.getElementById('user') ? document.getElementById('user').value.split(' - ').pop() : "";

        let cup = document.getElementById('codeCup').value ? document.getElementById('codeCup').value : "";
        let cie11 = document.getElementById('codeCie').value ? document.getElementById('codeCie').value : "";
        let remision = []


        if (specialty_id) {
            remision = [{
                id: 1,
                type: "Remision",
                prescriptions: {
                    specialty_id,
                    note: document.getElementById('note').value
                }
            }];
        } else {
            remision = [{
                id: 1,
                type: "Remision",
                prescriptions: {
                    user,
                    note: document.getElementById('note').value
                }
            }];
        }

        tarjetas.forEach((card, index) => {
            const medicamentoObj = {
                nombre: card.querySelector("h5").textContent,
                id: card.querySelector("h5").textContent,
                concentration: document.getElementById(`concentracion-${index}`).value,
                frequency: document.getElementById(`frecuencia-${index}`).value,
                duration_days: document.getElementById(`duracion-${index}`).value,
                medication_type: document.getElementById(`presentacion-${index}`).value,
                quantity: document.getElementById(`cantidad-${index}`).value,
                instructions: document.getElementById(`indicaciones-${index}`).value,
                id: document.getElementById(`medicamento_id-${index}`).value,
                type: 'medicamento'
            };
            medicamentosData.push(medicamentoObj);
        });

        const items = buildData(datosVacunas, datosInsumos, medicamentosData, examenes, incapacidades, remision);

        let requestData;

        if (cup) {
            requestData = {
                name: document.getElementById('nombrePaquete').value,
                package_type_id: 5,
                description: "Este es un paquete de prueba.",
                cup,
                items: items
            }
        } else {
            requestData = {
                name: document.getElementById('nombrePaquete').value,
                package_type_id: 5,
                description: "Este es un paquete de prueba.",
                cie11,
                items: items
            }
        }

        return requestData;
    }

    function buildData(datosVacunas, datosInsumos, datosMedicamentos, examenes, incapacidades, remision) {

        let dataVacunasInsumos = [...datosVacunas, ...datosInsumos];

        datosMedicamentos = datosMedicamentos.map((item) => {
            return {
                id: item.id,
                type: item.type,
                prescriptions: {
                    concentration: item.concentration,
                    frequency: item.frequency,
                    duration_days: item.duration_days,
                    medication_type: item.medication_type,
                    quantity: item.quantity,
                    instructions: item.instructions
                }
            }


        });
        dataVacunasInsumos = dataVacunasInsumos.map((item) => {
            return {
                id: item.id,
                type: item.type,
                prescriptions: {
                    quantity: item.quantity,
                }
            }
        })

        examenes = examenes.map((item) => {
            return {
                id: item,
                type: 'Examen',
                prescriptions: {
                    quantity: "1",
                }
            }
        })

        return [...datosMedicamentos, ...dataVacunasInsumos, ...examenes, ...incapacidades, ...remision];

    }

    document.getElementById('finishStep').addEventListener('click', async function() {
        const requestData = obtenerValoresMedicamentos();
        console.log(requestData);

        await packagesService.createPackages(requestData).then(response => {
                console.log(response);
                // let contenidoResumen = `
                //     <div style="margin-bottom: 15px;">
                //         <ul style="margin-top: 5px; padding-left: 20px;">
                //         <li>Documento #: ${response.data.invoice_code}</li>
                //         </div>
                // `;
                // Swal.fire({
                //     title: 'Admision creada',
                //     html: contenidoResumen,
                //     icon: 'success',
                //     width: '600px',
                //     confirmButtonText: 'Finalizar',
                //     showCancelButton: true,
                //     cancelButtonText: 'Imprimir factura',
                //     confirmButtonColor: '#4CAF50'
                // }).then((result) => {
                //     console.log(result);
                //     if (result.isConfirmed) {

                //         window.location.href = 'citasControl'; // Redireccionar a la página de éxito
                //     } else {
                //         generateInvoice(response.admission_data.appointment_id, true);
                //         setTimeout(function() {
                //             window.location.href = 'citasControl';
                //         }, 3000);
                //     }
                // });
            })
            .catch(error => {
                console.error('Error al crear la admisión:', error);
            });
    });
</script>