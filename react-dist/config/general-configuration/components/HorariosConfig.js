import React from 'react';
import { UserAvailabilityApp } from "../../../user-availabilities/UserAvailabilityApp.js";
export const HorariosConfig = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  return /*#__PURE__*/React.createElement(UserAvailabilityApp, {
    onConfigurationComplete: onConfigurationComplete,
    isConfigurationContext: isConfigurationContext
  });
};