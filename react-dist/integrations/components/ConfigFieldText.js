import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
export const ConfigFieldText = props => {
  const {
    field,
    label,
    initialValue,
    onChange
  } = props;
  const [value, setValue] = useState(initialValue || "");
  const handleValueChange = e => {
    setValue(e.target.value);
    onChange(e.target.value);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label"
  }, label), /*#__PURE__*/React.createElement(InputText, {
    id: field,
    name: field,
    value: value,
    onChange: handleValueChange,
    className: "w-100"
  }));
};