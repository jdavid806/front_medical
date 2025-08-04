import { useState, useEffect } from 'react';
import { patientService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { Patient } from '../../models/models';
import { cleanJsonObject } from '../../../services/utilidades';
import { set } from 'react-hook-form';

export const usePatientsByFilters = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchPatientsByFilters = async ({ search = "", per_page = 10, page = 1 }) => {
        setLoading(true);
        try {
            const data = await patientService.getByFilters(cleanJsonObject({ search, per_page, page }));
            const mappedData: Patient[] = data.data.data.map((item: Patient) => {
                return {
                    ...item,
                    label: `${item.first_name} ${item.middle_name} ${item.last_name} ${item.second_last_name}`,
                };
            });

            setTotalRecords(data.data.total);
            setPatients(mappedData);
        } catch (err) {
            console.error(err);
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        patients,
        fetchPatientsByFilters,
        totalRecords,
        loading
    };
};
