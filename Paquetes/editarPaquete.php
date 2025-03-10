<div class="modal fade modal-xl" id="modalEditarPaquetePrueba" tabindex="-1" aria-hidden="true">
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
                        <!-- <li class="step" data-step="2">
                            <span class="step-number">2</span>
                            <span class="step-label">Cantidades</span>
                        </li> -->
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
                                            <select class="form-select" name="selectCupsCieEditar" id="selectCupsCieEditar" required>
                                                <option value="" disabled selected>Seleccione</option>
                                                <option value="cie11">CIE-11</option>
                                                <option value="cups">CUPS</option>
                                            </select>
                                            <label for="selectCupsCieEditar" class="form-label">Relacionado a</label>
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
                                            <label for="selectCieEditar" class="form-label">CIE-11</label>
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

                                <div class="form-group">
                                    <!-- <label>Medicamentos</label> -->
                                    <div id="tablaMedicamentosEditar"></div>
                                </div>
                                <div class="form-group">
                                    <!-- <label>Medicamentos</label> -->
                                    <div id="tablaVacunasEditar"></div>
                                </div>

                                <!-- <div class="input-group mt-3">
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
                                </div> -->

                                <!-- <div id="divSelectsEditar" style="display: none;">
                                    <div class="input-group mt-3">
                                        <div class="form-floating">
                                            <div class="" id="divSelectMedicamentosEditar" style="display: none;">
                                                <select class="form-select" id="selectMedicamentosEditar">
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectExamenesEditar" style="display: none;">
                                                <select class="form-select" id="selectExamenesEditar">
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelectVacunasEditar" style="display: none;">
                                                <select class="form-select" id="selectVacunasEditar">
                                                </select>
                                            </div>
                                            <div class="mt-3" id="divSelecInsumosEditar" style="display: none;">
                                                <select class="form-select" id="selectInsumosEditar">
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->

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
                <button class="btn btn-secondary" id="actualizarPaquete" type="submit"
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

    document.addEventListener('DOMContentLoaded', function() {
        const selectCupsCieEditar = document.getElementById('selectCupsCieEditar');
        const selectCieEditar = document.getElementById('selectCieEditar');
        const selectCupsEditar = document.getElementById('selectCupsEditar');
        const divCieEditar = document.getElementById('divCieEditar');
        const divCupsEditar = document.getElementById('divCupsEditar');

        selectCupsCieEditar.addEventListener('change', function() {
            divCieEditar.style.display = 'none';
            divCupsEditar.style.display = 'none';

            if (this.value === 'cie11') {
                divCieEditar.style.display = 'block';
                selectCieEditar.required = true;
                selectCupsEditar.required = false;
                selectCupsEditar.value = "";
            } else if (this.value === 'cups') {
                divCupsEditar.style.display = 'block';
                selectCupsEditar.required = true;
                selectCieEditar.required = false;
                selectCieEditar.value = "";
            }
        });

        cargarCupsE();
        cargarCieE();

    });

    function cargarCupsE() {
        procedimientosE.forEach(procedimientoE => {
            const optionCupsEditar = document.createElement('option');
            const selectCupsEditar = document.getElementById('selectCupsEditar');
            optionCupsEditar.value = procedimientoE.codigo;
            optionCupsEditar.textContent = procedimientoE.codigo + " - " + procedimientoE.nombre;
            selectCupsEditar.appendChild(optionCupsEditar);
        })
    }

    function cargarCieE() {
        diagnosticosE.forEach(diagnosticoE => {
            const optionCieEditar = document.createElement('option');
            const selectCieEditar = document.getElementById('selectCieEditar');
            optionCieEditar.value = diagnosticoE.codigo;
            optionCieEditar.textContent = diagnosticoE.codigo + " - " + diagnosticoE.nombre;
            selectCieEditar.appendChild(optionCieEditar);
        })
    }

    // Ejecutar cuando el modal se muestra
    $('#modalEditarPaquetePrueba').on('shown.bs.modal', function() {
        // Obtener el paquete desde el atributo de datos
        const paqueteJSON = document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual;
        if (!paqueteJSON) return;

        const paquete = JSON.parse(paqueteJSON);

        // Crear tabla de medicamentos
        const tablaMedicamentos = document.getElementById('tablaMedicamentosEditar');

        // Limpiar tabla si ya tiene contenido
        tablaMedicamentos.innerHTML = '';

        // Agregar título h4 para medicamentos
        tablaMedicamentos.innerHTML = '<h4 class="text-center mt-3">Medicamentos</h4>';

        // Verificar si existen medicamentos
        if (paquete.detalles.medicamentos && paquete.detalles.medicamentos.length > 0) {
            // Crear contenedor para centrar la tabla y darle un ancho del 90%
            let contenedorTabla = document.createElement('div');
            contenedorTabla.className = 'mx-auto';
            contenedorTabla.style.width = '90%';

            // Crear encabezado de la tabla
            let tablaHTML = `
            <table class="table table-striped text-center">
                <thead>
                    <tr>
                        <th style="width: 50%">Nombre</th>
                        <th style="width: 40%">Cantidad</th>
                        <th style="width: 10%">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

            // Agregar cada medicamento
            paquete.detalles.medicamentos.forEach((medicamento, index) => {
                tablaHTML += `
                <tr>
                    <td style="width: 50%">${medicamento.nombre}</td>
                    <td style="width: 40%">
                        <input type="number" class="form-control form-control-sm mx-auto" 
                               id="cantidadMedicamento_${index}" 
                               value="${medicamento.cantidad}" 
                               min="1" 
                               style="width: 80%;"
                               onchange="actualizarCantidadMedicamento(${index}, this.value)">
                    </td>
                    <td style="width: 10%">
                        <button type="button" class="btn btn-sm btn-danger" onclick="eliminarMedicamento(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            });

            // Cerrar tabla
            tablaHTML += `
                </tbody>
            </table>
            <div class="mt-3 text-end"><button class="btn btn-primary" type="button" id="agregarNuevoMedicamento"><i class="fa-solid fa-plus"></i> Agregar Medicamento</button></div>
        `;

            // Insertar HTML en el contenedor
            contenedorTabla.innerHTML = tablaHTML;

            // Agregar el contenedor al div de medicamentos
            tablaMedicamentos.appendChild(contenedorTabla);
        } else {
            // Mostrar mensaje si no hay medicamentos
            tablaMedicamentos.innerHTML += '<div class="alert alert-info mx-auto" style="width: 90%;">No hay medicamentos asociados a este paquete.</div>';
        }
        // Tabla vacunas
        const tablaVacunas = document.getElementById('tablaVacunasEditar');

        // Limpiar tabla si ya tiene contenido
        tablaVacunas.innerHTML = '';

        // Agregar título h4 para medicamentos
        tablaVacunas.innerHTML = '<h4 class="text-center mt-3">Vacunas</h4>';

        // Verificar si existen medicamentos
        if (paquete.detalles.vacunas && paquete.detalles.vacunas.length > 0) {
            // Crear contenedor para centrar la tabla y darle un ancho del 90%
            let contenedorTablaVacunas = document.createElement('div');
            contenedorTablaVacunas.className = 'mx-auto';
            contenedorTablaVacunas.style.width = '90%';

            // Crear encabezado de la tabla
            let tablaHTMLVacunas = `
            <table class="table table-striped text-center">
                <thead>
                    <tr>
                        <th style="width: 50%">Nombre</th>
                        <th style="width: 40%">Cantidad</th>
                        <th style="width: 10%">Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;

            // Agregar cada medicamento
            paquete.detalles.vacunas.forEach((vacuna, index) => {
                tablaHTMLVacunas += `
                <tr>
                    <td style="width: 50%">${vacuna.nombre}</td>
                    <td style="width: 40%">
                        <input type="number" class="form-control form-control-sm mx-auto" 
                               id="cantidadVacuna_${index}" 
                               value="${vacuna.cantidad}" 
                               min="1" 
                               style="width: 80%;"
                               onchange="actualizarCantidadVacuna(${index}, this.value)">
                    </td>
                    <td style="width: 10%">
                        <button type="button" class="btn btn-sm btn-danger" onclick="eliminarVacuna(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            });

            // Cerrar tabla
            tablaHTMLVacunas += `
                </tbody>
            </table>
            <div class="mt-3 text-end"><button class="btn btn-primary" type="button" id="agregarNuevaVacuna"><i class="fa-solid fa-plus"></i> Agregar Vacuna</button></div>
        `;

            // Insertar HTML en el contenedor
            contenedorTablaVacunas.innerHTML = tablaHTMLVacunas;

            // Agregar el contenedor al div de vacunas
            tablaVacunas.appendChild(contenedorTablaVacunas);
        } else {
            // Mostrar mensaje si no hay vacunas
            tablaVacunas.innerHTML += '<div class="alert alert-info mx-auto" style="width: 90%;">No hay vacunas asociados a este paquete.</div>';
        }
    });

    // Función para actualizar la cantidad de un medicamento
    function actualizarCantidadMedicamento(index, nuevaCantidad) {
        // Obtener el paquete actual
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Actualizar la cantidad del medicamento
        paqueteActual.detalles.medicamentos[index].cantidad = parseInt(nuevaCantidad);

        // Guardar el paquete actualizado
        document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

        console.log(`Cantidad del medicamento "${paqueteActual.detalles.medicamentos[index].nombre}" actualizada a: ${nuevaCantidad}`);
    }

    // Función para eliminar un medicamento
    function eliminarMedicamento(index) {
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);
        const medicamento = paqueteActual.detalles.medicamentos[index];

        // Confirmar eliminación
        if (confirm(`¿Está seguro que desea eliminar el medicamento "${medicamento.nombre}"?`)) {
            // Eliminar el medicamento del array
            paqueteActual.detalles.medicamentos.splice(index, 1);

            // Guardar el paquete actualizado
            document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

            // Actualizar la tabla
            $('#modalEditarPaquetePrueba').trigger('shown.bs.modal');

            console.log(`Medicamento "${medicamento.nombre}" eliminado.`);
        }
    }

    // Primero, añade un event listener al botón de agregar medicamento
    $(document).ready(function() {
        $(document).on('click', '#agregarNuevoMedicamento', function() {
            agregarNuevoMedicamento();
        });
    });

    $(document).ready(function() {
        $(document).on('click', '#agregarNuevaVacuna', function() {
            agregarNuevaVacuna();
        });
    });

    // Función para agregar un nuevo medicamento
    function agregarNuevoMedicamento() {
        // Obtener el paquete actual
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Verificar si existe la estructura de medicamentos
        if (!paqueteActual.detalles.medicamentos) {
            paqueteActual.detalles.medicamentos = [];
        }

        // Obtener referencia a la tabla
        const tbody = document.querySelector('#tablaMedicamentosEditar table tbody');

        // Si no existe la tabla, crearla primero
        if (!tbody) {
            // Obtener la referencia nuevamente
            const nuevoTbody = document.querySelector('#tablaMedicamentosEditar table tbody');
            agregarFilaMedicamento(nuevoTbody, paqueteActual.detalles.medicamentos.length);
        } else {
            // Agregar una nueva fila
            agregarFilaMedicamento(tbody, paqueteActual.detalles.medicamentos.length);
        }
    }

    // Función para agregar un nuevo medicamento
    function agregarNuevaVacuna() {
        // Obtener el paquete actual
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Verificar si existe la estructura de medicamentos
        if (!paqueteActual.detalles.vacunas) {
            paqueteActual.detalles.vacunas = [];
        }

        // Obtener referencia a la tabla
        const tbody = document.querySelector('#tablaVacunasEditar table tbody');

        // Si no existe la tabla, crearla primero
        if (!tbody) {
            // Obtener la referencia nuevamente
            const nuevoTbody = document.querySelector('#tablaVacunasEditar table tbody');
            agregarFilaVacuna(nuevoTbody, paqueteActual.detalles.vacunas.length);
        } else {
            // Agregar una nueva fila
            agregarFilaVacuna(tbody, paqueteActual.detalles.vacunas.length);
        }
    }


    // Función para agregar una fila con select e input
    function agregarFilaMedicamento(tbody, index) {
        // Crear una nueva fila
        const nuevaFila = document.createElement('tr');
        nuevaFila.id = `fila_medicamento_${index}`;

        // Crear celda para el select de medicamentos
        const celdaNombre = document.createElement('td');
        celdaNombre.style.width = '50%';

        // Crear el select de medicamentos
        const selectMedicamento = document.createElement('select');
        selectMedicamento.className = 'form-select form-select-sm';
        selectMedicamento.id = `selectMedicamento_${index}`;
        selectMedicamento.innerHTML = '<option value="">Seleccione un medicamento</option>';

        medicamentosE.forEach(med => {
            const option = document.createElement('option');
            option.value = med.id;
            option.textContent = med.nombre;
            selectMedicamento.appendChild(option);
        });

        // Asignar evento de cambio al select
        selectMedicamento.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            guardarNuevoMedicamento(index, selectedOption.value, selectedOption.textContent);
        });

        celdaNombre.appendChild(selectMedicamento);

        // Crear celda para la cantidad
        const celdaCantidad = document.createElement('td');
        celdaCantidad.style.width = '40%';

        // Crear input para la cantidad
        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.className = 'form-control form-control-sm mx-auto';
        inputCantidad.id = `cantidadMedicamento_${index}`;
        inputCantidad.value = 1;
        inputCantidad.min = 1;
        inputCantidad.style.width = '80%';

        // Asignar evento de cambio al input
        inputCantidad.addEventListener('change', function() {
            actualizarCantidadMedicamentoNuevo(index, this.value);
        });

        celdaCantidad.appendChild(inputCantidad);

        // Crear celda para las acciones
        const celdaAcciones = document.createElement('td');
        celdaAcciones.style.width = '10%';

        // Crear botón de eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-sm btn-danger';
        botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';

        // Asignar evento click al botón de eliminar
        botonEliminar.addEventListener('click', function() {
            eliminarNuevoMedicamento(index);
        });

        celdaAcciones.appendChild(botonEliminar);

        // Añadir todas las celdas a la fila
        nuevaFila.appendChild(celdaNombre);
        nuevaFila.appendChild(celdaCantidad);
        nuevaFila.appendChild(celdaAcciones);

        // Añadir la fila al tbody
        tbody.appendChild(nuevaFila);

        // Inicializar un medicamento vacío en el paquete
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);
        if (!paqueteActual.detalles.medicamentos.some(m => m.temporal && m.index === index)) {
            paqueteActual.detalles.medicamentos.push({
                id: '',
                nombre: '',
                cantidad: 1,
                temporal: true,
                index: index
            });
            document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);
        }
    }

    function agregarFilaVacuna(tbody, index) {
        // Crear una nueva fila
        const nuevaFilaVac = document.createElement('tr');
        nuevaFilaVac.id = `fila_medicamento_${index}`;

        const celdaNombreVac = document.createElement('td');
        celdaNombreVac.style.width = '50%';

        const selectNuevaVacuna = document.createElement('select');
        selectNuevaVacuna.className = 'form-select form-select-sm';
        selectNuevaVacuna.id = `selectVacuna_${index}`;
        selectNuevaVacuna.innerHTML = '<option value="">Seleccione una vacuna</option>';

        vacunasE.forEach(vac => {
            const optionVac = document.createElement('option');
            optionVac.value = vac.id;
            optionVac.textContent = vac.nombre;
            selectNuevaVacuna.appendChild(optionVac);
        });

        // Asignar evento de cambio al select
        selectNuevaVacuna.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            guardarNuevaVacuna(index, selectedOption.value, selectedOption.textContent);
        });

        celdaNombreVac.appendChild(selectNuevaVacuna);

        // Crear celda para la cantidad
        const celdaCantidadVac = document.createElement('td');
        celdaCantidadVac.style.width = '40%';

        // Crear input para la cantidad
        const inputCantidadVac = document.createElement('input');
        inputCantidadVac.type = 'number';
        inputCantidadVac.className = 'form-control form-control-sm mx-auto';
        inputCantidadVac.id = `cantidadVacuna_${index}`;
        inputCantidadVac.value = 1;
        inputCantidadVac.min = 1;
        inputCantidadVac.style.width = '80%';

        // Asignar evento de cambio al input
        inputCantidadVac.addEventListener('change', function() {
            actualizarCantidadVacunaNuevo(index, this.value);
        });

        celdaCantidadVac.appendChild(inputCantidad);

        // Crear celda para las acciones
        const celdaAcciones = document.createElement('td');
        celdaAcciones.style.width = '10%';

        // Crear botón de eliminar
        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-sm btn-danger';
        botonEliminar.innerHTML = '<i class="fas fa-trash"></i>';

        // Asignar evento click al botón de eliminar
        botonEliminar.addEventListener('click', function() {
            eliminarNuevaVacuna(index);
        });

        celdaAcciones.appendChild(botonEliminar);

        // Añadir todas las celdas a la fila
        nuevaFilaVac.appendChild(celdaNombre);
        nuevaFilaVac.appendChild(celdaCantidad);
        nuevaFilaVac.appendChild(celdaAcciones);

        // Añadir la fila al tbody
        tbody.appendChild(nuevaFila);

        // Inicializar un medicamento vacío en el paquete
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);
        if (!paqueteActual.detalles.vacunas.some(m => m.temporal && m.index === index)) {
            paqueteActual.detalles.vacunas.push({
                id: '',
                nombre: '',
                cantidad: 1,
                temporal: true,
                index: index
            });
            document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);
        }
    }

    // Función para guardar el medicamento seleccionado
    function guardarNuevoMedicamento(index, idMedicamento, nombreMedicamento) {
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Buscar si ya existe un medicamento temporal con este índice
        const medicamentoIndex = paqueteActual.detalles.medicamentos.findIndex(m => m.temporal && m.index === index);

        if (medicamentoIndex !== -1) {
            // Actualizar el medicamento existente
            paqueteActual.detalles.medicamentos[medicamentoIndex].id = idMedicamento;
            paqueteActual.detalles.medicamentos[medicamentoIndex].nombre = nombreMedicamento;
        } else {
            // Agregar un nuevo medicamento
            paqueteActual.detalles.medicamentos.push({
                id: idMedicamento,
                nombre: nombreMedicamento,
                cantidad: 1,
                temporal: true,
                index: index
            });
        }

        // Guardar el paquete actualizado
        document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

        console.log(`Medicamento "${nombreMedicamento}" seleccionado con id: ${idMedicamento}`);
    }

    // Función para actualizar la cantidad del nuevo medicamento
    function actualizarCantidadMedicamentoNuevo(index, nuevaCantidad) {
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Buscar el medicamento por su índice temporal
        const medicamentoIndex = paqueteActual.detalles.medicamentos.findIndex(m => m.temporal && m.index === index);

        if (medicamentoIndex !== -1) {
            // Actualizar la cantidad
            paqueteActual.detalles.medicamentos[medicamentoIndex].cantidad = parseInt(nuevaCantidad);

            // Guardar el paquete actualizado
            document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

            console.log(`Cantidad del nuevo medicamento actualizada a: ${nuevaCantidad}`);
        }
    }

    // Función para eliminar un nuevo medicamento
    function eliminarNuevoMedicamento(index) {
        const paqueteActual = JSON.parse(document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual);

        // Buscar el medicamento por su índice temporal
        const medicamentoIndex = paqueteActual.detalles.medicamentos.findIndex(m => m.temporal && m.index === index);

        if (medicamentoIndex !== -1) {
            const medicamento = paqueteActual.detalles.medicamentos[medicamentoIndex];

            // Si el medicamento ya tiene un nombre, pedir confirmación
            if (medicamento.nombre) {
                if (confirm(`¿Está seguro que desea eliminar el medicamento "${medicamento.nombre}"?`)) {
                    // Eliminar el medicamento del array
                    paqueteActual.detalles.medicamentos.splice(medicamentoIndex, 1);

                    // Eliminar la fila de la tabla
                    const fila = document.getElementById(`fila_medicamento_${index}`);
                    if (fila) fila.remove();

                    // Guardar el paquete actualizado
                    document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

                    console.log(`Medicamento "${medicamento.nombre}" eliminado.`);
                }
            } else {
                // Si no tiene nombre, eliminar sin confirmación
                paqueteActual.detalles.medicamentos.splice(medicamentoIndex, 1);

                // Eliminar la fila de la tabla
                const fila = document.getElementById(`fila_medicamento_${index}`);
                if (fila) fila.remove();

                // Guardar el paquete actualizado
                document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paqueteActual);

                console.log("Medicamento sin nombre eliminado.");
            }
        }
    }
</script>