import { useState, useEffect } from 'react';
import { admissionService } from '../../../services/api';
import { cleanJsonObject } from '../../../services/utilidades';
import GeneralRequestService from '../../../services/api/classes/generalRequestService';

export const useRequests = () => {
    const [requests, setRequests] = useState<any[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async (filters?: any) => {
        setLoading(true);
        try {
            const service = new GeneralRequestService()
            const data = await service.filterRequests(cleanJsonObject(filters));

            console.log(data);

            setTotalRecords(data.total);
            setRequests(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return { requests, fetchRequests, totalRecords, loading };
};