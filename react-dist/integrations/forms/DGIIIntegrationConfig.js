import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const DGIIIntegrationConfig = props => {
  const {
    configs = []
  } = props;
  const initialConfigFields = [{
    configKey: "DGII_FILE",
    field: "file",
    label: "Certificado P12",
    type: "file",
    description: "Certificado P12 del DGII"
  }, {
    configKey: "DGII_PASSWORD",
    field: "password",
    label: "Contraseña",
    type: "password",
    description: "Contraseña del certificado P12"
  }, {
    configKey: "DGII_TENANTS",
    field: "tenants",
    label: "Tenants",
    type: "list",
    source: "DGII_TENANTS",
    sourceType: "static",
    multiple: false,
    placeholder: "Seleccione un tenant"
  }, {
    configKey: "DGII_USERS",
    field: "users",
    label: "Usuarios",
    type: "list",
    source: "USERS",
    sourceType: "api",
    multiple: true,
    placeholder: "Seleccione un usuario"
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