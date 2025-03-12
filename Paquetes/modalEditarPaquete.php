<div class="modal fade modal-xl" id="modalEditarPaquete" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Editar Paquete</h5>
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
                <form id="formEditarPaquete" class="needs-validation" novalidate>
                    <div class="wizard-content">

                        <div class="wizard-step active" data-step="1">
                            <div class="row">

                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="nombrePaqueteEditar" required name="nombrePaqueteEditar">
                                            <label for="nombrePaqueteEditar" class="form-label">Nombre del paquete</label>
                                            <div class="invalid-feedback">Por favor ingrese el nombre del paquete.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="CupsCieEditar" id="CupsCieEditar" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <option value="cie11Editar">CIE-11</option>
                                                <option value="cupsEditar">CUPS</option>
                                            </select>
                                            <label for="CupsCieEditar" class="form-label">Relacionar a</label>
                                            <div class="invalid-feedback">Por favor seleccione lo que desea incluir al paquete.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6 mt-3" id="divCieEditar" style="display: none;">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="selectCieEditar" id="selectCieEditar">
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- Los options se generan desde el script -->
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">CIE-11</label>
                                            <div class="invalid-feedback">Por favor seleccione un diagnóstico.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6 mt-3" id="divCupsEditar" style="display: none;">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="selectCupsEditar" id="selectCupsEditar">
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- Los options se generan desde el script -->
                                            </select>
                                            <label for="selectCupsEditar" class="form-label">CUPS</label>
                                            <div class="invalid-feedback">Por favor seleccione un procedimiento.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="input-group mt-3">
                                    <div class="form-floating">
                                        <div class="row">
                                            <div class="col-3">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkMedicamentosEditar" type="checkbox" />
                                                    <label class="form-check-label" for="checkMedicamentosEditar">Medicamentos</label>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkExamenesEditar" type="checkbox" />
                                                    <label class="form-check-label" for="checkExamenesEditar">Exámenes</label>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkVacunasEditar" type="checkbox" />
                                                    <label class="form-check-label" for="checkVacunasEditar">Vacunas</label>
                                                </div>
                                            </div>
                                            <div class="col-3">
                                                <div class="form-check form-switch">
                                                    <input class="form-check-input" id="checkInsumosEditar" type="checkbox" />
                                                    <label class="form-check-label" for="checkInsumosEditar">Insumos</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="divSelectsEditar" style="display: none;">
                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <div class="" id="divSelectMedicamentosEditar" style="display: none;">
                                                <select class="form-select" id="selectMedicamentosEditar">
                                                    <!-- <option value="" disabled>Seleccione los medicamentosE</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectExamenesEditar" style="display: none;">
                                                <select class="form-select" id="selectExamenesEditar">
                                                    <!-- <option value="" selected disabled>Seleccione los exámenes</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectVacunasEditar" style="display: none;">
                                                <select class="form-select" id="selectVacunasEditar">
                                                    <!-- <option value="" selected disabled>Seleccione las vacunasE</option> -->
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelecInsumosEditar" style="display: none;">
                                                <select class="form-select" id="selectInsumosEditar">
                                                    <!-- <option value="" selected disabled>Seleccione los insumosE</option> -->
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="wizard-step" data-step="2">

                            <div id="divCantidadMedicamentosEditar" style="display: none;">
                            </div>

                            <div id="divCantidadVacunasEditar" style="display: none;">
                            </div>

                            <div id="divCantidadInsumosEditar" style="display: none;">
                            </div>

                        </div>
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button class="btn btn-secondary" id="prevStepEditar" type="button" disabled>Anterior</button>
                <button class="btn btn-primary" id="nextStepEditar" type="button">Siguiente</button>
                <button class="btn btn-secondary d-none" id="finishStepEditar" type="submit"
                    form="formEditarPaquete">Actualizar</button>
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

