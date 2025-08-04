import { useState } from 'react';
import { SwalManager } from '../../../../services/alertManagerImported';
import { ErrorHandler } from '../../../../services/errorHandler';
import { accountingVouchersService } from '../../../../services/api';

export const useAccountingVoucherDelete = () => {
    const [loading, setLoading] = useState(false);

    const deleteAccountingVoucher = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await accountingVouchersService.delete(id);
                    confirmed = true
                }
            )
            return confirmed
        } catch (err) {
            ErrorHandler.generic(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteAccountingVoucher,
        loading
    };
};
