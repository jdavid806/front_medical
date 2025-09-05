import { useState } from "react";
import { AccountingAccountFormModalData } from "../AccountingAccountFormModal";
import { accountingAccountsService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { ErrorHandler } from "../../../services/errorHandler";

export const useAccountingAccountCreate = () => {
    const [loading, setLoading] = useState(false);

    const createAccount = async (account: AccountingAccountFormModalData) => {
        setLoading(true);
        try {
            const response = await accountingAccountsService.createAccount(account);
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
        createAccount,
    };
};
