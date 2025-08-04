function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { examTypes } from "../../../services/commons.js";
export const ClinicalHistoryExamConfigForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const selectableExamTypes = Object.keys(examTypes).map(key => ({
    value: key,
    label: examTypes[key]
  }));
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: initialData || {
      name: '',
      type: '',
      description: '',
      form_config: {}
    }
  });
  const onSubmit = data => {
    data.form_config = handleGetJSON();
    onHandleSubmit(data);
  };
  const formBuilderRef = useRef(null);
  const handleGetJSON = () => {
    if (formBuilderRef.current) {
      return formBuilderRef.current.getFormConfiguration();
    }
    return {};
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message?.toString());
  };
  useEffect(() => {
    reset(initialData || {
      name: '',
      description: '',
      type: '',
      form_config: {}
    });
    console.log(initialData);
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
  }), getFormErrorMessage('name')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "description",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: field.name,
      placeholder: "Ingrese un texto",
      className: classNames('w-100', {
        'p-invalid': errors.description
      })
    }, field)))
  }), getFormErrorMessage('description')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de examen *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: selectableExamTypes,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione un tipo de examen",
      className: classNames('w-100', {
        'p-invalid': errors.type
      })
    }, field, {
      appendTo: 'self'
    })))
  }), getFormErrorMessage('type'))));
};