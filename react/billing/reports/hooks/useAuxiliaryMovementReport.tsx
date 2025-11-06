import { useState } from "react";
import BillingReportService from "../../../../services/api/classes/billingReportService";
import { CuentaContable } from "../../../accounting/types/bankTypes";

export const useAuxiliaryMovementReport = () => {
    const [cuentasContables, setCuentasContables] = useState<CuentaContable[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAuxiliaryMovementReport = async ({ from, to }: { from: string; to: string }) => {
        try {
            setLoading(true);
            const service = new BillingReportService();
            const response = await service.getAuxiliaryMovementReport({ from, to });
            setCuentasContables(response);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        cuentasContables,
        fetchAuxiliaryMovementReport,
        loading
    };
};
