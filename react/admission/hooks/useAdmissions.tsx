import { useState, useEffect } from 'react';
import { admissionService } from '../../../services/api';
import { cleanJsonObject } from '../../../services/utilidades';

export const useAdmissions = () => {
    const [admissions, setAdmissions] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchAdmissions = async (filters?: any) => {
        setLoading(true);
        try {
            const data = await admissionService.filterAdmissions(cleanJsonObject(filters));

            console.log(data);

            setTotalRecords(data.data.total);
            setAdmissions(data.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return { admissions, fetchAdmissions, totalRecords, loading };
};
