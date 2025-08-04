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
                    <li class="breadcrumb-item"><a href="homeInventario">Inventarios</a></li>
                    <li class="breadcrumb-item active" onclick="location.reload()">Paquetes</li>
                </ol>
            </nav>
            <!-- Contenido Paquetes -->
            <div class="" id="paquetesContent">
                <div class="pb-9">
                    <div class="row mt-5">
                        <div class="col-md-12">
                            <h2 class="mb-3">Paquetes</h2>
                            <button class="btn btn-primary mb-4" type="button" data-bs-toggle="modal"
                                data-bs-target="#modalAgregarPaquetes">
                                <span class="fa-solid fa-plus me-2 fs-9"></span> Agregar nuevo paquete
                            </button>
                        </div>
                    </div>
                    <div class="row">
                        <!-- Tabla de paquetes -->
                        <div class="col-lg-12">
                            <div id="tableExample4" data-list="{&quot;valueNames&quot;:[&quot;nombre&quot;,&quot;detalles&quot;],&quot;page&quot;:5,&quot;pagination&quot;:true}">
                                <div class="table-responsive">
                                    <table class="table table-sm fs-9 mb-0">
                                        <thead>
                                            <tr class="bg-body-highlight">
                                                <th class="sort border-top border-translucent ps-3" data-sort="nombre">Nombre del paquete</th>
                                                <th class="sort border-top border-translucent" data-sort="detalles">Detalles</th>
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
    console.log ("hola")
</script>

