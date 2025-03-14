import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { PatientClinicalRecordDto } from '../../models/models';
import { clinicalRecordService } from '../../../services/api';

export const useClinicalRecords = (patientId: string) => {
    const [clinicalRecords, setClinicalRecords] = useState<PatientClinicalRecordDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchClinicalRecords = async (patientId: string) => {
        if (!patientId) {
            return;
        }
        try {
            let data: PatientClinicalRecordDto[] = await clinicalRecordService.ofParent(patientId);
            setClinicalRecords(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClinicalRecords(patientId);
    }, []);

    return {
        clinicalRecords,
        fetchClinicalRecords,
        loading
    };
};
