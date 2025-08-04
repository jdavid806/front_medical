import React, { useState, useEffect, useCallback } from 'react';
import { ErrorHandler } from '../../../../services/errorHandler';
import { BillingReportService } from '../../../../services/api/classes/billingReportService';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { SwalManager } from '../../../../services/alertManagerImported';
import { Button } from 'primereact/button';

export interface ComparativeStatusResultResponse {
    periodo: {
        desde: Desde;
        hasta: Desde;
    };
    resumen: {
        ingresos: Ingresos;
        costos: Ingresos;
        gastos: Ingresos;
        utilidad_bruta: Ingresos;
        utilidad_neta: Ingresos;
    };
    detalles: Detalles;
    cuentas: Detalles;
    message?: string
}

interface Detalles {
    current: any[];
    previous: any[];
    difference: null;
    percentage_change: null;
}

interface Ingresos {
    current: number;
    previous: number;
    difference: number;
    percentage_change: null;
}

interface Desde {
    current: string;
    previous: string;
    difference: null;
    percentage_change: null;
}

export const useComparativeStatusResult = () => {
    const baseData: ComparativeStatusResultResponse = {
        periodo: {
            desde: {
                current: "",
                previous: "",
                difference: null,
                percentage_change: null
            },
            hasta: {
                current: "",
                previous: "",
                difference: null,
                percentage_change: null
            }
        },
        resumen: {
            ingresos: {
                current: 0,
                previous: 0,
                difference: 0,
                percentage_change: null
            },
            costos: {
                current: 0,
                previous: 0,
                difference: 0,
                percentage_change: null
            },
            gastos: {
                current: 0,
                previous: 0,
                difference: 0,
                percentage_change: null
            },
            utilidad_bruta: {
                current: 0,
                previous: 0,
                difference: 0,
                percentage_change: null
            },
            utilidad_neta: {
                current: 0,
                previous: 0,
                difference: 0,
                percentage_change: null
            }
        },
        detalles: {
            current: [],
            previous: [],
            difference: null,
            percentage_change: null
        },
        cuentas: {
            current: [],
            previous: [],
            difference: null,
            percentage_change: null
        }
    };

    const [dateRangePeriodOne, setDateRangePeriodOne] = useState<Nullable<(Date | null)[]>>([]);
    const [dateRangePeriodTwo, setDateRangePeriodTwo] = useState<Nullable<(Date | null)[]>>([]);

    const [comparativeStatusResult, setComparativeStatusResult] = useState<ComparativeStatusResultResponse>(baseData);
    const [loading, setLoading] = useState(true);

    const fetchComparativeStatusResult = async () => {
        try {
            const service = new BillingReportService();
            const selectedDatesPeriodOne = dateRangePeriodOne?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])
            const selectedDatesPeriodTwo = dateRangePeriodTwo?.filter((date) => !!date).map((date) => date.toISOString().split("T")[0])

            const data: ComparativeStatusResultResponse = await service.getComparativeStatusResult({
                from1: selectedDatesPeriodOne ? selectedDatesPeriodOne[0] : null,
                to1: selectedDatesPeriodOne ? selectedDatesPeriodOne[1] : null,
                from2: selectedDatesPeriodTwo ? selectedDatesPeriodTwo[0] : null,
                to2: selectedDatesPeriodTwo ? selectedDatesPeriodTwo[1] : null
            });

            if (!data.periodo) {
                setComparativeStatusResult(baseData);

                if (data.message) {
                    SwalManager.error({
                        text: data.message
                    })
                }

                return
            }
            setComparativeStatusResult(data);
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
        comparativeStatusResult,
        fetchComparativeStatusResult,
        loading
    };
};