import { Menubar } from "primereact/menubar";
import React from "react";
import { navbarMenuStyle } from "./styles/navBarMegaMenu.js";
import { useMenuItems } from "./hooks/useMenuItems.js";
import { processMenuIcons } from "../../helpers/processMenuIcons.js";
const NavbarHeader = () => {
  const menuItems = useMenuItems();
  const processedItems = processMenuIcons(menuItems);
  return /*#__PURE__*/React.createElement("div", {
    className: "navbar-megamenu-container"
  }, /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
    className: "custom-responsive-megamenu"
  }), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};
export default NavbarHeader;