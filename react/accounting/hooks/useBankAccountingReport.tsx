import { useState } from "react";
import { CuentaContable, MetodoPago } from "../types/bankTypes";
import BillingReportService from "../../../services/api/classes/billingReportService";

export const useBankAccountingReport = () => {
    const [metodosPago, setMetodosPago] = useState<MetodoPago[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchBankAccountingReport = async ({ from, to }: { from: string; to: string }) => {
        try {
            setLoading(true);
            const service = new BillingReportService();
            const response = await service.getBankAccountingReport({ from, to });
            setMetodosPago(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        metodosPago,
        fetchBankAccountingReport,
        loading
    };
};
