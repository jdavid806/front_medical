import React, { useEffect, useState } from "react";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";
// import { ResolvePrescriptionCancellationRequestForm } from "../general-request/components/ResolvePrescriptionCancellationRequestForm";
// import { VerifySupervisorForm } from "../users/VerifySupervisorForm";

interface TableItem {
    id: string;
    prescriptionNumber: string;
    patientName: string;
    patientId: string;
    doctorName: string;
    medication: string;
    dosage: string;
    reason: string;
    requestId: string;
    prescriptionId: string;
    requestedBy: string;
    requestedAt: string;
    status: string;
}

// Datos mockeados
const mockPrescriptions: TableItem[] = [
    {
        id: "1",
        prescriptionNumber: "REC-2024-001",
        patientName: "Juan Pérez García",
        patientId: "P-12345",
        doctorName: "Dra. María Rodríguez López",
        medication: "Paracetamol 500mg",
        dosage: "1 tableta cada 8 horas",
        reason: "Error en la dosificación prescrita",
        requestId: "REQ-001",
        prescriptionId: "PRESC-001",
        requestedBy: "Lic. Ana Martínez",
        requestedAt: "2024-01-15",
        status: "Pendiente"
    },
    {
        id: "2",
        prescriptionNumber: "REC-2024-002",
        patientName: "Ana García Hernández",
        patientId: "P-12346",
        doctorName: "Dr. Carlos Sánchez Méndez",
        medication: "Amoxicilina 250mg",
        dosage: "1 cápsula cada 12 horas",
        reason: "Paciente presenta alergia al medicamento",
        requestId: "REQ-002",
        prescriptionId: "PRESC-002",
        requestedBy: "Lic. Pedro Ramírez",
        requestedAt: "2024-01-16",
        status: "Pendiente"
    },
    {
        id: "3",
        prescriptionNumber: "REC-2024-003",
        patientName: "Luis Fernández Castro",
        patientId: "P-12347",
        doctorName: "Dra. Elena Morales Ruiz",
        medication: "Ibuprofeno 400mg",
        dosage: "1 tableta cada 6 horas",
        reason: "Interacción medicamentosa detectada",
        requestId: "REQ-003",
        prescriptionId: "PRESC-003",
        requestedBy: "Lic. Sofía Vargas",
        requestedAt: "2024-01-17",
        status: "Pendiente"
    }
];

export const PrescriptionCancellationRequest = () => {

        <h1>Hola mundo</h1>
    
};