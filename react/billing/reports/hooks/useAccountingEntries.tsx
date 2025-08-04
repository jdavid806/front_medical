import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import BillingReportService from '../../../../services/api/classes/billingReportService';

export interface AccountingEntry {
    id: number;
    accounting_account_id: number;
    accounting_account: {
        id: number;
        account_code: string;
        account_name: string;
        status: string;
        initial_balance: string;
        account_type: string;
        account: string;
        sub_account: string;
        sub_account_name?: string | null;
        auxiliary: string;
        auxiliary_name?: string | null;
        sub_auxiliary: string;
        sub_auxiliary_name?: string | null;
        category?: string | null;
        balance: string;
        created_at: string;
        updated_at: string;
    };
    accounting_entry_id: number;
    type: "debit" | "credit";
    amount: string;
    entry_date: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface AccountingEntryResponse {
    data: AccountingEntry[]
}

export const useAccountingEntries = () => {
    const baseData: AccountingEntryResponse = { data: [] };

    const [accountingEntries, setAccountingEntries] = useState<AccountingEntryResponse>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchAccountingEntries = async () => {
        try {
            const service = new BillingReportService();
            const data: AccountingEntryResponse = await service.getAccountingEntries();
            if (!data.data) {
                setAccountingEntries(baseData);
            }
            setAccountingEntries(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountingEntries();
    }, []);

    return {
        accountingEntries,
        fetchAccountingEntries,
        loading
    };
};

