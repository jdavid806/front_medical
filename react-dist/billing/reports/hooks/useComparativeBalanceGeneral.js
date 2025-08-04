import { useState } from 'react';
import { ErrorHandler } from "../../../../services/errorHandler.js";
import { BillingReportService } from "../../../../services/api/classes/billingReportService.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
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
      control: []
    },
    totals_comparison: {
      assets: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      liabilities: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      equity: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      incomes: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      costs: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      expenses: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      memorandum: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      fiscal: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      },
      control: {
        total_period_1: 0,
        total_period_2: 0,
        difference: 0
      }
    },
    summary: {
      balance_period_1: 0,
      balance_period_2: 0,
      difference: 0,
      is_balanced: false,
      result_comparison: {
        period_1: 0,
        period_2: 0,
        difference: 0
      }
    }
  };
  const [dateRangePeriodOne, setDateRangePeriodOne] = useState([]);
  const [dateRangePeriodTwo, setDateRangePeriodTwo] = useState([]);
  const [comparativeBalanceGeneral, setComparativeBalanceGeneral] = useState(baseData);
  const [loading, setLoading] = useState(true);
  const fetchComparativeBalanceGeneral = async () => {
    try {
      const service = new BillingReportService();
      const selectedDatesPeriodOne = dateRangePeriodOne?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const selectedDatesPeriodTwo = dateRangePeriodTwo?.filter(date => !!date).map(date => date.toISOString().split("T")[0]);
      const data = await service.getComparativeBalanceGeneral({
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
          });
        }
        return;
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