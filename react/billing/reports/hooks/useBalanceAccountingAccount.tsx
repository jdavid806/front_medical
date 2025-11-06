import React, { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';

export type BalanceCuentaContable = {
    cuenta_id: number;
    cuenta_codigo: string;
    cuenta_nombre: string;
    saldo_inicial: string;
    debe_total: number;
    haber_total: number;
    saldo_final: number;
};

export const useBalanceAccountingAccount = () => {
    const baseData: BalanceCuentaContable[] = []
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);
    const [accountId, setAccountId] = useState<string | null>(null);

    const [balanceAccountingAccount, setBalanceAccountingAccount] = useState<BalanceCuentaContable[]>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchBalanceAccountingAccount = async () => {
        setLoading(true);
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            if (!selectedDates || selectedDates.length !== 2) {
                return;
            }
            const data: BalanceCuentaContable[] = await service.getBalanceAccountingAccount({
                from: selectedDates[0],
                to: selectedDates[1],
                accounting_account_id: accountId
            });
            if (!data) {
                setBalanceAccountingAccount(baseData);
            }
            setBalanceAccountingAccount(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalanceAccountingAccount();
    }, []);

    useEffect(() => {
        fetchBalanceAccountingAccount();
    }, [dateRange, accountId]);

    return {
        dateRange,
        setDateRange,
        accountId,
        setAccountId,
        balanceAccountingAccount,
        fetchBalanceAccountingAccount,
        loading
    };
};
