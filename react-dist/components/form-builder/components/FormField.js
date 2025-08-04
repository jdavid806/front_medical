// FormField.tsx
import React from 'react';
import { Editor } from 'primereact/editor';
export const FormField = ({
  field,
  formValues,
  onEditorChange,
  onInputChange
}) => {
  switch (field.type) {
    case 'textarea':
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
        htmlFor: field.id,
        className: "form-label"
      }, field.label), /*#__PURE__*/React.createElement(Editor, {
        value: formValues[field.id] || '',
        onTextChange: e => onEditorChange(e.htmlValue ?? '', field.id),
        style: {
          height: '350px'
        }
      }));
    case 'select':
      return /*#__PURE__*/React.createElement("div", {
        className: "form-floating"
      }, /*#__PURE__*/React.createElement("select", {
        className: "form-select",
        id: field.id,
        value: formValues[field.id] || '',
        onChange: e => onInputChange(field.id, e.target.value)
      }, /*#__PURE__*/React.createElement("option", {
        value: "",
        disabled: true
      }, "Seleccione"), field.options.map((opt, i) => /*#__PURE__*/React.createElement("option", {
        key: i,
        value: opt.value
      }, opt.text))), /*#__PURE__*/React.createElement("label", {
        htmlFor: field.id
      }, field.label));
    case 'checkbox':
      return /*#__PURE__*/React.createElement("div", {
        className: "form-check p-0"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-2 align-items-center form-check form-switch mb-0"
      }, /*#__PURE__*/React.createElement("input", {
        className: "form-check-input",
        type: "checkbox",
        id: field.id,
        checked: formValues[field.id] || false,
        onChange: e => onInputChange(field.id, e.target.checked)
      }), /*#__PURE__*/React.createElement("label", {
        className: "form-check-label",
        htmlFor: field.id
      }, field.label)), formValues[field.id] && field.toggleFields?.map(subField => /*#__PURE__*/React.createElement("div", {
        key: subField.id
      }, subField.type === 'textarea' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
        htmlFor: subField.id,
        className: "form-label"
      }, subField.label), /*#__PURE__*/React.createElement(Editor, {
        value: formValues[subField.id] || '',
        onTextChange: e => onEditorChange(e.htmlValue ?? '', subField.id),
        style: {
          height: '100px'
        }
      })) : /*#__PURE__*/React.createElement("input", {
        type: "text",
        className: "form-control",
        id: subField.id,
        placeholder: subField.placeholder,
        value: formValues[subField.id] || '',
        onChange: e => onInputChange(subField.id, e.target.value)
      }))));
    case 'number':
      return /*#__PURE__*/React.createElement("div", {
        className: "form-floating"
      }, /*#__PURE__*/React.createElement("input", {
        type: "number",
        className: "form-control",
        id: field.id,
        value: formValues[field.id] || '',
        onChange: e => onInputChange(field.id, e.target.value)
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: field.id
      }, field.label));
    default:
      return /*#__PURE__*/React.createElement("div", {
        className: "form-floating"
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        className: "form-control",
        id: field.id,
        value: formValues[field.id] || '',
        onChange: e => onInputChange(field.id, e.target.value)
      }), /*#__PURE__*/React.createElement("label", {
        htmlFor: field.id
      }, field.label));
  }
};