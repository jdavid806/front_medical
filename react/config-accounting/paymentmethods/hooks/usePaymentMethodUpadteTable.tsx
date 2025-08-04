import React, { useState } from 'react';
import { paymentMethodService } from '../../../../services/api';
import { ErrorHandler } from '../../../../services/errorHandler';
import { UpdatePaymentMethodDTO } from '../interfaces/PaymentMethodDTO';

export const usePaymentMethodUpdate = () => {
    const [loading, setLoading] = useState(false);

    const updatePaymentMethod = async (id: string | number, data: UpdatePaymentMethodDTO) => {
        setLoading(true);
        try {
            const response = await paymentMethodService.updatePaymentMethod(id, data);
            console.log('responseUpdate', response);
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePaymentMethod,
        loading
    };
};