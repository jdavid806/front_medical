import React, { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';

export interface BalanceGeneralResponse {
    categories: {
        assets: Asset[];
        liabilities: Asset[];
        equity: Asset[];
        incomes: Asset[];
        costs: Asset[];
        expenses: Asset[];
        memorandum: Asset[];
        fiscal: Asset[];
        control: Asset[];
    };
    totals: {
        assets: number;
        liabilities: number;
        equity: number;
        incomes: number;
        costs: number;
        expenses: number;
        memorandum: number;
        fiscal: number;
        control: number;
    };
    is_balanced: boolean;
    difference: number;
    message?: string;
}

interface Asset {
    account_code: string;
    account_name: string;
    balance: number;
}

export const useBalanceGeneral = () => {
    const baseData = {
        categories: {
            assets: [],
            liabilities: [],
            equity: [],
            incomes: [],
            costs: [],
            expenses: [],
            memorandum: [],
            fiscal: [],
            control: [],
        },
        totals: {
            assets: 0,
            liabilities: 0,
            equity: 0,
            incomes: 0,
            costs: 0,
            expenses: 0,
            memorandum: 0,
            fiscal: 0,
            control: 0,
        },
        is_balanced: false,
        difference: 0
    }
    const [dateRange, setDateRange] = useState<Nullable<(Date | null)[]>>([]);

    const [balanceGeneral, setBalanceGeneral] = useState<BalanceGeneralResponse>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchBalanceGeneral = async () => {
        try {
            const service = new BillingReportService();
            const selectedDates = dateRange?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            const data: BalanceGeneralResponse = await service.getBalanceGeneral({
                from: selectedDates ? selectedDates[0] : null,
                to: selectedDates ? selectedDates[1] : null
            });
            if (!data.categories) {
                setBalanceGeneral(baseData);

                if (data.message) {
                    SwalManager.error({
                        text: data.message
                    })
                }

                return
            }
            setBalanceGeneral(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalanceGeneral();
    }, []);

    useEffect(() => {
        fetchBalanceGeneral();
    }, [dateRange]);

    return {
        dateRange,
        setDateRange,
        balanceGeneral,
        fetchBalanceGeneral,
        loading
    };
};