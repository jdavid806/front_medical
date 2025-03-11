<div class="modal fade modal-xl" id="modalAgregarPaquete" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Paquete</h5>
                <button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body">
                <div class="card mb-3" id="cardInfoPaquete">
                    <div class="card-body">
                        <!-- <h5 class="card-title">Ingrese la información del paquete</h5> -->
                        <form id="formNuevoPaquete" class="needs-validation" novalidate>
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
                                            <select class="form-select" name="selectCie" id="selectCie" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- <option value="cie">CIE</option> -->
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
                                            <select class="form-select" name="selectCups" id="selectCups" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <!-- <option value="cup">CUPS</option> -->
                                                <!-- Los options se generan desde el script -->
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">CUPS</label>
                                            <div class="invalid-feedback">Por favor seleccione un procedimiento.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-6 mt-3">
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" id="isCodeChecked" type="checkbox" />
                                        <label class="form-check-label" for="isCodeChecked">Consultar por codigo</label>
                                    </div>
                                </div>

                                <!-- <div class="col-6 mt-3" id="divSeleccionarIncluir" style="display: none;">
                                    <div class="input-group">
                                        <div class="form-floating">
                                            <select class="form-select" name="selectIncluir" id="selectIncluir" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <option value="medicamentos">Medicamentos</option>
                                                <option value="examenes">Exámenes</option>
                                                <option value="vacunas">Vacunas</option>
                                                <option value="insumos">Insumos</option>
                                            </select>
                                            <label for="seleccionarIncluidos" class="form-label">Incluir al paquete</label>
                                            <div class="invalid-feedback">Por favor seleccione lo que desea incluir al paquete.</div>
                                        </div>
                                    </div>
                                </div> -->

                            </div>
                        </form>
                    </div>
                </div>

                <div class="card mb-3" id="cardSwitches" style="display: block;">
                    <div class="card-body">
                        <h5 class="card-title">Agregar al paquete</h5>
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" id="checkMedicamentos" type="checkbox" />
                                            <label class="form-check-label" for="checkMedicamentos">Medicamentos</label>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" id="checkExamenes" type="checkbox" />
                                            <label class="form-check-label" for="checkExamenes">Exámenes</label>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" id="checkVacunas" type="checkbox" />
                                            <label class="form-check-label" for="checkVacunas">Vacunas</label>
                                        </div>
                                    </div>
                                    <div class="col-3">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" id="checkInsumos" type="checkbox" />
                                            <label class="form-check-label" for="checkInsumos">Insumos</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-3" id="cardSelects" style="display: none;">
                    <div class="card-body">
                        <h5 class="card-title">Desea agregar</h5>
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <div class="divSelectMedicamentos" style="display: none;">
                                    <select class="form-select" id="selectMedicamentos">
                                        <!-- <option value="" disabled>Seleccione los medicamentos</option> -->
                                    </select>
                                    <!-- <div class="mt-3 text-end">
                                        <button class="btn btn-primary" type="button" id="agregarMedicamentoBtn">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div> -->
                                </div>
                                <div class="divSelectExamenes mt-3" style="display: none;">
                                    <select class="form-select" id="selectExamenes">
                                        <!-- <option value="" selected disabled>Seleccione los exámenes</option> -->
                                    </select>
                                    <!-- <div class="mt-3 text-end">
                                        <button class="btn btn-primary" type="button" id="agregarExamenBtn">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div> -->
                                </div>
                                <div class="divSelectVacunas mt-3" style="display: none;">
                                    <select class="form-select" id="selectVacunas">
                                        <!-- <option value="" selected disabled>Seleccione las vacunas</option> -->
                                    </select>
                                    <!-- <div class="mt-3 text-end">
                                        <button class="btn btn-primary" type="button" id="agregarVacunaBtn">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div> -->
                                </div>
                                <div class="divSelecInsumos mt-3" style="display: none;">
                                    <select class="form-select" id="selectInsumos">
                                        <!-- <option value="" selected disabled>Seleccione los insumos</option> -->
                                    </select>
                                    <!-- <div class="mt-3 text-end">
                                        <button class="btn btn-primary" type="button" id="agregarInsumoBtn">
                                            <i class="fa-solid fa-plus"></i>
                                        </button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-3" id="cardAgregados" style="display: none;">
                    <div class="card-body">
                        <h5 class="card-title">Elementos agregados</h5>
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <!-- Elementos agregados desde el script -->
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- <div class="card mb-3" id="cardMedicamentos" style="display: none;">
                <div class="card-body">
                    <h5 class="card-title">Medicamentos</h5>
                    <form id="formMedicamentos">
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <select class="form-select" id="selectMedicamentos">
                                    <option value="" selected disabled>Seleccione los medicamentos</option>
                                </select>
                                <div class="mt-3 text-end">
                                    <button class="btn btn-primary" type="button" id="agregarMedicamentoBtn">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> -->

            <!-- <div class="card mb-3" id="cardExamenes" style="display: none;">
                <div class="card-body">
                    <h5 class="card-title">Exámenes</h5>
                    <form id="formExamenes">
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <select class="form-select" id="selectExamenes">
                                    <option value="" selected disabled>Seleccione los exámenes</option>
                                </select>
                                <div class="mt-3 text-end">
                                    <button class="btn btn-primary" type="button" id="agregarExamenBtn">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> -->

            <!-- <div class="card mb-3" id="cardVacunas" style="display: none;">
                <div class="card-body">
                    <h5 class="card-title">Vacunas</h5>
                    <form id="formVacunas">
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <select class="form-select" id="selectVacunas">
                                    <option value="" selected disabled>Seleccione las vacunas</option>
                                </select>
                                <div class="mt-3 text-end">
                                    <button class="btn btn-primary" type="button" id="agregarVacunaBtn">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> -->

            <!-- <div class="card mb-3" id="cardInsumos" style="display: none;">
                <div class="card-body">
                    <h5 class="card-title">Insumos</h5>
                    <form id="formInsumos">
                        <div class="input-group mt-3">
                            <div class="form-floating">
                                <select class="form-select" id="selectInsumos">
                                    <option value="" selected disabled>Seleccione los insumos</option>
                                </select>
                                <div class="mt-3 text-end">
                                    <button class="btn btn-primary" type="button" id="agregarInsumoBtn">
                                        <i class="fa-solid fa-plus"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div> -->

            <div class="modal-footer">
                <button class="btn btn-primary" id="guardarPaqueteBtn" type="button">Guardar</button>
            </div>
        </div>
    </div>
