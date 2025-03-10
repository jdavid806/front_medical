import { useState, useEffect } from 'react';
import { patientService } from '../../../services/api/index';

export const usePatient = (patientId: string) => {
    const [patient, setPatient] = useState<any>(null);

    const fetchPatient = async () => {
        const patient = await patientService.get(patientId);
        setPatient(patient);
    };

    useEffect(() => {
        fetchPatient();
    }, [patientId]);

    return { patient, fetchPatient };
};
