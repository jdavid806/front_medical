import React from 'react';
import SpecialityApp from "../../../fe-config/speciality/SpecialityApp.js";
export const EspecialidadesConfig = ({
  onConfigurationComplete,
  isConfigurationContext = false
}) => {
  return /*#__PURE__*/React.createElement(SpecialityApp, {
    onConfigurationComplete: onConfigurationComplete,
    isConfigurationContext: isConfigurationContext
  });
};