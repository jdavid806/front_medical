import React, { useEffect } from "react";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useState, useRef } from "react";
import { PatientInfoContainer } from "./PatientInfoContainer";
import { PatientEvolution } from "./PatientEvolution";
import { PastMedicalHistoryDetail } from "../past-medical-history/PastMedicalHistoryDetail";
import { PreadmissionTable } from "../appointments/PreadmissionTable";
import { PrescriptionApp } from "../prescriptions/PrescriptionApp";
import ExamApp from "../exams/ExamApp";

interface SeePatientInfoButtonProps {
    patientId?: string;
}

export const SeePatientInfoButton = (props: SeePatientInfoButtonProps) => {
    const {
        patientId = (
            new URLSearchParams(window.location.search).get('patient_id')
            || new URLSearchParams(window.location.search).get('id')
            || "0"
        )
    } = props;

    const [visible, setVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const showDialog = () => {
        setVisible(true);
    };

    const hideDialog = () => {
        setVisible(false);
    };

    const steps = [
        {
            label: "Datos Generales",
            content: <PatientInfoContainer patientId={patientId} />
        },
        {
            label: "Antecedentes",
            content: <PastMedicalHistoryDetail />
        },
        {
            label: "Historial del Paciente",
            content: <PatientEvolution />
        },
        {
            label: "Historial de Recetas",
            content: <PrescriptionApp />
        },
        {
            label: "Historial de Examenes",
            content: <ExamApp />
        },
        {
            label: "Historial de Preadmisiones",
            content: <PreadmissionTable />
        },
    ];

    const items = steps.map((step, index) => ({
        label: step.label,
        command: () => setActiveIndex(index)
    }));

    return (<>
        <Button
            type="button"
            label="Ver Información del Paciente"
            onClick={showDialog}
            icon={<i className="fas fa-user me-2" />}
            className="btn btn-primary"
        />

        <Dialog
            visible={visible}
            onHide={hideDialog}
            header="Información del Paciente"
            position="center"
            style={{ width: '90vw', overflow: 'auto' }}
            footer={
                <div className="d-flex justify-content-between gap-2">
                    <Button
                        label="Cerrar"
                        className="btn btn-secondary"
                        onClick={hideDialog}
                    />
                    <div className="d-flex justify-content-end gap-2">
                        {activeIndex > 0 && (
                            <Button
                                label="Anterior"
                                className="btn btn-secondary"
                                onClick={() => setActiveIndex(activeIndex - 1)}
                            />
                        )}
                        {activeIndex < steps.length - 1 && (
                            <Button
                                label="Siguiente"
                                className="btn btn-primary"
                                onClick={() => setActiveIndex(activeIndex + 1)}
                            />
                        )}
                    </div>
                </div>
            }
        >
            <Steps
                model={items}
                activeIndex={activeIndex}
                onSelect={(e) => setActiveIndex(e.index)}
                readOnly={false}
                className="mb-4"
            />

            <Divider />

            <div className="mt-3">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className={index === activeIndex ? "" : "d-none"}
                    >
                        {step.content}
                    </div>
                ))}
            </div>
        </Dialog>
    </>);
};