function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Checkbox } from 'primereact/checkbox';
export const TicketReasonForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      key: '',
      label: '',
      tag: '',
      is_active: true
    }
  });
  useEffect(() => {
    reset(initialData ?? {
      key: '',
      label: '',
      tag: '',
      is_active: true
    });
  }, [initialData, reset]);
  const onSubmit = data => {
    onHandleSubmit(data);
  };
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit),
    className: "container-fluid p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "key"
  }, "Key"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "key"
  }, register('key', {
    required: 'Key es requerido'
  }), {
    className: `form-control ${errors.key ? 'is-invalid' : ''}`
  })), errors.key && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.key.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "label"
  }, "Label"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "label"
  }, register('label', {
    required: 'Label es requerido'
  }), {
    className: `form-control ${errors.label ? 'is-invalid' : ''}`
  })), errors.label && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.label.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-group mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tag"
  }, "Tag"), /*#__PURE__*/React.createElement(InputText, _extends({
    id: "tag"
  }, register('tag', {
    required: 'Tag es requerido'
  }), {
    className: `form-control ${errors.tag ? 'is-invalid' : ''}`
  })), errors.tag && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback"
  }, errors.tag.message)), /*#__PURE__*/React.createElement("div", {
    className: "form-check mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "is_active",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Checkbox, {
      inputId: "is_active",
      checked: field.value,
      onChange: e => field.onChange(e.checked)
    })
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "is_active",
    className: "form-check-label ms-2"
  }, "Activo")));
};