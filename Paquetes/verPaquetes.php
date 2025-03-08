<?php
include "../menu.php";
include "../header.php";
?>

<div class="componete">
    <div class="content">
        <div class="container-small">
            <nav class="mb-3" aria-label="breadcrumb">
                <ol class="breadcrumb mt-5">
                    <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Pacientes</li>
                </ol>
            </nav>
            <!-- Contenido Paquetes -->
            <div class="" id="paquetesContent">
                <div class="pb-9">
                    <div class="row mt-5">
                        <div class="col-md-12">
                            <h2 class="mb-3">Paquetes</h2>
                            <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                                data-bs-target="#modalAgregarPaquete">
                                <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo paquete
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <!-- Tabla de paquetes -->
                        <div class="col-lg-12">
                            <div id="tableExample4" data-list="{&quot;valueNames&quot;:[&quot;nombre&quot;,&quot;incluidos&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                <div class="table-responsive">
                                    <table class="table table-sm fs-9 mb-0">
                                        <thead>
                                            <tr class="bg-body-highlight">
                                                <th class="sort border-top border-translucent ps-3" data-sort="nombre">Nombre del paquete</th>
                                                <th class="sort border-top border-translucent" data-sort="incluidos">Incluidos</th>
                                                <th class="sort border-top border-translucent text-end pe-3" data-sort="acciones">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody id="tabla-paquetes" class="list">
                                            <!-- Las filas se generarán dinámicamente con JavaScript -->
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

