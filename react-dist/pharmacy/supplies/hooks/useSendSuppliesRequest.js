import { suppliesService } from "../../../../services/api/index.js";
import { usePRToast } from "../../../hooks/usePRToast.js";
export const useSendSuppliesRequest = () => {
  const {
    toast,
    showSuccessToast,
    showFormErrorsToast
  } = usePRToast();
  const sendSuppliesRequest = async data => {
    try {
      await suppliesService.storeSupply(data);
      showSuccessToast({
        title: "Solicitud enviada",
        message: "Solicitud enviada exitosamente"
      });
    } catch (error) {
      console.error(error);
      showFormErrorsToast({
        errors: error
      });
      throw error;
    }
  };
  return {
    sendSuppliesRequest,
    toast
  };
};