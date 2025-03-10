import React, { useState } from "react";
export const Wizard = ({
  steps
}) => {
  const [activeStep, setActiveStep] = useState(0);
  return /*#__PURE__*/React.createElement("div", {
    className: "card theme-wizard mb-5",
    "data-theme-wizard": "data-theme-wizard"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-body-highlight pt-3 pb-2 border-bottom-0"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav justify-content-between nav-wizard nav-wizard-success",
    role: "tablist"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("li", {
    className: "nav-item",
    role: "presentation",
    key: index
  }, /*#__PURE__*/React.createElement("a", {
    className: `nav-link fw-semibold ${activeStep === index ? 'active' : ''}`,
    href: `#step-${index}`,
    "data-bs-toggle": "tab",
    "data-wizard-step": index + 1,
    "aria-selected": activeStep === index,
    role: "tab",
    onClick: e => {
      if (index > activeStep) {
        const prevSteps = document.querySelectorAll(`#step-${activeStep} :invalid`);
        console.log(prevSteps);
        if (prevSteps.length > 0) {
          console.log("xd?");
          e.preventDefault();
        } else {
          setActiveStep(index);
        }
      } else {
        setActiveStep(index);
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center d-inline-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-item-circle-parent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "nav-item-circle"
  }, /*#__PURE__*/React.createElement("svg", {
    className: `svg-inline--fa fa-${step.icon}`,
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": step.icon,
    role: "img",
    viewBox: step.viewBox
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: step.iconPath
  })))), /*#__PURE__*/React.createElement("span", {
    className: "d-none d-md-block mt-1 fs-9"
  }, step.title))))))), /*#__PURE__*/React.createElement("div", {
    className: "card-body pt-4 pb-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: `tab-pane ${activeStep === index ? 'active show' : ''}`,
    role: "tabpanel",
    "aria-labelledby": `step-${index}`,
    id: `step-${index}`
  }, step.content)))), /*#__PURE__*/React.createElement("div", {
    className: "card-footer border-top-0",
    "data-wizard-footer": "data-wizard-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex pager wizard list-inline mb-0"
  }, /*#__PURE__*/React.createElement("button", {
    className: `btn btn-link ps-0 ${activeStep === 0 ? 'd-none' : ''}`,
    type: "button",
    onClick: () => setActiveStep(prev => prev - 1)
  }, /*#__PURE__*/React.createElement("svg", {
    className: "svg-inline--fa fa-chevron-left me-1",
    "data-fa-transform": "shrink-3",
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "chevron-left",
    role: "img",
    viewBox: "0 0 320 512"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
  })), "Previous"), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary px-6 px-sm-6",
    type: "submit",
    form: `wizardValidationForm${activeStep + 1}`,
    onClick: e => {
      const form = e.target.form;
      if (form.checkValidity()) {
        if (activeStep < steps.length - 1) {
          setActiveStep(prev => prev + 1);
        }
      } else {
        e.preventDefault();
        e.stopPropagation();
        e.target.form.classList.add('was-validated');
      }
    }
  }, activeStep === steps.length - 1 ? 'Submit' : 'Next', /*#__PURE__*/React.createElement("svg", {
    className: "svg-inline--fa fa-chevron-right ms-1",
    "data-fa-transform": "shrink-3",
    "aria-hidden": "true",
    focusable: "false",
    "data-prefix": "fas",
    "data-icon": "chevron-right",
    role: "img",
    viewBox: "0 0 320 512"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "currentColor",
    d: "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
  })))))));
};

// Ejemplo de uso:
/*
 
const steps = [
  {
    title: 'Account',
    icon: 'lock',
    viewBox: '0 0 448 512',
    iconPath: 'M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z',
    content: (
      <form className="needs-validation was-validated" noValidate>
        {/* Tus campos del formulario aquí *}
      </form>
    )
  },
  // ... más steps
];
 
<Wizard steps={steps} />
*/