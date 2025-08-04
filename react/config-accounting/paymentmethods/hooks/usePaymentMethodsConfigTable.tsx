import { useState, useEffect } from 'react';
import { paymentMethodService } from '../../../../services/api'; // Asegúrate de tener este servicio

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

    const fetchPaymentMethods = async () => {
        try {
            setLoading(true);
            setError(null);
            const data: PaymentMethodDTO[] = await paymentMethodService.getPaymentMethods();
            setPaymentMethods(data);
        } catch (err) {
            console.error('Error fetching payment methods:', err);
            setError('Error al cargar los métodos de pago');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return { 
        paymentMethods, 
        loading, 
        error, 
        refreshPaymentMethods: fetchPaymentMethods 
    };
};