function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { useBranchesForSelect } from "../../branches/hooks/useBranchesForSelect.js";
import { InputText } from 'primereact/inputtext';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { ticketReasons } from "../../../services/commons.js";
import { objectToArray } from "../../../services/utilidades.js";
import { MultiSelect } from 'primereact/multiselect';
import { useEffect } from 'react';
export const ModuleForm = ({
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
      branch_id: '1',
      allowed_reasons: []
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const {
    branches
  } = useBranchesForSelect();
  const allowedReasonsOptions = objectToArray(ticketReasons);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    reset(initialData || {
      name: '',
      branch_id: '1',
      allowed_reasons: []
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
  }), getFormErrorMessage('name')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "allowed_reasons",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Motivos de visita a atender *"), /*#__PURE__*/React.createElement(MultiSelect, _extends({
      inputId: field.name,
      options: allowedReasonsOptions,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione los motivos de visita a atender",
      className: classNames('w-100 position-relative', {
        'p-invalid': errors.allowed_reasons
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage('allowed_reasons'))));
};