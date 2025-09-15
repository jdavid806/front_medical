import { usePRToast } from "../../../hooks/usePRToast";
import { SuppliesDeliveryFormData } from "../interfaces";

export const useSendSuppliesRequest = () => {
    const { toast, showSuccessToast, showFormErrorsToast } = usePRToast();

    const sendSuppliesRequest = (data: SuppliesDeliveryFormData) => {
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
