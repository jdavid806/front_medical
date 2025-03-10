import React, { useState } from 'react';
export const CustomWizard = ({
  steps,
  validate,
  onSubmit
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const isLastStep = currentStep === steps.length - 1;
  const handleNext = () => {
    const stepValidation = validate(currentStep, formData);
    if (Object.keys(stepValidation).length > 0) return setErrors(stepValidation);
    setErrors({});
    isLastStep ? onSubmit(formData) : setCurrentStep(prev => prev + 1);
  };
  const handlePrev = () => setCurrentStep(prev => prev - 1);
  const handleChange = e => {
    const {
      name,
      value,
      type,
      checked,
      files
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card theme-wizard mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-body-highlight pt-3 pb-2 border-bottom-0"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav justify-content-between nav-wizard nav-wizard-success"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("li", {
    key: step.label + index,
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: `nav-link fw-semibold ${currentStep >= index ? 'active' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center d-inline-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-item-circle-parent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-item-circle"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas ${step.icon}`
  }))), /*#__PURE__*/React.createElement("span", {
    className: "d-none d-md-block mt-1 fs-9"
  }, step.label))))))), /*#__PURE__*/React.createElement("div", {
    className: "card-body pt-4 pb-0"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("div", {
    key: step.label + index,
    className: `wizard-step ${currentStep === index ? 'active' : 'd-none'}`
  }, /*#__PURE__*/React.createElement(step.component, {
    formData: formData,
    handleChange: handleChange,
    errors: errors
  })))), /*#__PURE__*/React.createElement("div", {
    className: "card-footer border-top-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex pager wizard list-inline mb-0"
  }, currentStep > 0 && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link ps-0",
    onClick: handlePrev,
    type: "button"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chevron-left me-1"
  }), " Previous"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary px-6",
    onClick: handleNext,
    type: "button"
  }, isLastStep ? 'Guardar' : 'Next', !isLastStep && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-chevron-right ms-1"
  }))))));
};