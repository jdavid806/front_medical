import React from "react";
import { Menubar } from "primereact/menubar";
import { navbarMenuStyle } from "./styles/navBarMegaMenu";
import { useMenuItems } from "./hooks/useMenuItems";
import { processMenuIcons } from "../../helpers/processMenuIcons";


const NavbarHeader = () => {
  const menuItems = useMenuItems();
  const processedItems = processMenuIcons(menuItems);
  
  return (
    <div className="navbar-megamenu-container">
      <Menubar model={processedItems} className="custom-responsive-megamenu" />
      <style>{navbarMenuStyle}</style>
    </div>
  );
};

export default NavbarHeader;
