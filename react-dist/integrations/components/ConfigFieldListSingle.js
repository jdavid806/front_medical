import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
export const ConfigFieldListSingle = props => {
  const {
    field,
    label,
    initialValue,
    onChange,
    options,
    placeholder
  } = props;
  const [value, setValue] = useState(initialValue || "");
  const handleValueChange = e => {
    setValue(e.value);
    onChange(e.value);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label"
  }, label), /*#__PURE__*/React.createElement(Dropdown, {
    options: options,
    optionLabel: "label",
    optionValue: "value",
    inputId: field,
    name: field,
    value: value,
    onChange: handleValueChange,
    className: "w-100",
    placeholder: placeholder
  }));
};