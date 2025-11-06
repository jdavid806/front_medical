function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Controller, useForm } from "react-hook-form";
import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
export const EditAccountingAccountFormModal = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    visible,
    onHide,
    handleUpdateAccount,
    selectedAccount
  } = props;
  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      account_name: "",
      initial_balance: 0,
      fiscal_difference: false,
      active: true,
      sub_account_code: "",
      category: ""
    }
  });
  const [showInputs, setShowInputs] = useState(false);
  const getFormErrorMessage = name => {
    console.error(errors);
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const categoryOptions = [{
    label: "Medicamentos",
    value: "medications"
  }, {
    label: "Vacunas",
    value: "vaccines"
  }, {
    label: "Inventariables",
    value: "inventariables"
  }, {
    label: "Insumos",
    value: "supplies"
  }];
  const onSubmit = data => {
    const accountData = {
      id: selectedAccount?.id.toString() || "",
      account_name: data.account_name,
      initial_balance: data.initial_balance,
      status: data.active ? "active" : "inactive",
      category: data.category
    };
    handleUpdateAccount(accountData);
  };
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      reset();
    }
  }));
  useEffect(() => {
    if (selectedAccount) {
      setValue("account_name", selectedAccount.account_name);
      setValue("initial_balance", selectedAccount.initial_balance);
      setValue("fiscal_difference", false);
      setValue("active", selectedAccount.status === "active");
      setValue("category", selectedAccount.category || "");
      if (selectedAccount.account_code.startsWith("1")) {
        setShowInputs(true);
      }
    }
  }, [selectedAccount]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    header: "Editar Cuenta",
    visible: visible,
    style: {
      width: "90vw",
      maxWidth: "600px"
    },
    onHide: onHide,
    modal: true
  }, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid grid formgrid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountName"
  }, "Nombre *"), /*#__PURE__*/React.createElement(Controller, {
    name: "account_name",
    control: control,
    rules: {
      required: "Este campo es requerido",
      minLength: {
        value: 3,
        message: "El nombre debe tener al menos 3 caracteres"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "accountName"
    }, field))
  }), getFormErrorMessage("account_name")), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "initialBalance"
  }, "Saldo Inicial"), /*#__PURE__*/React.createElement(Controller, {
    name: "initial_balance",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      className: "w-100",
      inputClassName: classNames("w-100", {
        "p-invalid": errors.initial_balance
      }),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "field col-12 mb-3",
    style: {
      display: showInputs ? "block" : "none"
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "accountName"
  }, "Categor\xEDa *"), /*#__PURE__*/React.createElement(Controller, {
    name: "category",
    control: control,
    rules: {
      required: "Este campo es requerido",
      minLength: {
        value: 3,
        message: "El nombre debe tener al menos 3 caracteres"
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      className: "w-100",
      value: field.value,
      onChange: e => field.onChange(e.value),
      options: categoryOptions,
      placeholder: "Seleccionar..."
    })
  }), getFormErrorMessage("category")), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "fiscal_difference",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(InputSwitch, {
      checked: field.value,
      onChange: e => field.onChange(e.value)
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-check-label"
    }, "Cuenta de diferencia fiscal"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox col-12 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "active",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(InputSwitch, {
      checked: field.value,
      onChange: e => field.onChange(e.value)
    }), /*#__PURE__*/React.createElement("label", {
      className: "form-check-label"
    }, "Cuenta activa"))
  }))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Cancelar",
    className: "p-button-primary",
    onClick: () => {
      onHide();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-times me-2",
    style: {
      marginLeft: "10px"
    }
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    type: "submit",
    className: "p-button-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-save",
    style: {
      marginLeft: "10px"
    }
  }))))));
});