import React, { useState, useRef, useEffect } from "react";
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
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSpecialty } from "../fe-config/speciality/hooks/useSpecialty";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { CustomPRTable } from "../components/CustomPRTable";

interface FinishClinicalRecordModalProps {
    patientId?: string;
    visible: boolean;
    onClose?: () => void;
}

interface FinishClinicalRecordModalInputs {
    diagnosis: string | null;
    diagnoses: any[];
}

export const FinishClinicalRecordModal: React.FC<FinishClinicalRecordModalProps> = ({ patientId, visible, onClose }) => {

    const {
        control,
        resetField,
    } = useForm<FinishClinicalRecordModalInputs>({
        defaultValues: {
            diagnosis: null,
            diagnoses: [],
        },
    });

    const { append: appendDiagnosis, remove: removeDiagnosis, update: updateDiagnosis } = useFieldArray({
        control,
        name: "diagnoses"
    });

    const diagnoses = useWatch({
        control,
        name: "diagnoses",
    });

    const { cie11Codes, loadCie11Codes, cie11Code, setCie11Code } = useSpecialty();

    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [examsActive, setExamsActive] = useState<boolean>(false);
    const [disabilitiesActive, setDisabilitiesActive] = useState<boolean>(false);
    const [prescriptionsActive, setPrescriptionsActive] = useState<boolean>(false);
    const [vaccinationsActive, setVaccinationsActive] = useState<boolean>(false);
    const [remissionsActive, setRemissionsActive] = useState<boolean>(false);
    const [appointmentActive, setAppointmentActive] = useState<boolean>(false);
    const [turnsActive, setTurnsActive] = useState<boolean>(false);
    const examFormRef = useRef<any>(null);
    const disabilityFormRef = useRef<any>(null);
    const prescriptionFormRef = useRef<any>(null);
    const vaccineFormRef = useRef<any>(null);
    const remissionFormRef = useRef<any>(null);
    const appointmentFormRef = useRef<LeavingConsultationAppointmentFormRef>(null);

    const hideModal = () => {
        onClose?.();
    };

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
            key: "vaccinations",
            label: "Vacunas"
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

    const handleFinish = async () => {
        const exams = examFormRef.current?.getFormData();
        const disabilities = disabilityFormRef.current?.getFormData();
        const prescriptions = prescriptionFormRef.current?.getFormData();
        const vaccinations = vaccineFormRef.current?.getFormData();
        const remissions = remissionFormRef.current?.getFormData();
        const appointment = await appointmentFormRef.current?.mapAppointmentToServer();
        console.log(appointmentFormRef);

        console.log(exams);
        console.log(disabilities);
        console.log(prescriptions);
        console.log(vaccinations);
        console.log(remissions);
        console.log(appointment);
    }

    return (
        <div>
            <Dialog
                visible={visible}
                onHide={() => { hideModal() }}
                header="Finalizar Consulta"
                modal
                style={{ width: '100vw', maxWidth: '100vw' }}
            >
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
                <Card header="Diagnósticos">
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
                    <CustomPRTable
                        data={diagnoses}
                        columns={[
                            { field: "label", header: "Diagnóstico" }
                        ]}
                        disableSearch
                        disableReload
                    />
                </Card>
                <div className="d-flex justify-content-end">
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
};

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