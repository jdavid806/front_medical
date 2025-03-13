<div class="modal fade" id="solicitudInsumoProcedimiento" tabindex="-1" aria-labelledby="solicitudInsumoProcedimientoLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="solicitudInsumoProcedimientoLabel">Solicitud por procedimiento</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="requestForm">
                    <div class="mb-3" id="divPacientes" style="display: block;">
                        <label for="pacientes" class="form-label">Seleccionar paciente</label>
                        <select id="pacientes" class="form-select">
                        </select>
                    </div>
                    <div class="mb-3" id="divProcedimientos" style="display: none;">
                        <label for="procedimientos" class="form-label">Seleccionar procedimiento</label>
                        <select id="procedimientos" class="form-select">
                        </select>
                    </div>
                    <div class="mb-3" id="divPaquetes" style="display: none;">
                        <label for="paquetes" class="form-label">Seleccionar paquete</label>
                        <select id="paquetes" class="form-select">
                        </select>
                    </div>

                    <div class="mb-3">
                        <label for="observationsPro" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observationsPro"></textarea>
                    </div>
                    <button id="enviarSolicitudProc" type="button" class="btn btn-primary">Enviar Solicitud</button>
                </form>
            </div>
        </div>
    </div>
</div>


<!-- <script type="module">
    import { inventoryService } from "../../services/api/index.js";
    import { suppliesService } from "../../services/api/index.js";
    console.log("entro");
    document.addEventListener('DOMContentLoaded', function () {
        fetchProducts(); // Llama a la función para cargar los productos una vez el DOM esté listo
    });


    let selectedProducts = []; // Array para almacenar los productos seleccionados


    async function fetchProducts() {
        try {
            const response = await inventoryService.getAll();
            const products = response.data.filter(product => product.attributes.product_type_id == 6);

            console.log("Productos", products);

            const selectElement = document.getElementById("productSelect");

            // Limpiar el select antes de llenarlo
            selectElement.innerHTML = '<option value="">Seleccionar Producto</option>'; // Opcional: primera opción vacía

            // Agregar las opciones al select
            products.forEach(product => {
                const option = document.createElement("option");
                option.value = product.id;
                option.textContent = product.attributes.name; // Asumiendo que el nombre del producto está aquí
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error("Error al obtener productos:", error);
            showError("No se pudieron cargar los productos.");
        }
    }

    // Función para añadir productos seleccionados al listado
    document.getElementById("addInsumo").addEventListener("click", function () {
        const productId = document.getElementById("productSelect").value;
        const quantity = document.getElementById("quantity").value;

        if (productId && quantity > 0) {
            const selectedProduct = {
                product_id: productId,
                quantity: quantity
            };
            selectedProducts.push(selectedProduct);
            displaySelectedProducts();

            document.getElementById("productSelect").value = "";
            document.getElementById("quantity").value = 1;
        } else {
            alert("Por favor, selecciona un producto y cantidad válida.");
        }
    });

    // Función para mostrar los productos seleccionados
    function displaySelectedProducts() {
        const selectedProductsContainer = document.getElementById("selectedProducts");
        selectedProductsContainer.innerHTML = ""; // Limpiar la lista antes de mostrarla

        selectedProducts.forEach(product => {
            const productRow = document.createElement("div");
            productRow.classList.add("d-flex", "justify-content-between", "mb-2");

            const productText = document.createElement("span");
            productText.textContent = `Producto ID: ${product.product_id}, Cantidad: ${product.quantity}`;

            const removeButton = document.createElement("button");
            removeButton.classList.add("btn", "btn-sm", "btn-danger");
            removeButton.textContent = "Eliminar";
            removeButton.addEventListener("click", function () {
                removeProduct(product);
            });

            productRow.appendChild(productText);
            productRow.appendChild(removeButton);
            selectedProductsContainer.appendChild(productRow);
        });
    }

    // Función para eliminar un producto de la lista
    function removeProduct(product) {
        selectedProducts = selectedProducts.filter(p => p !== product);
        displaySelectedProducts();
    }

    // Al enviar el formulario, preparar los datos y enviarlos
    document.getElementById("requestForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const requestData = {
            status: "pendiente",
            delivery_date: null,
            observations: document.getElementById("observations").value,
            products: selectedProducts
        };

        suppliesService.storeSupply(requestData)
            .then(response => {
                console.log("Solicitud enviada con éxito", response);
                alert('Solicitud enviada con éxito');
                $('#solicitudInsumoAdmin').modal('hide');
            })
            .catch(error => {
                console.error("Error al enviar la solicitud:", error);
                alert('Hubo un error al enviar la solicitud');
            });
    });

    // Llamar a la función para llenar el select al cargar la página
    fetchProducts();


