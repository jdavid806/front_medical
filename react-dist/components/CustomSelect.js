import React, { useEffect, useRef } from 'react';
import Choices from 'choices.js';
export const CustomSelect = ({
  selectId,
  options,
  value,
  onChange,
  multiple,
  required = false,
  showLabel = true,
  label = '',
  name
}) => {
  const selectRef = useRef(null);
  const choicesInstance = useRef(null);
  const [selectedValues, setSelectedValues] = React.useState([]);
  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        removeItemButton: multiple,
        shouldSort: false,
        duplicateItemsAllowed: false
      });
      selectRef.current.addEventListener('change', handleChange);
    }
    return () => {
      if (choicesInstance.current) {
        selectRef.current?.removeEventListener('change', handleChange);
        choicesInstance.current.destroy();
      }
    };
  }, []);
  useEffect(() => {
    if (choicesInstance.current && value) {
      choicesInstance.current.setValue(value);
    }
  }, [value]);
  useEffect(() => {
    if (choicesInstance.current) {
      choicesInstance.current.setChoices(options, 'value', 'label', true);
    }
  }, [options]);
  const handleChange = () => {
    if (selectRef.current) {
      const selectedValues = Array.from(selectRef.current.options).filter(option => option.selected).map(option => option.value);
      setSelectedValues(selectedValues);
      if (onChange) {
        onChange(selectedValues);
      }
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, showLabel && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    className: "form-label"
  }, label, " ", required && '*'), /*#__PURE__*/React.createElement("select", {
    id: selectId,
    ref: selectRef,
    multiple: multiple,
    className: "form-select",
    style: {
      display: 'none'
    },
    required: required
  }, options.map(option => /*#__PURE__*/React.createElement("option", {
    key: option.value,
    value: option.value,
    disabled: option.disabled,
    "data-data": option.data
  }, option.label))), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: name,
    value: selectedValues
  }));
};