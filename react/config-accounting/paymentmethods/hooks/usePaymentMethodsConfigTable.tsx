import { useState, useEffect, useCallback } from 'react';
import { paymentMethodService } from '../../../../services/api';

export interface PaymentMethodDTO {
    id: number;
    method: string;
    description: string;
    created_at: string;
    updated_at: string;
    account: string | null;
    accounting_account_id: number;
    category: string | null;
}

export const usePaymentMethodsConfigTable = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentMethods = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data: PaymentMethodDTO[] = await paymentMethodService.getPaymentMethods();
            setPaymentMethods(data);
        } catch (err) {
            setError('Error al cargar los métodos de pago');
        } finally {
            setLoading(false);
        }
    }, []);

    const refreshPaymentMethods = useCallback(async () => {
        console.log("🔄 Manual refresh triggered");
        await fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    return {
        paymentMethods,
        loading,
        error,
        refreshPaymentMethods
    };
};