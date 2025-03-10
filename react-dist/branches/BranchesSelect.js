import React from 'react';
import { CustomSelect } from "../components/CustomSelect.js";
export const BranchesSelect = ({
  selectId,
  onChange,
  value,
  placeholder
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomSelect, {
    selectId: selectId,
    onChange: onChange,
    options: [{
      value: 'main',
      label: 'main'
    }],
    value: value,
    placeholder: placeholder
  }));
};