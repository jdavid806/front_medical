function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { FormBuilder } from "../../components/form-builder/FormBuilder.js";
import { examTypes } from "../../../services/commons.js";
export const ExamConfigForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const [showFormBuilder, setShowFormBuilder] = useState(true);
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
  const [formConfig, setFormConfig] = useState(null);
  const formBuilderRef = useRef(null);
  const handleGetJSON = () => {
    if (formBuilderRef.current) {
      return formBuilderRef.current.getFormConfiguration();
    }
    return null;
  };
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
      name: '',
      description: '',
      type: '',
      form_config: {}
    });
    console.log(initialData);
    setFormConfig(initialData?.form_config || null);
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
  }), getFormErrorMessage('type')), /*#__PURE__*/React.createElement("div", {
    className: "form-check form-switch"
  }, /*#__PURE__*/React.createElement("input", {
    className: "form-check-input",
    id: "flexSwitchCheckDefault",
    type: "checkbox",
    checked: showFormBuilder,
    onChange: e => setShowFormBuilder(e.target.checked)
  }), /*#__PURE__*/React.createElement("label", {
    className: "form-check-label",
    htmlFor: "flexSwitchCheckDefault"
  }, "Maneja formato")), formConfig && showFormBuilder && /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Formato del examen")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(FormBuilder, {
    ref: formBuilderRef,
    form: formConfig
  })))));
};