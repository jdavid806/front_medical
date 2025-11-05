import { invoiceService } from "../../../services/api/index.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useStoreInvoiceSale = () => {
  const {
    showServerErrorsToast,
    toast
  } = usePRToast();
  const storeInvoiceSale = async data => {
    try {
      const response = await invoiceService.storeSale(data);
      return response;
    } catch (error) {
      console.log(error);
      showServerErrorsToast(error);
      throw error;
    }
  };
  return {
    storeInvoiceSale,
    toastRef: toast
  };
};