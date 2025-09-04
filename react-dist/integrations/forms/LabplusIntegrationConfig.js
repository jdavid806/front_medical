import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const LabplusIntegrationConfig = props => {
  const {
    configs = []
  } = props;
  const initialConfigFields = [{
    configKey: "LABPLUS_URL",
    field: "url",
    label: "URL",
    type: "text"
  }, {
    configKey: "LABPLUS_TOKEN",
    field: "token",
    label: "Token",
    type: "text"
  }];
  const handleSubmit = data => {
    console.log(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicIntegrationForm, {
    configs: configs,
    initialConfigFields: initialConfigFields,
    onSubmit: handleSubmit
  }));
};