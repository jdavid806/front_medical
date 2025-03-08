import React from 'react'
import { PatientInfo } from './PatientInfo'
import { usePatient } from './hooks/usePatient';

interface PatientInfoContainerProps {
    patientId: string
}

export const PatientInfoContainer = ({ patientId }: PatientInfoContainerProps) => {
    const { patient } = usePatient(patientId);

    return patient ? <PatientInfo patient={patient} /> : <p>Cargando...</p>
}

