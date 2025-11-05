function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
import { taxesService } from "../../../../services/api/index.js";
const RetentionFormConfig = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  const {
    accounts,
    isLoading: isLoadingAccounts
  } = useAccountingAccounts();
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    watch
  } = useForm({
    defaultValues: initialData || {
      name: "",
      percentage: 0,
      accounting_account_id: null,
      accounting_account_reverse_id: null,
      sell_accounting_account_id: null,
      sell_reverse_accounting_account_id: null,
      description: ""
    }
  });

  // Watch para las cuentas seleccionadas actualmente
  const selectedPurchaseAccount = watch("accounting_account_id");
  const selectedPurchaseReverseAccount = watch("accounting_account_reverse_id");
  const selectedSellAccount = watch("sell_accounting_account_id");
  const selectedSellReverseAccount = watch("sell_reverse_accounting_account_id");
  const [taxes, setTaxes] = React.useState([]);
  const [selectedTax, setSelectedTax] = React.useState(null);
  const onFormSubmit = data => {
    onSubmit(data);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        percentage: initialData.percentage || 0,
        accounting_account_id: initialData.accounting_account_id || null,
        accounting_account_reverse_id: initialData.accounting_account_reverse_id || null,
        sell_accounting_account_id: initialData.sell_accounting_account_id || null,
        sell_reverse_accounting_account_id: initialData.sell_reverse_accounting_account_id || null,
        description: initialData.description || "",
        tax_id: initialData.tax_id || null
      });
    } else {
      reset({
        name: "",
        percentage: 0,
        accounting_account_id: null,
        accounting_account_reverse_id: null,
        sell_accounting_account_id: null,
        sell_reverse_accounting_account_id: null,
        description: ""
      });
    }
  }, [initialData, reset]);
  useEffect(() => {
    fetchTaxes();
  }, []);

  // Función auxiliar para encontrar una cuenta por ID
  const findAccountById = accountId => {
    if (!accountId || !accounts) return null;
    return accounts.find(account => account.id === accountId) || null;
  };
  async function fetchTaxes() {
    try {
      const taxes = await taxesService.getAll();
      setTaxes(taxes.data);
    } catch (error) {
      console.error("Error fetching taxes:", error);
    }
  }

  // FUNCIONES MEJORADAS PARA GARANTIZAR QUE LAS CUENTAS SELECCIONADAS SIEMPRE ESTÉN EN LAS OPCIONES
  const getPurchaseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    const selectedAccount = selectedPurchaseAccount ? findAccountById(selectedPurchaseAccount) : null;
    const accountsList = [...accounts];

    // Si la cuenta seleccionada no está en la lista principal, la agregamos
    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }
    return accountsList;
  };
  const getPurchaseReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    const selectedAccount = selectedPurchaseReverseAccount ? findAccountById(selectedPurchaseReverseAccount) : null;
    const accountsList = [...accounts];
    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }
    return accountsList;
  };
  const getSellAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    const selectedAccount = selectedSellAccount ? findAccountById(selectedSellAccount) : null;
    const accountsList = [...accounts];
    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }
    return accountsList;
  };
  const getSellReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    const selectedAccount = selectedSellReverseAccount ? findAccountById(selectedSellReverseAccount) : null;
    const accountsList = [...accounts];
    if (selectedAccount && !accountsList.some(acc => acc.id === selectedAccount.id)) {
      accountsList.push(selectedAccount);
    }
    return accountsList;
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "font-medium block mb-2"
  }, "Nombre de la Retenci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre de la retención es requerido",
      maxLength: {
        value: 100,
        message: "El nombre no puede exceder 100 caracteres"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name
    }, field, {
      className: classNames({
        "p-invalid": fieldState.error
      }),
      placeholder: "Ingrese el nombre de la retenci\xF3n"
    })), getFormErrorMessage("name"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "percentage",
    className: "font-medium block mb-2"
  }, "Porcentaje (%) *"), /*#__PURE__*/React.createElement(Controller, {
    name: "percentage",
    control: control,
    rules: {
      required: "El porcentaje es requerido",
      min: {
        value: 0,
        message: "El porcentaje no puede ser negativo"
      },
      max: {
        value: 100,
        message: "El porcentaje no puede ser mayor a 100"
      }
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
      id: field.name,
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      mode: "decimal",
      min: 0,
      max: 100,
      suffix: "%",
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      placeholder: "Ej: 10"
    }), getFormErrorMessage("percentage"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tax_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Impuesto *"), /*#__PURE__*/React.createElement(Controller, {
    name: "tax_id",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: taxes,
      optionValue: "id",
      optionLabel: "name",
      placeholder: "Seleccione un impuesto",
      filter: true,
      showClear: true,
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      loading: isLoadingAccounts,
      appendTo: "self"
    }), getFormErrorMessage("tax_id"))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-medium block mb-2 fw-bold"
  }, "Configuraci\xF3n Compras *")), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accounting_account_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Compras *"), /*#__PURE__*/React.createElement(Controller, {
    name: "accounting_account_id",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: getPurchaseAccounts(),
      optionValue: "id",
      optionLabel: "account_label",
      placeholder: "Seleccione una cuenta",
      filter: true,
      showClear: true,
      className: classNames("w-full"),
      loading: isLoadingAccounts,
      appendTo: "self"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accounting_account_reverse_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Reversa Compras *"), /*#__PURE__*/React.createElement(Controller, {
    name: "accounting_account_reverse_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: getPurchaseReverseAccounts(),
      optionValue: "id",
      optionLabel: "account_label",
      placeholder: "Seleccione una cuenta",
      filter: true,
      filterBy: "account_label,account_name,account_code",
      showClear: true,
      className: classNames("w-full"),
      loading: isLoadingAccounts,
      appendTo: "self"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-medium block mb-2 fw-bold"
  }, "Configuraci\xF3n Ventas *")), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sell_accounting_account_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Ventas *"), /*#__PURE__*/React.createElement(Controller, {
    name: "sell_accounting_account_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: getSellAccounts(),
      optionValue: "id",
      optionLabel: "account_label",
      placeholder: "Seleccione una cuenta",
      filter: true,
      filterBy: "account_label,account_name,account_code",
      showClear: true,
      className: classNames("w-full"),
      loading: isLoadingAccounts,
      appendTo: "self"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sell_reverse_accounting_account_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Reversa Ventas *"), /*#__PURE__*/React.createElement(Controller, {
    name: "sell_reverse_accounting_account_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: getSellReverseAccounts(),
      optionValue: "id",
      optionLabel: "account_label",
      placeholder: "Seleccione una cuenta",
      filter: true,
      filterBy: "account_label,account_name,account_code",
      showClear: true,
      className: classNames("w-full"),
      loading: isLoadingAccounts,
      appendTo: "self"
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "description",
    className: "font-medium block mb-2"
  }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      rows: 3,
      className: "w-full",
      placeholder: "Ingrese una descripci\xF3n opcional"
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4 gap-6"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-phoenix-secondary",
    onClick: onCancel,
    disabled: loading,
    type: "button",
    style: {
      padding: "0 20px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    className: "p-button-sm",
    loading: loading,
    style: {
      padding: "0 40px",
      width: "200px",
      height: "50px"
    },
    disabled: loading,
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))))));
};
export default RetentionFormConfig;