<div class="modal fade" id="nuevoExamenModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Nuevo examen</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Seleccionar por:</h5>
                        <button class="btn btn-outline-secondary me-1 mb-1" type="button" onclick="mostrarCard('cardExamenes')">Exámen</button>
                        <button class="btn btn-outline-secondary me-1 mb-1" type="button" onclick="mostrarCard('cardPaquetes')">Paquetes</button>
                        <button class="btn btn-outline-secondary me-1 mb-1" type="button" onclick="mostrarCard('cardCategorias')">Categorías</button>
                    </div>
                </div>

                <div class="card mb-3" id="cardExamenes" style="display: none">
                    <div class="card-body">
                        <h5 class="card-title">Seleccionar exámen</h5>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label for="categoriaExamen" class="form-label">Categoria</label>
                                <select class="form-select" id="categoriaExamen" name="categoriaExamen"></select>
                            </div>
                            <div class="col-md-6">
                                <label for="examenes" class="form-label">Exámenes</label>
                                <select class="form-select" id="examenes" name="examenes"></select>
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-primary" type="button" id="agregarExamenBtn"> <i class="fa-solid fa-plus"></i></button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card mb-3" id="cardPaquetes" style="display: none">
                    <div class="card-body">
                        <h5 class="card-title">Seleccionar paquete de exámenes</h5>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label for="paquetes" class="form-label">Paquetes</label>
                                <select class="form-select" id="paquetes" name="paquetes"></select>
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-primary" type="button" id="agregarPaqueteBtn"> <i class="fa-solid fa-plus"></i></button>
                            </div>
                        </form>
                    </div>
                </div>

                <div class="card mb-3" id="cardCategorias" style="display: none">
                    <div class="card-body">
                        <h5 class="card-title">Seleccionar categoria de exámenes</h5>
                        <form class="row g-3">
                            <div class="col-md-6">
                                <label for="categoria" class="form-label">Categoria</label>
                                <select class="form-select" id="categoria" name="categoria"></select>
                            </div>
                            <div class="col-12 text-end">
                                <button class="btn btn-primary" type="button" id="agregarCategoriaBtn"> <i class="fa-solid fa-plus"></i></button>
                            </div>
                        </form>
                    </div>
                </div>

                <div id="examenesContainer" style="display: none">
                    <div class="card mt-3">
                        <div class="card-body">
                            <h5 class="card-title">Exámenes a realizar</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" id="guardarExamenesBtn" type="button">Guardar</button>
                <button class="btn btn-outline-primary" type="button" data-bs-dismiss="modal">Cancelar</button>
            </div>
        </div>
    </div>
