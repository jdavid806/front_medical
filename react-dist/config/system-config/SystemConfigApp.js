function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { useSaveSystemConfig } from "./hooks/useSaveSystemConfig.js";
import { useSystemConfigs } from "./hooks/useSystemConfigs.js";
import { Toast } from 'primereact/toast';
export const SystemConfigApp = () => {
  const {
    handleSubmit,
    control,
    setValue
  } = useForm({
    defaultValues: {
      BILLING_AFTER_CONSULTATION: false
    }
  });
  const {
    systemConfigs
  } = useSystemConfigs();
  const {
    saveSystemConfig,
    toast
  } = useSaveSystemConfig();
  const onSubmit = data => {
    try {
      saveSystemConfig(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    systemConfigs.forEach(config => {
      setValue(config.key_, config.value);
    });
  }, [systemConfigs]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n del sistema"
  }, /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "BILLING_AFTER_CONSULTATION",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Checkbox, _extends({
      inputId: "billingAfterConsultation",
      checked: field.value
    }, field)), /*#__PURE__*/React.createElement("label", {
      htmlFor: "billingAfterConsultation",
      className: "ml-2"
    }, "Facturar despu\xE9s de la consulta"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-save me-2"
    }),
    className: "p-button-primary"
  })))));
};