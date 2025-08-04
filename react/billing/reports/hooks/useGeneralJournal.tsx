import React, { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';

export interface GeneralJournalResponse {
    fecha: string;
    numero_asiento: string;
    cuenta: string;
    debe: string;
    haber: string;
    descripcion: string;
    tercero: string;
}

export const useGeneralJournal = () => {
    const baseData: GeneralJournalResponse[] = []
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([]);

    const [generalJournal, setGeneralJournal] = useState<GeneralJournalResponse[]>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchGeneralJournal = async () => {
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            const data: GeneralJournalResponse[] = await service.getGeneralJournal({
                from: selectedDates ? selectedDates[0] : null,
                to: selectedDates ? selectedDates[1] : null
            });
            if (!data) {
                setGeneralJournal(baseData);
            }
            setGeneralJournal(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGeneralJournal();
    }, []);

    useEffect(() => {
        fetchGeneralJournal();
    }, [dateRange]);

    return {
        dateRange,
        setDateRange,
        generalJournal,
        fetchGeneralJournal,
        loading
    };
};
