import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods.js";
import { useState } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { useUsersForSelect } from "../../users/hooks/useUsersForSelect.js";
import { Dropdown } from 'primereact/dropdown';
export const CashControlForm = ({
  formId,
  onHandleSubmit
}) => {
  const {
    paymentMethods
  } = usePaymentMethods();
  const {
    users
  } = useUsersForSelect();
  const [mappedPaymentMethods, setMappedPaymentMethods] = useState([]);
  const [total, setTotal] = useState(0);
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset,
    getValues,
    setValue
  } = useForm({
    defaultValues: {
      who_delivers: '',
      payments: []
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message?.toString());
  };
  useEffect(() => {
    reset({
      who_delivers: ''
    });
  }, [reset]);
  useEffect(() => {
    const filteredPaymentMethods = paymentMethods.filter(paymentMethod => {
      return paymentMethod.category === 'transactional';
    });
    setMappedPaymentMethods(filteredPaymentMethods.map(paymentMethod => ({
      ...paymentMethod,
      amount: 0
    })));
  }, [paymentMethods]);
  const handlePaymentMethodsAmountChange = (e, index) => {
    setMappedPaymentMethods(prev => {
      const newPaymentMethods = [...prev];
      console.log(e.value);
      const newAmount = !e.value || e.value <= 0 || isNaN(e.value) ? 0 : e.value;
      newPaymentMethods[index].amount = newAmount;
      setValue('payments', newPaymentMethods.map(paymentMethod => ({
        payment_method_id: paymentMethod.id,
        amount: paymentMethod.amount
      })));
      setTotal(newPaymentMethods.reduce((acc, paymentMethod) => acc + paymentMethod.amount, 0));
      return newPaymentMethods;
    });
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "who_delivers",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Usuario que entrega el dinero *"), /*#__PURE__*/React.createElement(Dropdown, {
      options: users,
      optionLabel: "label",
      optionValue: "external_id",
      placeholder: "Seleccione al usuario que entrega el dinero",
      filter: true,
      value: field.value,
      onChange: field.onChange,
      className: classNames('w-100', {
        'p-invalid': errors.who_delivers
      })
    }))
  }), getFormErrorMessage('who_delivers')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "M\xE9todo de Pago"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Cantidad Recibida"))), /*#__PURE__*/React.createElement("tbody", null, mappedPaymentMethods.map((paymentMethod, index) => /*#__PURE__*/React.createElement("tr", {
    key: paymentMethod.id
  }, /*#__PURE__*/React.createElement("td", null, paymentMethod.method), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(InputNumber, {
    value: paymentMethod.amount,
    onChange: e => handlePaymentMethodsAmountChange(e, index),
    className: "w-100",
    inputClassName: "w-100",
    prefix: "$",
    min: 0,
    useGrouping: false
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0"
  }, "Total: ", isNaN(total) ? 0 : total)))));
};