import React from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { useSystemConfiguration } from "./hooks/useSystemConfiguration.js";
import { SystemConfigurationStyles } from "./styles/SystemConfigurationStyles.js";
import { configurationSteps } from "./types/steps.js";
import { StepperNavigation } from "./StepperNavigation.js";
import { StepperPanel } from 'primereact/stepperpanel';
export const SystemConfiguration = ({
  onSave,
  onCancel,
  initialStep = 0
}) => {
  const {
    activeIndex,
    goToNext,
    goToPrevious,
    goToStep,
    totalSteps,
    currentStep
  } = useSystemConfiguration(configurationSteps, initialStep);
  console.log('🔍 Paso actual en SystemConfiguration:', activeIndex, currentStep.label);
  const CurrentComponent = currentStep.component;
  const handleSave = () => {
    onSave?.({
      currentStep: currentStep.id,
      stepIndex: activeIndex
    });
  };
  const handleCancel = () => {
    onCancel?.();
  };
  const progressValue = (activeIndex + 1) / totalSteps * 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n General del Sistema",
    className: "shadow-sm system-configuration-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 border-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 h-100 bg-light"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-primary mb-3 fw-bold"
  }, "M\xF3dulos de Configuraci\xF3n"), /*#__PURE__*/React.createElement(Stepper, {
    activeStep: activeIndex,
    orientation: "vertical",
    linear: false,
    className: "vertical-stepper overflow-auto"
  }, configurationSteps.map((step, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: step.id,
    header: step.label,
    icon: step.icon,
    onClick: () => goToStep(index)
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "configuration-content p-4 card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "progress-section mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "M\xF3dulo ", activeIndex + 1, " de ", totalSteps), /*#__PURE__*/React.createElement("small", {
    className: "text-primary fw-bold"
  }, Math.round(progressValue), "% completado")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progressValue,
    showValue: false,
    style: {
      height: '10px',
      borderRadius: '5px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "content-header mb-4"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-primary mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: `${currentStep.icon} me-3`
  }), currentStep.label), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-0"
  }, "Complete la configuraci\xF3n de este m\xF3dulo antes de continuar al siguiente.")), /*#__PURE__*/React.createElement("div", {
    className: "content-body mb-4"
  }, /*#__PURE__*/React.createElement(CurrentComponent, null)), /*#__PURE__*/React.createElement(StepperNavigation, {
    activeIndex: activeIndex,
    totalSteps: totalSteps,
    onPrevious: goToPrevious,
    onNext: goToNext,
    onSave: handleSave,
    onCancel: handleCancel
  }))))))), /*#__PURE__*/React.createElement("style", null, SystemConfigurationStyles));
};
export default SystemConfiguration;