<script>
    // JSON con los paquetes y sus elementos incluidos
    const paquetes = [{
            nombre: "Paquete Básico",
            incluidos: {
                medicamentos: ["Paracetamol", "Ibuprofeno"],
                procedimientos: ["Consulta general"],
                diagnosticos: ["A00 - Cólera", "B20 - Infección por el virus de la inmunodeficiencia humana (VIH)"],
                examenes: ["Análisis de orina", "Hemograma"],
                vacunas: ["Vacuna contra la influenza", "Vacuna contra el tétanos"],
                insumos: ["Termómetro", "Esfigmomanómetro", "Estetoscopio"]
            }
        },
        {
            nombre: "Paquete Prenatal",
            incluidos: {
                medicamentos: ["Ácido Fólico", "Hierro"],
                procedimientos: ["Ecografía abdominal", "Consulta prenatal"],
                diagnosticos: ["F32 - Episodio depresivo mayor", "A00 - Cólera"],
                examenes: ["Análisis de sangre", "Ecografía abdominal"],
                vacunas: ["Vacuna contra la hepatitis B", "Vacuna contra la influenza"],
                insumos: ["Gel para ecografía", "Transductor", "Monitor"]
            }
        },
        {
            nombre: "Paquete Cardiológico",
            incluidos: {
                medicamentos: ["Atorvastatina", "Losartán"],
                procedimientos: ["Electrocardiograma", "Ecocardiograma"],
                diagnosticos: ["I10 - Hipertensión esencial (primaria)", "G40 - Epilepsia"],
                examenes: ["Perfil lipídico", "Prueba de función cardíaca"],
                vacunas: ["Vacuna contra la neumonía", "Vacuna contra la influenza"],
                insumos: ["Electrodos", "Cable de ECG", "Monitor de ECG", "Gel para ecografía"]
            }
        },
        {
            nombre: "Paquete Pediátrico",
            incluidos: {
                medicamentos: ["Amoxicilina suspensión", "Ibuprofeno pediátrico"],
                procedimientos: ["Control de crecimiento", "Vacunación"],
                diagnosticos: ["Valoración del desarrollo", "D50 - Anemia por deficiencia de hierro"],
                examenes: ["Hemograma", "Análisis de sangre"],
                vacunas: ["Vacuna contra la hepatitis B", "Vacuna contra la varicela"],
                insumos: ["Termómetro", "Estetoscopio", "Jeringas"]
            }
        },
        {
            nombre: "Paquete Diabetes",
            incluidos: {
                medicamentos: ["Metformina", "Insulina"],
                procedimientos: ["Control de glucemia"],
                diagnosticos: ["E11 - Diabetes mellitus tipo 2", "I10 - Hipertensión esencial (primaria)"],
                examenes: ["Hemoglobina glicosilada", "Función renal", "Perfil lipídico"],
                vacunas: ["Vacuna contra la hepatitis B", "Vacuna contra la influenza"],
                insumos: ["Monitores de glucosa", "Tiras reactivas", "Jeringas para insulina"]
            }
        }
    ];

    console.log(paquetes);


    // Función para formatear los elementos incluidos en un texto legible
    function formatearIncluidos(incluidos) {
        let resultado = [];

        if (incluidos.medicamentos && incluidos.medicamentos.length > 0) {
            resultado.push(`<strong>Medicamentos:</strong> ${incluidos.medicamentos.join(', ')}`);
        }

        if (incluidos.procedimientos && incluidos.procedimientos.length > 0) {
            resultado.push(`<strong>Procedimientos:</strong> ${incluidos.procedimientos.join(', ')}`);
        }

        if (incluidos.diagnosticos && incluidos.diagnosticos.length > 0) {
            resultado.push(`<strong>Diagnósticos:</strong> ${incluidos.diagnosticos.join(', ')}`);
        }

        if (incluidos.examenes && incluidos.examenes.length > 0) {
            resultado.push(`<strong>Exámenes:</strong> ${incluidos.examenes.join(', ')}`);
        }

        if (incluidos.vacunas && incluidos.vacunas.length > 0) {
            resultado.push(`<strong>Vacunas:</strong> ${incluidos.vacunas.join(', ')}`);
        }
        
        if (incluidos.insumos && incluidos.insumos.length > 0) {
            resultado.push(`<strong>Insumos:</strong> ${incluidos.insumos.join(', ')}`);
        }

        return resultado.join('<br>');
    }

    // Función para generar las filas de la tabla dinámicamente
    function generarFilasTabla() {
        const tbody = document.getElementById('tabla-paquetes');
        tbody.innerHTML = ''; // Limpia el contenido actual

        paquetes.forEach(paquete => {
            const fila = document.createElement('tr');
            fila.className = 'table-row';

            // Crear las celdas de la fila
            fila.innerHTML = `
            <td class="align-middle ps-3">${paquete.nombre}</td>
            <td class="align-middle">${formatearIncluidos(paquete.incluidos)}</td>
            <td class="align-middle text-end pe-3">
                <button class="btn btn-sm btn-warning editar-paquete" data-nombre="${paquete.nombre}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger eliminar-paquete" data-nombre="${paquete.nombre}"><i class="fas fa-trash"></i></button>
            </td>
        `;

            tbody.appendChild(fila);
        });

        // Agregar eventos a los botones de editar y eliminar
        agregarEventosTabla();
    }

    // Función para agregar eventos a los botones de la tabla
    function agregarEventosTabla() {
        // Botones de editar
        document.querySelectorAll('.editar-paquete').forEach(boton => {
            boton.addEventListener('click', function() {
                const nombrePaquete = this.getAttribute('data-nombre');
                editarPaquete(nombrePaquete);
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.eliminar-paquete').forEach(boton => {
            boton.addEventListener('click', function() {
                const nombrePaquete = this.getAttribute('data-nombre');
                eliminarPaquete(nombrePaquete);
            });
        });
    }

    // Función para editar un paquete
    function editarPaquete(nombrePaquete) {
        // Encuentra el paquete en el array de datos
        const paquete = paquetes.find(p => p.nombre === nombrePaquete);
        if (paquete) {
            console.log("Editando paquete:", paquete);
            // Aquí puedes implementar la lógica para mostrar un modal de edición
            // o redirigir a una página de edición, etc.
            alert(`Editando paquete: ${nombrePaquete}`);
        }
    }

    // Función para eliminar un paquete
    function eliminarPaquete(nombrePaquete) {
        if (confirm(`¿Está seguro que desea eliminar el paquete "${nombrePaquete}"?`)) {
            // Elimina el paquete del array de datos
            const index = paquetes.findIndex(p => p.nombre === nombrePaquete);
            if (index !== -1) {
                paquetes.splice(index, 1);
                // Actualiza la tabla
                generarFilasTabla();
                console.log(`Paquete "${nombrePaquete}" eliminado.`);
            }
        }
    }

    // Función para agregar un nuevo paquete
    function agregarPaquete(nuevoPaquete) {
        paquetes.push(nuevoPaquete);
        generarFilasTabla();
    }

    // Inicializar la tabla al cargar la página
    document.addEventListener('DOMContentLoaded', function() {
        generarFilasTabla();
    });
</script>


<?php include "../footer.php";
include "./modalAgregarPaquete.php";
?>