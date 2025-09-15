import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { navbarMenuStyle } from "./styles/navBarMegaMenu.js";
import { processMenuIcons } from "../../helpers/processMenuIcons.js";
const NavbarHeader = () => {
  const [backendMenus, setBackendMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  window.updateNavbarMenus = () => {
    const menus = JSON.parse(localStorage.getItem("menus") || "[]");
    setBackendMenus(menus);
    setIsLoading(false);
  };
  useEffect(() => {
    window.updateNavbarMenus();
  }, []);
  const processedItems = processMenuIcons(backendMenus);
  return /*#__PURE__*/React.createElement("div", {
    className: "navbar-megamenu-container"
  }, isLoading ? /*#__PURE__*/React.createElement("p", null, "Cargando...")
  // <ProgressSpinner style={{ width: '50px', height: '50px' }} />
  : backendMenus.length > 0 ? /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
    className: "custom-responsive-megamenu"
  }) : /*#__PURE__*/React.createElement("p", null, "No tienes elementos de men\xFA disponibles, comun\xEDcate con el administrador."), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};
export default NavbarHeader;