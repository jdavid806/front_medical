import React from "react";
import { useAccountingAccounts } from "./hooks/useAccountingAccounts";

export const AccountingAccountsTree: React.FC = () => {
    const {
        accounts: apiAccounts,
        isLoading,
        error,
        refreshAccounts,
    } = useAccountingAccounts();

    return (
        <div>
            aqui va el componente
        </div>
    );
};
