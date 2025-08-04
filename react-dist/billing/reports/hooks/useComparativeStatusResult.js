import { useState } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useComparativeStatusResult = () => {
  const baseData = {
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
  const [dateRangePeriodOne, setDateRangePeriodOne] = useState([]);
  const [dateRangePeriodTwo, setDateRangePeriodTwo] = useState([]);
  const [comparativeStatusResult, setComparativeStatusResult] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchComparativeStatusResult = async () => {
    try {
      const service = new BillingReportService();
      const selectedDatesPeriodOne = dateRangePeriodOne?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const selectedDatesPeriodTwo = dateRangePeriodTwo?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const data = await service.getComparativeStatusResult({
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
          });
        }
        return;
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