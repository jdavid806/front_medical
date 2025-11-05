import React, {
    useState,
    useRef,
    useEffect,
    forwardRef,
    useImperativeHandle,
    useCallback,
} from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { StoreClinicalRecordInputs, ClinicalRecordData } from "./interfaces";
import {
    clinicalRecordService,
} from "../../services/api";
import { Toast } from "primereact/toast";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { formatTimeByMilliseconds, generateURLStorageKey, getDateTimeByMilliseconds, getIndicativeByCountry, getLocalTodayISODateTime, stringToDate } from "../../services/utilidades";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { ProgressBar } from "primereact/progressbar";
import { FinishClinicalRecordForm } from "./FinishClinicalRecordForm.js";
import { usePRToast } from "../hooks/usePRToast.js";
import { FinishClinicalRecordFormRef } from "./FinishClinicalRecordForm";
import { ResolveClinicalRecordReviewRequestForm, ResolveClinicalRecordReviewRequestFormRef } from "../general-request/components/ResolveClinicalRecordReviewRequestForm.js";
import { useResolveRequest } from "../general-request/hooks/useResolveRequest.js";

interface FinishClinicalRecordReviewModalProps {
    visible: boolean;
    requestId: string;
    clinicalRecordId: string;
    initialExternalDynamicData?: ClinicalRecordData;
    onHide?: () => void;
    onSave?: (data: any) => void;
    ref?: any;
}

function getPurpuse(purpuse: string): string | undefined {
    switch (purpuse) {
        case "Tratamiento":
            return "TREATMENT";
        case "Promoción":
            return "PROMOTION";
        case "Rehabilitación":
            return "REHABILITATION";
        case "Prevención":
            return "PREVENTION";
    }
}

