import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
export const WebCreatorInput = ({
  component
}) => {
  const [value, setValue] = useState('');
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, component.label), /*#__PURE__*/React.createElement(InputText, {
    value: value,
    onChange: e => setValue(e.target.value)
  }));
};