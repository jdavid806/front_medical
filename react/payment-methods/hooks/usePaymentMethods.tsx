import { useState, useEffect } from 'react';
import { ErrorHandler } from '../../../services/errorHandler';
import { paymentMethodService } from '../../../services/api';

export const usePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPaymentMethods = async () => {
        try {
            let data: any[] = await paymentMethodService.getAll();
            setPaymentMethods(data);
        } catch (err) {
            ErrorHandler.generic(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    return {
        paymentMethods,
        setPaymentMethods,
        fetchPaymentMethods,
        loading
    };
};
