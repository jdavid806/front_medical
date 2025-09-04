import React from "react";
import { LabplusIntegrationConfig } from "./forms/LabplusIntegrationConfig.js";
import { IntegrationsTabs } from "./components/IntegrationsTabs.js";
import { useIntegrationConfigs } from "./hooks/useIntegrationConfigs.js";
import { DGIIIntegrationConfig } from "./forms/DGIIIntegrationConfig.js";
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
    id: "representante-tab",
    label: "Representante",
    icon: "fa-solid fa-address-book",
    content: /*#__PURE__*/React.createElement("div", null, "Contenido del tab Representante")
  }, {
    id: "comunicacion-tab",
    label: "Comunicaciones",
    icon: "fa-solid fa-envelopes-bulk",
    content: /*#__PURE__*/React.createElement("div", null, "Contenido del tab Comunicaciones")
  }, {
    id: "sedes-tab",
    label: "Sedes",
    icon: "fa-solid fa-location-dot",
    content: /*#__PURE__*/React.createElement("div", null, "Contenido del tab Sedes")
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(IntegrationsTabs, {
    tabs: tabs
  }));
};