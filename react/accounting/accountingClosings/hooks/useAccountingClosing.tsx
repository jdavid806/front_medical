import React, { useState } from "react";
import { AccountingClosing } from "./useAccountingClosings";
import AccountingClosingsService from "../../../../services/api/classes/accountingClosingsService";
import { ErrorHandler } from "../../../../services/errorHandler";

export interface UseAccountingClosingResponse {
    data: AccountingClosing
}

export const useAccountingClosing = () => {
    const [accountingClosing, setAccountingClosing] = useState<UseAccountingClosingResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAccountingClosing = async (id: string) => {
        try {
            const service = new AccountingClosingsService();
            const data: UseAccountingClosingResponse = await service.get(id);
            setAccountingClosing(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        accountingClosing,
        setAccountingClosing,
        fetchAccountingClosing,
        loading
    };
};