</div>
<script>
    function mostrarCard(idCard) {
        document.getElementById('cardExamenes').style.display = 'none';
        document.getElementById('cardPaquetes').style.display = 'none';
        document.getElementById('cardCategorias').style.display = 'none';

        document.getElementById(idCard).style.display = 'block';
    }

    const examenesMedicos = [
        "Examen de sangre",
        "Radiografía de tórax",
        "Electrocardiograma",
        "Prueba de función pulmonar",
        "Ecografía abdominal",
        "Análisis de orina",
        "Mastografía",
        "Colonoscopy",
        "Prueba de estrés",
        "Tomografía computarizada (TC)",
        "Resonancia magnética (RM)",
        "Prueba de colesterol",
        "Prueba de glucosa",
        "Examen de vista",
        "Examen de audición"
    ];

    const categoriasExamenes = {
        "Exámenes de laboratorio": [
            "Examen de sangre",
            "Análisis de orina",
            "Prueba de colesterol",
            "Prueba de glucosa",
            "Prueba de función hepática"
        ],
        "Imágenes médicas": [
            "Radiografía de tórax",
            "Ecografía abdominal",
            "Tomografía computarizada (TC)",
            "Resonancia magnética (RM)",
            "Mamografía"
        ],
        "Cardiológicos": [
            "Electrocardiograma",
            "Prueba de estrés",
            "Ecocardiograma",
            "Holter de 24 horas"
        ],
        "Exámenes de cáncer": [
            "Mamografía",
            "Papanicolaou",
            "Colonoscopia",
            "Biopsia de piel",
            "Examen de próstata (PSA)"
        ],
        "Exámenes respiratorios": [
            "Prueba de función pulmonar",
            "Espirometría",
            "Prueba de esfuerzo respiratorio"
        ],
        "Exámenes de audición y visión": [
            "Examen de vista",
            "Examen de audición",
            "Audiometría"
        ]
    };

    const paquetesExamenes = {
        "Paquete básico de salud": [
            "Examen de sangre",
            "Análisis de orina",
            "Examen de vista",
            "Examen de audición"
        ],
        "Paquete cardiovascular": [
            "Electrocardiograma",
            "Prueba de esfuerzo",
            "Ecocardiograma",
            "Examen de sangre"
        ],
        "Paquete de chequeo general": [
            "Radiografía de tórax",
            "Examen de sangre",
            "Mamografía",
            "Papanicolaou",
            "Prueba de colesterol",
            "Examen de vista"
        ],
        "Paquete de salud respiratoria": [
            "Prueba de función pulmonar",
            "Espirometría",
            "Radiografía de tórax",
            "Prueba de esfuerzo respiratorio"
        ],
        "Paquete de diagnóstico oncológico": [
            "Mamografía",
            "Papanicolaou",
            "Colonoscopia",
            "Biopsia de piel",
            "Examen de próstata (PSA)"
        ],
        "Paquete avanzado de salud": [
            "Tomografía computarizada (TC)",
            "Resonancia magnética (RM)",
            "Análisis de orina",
            "Prueba de glucosa",
            "Examen de sangre",
            "Ecografía abdominal"
        ]
    };

    function cargarCategoriasExamen() {
        const selectCategoriaExamen = document.getElementById('categoriaExamen');

        selectCategoriaExamen.innerHTML = '';

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = 'Seleccione una categoría';
        selectCategoriaExamen.appendChild(opcionDefault);

        Object.keys(categoriasExamenes).forEach(categoriaExamen => {
            const option = document.createElement('option');
            option.value = categoriaExamen;
            option.textContent = categoriaExamen;
            selectCategoriaExamen.appendChild(option);
        });

        selectCategoriaExamen.addEventListener('change', cargarExamenes);
    }

    function cargarExamenes() {
        const categoriaSeleccionada = document.getElementById('categoriaExamen').value;
        const selectExamenes = document.getElementById('examenes');

        selectExamenes.innerHTML = '';

        if (!categoriaSeleccionada) {
            const opcionDefault = document.createElement('option');
            opcionDefault.value = '';
            opcionDefault.textContent = 'Seleccione una categoría primero';
            selectExamenes.appendChild(opcionDefault);
            return;
        }

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = 'Seleccione un examen';
        selectExamenes.appendChild(opcionDefault);

        const examenes = categoriasExamenes[categoriaSeleccionada];

        examenes.forEach(examen => {
            const option = document.createElement('option');
            option.value = examen;
            option.textContent = examen;
            selectExamenes.appendChild(option);
        });
    }

    function cargarPaquetes() {
        const selectPaquetes = document.getElementById('paquetes');

        selectPaquetes.innerHTML = '';

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = 'Seleccione un paquete';
        selectPaquetes.appendChild(opcionDefault);

        Object.keys(paquetesExamenes).forEach(paquete => {
            const option = document.createElement('option');
            option.value = paquete;
            option.textContent = paquete;
            selectPaquetes.appendChild(option);
        });
    }

    function cargarCategorias() {
        const selectCategoria = document.getElementById('categoria');

        selectCategoria.innerHTML = '';

        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = 'Seleccione una categoria';
        selectCategoria.appendChild(opcionDefault);

        Object.keys(categoriasExamenes).forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria;
            option.textContent = categoria;
            selectCategoria.appendChild(option);
        });
    }

    function agregarExamen() {
        const selectExamenes = document.getElementById('examenes');

        const examenSeleccionado = selectExamenes.value;
        const textoExamen = selectExamenes.options[selectExamenes.selectedIndex].text;

        if (!examenSeleccionado) {
            alert('Por favor, seleccione un examen');
            return;
        }

        agregarExamenATabla(textoExamen);

        selectExamenes.value = '';
    }

    function agregarExamenATabla(nombreExamen) {
        const examenesContainer = document.getElementById('examenesContainer');

        examenesContainer.style.display = 'block';

        let tablaExamenes = examenesContainer.querySelector('table');

        if (!tablaExamenes) {
            const cardBody = examenesContainer.querySelector('.card-body');

            tablaExamenes = document.createElement('table');
            tablaExamenes.id = 'tablaExamenes';
            tablaExamenes.classList.add('table', 'mt-3');

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');

            const thIndex = document.createElement('th');
            thIndex.scope = 'col';
            thIndex.textContent = '#';
            thIndex.style.width = '50px';
            headerRow.appendChild(thIndex);

            const thNombre = document.createElement('th');
            thNombre.scope = 'col';
            thNombre.textContent = 'Exámen';
            headerRow.appendChild(thNombre);

            const thAcciones = document.createElement('th');
            thAcciones.scope = 'col';
            thAcciones.textContent = 'Acciones';
            thAcciones.style.width = '100px';
            thAcciones.classList.add('text-end');
            headerRow.appendChild(thAcciones);

            thead.appendChild(headerRow);
            tablaExamenes.appendChild(thead);

            const tbody = document.createElement('tbody');
            tbody.id = 'tablaExamenesBody';
            tablaExamenes.appendChild(tbody);

            cardBody.appendChild(tablaExamenes);
        }

        const tbody = document.getElementById('tablaExamenesBody') || tablaExamenes.querySelector('tbody');

        let existeExamen = false;
        for (let i = 0; i < tbody.rows.length; i++) {
            if (tbody.rows[i].cells[1].textContent === nombreExamen) {
                existeExamen = true;
                break;
            }
        }

        if (existeExamen) {
            return;
        }

        const rowIndex = tbody.rows.length + 1;

        const newRow = document.createElement('tr');

        const indexCell = document.createElement('td');
        indexCell.textContent = rowIndex;
        newRow.appendChild(indexCell);

        const nombreCell = document.createElement('td');
        nombreCell.textContent = nombreExamen;
        newRow.appendChild(nombreCell);

        const accionesCell = document.createElement('td');
        accionesCell.classList.add('text-end');

        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.classList.add('btn', 'btn-danger', 'btn-sm');
        btnEliminar.innerHTML = '<i class="fa-solid fa-trash"></i>';

        btnEliminar.addEventListener('click', function() {
            newRow.remove();

            actualizarIndices();

            if (tbody.rows.length === 0) {
                examenesContainer.style.display = 'none';
            }
        });

        accionesCell.appendChild(btnEliminar);
        newRow.appendChild(accionesCell);

        tbody.appendChild(newRow);
    }

    function actualizarIndices() {
        const tbody = document.getElementById('tablaExamenesBody');

        if (!tbody) {
            console.error('No se encontró el cuerpo de la tabla para actualizar índices');
            return;
        }

        for (let i = 0; i < tbody.rows.length; i++) {
            tbody.rows[i].cells[0].textContent = i + 1;
        }
    }

    function agregarPaquete() {
        const selectPaquetes = document.getElementById('paquetes');

        const paqueteSeleccionado = selectPaquetes.value;

        if (!paqueteSeleccionado) {
            alert('Por favor, seleccione un paquete');
            return;
        }

        const examenesDelPaquete = paquetesExamenes[paqueteSeleccionado];

        examenesDelPaquete.forEach(examen => {
            agregarExamenATabla(examen);
        });

        selectPaquetes.value = '';
    }

    function agregarCategoria() {
        const selectCategoria = document.getElementById('categoria');

        const categoriaSeleccionada = selectCategoria.value;

        if (!categoriaSeleccionada) {
            alert('Por favor, seleccione una categoría');
            return;
        }

        const examenesDeLaCategoria = categoriasExamenes[categoriaSeleccionada];

        examenesDeLaCategoria.forEach(examen => {
            agregarExamenATabla(examen);
        });

        selectCategoria.value = '';

        const selectExamenes = document.getElementById('examenes');
        selectExamenes.innerHTML = '';
        const opcionDefault = document.createElement('option');
        opcionDefault.value = '';
        opcionDefault.textContent = 'Seleccione una categoría primero';
        selectExamenes.appendChild(opcionDefault);
    }

    function configurarBotonGuardar() {
        const btnGuardar = document.getElementById('guardarExamenesBtn');

        if (!btnGuardar) {
            console.error('No se encontró el botón de guardar');
            return;
        }

        btnGuardar.addEventListener('click', function() {
            const examenes = [];

            const examenesContainer = document.getElementById('examenesContainer');

            if (examenesContainer.style.display === 'none') {
                console.log('No hay exámenes para guardar');
                return;
            }

            const tbody = document.getElementById('tablaExamenesBody');

            if (!tbody) {
                console.log('No se encontró la tabla de exámenes');
                return;
            }

            for (let i = 0; i < tbody.rows.length; i++) {
                const nombreExamen = tbody.rows[i].cells[1].textContent;

                examenes.push({
                    id: i + 1,
                    nombre: nombreExamen
                });
            }

            console.log('Exámenes guardados:', examenes);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        cargarCategoriasExamen();
        cargarCategorias();
        cargarPaquetes();
        cargarExamenes();
        configurarBotonGuardar();

        const agregarExamenBtn = document.getElementById('agregarExamenBtn');
        agregarExamenBtn.addEventListener('click', agregarExamen);

        const agregarPaqueteBtn = document.getElementById('agregarPaqueteBtn');
        agregarPaqueteBtn.addEventListener('click', agregarPaquete);

        const agregarCategoriaBtn = document.getElementById('agregarCategoriaBtn');
        agregarCategoriaBtn.addEventListener('click', agregarCategoria);
    });
</script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>