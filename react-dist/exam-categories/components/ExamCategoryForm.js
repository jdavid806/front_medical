import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
export const ExamCategoryForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      name: ''
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const [formConfig, setFormConfig] = useState(null);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message?.toString());
  };
  const fetchData = async () => {
    if (!formConfig) {
      try {
        const response = await fetch('../../ConsultasJson/examenBase.json');
        const data = await response.json();
        setFormConfig(data.form1);
      } catch (error) {
        console.error("Error cargando el JSON:", error);
      }
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    reset(initialData || {
      name: ''
    });
  }, [initialData, reset]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Ingrese un nombre",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onChange: field.onChange,
      className: classNames('w-100', {
        'p-invalid': errors.name
      })
    }))
  }), getFormErrorMessage('name'))));
};