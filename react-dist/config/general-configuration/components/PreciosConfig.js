import React from 'react';
import { PricesConfig } from "../../prices/PricesConfig.js";
export const PreciosConfig = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  return /*#__PURE__*/React.createElement(PricesConfig, {
    onConfigurationComplete: onConfigurationComplete,
    isConfigurationContext: isConfigurationContext
  });
};