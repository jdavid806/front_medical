<div class="modal fade" id="modalHerramientasIA" tabindex="-1" aria-labelledby="modalHerramientasIA" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="modalHerramientasIALabel">Herramientas IA</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Generar con IA</h4>
                        <button class="btn btn-primary" id="generarTodoBtn">Generar</button>
                        <div class="mt-3" id="loaderIA" style="display: none;">
                            <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-3" id="resumenHistoriaCard" style="display: none;">
                    <div class="card-body" id="bodyResumenHistoria">
                        <div id="contenidoResumenHistoria"></div>
                        <div class="text-end mt-3">
                            <button class="btn btn-primary btn-sm" id="generarResumenBtn" style="display: none;">
                                <i class="fas fa-sync"></i> Regenerar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card mt-3" id="sugerenciaDiagnosticoCard" style="display: none;">
                    <div class="card-body" id="bodySugerenciaDiagnostico">
                        <div id="contenidoSugerenciaDiagnostico"></div>
                        <div class="text-end mt-3">
                            <button class="btn btn-primary btn-sm" id="generarDiagnosticoBtn" style="display: none;">
                                <i class="fas fa-sync"></i> Regenerar
                            </button>
                        </div>
                    </div>
                </div>

                <div class="card mt-3" id="sugerenciaTratamientoCard" style="display: none;">
                    <div class="card-body" id="bodySugerenciaTratamiento">
                        <div id="contenidoSugerenciaTratamiento"></div>
                        <div class="text-end mt-3">
                            <button class="btn btn-primary btn-sm" id="generarTratamientoBtn" style="display: none;">
                                <i class="fas fa-sync"></i> Regenerar
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <div class="modal-footer">
                <button class="btn btn-primary" id="aprobarBtn" type="button">Aprobar</button>
            </div>
        </div>
    </div>
</div>

