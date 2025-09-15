
import React, { useRef } from "react";
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { useForm } from "react-hook-form";
export const MedicationInventoryForm = () => {
  const stepperRef = useRef(null);
  const handleNext = () => {
    stepperRef?.current?.nextCallback();
  };
  const handlePrev = () => {
    stepperRef?.current?.prevCallback();
  };
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      product_type_id: null,
      presentation: null
    }
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Datos generales"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-auto d-flex justify-content-center align-items-center"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Next",
    icon: "pi pi-arrow-right",
    iconPos: "right",
    onClick: handleNext
  }))), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n precio"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-12rem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-auto flex justify-content-center align-items-center"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-start"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Back",
    severity: "secondary",
    icon: "pi pi-arrow-left",
    onClick: handlePrev
  }))))));
};