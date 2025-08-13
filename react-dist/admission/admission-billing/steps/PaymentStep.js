import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { paymentMethodOptions } from "../utils/constants.js";
import { validatePaymentStep, calculateTotal, calculatePaid } from "../utils/helpers.js";
const PaymentStep = ({
  formData,
  updateFormData,
  addPayment,
  removePayment,
  nextStep,
  prevStep,
  toast
}) => {
  const handlePaymentChange = (field, value) => {
    updateFormData('currentPayment', {
      [field]: value
    });
  };
  const handleAddPayment = () => {
    const {
      method,
      amount
    } = formData.currentPayment;
    if (!method || !amount) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Método de pago y monto son requeridos',
        life: 3000
      });
      return;
    }
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount)) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'El monto debe ser un número válido',
        life: 3000
      });
      return;
    }
    addPayment({
      method: paymentMethodOptions.find(m => m.value === method)?.label || method,
      amount: paymentAmount,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes
    });
    updateFormData('currentPayment', {
      method: "",
      amount: "",
      authorizationNumber: "",
      notes: ""
    });
  };
  const handleNext = () => {
    const total = calculateTotal(formData.products);
    if (validatePaymentStep(formData.payments, total, toast)) {
      nextStep();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Detalles de la factura",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: formData.payments,
    className: "p-datatable-sm",
    emptyMessage: "No se han agregado m\xE9todos de pago"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "#",
    style: {
      width: '50px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "method",
    header: "M\xE9todo de Pago"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    body: rowData => rowData.amount.toFixed(2)
  }), /*#__PURE__*/React.createElement(Column, {
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-danger p-button-sm",
      onClick: () => removePayment(rowData.id),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: 'top'
      }
    }),
    style: {
      width: '80px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("strong", null, "Total pagado: ", calculatePaid(formData.payments).toFixed(2)))), /*#__PURE__*/React.createElement(Card, {
    title: "Agregar m\xE9todo de pago"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentMethod"
  }, "M\xE9todo de pago*"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "paymentMethod",
    options: paymentMethodOptions,
    value: formData.currentPayment.method,
    onChange: e => handlePaymentChange('method', e.value),
    placeholder: "Seleccionar",
    className: "w-full",
    optionLabel: "label"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentAmount"
  }, "Monto*"), /*#__PURE__*/React.createElement(InputText, {
    id: "paymentAmount",
    value: formData.currentPayment.amount,
    onChange: e => handlePaymentChange('amount', e.target.value),
    className: "w-full",
    keyfilter: "money"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentAuthNumber"
  }, "N\xFAmero de autorizaci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    id: "paymentAuthNumber",
    value: formData.currentPayment.authorizationNumber,
    onChange: e => handlePaymentChange('authorizationNumber', e.target.value),
    className: "w-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "paymentNotes"
  }, "Observaciones"), /*#__PURE__*/React.createElement(InputText, {
    id: "paymentNotes",
    value: formData.currentPayment.notes,
    onChange: e => handlePaymentChange('notes', e.target.value),
    className: "w-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar m\xE9todo de pago",
    icon: "pi pi-plus",
    className: "mt-3",
    onClick: handleAddPayment,
    severity: "success"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between pt-4 col-12"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Atr\xE1s",
    icon: "pi pi-arrow-left",
    onClick: prevStep,
    severity: "secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Siguiente",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: handleNext,
    disabled: formData.payments.length === 0
  })));
};
export default PaymentStep;