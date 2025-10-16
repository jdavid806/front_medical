function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { useAccountingAccounts } from "../../../accounting/hooks/useAccountingAccounts.js";
import { Checkbox } from 'primereact/checkbox';
const categories = [{
  label: "Transaccional",
  value: "transactional"
}, {
  label: "Vencimiento Proveedores",
  value: "supplier_expiration"
},
// { label: "Transferencia", value: "transfer" },
{
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
  value: "purchase"
}, {
  label: "Ventas",
  value: "sale"
}, {
  label: "Ambos",
  value: "both"
}];
const PaymentMethodFormConfig = ({
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
    reset
  } = useForm({
    defaultValues: initialData || {
      name: "",
      category: "",
      payment_type: "",
      accounting_account_id: null,
      additionalDetails: "",
      is_cash: false
    }
  });
  const onFormSubmit = data => onSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name]?.message);
  };
  useEffect(() => {
    reset(initialData || {
      name: "",
      category: "",
      payment_type: "",
      accounting_account_id: null,
      additionalDetails: "",
      is_cash: false
    });
  }, [initialData, reset]);
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
  }, "Nombre del M\xE9todo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre del método es requerido",
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
      placeholder: "Ingrese el nombre del m\xE9todo de pago"
    })), getFormErrorMessage("name"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accounting_account_id",
    className: "font-medium block mb-2"
  }, "Cuenta Contable"), /*#__PURE__*/React.createElement(Controller, {
    name: "accounting_account_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: accounts,
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
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "category",
    className: "font-medium block mb-2"
  }, "Categor\xEDa *"), /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "La categoría es requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: categories,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione una categor\xEDa",
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      showClear: true,
      filter: true
    }), getFormErrorMessage("category"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-8"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "payment_type",
    className: "font-medium block mb-2"
  }, "Tipo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "payment_type",
    control: control,
    rules: {
      required: "El tipo de método es requerido"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: TypeMethod,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione un tipo",
      className: classNames("w-full", {
        "p-invalid": fieldState.error
      }),
      showClear: true,
      filter: true
    }), getFormErrorMessage("payment_type"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-4 d-flex align-items-center gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "is_cash",
    control: control,
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Checkbox, {
      id: field.name,
      checked: field.value,
      onChange: e => field.onChange(e.checked),
      className: classNames("w-full", {}),
      inputId: field.name
    }), getFormErrorMessage("is_cash"))
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "isCash",
    className: "font-medium block mb-0"
  }, "Es efectivo"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "additionalDetails",
    className: "font-medium block mb-2"
  }, "Detalles Adicionales"), /*#__PURE__*/React.createElement(Controller, {
    name: "additionalDetails",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name
    }, field, {
      rows: 3,
      className: "w-full",
      placeholder: "Ingrese detalles adicionales"
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
export default PaymentMethodFormConfig;