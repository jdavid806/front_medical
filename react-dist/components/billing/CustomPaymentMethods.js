import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
export const PaymentMethodsSection = ({
  totalInvoice,
  paymentMethods,
  availablePaymentMethods,
  onPaymentMethodsChange,
  labelTotal,
  isNote
}) => {
  const calculateTotalPayments = () => {
    return paymentMethods.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };
  const paymentCoverage = () => {
    const payments = calculateTotalPayments();
    if (totalInvoice < 0) {
      return Math.abs(payments + totalInvoice) < 0.01;
    } else {
      return Math.abs(payments - totalInvoice) < 0.01;
    }
  };
  const addPayment = () => {
    const newPayment = {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: ""
    };
    onPaymentMethodsChange([...paymentMethods, newPayment]);
  };
  const removePayment = id => {
    if (paymentMethods.length > 1) {
      onPaymentMethodsChange(paymentMethods.filter(payment => payment.id !== id));
    }
  };
  const handlePaymentChange = (id, field, value) => {
    const updatedPayments = paymentMethods.map(payment => payment.id === id ? {
      ...payment,
      [field]: value
    } : payment);
    onPaymentMethodsChange(updatedPayments);
  };
  const copyTotalToPayment = paymentId => {
    const currentPaymentsTotal = calculateTotalPayments();
    const remainingAmount = totalInvoice - currentPaymentsTotal;
    const currentPaymentValue = Number(paymentMethods.find(p => p.id === paymentId)?.value || 0);
    const amountToSet = remainingAmount + currentPaymentValue;
    if (amountToSet > 0) {
      const updatedPayments = paymentMethods.map(payment => payment.id === paymentId ? {
        ...payment,
        value: parseFloat(amountToSet.toFixed(2))
      } : payment);
      onPaymentMethodsChange(updatedPayments);
      window["toast"]?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Valor ${amountToSet.toFixed(2)} DOP copiado al método de pago`,
        life: 3000
      });
    } else {
      window["toast"]?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El total ya está cubierto por los pagos actuales",
        life: 3000
      });
    }
  };
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  const totalPayments = calculateTotalPayments();
  const coverageStatus = paymentCoverage();
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center p-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todos de Pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar M\xE9todo",
    className: "btn btn-primary",
    onClick: addPayment
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3"
  }, paymentMethods.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-5 mb-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Dropdown, {
    required: true,
    value: payment.method,
    options: availablePaymentMethods,
    optionLabel: "method",
    optionValue: "id",
    placeholder: "Seleccione m\xE9todo",
    className: "w-100",
    onChange: e => {
      handlePaymentChange(payment.id, "method", e.value);
    },
    appendTo: "self",
    filter: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-2 mb-md-0"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor *"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center flex-nowrap"
  }, /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value === "" ? null : payment.value,
    placeholder: "RD$ 0.00",
    className: "flex-grow-1",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    onValueChange: e => handlePaymentChange(payment.id, "value", e.value === null ? "" : e.value),
    inputClassName: "form-control"
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-copy"
    }),
    className: "p-button-outlined p-button-info p-button-sm",
    onClick: () => copyTotalToPayment(payment.id),
    tooltip: "Copiar valor total restante",
    tooltipOptions: {
      position: "top"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    className: "p-button-rounded p-button-danger p-button-text p-button-sm mt-4",
    onClick: () => removePayment(payment.id),
    disabled: paymentMethods.length <= 1,
    tooltip: "Eliminar m\xE9todo",
    tooltipOptions: {
      position: "top"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info p-3",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center flex-wrap"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "me-2"
  }, labelTotal ? labelTotal : "Total factura", ":"), /*#__PURE__*/React.createElement(InputNumber, {
    value: totalInvoice,
    className: "me-3",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true,
    inputClassName: "form-control bg-white",
    style: {
      minWidth: "130px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center flex-wrap"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "me-2"
  }, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: totalPayments,
    className: "me-3",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true,
    inputClassName: "form-control bg-white",
    style: {
      minWidth: "130px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, !coverageStatus ? /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-1"
  }), "Faltan ", (totalInvoice - totalPayments).toFixed(2), " DOP") : /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-1"
  }), "Pagos completos"))))))));
};