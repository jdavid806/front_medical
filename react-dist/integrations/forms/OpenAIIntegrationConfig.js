import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const OpenAIIntegrationConfig = props => {
  const {
    configs = []
  } = props;
  const initialConfigFields = [{
    configKey: "OPENAI_API_KEY",
    field: "api_key",
    label: "API Key",
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