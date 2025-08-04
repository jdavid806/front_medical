import { useState } from "react";
import { paymentMethodService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
import { ErrorHandler } from "../../../../services/errorHandler";

export const usePaymentMethodDelete = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deletePaymentMethod = async (id: string) => {
        setLoading(true);
        setError(null);
        
        try {
            await paymentMethodService.deletePaymentMethod(id);
            SwalManager.success("Método de pago eliminado correctamente");
            return true;
            
        } catch (error) {
            console.error("Error delete payment method:", error);
            ErrorHandler.getErrorMessage(error);
            SwalManager.error("Error al Eliminar método de pago");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        deletePaymentMethod,
    };
};