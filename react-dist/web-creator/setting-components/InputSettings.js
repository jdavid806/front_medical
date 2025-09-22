import React from "react";
import { InputText } from "primereact/inputtext";
export const InputSettings = ({
  component,
  onChange
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "label",
    className: "form-label"
  }, "Label"), /*#__PURE__*/React.createElement(InputText, {
    id: "label",
    name: "label",
    value: component.label,
    onChange: e => onChange({
      ...component,
      label: e.target.value
    })
  })));
};