<script type="module">
    const generarResumenBtn = document.getElementById("generarResumenBtn");
    const generarDiagnosticoBtn = document.getElementById("generarDiagnosticoBtn");
    const generarTratamientoBtn = document.getElementById("generarTratamientoBtn");

    const resumenHistoriaCard = document.getElementById("resumenHistoriaCard");
    const sugerenciaDiagnosticoCard = document.getElementById("sugerenciaDiagnosticoCard");
    const sugerenciaTratamientoCard = document.getElementById("sugerenciaTratamientoCard");

    const contenidoResumenHistoria = document.getElementById("contenidoResumenHistoria");
    const contenidoSugerenciaDiagnostico = document.getElementById("contenidoSugerenciaDiagnostico");
    const contenidoSugerenciaTratamiento = document.getElementById("contenidoSugerenciaTratamiento");

    const loaderIA = document.getElementById("loaderIA");

    const cerrarModalHerramientasIA = document.getElementById("cerrarModalHerramientasIA");
    const aprobarBtn = document.getElementById("aprobarBtn");

    const generarTodoBtn = document.getElementById("generarTodoBtn");

    globalThis.responseIA = {};

    const params = new URLSearchParams(window.location.search);
    const jsonPath = `../../ConsultasJson/${params.get("tipo_historia")}.json`;
    const response = await fetch(jsonPath);
    const formData = await response.json();
    const especialidad = params.get("especialidad");
    const tipoHistoria = params.get("tipo_historia");
    const patientId = params.get("patient_id");
    // console.log("formData IA", formData);

    async function consultarDatosPaciente(pacienteID) {
        let dataPatient = await obtenerDatosPorId("patients", pacienteID);

        let nombre = [
            dataPatient.first_name,
            dataPatient.middle_name,
            dataPatient.last_name,
            dataPatient.second_last_name,
        ];

        // let nombrEntidad = dataPatient.social_security.entity.name;
        let nombrEntidad = "Desconocido";

        // console.log("dataPatient", dataPatient);
        return {
            nombre: unirTextos(nombre),
            documento: dataPatient.document_type + "-" + dataPatient.document_number || "Desconocido",
            edad: calcularEdad(dataPatient.date_of_birth) || "Desconocido",
            genero: traducirGenero(dataPatient.gender) || "Desconocido",
        };
    }

    let data = {
        especialidad: especialidad,
        tipoHistoria: tipoHistoria,
        request: "",
        data: "",
        patientData: await consultarDatosPaciente(patientId)
    }

    generarTodoBtn.addEventListener("click", () => {
        // Resetear visualización
        resumenHistoriaCard.style.display = "none";
        sugerenciaDiagnosticoCard.style.display = "none";
        sugerenciaTratamientoCard.style.display = "none";

        // Ocultar botones de regenerar inicialmente
        generarResumenBtn.style.display = 'none';
        generarDiagnosticoBtn.style.display = 'none';
        generarTratamientoBtn.style.display = 'none';

        // Limpiar contenido previo
        contenidoResumenHistoria.innerHTML = '';
        contenidoSugerenciaDiagnostico.innerHTML = '';
        contenidoSugerenciaTratamiento.innerHTML = '';

        // Mostrar loader y deshabilitar botón
        loaderIA.style.display = "block";
        generarTodoBtn.disabled = true;

        // Preparar datos
        data.request = "Generar todo";
        data.data = captureFormValues(formData.form1);

        // Realizar la petición
        fetch("https://hooks.medicalsoft.ai/webhook/herramientasia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) throw new Error("Error en la respuesta");
                return res.json();
            })
            .then(dataRespuesta => {
                console.log("Respuesta del servidor:", dataRespuesta);
                // Ocultar loader y habilitar botón
                loaderIA.style.display = "none";
                generarTodoBtn.disabled = false;

                // Guardar la respuesta
                responseIA = dataRespuesta;
                console.log("Respuesta guardada:", responseIA);

                // Mostrar las cards
                resumenHistoriaCard.style.display = "block";
                sugerenciaDiagnosticoCard.style.display = "block";
                sugerenciaTratamientoCard.style.display = "block";

                // Procesar y mostrar el resumen de historia
                const resumen = typeof dataRespuesta.resumenHistoria === 'string' ?
                    dataRespuesta.resumenHistoria.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.resumenHistoria, null, 2);

                contenidoResumenHistoria.innerHTML = `
                <div>
                    <h4 style="margin: 0 0 5px 0;">Resumen de historia</h4>
                    <p>${resumen}</p>
                </div>`;

                // Mostrar botón de regenerar
                generarResumenBtn.style.display = 'block';

                // Procesar y mostrar diagnóstico sugerido
                const diagnostico = typeof dataRespuesta.diagnosticoSugerido.diagnostico === 'string' ?
                    dataRespuesta.diagnosticoSugerido.diagnostico.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.diagnosticoSugerido.diagnostico, null, 2);

                const detalles = typeof dataRespuesta.diagnosticoSugerido.detalles === 'string' ?
                    dataRespuesta.diagnosticoSugerido.detalles.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.diagnosticoSugerido.detalles, null, 2);

                contenidoSugerenciaDiagnostico.innerHTML = `
                <div>
                    <h5 style="margin: 5px 0;">Diagnóstico sugerido</h5>
                    <p>${diagnostico}</p>
                    <h5 style="margin: 5px 0;">Detalles</h5>
                    <p>${detalles}</p>
                </div>`;

                // Mostrar botón de regenerar
                generarDiagnosticoBtn.style.display = 'block';

                // Procesar y mostrar tratamiento sugerido
                let htmlContentTratamiento = `
                <div>
                    <h5>Tratamiento sugerido</h5>
                    <p>${dataRespuesta.tratamientoSugerido.tratamiento.replace(/^"|"$/g, '')}</p>
                </div>`;

                if (dataRespuesta.tratamientoSugerido.posiblesExamenes && dataRespuesta.tratamientoSugerido
                    .posiblesExamenes.length > 0) {
                    htmlContentTratamiento += `
                    <div>
                        <h5>Exámenes recomendados</h5>
                        <ul style="margin: 0; padding-left: 20px;">`;

                    dataRespuesta.tratamientoSugerido.posiblesExamenes.forEach(examen => {
                        htmlContentTratamiento += `<li style="margin-bottom: 5px;">${examen}</li>`;
                    });

                    htmlContentTratamiento += `</ul></div>`;
                }

                if (dataRespuesta.tratamientoSugerido.medicacionSugerida && dataRespuesta.tratamientoSugerido
                    .medicacionSugerida.length > 0) {
                    htmlContentTratamiento += `
                    <div>
                        <h5>Medicación recomendada</h5>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 98%;">`;

                    dataRespuesta.tratamientoSugerido.medicacionSugerida.forEach(med => {
                        htmlContentTratamiento += `
                        <div style="border: 1px solid #e0e0e0; padding: 12px; border-radius: 8px;">
                            <p style="margin: 0 0 5px 0; font-weight: bold;">${med.nombre} ${med.concentracion}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Tipo:</strong> ${med.tipo}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Frecuencia:</strong> ${med.frecuencia}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Duración:</strong> ${med.duracion}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Duración:</strong> ${med.posologia}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Duración:</strong> ${med.cantidad}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Administración:</strong> ${med.tomar}</p>
                            <p style="margin: 0 0 3px 0;"><strong>Indicaciones:</strong> ${med.indicaciones}</p>
                        </div>`;
                    });

                    htmlContentTratamiento += `</div></div>`;
                }

                if (dataRespuesta.tratamientoSugerido.incapacidadSugerida && dataRespuesta.tratamientoSugerido
                    .incapacidadSugerida.aplica) {
                    htmlContentTratamiento += `
                    <div>
                        <h5>Incapacidad laboral</h5>
                            <p style="margin: 0 0 5px 0;"><strong>Días recomendados:</strong> ${dataRespuesta.tratamientoSugerido.incapacidadSugerida.dias}</p>
                            <p"><strong>Motivo:</strong> ${dataRespuesta.tratamientoSugerido.incapacidadSugerida.motivo}</p>
                    </div>`;
                }

                contenidoSugerenciaTratamiento.innerHTML = htmlContentTratamiento;

                // Mostrar botón de regenerar
                generarTratamientoBtn.style.display = 'block';
            })
            .catch(error => {
                console.error("Error:", error);
                loaderIA.style.display = "none";
                generarTodoBtn.disabled = false;

                const errorContainer = document.createElement('div');
                errorContainer.innerHTML = `
                <div style="color: red;">
                    Error: ${error.message}
                </div>`;

                contenidoResumenHistoria.appendChild(errorContainer);
                resumenHistoriaCard.style.display = "block";
            });
    });

    generarResumenBtn.addEventListener("click", () => {

        contenidoResumenHistoria.innerHTML += `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span>
                            </div>`;
        // console.log("generando resumen");
        generarResumenBtn.disabled = true;

        data.request = "Resumen de historia";
        data.data = captureFormValues(formData.form1);
        console.log("data resumen", data);

        fetch("https://hooks.medicalsoft.ai/webhook/resumen", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return res.json();
            })
            .then(dataRespuesta => {
                console.log("Respuesta del servidor:", dataRespuesta);

                generarResumenBtn.disabled = false;

                contenidoResumenHistoria.innerHTML = "";

                responseIA.resumenHistoria = dataRespuesta.resumenHistoria;

                const contenido = typeof dataRespuesta.resumenHistoria === 'string' ?
                    dataRespuesta.resumenHistoria.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.resumenHistoria, null, 2);

                contenidoResumenHistoria.innerHTML =
                    `<div>${contenido}</div>`;

            })
            .catch(error => {
                console.error("Error:", error);

                const errorContainer = document.createElement('div');
                errorContainer.id = 'contenidoResumenHistoria';
                errorContainer.innerHTML =
                    `<div color: red;">Error: ${error.message}</div>`;
                contenidoResumenHistoria.appendChild(errorContainer);
            });
    });

    generarDiagnosticoBtn.addEventListener("click", () => {
        contenidoSugerenciaDiagnostico.innerHTML += `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span>
                            </div>`;
        console.log("generando diagnostico");
        generarDiagnosticoBtn.disabled = true;

        data.request = "Sugerencia diagnostico";
        data.data = captureFormValues(formData.form1);
        console.log("data diagnostico", data);

        fetch("https://hooks.medicalsoft.ai/webhook/diagnostico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return res.json();
            })
            .then(dataRespuesta => {
                console.log("Respuesta del servidor:", dataRespuesta);
                generarDiagnosticoBtn.disabled = false;

                contenidoSugerenciaDiagnostico.innerHTML = "";

                responseIA.diagnosticoSugerido = dataRespuesta.diagnosticoSugerido;

                const diagnostico = typeof dataRespuesta.diagnosticoSugerido === 'string' ?
                    dataRespuesta.diagnosticoSugerido.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.diagnosticoSugerido, null, 2);

                const detalles = typeof dataRespuesta.detalles === 'string' ?
                    dataRespuesta.detalles.replace(/^"|"$/g, '') :
                    JSON.stringify(dataRespuesta.detalles, null, 2);

                contenidoSugerenciaDiagnostico.innerHTML =
                    `<div><h5>Diagnóstico sugerido</h5>${diagnostico}</div>
                    <div><h5>Detalles</h5>${detalles}</div>`;
            })
            .catch(error => {
                console.error("Error:", error);

                const errorContainer = document.createElement('div');
                errorContainer.id = 'contenidoSugerenciaDiagnostico';
                errorContainer.innerHTML =
                    `<div style="color: red;">Error: ${error.message}</div>`;
                contenidoSugerenciaDiagnostico.appendChild(errorContainer);
            });
    })

    generarTratamientoBtn.addEventListener("click", () => {
        contenidoSugerenciaTratamiento.innerHTML +=
            `<div class="spinner-border mt-3" role="status"><span class="visually-hidden">Loading...</span></div>`
        generarTratamientoBtn.disabled = true;

        data.request = "Generar tratamiento";
        data.data = captureFormValues(formData.form1);

        fetch("https://hooks.medicalsoft.ai/webhook/tratamiento", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error("Error en la respuesta del servidor");
                }
                return res.json();
            })
            .then(dataRespuesta => {
                console.log("Respuesta del servidor:", dataRespuesta);

                generarTratamientoBtn.disabled = false;

                contenidoSugerenciaTratamiento.innerHTML = "";

                responseIA.tratamientoSugerido = dataRespuesta.tratamientoSugerido;

                let htmlContent =
                    `<div><h5>Tratamiento: </h5><p>${dataRespuesta.planTratamientoEstructurado
                    .tratamientoSugerido.replace(/^"|"$/g, '')}</p></div>`;

                if (dataRespuesta.planTratamientoEstructurado
                    .posiblesExamenes && dataRespuesta.planTratamientoEstructurado
                    .posiblesExamenes.length > 0) {
                    htmlContent += `<div><h5>Exámenes recomendados: </h5>
                    <ul style="margin: 0; padding-left: 20px;"></ul></div>`;

                    dataRespuesta.planTratamientoEstructurado
                        .posiblesExamenes.forEach(examen => {
                            htmlContent += `<li style="margin-bottom: 5px;">${examen}</li>`;
                        });

                    htmlContent += `</ul></div>`;
                }

                if (dataRespuesta.planTratamientoEstructurado
                    .medicacionSugerida && dataRespuesta.planTratamientoEstructurado
                    .medicacionSugerida.length > 0) {
                    htmlContent += `
                    <div style="margin: 0 0 20px 25px;">
                    <h5>Medicación recomendada</h5>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; width: 98%;">`;

                    dataRespuesta.planTratamientoEstructurado
                        .medicacionSugerida.forEach(med => {
                            htmlContent += `
                    <div class="mb-3" style="border: 1px solid #e0e0e0; padding: 12px; border-radius: 8px;">
                        <p style="margin: 0 0 5px 0; font-weight: bold;">${med.nombre} ${med.concentracion}</p>
                        <p style="margin: 0 0 3px 0;"><strong>Tipo:</strong> ${med.tipo}</p>
                        <p style="margin: 0 0 3px 0;"><strong>Frecuencia:</strong> ${med.frecuencia}</p>
                        <p style="margin: 0 0 3px 0;"><strong>Duración:</strong> ${med.duracion}</p>
                        <p style="margin: 0 0 3px 0;"><strong>Administración:</strong> ${med.tomar}</p>
                        <p style="margin: 0 0 3px 0;"><strong>Indicaciones:</strong> ${med.indicaciones}</p>
                    </div>`;
                        });

                    htmlContent += `</div></div>`;
                }

                if (dataRespuesta.planTratamientoEstructurado
                    .incapacidadSugerida && dataRespuesta.planTratamientoEstructurado
                    .incapacidadSugerida.aplica) {
                    htmlContent += `
                <div style="margin: 0 0 20px 25px;">
                    <h5>Incapacidad laboral</h5>
                        <p style="margin: 0 0 5px 0;"><strong>Días recomendados:</strong> ${dataRespuesta.planTratamientoEstructurado
.incapacidadSugerida.dias}</p>
                        <p"><strong>Motivo:</strong> ${dataRespuesta.planTratamientoEstructurado
.incapacidadSugerida.motivo}</p>
                </div>`;
                }

                contenidoSugerenciaTratamiento.innerHTML = htmlContent;
            })
            .catch(error => {
                console.error("Error:", error);

                const errorContainer = document.createElement('div');
                errorContainer.innerHTML =
                    `<div style="margin: 0 0 10px 25px; color: red;">Error: ${error.message}</div>`;
                sugerenciaTratamiento.appendChild(errorContainer);
            });
    })

    async function agregarMedicamentos() {
        if (responseIA.tratamientoSugerido &&
            responseIA.tratamientoSugerido.medicacionSugerida &&
            Array.isArray(responseIA.tratamientoSugerido.medicacionSugerida)) {

            console.log("Iniciando proceso de agregar medicamentos...");

            // 1. Click en "Agregar Receta" (solo una vez)
            document.getElementById("btnAgregarReceta").click();
            console.log("Botón 'Agregar Receta' presionado");

            // Espera generosa para que el formulario esté completamente listo
            await new Promise(resolve => setTimeout(resolve, 800));

            // 2. Procesar cada medicamento con tiempos de espera adecuados
            for (const [index, medicamento] of responseIA.tratamientoSugerido.medicacionSugerida.entries()) {
                console.log(`Procesando medicamento ${index + 1}: ${medicamento.nombre || 'Sin nombre'}`);

                // Llenar campos con espera entre cada campo (opcional)
                document.getElementById("medication").value = medicamento.nombre || "";
                await new Promise(resolve => setTimeout(resolve, 200));

                document.getElementById("concentration").value = medicamento.concentracion || "";
                await new Promise(resolve => setTimeout(resolve, 200));

                document.getElementById("frequency").value = medicamento.frecuencia || "";
                await new Promise(resolve => setTimeout(resolve, 200));

                document.getElementById("duration").value = medicamento.duracion || "";
                await new Promise(resolve => setTimeout(resolve, 200));

                document.getElementById("observations").value = medicamento.indicaciones || "";
                await new Promise(resolve => setTimeout(resolve, 200));

                console.log("Campos llenados correctamente");

                // Espera adicional antes de agregar el medicamento
                await new Promise(resolve => setTimeout(resolve, 500));

                // Click en "Agregar Medicamento"
                document.getElementById("addMedicineBtn").click();
                console.log("Botón 'Agregar Medicamento' presionado");

                // Espera generosa antes del siguiente medicamento
                if (index < responseIA.tratamientoSugerido.medicacionSugerida.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            console.log("Proceso de agregar medicamentos completado");
        } else {
            console.warn("No se encontraron datos de medicación sugerida");
        }
    }

    function agregarIncapacidad() {
        const incapacidad = responseIA?.tratamientoSugerido?.incapacidadSugerida;

        if (incapacidad && incapacidad.aplica === true) {
            document.getElementById("btnAgregarIncapacidad").click();
            document.getElementById("dias").value = incapacidad.dias;
            document.getElementById("reason").value = incapacidad.motivo;
        }
    }


    aprobarBtn.addEventListener('click', () => {
        // Ejecutar las acciones primero
        agregarIncapacidad();
        const planTratamiento = tinymce.get("motivo");
        planTratamiento.setContent(responseIA.tratamientoSugerido.tratamiento || "");
        responseIA.aprobar = true;

        // Mostrar mensaje de éxito
        Swal.fire({
            title: "Completado",
            text: "Se ha aprobado correctamente",
            icon: "success",
            confirmButtonText: "Aceptar"
        }).then(() => {
            // Cerrar el modal
            $('#modalHerramientasIA').modal('hide');
        })
    });

    function captureFormValues(formData) {
        const formValues = {
            values: {}
        };

        formData.tabs.forEach((tab) => {
            Object.keys(tab).forEach((key) => {
                if (key.startsWith('card') && Array.isArray(tab[key])) {
                    tab[key].forEach((card) => {
                        if (card.fields && Array.isArray(card.fields)) {
                            card.fields.forEach((field) => {
                                // Caso para checkbox (solo si está marcado)
                                if (field.type === "checkbox") {
                                    const checkbox = document.getElementById(field.id);
                                    if (checkbox && checkbox.checked) {
                                        formValues.values[field.name] = true;

                                        // Manejar campos toggle solo si el checkbox está marcado
                                        if (field.toggleFields) {
                                            field.toggleFields.forEach((toggleField) => {
                                                // Toggle de tipo select
                                                if (toggleField.type === "select") {
                                                    const select = document
                                                        .getElementById(toggleField
                                                            .id);
                                                    if (select && select.value) {
                                                        formValues.values[
                                                                toggleField.name] =
                                                            select.value;
                                                    }
                                                }
                                                // Toggle de tipo textarea (TinyMCE)
                                                else if (toggleField.type ===
                                                    "textarea") {
                                                    const editor = tinymce.get(
                                                        toggleField.id);
                                                    if (editor) {
                                                        const content = editor
                                                            .getContent();
                                                        if (content && content
                                                            .trim() !== '') {
                                                            formValues.values[
                                                                toggleField.name
                                                            ] = content;
                                                        }
                                                    }
                                                }
                                                // Toggle de tipo radio
                                                else if (toggleField.type ===
                                                    "radio") {
                                                    const selectedRadio = document
                                                        .querySelector(
                                                            `input[name="${toggleField.name}"]:checked`
                                                        );
                                                    if (selectedRadio) {
                                                        const selectedOption =
                                                            toggleField.options
                                                            ?.find(
                                                                opt => opt.value ===
                                                                selectedRadio.value
                                                            );
                                                        formValues.values[
                                                            toggleField.name
                                                        ] = {
                                                            value: selectedRadio
                                                                .value,
                                                            text: selectedOption
                                                                ?.text || ''
                                                        };
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }
                                // Caso para radio (solo si hay selección)
                                else if (field.type === "radio") {
                                    const selectedRadio = document.querySelector(
                                        `input[name="${field.name}"]:checked`
                                    );
                                    if (selectedRadio) {
                                        const selectedOption = field.options?.find(
                                            opt => opt.value === selectedRadio.value
                                        );
                                        formValues.values[field.name] = {
                                            value: selectedRadio.value,
                                            text: selectedOption?.text || ''
                                        };
                                    }
                                }
                                // Otros tipos de campos (solo si tienen valor)
                                else {
                                    const element = document.getElementById(field.id);
                                    if (element && element.value && element.value.trim() !==
                                        '') {
                                        formValues.values[field.name] = element.value;
                                    }

                                    // Capturar contenido de TinyMCE (solo si tiene contenido)
                                    const editor = tinymce.get(field.id);
                                    if (editor) {
                                        const content = editor.getContent();
                                        if (content && content.trim() !== '') {
                                            formValues.values[field.name] = content;
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            });
        });

        return formValues;
    }
</script>