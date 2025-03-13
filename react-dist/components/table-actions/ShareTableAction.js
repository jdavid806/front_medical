import React from 'react';
const actions = {
  whatsapp: {
    label: 'Compartir por Whatsapp',
    icon: 'fa-brands fa-whatsapp'
  },
  email: {
    label: 'Compartir por Correo',
    icon: 'fa-solid fa-envelope'
  }
};
export const ShareTableAction = ({
  shareType,
  onTrigger
}) => {
  const action = actions[shareType || 'whatsapp'];
  return /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: "#",
    onClick: () => onTrigger && onTrigger()
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: action.icon,
    style: {
      width: '20px'
    }
  }), /*#__PURE__*/React.createElement("span", null, action.label))));
};