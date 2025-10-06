import React from 'react';
import { UserRoleApp } from "../../../user-roles/UserRoleApp.js";
export const RolesConfig = ({
  onConfigurationComplete
}) => {
  return /*#__PURE__*/React.createElement(UserRoleApp, {
    onConfigurationComplete: onConfigurationComplete
  });
};