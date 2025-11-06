import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts";

interface AccountingAccountsDropdownProps {
    value: any;
    handleChange: (e: any) => void;
    optionLabel?: string;
    optionValue?: string;
    placeholder?: string;
    label?: string;
}

export const AccountingAccountsDropdown: React.FC<AccountingAccountsDropdownProps> = (props) => {

    const {
        value,
        handleChange,
        optionLabel = 'label',
        optionValue = 'value',
        placeholder = 'Seleccione una cuenta contable',
        label = 'Cuenta Contable'
    } = props;

    const [mappedAccounts, setMappedAccounts] = useState<any[]>([]);

    const { accounts } = useAccountingAccounts();

    useEffect(() => {
        const mapped = accounts.map((account) => ({
            ...account,
            label: account.account_code + ' - ' + account.account_name,
            value: account.id
        }));
        setMappedAccounts(mapped);
    }, [accounts]);

    return (<>
        <div className="d-flex flex-column">
            <label className="form-label" htmlFor="account">{label}</label>
            <Dropdown
                id="account"
                value={value}
                onChange={handleChange}
                options={mappedAccounts}
                optionLabel={optionLabel}
                optionValue={optionValue}
                placeholder={placeholder}
                className="w-100"
                filter
                showClear
            />
        </div>
    </>);
};