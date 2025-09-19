import React from "react";
import { Menubar } from "primereact/menubar";
import { navbarMenuStyle } from "../../layout/menu/styles/navBarMegaMenu.js";
export const WebCreatorMenuBar = ({
  component
}) => {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Menubar, {
    model: component.menuItems,
    className: "custom-responsive-megamenu"
  }), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};