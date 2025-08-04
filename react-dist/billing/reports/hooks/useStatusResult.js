import { useState } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useStatusResult = () => {
  const baseData = {
    periodo: {
      desde: "",
      hasta: ""
    },
    resumen: {
      ingresos: 0,
      costos: 0,
      gastos: 0,
      utilidad_bruta: 0,
      utilidad_neta: 0
    },
    detalles: [],
    cuentas: []
  };
  const [dateRange, setDateRange] = useState([]);
  const [statusResult, setStatusResult] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchStatusResult = async () => {
    try {
      const service = new BillingReportService();
      const selectedDates = dateRange?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const data = await service.getStatusResult({
        from: selectedDates ? selectedDates[0] : null,
        to: selectedDates ? selectedDates[1] : null
      });
      if (!data.detalles) {
        setStatusResult(baseData);
        if (data.message) {
          SwalManager.error({
            text: data.message
          });
        }
        return;
      }
      setStatusResult(data);
    } catch (err) {
      ErrorHandler.generic(err);
    } finally {
      setLoading(false);
    }
  };
  return {
    dateRange,
    setDateRange,
    statusResult,
    fetchStatusResult,
    loading
  };
};