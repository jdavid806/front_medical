import React, { useState, useEffect } from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import { ProgressBar } from 'primereact/progressbar';
import BillingConfigTab from "../../../config-accounting/billing/BilingConfigTab.js";
import { PaymentMethodsConfig } from "../../../config-accounting/paymentmethods/PaymentMethodsConfig.js";
import { TaxesConfig } from "../../../config-accounting/taxes/TaxesConfig.js";
import { RetentionConfig } from "../../../config-accounting/retention/RetentionConfig.js";
import { CostCenterConfig } from "../../../config-accounting/costcenters/CostCenterConfig.js"; // Componentes envueltos con props de validación
const MetodosPago = ({
  onConfigurationComplete
}) => /*#__PURE__*/React.createElement(PaymentMethodsConfig, {
  onConfigurationComplete: onConfigurationComplete
});
const ImpuestosConfig = ({
  onConfigurationComplete
}) => /*#__PURE__*/React.createElement(TaxesConfig, {
  onConfigurationComplete: onConfigurationComplete
});
const RetencionesConfig = ({
  onConfigurationComplete
}) => /*#__PURE__*/React.createElement(RetentionConfig, {
  onConfigurationComplete: onConfigurationComplete
});
const CentrosCostoConfig = ({
  onConfigurationComplete
}) => /*#__PURE__*/React.createElement(CostCenterConfig, {
  onConfigurationComplete: onConfigurationComplete
});
const FacturacionConfig = ({
  onConfigurationComplete
}) => /*#__PURE__*/React.createElement(BillingConfigTab, {
  onConfigurationComplete: onConfigurationComplete
});
export const ContabilidadConfig = ({
  onConfigurationComplete
}) => {
  const [activeSubStep, setActiveSubStep] = useState(0);
  const [subStepCompletion, setSubStepCompletion] = useState([false, false, false, false, false]);
  const [canProceed, setCanProceed] = useState(false);
  const subSteps = [{
    label: 'Métodos de Pago',
    component: MetodosPago,
    description: 'Configure al menos un método de pago'
  }, {
    label: 'Impuestos',
    component: ImpuestosConfig,
    description: 'Configure al menos un impuesto'
  }, {
    label: 'Retenciones',
    component: RetencionesConfig,
    description: 'Configure al menos una retención'
  }, {
    label: 'Centros de Costo',
    component: CentrosCostoConfig,
    description: 'Configure al menos un centro de costo'
  }, {
    label: 'Facturación',
    component: FacturacionConfig,
    description: 'Complete todas las configuraciones de facturación'
  }];

  // Actualizar estado de completitud del paso actual
  const handleSubStepComplete = isComplete => {
    setSubStepCompletion(prev => {
      const newCompletion = [...prev];
      newCompletion[activeSubStep] = isComplete;
      console.log('🔄 Actualizando submódulo:', {
        activeSubStep,
        isComplete,
        newCompletion
      });
      return newCompletion;
    });
  };

  // Verificar si puede proceder al siguiente paso
  useEffect(() => {
    const currentStepComplete = subStepCompletion[activeSubStep];
    console.log('🔄 Estado de submódulos:', {
      activeSubStep,
      currentStepComplete,
      subStepCompletion
    });
    setCanProceed(currentStepComplete);
  }, [activeSubStep, subStepCompletion]);

  // ENVIAR EL ESTADO COMPLETO AL PADRE CADA VEZ QUE CAMBIE
  useEffect(() => {
    console.log('📤 Enviando estado completo al padre:', subStepCompletion);
    onConfigurationComplete?.(subStepCompletion);
  }, [subStepCompletion, onConfigurationComplete]);
  const handleNextSubStep = () => {
    if (!canProceed) return;
    setActiveSubStep(prev => Math.min(prev + 1, subSteps.length - 1));
  };
  const handlePrevSubStep = () => {
    setActiveSubStep(prev => Math.max(prev - 1, 0));
  };

  // Calcular progreso general
  const completedSteps = subStepCompletion.filter(Boolean).length;
  const progressValue = completedSteps / subSteps.length * 100;
  const CurrentComponent = subSteps[activeSubStep].component;
  return /*#__PURE__*/React.createElement("div", {
    className: "contabilidad-configuration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Subm\xF3dulos de Contabilidad",
    className: "h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Progreso general"), /*#__PURE__*/React.createElement("small", {
    className: "text-primary fw-bold"
  }, completedSteps, " de ", subSteps.length)), /*#__PURE__*/React.createElement(ProgressBar, {
    value: progressValue,
    showValue: false,
    style: {
      height: '8px'
    }
  })), /*#__PURE__*/React.createElement(Stepper, {
    activeStep: activeSubStep,
    onSelect: e => setActiveSubStep(e.index),
    orientation: "vertical",
    linear: false
  }, subSteps.map((step, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: index,
    header: step.label,
    className: subStepCompletion[index] ? 'text-success fw-bold' : index === activeSubStep ? 'text-primary' : 'text-muted'
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "substep-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "content-header mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "text-primary mb-2"
  }, subSteps[activeSubStep].label)), /*#__PURE__*/React.createElement(CurrentComponent, {
    onConfigurationComplete: handleSubStepComplete
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mt-4 pt-3 border-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Subm\xF3dulo ", /*#__PURE__*/React.createElement("strong", null, activeSubStep + 1), " de ", /*#__PURE__*/React.createElement("strong", null, subSteps.length))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Subm\xF3dulo Anterior",
    className: "p-button-outlined",
    disabled: activeSubStep === 0,
    onClick: handlePrevSubStep,
    severity: "secondary"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-left"
  })), /*#__PURE__*/React.createElement(Button, {
    iconPos: "right",
    label: "Siguiente Subm\xF3dulo",
    className: "p-button-success",
    disabled: !canProceed,
    onClick: handleNextSubStep,
    tooltip: !canProceed ? `Complete la configuración de ${subSteps[activeSubStep].label.toLowerCase()} para continuar` : "Continuar al siguiente submódulo",
    tooltipOptions: {
      position: 'top'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-right"
  }))))))));
};