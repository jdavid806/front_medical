function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
// Categories for dropdown
const categories = [{
  label: "Transaccional",
  value: "transactional"
}, {
  label: "Vencimiento Proveedores",
  value: "supplier_expiration"
}, {
  label: "Transferencia",
  value: "supplier_expiration"
}, {
  label: "Vencimiento Clientes",
  value: "customer_expiration"
}, {
  label: "Anticipo Clientes",
  value: "customer_advance"
}, {
  label: "Anticipo Proveedores",
  value: "supplier_advance"
}];
const TypeMethod = [{
  label: "Compras",
  value: "buyy"
}, {
  label: "Ventas",
  value: "sale"
}];
const PaymentMethodFormConfig = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false
}) => {
  // Use the accounting accounts hook
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
    reset
  } = useForm({
    defaultValues: initialData || {
      name: "",
      category: "",
      account: null,
      additionalDetails: ""
    }
  });
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onFormSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre del método es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre del M\xE9todo *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.name
      })
    }, field)))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "La categoría es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: TypeMethod,
      optionLabel: "label",
      optionValue: "value",
      className: classNames("w-100", {
        "p-invalid": errors.category
      })
    }, field)))
  }), getFormErrorMessage("category")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "La categoría es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Categor\xEDa *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: field.name,
      options: categories,
      optionLabel: "label",
      optionValue: "value",
      className: classNames("w-100", {
        "p-invalid": errors.category
      })
    }, field)))
  }), getFormErrorMessage("category")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "account",
    control: control,
    rules: {
      required: "La cuenta contable es requerida"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Cuenta Contable *"), /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      options: accounts,
      optionLabel: "account_name" // Cambiado de "name" a "account_name"
      ,
      optionValue: "id",
      className: classNames("w-100", {
        "p-invalid": errors.account
      }),
      loading: isLoadingAccounts,
      value: field.value?.id || null,
      onChange: e => {
        const selectedAccount = accounts.find(acc => acc.id === e.value);
        field.onChange(selectedAccount || null);
      },
      filter: true,
      filterBy: "account_name,account_code",
      showClear: true,
      placeholder: "Seleccione una cuenta",
      appendTo: "self"
    }))
  }), getFormErrorMessage("account")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "additionalDetails",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Detalles Adicionales"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      className: "w-100",
      rows: 3
    }, field)))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center mt-4 gap-6"
  }, onCancel && /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "btn btn-phoenix-secondary",
    onClick: onCancel,
    style: {
      padding: "0 20px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    },
    type: "button",
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times"
  })), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    className: "p-button-sm",
    disabled: loading || !isDirty,
    style: {
      padding: "0 40px",
      width: "200px",
      height: "50px",
      borderRadius: "0px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }))));
};
export default PaymentMethodFormConfig;