</div>

<script>
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

    // console.log(insumos);
    // console.log(vacunas);
    // console.log(examenes);
    // console.log(procedimientos);
    // console.log(diagnosticosCIE11);
    // console.log(medicamentos);

    document.addEventListener('DOMContentLoaded', function() {
        const selectCupsCie = document.getElementById('CupsCie');
        const divCie = document.getElementById('divCie');
        const divCups = document.getElementById('divCups');

        selectCupsCie.addEventListener('change', function() {
            divCie.style.display = 'none';
            divCups.style.display = 'none';

            if (this.value === 'cie11') {
                divCie.style.display = 'block';
            } else if (this.value === 'cups') {
                divCups.style.display = 'block';
            }
        });
        // const divSelectIncluir = document.getElementById('divSeleccionarIncluir');
        const selectCie = document.getElementById('selectCie');
        const selectCups = document.getElementById('selectCups');
        cargarCups();
        cargarCie();

        // selectCie.addEventListener('change', function() {
        //     divSelectIncluir.style.display = 'none';
        //     if (this.value != "") {
        //         divSelectIncluir.style.display = 'block';
        //     }
        // });
        // selectCups.addEventListener('change', function() {
        //     divSelectIncluir.style.display = 'none';
        //     if (this.value != "") {
        //         divSelectIncluir.style.display = 'block';
        //     }
        // });
        cargarMedicamentos(medicamentos);
        cargarExamenes(examenes);
        cargarVacunas(vacunas);
        cargarInsumos(insumos);
        controlarVisibilidadSelectores();
        configurarSelectMedicamentosMultiple();
        configurarSelectExamenesMultiple();
        configurarSelectVacunasMultiple();
        configurarSelectInsumosMultiple();


        // Agregamos event listeners a los switches para actualizar la visibilidad cuando cambien
        document.getElementById('checkMedicamentos').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkExamenes').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkVacunas').addEventListener('change', controlarVisibilidadSelectores);
        document.getElementById('checkInsumos').addEventListener('change', controlarVisibilidadSelectores);
    });

    // const cardMedicamentos = document.getElementById('cardMedicamentos');
    // const cardExamenes = document.getElementById('cardExamenes');
    // const cardVacunas = document.getElementById('cardVacunas');
    // const cardInsumos = document.getElementById('cardInsumos');
    // const selectIncluir = document.getElementById('selectIncluir');

    // selectIncluir.addEventListener('change', function() {
    //     if (selectIncluir.value === 'medicamentos') {
    //         cardMedicamentos.style.display = 'block';
    //         cardExamenes.style.display = 'none';
    //         cardVacunas.style.display = 'none';
    //         cardInsumos.style.display = 'none';
    //         cargarMedicamentos(medicamentos);
    //     } else if (selectIncluir.value === 'examenes') {
    //         cardExamenes.style.display = 'block';
    //         cardMedicamentos.style.display = 'none';
    //         cardVacunas.style.display = 'none';
    //         cardInsumos.style.display = 'none';
    //         cargarExamenes(examenes);
    //     } else if (selectIncluir.value === 'vacunas') {
    //         cardVacunas.style.display = 'block';
    //         cardMedicamentos.style.display = 'none';
    //         cardExamenes.style.display = 'none';
    //         cardInsumos.style.display = 'none';
    //         cargarVacunas(vacunas);
    //     } else if (selectIncluir.value === 'insumos') {
    //         cardInsumos.style.display = 'block';
    //         cardMedicamentos.style.display = 'none';
    //         cardExamenes.style.display = 'none';
    //         cardVacunas.style.display = 'none';
    //         cargarInsumos(insumos);
    //     }
    // });

    const checkMedicamentos = document.getElementById('checkMedicamentos');
    const checkExamenes = document.getElementById('checkExamenes');
    const checkVacunas = document.getElementById('checkVacunas');
    const checkInsumos = document.getElementById('checkInsumos');

    // checkMedicamentos.addEventListener('change', function() {
    //     cardMedicamentos.style.display = 'block';
    //     cargarMedicamentos(medicamentos);
    // });

    function controlarVisibilidadSelectores() {
        // Obtenemos el elemento contenedor principal
        const cardSelects = document.getElementById('cardSelects');

        // Obtenemos los estados de los switches (checkboxes)
        const estadoMedicamentos = document.getElementById('checkMedicamentos').checked;
        const estadoExamenes = document.getElementById('checkExamenes').checked;
        const estadoVacunas = document.getElementById('checkVacunas').checked;
        const estadoInsumos = document.getElementById('checkInsumos').checked;

        // Obtenemos los divs que contienen los selectores
        const divMedicamentos = document.querySelector('.divSelectMedicamentos');
        const divExamenes = document.querySelector('.divSelectExamenes');
        const divVacunas = document.querySelector('.divSelectVacunas');
        const divInsumos = document.querySelector('.divSelecInsumos');

        // Verificamos si al menos un switch está activado para mostrar u ocultar el card principal
        const alMenosUnoActivado = estadoMedicamentos || estadoExamenes || estadoVacunas || estadoInsumos;
        cardSelects.style.display = alMenosUnoActivado ? 'block' : 'none';

        // Controlamos la visibilidad de cada div según el estado de su switch correspondiente
        divMedicamentos.style.display = estadoMedicamentos ? 'block' : 'none';
        divExamenes.style.display = estadoExamenes ? 'block' : 'none';
        divVacunas.style.display = estadoVacunas ? 'block' : 'none';
        divInsumos.style.display = estadoInsumos ? 'block' : 'none';

    }

    const selectMedicamentos = document.getElementById('selectMedicamentos');
    const selectExamenes = document.getElementById('selectExamenes');
    const selectVacunas = document.getElementById('selectVacunas');
    const selectInsumos = document.getElementById('selectInsumos');
    // const selectCups = document.getElementById('selectCups');
    // const selectCie = document.getElementById('selectCie');

    function cargarCups() {
        procedimientos.forEach(procedimiento => {
            const optionCups = document.createElement('option');
            optionCups.value = procedimiento.codigo;
            optionCups.textContent = procedimiento.codigo + " - " + procedimiento.nombre;
            selectCups.appendChild(optionCups);
        })
    }

    function cargarCie() {
        diagnosticos.forEach(diagnostico => {
            const optionCie = document.createElement('option');
            optionCie.value = diagnostico.codigo;
            optionCie.textContent = diagnostico.codigo + " - " + diagnostico.nombre;
            selectCie.appendChild(optionCie);
        })
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
        // Obtenemos la referencia al select
        const selectExamenes = document.getElementById('selectExamenes');

        // Limpiamos todas las opciones existentes
        selectExamenes.innerHTML = '';

        // Creamos la opción placeholder
        const placeholderOptionExs = document.createElement('option');
        placeholderOptionExs.value = "";
        placeholderOptionExs.textContent = "Seleccione los Exámenes";
        placeholderOptionExs.disabled = true;
        placeholderOptionExs.selected = true;

        // Añadimos el placeholder como primera opción
        selectExamenes.appendChild(placeholderOptionExs);

        // Recorremos el array de medicamentos y creamos las opciones
        examenes.forEach(examen => {
            const optionExs = document.createElement('option');

            // Usamos el nombre como value
            optionExs.value = examen;

            // Mostramos información adicional en el texto visible
            optionExs.textContent = examen;

            // Añadimos la opción al select
            selectExamenes.appendChild(optionExs);
        });
    }

    /**
     * Función para cargar las vacunas en el select
     */
    function cargarVacunas() {
        // Obtenemos la referencia al select
        const selectVacunas = document.getElementById('selectVacunas');

        // Limpiamos todas las opciones existentes
        selectVacunas.innerHTML = '';

        // Creamos la opción placeholder
        const placeholderOptionVac = document.createElement('option');
        placeholderOptionVac.value = "";
        placeholderOptionVac.textContent = "Seleccione las Vacunas";
        placeholderOptionVac.disabled = true;
        placeholderOptionVac.selected = true;

        // Añadimos el placeholder como primera opción
        selectVacunas.appendChild(placeholderOptionVac);

        // Recorremos el array de medicamentos y creamos las opciones
        vacunas.forEach(vacuna => {
            const optionVac = document.createElement('option');

            // Usamos el nombre como value
            optionVac.value = vacuna;

            // Mostramos información adicional en el texto visible
            optionVac.textContent = vacuna;

            // Añadimos la opción al select
            selectVacunas.appendChild(optionVac);
        });
    }

    /**
     * Función para cargar los insumos en el select
     */
    function cargarInsumos() {
        // Obtenemos la referencia al select
        const selectInsumos = document.getElementById('selectInsumos');

        // Limpiamos todas las opciones existentes
        selectInsumos.innerHTML = '';

        // Creamos la opción placeholder
        const placeholderOptionIns = document.createElement('option');
        placeholderOptionIns.value = "";
        placeholderOptionIns.textContent = "Seleccione los Insumos";
        placeholderOptionIns.disabled = true;
        placeholderOptionIns.selected = true;

        // Añadimos el placeholder como primera opción
        selectInsumos.appendChild(placeholderOptionIns);

        // Recorremos el array de medicamentos y creamos las opciones
        insumos.forEach(insumo => {
            const optionIns = document.createElement('option');

            // Usamos el nombre como value
            optionIns.value = insumo.insumo;

            // Mostramos información adicional en el texto visible
            optionIns.textContent = insumo.insumo;

            // Añadimos la opción al select
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
        // Obtenemos la referencia al select
        const selectExamenes = document.getElementById('selectExamenes');

        // Añadimos el atributo multiple
        selectExamenes.setAttribute('multiple', 'multiple');

        // Si estás usando alguna biblioteca como Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectExamenes, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectVacunasMultiple() {
        // Obtenemos la referencia al select
        const selectVacunas = document.getElementById('selectVacunas');

        // Añadimos el atributo multiple
        selectVacunas.setAttribute('multiple', 'multiple');

        // Si estás usando alguna biblioteca como Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectVacunas, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    function configurarSelectInsumosMultiple() {
        // Obtenemos la referencia al select
        const selectInsumos = document.getElementById('selectInsumos');

        // Añadimos el atributo multiple
        selectInsumos.setAttribute('multiple', 'multiple');

        // Si estás usando alguna biblioteca como Choices.js
        if (typeof Choices !== 'undefined') {
            const choices = new Choices(selectInsumos, {
                removeItemButton: true,
                placeholder: true
            });
        }
    }

    // Función para manejar el evento click del botón guardar
    document.getElementById('guardarPaqueteBtn').addEventListener('click', function() {
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

        // Validar el nombre del paquete (como mínimo, pues es obligatorio)
        if (!nombrePaquete) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe ingresar un nombre para el paquete',
                confirmButtonColor: '#3085d6'
            });
            return;
        }

        // Datos para console.log
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
     * Función para mostrar todos los elementos seleccionados usando SweetAlert
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
        // Preparar el HTML para el contenido del Swal
        let contenidoHTML = '<div class="text-center">';

        // Datos básicos del paquete
        contenidoHTML += `<h5>Nombre del paquete: <strong>${nombrePaquete}</strong></h5>`;

        // Añadimos los valores de los selects individuales si tienen valor
        if (cupsCie || selectCie || selectCups) {
            contenidoHTML += '<div class="mb-3">';

            if (cupsCie) {
                // Verificamos si cupsCie es equivalente a "cups" o "cie"
                let tipoCupsCie = "";
                if (cupsCie.toLowerCase() === "cups") {
                    tipoCupsCie = "CUPS";
                } else if (cupsCie.toLowerCase() === "cie11") {
                    tipoCupsCie = "CIE-11";
                } else {
                    tipoCupsCie = cupsCie; // Mantenemos el valor original si no coincide
                }

                contenidoHTML += `<p>Paquete asociado a: <strong>${tipoCupsCie}</strong></p>`;
            }

            if (selectCie) {
                contenidoHTML += `<p>CIE-11: <strong>${selectCie}</strong></p>`;
            }

            if (selectCups) {
                contenidoHTML += `<p>CUPS: <strong>${selectCups}</strong></p>`;
            }

            contenidoHTML += '</div>';
        }

        // Añadimos los medicamentos
        if (medicamentos.length > 0) {
            contenidoHTML += '<div class="mb-3">';
            contenidoHTML += '<h6 class="font-weight-bold">Medicamentos:</h6>';
            contenidoHTML += '<ul class="list-unstyled">';
            medicamentos.forEach(med => {
                contenidoHTML += `<li>${med}</li>`;
            });
            contenidoHTML += '</ul>';
            contenidoHTML += '</div>';
        }

        // Añadimos los exámenes
        if (examenes.length > 0) {
            contenidoHTML += '<div class="mb-3">';
            contenidoHTML += '<h6 class="font-weight-bold">Exámenes:</h6>';
            contenidoHTML += '<ul class="list-unstyled">';
            examenes.forEach(examen => {
                contenidoHTML += `<li>${examen}</li>`;
            });
            contenidoHTML += '</ul>';
            contenidoHTML += '</div>';
        }

        // Añadimos las vacunas
        if (vacunas.length > 0) {
            contenidoHTML += '<div class="mb-3">';
            contenidoHTML += '<h6 class="font-weight-bold">Vacunas:</h6>';
            contenidoHTML += '<ul class="list-unstyled">';
            vacunas.forEach(vacuna => {
                contenidoHTML += `<li>${vacuna}</li>`;
            });
            contenidoHTML += '</ul>';
            contenidoHTML += '</div>';
        }

        // Añadimos los insumos
        if (insumos.length > 0) {
            contenidoHTML += '<div class="mb-3">';
            contenidoHTML += '<h6 class="font-weight-bold">Insumos:</h6>';
            contenidoHTML += '<ul class="list-unstyled">';
            insumos.forEach(insumo => {
                contenidoHTML += `<li>${insumo}</li>`;
            });
            contenidoHTML += '</ul>';
            contenidoHTML += '</div>';
        }

        contenidoHTML += '</div>';

        // Mostramos el resumen con SweetAlert2 con botones de aceptar y cerrar
        Swal.fire({
            icon: 'success',
            title: 'Resumen del Paquete',
            html: contenidoHTML,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cerrar',
            confirmButtonColor: '#132030',
            cancelButtonColor: '#6c757d',
            width: '600px'
        }).then((result) => {
            // Solo logeamos los datos si el usuario hace clic en Aceptar
            if (result.isConfirmed) {
                console.log("Datos del paquete:", datosPaquete);
                // Aquí podrías añadir el código para enviar estos datos a un servidor

                window.location.reload();
            }
            // Si el usuario hace clic en Cerrar, simplemente se cierra el modal
            // y permanece en la misma vista
        });
    }

    // function cargarMedicamentos() {

    //     medicamentos.forEach(medicamento => {
    //         const optionMeds = document.createElement('option');
    //         optionMeds.value = medicamento.nombre;
    //         optionMeds.textContent = medicamento.nombre;
    //         selectMedicamentos.appendChild(optionMeds);
    //     })
    // }

    // function cargarExamenes() {
    //     examenes.forEach(examen => {
    //         const optionExs = document.createElement('option');
    //         optionExs.value = examen;
    //         optionExs.textContent = examen;
    //         selectExamenes.appendChild(optionExs);
    //     })
    // }

    // function cargarVacunas() {
    //     vacunas.forEach(vacuna => {
    //         const optionVac = document.createElement('option');
    //         optionVac.value = vacuna;
    //         optionVac.textContent = vacuna;
    //         selectVacunas.appendChild(optionVac);
    //     })
    // }

    // function cargarInsumos() {
    //     insumos.forEach(insumo => {
    //         const optionIns = document.createElement('option');
    //         optionIns.value = insumo.insumo;
    //         optionIns.textContent = insumo.insumo;
    //         selectInsumos.appendChild(optionIns);
    //     })
    // }

    // const agregarMedicamentoBtn = document.getElementById('agregarMedicamentoBtn');
    // const agregarExamenBtn = document.getElementById('agregarExamenBtn');
    // const agregarVacunaBtn = document.getElementById('agregarVacunaBtn');
    // const agregarInsumoBtn = document.getElementById('agregarInsumoBtn');

    // agregarMedicamentoBtn.addEventListener('click', function() {
    //     const medicamentoAgregado = selectMedicamentos.value;
    //     console.log('Medicamento seleccionado:', medicamentoAgregado);
    // });
    // agregarExamenBtn.addEventListener('click', function() {
    //     const examenAgregado = selectExamenes.value;
    //     console.log('Exámen seleccionado:', examenAgregado);
    // });
    // agregarVacunaBtn.addEventListener('click', function() {
    //     const vacunaAgregada = selectVacunas.value;
    //     console.log('Vacunas seleccionada:', vacunaAgregada);
    // });
    // agregarInsumoBtn.addEventListener('click', function() {
    //     const insumoAgregado = selectInsumos.value;
    //     console.log('Insumo seleccionado:', insumoAgregado);
    // });
</script>