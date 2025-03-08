<div class="modal fade" id="modalCargarResultados" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Cargar Resultados</h5><button class="btn btn-close p-1" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card mb-3">
                    <div class="card-body" id="">
                        <h5 class="card-title">Exámenes solicitados</h5>
                        <div id="tablaResultados">
                            <!-- Aqui se mostrará la tabla con los examenes -->
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

    // Función para crear la tabla de exámenes a partir de un JSON
    function crearTablaExamenes(examenesData) {
        // Obtener el contenedor donde se insertará la tabla
        const tablaResultados = document.getElementById('tablaResultados');

        // Crear el elemento tabla
        const tabla = document.createElement('table');
        tabla.className = 'table';

        // Crear encabezado de la tabla
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // Definir los encabezados
        const headers = ['#', 'Nombre del examen', 'Resultado', 'Unidades de referencia', 'Valores de referencia'];

        // Añadir cada encabezado a la fila con clases para controlar el ancho
        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;

            // Asignar clases según la columna
            if (index === 0) {
                th.className = 'text-center';
                th.style.width = '5%';
            } else if (index === 1) {
                th.style.width = '35%'; 
            } else if (index === 3) {
                th.style.width = '15%'; 
            } else if (index === 4) {
                th.style.width = '15%'; 
            }

            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        tabla.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');

        // Iterar sobre los datos del JSON para crear cada fila
        examenesData.forEach((examen, index) => {
            const row = document.createElement('tr');

            // Celda para el índice
            const indexCell = document.createElement('td');
            indexCell.textContent = index + 1;
            indexCell.className = 'text-center'; // Centrar el índice
            row.appendChild(indexCell);

            // Celda para el nombre del examen
            const nombreCell = document.createElement('td');
            nombreCell.textContent = examen.nombre;
            row.appendChild(nombreCell);

            // Celda para el resultado (con input)
            const resultadoCell = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = `resultado-${examen.id || index}`;
            input.name = `resultado-${examen.id || index}`;
            input.dataset.examenId = examen.id || index;
            resultadoCell.appendChild(input);
            row.appendChild(resultadoCell);

            // Celda para las unidades de referencia
            const unidadesCell = document.createElement('td');
            unidadesCell.textContent = examen.unidades;
            unidadesCell.className = 'text-center'; // Centrar para mejorar apariencia
            row.appendChild(unidadesCell);

            // Celda para los valores de referencia
            const valoresCell = document.createElement('td');
            valoresCell.textContent = examen.valoresReferencia;
            valoresCell.className = 'text-center'; // Centrar para mejorar apariencia
            row.appendChild(valoresCell);

            tbody.appendChild(row);
        });

        tabla.appendChild(tbody);

        // Añadir la tabla al card-body después del título
        tablaResultados.appendChild(tabla);

        return tabla;
    }

    // Ejemplo de uso con datos de ejemplo
    document.addEventListener('DOMContentLoaded', function() {
        // Ejemplo de JSON con datos de exámenes
        const examenesJSON = [{
                id: 1,
                nombre: "Hemoglobina",
                unidades: "g/dL",
                valoresReferencia: "12.0 - 16.0"
            },
            {
                id: 2,
                nombre: "Glucosa",
                unidades: "mg/dL",
                valoresReferencia: "70 - 100"
            },
            {
                id: 3,
                nombre: "Colesterol",
                unidades: "mg/dL",
                valoresReferencia: "< 200"
            },
            {
                id: 4,
                nombre: "Triglicéridos",
                unidades: "mg/dL",
                valoresReferencia: "< 150"
            }
        ];

        // Llamar a la función para crear la tabla
        crearTablaExamenes(examenesJSON);
    });


    
</script>
<!-- Agrega el enlace a Choices.js -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css">
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>