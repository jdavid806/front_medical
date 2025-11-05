import React from 'react';
export const FormFieldSummary = ({
  field,
  formValues
}) => {
  const getDisplayValue = (field, value) => {
    if (!value && value !== false && value !== 0) return 'No especificado';
    switch (field.type) {
      case 'textarea':
        return /*#__PURE__*/React.createElement("div", {
          className: "border rounded p-3 bg-light"
        }, /*#__PURE__*/React.createElement("div", {
          className: "form-summary-html-content",
          dangerouslySetInnerHTML: {
            __html: value || ''
          }
        }));
      case 'select':
        const selectedOption = field.options?.find(opt => opt.value === value);
        return selectedOption?.text || value;
      case 'checkbox':
        return /*#__PURE__*/React.createElement("div", {
          className: "d-flex flex-column gap-2"
        }, /*#__PURE__*/React.createElement("div", {
          className: "d-flex align-items-center gap-2"
        }, /*#__PURE__*/React.createElement("span", {
          className: `badge ${value ? 'bg-success' : 'bg-secondary'}`
        }, value ? 'Sí' : 'No'), /*#__PURE__*/React.createElement("span", null, field.label)), value && field.toggleFields?.map(subField => /*#__PURE__*/React.createElement("div", {
          key: subField.id,
          className: "ms-3 border-start ps-3"
        }, /*#__PURE__*/React.createElement("small", {
          className: "text-muted d-block"
        }, subField.label, ":"), /*#__PURE__*/React.createElement("div", {
          className: "mt-1"
        }, subField.type === 'textarea' ? /*#__PURE__*/React.createElement("div", {
          className: "border rounded p-2 bg-light small"
        }, /*#__PURE__*/React.createElement("div", {
          dangerouslySetInnerHTML: {
            __html: formValues[subField.id] || 'No especificado'
          }
        })) : /*#__PURE__*/React.createElement("span", {
          className: "fw-semibold"
        }, formValues[subField.id] || 'No especificado')))));
      case 'number':
        return new Intl.NumberFormat().format(Number(value));
      default:
        return value;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "form-field-summary"
  }, field.type !== 'checkbox' && /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-semibold text-muted mb-2"
  }, field.label), /*#__PURE__*/React.createElement("div", {
    className: "form-summary-value"
  }, getDisplayValue(field, formValues[field.id])));
};