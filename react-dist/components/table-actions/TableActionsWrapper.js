import React from 'react';
const TableActionsWrapper = ({
  children
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "dropdown",
    style: {
      marginBottom: '10px',
      marginTop: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary dropdown-toggle",
    type: "button",
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false"
  }, /*#__PURE__*/React.createElement("i", {
    "data-feather": "settings"
  }), " Acciones"), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu",
    style: {
      zIndex: 10000
    }
  }, children));
};
export default TableActionsWrapper;