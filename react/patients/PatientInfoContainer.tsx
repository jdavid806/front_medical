import React from 'react'
import { PatientInfo } from './PatientInfo'
import { usePatient } from './hooks/usePatient';

interface PatientInfoContainerProps {
    patientId: string
    hideEditButton?: boolean; 
}

export const PatientInfoContainer = ({ patientId, hideEditButton = false }: PatientInfoContainerProps) => {
    const { patient, fetchPatient } = usePatient(patientId);

    return patient ? (
        <PatientInfo
            requestRefresh={() => { fetchPatient(); }}
            patient={patient}
            hideEditButton={hideEditButton} 
        />
    ) : (
        <p>Cargando...</p>
    )
}