import { suppliesService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";
import { SuppliesDeliveryFormData } from "../interfaces";

export const useSendSuppliesRequest = () => {
    const { toast, showSuccessToast, showFormErrorsToast } = usePRToast();

    const sendSuppliesRequest = async (data: SuppliesDeliveryFormData) => {
        try {
            await suppliesService.storeSupply(data)
            showSuccessToast({
                title: "Solicitud enviada",
                message: "Solicitud enviada exitosamente"
            });
        } catch (error) {
            console.error(error)
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
