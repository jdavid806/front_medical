<?php
include "../menu.php";
include "../header.php";
// include "./ModalNuevoExamen.php";
// include './modalCargarResultados.php';


$examenes = [
    'laboratorio' => [
        ['examenId' => 1, 'fecha' => '2024-11-20', 'tipo' => 'Hemograma', 'doctor' => 'Manuel Antonio Rosales', 'motivo' => 'Control General'],
        ['examenId' => 2, 'fecha' => '2024-11-21', 'tipo' => 'Química Sanguínea', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Chequeo'],
        ['examenId' => 3, 'fecha' => '2024-11-22', 'tipo' => 'Prueba de Función Hepática', 'doctor' => 'Carlos Ruiz', 'motivo' => 'Control Post-Operatorio'],
    ],
    'imagenologia' => [
        ['examenId' => 4, 'fecha' => '2024-11-29', 'tipo' => 'Radiografía de Tórax', 'doctor' => 'Diana Maria Fernandez', 'motivo' => 'Diagnóstico de Dolor Torácico'],
        ['examenId' => 5, 'fecha' => '2024-12-10', 'tipo' => 'Resonancia Magnética', 'doctor' => 'Carlos Ruiz', 'motivo' => 'Control Neurológico'],
    ],
];
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
                <li class="breadcrumb-item"><a href="verPaciente?1" class="patientName">Cargando...</a></li>
                <li class="breadcrumb-item"><a href="citasControl">Citas</a></li>
                <li class="breadcrumb-item active" onclick="location.reload()">Cargar resultados de examen</li>
            </ol>
        </nav>

        <h2 id="productName"></h2>
        <div id="examsAppReact"></div>
        <div>Tiempo en examen: <span id="timerReact"></span></div>
    </div>
    <?php include "../footer.php"; ?>
</div>

<script type="module">
    import React from "react"
    import ReactDOMClient from "react-dom/client"
    import {
        ExamResultsForm
    } from './react-dist/exams/components/ExamResultsForm.js';
    import {
        inventoryService,
        examResultService,
        examOrderService,
        examOrderStateService,
        patientService,
        appointmentService,
        templateService,
        infoCompanyService,
        examRecipeService,
    } from "./services/api/index.js";
    import AlertManager from "./services/alertManager.js";
    import UserManager from "./services/userManager.js";
    import {
        formatWhatsAppMessage,
        getIndicativeByCountry,
        formatDate,
        formatTimeByMilliseconds,
        generateURLStorageKey,
    } from "../services/utilidades";
    import {
        createMassMessaging
    } from '../funciones/funcionesJS/massMessage.js';
    import {
        generarFormato
    } from '../funciones/funcionesJS/generarPDF.js';

    import {
        TimerApp
    } from './react-dist/components/timer/TimerApp.js';

    ReactDOMClient.createRoot(document.getElementById('timerReact')).render(React.createElement(TimerApp));

    console.log('hola');

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const examId = new URLSearchParams(window.location.search).get('exam_id');
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
    const productId = new URLSearchParams(window.location.search).get('product_id');

    const patientPromise = patientService.get(patientId);
    const examOrdersPromise = examOrderService.getAll();
    const examOrderStatesPromise = examOrderStateService.getAll();

    const [
        patient,
        examOrders,
        examOrderStates
    ] = await Promise.all([
        patientPromise,
        examOrdersPromise,
        examOrderStatesPromise
    ]);

    let messaging = null;
    let templateExam;

    const tenant = window.location.hostname.split(".")[0];
    const data = {
        tenantId: tenant,
        belongsTo: "examenes-cargue",
        type: "whatsapp",
    };
    const companies = await infoCompanyService.getCompany();
    const communications = await infoCompanyService.getInfoCommunication(companies.data[0].id);
    try {
        templateExam = await templateService.getTemplate(data);
    } catch (error) {
        console.error('Error al obtener template:', error);
    }
    const infoInstance = {
        api_key: communications.api_key,
        instance: communications.instance
    }

    messaging = createMassMessaging(infoInstance);


    async function generatePdfFile(exam) {

        await generarFormato("Examen", exam.exam_order, "Impresion", "examInput");

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let fileInput = document.getElementById(
                    "pdf-input-hidden-to-examInput"
                );
                let file = fileInput?.files[0];

                if (!file) {
                    resolve(null);
                    return;
                }

                let formData = new FormData();
                formData.append("file", file);
                formData.append("model_type", "App\\Models\\exam");
                formData.append("model_id", exam.id);
                //@ts-ignore
                guardarArchivo(formData, true)
                    .then(async (response) => {
                        resolve({
                            file_url: await getUrlImage(
                                response.file.file_url.replaceAll("\\", "/"),
                                true
                            ),
                            model_type: response.file.model_type,
                            model_id: response.file.model_id,
                            id: response.file.id,
                        });
                    })
                    .catch(reject);
            }, 1000);
        });
    }

    async function sendMessageWhatsapp(exam) {
        const dataToFile = await generatePdfFile(exam);

        const replacements = {
            NOMBRE_PACIENTE: `${exam.exam_order.patient.first_name ?? ""} ${
          exam.exam_order.patient.middle_name ?? ""
        } ${exam.exam_order.patient.last_name ?? ""} ${
          exam.exam_order.patient.second_last_name ?? ""
        }`,
            NOMBRE_EXAMEN: `${exam.exam_order.exam_type.name}`,
            FECHA_EXAMEN: `${formatDate(exam.created_at, true)}`,
            "ENLACE DOCUMENTO": "",
        };

        const templateFormatted = formatWhatsAppMessage(
            templateExam.data.template,
            replacements
        );

        const dataMessage = {
            channel: "whatsapp",
            recipients: [
                getIndicativeByCountry(exam.exam_order.patient.country_id) +
                exam.exam_order.patient.whatsapp,
            ],
            message_type: "media",
            message: templateFormatted,
            attachment_url: dataToFile.file_url,
            attachment_type: "document",
            minio_model_type: dataToFile?.model_type,
            minio_model_id: dataToFile?.model_id,
            minio_id: dataToFile?.id,
            webhook_url: "https://example.com/webhook",
        };
        messaging.sendMessage(dataMessage).then(() => {});
    }

    await appointmentService.changeStatus(appointmentId, 'in_consultation')

    document.querySelectorAll('.patientName').forEach(element => {
        element.textContent = `${patient.first_name} ${patient.last_name}`;
        if (element.tagName === 'A') {
            element.href = `verPaciente?id=${patient.id}`
        }
    })

    let examOrder = null

    if (examId) {
        examOrder = examOrders.find(e => e.id == examId)
    } else {
        const product = await inventoryService.getById(productId);
        examOrder = examOrders.find(e => {
            return e.patient_id == patientId &&
                e.exam_type_id == product.exam_type_id &&
                examOrderStates.find(es => es.name.toLowerCase() == 'generated').id == e.exam_order_state_id &&
                e.created_at.slice(0, 10) == new Date().toISOString().slice(0, 10)
        });
    }

    document.getElementById('productName').textContent = examOrder?.exam_type?.name || 'Cargar Resultados de Examen';

    ReactDOMClient.createRoot(document.getElementById('examsAppReact')).render(React.createElement(ExamResultsForm, {
        examId: examOrder.id,
        handleSave: (data) => {
            const formattedTime = formatTimeByMilliseconds(localStorage.getItem(generateURLStorageKey('elapsedTime')));
            examResultService.create({
                    "exam_order_id": examOrder.id,
                    "created_by_user_id": UserManager.getUser().id,
                    "results": data,
                    "exam_order_update_data": {
                        duration: `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`
                    }
                })
                .then(async (response) => {

                    await sendMessageWhatsapp(response);

                    AlertManager.success({
                        text: 'Se ha creado el registro exitosamente'
                    })
                    setTimeout(() => {
                        window.location.href = `verOrdenesExamenes?patient_id=${patientId}`
                    }, 1000);
                })
                .catch(err => {
                    console.error("Error al crear el resultado del examen:", err);
                    if (err.data?.errors) {
                        AlertManager.formErrors(err.data.errors);
                    } else {
                        AlertManager.error({
                            text: err.data.error || err.message || 'Ocurrió un error inesperado'
                        });
                    }
                });
        }
    }));
</script>