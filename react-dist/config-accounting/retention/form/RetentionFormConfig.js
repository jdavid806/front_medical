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
      errors,
      isDirty
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

  // Solo watch para las cuentas que necesitamos para validaciones individuales
  const selectedPurchaseAccount = watch("accounting_account_id");
  const selectedPurchaseReverseAccount = watch("accounting_account_reverse_id");
  const selectedSellAccount = watch("sell_accounting_account_id");
  const selectedSellReverseAccount = watch("sell_reverse_accounting_account_id");
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
        description: initialData.description || ""
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

  // Función auxiliar para encontrar una cuenta por ID
  const findAccountById = accountId => {
    if (!accountId || !accounts) return null;
    return accounts.find(account => account.id === accountId) || null;
  };

  // FILTRADO COMPLETAMENTE INDEPENDIENTE PARA CADA DROPDOWN
  // Cada dropdown muestra TODAS las cuentas disponibles sin restricciones cruzadas

  const getPurchaseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    return accounts;
  };
  const getPurchaseReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    return accounts;
  };
  const getSellAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    return accounts;
  };
  const getSellReverseAccounts = () => {
    if (!accounts || accounts.length === 0) return [];
    return accounts;
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
    rules: {
      required: "La cuenta contable de compras es requerida"
    },
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
      filterBy: "account_label,account_name,account_code",
      showClear: true,
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      loading: isLoadingAccounts,
      appendTo: "self"
    }), getFormErrorMessage("accounting_account_id"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accounting_account_reverse_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Reversa Compras *"), /*#__PURE__*/React.createElement(Controller, {
    name: "accounting_account_reverse_id",
    control: control,
    rules: {
      required: "La cuenta contable reversa de compras es requerida"
    },
    render: ({
      field,
      fieldState
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
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      loading: isLoadingAccounts,
      appendTo: "self"
    }), getFormErrorMessage("accounting_account_reverse_id"))
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
    rules: {
      required: "La cuenta contable de ventas es requerida"
    },
    render: ({
      field,
      fieldState
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
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      loading: isLoadingAccounts,
      appendTo: "self"
    }), getFormErrorMessage("sell_accounting_account_id"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "sell_reverse_accounting_account_id",
    className: "font-medium block mb-2 fw-bold"
  }, "Cuenta Contable Reversa Ventas *"), /*#__PURE__*/React.createElement(Controller, {
    name: "sell_reverse_accounting_account_id",
    control: control,
    rules: {
      required: "La cuenta contable reversa de ventas es requerida"
    },
    render: ({
      field,
      fieldState
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
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      loading: isLoadingAccounts,
      appendTo: "self"
    }), getFormErrorMessage("sell_reverse_accounting_account_id"))
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
    disabled: loading || !isDirty,
    type: "submit"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))))));
};
export default RetentionFormConfig;