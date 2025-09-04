import React, { useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
export const ConfigFieldListMultiple = props => {
  const {
    field,
    label,
    initialValue,
    onChange,
    options,
    placeholder
  } = props;
  const [value, setValue] = useState([]);
  const handleValueChange = e => {
    setValue(e.value);
    onChange(e.value.map(id => id).join(","));
  };
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue.split(","));
    }
  }, [initialValue]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: field,
    className: "form-label"
  }, label), /*#__PURE__*/React.createElement(MultiSelect, {
    options: options,
    optionLabel: "label",
    optionValue: "value",
    inputId: field,
    name: field,
    value: value,
    onChange: handleValueChange,
    className: "w-100",
    filter: true,
    showClear: true,
    placeholder: placeholder
  }));
};