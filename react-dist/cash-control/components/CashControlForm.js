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
      user_id: '',
      total: 0
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
      user_id: ''
    });
  }, [reset]);
  useEffect(() => {
    setMappedPaymentMethods(paymentMethods.map(paymentMethod => ({
      ...paymentMethod,
      amount: 0
    })));
  }, [paymentMethods]);
  const handlePaymentMethodsAmountChange = (e, index) => {
    setMappedPaymentMethods(prev => {
      const newPaymentMethods = [...prev];
      newPaymentMethods[index].amount = e.value;
      const total = newPaymentMethods?.reduce((acc, pm) => acc + pm.amount, 0);
      setValue('total', total);
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
    name: "user_id",
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
      optionValue: "value",
      placeholder: "Seleccione al usuario que entrega el dinero",
      value: field.value,
      onChange: field.onChange,
      className: classNames('w-100', {
        'p-invalid': errors.user_id
      })
    }))
  }), getFormErrorMessage('user_id')), /*#__PURE__*/React.createElement("div", {
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
    useGrouping: false
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "m-0"
  }, "Total: ", isNaN(getValues('total')) ? 0 : getValues('total'))))));
};