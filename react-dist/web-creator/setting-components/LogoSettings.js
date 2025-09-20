import React from "react";
import { InputText } from "primereact/inputtext";
export const LogoSettings = ({
  component,
  onChange
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "url",
    className: "form-label"
  }, "URL"), /*#__PURE__*/React.createElement(InputText, {
    id: "url",
    name: "url",
    value: component.imgSrc,
    onChange: e => onChange({
      ...component,
      imgSrc: e.target.value
    })
  })));
};