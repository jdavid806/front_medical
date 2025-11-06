import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts.js";
export const AccountingAccountsDropdown = props => {
  const {
    value,
    handleChange,
    optionLabel = 'label',
    optionValue = 'value',
    placeholder = 'Seleccione una cuenta contable',
    label = 'Cuenta Contable'
  } = props;
  const [mappedAccounts, setMappedAccounts] = useState([]);
  const {
    accounts
  } = useAccountingAccounts();
  useEffect(() => {
    const mapped = accounts.map(account => ({
      ...account,
      label: account.account_code + ' - ' + account.account_name,
      value: account.id
    }));
    setMappedAccounts(mapped);
  }, [accounts]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "account"
  }, label), /*#__PURE__*/React.createElement(Dropdown, {
    id: "account",
    value: value,
    onChange: handleChange,
    options: mappedAccounts,
    optionLabel: optionLabel,
    optionValue: optionValue,
    placeholder: placeholder,
    className: "w-100",
    filter: true,
    showClear: true
  })));
};