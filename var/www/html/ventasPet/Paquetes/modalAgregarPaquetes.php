<div class="modal fade modal-xl" id="modalAgregarPaquetes" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo paquete</h5>
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
                                                <?php include "../Incapacidades/formIncapacidad.php"?>
                                            </div>
                                            <div id="divRemision">
                                                <?php include "../react-dist/remissions/RemissionsForm.js" ?>
                                            </div>
                                        </div>
                                    </div>
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
<!-- <script>
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

    const medicamentos = [{
            nombre: "Paracetamol",
            presentacion: "Tabletas",
            concentracion: "500 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Ibuprofeno",
            presentacion: "Tabletas",
            concentracion: "400 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Amoxicilina",
            presentacion: "Cápsulas",
            concentracion: "500 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Ciprofloxacino",
            presentacion: "Tabletas",
            concentracion: "250 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Loratadina",
            presentacion: "Tabletas",
            concentracion: "10 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Cetirizina",
            presentacion: "Tabletas",
            concentracion: "10 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Losartán",
            presentacion: "Tabletas",
            concentracion: "50 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Amlodipino",
            presentacion: "Tabletas",
            concentracion: "5 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Metformina",
            presentacion: "Tabletas",
            concentracion: "500 mg",
            via_administracion: "Oral"
        },
        {
            nombre: "Insulina",
            presentacion: "Inyección",
            concentracion: "Varía según el tipo",
            via_administracion: "Subcutánea"
        }
    ];

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

    const examenes = [
        "Análisis de sangre",
        "Radiografía de tórax",
        "Ultrasonido abdominal",
        "Electrocardiograma",
        "Prueba de función pulmonar",
        "Prueba de embarazo",
        "Hemograma",
        "Prueba de glucosa",
        "Colesterol total",
        "Análisis de orina"
    ];

    const vacunas = [
        "Vacuna contra la influenza",
        "Vacuna contra el tétanos",
        "Vacuna contra el sarampión",
        "Vacuna contra la varicela",
        "Vacuna contra la hepatitis B",
        "Vacuna contra la hepatitis A",
        "Vacuna contra el VPH (Virus del Papiloma Humano)",
        "Vacuna contra la neumonía",
        "Vacuna contra la fiebre amarilla",
        "Vacuna contra la difteria"
    ];

    const insumos = [{
            procedimiento: "Consulta general",
            insumo: "Termómetro"
        },
        {
            procedimiento: "Consulta general",
            insumo: "Esfigmomanómetro"
        },
        {
            procedimiento: "Consulta general",
            insumo: "Estetoscopio"
        },
        {
            procedimiento: "Ecografía abdominal",
            insumo: "Gel para ecografía"
        },
        {
            procedimiento: "Ecografía abdominal",
            insumo: "Transductor"
        },
        {
            procedimiento: "Ecografía abdominal",
            insumo: "Monitor"
        },
        {
            procedimiento: "Electrocardiograma",
            insumo: "Electrodos"
        },
        {
            procedimiento: "Electrocardiograma",
            insumo: "Cable de ECG"
        },
        {
            procedimiento: "Electrocardiograma",
            insumo: "Monitor de ECG"
        },
        {
            procedimiento: "Ecocardiograma",
            insumo: "Gel para ecografía"
        },
        {
            procedimiento: "Ecocardiograma",
            insumo: "Transductor cardíaco"
        },
        {
            procedimiento: "Ecocardiograma",
            insumo: "Monitor"
        },
        {
            procedimiento: "Biopsia tumoral",
            insumo: "Aguja de biopsia"
        },
        {
            procedimiento: "Biopsia tumoral",
            insumo: "Guantes estériles"
        },
        {
            procedimiento: "Biopsia tumoral",
            insumo: "Suturas"
        },
        {
            procedimiento: "Radiografía de tórax",
            insumo: "Película radiográfica"
        },
        {
            procedimiento: "Radiografía de tórax",
            insumo: "Delantal plomado"
        },
        {
            procedimiento: "Radiografía de tórax",
            insumo: "Protector de tiroides"
        },
        {
            procedimiento: "Papanicolaou",
            insumo: "Espátula de madera"
        },
        {
            procedimiento: "Papanicolaou",
            insumo: "Hisopo"
        },
        {
            procedimiento: "Papanicolaou",
            insumo: "Copa de recolección"
        },
        {
            procedimiento: "Colposcopía",
            insumo: "Colposcopio"
        },
        {
            procedimiento: "Colposcopía",
            insumo: "Ácido acético"
        },
        {
            procedimiento: "Colposcopía",
            insumo: "Luz de colposcopio"
        },
        {
            procedimiento: "Mastografía",
            insumo: "Película radiográfica"
        },
        {
            procedimiento: "Mastografía",
            insumo: "Compresor mamario"
        },
        {
            procedimiento: "Mastografía",
            insumo: "Delantal plomado"
        },
        {
            procedimiento: "Tomografía computarizada",
            insumo: "Contraste intravenoso"
        },
        {
            procedimiento: "Tomografía computarizada",
            insumo: "Guantes estériles"
        },
        {
            procedimiento: "Tomografía computarizada",
            insumo: "Túnel tomográfico"
        }
    ];

    document.addEventListener('DOMContentLoaded', function() {
        const selectCupsCie = document.getElementById('CupsCie');
        const divCie = document.getElementById('divCie');
        const divCups = document.getElementById('divCups');
        const selectCie = document.getElementById('selectCie');
        const selectCups = document.getElementById('selectCups');
        const nextStep = document.getElementById('nextStep');

        selectCupsCie.addEventListener('change', function() {
            divCie.style.display = 'none';
            divCups.style.display = 'none';

            if (this.value === 'cie11') {
                divCie.style.display = 'block';
                selectCie.required = true;
                selectCups.required = false;
                selectCups.value = "";
            } else if (this.value === 'cups') {
                divCups.style.display = 'block';
                selectCups.required = true;
                selectCie.required = false;
                selectCie.value = "";
            }
        });


        // Función para manejar el evento click del botón guardar
        document.getElementById('nextStep').addEventListener('click', function() {
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
                insumos: insumosSeleccionados
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

            console.log("Datos del paquete:", datosPaquete);
            validarDatosPaquete(datosPaquete);
            mostrarMedicamentos(medicamentos);
        }


        cargarCups();
        cargarCie();
        cargarMedicamentos(medicamentos);
        cargarExamenes(examenes);
        cargarVacunas(vacunas);
        cargarInsumos(insumos);
        controlarVisibilidadSelectores();
        configurarSelectMedicamentosMultiple();
        configurarSelectExamenesMultiple();
        configurarSelectVacunasMultiple();
        configurarSelectInsumosMultiple();


        document.getElementById('checkMedicamentos').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkExamenes').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkVacunas').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkInsumos').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkIncapacidad').addEventListener('change', controlarVisibilidadSelectores);
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
    // const checkRemision = document.getElementById('checkRemision');

    function controlarVisibilidadSelectores() {
        // Obtenemos el elemento contenedor principal
        const divSelects = document.getElementById('divSelects');

        // Obtenemos los estados de los switches
        const estadoMedicamentos = document.getElementById('checkMedicamentos').checked;
        const estadoExamenes = document.getElementById('checkExamenes').checked;
        const estadoVacunas = document.getElementById('checkVacunas').checked;
        const estadoInsumos = document.getElementById('checkInsumos').checked;
        const estadoIncapacidad = document.getElementById('checkIncapacidad').checked;

        // Obtenemos los divs que contienen los selectores
        const divMedicamentos = document.getElementById('divSelectMedicamentos');
        const divExamenes = document.getElementById('divSelectExamenes');
        const divVacunas = document.getElementById('divSelectVacunas');
        const divInsumos = document.getElementById('divSelecInsumos');
        const divIncapacidad = document.getElementById('divIncapacidad');

        // Verificamos si al menos un switch está activado para mostrar u ocultar el card principal
        const alMenosUnoActivado = estadoMedicamentos || estadoExamenes || estadoVacunas || estadoInsumos || estadoIncapacidad;
        divSelects.style.display = alMenosUnoActivado ? 'block' : 'none';

        // Controlamos la visibilidad de cada div según el estado de su switch correspondiente
        divMedicamentos.style.display = estadoMedicamentos ? 'block' : 'none';
        divExamenes.style.display = estadoExamenes ? 'block' : 'none';
        divVacunas.style.display = estadoVacunas ? 'block' : 'none';
        divInsumos.style.display = estadoInsumos ? 'block' : 'none';
        divIncapacidad.style.display = estadoIncapacidad ? 'block' : 'none';

    }

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
        medicamentos.forEach(medicamento => {
            const optionMeds = document.createElement('option');

            // Usamos el nombre como value
            optionMeds.value = medicamento.nombre;

            // Mostramos información adicional en el texto visible
            optionMeds.textContent = `${medicamento.nombre} - ${medicamento.concentracion} (${medicamento.presentacion})`;

            // Añadimos la opción al select
            selectMedicamentos.appendChild(optionMeds);
        });
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

        examenes.forEach(examen => {
            const optionExs = document.createElement('option');

            optionExs.value = examen;

            optionExs.textContent = examen;

            selectExamenes.appendChild(optionExs);
        });
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

        vacunas.forEach(vacuna => {
            const optionVac = document.createElement('option');

            optionVac.value = vacuna;

            optionVac.textContent = vacuna;

            selectVacunas.appendChild(optionVac);
        });
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

        insumos.forEach(insumo => {
            const optionIns = document.createElement('option');

            optionIns.value = insumo.insumo;

            optionIns.textContent = insumo.insumo;

            selectInsumos.appendChild(optionIns);
        });
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


    // Función auxiliar para mostrar los medicamentos
    function mostrarMedicamentos(medicamentos) {
        // Limpiar el contenido previo del div
        divCantidadMedicamentos.innerHTML = "";

        // Agregar estilos para centrar el contenido
        divCantidadMedicamentos.style.textAlign = "center";

        // Crear título para la tabla
        const tituloMedicamentos = document.createElement("h4");
        tituloMedicamentos.textContent = "Ingrese la cantidad para cada medicamento";
        divCantidadMedicamentos.appendChild(tituloMedicamentos);

        // Crear tabla
        const tablaMedicamentos = document.createElement("table");
        tablaMedicamentos.style.width = "80%";
        tablaMedicamentos.style.margin = "0 auto";
        tablaMedicamentos.style.borderCollapse = "collapse";
        tablaMedicamentos.style.marginTop = "15px";

        // Crear encabezado de la tablaMedicamentos
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        // Encabezado para nombre del medicamento
        const thNombre = document.createElement("th");
        thNombre.textContent = "Medicamento";
        thNombre.style.padding = "10px";
        thNombre.style.backgroundColor = "#f2f2f2";
        thNombre.style.borderBottom = "1px solid #ddd";
        thNombre.style.width = "75%";

        // Encabezado para cantidad
        const thCantidad = document.createElement("th");
        thCantidad.textContent = "Cantidad";
        thCantidad.style.padding = "10px";
        thCantidad.style.backgroundColor = "#f2f2f2";
        thCantidad.style.borderBottom = "1px solid #ddd";
        thCantidad.style.width = "25%";

        // Agregar encabezados a la fila y la fila al encabezado
        headerRow.appendChild(thNombre);
        headerRow.appendChild(thCantidad);
        thead.appendChild(headerRow);
        tablaMedicamentos.appendChild(thead);

        // Crear cuerpo de la tablaMedicamentos
        const tbody = document.createElement("tbody");

        // Agregar cada medicamento como una fila
        for (const medicamento of medicamentos) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdMed = 'cantidad_medicamento_' + medicamento.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            // Celda para el nombre del medicamento
            const tdNombre = document.createElement("td");
            tdNombre.textContent = medicamento || "Medicamento sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%";

            // Celda para el input de cantidad
            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%";

            // Crear input para la cantidad
            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.dataset.medicamento = medicamento;
            inputCantidad.id = inputIdMed;
            inputCantidad.className = "input-cantidad-medicamento";
            inputCantidad.style.width = "100px";
            inputCantidad.style.padding = "5px";
            inputCantidad.style.textAlign = "center";
            inputCantidad.style.borderRadius = "4px";
            inputCantidad.style.border = "1px solid #ccc";

            // Agregar input a la celda
            tdCantidad.appendChild(inputCantidad);

            // Agregar celdas a la fila
            row.appendChild(tdNombre);
            row.appendChild(tdCantidad);

            // Agregar fila al cuerpo de la tablaMedicamentos
            tbody.appendChild(row);
        }

        // Agregar cuerpo a la tablaMedicamentos
        tablaMedicamentos.appendChild(tbody);

        // Agregar la tablaMedicamentos al div
        divCantidadMedicamentos.appendChild(tablaMedicamentos);
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

        for (const vacuna of vacunas) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdVac = 'cantidad_vacuna_' + vacuna.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = vacuna || "Vacuna sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%"

            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%"

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

        for (const insumo of insumos) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdIns = 'cantidad_insumo_' + insumo.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = insumo || "Insumo sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%";

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

                console.log('Proceso finalizado');
                window.location.reload();
            }
        });

        // Mostrar ambos objetos
        console.log('Datos del paquete:', datosPaquete);
        console.log('Medicamentos con cantidades:', medicamentosConCantidad);
        console.log('Vacunas con cantidades:', vacunasConCantidad);
        console.log('Insumos con cantidades:', insumosConCantidad);
    });
</script> -->