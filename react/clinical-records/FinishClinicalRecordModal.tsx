import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { ExamForm } from "../exams/components/ExamForm";
import { DisabilityForm } from "../disabilities/form/DisabilityForm";
import { remissionsForm as RemissionsForm } from "../remissions/RemissionsForm";
import PrescriptionForm from "../prescriptions/components/PrescriptionForm";
import { LeavingConsultationGenerateTicket } from "../tickets/LeavingConsultationGenerateTicket";
import { LeavingConsultationAppointmentForm, LeavingConsultationAppointmentFormRef } from "../appointments/LeavingConsultationAppointmentForm";
import { Divider } from "primereact/divider";
import { AddVaccineForm } from "../vaccines/form/AddVaccineForm";
import { Card } from "primereact/card";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { classNames } from "primereact/utils";
import { StoreClinicalRecordInputs, ClinicalRecordData } from "./interfaces";
import { appointmentService, clinicalRecordService, clinicalRecordTypeService, userService } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";
import { Toast } from "primereact/toast";

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

export const FinishClinicalRecordModal: React.FC<FinishClinicalRecordModalProps> = forwardRef((props, ref) => {

    const toast = useRef<Toast>(null);

    const {
        initialExternalDynamicData,
        appointmentId = new URLSearchParams(window.location.search).get('appointment_id') || '',
        clinicalRecordType = new URLSearchParams(window.location.search).get('tipo_historia') || '',
        patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || '',
        specialtyName = new URLSearchParams(window.location.search).get('especialidad') || 'medicina_general'
    } = props;
    const {
        control,
    } = useForm<FinishClinicalRecordModalInputs>({
        defaultValues: {
            diagnosis: null,
            diagnoses: [],
        },
    });

    const { append: appendDiagnosis, remove: removeDiagnosis } = useFieldArray({
        control,
        name: "diagnoses"
    });

    const diagnoses = useWatch({
        control,
        name: "diagnoses",
    });

    const treatmentPlan = useWatch({
        control,
        name: "treatment_plan",
    });

    const { cie11Codes, loadCie11Codes, cie11Code, setCie11Code } = useSpecialty();

    const [visible, setVisible] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [examsActive, setExamsActive] = useState<boolean>(false);
    const [disabilitiesActive, setDisabilitiesActive] = useState<boolean>(false);
    const [prescriptionsActive, setPrescriptionsActive] = useState<boolean>(false);
    const [vaccinationsActive, setVaccinationsActive] = useState<boolean>(false);
    const [remissionsActive, setRemissionsActive] = useState<boolean>(false);
    const [appointmentActive, setAppointmentActive] = useState<boolean>(false);
    const [turnsActive, setTurnsActive] = useState<boolean>(false);
    const [clinicalRecordTypeId, setClinicalRecordTypeId] = useState<string>("");
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [currentAppointment, setCurrentAppointment] = useState<any | null>(null);
    const [externalDynamicData, setExternalDynamicData] = useState<any | null>(null);
    const examFormRef = useRef<any>(null);
    const disabilityFormRef = useRef<any>(null);
    const prescriptionFormRef = useRef<any>(null);
    const vaccineFormRef = useRef<any>(null);
    const remissionFormRef = useRef<any>(null);
    const appointmentFormRef = useRef<LeavingConsultationAppointmentFormRef>(null);

    const showModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    const updateExternalDynamicData = (data: any) => {
        setExternalDynamicData(data);
    };

    const showSuccessToast = ({ title, message }: { title?: string; message?: string }) => {
        toast.current?.show({
            severity: 'success',
            summary: title || "Éxito",
            detail: message || "Operación exitosa"
        });
    }

    const showErrorToast = ({ title, message }: { title?: string; message?: string }) => {
        toast.current?.show({
            severity: 'error',
            summary: title || "Error",
            detail: message || "Operación fallida"
        });
    }


    const showFormErrors = ({ title, errors }: { title?: string; errors: any }) => {
        toast.current?.show({
            severity: 'error',
            summary: title || "Errores de validación",
            content: (props) => (
                <div className="text-start">
                    <h3>{props.message.summary}</h3>
                    {Object.entries(errors).map(([field, messages]) => (
                        <div className="mb-2">
                            <ul className="mb-0 mt-1 ps-3">
                                {(messages as string[]).map(msg => (<li>{msg}</li>))}
                            </ul>
                        </div>
                    ))}
                </div>
            )
        });
    }


    const tabs = [
        {
            key: "examinations",
            label: "Exámenes Clínicos"
        },
        {
            key: "incapacities",
            label: "Incapacidades Clínicas"
        },
        {
            key: "prescriptions",
            label: "Recetas Médicas"
        },
        {
            key: "referral",
            label: "Remisión"
        },
        {
            key: "appointment",
            label: "Cita"
        },
        {
            key: "turns",
            label: "Turnos"
        }
    ]

    useEffect(() => {
        setExternalDynamicData(initialExternalDynamicData);
    }, [initialExternalDynamicData]);

    useEffect(() => {
        const fetchClinicalRecordType = async () => {
            const clinicalRecordTypes = await clinicalRecordTypeService.getAll();
            const currentClinicalRecordType = clinicalRecordTypes.find((type: any) => type.key_ === clinicalRecordType);

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

    const handleFinish = async () => {
        const mappedData = await mapToServer();

        try {
            const clinicalRecordRes = await clinicalRecordService.clinicalRecordsParamsStore(patientId, mappedData)

            showSuccessToast({
                title: "Se ha creado el registro exitosamente",
                message: "Por favor espere un momento mientras se envía el mensaje"
            });

            // @ts-ignore
            await createHistoryMessage(clinicalRecordRes.clinical_record.id, clinicalRecordRes.clinical_record
                .patient_id)

            showSuccessToast({
                title: "Se ha enviado el mensaje exitosamente",
            });

            hideModal();
            window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${specialtyName}`;

        } catch (error) {
            console.log(error);
            if (error.data?.errors) {
                showFormErrors({
                    title: "Errores de validación",
                    errors: error.data.errors
                });
            } else {
                showErrorToast({
                    title: "Error",
                    message: error.message || 'Ocurrió un error inesperado'
                });
            }
        }
    }

    const mapToServer = async (): Promise<StoreClinicalRecordInputs> => {
        const exams = examFormRef.current?.getFormData();
        const disability = disabilityFormRef.current?.getFormData();
        const prescriptions = prescriptionFormRef.current?.getFormData();
        const remission = remissionFormRef.current?.getFormData();
        const appointment = await appointmentFormRef.current?.mapAppointmentToServer();

        const requestDataAppointment = {
            assigned_user_specialty_id: currentAppointment.user_availability.user.user_specialty_id,
            appointment_date: appointment.appointment_date,
            appointment_time: appointment.appointment_time,
            assigned_user_availability_id: appointment.assigned_user_availability_id,
            assigned_supervisor_user_availability_id: appointment.assigned_supervisor_user_availability_id,
            attention_type: currentAppointment.attention_type,
            product_id: currentAppointment.product_id,
            consultation_purpose: getPurpuse(currentAppointment.consultation_purpose),
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
            email: currentAppointment.patient.email
        };

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
            consultation_duration: "",
        }

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
    }

    useImperativeHandle(ref, () => ({
        updateExternalDynamicData,
        showModal,
        hideModal,
    }));

    return (
        <div>
            <Dialog
                visible={visible}
                onHide={() => { hideModal() }}
                header="Finalizar Consulta"
                modal
                style={{ width: '100vw', maxWidth: '100vw' }}
            >
                <Toast ref={toast} />
                <div className="d-flex">
                    <div className="p-3 border-right d-flex flex-column gap-2" style={{ width: '250px', minWidth: '250px' }}>
                        {
                            tabs.map(tab => (<>
                                <Tab
                                    key={tab.key}
                                    tab={tab}
                                    activeTab={activeTab}
                                    onActiveTabChange={(activeTab) => setActiveTab(activeTab)}
                                />
                            </>))
                        }
                    </div>
                    <div className="p-3 flex-grow-1">
                        <div className={activeTab === "examinations" ? "d-block" : "d-none"}>
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
                                <ExamForm ref={examFormRef} />
                            </div>
                        </div>
                        <div className={activeTab === "incapacities" ? "d-block" : "d-none"}>
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
                                <DisabilityForm ref={disabilityFormRef} />
                            </div>
                        </div>
                        <div className={activeTab === "prescriptions" ? "d-block" : "d-none"}>
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
                                <PrescriptionForm ref={prescriptionFormRef} />
                            </div>
                        </div>
                        <div className={activeTab === "vaccinations" ? "d-block" : "d-none"}>
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
                                <RemissionsForm ref={remissionFormRef} />
                            </div>
                        </div>
                        <div className={activeTab === "appointment" ? "d-block" : "d-none"}>
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
                                <LeavingConsultationAppointmentForm userSpecialtyId={"1"} ref={appointmentFormRef} />
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
                <Divider />
                <p className="fs-9 text-danger">
                    Antes de finalizar la consulta por favor complete la siguiente información:
                </p>
                <Card header={<h3 className="p-3">Diagnósticos</h3>}>
                    <div className="d-flex gap-2">
                        <div className="d-flex flex-grow-1">
                            <div className="w-100 mb-3">
                                <label htmlFor="cie11-code" className="form-label">Escriba un Código CIE-11</label>
                                <AutoComplete
                                    inputId="cie11-code"
                                    placeholder="Seleccione un CIE-11"
                                    field="label"
                                    suggestions={cie11Codes}
                                    completeMethod={(event: AutoCompleteCompleteEvent) => loadCie11Codes(event.query)}
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
                                        width: 'auto'
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
                                    console.log(cie11Code)
                                    if (cie11Code && cie11Code.label) {
                                        appendDiagnosis(cie11Code)
                                        setCie11Code(null)
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <CustomPRTable
                            data={diagnoses}
                            columns={[
                                { field: "label", header: "Diagnóstico" }
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
                                    <label
                                        htmlFor="treatment-plan"
                                        className="form-label"
                                    >
                                        Plan de Tratamiento
                                    </label>
                                    <Editor
                                        id="treatment-plan"
                                        value={field.value || ""}
                                        onTextChange={(e: EditorTextChangeEvent) => field.onChange(e.htmlValue)}
                                        style={{ height: '320px' }}
                                        className={classNames({
                                            "p-invalid": fieldState.error,
                                        })}
                                    />
                                </>
                            )}
                        />
                    </div>
                </Card>
                <div className="d-flex justify-content-end gap-2 mt-3">
                    <Button
                        label="Cancelar"
                        className="btn btn-danger"
                        onClick={() => {
                            hideModal();
                        }}
                    />
                    <Button
                        label="Finalizar"
                        className="btn btn-primary"
                        onClick={() => {
                            handleFinish();
                        }}
                    />
                </div>
            </Dialog>
        </div>
    );
});

interface TabProps {
    tab: { key: string, label: string },
    activeTab: string | null,
    onActiveTabChange: ((activeTab: string | null) => void) | undefined
}

const Tab: React.FC<TabProps> = ({ tab, activeTab, onActiveTabChange }) => {
    return <>
        <button
            className={`w-100 p-3 btn btn-outline-primary ${activeTab === tab.key ? "btn-primary text-white" : ""} btn-sm`}
            onClick={() => {
                if (activeTab === tab.key) {
                    onActiveTabChange?.(null);
                    return;
                }
                onActiveTabChange?.(tab.key);
            }}
        >
            {tab.label}
        </button>
    </>
};