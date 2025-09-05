import { useState } from "react";
import { AccountingAccountFormModalData } from "../AccountingAccountFormModal";
import { accountingAccountsService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { ErrorHandler } from "../../../services/errorHandler";
import { EditAccountingAccountFormModalData } from "../EditAccountingAccountFormModal";

export const useAccountingAccountUpdate = () => {
    const [loading, setLoading] = useState(false);

    const updateAccount = async (account: EditAccountingAccountFormModalData) => {
        setLoading(true);
        try {
            const response = await accountingAccountsService.updateAccount(account.id, account);
            SwalManager.success()
            return response
        } catch (error) {
            console.log(error);
            ErrorHandler.generic(error)
            throw error
        } finally {
            setLoading(false)
        }
    };

    return {
        loading,
        updateAccount,
    };
};