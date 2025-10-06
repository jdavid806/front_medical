import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { PatientClinicalRecordDto } from '../../models/models';
import { clinicalRecordService } from '../../../services/api';
import { cleanJsonObject } from '../../../services/utilidades';

export const useClinicalRecordsPendingReview = () => {
    const [clinicalRecords, setClinicalRecords] = useState<PatientClinicalRecordDto[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchClinicalRecords = async ({ search = "", per_page = 10, page = 1, hasLatestPendingReviewRequest = "", patientId = "", forCurrentUserRole = "" }) => {
        setLoading(true);
        try {
            let data = await clinicalRecordService.filterClinicalRecords(cleanJsonObject({ search, per_page, page, hasLatestPendingReviewRequest, patientId, forCurrentUserRole }));
            setTotalRecords(data.data.total);
            setClinicalRecords(data.data.data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        clinicalRecords,
        fetchClinicalRecords,
        totalRecords,
        loading
    };
};
