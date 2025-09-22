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
import { ExamForm } from "../exams/components/ExamForm";
import { DisabilityForm, DisabilityFormInputs } from "../disabilities/form/DisabilityForm";
import { Remission, remissionsForm as RemissionsForm } from "../remissions/RemissionsForm";
import PrescriptionForm, { PrescriptionFormInputs } from "../prescriptions/components/PrescriptionForm";
import { LeavingConsultationGenerateTicket } from "../tickets/LeavingConsultationGenerateTicket";
import {
    LeavingConsultationAppointmentForm,
    LeavingConsultationAppointmentFormRef,
} from "../appointments/LeavingConsultationAppointmentForm";
import { Divider } from "primereact/divider";
import { AddVaccineForm } from "../vaccines/form/AddVaccineForm";
import { Card } from "primereact/card";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty";
import {
    AutoComplete,
    AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { classNames } from "primereact/utils";
import { StoreClinicalRecordInputs, ClinicalRecordData } from "./interfaces";
import {
    appointmentService,
    clinicalRecordService,
    clinicalRecordTypeService,
    userService,
} from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";
import { Toast } from "primereact/toast";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { addDaysToDate, formatTimeByMilliseconds, generateURLStorageKey, getDateTimeByMilliseconds, getIndicativeByCountry, getLocalTodayISODateTime } from "../../services/utilidades";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
import { ProgressBar } from "primereact/progressbar";
import { useClinicalPackages } from "../clinical-packages/hooks/useClinicalPackages.js";
import { InputSwitch } from "primereact/inputswitch";
import { useLastPatientPrescription } from "../prescriptions/hooks/useLastPatientPrescription.js";
import { OptometryPrescriptionForm, OptometryPrescriptionFormRef } from "../prescriptions/components/OptometryPrescriptionForm.js";
import { Dropdown } from "primereact/dropdown";

interface FinishClinicalRecordModalProps {
    initialExternalDynamicData: ClinicalRecordData;
    clinicalRecordType?: string;
    appointmentId?: string;
    patientId?: string;
    specialtyName?: string;
}

interface FinishClinicalRecordModalInputs {
    diagnosis: string | null;
    diagnoses: any[];
    treatment_plan: string | null;
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

const diagnosisTypeOptions = [
    {
        value: 'definitivo',
        label: 'Definitivo'
    },
    {
        value: 'presuntivo',
        label: 'Presuntivo'
    },
    {
        value: 'diferencial',
        label: 'Diferencial'
    }
];

export const FinishClinicalRecordModal: React.FC<FinishClinicalRecordModalProps> =
    forwardRef((props, ref) => {
        const toast = useRef<Toast>(null);

        const {
            initialExternalDynamicData,
            appointmentId = new URLSearchParams(window.location.search).get(
                "appointment_id"
            ) || "",
            clinicalRecordType = new URLSearchParams(window.location.search).get(
                "tipo_historia"
            ) || "",
            patientId = new URLSearchParams(window.location.search).get(
                "patient_id"
            ) ||
            new URLSearchParams(window.location.search).get("id") ||
            "",
            specialtyName = new URLSearchParams(window.location.search).get(
                "especialidad"
            ) || "medicina_general",
        } = props;
        const { control } = useForm<FinishClinicalRecordModalInputs>({
            defaultValues: {
                diagnosis: null,
                diagnoses: [],
                treatment_plan: null,
            },
        });

        const { append: appendDiagnosis, remove: removeDiagnosis, update: updateDiagnosis } = useFieldArray({
            control,
            name: "diagnoses",
        });

        const diagnoses = useWatch({
            control,
            name: "diagnoses",
        });

        const treatmentPlan = useWatch({
            control,
            name: "treatment_plan",
        });

        const { cie11Codes, loadCie11Codes, cie11Code, setCie11Code } =
            useSpecialty();

        const { clinicalPackages } = useClinicalPackages()

        const [selectedPackage, setSelectedPackage] = useState<any | null>(null);

        const [initialSelectedExamTypes, setInitialSelectedExamTypes] = useState<string[]>([]);
        const [initialDisabilityFormData, setInitialDisabilityFormData] = useState<DisabilityFormInputs | undefined>(undefined);
        const [initialRemissionData, setInitialRemissionData] = useState<Remission | undefined>(undefined);
        const [initialPrescriptionData, setInitialPrescriptionData] = useState<PrescriptionFormInputs | undefined>(undefined);
        const [loadLastPrescriptionCheck, setLoadLastPrescriptionCheck] = useState<boolean>(false);

        const [visible, setVisible] = useState<boolean>(false);
        const [activeTab, setActiveTab] = useState<string | null>(null);
        const [examsActive, setExamsActive] = useState<boolean>(false);
        const [disabilitiesActive, setDisabilitiesActive] =
            useState<boolean>(false);
        const [prescriptionsActive, setPrescriptionsActive] =
            useState<boolean>(false);
        const [optometryActive, setOptometryActive] =
            useState<boolean>(false);
        const [vaccinationsActive, setVaccinationsActive] =
            useState<boolean>(false);
        const [remissionsActive, setRemissionsActive] = useState<boolean>(false);
        const [appointmentActive, setAppointmentActive] = useState<boolean>(false);
        const [turnsActive, setTurnsActive] = useState<boolean>(false);
        const [clinicalRecordTypeId, setClinicalRecordTypeId] =
            useState<string>("");
        const [currentUser, setCurrentUser] = useState<any | null>(null);
        const [currentAppointment, setCurrentAppointment] = useState<any | null>(
            null
        );
        const [externalDynamicData, setExternalDynamicData] = useState<any | null>(
            null
        );
        const examFormRef = useRef<any>(null);
        const disabilityFormRef = useRef<any>(null);
        const prescriptionFormRef = useRef<any>(null);
        const optometryFormRef = useRef<OptometryPrescriptionFormRef>(null);
        const vaccineFormRef = useRef<any>(null);
        const remissionFormRef = useRef<any>(null);
        const appointmentFormRef =
            useRef<LeavingConsultationAppointmentFormRef>(null);
        const [progress, setProgress] = useState(0);
        const [progressMessage, setProgressMessage] = useState("");
        const [isProcessing, setIsProcessing] = useState(false);

        const showModal = () => {
            setVisible(true);
        };

        const hideModal = () => {
            setVisible(false);
        };

        const updateExternalDynamicData = (data: any) => {
            setExternalDynamicData(data);
        };

        const showSuccessToast = ({
            title,
            message,
        }: {
            title?: string;
            message?: string;
        }) => {
            toast.current?.show({
                severity: "success",
                summary: title || "Éxito",
                detail: message || "Operación exitosa",
            });
        };

        const showErrorToast = ({
            title,
            message,
        }: {
            title?: string;
            message?: string;
        }) => {
            toast.current?.show({
                severity: "error",
                summary: title || "Error",
                detail: message || "Operación fallida",
            });
        };

        const showFormErrors = ({
            title,
            errors,
        }: {
            title?: string;
            errors: any;
        }) => {
            toast.current?.show({
                severity: "error",
                summary: title || "Errores de validación",
                content: (props) => (
                    <div className="text-start">
                        <h3>{props.message.summary}</h3>
                        {Object.entries(errors).map(([field, messages]) => (
                            <div className="mb-2">
                                <ul className="mb-0 mt-1 ps-3">
                                    {(messages as string[]).map((msg) => (
                                        <li>{msg}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ),
            });
        };

        const getRecipeTab = () => {
            if (specialtyName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() === "oftalmologia") {
                return {
                    key: "optometry",
                    label: "Receta de Optometría",
                };
            }

            return {
                key: "prescriptions",
                label: "Recetas Médicas",
            }
        };

        const tabs = [
            {
                key: "examinations",
                label: "Exámenes Clínicos",
            },
            {
                key: "incapacities",
                label: "Incapacidades Clínicas",
            },
            getRecipeTab(),
            {
                key: "referral",
                label: "Remisión",
            },
            {
                key: "appointment",
                label: "Cita",
            },
            {
                key: "turns",
                label: "Turnos",
            },
        ];

        const {
            sendMessage: sendMessageWpp,
            responseMsg,
            loading: loadingMessage,
            error,
        } = useMassMessaging();
        const { fetchTemplate, switchTemplate } = useTemplateBuilded();
        const { lastPatientPrescription, loadLastPatientPrescription } = useLastPatientPrescription();

        const sendMessageWppRef = useRef(sendMessageWpp);

        useEffect(() => {
            sendMessageWppRef.current = sendMessageWpp;
        }, [sendMessageWpp]);

        useEffect(() => {
            setExternalDynamicData(initialExternalDynamicData);
        }, [initialExternalDynamicData]);

        useEffect(() => {
            const fetchClinicalRecordType = async () => {
                const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
                const currentClinicalRecordType = clinicalRecordTypes.find(
                    (type: any) => type.key_ === clinicalRecordType
                );

                if (currentClinicalRecordType) {
                    setClinicalRecordTypeId(currentClinicalRecordType.id);
                }
            };

            fetchClinicalRecordType();
        }, [clinicalRecordType]);

        useEffect(() => {
            const fetchUser = async () => {
                const user = await userService.getLoggedUser();
                setCurrentUser(user);
            };

            fetchUser();
        }, []);

        useEffect(() => {
            const fetchAppointment = async () => {
                const appointment = await appointmentService.get(appointmentId);
                setCurrentAppointment(appointment);
            };

            fetchAppointment();
        }, [appointmentId]);

        function buildDataToMessageToExams(exams) {
            const dataMapped = {
                ...exams[0],
                details: exams.flatMap((exam) => exam.details),
            };
            return dataMapped;
        }

        const prepareDataToSendMessageWPP = useCallback(
            async (clinicalRecordSaved) => {
                const tenant = window.location.hostname.split(".")[0];
                // Función auxiliar para esperar
                const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

                const updateProgress = (message) => {
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
                                (recipe) => recipe.recipe_items
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
                } catch (error) {
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

        async function generatePdfFile(printType, data, nameInputTemp) {
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
                    .then(async (response) => {
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
            async (patient, templateFormatted, dataToFile) => {
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

            try {
                const clinicalRecordRes =
                    await clinicalRecordService.clinicalRecordsParamsStore(
                        patientId,
                        mappedData
                    );

                await prepareDataToSendMessageWPP(clinicalRecordRes.clinical_record);

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

                hideModal();
                window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${specialtyName}`;
            } catch (error) {
                console.error(error);
                if (error.data?.errors) {
                    showFormErrors({
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

        const mapToServer = async (): Promise<StoreClinicalRecordInputs> => {
            const exams = examFormRef.current?.getFormData();
            const disability = disabilityFormRef.current?.getFormData();
            const prescriptions = prescriptionFormRef.current?.getFormData();
            const optometry = optometryFormRef.current?.getFormData();
            const remission = remissionFormRef.current?.getFormData();
            const appointment =
                await appointmentFormRef.current?.mapAppointmentToServer();

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
            console.log(diagnoses);

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
            updateExternalDynamicData,
            showModal,
            hideModal,
        }));

        const onPackageChange = (pkg: any) => {
            setSelectedPackage(pkg);

            setExamsActive(false)
            setDisabilitiesActive(false)
            setRemissionsActive(false)
            setPrescriptionsActive(false)

            setInitialSelectedExamTypes([])
            setInitialDisabilityFormData(undefined)
            setInitialRemissionData(undefined)
            setInitialPrescriptionData(undefined)

            const packageExamTypes = pkg.package_items.filter(item => item.item_type == "App\\Models\\Examen")
            const packageExamTypeIds = packageExamTypes.map(item => `${item.item_id}`)

            if (packageExamTypeIds.length > 0) {
                setExamsActive(true)
                setInitialSelectedExamTypes(packageExamTypeIds)
            }

            const packageDisability = pkg.package_items.find(item => item.item_type == "App\\Models\\Incapacidad")
            if (packageDisability) {
                setDisabilitiesActive(true)
                setInitialDisabilityFormData({
                    user_id: 0,
                    days_disability: packageDisability.prescription.days_incapacity,
                    start_date: new Date(),
                    end_date: addDaysToDate(new Date(), packageDisability.prescription.days_incapacity),
                    reason: packageDisability.prescription.reason,
                    id: 0,
                    isEditing: false
                })
            }

            const packageRemission = pkg.package_items.find(item => item.item_type == "App\\Models\\Remision")
            if (packageRemission) {
                setRemissionsActive(true)
                setInitialRemissionData({
                    receiver_user_id: packageRemission.prescription.user_id,
                    remitter_user_id: 0,
                    clinical_record_id: 0,
                    receiver_user_specialty_id: packageRemission.prescription.specialty_id,
                    note: packageRemission.prescription.reason,
                })
            }

            const packagePrescriptions = pkg.package_items.filter(item => item.item_type == "App\\Models\\medicamento")
            if (packagePrescriptions.length > 0) {
                setPrescriptionsActive(true)
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: [...packagePrescriptions.map(item => ({
                        medication: item.prescription.medication,
                        concentration: item.prescription.concentration, //
                        duration: item.prescription.duration_days, //
                        frequency: item.prescription.frequency, //
                        medication_type: item.prescription.medication_type, //
                        observations: item.prescription.instructions, //
                        quantity: item.prescription.quantity, //
                        take_every_hours: +(item.prescription.medication_frequency?.split(" ")[0]) || 0,
                        showQuantity: false,
                        showTimeField: false,
                    })), ...(lastPatientPrescription?.recipe_items || [])]
                })
            }
        };

        const handleLoadLastPrescriptionChange = async (e: boolean) => {
            setLoadLastPrescriptionCheck(e)
            if (e && selectedPackage) {
                const lastPrescription = await loadLastPatientPrescription(patientId);
                const newMedicines = [...(initialPrescriptionData?.medicines || []), ...lastPrescription.recipe_items];
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: newMedicines
                });
            } else if (e && !selectedPackage) {
                loadLastPrescription();
            } else if (!e && selectedPackage) {
                setPrescriptionsActive(true)
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: selectedPackage.package_items.filter(item => item.item_type == "App\\Models\\medicamento").map(item => ({
                        medication: item.prescription.medication,
                        concentration: item.prescription.concentration, //
                        duration: item.prescription.duration_days, //
                        frequency: item.prescription.frequency, //
                        medication_type: item.prescription.medication_type, //
                        observations: item.prescription.instructions, //
                        quantity: item.prescription.quantity, //
                        take_every_hours: +(item.prescription.medication_frequency?.split(" ")[0]) || 0,
                        showQuantity: false,
                        showTimeField: false,
                    }))
                })
            } else {
                setInitialPrescriptionData({
                    user_id: 0,
                    patient_id: 0,
                    is_active: true,
                    medicines: []
                })
            }
        }

        const loadLastPrescription = async () => {
            const lastRecipe = await loadLastPatientPrescription(patientId);
            setInitialPrescriptionDataFromLastPatientPrescription(lastRecipe)
        }

        const setInitialPrescriptionDataFromLastPatientPrescription = (lastPatientPrescription: any) => {
            setInitialPrescriptionData({
                user_id: 0,
                patient_id: 0,
                is_active: true,
                medicines: lastPatientPrescription.recipe_items
            })
        }

        const shouldShowCIE11PackageButton = (cie11Code: any) => {
            return clinicalPackages.some(pkg => pkg.cie11 === cie11Code)
        }

        const getCIE11Package = (cie11Code: any) => {
            return clinicalPackages.find(pkg => pkg.cie11 === cie11Code)
        }

        const onCIE11PackageClick = (cie11Code: any) => {
            const pkg = getCIE11Package(cie11Code)
            if (pkg) {
                onPackageChange(pkg)
            }
            showSuccessToast({
                title: "Paquete seleccionado",
                message: `Se ha seleccionado el paquete ${pkg.label}`,
            })
        }

        const shouldShowCheckIcon = (tabKey: string): boolean => {
            switch (tabKey) {
                case "examinations":
                    return examsActive;
                case "incapacities":
                    return disabilitiesActive;
                case "referral":
                    return remissionsActive;
                case "prescriptions":
                    return prescriptionsActive;
                case "optometry":
                    return optometryActive;
                default:
                    return false;
            }
        }

        return (
            <div>
                <Dialog
                    visible={visible}
                    onHide={() => {
                        hideModal();
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

                    <Card header={<h3 className="px-3 pt-3">Diagnósticos</h3>}>
                        <div className="d-flex gap-2">
                            <div className="d-flex flex-grow-1">
                                <div className="w-100 mb-3">
                                    <label htmlFor="cie11-code" className="form-label">
                                        Escriba un Código CIE-11
                                    </label>
                                    <AutoComplete
                                        inputId="cie11-code"
                                        placeholder="Seleccione un CIE-11"
                                        field="label"
                                        suggestions={cie11Codes}
                                        completeMethod={(event: AutoCompleteCompleteEvent) =>
                                            loadCie11Codes(event.query)
                                        }
                                        inputClassName="w-100"
                                        className="w-100"
                                        appendTo={"self"}
                                        value={cie11Code}
                                        onChange={(e) => setCie11Code(e.value)}
                                        forceSelection={false}
                                        showEmptyMessage={true}
                                        emptyMessage="No se encontraron códigos CIE-11"
                                        delay={1000}
                                        minLength={3}
                                        panelStyle={{
                                            zIndex: 100000,
                                            width: "auto",
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <Button
                                    label="Agregar"
                                    icon={<i className="fa fa-plus" />}
                                    disabled={!cie11Code || !cie11Code.label}
                                    onClick={() => {
                                        if (cie11Code && cie11Code.label) {
                                            appendDiagnosis(cie11Code);
                                            setCie11Code(null);
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <CustomPRTable
                                data={diagnoses}
                                columns={[
                                    {
                                        field: "label",
                                        header: "Diagnóstico"
                                    },
                                    {
                                        field: "",
                                        header: "Tipo de Diagnóstico",
                                        width: "200px",
                                        body: (rowData: any) => (<>
                                            <Dropdown
                                                id="diagnosis_type"
                                                value={rowData.diagnosis_type}
                                                onChange={(e) => updateDiagnosis(diagnoses.indexOf(rowData), { ...rowData, diagnosis_type: e.value })}
                                                options={diagnosisTypeOptions}
                                                optionLabel="label"
                                                optionValue="value"
                                                placeholder="Seleccione un tipo de diagnóstico"
                                                className="w-100"
                                                showClear
                                            />
                                        </>)
                                    },
                                    {
                                        field: "actions",
                                        header: "Acciones",
                                        width: "100px",
                                        body: (row) => (
                                            <div className="d-flex align-items-center justify-content-center gap-2">
                                                {shouldShowCIE11PackageButton(row.codigo) && (
                                                    <Button
                                                        icon={<i className="fa fa-gift" />}
                                                        rounded
                                                        text
                                                        severity="success"
                                                        tooltip="Utilizar paquete configurado para CIE-11"
                                                        tooltipOptions={{
                                                            position: "top",
                                                        }}
                                                        onClick={() => onCIE11PackageClick(row.codigo)}
                                                    />
                                                )}

                                                <Button
                                                    icon={<i className="fa fa-trash" />}
                                                    rounded
                                                    text
                                                    severity="danger"
                                                    onClick={() => removeDiagnosis(diagnoses.indexOf(row))}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                                disableSearch
                                disableReload
                            />
                        </div>
                        <div className="mb-3">
                            <Controller
                                name="treatment_plan"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor="treatment-plan" className="form-label">
                                            Plan de Tratamiento
                                        </label>
                                        <Editor
                                            id="treatment-plan"
                                            value={field.value || ""}
                                            onTextChange={(e: EditorTextChangeEvent) =>
                                                field.onChange(e.htmlValue)
                                            }
                                            style={{ height: "320px" }}
                                            className={classNames({
                                                "p-invalid": fieldState.error,
                                            })}
                                        />
                                    </>
                                )}
                            />
                        </div>
                    </Card>
                    <Divider />
                    <div className="d-flex">
                        <div
                            className="p-3 border-right d-flex flex-column gap-2"
                            style={{ width: "300px", minWidth: "300px" }}
                        >
                            {tabs.map((tab) => (
                                <>
                                    <Tab
                                        key={tab.key}
                                        tab={tab}
                                        activeTab={activeTab}
                                        onActiveTabChange={(activeTab) => setActiveTab(activeTab)}
                                        showCheckIcon={shouldShowCheckIcon(tab.key)}
                                    />
                                </>
                            ))}
                        </div>
                        <div className="p-3 flex-grow-1">
                            <div
                                className={activeTab === "examinations" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Exámenes Clínicos</h2>
                                    {!examsActive && (
                                        <Button
                                            label="Agregar Exámenes"
                                            className="btn btn-primary"
                                            onClick={() => setExamsActive(true)}
                                        />
                                    )}
                                    {examsActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setExamsActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={examsActive ? "d-block" : "d-none"}>
                                    <ExamForm ref={examFormRef} initialSelectedExamTypes={initialSelectedExamTypes} />
                                </div>
                            </div>
                            <div
                                className={activeTab === "incapacities" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Incapacidades Clínicas</h2>
                                    {!disabilitiesActive && (
                                        <Button
                                            label="Agregar Incapacidad"
                                            className="btn btn-primary"
                                            onClick={() => setDisabilitiesActive(true)}
                                        />
                                    )}
                                    {disabilitiesActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setDisabilitiesActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={disabilitiesActive ? "d-block" : "d-none"}>
                                    <DisabilityForm
                                        ref={disabilityFormRef}
                                        formConfig={{
                                            fieldsConfig: {
                                                user_id: {
                                                    visible: false
                                                }
                                            }
                                        }}
                                        initialData={initialDisabilityFormData}
                                    />
                                </div>
                            </div>
                            <div
                                className={activeTab === "prescriptions" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Recetas Médicas</h2>
                                    {!prescriptionsActive && (
                                        <Button
                                            label="Agregar Recetas"
                                            className="btn btn-primary"
                                            onClick={() => setPrescriptionsActive(true)}
                                        />
                                    )}
                                    {prescriptionsActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setPrescriptionsActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={prescriptionsActive ? "d-block" : "d-none"}>
                                    <div className="d-flex align-items-center gap-2 mb-3">
                                        <InputSwitch
                                            checked={loadLastPrescriptionCheck}
                                            onChange={e => handleLoadLastPrescriptionChange(e.value)}
                                        />
                                        <label htmlFor="loadLastPrescriptionCheck">Cargar Última Receta</label>
                                    </div>

                                    <PrescriptionForm
                                        ref={prescriptionFormRef}
                                        initialData={initialPrescriptionData}
                                    />
                                </div>
                            </div>
                            <div
                                className={activeTab === "optometry" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Receta de Optometría</h2>
                                    {!optometryActive && (
                                        <Button
                                            label="Agregar Receta de Optometría"
                                            className="btn btn-primary"
                                            onClick={() => setOptometryActive(true)}
                                        />
                                    )}
                                    {optometryActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setOptometryActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={optometryActive ? "d-block" : "d-none"}>
                                    <OptometryPrescriptionForm
                                        ref={optometryFormRef}
                                    />
                                </div>
                            </div>
                            <div
                                className={activeTab === "vaccinations" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Vacunas</h2>
                                    {!vaccinationsActive && (
                                        <Button
                                            label="Agregar Vacunas"
                                            className="btn btn-primary"
                                            onClick={() => setVaccinationsActive(true)}
                                        />
                                    )}
                                    {vaccinationsActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setVaccinationsActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={vaccinationsActive ? "d-block" : "d-none"}>
                                    <AddVaccineForm ref={vaccineFormRef} />
                                </div>
                            </div>
                            <div className={activeTab === "referral" ? "d-block" : "d-none"}>
                                <div className="d-flex justify-content-between">
                                    <h2>Remisión</h2>
                                    {!remissionsActive && (
                                        <Button
                                            label="Agregar Remisión"
                                            className="btn btn-primary"
                                            onClick={() => setRemissionsActive(true)}
                                        />
                                    )}
                                    {remissionsActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setRemissionsActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={remissionsActive ? "d-block" : "d-none"}>
                                    <RemissionsForm ref={remissionFormRef} initialData={initialRemissionData} />
                                </div>
                            </div>
                            <div
                                className={activeTab === "appointment" ? "d-block" : "d-none"}
                            >
                                <div className="d-flex justify-content-between">
                                    <h2>Cita</h2>
                                    {!appointmentActive && (
                                        <Button
                                            label="Agregar Cita"
                                            className="btn btn-primary"
                                            onClick={() => setAppointmentActive(true)}
                                        />
                                    )}
                                    {appointmentActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setAppointmentActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={appointmentActive ? "d-block" : "d-none"}>
                                    <LeavingConsultationAppointmentForm
                                        patientId={patientId}
                                        userSpecialtyId={"1"}
                                        ref={appointmentFormRef}
                                    />
                                </div>
                            </div>
                            <div className={activeTab === "turns" ? "d-block" : "d-none"}>
                                <div className="d-flex justify-content-between">
                                    <h2>Turnos</h2>
                                    {!turnsActive && (
                                        <Button
                                            label="Generar Turnos"
                                            className="btn btn-primary"
                                            onClick={() => setTurnsActive(true)}
                                        />
                                    )}
                                    {turnsActive && (
                                        <Button
                                            label="Cancelar"
                                            className="btn btn-danger"
                                            onClick={() => setTurnsActive(false)}
                                        />
                                    )}
                                </div>
                                <Divider />
                                <div className={turnsActive ? "d-block" : "d-none"}>
                                    <LeavingConsultationGenerateTicket patientId={patientId} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-3">
                        <Button
                            label="Cancelar"
                            className="btn btn-danger"
                            onClick={() => {
                                hideModal();
                            }}
                            disabled={isProcessing}
                        />
                        <Button
                            label={isProcessing ? "Procesando..." : "Finalizar"}
                            className="btn btn-primary"
                            onClick={() => {
                                handleFinish();
                            }}
                            disabled={isProcessing}
                        />
                    </div>
                </Dialog>
            </div>
        );
    });

interface TabProps {
    tab: { key: string; label: string };
    activeTab: string | null;
    onActiveTabChange: ((activeTab: string | null) => void) | undefined;
    showCheckIcon: boolean;
}

const Tab: React.FC<TabProps> = ({ tab, activeTab, onActiveTabChange, showCheckIcon }) => {
    return (
        <>
            <button
                className={`w-100 p-3 btn btn-outline-primary ${activeTab === tab.key ? "btn-primary text-white" : ""
                    } btn-sm`}
                onClick={() => {
                    if (activeTab === tab.key) {
                        onActiveTabChange?.(null);
                        return;
                    }
                    onActiveTabChange?.(tab.key);
                }}
            >
                <div className="d-flex align-items-center gap-2">
                    <div className={showCheckIcon ? "d-block" : "d-none"}>
                        <i
                            className={`fas fa-check-circle`}
                            style={{ width: "20px", height: "20px" }}
                        />
                    </div>
                    {tab.label}
                </div>
            </button>
        </>
    );
};
