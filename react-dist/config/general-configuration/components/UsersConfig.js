import React from 'react';
import { UserApp } from "../../../users/UserApp.js";
export const UsersConfig = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  return /*#__PURE__*/React.createElement(UserApp, {
    onConfigurationComplete: onConfigurationComplete,
    isConfigurationContext: isConfigurationContext
  });
};