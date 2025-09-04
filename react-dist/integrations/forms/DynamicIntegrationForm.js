import React from "react";
import { Button } from "primereact/button";
import { useIntegrationForm } from "../hooks/useIntegrationForm.js";
import { ConfigField } from "../components/ConfigField.js";
export const DynamicIntegrationForm = props => {
  const {
    configs,
    initialConfigFields,
    onSubmit
  } = props;
  const {
    configFields,
    setValue,
    handleSubmit,
    appendFile
  } = useIntegrationForm({
    configs,
    initialConfigFields
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, configFields.map(field => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ConfigField, {
    key: field.field,
    field: field.field,
    label: field.label,
    type: field.type,
    initialValue: field.initialValue,
    source: field.source,
    sourceType: field.sourceType,
    multiple: field.multiple,
    onChange: value => setValue(field.field, value),
    onFileChange: value => appendFile(value),
    placeholder: field.placeholder,
    description: field.description
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    onClick: handleSubmit(data => onSubmit(data))
  })));
};