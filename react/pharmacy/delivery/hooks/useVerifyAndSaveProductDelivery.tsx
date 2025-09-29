import { suppliesService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";
import { ProductDeliveryDetailFormData } from "../ProductDeliveryDetail";

export const useVerifyAndSaveProductDelivery = () => {
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const verifyAndSaveProductDelivery = async (id: string, data: ProductDeliveryDetailFormData) => {
        try {
            const response = await suppliesService.validateSupply(id, { products_deposits: data.productsDeposits })
            showSuccessToast({
                title: "Exito",
                message: "Entrega exitosa"
            });
            return response;
        } catch (error) {
            console.error(error)
            showServerErrorsToast(error);
            throw error;
        }
    };

    return {
        verifyAndSaveProductDelivery,
        toast
    };
};
