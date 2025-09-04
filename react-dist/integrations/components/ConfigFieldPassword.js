import React, { useState } from "react";
import { Password } from "primereact/password";
export const ConfigFieldPassword = props => {
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
  }, label), /*#__PURE__*/React.createElement(Password, {
    inputId: field,
    name: field,
    value: value,
    onChange: handleValueChange,
    feedback: false,
    tabIndex: 1,
    toggleMask: true,
    inputClassName: "w-100",
    className: "w-100",
    panelClassName: "w-100"
  }), /*#__PURE__*/React.createElement("style", null, `
                    .p-icon-field-right {
                        width: 100%;
                    }
                `));
};