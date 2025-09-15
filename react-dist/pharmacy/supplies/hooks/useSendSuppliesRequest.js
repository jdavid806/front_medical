import { usePRToast } from "../../../hooks/usePRToast.js";
export const useSendSuppliesRequest = () => {
  const {
    toast,
    showSuccessToast,
    showFormErrorsToast
  } = usePRToast();
  const sendSuppliesRequest = data => {
    try {
      showSuccessToast({
        title: "Solicitud enviada",
        message: "Solicitud enviada exitosamente"
      });
    } catch (error) {
      showFormErrorsToast({
        errors: error
      });
    }
  };
  return {
    sendSuppliesRequest,
    toast
  };
};