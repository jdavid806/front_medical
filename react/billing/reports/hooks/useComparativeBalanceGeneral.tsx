import React, { useState, useEffect, useCallback } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';
import { Button } from 'primereact/button';

export interface ComparativeBalanceGeneralResponse {
    period_1: string;
    period_2: string;
    comparison: {
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
    totals_comparison: {
        assets: Assets;
        liabilities: Assets;
        equity: Assets;
        incomes: Assets;
        costs: Assets;
        expenses: Assets;
        memorandum: Assets;
        fiscal: Assets;
        control: Assets;
    };
    summary: {
        balance_period_1: number;
        balance_period_2: number;
        difference: number;
        is_balanced: boolean;
        result_comparison: {
            period_1: number;
            period_2: number;
            difference: number;
        };
    };
    message?: string;
}

interface Assets {
    total_period_1: number;
    total_period_2: number;
    difference: number;
}

interface Asset {
    account_code: string;
    account_name: string;
    balance_period_1: number;
    balance_period_2: number;
    difference: number;
}

export const useComparativeBalanceGeneral = () => {
    const baseData = {
        period_1: '',
        period_2: '',
        comparison: {
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
        totals_comparison: {
            assets: { total_period_1: 0, total_period_2: 0, difference: 0 },
            liabilities: { total_period_1: 0, total_period_2: 0, difference: 0 },
            equity: { total_period_1: 0, total_period_2: 0, difference: 0 },
            incomes: { total_period_1: 0, total_period_2: 0, difference: 0 },
            costs: { total_period_1: 0, total_period_2: 0, difference: 0 },
            expenses: { total_period_1: 0, total_period_2: 0, difference: 0 },
            memorandum: { total_period_1: 0, total_period_2: 0, difference: 0 },
            fiscal: { total_period_1: 0, total_period_2: 0, difference: 0 },
            control: { total_period_1: 0, total_period_2: 0, difference: 0 },
        },
        summary: {
            balance_period_1: 0,
            balance_period_2: 0,
            difference: 0,
            is_balanced: false,
            result_comparison: { period_1: 0, period_2: 0, difference: 0 },
        }
    }
    const [dateRangePeriodOne, setDateRangePeriodOne] = useState<Nullable<(Date | null)[]>>([]);
    const [dateRangePeriodTwo, setDateRangePeriodTwo] = useState<Nullable<(Date | null)[]>>([]);

    const [comparativeBalanceGeneral, setComparativeBalanceGeneral] = useState<ComparativeBalanceGeneralResponse>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchComparativeBalanceGeneral = async () => {
        try {
            const service = new BillingReportService();
            const selectedDatesPeriodOne = dateRangePeriodOne?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            const selectedDatesPeriodTwo = dateRangePeriodTwo?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])

            const data: ComparativeBalanceGeneralResponse = await service.getComparativeBalanceGeneral({
                from1: selectedDatesPeriodOne ? selectedDatesPeriodOne[0] : null,
                to1: selectedDatesPeriodOne ? selectedDatesPeriodOne[1] : null,
                from2: selectedDatesPeriodTwo ? selectedDatesPeriodTwo[0] : null,
                to2: selectedDatesPeriodTwo ? selectedDatesPeriodTwo[1] : null
            });

            if (!data.comparison) {
                setComparativeBalanceGeneral(baseData);

                if (data.message) {
                    SwalManager.error({
                        text: data.message
                    })
                }

                return
            }
            setComparativeBalanceGeneral(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    return {
        dateRangePeriodOne,
        setDateRangePeriodOne,
        dateRangePeriodTwo,
        setDateRangePeriodTwo,
        comparativeBalanceGeneral,
        fetchComparativeBalanceGeneral,
        loading
    };
};