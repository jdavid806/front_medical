function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Controller, useForm } from 'react-hook-form';
import { InputSwitch } from 'primereact/inputswitch';
import { classNames } from 'primereact/utils';
import { Divider } from 'primereact/divider';
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
      sub_account_code: ""
    }
  });
  const getFormErrorMessage = name => {
    console.log(errors);
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const onSubmit = data => {
    const accountData = {
      id: selectedAccount?.id.toString() || "",
      account_name: data.account_name,
      initial_balance: data.initial_balance,
      status: data.active ? "active" : "inactive"
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
      inputClassName: classNames('w-100', {
        'p-invalid': errors.initial_balance
      }),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO"
    })
  })), /*#__PURE__*/React.createElement("div", {
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
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    className: "btn btn-danger",
    onClick: () => {
      onHide();
    }
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    type: "submit",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-save me-2"
    }),
    className: "btn btn-primary"
  })))));
});