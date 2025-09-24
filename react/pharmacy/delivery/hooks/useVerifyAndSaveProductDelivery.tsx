import { suppliesService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";

export const useVerifyAndSaveProductDelivery = () => {
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const verifyAndSaveProductDelivery = async (id: string) => {
        try {
            const response = await suppliesService.validateSupply(id, {})
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