</script> -->

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

    let paquetes = [{
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

    function cargarOpcionesSelectPacientes() {
        const pacientes = [{
                id: 1,
                nombre: "Juan Pérez"
            },
            {
                id: 2,
                nombre: "María García"
            },
            {
                id: 3,
                nombre: "Carlos Sánchez"
            },
            {
                id: 4,
                nombre: "Ana Martínez"
            },
            {
                id: 5,
                nombre: "Luis Rodríguez"
            },
            {
                id: 6,
                nombre: "Pedro Gómez"
            },
            {
                id: 7,
                nombre: "Laura Díaz"
            },
            {
                id: 8,
                nombre: "Raúl Fernández"
            },
            {
                id: 9,
                nombre: "Sofía López"
            },
            {
                id: 10,
                nombre: "Miguel Hernández"
            }
        ];


        const selectElement = document.getElementById('pacientes');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        pacientes.forEach((paciente) => {
            const option = document.createElement('option');
            option.value = paciente.id;
            option.textContent = paciente.nombre;
            selectElement.appendChild(option);
        });
    }

    function cargarOpcionesSelectProcedimientos() {
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


        const selectElement = document.getElementById('procedimientos');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        procedimientos.forEach((procedimiento) => {
            const option = document.createElement('option');
            option.value = procedimiento.codigo;
            option.textContent = `${procedimiento.codigo} - ${procedimiento.nombre}`;
            selectElement.appendChild(option);
        });
    }

    function cargarOpcionesSelectPaquetes() {

        const selectElement = document.getElementById('paquetes');

        selectElement.innerHTML = '';

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        paquetes.forEach((paquete) => {
            const option = document.createElement('option');
            option.value = paquete.nombre;
            option.textContent = paquete.nombre;
            selectElement.appendChild(option);
        });
    }

    cargarOpcionesSelectPacientes();
    cargarOpcionesSelectProcedimientos();
    cargarOpcionesSelectPaquetes();

    function contorlarVistaProcedimientos() {
        const selecPacientes = document.getElementById('pacientes');
        const divProcedimientos = document.getElementById('divProcedimientos');
        selecPacientes.addEventListener("change", function() {
            if (this.value && this.value !== "") {
                divProcedimientos.style.display = "block";
            } else {
                divProcedimientos.style.display = "none";
            }
        });
    }

    function contorlarVistaPaquetes() {
        const selecProcedimientos = document.getElementById('procedimientos');
        const divPaquetes = document.getElementById('divPaquetes');
        selecProcedimientos.addEventListener("change", function() {
            if (this.value && this.value !== "") {
                divPaquetes.style.display = "block";
            } else {
                divPaquetes.style.display = "none";
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        contorlarVistaProcedimientos();
        contorlarVistaPaquetes();
    });

    function capturarDatosProcedimiento() {
        const selectPacientes = document.getElementById('pacientes');
        const selectProcedimientos = document.getElementById('procedimientos');
        const selectPaquetes = document.getElementById('paquetes');
        const observationsPro = document.getElementById('observationsPro');

        // Capturar los valores seleccionados
        const pacienteSeleccionado = selectPacientes.options[selectPacientes.selectedIndex]?.text || "No seleccionado";
        const pacienteId = selectPacientes.value || "No seleccionado";

        const procedimientoSeleccionado = selectProcedimientos.options[selectProcedimientos.selectedIndex]?.text || "No seleccionado";
        const procedimientoId = selectProcedimientos.value || "No seleccionado";

        const paqueteSeleccionado = selectPaquetes.options[selectPaquetes.selectedIndex]?.text || "No seleccionado";
        const paqueteId = selectPaquetes.value || "No seleccionado";

        const observaciones = observationsPro.value || "Sin observaciones";

        let paqueteInfo = null;
        for (let i = 0; i < paquetes.length; i++) {
            if (paquetes[i].nombre === paqueteSeleccionado) {
                paqueteInfo = paquetes[i];
                break;
            }
        }

        const datosProcedimiento = {
            paciente: {
                id: pacienteId,
                nombre: pacienteSeleccionado
            },
            procedimiento: {
                id: procedimientoId,
                nombre: procedimientoSeleccionado
            },
            paquete: {
                id: paqueteId,
                nombre: paqueteSeleccionado,
                tieneMedicamentos: paqueteInfo ? paqueteInfo.detalles.medicamentos.length > 0 : false,
                tieneInsumos: paqueteInfo ? paqueteInfo.detalles.insumos.length > 0 : false,
                tieneVacunas: paqueteInfo ? paqueteInfo.detalles.vacunas.length > 0 : false,
                detalles: paqueteInfo ? paqueteInfo.detalles : null
            },
            observaciones: observaciones,
            fechaCaptura: new Date().toISOString()
        };

        console.log("Datos del procedimiento capturados:", datosProcedimiento);

        // Crear contenido HTML para mostrar solo medicamentos, insumos y vacunas
        let detallesHtml = '<div class="text-left">';

        // Agregar información básica
        detallesHtml += `
        <p><strong>Paciente:</strong> ${pacienteSeleccionado}</p>
        <p><strong>Procedimiento:</strong> ${procedimientoSeleccionado}</p>
        <p><strong>Paquete:</strong> ${paqueteSeleccionado}</p>
        <p><strong>Observaciones:</strong> ${observaciones}</p>
        <hr>
    `;

        if (paqueteInfo) {
            let tieneElementos = false;

            // Medicamentos
            if (paqueteInfo.detalles.medicamentos.length > 0) {
                tieneElementos = true;
                detallesHtml += '<h5 class="mt-3">Medicamentos:</h5><ul>';
                paqueteInfo.detalles.medicamentos.forEach(med => {
                    detallesHtml += `<li>${med.nombre} (${med.cantidad} unidades)</li>`;
                });
                detallesHtml += '</ul>';
            }

            // Insumos
            if (paqueteInfo.detalles.insumos.length > 0) {
                tieneElementos = true;
                detallesHtml += '<h5 class="mt-3">Insumos:</h5><ul>';
                paqueteInfo.detalles.insumos.forEach(ins => {
                    detallesHtml += `<li>${ins.nombre} (${ins.cantidad} unidades)</li>`;
                });
                detallesHtml += '</ul>';
            }

            // Vacunas
            if (paqueteInfo.detalles.vacunas.length > 0) {
                tieneElementos = true;
                detallesHtml += '<h5 class="mt-3">Vacunas:</h5><ul>';
                paqueteInfo.detalles.vacunas.forEach(vac => {
                    detallesHtml += `<li>${vac.nombre} (${vac.cantidad} unidades)</li>`;
                });
                detallesHtml += '</ul>';
            }

            if (!tieneElementos) {
                detallesHtml += '<p><em>Este paquete no contiene medicamentos, insumos o vacunas.</em></p>';
            }
        } else {
            detallesHtml += '<p><em>No se encontraron detalles del paquete seleccionado.</em></p>';
        }

        detallesHtml += '</div>';

        Swal.fire({
            title: 'Resumen solicitud',
            html: detallesHtml,
            icon: 'info',
            confirmButtonColor: '#132030', 
            confirmButtonText: 'Enviar',
            width: '600px'
        }).then((result) => {
            if (result.isConfirmed) {
                console.log("Resumen de solicitud enviada:", {
                    paciente: pacienteSeleccionado,
                    procedimiento: procedimientoSeleccionado,
                    paquete: paqueteSeleccionado,
                    medicamentos: paqueteInfo?.detalles.medicamentos || [],
                    insumos: paqueteInfo?.detalles.insumos || [],
                    vacunas: paqueteInfo?.detalles.vacunas || []
                });

                Swal.fire({
                    title: '¡Enviado!',
                    text: 'La solicitud ha sido enviada correctamente.',
                    icon: 'success',
                    confirmButtonColor: '#132030',
                    confirmButtonText: 'Aceptar'
                }).then((resul) => {
                    if (resul.isConfirmed) {
                        window.location.reload();
                    }
                });
            }
        });

        return datosProcedimiento;
    }

    document.getElementById('enviarSolicitudProc').addEventListener("click", capturarDatosProcedimiento);
</script>