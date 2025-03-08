function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { useExamCategories } from "../../exam-categories/hooks/useExamCategories.js";
import { FormBuilder } from "../../components/form-builder/FormBuilder.js";
export const ExamConfigForm = ({
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
      name: '',
      description: '',
      exam_category_id: '',
      form_config: {}
    }
  });
  const onSubmit = data => {
    data.form_config = handleGetJSON();
    onHandleSubmit(data);
  };
  const {
    examCategories
  } = useExamCategories();
  const [dropdownExamCategories, setDropdownExamCategories] = useState([]);
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
      exam_category_id: '',
      form_config: {}
    });
    console.log(initialData);
    setFormConfig(initialData?.form_config || null);
  }, [initialData, reset]);
  useEffect(() => {
    setDropdownExamCategories(examCategories.map(item => ({
      label: item.name,
      value: item.id
    })));
  }, [examCategories]);
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
    name: "exam_category_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Categor\xEDa *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: dropdownExamCategories,
      optionLabel: "label",
      optionValue: "value",
      placeholder: "Seleccione la categor\xEDa a la que pertenece",
      className: classNames('w-100', {
        'p-invalid': errors.exam_category_id
      })
    }, field)))
  }), getFormErrorMessage('exam_category_id')), formConfig && /*#__PURE__*/React.createElement("div", {
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