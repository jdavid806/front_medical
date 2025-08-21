import { useState } from "react";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";
import { CreatePaymentMethodDTO } from "../interfaces/PaymentMethodDTO";
import { paymentMethodService } from "../../../../services/api";

export const usePaymentMethodCreate = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const createPaymentMethod = async (data: CreatePaymentMethodDTO) => {
        setLoading(true);
        try {
            const response = await paymentMethodService.storePaymentMethod(data);
            console.log("response", response)
            SwalManager.success("Método de pago creado exitosamente");
            return response;
        } catch (error) {
            console.error("Error creating payment method:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al crear método de pago");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createPaymentMethod,
    };
};