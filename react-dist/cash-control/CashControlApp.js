import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useCashControlCreate } from "./hooks/useCashControlCreate.js";
import { CashControlForm } from "./components/CashControlForm.js";
import { Card } from 'primereact/card';
export const CashControlApp = () => {
  const {
    createCashControl
  } = useCashControlCreate();
  const handleSubmit = async data => {
    try {
      await createCashControl(data);
      setTimeout(() => {
        window.location.href = 'controlCaja';
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Cierre de Caja"
  }, /*#__PURE__*/React.createElement(CashControlForm, {
    formId: "createCashControlForm",
    onHandleSubmit: handleSubmit
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    form: "createCashControlForm",
    className: "btn btn-primary my-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark"
  }), " Guardar")))));
};