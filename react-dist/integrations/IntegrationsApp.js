import React from "react";
import { LabplusIntegrationConfig } from "./forms/LabplusIntegrationConfig.js";
import { IntegrationsTabs } from "./components/IntegrationsTabs.js";
import { useIntegrationConfigs } from "./hooks/useIntegrationConfigs.js";
import { DGIIIntegrationConfig } from "./forms/DGIIIntegrationConfig.js";
import { SISPROIntegrationConfig } from "./forms/SISPROIntegrationConfig.js";
import { OpenAIIntegrationConfig } from "./forms/OpenAIIntegrationConfig.js";
import { CarnetIntegrationConfig } from "./forms/CarnetIntegrationConfig.js";
import { GeminiIntegrationConfig } from "./forms/GeminiIntegrationConfig.js";
export const IntegrationsApp = () => {
  const {
    configs
  } = useIntegrationConfigs();
  const tabs = [{
    id: "labplus-tab",
    label: "Labplus",
    icon: "fa-solid fa-plus",
    content: /*#__PURE__*/React.createElement(LabplusIntegrationConfig, {
      configs: configs
    })
  }, {
    id: "dgii-tab",
    label: "DGII",
    icon: "fa-solid fa-file-invoice",
    content: /*#__PURE__*/React.createElement(DGIIIntegrationConfig, {
      configs: configs
    })
  }, {
    id: "sispro-tab",
    label: "SISPRO",
    icon: "fa-solid fa-address-book",
    content: /*#__PURE__*/React.createElement(SISPROIntegrationConfig, {
      configs: configs
    })
  }, {
    id: "carnet-tab",
    label: "Carnet",
    icon: "fa-solid fa-envelopes-bulk",
    content: /*#__PURE__*/React.createElement(CarnetIntegrationConfig, {
      configs: configs
    })
  }, {
    id: "openai-tab",
    label: "OpenAI",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(OpenAIIntegrationConfig, {
      configs: configs
    })
  }, {
    id: "gemini-tab",
    label: "Gemini",
    icon: "fa-solid fa-brain",
    content: /*#__PURE__*/React.createElement(GeminiIntegrationConfig, {
      configs: configs
    })
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IntegrationsTabs, {
    tabs: tabs
  }));
};