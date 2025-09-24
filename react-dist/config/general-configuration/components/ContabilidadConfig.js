import React, { useState } from 'react';
import { Stepper } from 'primereact/stepper';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { StepperPanel } from 'primereact/stepperpanel';
import PaymentMethodFormConfig from "../../../config-accounting/paymentmethods/form/PaymentMethodFormConfig.js";
import TaxFormConfig from "../../../config-accounting/taxes/form/TaxesConfigForm.js";
import RetentionFormConfig from "../../../config-accounting/retention/form/RetentionFormConfig.js";
import CostCenterFormConfig from "../../../config-accounting/costcenters/form/CostCenterFormConfig.js";
import BillingConfigTab from "../../../config-accounting/billing/BilingConfigTab.js";
const MetodosPago = () => /*#__PURE__*/React.createElement(PaymentMethodFormConfig, null);
const ImpuestosConfig = () => /*#__PURE__*/React.createElement(TaxFormConfig, null);
const RetencionesConfig = () => /*#__PURE__*/React.createElement(RetentionFormConfig, null);
const CentrosCostoConfig = () => /*#__PURE__*/React.createElement(CostCenterFormConfig, null);
const FacturacionConfig = () => /*#__PURE__*/React.createElement(BillingConfigTab, null);
export const ContabilidadConfig = () => {
  const [activeSubStep, setActiveSubStep] = useState(0);
  const subSteps = [{
    label: 'Métodos de Pago',
    component: /*#__PURE__*/React.createElement(MetodosPago, null)
  }, {
    label: 'Impuestos',
    component: /*#__PURE__*/React.createElement(ImpuestosConfig, null)
  }, {
    label: 'Retenciones',
    component: /*#__PURE__*/React.createElement(RetencionesConfig, null)
  }, {
    label: 'Centros de Costo',
    component: /*#__PURE__*/React.createElement(CentrosCostoConfig, null)
  }, {
    label: 'Facturación',
    component: /*#__PURE__*/React.createElement(FacturacionConfig, null)
  }];
  const handleNextSubStep = () => {
    setActiveSubStep(prev => Math.min(prev + 1, subSteps.length - 1));
  };
  const handlePrevSubStep = () => {
    setActiveSubStep(prev => Math.max(prev - 1, 0));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "contabilidad-configuration"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Subm\xF3dulos de Contabilidad",
    className: "h-100"
  }, /*#__PURE__*/React.createElement(Stepper, {
    activeStep: activeSubStep,
    onSelect: e => setActiveSubStep(e.index),
    orientation: "vertical",
    linear: false
  }, subSteps.map((step, index) => /*#__PURE__*/React.createElement(StepperPanel, {
    key: index,
    header: step.label
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "substep-content"
  }, subSteps[activeSubStep].component, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Anterior Subm\xF3dulo",
    className: "p-button-outlined",
    disabled: activeSubStep === 0,
    onClick: handlePrevSubStep
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-left"
  })), /*#__PURE__*/React.createElement(Button, {
    iconPos: "right",
    label: "Siguiente Subm\xF3dulo",
    className: "p-button-success",
    disabled: activeSubStep === subSteps.length - 1,
    onClick: handleNextSubStep
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      marginLeft: '10px'
    },
    className: "fa-solid fa-arrow-right"
  })))))));
};