import { suppliesService } from "../../../../services/api/index.js";
import { usePRToast } from "../../../hooks/usePRToast.js";
export const useVerifyAndSaveProductDelivery = () => {
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const verifyAndSaveProductDelivery = async (id, data) => {
    try {
      const response = await suppliesService.validateSupply(id, {
        products_deposits: data.productsDeposits
      });
      showSuccessToast({
        title: "Exito",
        message: "Entrega exitosa"
      });
      return response;
    } catch (error) {
      console.error(error);
      showServerErrorsToast(error);
      throw error;
    }
  };
  return {
    verifyAndSaveProductDelivery,
    toast
  };
};