<!-- <script>
    // JSON con los paquetes y sus elementos detalles
    const paquetes = [{
            nombre: "Paquete Básico",
            detalles: {
                relacion: "cups",
                medicamentos: [{
                        nombre: "Paracetamol",
                        cantidad: 10
                    },
                    {
                        nombre: "Ibuprofeno",
                        cantidad: 20
                    }
                ],
                procedimientos: ["001010 - Consulta general"],
                diagnosticos: [],
                examenes: ["Análisis de orina", "Hemograma"],
                vacunas: [{
                        nombre: "Vacuna contra la influenza",
                        cantidad: 1
                    },
                    {
                        nombre: "Vacuna contra el tétanos",
                        cantidad: 1
                    }
                ],
                insumos: [{
                        nombre: "Termómetro",
                        cantidad: 5
                    },
                    {
                        nombre: "Esfigmomanómetro",
                        cantidad: 3
                    },
                    {
                        nombre: "Estetoscopio",
                        cantidad: 2
                    }
                ]
            }
        },
        {
            nombre: "Paquete Prenatal",
            detalles: {
                relacion: "cie11",
                medicamentos: [{
                        nombre: "Ácido Fólico",
                        cantidad: 30
                    },
                    {
                        nombre: "Hierro",
                        cantidad: 25
                    }
                ],
                procedimientos: [],
                diagnosticos: ["F32 - Episodio depresivo mayor"],
                examenes: ["Análisis de sangre", "Ecografía abdominal"],
                vacunas: [{
                        nombre: "Vacuna contra la hepatitis B",
                        cantidad: 2
                    },
                    {
                        nombre: "Vacuna contra la influenza",
                        cantidad: 2
                    }
                ],
                insumos: [{
                        nombre: "Gel para ecografía",
                        cantidad: 1
                    },
                    {
                        nombre: "Transductor",
                        cantidad: 1
                    },
                    {
                        nombre: "Monitor",
                        cantidad: 1
                    }
                ]
            }
        },
        {
            nombre: "Paquete Cardiológico",
            detalles: {
                relacion: "cie11",
                medicamentos: [{
                        nombre: "Atorvastatina",
                        cantidad: 15
                    },
                    {
                        nombre: "Losartán",
                        cantidad: 20
                    }
                ],
                procedimientos: [],
                diagnosticos: ["I10 - Hipertensión esencial (primaria)", "G40 - Epilepsia"],
                examenes: ["Perfil lipídico", "Prueba de función cardíaca"],
                vacunas: [{
                        nombre: "Vacuna contra la neumonía",
                        cantidad: 1
                    },
                    {
                        nombre: "Vacuna contra la influenza",
                        cantidad: 1
                    }
                ],
                insumos: [{
                        nombre: "Electrodos",
                        cantidad: 8
                    },
                    {
                        nombre: "Cable de ECG",
                        cantidad: 6
                    },
                    {
                        nombre: "Monitor de ECG",
                        cantidad: 3
                    },
                    {
                        nombre: "Gel para ecografía",
                        cantidad: 2
                    }
                ]
            }
        },
        {
            nombre: "Paquete Pediátrico",
            detalles: {
                relacion: "cups",
                medicamentos: [{
                        nombre: "Amoxicilina suspensión",
                        cantidad: 12
                    },
                    {
                        nombre: "Ibuprofeno pediátrico",
                        cantidad: 15
                    }
                ],
                procedimientos: ["001050 - Biopsia tumoral"],
                diagnosticos: [],
                examenes: ["Hemograma", "Análisis de sangre"],
                vacunas: [{
                        nombre: "Vacuna contra la hepatitis B",
                        cantidad: 2
                    },
                    {
                        nombre: "Vacuna contra la varicela",
                        cantidad: 3
                    }
                ],
                insumos: [{
                        nombre: "Termómetro",
                        cantidad: 6
                    },
                    {
                        nombre: "Estetoscopio",
                        cantidad: 4
                    },
                    {
                        nombre: "Jeringas",
                        cantidad: 10
                    }
                ]
            }
        },
        {
            nombre: "Paquete Diabetes",
            detalles: {
                relacion: "cups",
                medicamentos: [{
                        nombre: "Metformina",
                        cantidad: 25
                    },
                    {
                        nombre: "Insulina",
                        cantidad: 20
                    }
                ],
                procedimientos: ["001090 - Mastografía"],
                diagnosticos: [],
                examenes: ["Hemoglobina glicosilada", "Función renal", "Perfil lipídico"],
                vacunas: [{
                        nombre: "Vacuna contra la hepatitis B",
                        cantidad: 2
                    },
                    {
                        nombre: "Vacuna contra la influenza",
                        cantidad: 3
                    }
                ],
                insumos: [{
                        nombre: "Monitores de glucosa",
                        cantidad: 5
                    },
                    {
                        nombre: "Tiras reactivas",
                        cantidad: 10
                    },
                    {
                        nombre: "Jeringas para insulina",
                        cantidad: 7
                    }
                ]
            }
        }
    ];

    console.log(paquetes);


    function formatearDetalles(detalles) {
        let resultado = [];

        // Verificar si 'relacion' es 'cups' o 'cie11' y mostrar los detalles correspondientes
        if (detalles.relacion === "cie11") {
            resultado.push("<strong>Relacionado a CIE-11</strong>");
            if (detalles.diagnosticos && detalles.diagnosticos.length > 0) {
                resultado.push(`<strong>Diagnóstico:</strong> ${detalles.diagnosticos[0]}`);
            } else {
                resultado.push("<strong>Diagnóstico:</strong> No disponible.");
            }
        } else if (detalles.relacion === "cups") {
            resultado.push("<strong>Relacionado a CUPS</strong>");
            if (detalles.procedimientos && detalles.procedimientos.length > 0) {
                resultado.push(`<strong>Procedimiento:</strong> ${detalles.procedimientos[0]}`);
            } else {
                resultado.push("<strong>Procedimiento:</strong> No disponible.");
            }
        }

        // Mostrar los medicamentos con nombre y cantidad
        if (detalles.medicamentos && detalles.medicamentos.length > 0) {
            resultado.push("<strong>Medicamentos:</strong>");
            detalles.medicamentos.forEach(medicamento => {
                resultado.push(`${medicamento.nombre} - ${medicamento.cantidad} Unidades`);
            });
        }

        // // Mostrar los procedimientos si no están relacionados con CIE-11
        // if (detalles.procedimientos && detalles.procedimientos.length > 0 && detalles.relacion !== "cie11") {
        //     resultado.push("<strong>Procedimientos:</strong>");
        //     detalles.procedimientos.forEach(procedimiento => {
        //         resultado.push(procedimiento);
        //     });
        // }

        // // Mostrar los diagnósticos si no están relacionados con CUPS
        // if (detalles.diagnosticos && detalles.diagnosticos.length > 0 && detalles.relacion !== "cups") {
        //     resultado.push("<strong>Diagnósticos:</strong>");
        //     detalles.diagnosticos.forEach(diagnostico => {
        //         resultado.push(diagnostico);
        //     });
        // }

        // Mostrar los exámenes
        if (detalles.examenes && detalles.examenes.length > 0) {
            resultado.push("<strong>Exámenes:</strong>");
            detalles.examenes.forEach(examen => {
                resultado.push(examen);
            });
        }

        // Mostrar las vacunas con nombre y cantidad
        if (detalles.vacunas && detalles.vacunas.length > 0) {
            resultado.push("<strong>Vacunas:</strong>");
            detalles.vacunas.forEach(vacuna => {
                resultado.push(`${vacuna.nombre} - ${vacuna.cantidad} Unidades`);
            });
        }

        // Mostrar los insumos con nombre y cantidad
        if (detalles.insumos && detalles.insumos.length > 0) {
            resultado.push("<strong>Insumos:</strong>");
            detalles.insumos.forEach(insumo => {
                resultado.push(`${insumo.nombre} - ${insumo.cantidad} Unidades`);
            });
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
            <td class="align-middle">${formatearDetalles(paquete.detalles)}</td>
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
            document.getElementById('nombrePaqueteEditar').value = paquete.nombre;
            document.getElementById('selectCupsCieEditar').value = paquete.detalles.relacion;
            if (paquete.detalles.relacion === "cie11") {
                document.getElementById('divCieEditar').style.display = "block";
                document.getElementById('divCupsEditar').style.display = "none";
                let cie11 = paquete.detalles.diagnosticos[0];
                let codigoCie = cie11.match(/^([^ -]+)/)[0]; 
                document.getElementById('selectCieEditar').value = codigoCie;
            }
            if (paquete.detalles.relacion === "cups") {
                document.getElementById('divCupsEditar').style.display = "block";
                document.getElementById('divCieEditar').style.display = "none";
                let cups = paquete.detalles.procedimientos[0];

                let codigoCups = cups.match(/^([^ -]+)/)[0]; 

                document.getElementById('selectCupsEditar').value = codigoCups;

                // console.log(codigoCups); 

            }

            // Almacenar el paquete completo en un atributo de datos del modal
            document.getElementById('modalEditarPaquetePrueba').dataset.paqueteActual = JSON.stringify(paquete);

            $('#modalEditarPaquetePrueba').modal('show');
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
</script> -->


<?php include "../footer.php";
// include "./modalAgregarPaquete.php";
include "./modalAgregarPaquetes.php";
// include "./modalEditarPaquete.php";
include "./editarPaquete.php";
?>