function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, forwardRef, useImperativeHandle } from "react";
import { usePaymentMethods } from "../payment-methods/hooks/usePaymentMethods.js";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatPrice } from "../../services/utilidades.js";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller } from "react-hook-form";
export const CashRegisterPaymentMethodsForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    total,
    onPaymentsChange
  } = props;
  const {
    paymentMethods
  } = usePaymentMethods();
  const {
    control,
    setValue,
    register,
    formState: {
      errors
    },
    trigger,
    getValues
  } = useForm({
    defaultValues: {
      payments: [],
      currentPayment: {
        method: null,
        amount: total,
        change: 0
      }
    }
  });
  const {
    append: appendPayment,
    remove: removePayment
  } = useFieldArray({
    control,
    name: "payments",
    rules: {
      required: "Debe agregar al menos un método de pago",
      minLength: {
        value: 1,
        message: "Debe agregar al menos un método de pago"
      }
    }
  });
  const payments = useWatch({
    control,
    name: "payments"
  });
  const currentPayment = useWatch({
    control,
    name: "currentPayment"
  });
  const [totalChange, setTotalChange] = useState(0);
  const [totalPendingAmount, setTotalPendingAmount] = useState(total);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState(paymentMethods);
  const paymentAmountBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatPrice(rowData.amount));
  };
  const paymentChangeBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "font-bold"
    }, formatPrice(rowData.change));
  };
  const paymentMethodBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: `mr-2`
    }), /*#__PURE__*/React.createElement("span", null, rowData.method.method));
  };
  const calculateTotalChange = () => {
    const change = payments.reduce((acc, payment) => acc + payment.change, 0);
    setTotalChange(change);
  };
  const calculateTotalPendingAmount = () => {
    const pendingAmount = total - payments.reduce((acc, payment) => acc + payment.amount, 0);
    setTotalPendingAmount(pendingAmount > 0 ? pendingAmount : 0);
    setValue("currentPayment.amount", pendingAmount);
  };
  useEffect(() => {
    if (paymentMethods) {
      const filtered = paymentMethods.filter(method => method.category === "transactional" && ["Ventas", "sale"].includes(method.payment_type));
      setFilteredPaymentMethods(filtered);
    }
  }, [paymentMethods]);
  useEffect(() => {
    calculateTotalChange();
    calculateTotalPendingAmount();
    onPaymentsChange(payments);
  }, [payments]);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message || errors[name].root?.message);
  };
  const handleAddPayment = () => {
    setValue("currentPayment", {
      method: null,
      amount: 0,
      change: 0
    });
    appendPayment({
      method: currentPayment.method,
      amount: currentPayment.amount,
      change: currentPayment.change
    });
  };
  const handleRemovePayment = index => {
    removePayment(index);
  };
  const handleCurrentPaymentAmountChange = value => {
    const remainingAmount = totalPendingAmount || 0;
    const change = remainingAmount - value;
    if (change < 0) {
      setValue('currentPayment.change', Math.abs(change));
    } else {
      setValue('currentPayment.change', 0);
    }
    setValue('currentPayment.amount', value);
  };
  useImperativeHandle(ref, () => ({
    submit: async () => {
      const isValid = await trigger();
      console.log("isValid", isValid);
      console.log("getValues", getValues());
      console.log("errors", errors);
      return {
        isValid,
        getValues: getValues()
      };
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 pb-4"
  }, totalChange > 0 && /*#__PURE__*/React.createElement(Card, {
    className: "mb-4 border-left-3 border-teal-500 bg-teal-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between align-items-center p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-money-bill-wave text-teal-500"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-lg font-medium"
  }, "Cambio a devolver")), /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold text-teal-700"
  }, formatPrice(totalChange)))), /*#__PURE__*/React.createElement("div", {
    className: "border-round border-1 surface-border mb-4"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: payments,
    className: "p-datatable-sm p-datatable-gridlines",
    emptyMessage: /*#__PURE__*/React.createElement("div", {
      className: "text-center p-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-info-circle mr-2"
    }), "No se han agregado m\xE9todos de pago"),
    stripedRows: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "method",
    header: "M\xE9todo",
    body: paymentMethodBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "amount",
    header: "Monto",
    body: paymentAmountBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "change",
    header: "Cambio",
    body: paymentChangeBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: rowData => /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash"
      }),
      className: "p-button-danger",
      size: "small",
      onClick: () => handleRemovePayment(payments.indexOf(rowData)),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: "top"
      }
    }),
    headerStyle: {
      width: '80px'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "surface-card px-4 pb-4 border-round-lg border-1 surface-border shadow-2 col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-4 gap-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "m-0 text-700 text-right"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-credit-card me-2 text-xl text-primary"
  }), "Agregar Nuevo Pago")), /*#__PURE__*/React.createElement(Card, {
    className: "border-round-lg shadow-1 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, totalPendingAmount <= 0 && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 p-3 border-round-lg bg-green-100 text-green-800"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-circle me-2"
  }), "El pago ha sido completado en su totalidad"), totalPendingAmount > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "currentPayment.method",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "paymentMethod",
      className: "block font-medium mb-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-money-check-alt mr-2"
    }), " M\xE9todo de pago"), /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      inputId: "paymentMethod",
      options: filteredPaymentMethods,
      placeholder: "Seleccione m\xE9todo...",
      className: "w-100",
      optionLabel: "method",
      panelClassName: "shadow-3",
      showClear: true,
      filter: true,
      filterPlaceholder: "Buscar m\xE9todo...",
      emptyFilterMessage: "No se encontraron m\xE9todos"
    })))
  })), currentPayment?.method?.is_cash && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "field mt-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "remainingAmount",
    className: "block font-medium mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-receipt mr-2"
  }), " Total Pendiente"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "remainingAmount",
    value: totalPendingAmount,
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    className: "w-full",
    inputClassName: "font-bold"
  })), /*#__PURE__*/React.createElement(Controller, {
    name: "currentPayment.amount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "field mt-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "cashAmount",
      className: "block font-medium mb-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-hand-holding-usd mr-2"
    }), " Monto Recibido"), /*#__PURE__*/React.createElement(InputNumber, {
      id: "cashAmount",
      value: field.value,
      onValueChange: e => handleCurrentPaymentAmountChange(e.value || 0),
      onChange: e => handleCurrentPaymentAmountChange(e.value || 0),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      className: "w-full",
      inputClassName: "font-bold"
    })))
  }), /*#__PURE__*/React.createElement(Controller, {
    name: "currentPayment.change",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "field mt-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "changeAmount",
      className: "block font-medium mb-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exchange-alt mr-2"
    }), " Cambio a Devolver"), /*#__PURE__*/React.createElement(InputNumber, {
      id: "changeAmount",
      value: field.value,
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      readOnly: true,
      className: `w-full ${field.value > 0 ? 'bg-green-100 font-bold' : ''}`,
      inputClassName: field.value > 0 ? 'text-green-700' : ''
    })))
  })), !currentPayment?.method?.is_cash && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Controller, {
    name: "currentPayment.amount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "field mt-4"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "cashAmount",
      className: "block font-medium mb-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-hand-holding-usd mr-2"
    }), " Monto Recibido"), /*#__PURE__*/React.createElement(InputNumber, {
      id: "cashAmount",
      value: field.value,
      onChange: e => field.onChange(e.value || 0),
      onValueChange: e => field.onChange(e.value || 0),
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      className: "w-full",
      inputClassName: "font-bold"
    })))
  })))))), totalPendingAmount > 0 && /*#__PURE__*/React.createElement("div", {
    className: "d-flex mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Pago",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cash-register me-2"
    }),
    className: "p-button-primary",
    onClick: handleAddPayment,
    tooltip: "Agregar este pago al registro",
    tooltipOptions: {
      position: "left"
    },
    disabled: !currentPayment.method || currentPayment.amount <= 0
  }))), getFormErrorMessage("payments"));
});