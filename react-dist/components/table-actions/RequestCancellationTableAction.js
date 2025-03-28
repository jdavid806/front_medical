import React from 'react';
export const RequestCancellationTableAction = ({
  onTrigger
}) => {
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: "#",
    onClick: () => onTrigger && onTrigger()
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-ban",
    style: {
      width: '20px'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Solicitar anulaci\xF3n"))));
};