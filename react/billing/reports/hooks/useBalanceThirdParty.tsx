import React, { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';

export interface ThirdPartyBalance {
    tercero_id: number;
    tercero_nombre: string;
    debe_total: number;
    haber_total: number;
    saldo_final: number;
}

export const useBalanceThirdParty = () => {
    const baseData: ThirdPartyBalance[] = []
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([
        new Date(),
        new Date()
    ]);
    const [thirdPartyId, setThirdPartyId] = useState<string | null>(null);
    const [startAccount, setStartAccount] = useState<string | null>(null);
    const [endAccount, setEndAccount] = useState<string | null>(null);

    const [balanceThirdParty, setBalanceThirdParty] = useState<ThirdPartyBalance[]>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchBalanceThirdParty = async () => {
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            if (!selectedDates || selectedDates.length !== 2) {
                return;
            }
            const data: ThirdPartyBalance[] = await service.getBalanceThirdParty({
                from: selectedDates[0],
                to: selectedDates[1],
                third_party_id: thirdPartyId,
                account_from: startAccount,
                account_to: endAccount
            });
            if (!data) {
                setBalanceThirdParty(baseData);
            }
            setBalanceThirdParty(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalanceThirdParty();
    }, []);

    useEffect(() => {
        fetchBalanceThirdParty();
    }, [dateRange, thirdPartyId, startAccount, endAccount]);

    return {
        dateRange,
        setDateRange,
        thirdPartyId,
        setThirdPartyId,
        startAccount,
        endAccount,
        setStartAccount,
        setEndAccount,
        balanceThirdParty,
        fetchBalanceThirdParty,
        loading
    };
};