export const FinishClinicalRecordReviewModal: React.FC<FinishClinicalRecordReviewModalProps> =
    forwardRef((props, ref) => {
        const { showErrorToast, showFormErrorsToast } = usePRToast();
        const { resolveRequest } = useResolveRequest();
        const toast = useRef<Toast>(null);
        const finishClinicalRecordFormRef = useRef<FinishClinicalRecordFormRef>(null);
        const resolveClinicalRecordReviewRequestFormRef = useRef<ResolveClinicalRecordReviewRequestFormRef>(null);

        const {
            initialExternalDynamicData,
            requestId,
            clinicalRecordId,
            visible,
            onSave,
            onHide
        } = props;

        const [externalDynamicData, setExternalDynamicData] = useState<any | null>(
            null
        );
        const [progress, setProgress] = useState(0);
        const [progressMessage, setProgressMessage] = useState("");
        const [isProcessing, setIsProcessing] = useState(false);

        const updateExternalDynamicData = (data: any) => {
            setExternalDynamicData(data);
        };

        const {
            sendMessage: sendMessageWpp,
        } = useMassMessaging();
        const { fetchTemplate, switchTemplate } = useTemplateBuilded();

        const sendMessageWppRef = useRef(sendMessageWpp);

        useEffect(() => {
            sendMessageWppRef.current = sendMessageWpp;
        }, [sendMessageWpp]);

        useEffect(() => {
            setExternalDynamicData(initialExternalDynamicData);
        }, [initialExternalDynamicData]);

        function buildDataToMessageToExams(exams: any) {
            const dataMapped = {
                ...exams[0],
                details: exams.flatMap((exam: any) => exam.details),
            };
            return dataMapped;
        }

        const prepareDataToSendMessageWPP = useCallback(
            async (clinicalRecordSaved: any) => {
                const tenant = window.location.hostname.split(".")[0];
                // Función auxiliar para esperar
                const delay = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

                //calcular total de bloques a enviar
                const totalBlocks = [
                    clinicalRecordSaved.exam_recipes.length > 0 &&
                    clinicalRecordSaved.patient.whatsapp_notifications,
                    clinicalRecordSaved.patient_disabilities.length > 0 &&
                    clinicalRecordSaved.patient.whatsapp_notifications,
                    clinicalRecordSaved.recipes.length > 0 &&
                    clinicalRecordSaved.patient.whatsapp_notifications,
                    clinicalRecordSaved.remissions.length > 0 &&
                    clinicalRecordSaved.patient.whatsapp_notifications,
                    clinicalRecordSaved &&
                    clinicalRecordSaved.patient.whatsapp_notifications, // Historia clínica
                    clinicalRecordSaved.appointment &&
                    clinicalRecordSaved.patient.whatsapp_notifications,
                ].filter(Boolean).length;

                const progressIncrement = totalBlocks > 0 ? 100 / totalBlocks : 0;
                let currentProgress = 0;

                const updateProgress = (message: any) => {
                    currentProgress += progressIncrement;
                    setProgress(currentProgress);
                    setProgressMessage(message);
                };

                try {
                    //Message to exams
                    if (
                        clinicalRecordSaved.exam_recipes.length &&
                        clinicalRecordSaved.patient.whatsapp_notifications
                    ) {
                        updateProgress("Procesando exámenes...");
                        const dataToMessage = buildDataToMessageToExams(
                            clinicalRecordSaved.exam_recipes
                        );
                        const data = {
                            tenantId: tenant,
                            belongsTo: "examenes-creacion",
                            type: "whatsapp",
                        };
                        const templateExams = await fetchTemplate(data);
                        const finishTemplate = await switchTemplate(
                            templateExams.template,
                            "examenes",
                            dataToMessage
                        );
                        const pdfFile = await generatePdfFile(
                            "RecetaExamen",
                            dataToMessage,
                            "prescriptionInput"
                        );
                        await sendMessageWhatsapp(
                            clinicalRecordSaved.patient,
                            finishTemplate,
                            pdfFile
                        );
                    }

                    //Message to disabilities
                    if (
                        clinicalRecordSaved.patient_disabilities.length &&
                        clinicalRecordSaved.patient.whatsapp_notifications
                    ) {
                        updateProgress("Procesando incapacidades...");
                        const data = {
                            tenantId: tenant,
                            belongsTo: "incapacidades-creacion",
                            type: "whatsapp",
                        };
                        const templateDisabilities = await fetchTemplate(data);
                        const finishTemplate = await switchTemplate(
                            templateDisabilities.template,
                            "disabilities",
                            clinicalRecordSaved.patient_disabilities[0]
                        );
                        const pdfFile = await generatePdfFile(
                            "Incapacidad",
                            clinicalRecordSaved.patient_disabilities[0],
                            "recordDisabilityInput"
                        );
                        await sendMessageWhatsapp(
                            clinicalRecordSaved.patient,
                            finishTemplate,
                            pdfFile
                        );
                    }

                    //Message to recipes
                    if (
                        clinicalRecordSaved.recipes.length &&
                        clinicalRecordSaved.patient.whatsapp_notifications
                    ) {
                        updateProgress("Procesando recetas...");
                        const dataMapped = {
                            ...clinicalRecordSaved.recipes[0],
                            clinical_record: {
                                description: clinicalRecordSaved.description,
                            },
                            recipe_items: clinicalRecordSaved.recipes.flatMap(
                                (recipe: any) => recipe.recipe_items
                            ),
                        };
                        const data = {
                            tenantId: tenant,
                            belongsTo: "recetas-creacion",
                            type: "whatsapp",
                        };
                        const templateRecipes = await fetchTemplate(data);
                        const finishTemplate = await switchTemplate(
                            templateRecipes.template,
                            "recipes",
                            dataMapped
                        );
                        const pdfFile = await generatePdfFile(
                            "Receta",
                            dataMapped,
                            "prescriptionInput"
                        );
                        await sendMessageWhatsapp(
                            clinicalRecordSaved.patient,
                            finishTemplate,
                            pdfFile
                        );
                    }

                    //message to remmissions
                    if (
                        clinicalRecordSaved.remissions.length &&
                        clinicalRecordSaved.patient.whatsapp_notifications
                    ) {
                        updateProgress("Procesando remisiones...");
                        const dataMapped = {
                            ...clinicalRecordSaved.remissions[0],
                            clinical_record: {
                                patient: clinicalRecordSaved.patient,
                            },
                        };
                        const data = {
                            tenantId: tenant,
                            belongsTo: "remiciones-creacion",
                            type: "whatsapp",
                        };
                        const templateRemissions = await fetchTemplate(data);
                        const finishTemplate = await switchTemplate(
                            templateRemissions.template,
                            "remissions",
                            dataMapped
                        );
                        const pdfFile = await generatePdfFile(
                            "Remision",
                            dataMapped,
                            "remisionInput"
                        );
                        await sendMessageWhatsapp(
                            clinicalRecordSaved.patient,
                            finishTemplate,
                            pdfFile
                        );
                    }

                    //Message to clinical record
                    if (
                        clinicalRecordSaved &&
                        clinicalRecordSaved.patient.whatsapp_notifications
                    ) {
                        updateProgress("Procesando historia clínica...");
                        const data = {
                            tenantId: tenant,
                            belongsTo: "historia_clinica-creacion",
                            type: "whatsapp",
                        };
                        const templateClinicalRecord = await fetchTemplate(data);
                        const finishTemplate = await switchTemplate(
                            templateClinicalRecord.template,
                            "clinical_records",
                            clinicalRecordSaved
                        );
                        const pdfFile = await generatePdfFile(
                            "Consulta",
                            clinicalRecordSaved,
                            "consultaInput"
                        );
                        await sendMessageWhatsapp(
                            clinicalRecordSaved.patient,
                            finishTemplate,
                            pdfFile
                        );
                    }
                    //message to appointments
                    // if (
                    //     clinicalRecordSaved.appointment &&
                    //     clinicalRecordSaved.patient.whatsapp_notifications
                    // ) {
                    //     updateProgress("Procesando cita...");
                    //     const data = {
                    //         tenantId: tenant,
                    //         belongsTo: "citas-creacion",
                    //         type: "whatsapp",
                    //     };
                    //     const templateAppointment = await fetchTemplate(data);
                    //     const finishTemplate = await switchTemplate(
                    //         templateAppointment.template,
                    //         "appointments",
                    //         clinicalRecordSaved.appointment
                    //     );
                    //     await sendMessageWhatsapp(
                    //         clinicalRecordSaved.patient,
                    //         finishTemplate,
                    //         null
                    //     );
                    // }
                    setProgress(100);
                    setProgressMessage("Proceso completado");
                } catch (error: any) {
                    setProgressMessage(`Error: ${error.message}`);
                    toast.current?.show({
                        severity: "error",
                        summary: "Error",
                        detail: error.message,
                        life: 5000,
                    });
                    throw error;
                }
            },
            []
        );

        async function generatePdfFile(printType: any, data: any, nameInputTemp: any) {
            //@ts-ignore
            await generarFormato(printType, data, "Impresion", nameInputTemp, true);

            return new Promise((resolve, reject) => {
                let fileInput: any = document.getElementById(
                    "pdf-input-hidden-to-" + nameInputTemp
                );
                let file = fileInput?.files[0];
                if (!file) {
                    resolve(null);
                    return;
                }

                let formData = new FormData();
                formData.append("file", file);
                formData.append("model_type", "App\\Models\\ExamRecipes");
                formData.append("model_id", data.id);
                //@ts-ignore
                guardarArchivo(formData, true)
                    .then(async (response: any) => {
                        resolve({
                            //@ts-ignore
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
            });
        }

        const sendMessageWhatsapp = useCallback(
            async (patient: any, templateFormatted: any, dataToFile: any) => {
                let dataMessage = {};
                if (dataToFile !== null) {
                    dataMessage = {
                        channel: "whatsapp",
                        recipients: [
                            getIndicativeByCountry(patient.country_id) + patient.whatsapp,
                        ],
                        message_type: "media",
                        message: templateFormatted,
                        attachment_url: dataToFile?.file_url,
                        attachment_type: "document",
                        minio_model_type: dataToFile?.model_type,
                        minio_model_id: dataToFile?.model_id,
                        minio_id: dataToFile?.id,
                        webhook_url: "https://example.com/webhook",
                    };
                } else {
                    dataMessage = {
                        channel: "whatsapp",
                        recipients: [
                            getIndicativeByCountry(patient.country_id) + patient.whatsapp,
                        ],
                        message_type: "text",
                        message: templateFormatted,
                        webhook_url: "https://example.com/webhook",
                    };
                }

                await sendMessageWppRef.current(dataMessage);
            },
            [sendMessageWpp]
        );

        const handleFinish = async () => {
            setIsProcessing(true);
            setProgress(0);
            setProgressMessage("Iniciando proceso...");
            const mappedData = await mapToServer();
            if (!resolveClinicalRecordReviewRequestFormRef.current) {
                return;
            }
            const { notes } = resolveClinicalRecordReviewRequestFormRef.current?.getFormData();
            const finalData = {
                ...mappedData,
                ...{
                    original_record_id: clinicalRecordId
                },
                general_request: {
                    id: requestId,
                    notes: notes,
                    status: "approved"
                }
            }

            console.log(finalData);

            try {
                const clinicalRecordRes =
                    await clinicalRecordService.clinicalRecordsParamsStoreFromApprovedReview(
                        mappedData.extra_data?.patientId,
                        finalData
                    );

                //await prepareDataToSendMessageWPP(clinicalRecordRes.clinical_record);

                toast.current?.show({
                    severity: "success",
                    summary: "Completado",
                    detail:
                        "Se ha creado el registro exitosamente y se han enviado todos los mensajes correctamente",
                    life: 3000,
                });

                localStorage.removeItem(generateURLStorageKey('elapsedTime'));
                localStorage.removeItem(generateURLStorageKey('startTime'));
                localStorage.removeItem(generateURLStorageKey('isRunning'));

                onSave?.(clinicalRecordRes);
                onHide?.();
            } catch (error: any) {
                console.error(error);
                if (error.data?.errors) {
                    showFormErrorsToast({
                        title: "Errores de validación",
                        errors: error.data.errors,
                    });
                } else {
                    showErrorToast({
                        title: "Error",
                        message: error.message || "Ocurrió un error inesperado",
                    });
                }
            } finally {
                setIsProcessing(false);
            }
        };

        const handleReject = async () => {
            try {
                const notes = resolveClinicalRecordReviewRequestFormRef.current?.getFormData().notes;
                const response = await resolveRequest(requestId, {
                    status: "rejected",
                    notes: notes || null
                });
                onSave?.(response)
                onHide?.();
            } catch (error) {
                console.error(error);
            }
        }

        const mapToServer = async (): Promise<StoreClinicalRecordInputs> => {
            if (!finishClinicalRecordFormRef.current) {
                throw new Error("finishClinicalRecordFormRef is not defined");
            }
            const {
                exams,
                disability,
                prescriptions,
                optometry,
                remission,
                appointment,
                currentUser,
                currentAppointment,
                diagnoses,
                treatmentPlan,
                clinicalRecordTypeId,
                examsActive,
                disabilitiesActive,
                prescriptionsActive,
                optometryActive,
                remissionsActive,
                appointmentActive,
                specialtyName,
                patientId,
                appointmentId
            } = finishClinicalRecordFormRef.current?.getFormState();

            const requestDataAppointment = {
                assigned_user_specialty_id:
                    currentAppointment.user_availability.user.user_specialty_id,
                appointment_date: appointment.appointment_date,
                appointment_time: appointment.appointment_time,
                assigned_user_availability_id:
                    appointment.assigned_user_availability_id,
                assigned_supervisor_user_availability_id:
                    appointment.assigned_supervisor_user_availability_id,
                attention_type: currentAppointment.attention_type,
                product_id: currentAppointment.product_id,
                consultation_purpose: getPurpuse(
                    currentAppointment.consultation_purpose
                ),
                consultation_type: "FOLLOW_UP",
                external_cause: "OTHER",
                frecuenciaCita: "",
                numRepeticiones: 0,
                selectPaciente: currentAppointment.patient_id,
                telefonoPaciente: currentAppointment.patient.whatsapp,
                correoPaciente: currentAppointment.patient.email,
                patient_id: currentAppointment.patient_id,
                appointment_state_id: currentAppointment.appointment_state_id,
                assigned_user_id: appointment.assigned_user_availability_id,
                created_by_user_id: appointment.created_by_user_id,
                duration: currentAppointment.user_availability.appointment_duration,
                branch_id: currentAppointment.user_availability.branch_id,
                phone: currentAppointment.patient.whatsapp,
                email: currentAppointment.patient.email,
            };

            const formattedTime = formatTimeByMilliseconds(localStorage.getItem(generateURLStorageKey('elapsedTime')));
            const formattedStartTime = getDateTimeByMilliseconds(localStorage.getItem(generateURLStorageKey('startTime')));

            const definitiveDiagnosis = diagnoses.find((diagnosis: any) => diagnosis.diagnosis_type === 'definitivo')?.codigo;

            let result: StoreClinicalRecordInputs = {
                appointment_id: appointmentId,
                branch_id: "1",
                clinical_record_type_id: clinicalRecordTypeId,
                created_by_user_id: currentUser?.id,
                description: treatmentPlan || "--",
                data: {
                    ...externalDynamicData,
                    rips: diagnoses,
                },
                consultation_duration: `${formattedTime.hours}:${formattedTime.minutes}:${formattedTime.seconds}`,
                start_time: `${getLocalTodayISODateTime(formattedStartTime)}`,
                diagnosis_main: definitiveDiagnosis || null,
                created_at: getLocalTodayISODateTime(),
                extra_data: {
                    specialtyName,
                    patientId,
                    appointmentId
                }
            };

            if (examsActive && exams.length > 0) {
                result.exam_order = exams.map((exam: any) => ({
                    patient_id: patientId,
                    exam_order_item_id: exam.id,
                    exam_order_item_type: "exam_type",
                }));
            }

            if (prescriptionsActive && prescriptions.length > 0) {
                result.recipe = {
                    user_id: currentUser?.id,
                    patient_id: patientId,
                    medicines: prescriptions.map((medicine: any) => ({
                        medication: medicine.medication,
                        concentration: medicine.concentration,
                        duration: medicine.duration,
                        frequency: medicine.frequency,
                        medication_type: medicine.medication_type,
                        observations: medicine.observations,
                        quantity: medicine.quantity,
                        take_every_hours: medicine.take_every_hours,
                    })),
                    type: "general",
                };
            }

            if (optometryActive && optometry) {
                result.recipe = {
                    user_id: currentUser?.id,
                    patient_id: patientId,
                    optometry: optometry,
                    type: "optometry",
                };
            }

            if (disabilitiesActive) {
                result.patient_disability = {
                    user_id: currentUser?.id,
                    start_date: disability.start_date.toISOString().split("T")[0],
                    end_date: disability.end_date.toISOString().split("T")[0],
                    reason: disability.reason,
                };
            }

            if (remissionsActive) {
                result.remission = remission;
            }

            if (appointmentActive) {
                result.appointment = requestDataAppointment;
            }

            return result;
        };

        useImperativeHandle(ref, () => ({
            updateExternalDynamicData
        }));

        return (
            <div>
                <Dialog
                    visible={visible}
                    onHide={() => {
                        onHide?.();
                    }}
                    header={"Finalizar Consulta"}
                    modal
                    style={{ width: "100vw", maxWidth: "100vw" }}
                >
                    <Toast ref={toast} />
                    {isProcessing && (
                        <div
                            className="position-fixed top-0 start-0 w-100 p-3 bg-light border-bottom"
                            style={{ zIndex: 10000, height: "18%" }}
                        >
                            <div className="container-fluid h-100">
                                <div className="d-flex align-items-center justify-content-center h-100">
                                    <div className="d-flex align-items-center gap-3 w-100">
                                        <i className="pi pi-spin pi-spinner text-primary"></i>
                                        <ProgressBar value={progress.toFixed(2)} style={{ flex: 1 }} />
                                        <div className="text-center" style={{ minWidth: "100px" }}>
                                            <strong>
                                                {progress.toFixed(2)}% - {progressMessage}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <FinishClinicalRecordForm
                        ref={finishClinicalRecordFormRef}
                        clinicalRecordId={clinicalRecordId}
                    />

                    <ResolveClinicalRecordReviewRequestForm ref={resolveClinicalRecordReviewRequestFormRef} />

                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                            icon={<i className="fa fa-times me-2"></i>}
                            label="Rechazar"
                            className="btn btn-danger"
                            onClick={() => {
                                handleReject();
                            }}
                        //disabled={isProcessing}
                        />
                        <Button
                            //label={isProcessing ? "Procesando..." : "Aprobar y guardar"}
                            icon={<i className="fa fa-check me-2"></i>}
                            label="Aprobar y guardar"
                            className="btn btn-success"
                            onClick={() => {
                                handleFinish();
                            }}
                        //disabled={isProcessing}
                        />
                    </div>
                </Dialog>
            </div>
        );
    });