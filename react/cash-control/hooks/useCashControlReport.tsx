import { useState, useEffect } from 'react';
import { cashControlService } from '../../../services/api';
import { ErrorHandler } from '../../../services/errorHandler';
import { CashControlReportItem } from '../../models/models';

export const useCashControlReport = () => {
    const [cashControlReportItems, setCashControlReportItems] = useState<CashControlReportItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCashControlReport = async () => {
        try {
            const data = await cashControlService.getAll();
            setCashControlReportItems(data.data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCashControlReport();
    }, []);

    return {
        cashControlReportItems,
        fetchCashControlReport,
        loading
    };
};