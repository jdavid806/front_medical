import { useState } from 'react';
import { patientService } from '../../../services/api/index';

export const usePatientById = () => {
    const [patient, setPatient] = useState<any>(null);

    const fetchPatientById = async (patientId: string) => {
        const patient = await patientService.get(patientId);
        setPatient(patient);
    };

    return { patient, fetchPatientById };
};
