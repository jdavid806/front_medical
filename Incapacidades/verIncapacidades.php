<?php
include "../menu.php";
include "../header.php";

?>

<style>
    .custom-btn {
        width: 150px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
    }

    .custom-btn i {
        margin-right: 5px;
    }
</style>

<div class="content">
    <div class="container-small">
        <nav class="mb-3" aria-label="breadcrumb">
            <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item"><a href="Dashboard">Inicio</a></li>
                <li class="breadcrumb-item"><a href="pacientes">Pacientes</a></li>
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Incapacidades</li>
            </ol>
        </nav>

        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 class="mb-0">Incapacidades</h2>
                        <small class="patientName">Cargando...</small>
                    </div>
                    <!-- <button id="btnModalCrearIncapacidad" type="button" class="btn btn-primary">
            <i class="fa-solid fa-plus me-2"></i>Nueva incapacidad
          </button> -->
                </div>
            </div>
        </div>

        <div class="row mt-4">

            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>Desde</th>
                        <th>Hasta</th>
                        <th>Días de incapacidad</th>
                        <th>Registrado por</th>
                        <th>Motivo</th>
                        <th class="text-end">Acciones</th>
                    </tr>
                </thead>
                <tbody class="list" id="tableIncapacidades">
                </tbody>
            </table>
        </div>

    </div>

    <?php
    include './modalIncapacidad.php'
    ?>

    <template id="templateIncapacidad">
        <tr>
            <td class="desde align-middle"></td>
            <td class="hasta align-middle"></td>
            <td class="dias-incapacidad align-middle"></td>
            <td class="registrado-por align-middle"></td>
            <td class="comentarios align-middle"></td>
            <td class="text-end align-middle">
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                        aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                    </button>
                    <ul class="dropdown-menu" style="z-index: 10000;">
                        <li>
                            <a class="dropdown-item" href="#" id="btnModalEditarIncapacidad"
                                onclick="editarIncapacidad()">
                                <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-pen" style="width: 20px;"></i>
                                    <span>Editar</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" id="btnModalEliminarIncapacidad"
                                onclick="eliminarIncapacidad()">
                                <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-trash" style="width: 20px;"></i>
                                    <span>Eliminar</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" id="btnImpimirIncapacidad"
                                onclick="imprimirIncapacidad()">
                                <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-print" style="width: 20px;"></i>
                                    <span>Imprimir</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#" id="btnDescargarIncapacidad"
                                onclick="descargarIncapacidad()">
                                <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-download" style="width: 20px;"></i>
                                    <span>Descargar</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li class="dropdown-header">Compartir</li>
                        <li>
                            <a class="dropdown-item" href="#" id="btnCWIncapacidad" onclick="compartirIncapacidad()">
                                <div class=" d-flex gap-2 align-items-center">
                                    <i class="fa-brands fa-whatsapp" style="width: 20px;"></i>
                                    <span>Compartir por Whatsapp</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="#">
                                <div class="d-flex gap-2 align-items-center">
                                    <i class="fa-solid fa-envelope" style="width: 20px;"></i>
                                    <span>Compartir por Correo</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
            </td>
        </tr>
    </template>

    <script type="module">
        import {
            patientDisabilityService,
            patientService,
            templateService,
            infoCompanyService
        } from "../services/api/index.js";
        import {
            formatDate,
            calcularDiasEntreFechas,
            rellenarFormularioConObjeto,
            formatWhatsAppMessage,
            getIndicativeByCountry,
            calculateDaysBetweenDates
        } from "../services/utilidades.js";

        import {
            createMassMessaging
        } from '../funciones/funcionesJS/massMessage.js';

        import {
            SwalManager
        } from '../services/alertManagerImported.js'

        let templateDisability = null;
        let infoInstance = null;
        let messaging = null;
        document.addEventListener('DOMContentLoaded', async () => {
            const tenant = window.location.hostname.split(".")[0];
            const data = {
                tenantId: tenant,
                belongsTo: "incapacidades-compartir",
                type: "whatsapp",
            };
            const companies = await infoCompanyService.getCompany();
            const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
            templateDisability = await templateService.getTemplate(data);
            infoInstance = {
                api_key: communications.api_key,
                instance: communications.instance
            }
            messaging = createMassMessaging(infoInstance);
        });


        function agregarIncapacidad() {
            $("#modalCrearIncapacidadLabel").html(`Nueva Incapacidad`);
            $("#accionModalCrearIncapacidad").val('crear');
            $("#modalCrearIncapacidad").modal('show');
        }

        function editarIncapacidad(incapacidad) {
            $("#modalCrearIncapacidadLabel").html(`Editar Incapacidad`);

            rellenarFormularioConObjeto(incapacidad)
            $("#dias").val(calcularDiasEntreFechas(
                new Date(incapacidad.start_date),
                new Date(incapacidad.end_date)
            ) + 1);

            $("#accionModalCrearIncapacidad").val('editar');
            $("#modalCrearIncapacidad").modal('show');
        }

        import {
            generatePDFFromHTML
        } from "../funciones/funcionesJS/exportPDF.js";
        import {
            generarFormato
        } from "../funciones/funcionesJS/generarPDF.js";

        // let company = {};
        // let patientData = {};
        // const patient_id = new URLSearchParams(window.location.search).get("patient_id");



        // async function consultarData() {
        //     const response = await consultarDatosEmpresa();
        //     const responePatient = await consultarDatosPaciente(patient_id);

        //     patientData = responePatient;
        //     // console.log(patientData);
        //     company = {
        //         legal_name: response.nombre_consultorio,
        //         document_number: response.datos_consultorio[0].RNC,
        //         address: response.datos_consultorio[1].Dirección,
        //         phone: response.datos_consultorio[2].Teléfono,
        //         email: response.datos_consultorio[3].Correo,
        //     }
        // }

        // document.addEventListener('DOMContentLoaded', () => {
        //     consultarData();
        // })

        async function imprimirIncapacidad(incapacidad) {
            // console.log("incapacidad", incapacidad);
            // const user = await consultarDatosDoctor(incapacidad.user_id)
            // console.log("user", user);
            generarFormato("Incapacidad", incapacidad, "Impresion");
        }

        function descargarIncapacidad(incapacidad) {
            generarFormato("Incapacidad", incapacidad, "Descarga");
            // const pdfConfig = {
            //     name: "Incapacidad_Médica",
            //     isDownload: true
            // };

            // const html = `
            //     <div class="container p-2 border rounded shadow-sm">
            //         <h3 class="text-primary" style="margin-top: 0; margin-bottom: 5px;">Certificado de Incapacidad</h3>
            //         <hr style="margin: 0.25rem 0;">
            //         <div style="width: 100%; margin-bottom: 0">
            //             <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Desde:</strong> ${incapacidad.start_date}</p>
            //             <p style="display: inline-block; width: 49%; margin-bottom: 5px"><strong>Hasta:</strong> ${incapacidad.end_date}</p>
            //         </div>
            //         <div style="margin-top: 0;">
            //         <p style="margin: 0;"><strong>Motivo de Incapacidad: </strong> ${incapacidad.reason}</p>
            //         </div>
            //     </div>`;
            // generatePDFFromHTML(html, company, pdfConfig);
        }

        // async function imprimirIncapacidad(incapacidad) {
        //     crearDocumento(incapacidad, "Impresion", "Incapacidad", "Completa", "Incapacidad Médica");
        // }

        // async function descargarIncapacidad(incapacidad) {
        //     crearDocumento(incapacidad, "Descarga", "Incapacidad", "Completa", "Incapacidad Médica");
        // }

        async function generatePdfFile(disability) {
            //@ts-ignore
            generarFormato(
                "Incapacidad",
                disability,
                "Impresion",
                "patientDisability"
            );

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let fileInput = document.getElementById(
                        "pdf-input-hidden-to-patientDisability"
                    );
                    let file = fileInput?.files[0];

                    if (!file) {
                        resolve(null);
                        return;
                    }

                    let formData = new FormData();
                    formData.append("file", file);
                    formData.append("model_type", "App\\Models\\Disabilities");
                    formData.append("model_id", disability.id);
                    //@ts-ignore
                    guardarArchivo(formData, true)
                        .then((response) => {
                            resolve(response.file);
                        })
                        .catch(reject);
                }, 1500);
            });
        }

        async function compartirIncapacidad(disability) {
            const replacements = {
                NOMBRE_PACIENTE: `${disability?.patient?.first_name ?? ""} ${disability?.patient?.middle_name ?? ""
          } ${disability?.patient?.last_name ?? ""} ${disability?.patient?.second_last_name ?? ""
          }`,
                FECHA_INCAPACIDAD: `${ formatDate(disability?.creted_at, true)  ?? ""}`,
                ESPECIALIDAD: `${ disability?.user?.specialty?.name  ?? ""}`,
                ESPECIALISTA: `${disability?.user?.first_name ?? ""} ${disability?.user?.middle_name ?? ""
          } ${disability?.user?.last_name ?? ""} ${disability?.user?.second_last_name ?? ""
          }`,
                FECHA_INCIO: `${ formatDate(disability?.start_date, true)  ?? ""}`,
                FECHA_FIN: `${ formatDate(disability?.end_date, true)  ?? ""}`,
                DIAS_INCAPACIDAD: `${ calculateDaysBetweenDates(disability?.start_date, disability?.end_date)  ?? ""}`,
                RECOMENDACIONES: `${ disability?.reason  ?? ""}`,
            };
            const dataToFile = await generatePdfFile(disability);
            //@ts-ignore
            const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);

            const templateFormatted = formatWhatsAppMessage(
                templateDisability.data.template,
                replacements
            );

            const dataMessage = {
                channel: "whatsapp",
                recipients: [
                    getIndicativeByCountry(disability?.patient.country_id) +
                    disability?.patient.whatsapp,
                ],
                message: templateFormatted,
                message_type: "media",
                attachment_url: urlPDF,
                attachment_type: "document",
                minio_model_type: dataToFile?.model_type,
                minio_model_id: dataToFile?.model_id,
                minio_id: dataToFile?.id,
                webhook_url: "https://example.com/webhook",
            };
            messaging.sendMessage(dataMessage).then(() => {
                SwalManager.success({
                text: "Incapacidad compartida exitosamente.",
            });
            });
        }

        function eliminarIncapacidad(id) {

            Swal.fire({
                title: '¿Estás seguro?',
                text: "No podrás revertir esto.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    patientDisabilityService.delete(id)
                        .then(() => {
                            Swal.fire(
                                '¡Eliminado!',
                                'La incapacidad ha sido eliminada.',
                                'success'
                            );
                            window.location.reload();
                        });
                }
            });
        }

        //document.getElementById('btnModalCrearIncapacidad').addEventListener('click', agregarIncapacidad);

        const template = document.getElementById("templateIncapacidad");
        const table = document.getElementById("tableIncapacidades");
        const patientId = new URLSearchParams(window.location.search).get('patient_id');
        const incapacidadesPromise = patientDisabilityService.ofParent(patientId);
        const patientPromise = patientService.get(patientId);

        const [patient, incapacidades] = await Promise.all([patientPromise, incapacidadesPromise]);
        // globalThis = {
        //     usersData: null
        // }
        // const idsUsers = [...new Set(incapacidades.map(incapacidad => incapacidad.user_id))];
        // console.log("idsUsers", idsUsers);
        // Promise.all(idsUsers.map(id => consultarDatosDoctor(id)))
        //     .then(resultados => {
        //         console.log("Resultados de usuarios:", resultados);
        //         globalThis.usersData = resultados
        //         // console.log("usersData", usersData);
        //     })
        //     .catch(error => {
        //         console.error("Error consultando usuarios:", error);
        //     });
        document.querySelectorAll('.patientName').forEach(element => {
            element.textContent = `${patient.first_name} ${patient.last_name}`;
            if (element.tagName === 'A') {
                element.href = `verPaciente?id=${patient.id}`
            }
        })

        renderIncapacidades(incapacidades);

        function renderIncapacidades(incapacidades) {
            table.innerHTML = "";
            incapacidades.forEach(incapacidad => {
                const clone = template.content.cloneNode(true);

                const row = clone.querySelector('tr');
                const startDate = formatDate(incapacidad.start_date).split(',')[0]
                const endDate = formatDate(incapacidad.end_date).split(',')[0]

                clone.querySelector(".desde").textContent = startDate;
                clone.querySelector(".hasta").textContent = endDate;
                clone.querySelector(".dias-incapacidad").textContent = calcularDiasEntreFechas(
                    new Date(incapacidad.start_date),
                    new Date(incapacidad.end_date)
                ) + 1;
                clone.querySelector(".registrado-por").textContent =
                    `${incapacidad.user.first_name} ${incapacidad.user.middle_name} ${incapacidad.user.last_name} ${incapacidad.user.second_last_name}`;
                clone.querySelector(".comentarios").textContent = incapacidad.reason;

                clone.querySelector('#btnImpimirIncapacidad').onclick = () => imprimirIncapacidad(incapacidad);
                clone.querySelector('#btnDescargarIncapacidad').onclick = () => descargarIncapacidad(incapacidad);

                clone.querySelector('#btnCWIncapacidad').onclick = () => compartirIncapacidad(incapacidad);


                clone.querySelector('#btnModalEditarIncapacidad').onclick = () => editarIncapacidad(incapacidad);
                clone.querySelector('#btnModalEliminarIncapacidad').onclick = () => eliminarIncapacidad(incapacidad
                    .id);

                table.appendChild(clone);
            });
        }

        new DataTable('.table');
    </script>

    <script>
        // document.getElementById('btnModalCrearIncapacidad').addEventListener('click', function() {
        //   $("#modalCrearIncapacidadLabel").html(`Crear Incapacidad`);

        //   document.getElementById("formCrearIncapacidad").reset();
        //   checkRecurrencia(document.getElementById('recurrencia'))
        // })
    </script>

    <?php include "../footer.php"; ?>