// components/BranchesTab.tsx
import React from 'react';
import { BranchApp } from "../../../fe-config/company/branch/BranchApp.js";
export const BranchesTab = ({
  companyId,
  onValidationChange
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement(BranchApp, {
    onValidationChange: onValidationChange
  }));
};
export default BranchesTab;