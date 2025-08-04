import React, { useState } from "react";
import { ErrorHandler } from "../../../../services/errorHandler";
import { paymentMethodService } from "../../../../services/api";
import { PaymentMethodDTO } from "../interfaces/PaymentMethodDTO";

export const usePaymentMethodById = () => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPaymentMethodById = async (id: string) => {
        setLoading(true);
        try {
            const data = await paymentMethodService.getPaymentMethodById(id);
            setPaymentMethod(data);
            return data;
        } catch (err) {
            ErrorHandler.generic(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        paymentMethod,
        setPaymentMethod,
        fetchPaymentMethodById,
        loading
    };
};