import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../accounting/hooks/useAccountingAccounts.js";
export const AccountingAccountsRange = props => {
  const {
    startValue,
    endValue,
    handleStartChange,
    handleEndChange,
    optionLabel = 'label',
    optionValue = 'value',
    placeholder = 'Seleccione una cuenta contable',
    startLabel = 'Cuenta Inicial',
    endLabel = 'Cuenta Final'
  } = props;
  const [mappedAccounts, setMappedAccounts] = useState([]);
  const [filteredEndAccounts, setFilteredEndAccounts] = useState([]);
  const {
    accounts
  } = useAccountingAccounts();
  useEffect(() => {
    const mapped = accounts.map(account => ({
      ...account,
      label: account.account_code + ' - ' + account.account_name,
      value: account.id,
      account_code: account.account_code
    }));
    setMappedAccounts(mapped);
    setFilteredEndAccounts(mapped);
  }, [accounts]);

  // Filtrar cuentas finales basado en la cuenta inicial seleccionada
  useEffect(() => {
    if (startValue) {
      const selectedStartAccount = mappedAccounts.find(account => account.value === startValue);
      if (selectedStartAccount) {
        // Filtrar cuentas que tengan un código mayor o igual al inicial
        const filtered = mappedAccounts.filter(account => account.account_code >= selectedStartAccount.account_code);
        setFilteredEndAccounts(filtered);

        // Si la cuenta final actual es menor que la inicial, resetearla
        if (endValue) {
          const selectedEndAccount = mappedAccounts.find(account => account.value === endValue);
          if (selectedEndAccount && selectedEndAccount.account_code < selectedStartAccount.account_code) {
            handleEndChange({
              value: null
            });
          }
        }
      }
    } else {
      // Si no hay cuenta inicial, mostrar todas las cuentas
      setFilteredEndAccounts(mappedAccounts);
    }
  }, [startValue, mappedAccounts, endValue, handleEndChange]);
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "startAccount"
  }, startLabel), /*#__PURE__*/React.createElement(Dropdown, {
    id: "startAccount",
    value: startValue,
    onChange: handleStartChange,
    options: mappedAccounts,
    optionLabel: optionLabel,
    optionValue: optionValue,
    placeholder: placeholder,
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label",
    htmlFor: "endAccount"
  }, endLabel), /*#__PURE__*/React.createElement(Dropdown, {
    id: "endAccount",
    value: endValue,
    onChange: handleEndChange,
    options: filteredEndAccounts,
    optionLabel: optionLabel,
    optionValue: optionValue,
    placeholder: placeholder,
    className: "w-100",
    filter: true,
    showClear: true,
    disabled: !startValue // Opcional: deshabilitar hasta que se seleccione una cuenta inicial
  })));
};