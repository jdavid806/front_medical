import { suppliesService } from "../../../../services/api";
import { usePRToast } from "../../../hooks/usePRToast";
import { MedicationDeliveryDetailFormData } from "../MedicationDeliveryDetail";

export const useVerifyAndSaveMedicationDelivery = () => {
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const verifyAndSaveMedicationDelivery = async (id: string, data: MedicationDeliveryDetailFormData) => {
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
        verifyAndSaveMedicationDelivery,
        toast
    };
};
