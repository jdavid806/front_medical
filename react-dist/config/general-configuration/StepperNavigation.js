import React from 'react';
import { Button } from 'primereact/button';
export const StepperNavigation = ({
  activeIndex,
  totalSteps,
  onPrevious,
  onNext,
  onSave,
  onCancel,
  isNextDisabled = false
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "stepper-navigation mt-4 pt-4 border-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Navegaci\xF3n entre M\xF3dulos: ", /*#__PURE__*/React.createElement("strong", null, activeIndex + 1), " de ", /*#__PURE__*/React.createElement("strong", null, totalSteps))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "M\xF3dulo Anterior",
    className: "p-button-outlined",
    disabled: activeIndex === 0,
    onClick: onPrevious,
    severity: "secondary"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-left me-2"
  })), /*#__PURE__*/React.createElement("div", {
    className: `${activeIndex === totalSteps - 1 ? 'd-block' : 'd-none'}`
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Finalizar Configuraci\xF3n",
    icon: "pi pi-check",
    className: "p-button-success",
    onClick: onSave,
    severity: "success"
  })), /*#__PURE__*/React.createElement("div", {
    className: `${!(activeIndex === totalSteps - 1) ? 'd-block' : 'd-none'}`
  }, /*#__PURE__*/React.createElement(Button, {
    iconPos: "right",
    label: "Siguiente M\xF3dulo",
    className: "p-button-primary",
    onClick: onNext,
    severity: "primary",
    disabled: isNextDisabled,
    tooltip: isNextDisabled ? "Complete la configuración actual para continuar" : "Continuar al siguiente módulo",
    tooltipOptions: {
      position: 'top'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-right"
  }))))));
};