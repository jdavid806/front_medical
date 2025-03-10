import React, { useEffect, useState } from "react";
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
export const CustomSelectContainer = ({
  config,
  onChange
}) => {
  const {
    selectId,
    label,
    required,
    multiple,
    data,
    promise,
    value,
    mapper,
    name
  } = config;
  const [options, setOptions] = useState(data || []);
  useEffect(() => {
    if (promise) {
      promise.then(data => {
        setOptions(mapper(data));
      });
    }
  }, [promise]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    className: "form-label"
  }, label, " ", required && /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), multiple ? /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: selectId,
    name: name,
    value: value,
    onChange: onChange,
    options: options,
    optionLabel: "label",
    filter: true,
    className: "w-100",
    panelStyle: {
      zIndex: 100000,
      padding: 0
    },
    appendTo: "self"
  }) : /*#__PURE__*/React.createElement(Dropdown, {
    inputId: selectId,
    name: name,
    value: value,
    onChange: onChange,
    options: options,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    panelStyle: {
      zIndex: 100000,
      padding: 0
    },
    appendTo: "self"
  }));
};