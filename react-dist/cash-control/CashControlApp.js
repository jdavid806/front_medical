import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import { useCashControlCreate } from "./hooks/useCashControlCreate.js";
import { CashControlForm } from "./components/CashControlForm.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
export const CashControlApp = () => {
  const {
    createCashControl
  } = useCashControlCreate();
  const handleSubmit = async data => {
    console.log(data);

    //await createCashControl(data)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: 'self',
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: "createCashControlForm",
    show: true,
    title: "Control de caja"
  }, /*#__PURE__*/React.createElement(CashControlForm, {
    formId: "createCashControlForm",
    onHandleSubmit: handleSubmit
  }))));
};