<script>
    let currentStepEditar = 1;

    const updateWizardEditar = () => {
        // Actualizar los pasos visuales
        document.querySelectorAll('.step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepEditar);
        });

        // Mostrar el contenido correspondiente
        document.querySelectorAll('.wizard-step').forEach(step => {
            step.classList.toggle('active', step.dataset.step == currentStepEditar);
        });

        // Controlar los botones
        document.getElementById('prevStepEditar').disabled = currentStepEditar === 1;
        document.getElementById('nextStepEditar').classList.toggle('d-none', currentStepEditar === 2);
        document.getElementById('finishStepEditar').classList.toggle('d-none', currentStepEditar !== 2);
    };

    document.getElementById('nextStepEditar').addEventListener('click', () => {
        const currentForm = document.querySelector(`.wizard-step[data-step="${currentStepEditar}"]`);
        if (currentForm.querySelector(':invalid')) {
            currentForm.querySelector(':invalid').focus();
            currentForm.classList.add('was-validated');
        } else {
            currentStepEditar++;
            updateWizardEditar();
        }
    });

    document.getElementById('prevStepEditar').addEventListener('click', () => {
        currentStepEditar--;
        updateWizardEditar();
    });

    updateWizardEditar();

    const medicamentosE = [{
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

    const procedimientosE = [{
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

    const diagnosticosE = [{
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

    const examenesE = [
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

    const vacunasE = [
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

    const insumosE = [{
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
        const selectCupsCieEditar = document.getElementById('CupsCieEditar');
        const divCieEditar = document.getElementById('divCieEditar');
        const divCupsEditar = document.getElementById('divCupsEditar');
        const selectCieEditar = document.getElementById('selectCieEditar');
        const selectCupsEditar = document.getElementById('selectCupsEditar');
        const nextStepEditar = document.getElementById('nextStepEditar');

        selectCupsCieEditar.addEventListener('change', function() {
            divCieEditar.style.display = 'none';
            divCupsEditar.style.display = 'none';

            if (this.value === 'cie11Editar') {
                divCieEditar.style.display = 'block';
                selectCieEditar.required = true;
                selectCupsEditar.required = false;
                selectCupsEditar.value = "";
            } else if (this.value === 'cupsEditar') {
                divCupsEditar.style.display = 'block';
                selectCupsEditar.required = true;
                selectCieEditar.required = false;
                selectCieEditar.value = "";
            }
        });


        // Función para manejar el evento click del botón guardar
        document.getElementById('nextStepEditar').addEventListener('click', function() {
            // Capturo los valores de los campos individuales
            const nombrePaqueteEditar = document.getElementById('nombrePaqueteEditar').value.trim();
            const cupsCieEditar = document.getElementById('CupsCieEditar').value;
            const selectCieEditar = document.getElementById('selectCieEditar').value;
            const selectCupsEditar = document.getElementById('selectCupsEditar').value;

            // Capturo los valores de los selects múltiples
            const medicamentosSeleccionadosE = obtenerSeleccionadosE('selectMedicamentosEditar');
            const examenesSeleccionadosE = obtenerSeleccionadosE('selectExamenesEditar');
            const vacunasSeleccionadasE = obtenerSeleccionadosE('selectVacunasEditar');
            const insumosSeleccionadosE = obtenerSeleccionadosE('selectInsumosEditar');

            const datosPaqueteE = {
                nombrePaqueteEditar,
                cupsCieEditar,
                selectCieEditar,
                selectCupsEditar,
                medicamentosE: medicamentosSeleccionadosE,
                examenesE: examenesSeleccionadosE,
                vacunasE: vacunasSeleccionadasE,
                insumosE: insumosSeleccionadosE
            };

            // Mostrar todos los elementos seleccionadosE
            mostrarElementosSeleccionadosE(
                nombrePaqueteEditar,
                cupsCieEditar,
                selectCieEditar,
                selectCupsEditar,
                medicamentosSeleccionadosE,
                examenesSeleccionadosE,
                vacunasSeleccionadasE,
                insumosSeleccionadosE,
                datosPaqueteE
            );

            sessionStorage.setItem('datosPaqueteE', JSON.stringify(datosPaqueteE));
        });



        /**
         * Función para obtener los valores seleccionadosE de un select múltiple
         * @param {string} selectIdE - El ID del elemento select
         * @return {Array} - Array con los valores seleccionadosE
         */
        function obtenerSeleccionadosE(selectIdE) {
            const select = document.getElementById(selectIdE);

            // Si el select no existe, devolver array vacío
            if (!select) return [];

            // Obtener todas las opciones seleccionadas
            const seleccionadosE = [];
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].selected && select.options[i].value !== "") {
                    seleccionadosE.push(select.options[i].value);
                }
            }

            return seleccionadosE;
        }

        /**
         * Función para mostrar todos los elementos seleccionadosE
         */
        function mostrarElementosSeleccionadosE(
            nombrePaqueteEditar,
            cupsCieEditar,
            selectCieEditar,
            selectCupsEditar,
            medicamentosE,
            examenesE,
            vacunasE,
            insumosE,
            datosPaqueteE
        ) {

            console.log("Datos del paquete:", datosPaqueteE);
            validarDatosPaqueteE(datosPaqueteE);
            mostrarMedicamentosE(medicamentosE);
        }


        cargarCupsEditar();
        cargarCieEditar();
        cargarMedicamentosEditar(medicamentosE);
        cargarExamenesEditar(examenesE);
        cargarVacunasEditar(vacunasE);
        cargarInsumosEditar(insumosE);
        controlarVisibilidadSelectoresEditar();
        configurarSelectMedicamentosMultipleEditar();
        configurarSelectExamenesMultipleEditar();
        configurarSelectVacunasMultipleEditar();
        configurarSelectInsumosMultipleEditar();


        document.getElementById('checkMedicamentosEditar').addEventListener('change', controlarVisibilidadSelectoresEditar);
        document.getElementById('checkExamenesEditar').addEventListener('change', controlarVisibilidadSelectoresEditar);
        document.getElementById('checkVacunasEditar').addEventListener('change', controlarVisibilidadSelectoresEditar);
        document.getElementById('checkInsumosEditar').addEventListener('change', controlarVisibilidadSelectoresEditar);
    });


    function cargarCupsEditar() {
        procedimientosE.forEach(procedimientoE => {
            const optionCupsE = document.createElement('option');
            const selectCupsEditar = document.getElementById('selectCupsEditar');
            optionCupsE.value = procedimientoE.codigo;
            optionCupsE.textContent = procedimientoE.codigo + " - " + procedimientoE.nombre;
            selectCupsEditar.appendChild(optionCupsE);
        })
    }

    function cargarCieEditar() {
        diagnosticosE.forEach(diagnosticoE => {
            const optionCieE = document.createElement('option');
            const selectCieEditar = document.getElementById('selectCieEditar');
            optionCieE.value = diagnosticoE.codigo;
            optionCieE.textContent = diagnosticoE.codigo + " - " + diagnosticoE.nombre;
            selectCieEditar.appendChild(optionCieE);
        })
    }

    const checkMedicamentosEditar = document.getElementById('checkMedicamentosEditar');
    const checkExamenesEditar = document.getElementById('checkExamenesEditar');
    const checkVacunasEditar = document.getElementById('checkVacunasEditar');
    const checkInsumosEditar = document.getElementById('checkInsumosEditar');

    function controlarVisibilidadSelectoresEditar() {
        // Obtenemos el elemento contenedor principal
        const divSelectsEditar = document.getElementById('divSelectsEditar');

        // Obtenemos los estados de los switches
        const estadoMedicamentosE = document.getElementById('checkMedicamentosEditar').checked;
        const estadoExamenesE = document.getElementById('checkExamenesEditar').checked;
        const estadoVacunasE = document.getElementById('checkVacunasEditar').checked;
        const estadoInsumosE = document.getElementById('checkInsumosEditar').checked;

        // Obtenemos los divs que contienen los selectores
        const divMedicamentosE = document.getElementById('divSelectMedicamentosEditar');
        const divExamenesE = document.getElementById('divSelectExamenesEditar');
        const divVacunasE = document.getElementById('divSelectVacunasEditar');
        const divInsumosE = document.getElementById('divSelecInsumosEditar');

        // Verificamos si al menos un switch está activado para mostrar u ocultar el card principal
        const alMenosUnoActivadoE = estadoMedicamentosE || estadoExamenesE || estadoVacunasE || estadoInsumosE;
        divSelectsEditar.style.display = alMenosUnoActivadoE ? 'block' : 'none';

        // Controlamos la visibilidad de cada div según el estado de su switch correspondiente
        divMedicamentosE.style.display = estadoMedicamentosE ? 'block' : 'none';
        divExamenesE.style.display = estadoExamenesE ? 'block' : 'none';
        divVacunasE.style.display = estadoVacunasE ? 'block' : 'none';
        divInsumosE.style.display = estadoInsumosE ? 'block' : 'none';

    }

    /**
     * Función para cargar los medicamentosE en el select
     */
    function cargarMedicamentosEditar() {
        // Obtenemos la referencia al select
        const selectMedicamentosEditar = document.getElementById('selectMedicamentosEditar');

        // Limpiamos todas las opciones existentes
        selectMedicamentosEditar.innerHTML = '';

        // Creamos la opción placeholder
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = "Seleccione los medicamentosE";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;

        // Añadimos el placeholder como primera opción
        selectMedicamentosEditar.appendChild(placeholderOption);

        // Recorremos el array de medicamentosE y creamos las opciones
        medicamentosE.forEach(medicamentoE => {
            const optionMeds = document.createElement('option');

            // Usamos el nombre como value
            optionMeds.value = medicamentoE.nombre;

            // Mostramos información adicional en el texto visible
            optionMeds.textContent = `${medicamentoE.nombre} - ${medicamentoE.concentracion} (${medicamentoE.presentacion})`;

            // Añadimos la opción al select
            selectMedicamentosEditar.appendChild(optionMeds);
        });
    }

    /**
     * Función para cargar los examenesE en el select
     */
    function cargarExamenesEditar() {
        const selectExamenesEditar = document.getElementById('selectExamenesEditar');

        selectExamenesEditar.innerHTML = '';

        const placeholderOptionExs = document.createElement('option');
        placeholderOptionExs.value = "";
        placeholderOptionExs.textContent = "Seleccione los Exámenes";
        placeholderOptionExs.disabled = true;
        placeholderOptionExs.selected = true;

        selectExamenesEditar.appendChild(placeholderOptionExs);

        examenesE.forEach(examen => {
            const optionExs = document.createElement('option');

            optionExs.value = examen;

            optionExs.textContent = examen;

            selectExamenesEditar.appendChild(optionExs);
        });
    }

    /**
     * Función para cargar las vacunasE en el select
     */
    function cargarVacunasEditar() {
        const selectVacunasEditar = document.getElementById('selectVacunasEditar');

        selectVacunasEditar.innerHTML = '';

        const placeholderOptionVac = document.createElement('option');
        placeholderOptionVac.value = "";
        placeholderOptionVac.textContent = "Seleccione las Vacunas";
        placeholderOptionVac.disabled = true;
        placeholderOptionVac.selected = true;

        selectVacunasEditar.appendChild(placeholderOptionVac);

        vacunasE.forEach(vacunaE => {
            const optionVac = document.createElement('option');

            optionVac.value = vacunaE;

            optionVac.textContent = vacunaE;

            selectVacunasEditar.appendChild(optionVac);
        });
    }

    /**
     * Función para cargar los insumosE en el select
     */
    function cargarInsumosEditar() {
        const selectInsumosEditar = document.getElementById('selectInsumosEditar');

        selectInsumosEditar.innerHTML = '';

        const placeholderOptionIns = document.createElement('option');
        placeholderOptionIns.value = "";
        placeholderOptionIns.textContent = "Seleccione los Insumos";
        placeholderOptionIns.disabled = true;
        placeholderOptionIns.selected = true;

        selectInsumosEditar.appendChild(placeholderOptionIns);

        insumosE.forEach(insumo => {
            const optionIns = document.createElement('option');

            optionIns.value = insumo.insumo;

            optionIns.textContent = insumo.insumo;

            selectInsumosEditar.appendChild(optionIns);
        });
    }

    function configurarSelectMedicamentosMultipleEditar() {
        // Obtenemos la referencia al select
        const selectMedicamentosEditar = document.getElementById('selectMedicamentosEditar');

        // Añadimos el atributo multiple
        selectMedicamentosEditar.setAttribute('multiple', 'multiple');

        // Si estás usando alguna biblioteca como Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectMedicamentosEditar, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectExamenesMultipleEditar() {
        const selectExamenesEditar = document.getElementById('selectExamenesEditar');

        selectExamenesEditar.setAttribute('multiple', 'multiple');

        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectExamenesEditar, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectVacunasMultipleEditar() {
        const selectVacunasEditar = document.getElementById('selectVacunasEditar');

        selectVacunasEditar.setAttribute('multiple', 'multiple');

        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectVacunasEditar, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectInsumosMultipleEditar() {
        const selectInsumosEditar = document.getElementById('selectInsumosEditar');

        selectInsumosEditar.setAttribute('multiple', 'multiple');

        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectInsumosEditar, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    const divCantidadMedicamentosEditar = document.getElementById('divCantidadMedicamentosEditar');
    const divCantidadVacunasEditar = document.getElementById('divCantidadVacunasEditar');
    const divCantidadInsumosEditar = document.getElementById('divCantidadInsumosEditar');

    function validarDatosPaqueteE(datosPaqueteE) {
        // Verificar que datosPaqueteE no sea null o undefined
        if (!datosPaqueteE) {
            // Si no existe el objeto datosPaqueteE, ocultar todos los divs
            divCantidadMedicamentosEditar.style.display = "none";
            divCantidadVacunasEditar.style.display = "none";
            divCantidadInsumosEditar.style.display = "none";
            return;
        }

        // Medicamentos
        if (datosPaqueteE.medicamentosE && datosPaqueteE.medicamentosE.length > 0) {
            divCantidadMedicamentosEditar.style.display = "block";
            mostrarMedicamentosE(datosPaqueteE.medicamentosE);
        } else {
            divCantidadMedicamentosEditar.style.display = "none";
        }

        // Vacunas
        if (datosPaqueteE.vacunasE && datosPaqueteE.vacunasE.length > 0) {
            divCantidadVacunasEditar.style.display = "block";
            mostrarVacunasE(datosPaqueteE.vacunasE);
        } else {
            divCantidadVacunasEditar.style.display = "none";
        }

        // Insumos
        if (datosPaqueteE.insumosE && datosPaqueteE.insumosE.length > 0) {
            divCantidadInsumosEditar.style.display = "block";
            mostrarInsumosE(datosPaqueteE.insumosE);
        } else {
            divCantidadInsumosEditar.style.display = "none";
        }
    }


    // Función auxiliar para mostrar los medicamentosE
    function mostrarMedicamentosE(medicamentosE) {
        // Limpiar el contenido previo del div
        divCantidadMedicamentosEditar.innerHTML = "";

        // Agregar estilos para centrar el contenido
        divCantidadMedicamentosEditar.style.textAlign = "center";

        // Crear título para la tabla
        const tituloMedicamentosE = document.createElement("h4");
        tituloMedicamentosE.textContent = "Ingrese la cantidad para cada medicamentoE";
        divCantidadMedicamentosEditar.appendChild(tituloMedicamentosE);

        // Crear tabla
        const tablaMedicamentosE = document.createElement("table");
        tablaMedicamentosE.style.width = "80%";
        tablaMedicamentosE.style.margin = "0 auto";
        tablaMedicamentosE.style.borderCollapse = "collapse";
        tablaMedicamentosE.style.marginTop = "15px";

        // Crear encabezado de la tablaMedicamentosE
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");

        // Encabezado para nombre del medicamentoE
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
        tablaMedicamentosE.appendChild(thead);

        // Crear cuerpo de la tablaMedicamentosE
        const tbody = document.createElement("tbody");

        // Agregar cada medicamentoE como una fila
        for (const medicamentoE of medicamentosE) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdMedE = 'cantidad_medicamento_' + medicamentoE.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            // Celda para el nombre del medicamentoE
            const tdNombre = document.createElement("td");
            tdNombre.textContent = medicamentoE || "Medicamento sin nombre";
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
            inputCantidad.dataset.medicamentoE = medicamentoE;
            inputCantidad.id = inputIdMedE;
            inputCantidad.className = "input-cantidad-medicamentoE";
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

            // Agregar fila al cuerpo de la tablaMedicamentosE
            tbody.appendChild(row);
        }

        // Agregar cuerpo a la tablaMedicamentosE
        tablaMedicamentosE.appendChild(tbody);

        // Agregar la tablaMedicamentosE al div
        divCantidadMedicamentosEditar.appendChild(tablaMedicamentosE);
    }


    function mostrarVacunasE(vacunasE) {
        divCantidadVacunasEditar.innerHTML = "";

        divCantidadVacunasEditar.style.textAlign = "center";

        const tituloVacunasE = document.createElement("h4");
        tituloVacunasE.textContent = "Ingrese la cantidad para cada vacunaE";
        tituloVacunasE.className = "mt-3";
        divCantidadVacunasEditar.appendChild(tituloVacunasE);

        const tablaVacunasE = document.createElement("table");
        tablaVacunasE.style.width = "80%";
        tablaVacunasE.style.margin = "0 auto";
        tablaVacunasE.style.borderCollapse = "collapse";
        tablaVacunasE.style.marginTop = "15px";

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
        tablaVacunasE.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (const vacunaE of vacunasE) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdVacE = 'cantidad_vacuna_' + vacunaE.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = vacunaE || "Vacuna sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%"

            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%"

            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.dataset.vacunaE = vacunaE;
            inputCantidad.id = inputIdVacE;
            inputCantidad.className = "input-cantidad-vacunaE";
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

        tablaVacunasE.appendChild(tbody);

        divCantidadVacunasEditar.appendChild(tablaVacunasE);
    }

    function mostrarInsumosE(insumosE) {
        divCantidadInsumosEditar.innerHTML = "";

        divCantidadInsumosEditar.style.textAlign = "center";

        const tituloInsumosE = document.createElement("h4");
        tituloInsumosE.textContent = "Ingrese la cantidad para cada insumo";
        tituloInsumosE.className = "mt-3";
        divCantidadInsumosEditar.appendChild(tituloInsumosE);

        const tablaInsumosE = document.createElement("table");
        tablaInsumosE.style.width = "80%";
        tablaInsumosE.style.margin = "0 auto";
        tablaInsumosE.style.borderCollapse = "collapse";
        tablaInsumosE.style.marginTop = "15px";

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
        tablaInsumosE.appendChild(thead);

        const tbody = document.createElement("tbody");

        for (const insumoE of insumosE) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #ddd";

            const inputIdInsE = 'cantidad_insumo_' + insumoE.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

            const tdNombre = document.createElement("td");
            tdNombre.textContent = insumoE || "Insumo sin nombre";
            tdNombre.style.padding = "10px";
            tdNombre.style.textAlign = "left";
            tdNombre.style.width = "75%";

            const tdCantidad = document.createElement("td");
            tdCantidad.style.padding = "10px";
            tdCantidad.style.width = "25%";

            const inputCantidad = document.createElement("input");
            inputCantidad.type = "number";
            inputCantidad.min = "1";
            inputCantidad.dataset.insumoE = insumoE;
            inputCantidad.id = inputIdInsE;
            inputCantidad.className = "input-cantidad-insumoE";
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

        tablaInsumosE.appendChild(tbody);

        divCantidadInsumosEditar.appendChild(tablaInsumosE);
    }

    document.getElementById('finishStepEditar').addEventListener('click', function() {
        // Recuperar datosPaqueteE del sessionStorage
        const datosPaqueteE = JSON.parse(sessionStorage.getItem('datosPaqueteE')) || {};
        event.preventDefault();

        // Obtener todos los inputs de cantidad de medicamentosE
        const inputsCantidadMedsE = document.querySelectorAll('.input-cantidad-medicamentoE');
        const inputsCantidadVacsE = document.querySelectorAll('.input-cantidad-vacunaE');
        const inputsCantidadInsE = document.querySelectorAll('.input-cantidad-insumoE');

        // Crear objetos para las cantidades
        const medicamentosConCantidadE = {};
        const vacunasConCantidadE = {};
        const insumosConCantidadE = {};

        inputsCantidadMedsE.forEach(input => {
            const nombreMedicamentoE = input.dataset.medicamentoE;
            const cantidadMedicamentosE = parseInt(input.value) || 0;
            medicamentosConCantidadE[nombreMedicamentoE] = cantidadMedicamentosE;
        });

        inputsCantidadVacsE.forEach(input => {
            const nombreVacunaE = input.dataset.vacunaE;
            const cantidadVacunasE = parseInt(input.value) || 0;
            vacunasConCantidadE[nombreVacunaE] = cantidadVacunasE;
        });

        inputsCantidadInsE.forEach(input => {
            const nombreInsumoE = input.dataset.insumoE;
            const cantidadInsumosE = parseInt(input.value) || 0;
            insumosConCantidadE[nombreInsumoE] = cantidadInsumosE;
        });

        let relacionPaqueteE = '';
        if (datosPaqueteE.cupsCieEditar === 'cie11Editar') {
            relacionPaqueteE = `<strong>Relacionado a:</strong> CIE-11<br>
                         <strong>CIE-11:</strong> ${datosPaqueteE.selectCieEditar || 'No especificado'}`;
        } else if (datosPaqueteE.cupsCieEditar === 'cupsEditar') {
            relacionPaqueteE = `<strong>Relacionado a:</strong> CUPS<br>
                         <strong>CUPS:</strong> ${datosPaqueteE.selectCupsEditar || 'No especificado'}`;
        } else {
            relacionPaqueteE = 'Relación no especificada';
        }

        // Crear el contenido HTML para el resumen
        let contenidoResumenE = `
        <div style="text-align: left; padding: 10px;">
            <h3 style="margin-bottom: 15px;">Resumen del Paquete</h3>
            
            <div style="margin-bottom: 15px;">
                <strong>Nombre:</strong> ${datosPaqueteE.nombrePaqueteEditar || 'No especificado'}<br>
                ${relacionPaqueteE}
            </div>
    `;

        // Agregar medicamentosE si existen
        if (datosPaqueteE.medicamentosE && datosPaqueteE.medicamentosE.length > 0) {
            contenidoResumenE += `
            <div style="margin-bottom: 15px;">
                <strong>Medicamentos:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaqueteE.medicamentosE.forEach(med => {
                const cantidad = medicamentosConCantidadE[med] || 0;
                contenidoResumenE += `<li>${med} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumenE += `
                </ul>
            </div>
        `;
        }

        // Agregar exámenes si existen
        if (datosPaqueteE.examenesE && datosPaqueteE.examenesE.length > 0) {
            contenidoResumenE += `
            <div style="margin-bottom: 15px;">
                <strong>Exámenes:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaqueteE.examenesE.forEach(exam => {
                contenidoResumenE += `<li>${exam}</li>`;
            });

            contenidoResumenE += `
                </ul>
            </div>
        `;
        }

        // Agregar vacunasE si existen
        if (datosPaqueteE.vacunasE && datosPaqueteE.vacunasE.length > 0) {
            contenidoResumenE += `
            <div style="margin-bottom: 15px;">
                <strong>Vacunas:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaqueteE.vacunasE.forEach(vac => {
                const cantidad = vacunasConCantidadE[vac] || 0;
                contenidoResumenE += `<li>${vac} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumenE += `
                </ul>
            </div>
        `;
        }

        // Agregar insumosE si existen
        if (datosPaqueteE.insumosE && datosPaqueteE.insumosE.length > 0) {
            contenidoResumenE += `
            <div style="margin-bottom: 15px;">
                <strong>Insumos:</strong>
                <ul style="margin-top: 5px; padding-left: 20px;">
        `;

            datosPaqueteE.insumosE.forEach(ins => {
                const cantidad = insumosConCantidadE[ins] || 0;
                contenidoResumenE += `<li>${ins} - Cantidad: ${cantidad}</li>`;
            });

            contenidoResumenE += `
                </ul>
            </div>
        `;
        }

        contenidoResumenE += `</div>`;

        Swal.fire({
            title: 'Paquete Actualizado',
            html: contenidoResumenE,
            icon: 'success',
            width: '600px',
            confirmButtonText: 'Actualizar',
            confirmButtonColor: '#4CAF50'
        }).then((result) => {
            if (result.isConfirmed) {

                console.log('Proceso finalizado');
                window.location.reload();
            }
        });

        // Mostrar ambos objetos
        console.log('Datos del paquete:', datosPaqueteE);
        console.log('Medicamentos con cantidades:', medicamentosConCantidadE);
        console.log('Vacunas con cantidades:', vacunasConCantidadE);
        console.log('Insumos con cantidades:', insumosConCantidadE);
    });
</script>