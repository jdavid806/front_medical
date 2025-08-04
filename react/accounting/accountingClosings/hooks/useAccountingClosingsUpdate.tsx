import React, { useState } from 'react';
import AccountingClosingsService from '../../../../services/api/classes/accountingClosingsService';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';
import { AccountingClosingFormInputs } from '../form/AccountingClosingForm';

export const useAccountingClosingsUpdate = () => {
    const [loading, setLoading] = useState(true);

    const updateAccountingClosing = async (id: string, data: Omit<AccountingClosingFormInputs, 'id'>) => {
        setLoading(true);
        try {
            const service = new AccountingClosingsService();
            const response = await service.update(id, data);
            SwalManager.success();
            return response;
        } catch (error) {
            ErrorHandler.generic(error);
            throw error
        } finally {
            setLoading(false);
        }
    };

    return {
        updateAccountingClosing,
        loading
    };
};
