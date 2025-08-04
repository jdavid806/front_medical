import { useState, useEffect } from 'react';
import { patientService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { Patient } from '../../models/models';

export const usePatients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const data = await patientService.active();
            const mappedData: Patient[] = data.map((item: Patient) => {
                return {
                    ...item,
                    label: `${item.first_name} ${item.middle_name} ${item.last_name} ${item.second_last_name}`,
                };
            });

            setPatients(mappedData);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return {
        patients,
        fetchPatients,
        loading
    };
};
