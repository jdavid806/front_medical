import React from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { finalizeOptions } from "../utils/constants.js";
const DoneStep = ({
  onHide
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-column align-items-center justify-content-center py-6"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle text-6xl text-green-500 mb-4"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "mb-4"
  }, "\xA1Felicidades!"), /*#__PURE__*/React.createElement("p", {
    className: "text-xl mb-6"
  }, "La factura ha sido creada exitosamente"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-column",
    style: {
      width: '300px'
    }
  }, /*#__PURE__*/React.createElement(Dropdown, {
    options: finalizeOptions,
    optionLabel: "label",
    placeholder: "Finalizar factura",
    className: "mb-4"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Terminar",
    icon: "pi pi-home",
    onClick: onHide
  })));
};
export default DoneStep;