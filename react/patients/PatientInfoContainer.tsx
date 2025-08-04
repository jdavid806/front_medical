import React from 'react'
import { PatientInfo } from './PatientInfo'
import { usePatient } from './hooks/usePatient';

interface PatientInfoContainerProps {
    patientId: string
}

export const PatientInfoContainer = ({ patientId }: PatientInfoContainerProps) => {
    const { patient, fetchPatient } = usePatient(patientId);

    return patient ? <PatientInfo requestRefresh={() => {fetchPatient();}} patient={patient} /> : <p>Cargando...</p>
}

