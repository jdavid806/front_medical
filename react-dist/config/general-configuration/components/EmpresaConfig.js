import React from 'react';
import { CompanyConfiguration } from "../../company-configuration/CompanyConfiguration.js";
export const EmpresaConfig = ({
  onConfigurationComplete
}) => {
  return /*#__PURE__*/React.createElement(CompanyConfiguration, {
    onComplete: onConfigurationComplete
  });
};