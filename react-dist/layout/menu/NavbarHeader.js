import { Menubar } from 'primereact/menubar';
import React from 'react';
import { navbarMenuStyle } from "./styles/navBarMegaMenu.js";
import { useMenuItems } from "./hooks/useMenuItems.js";
const NavbarHeader = () => {
  const {
    menuItems: menuItemsFromHook,
    loading
  } = useMenuItems();
  const iconTemplate = iconClass => {
    return iconClass ? /*#__PURE__*/React.createElement("i", {
      className: iconClass
    }) : null;
  };
  const processItems = items => {
    if (!items || !Array.isArray(items)) return [];
    return items.map(item => {
      const processedItem = {
        label: item.label,
        url: item.url
      };
      if (item.icon) {
        processedItem.icon = () => iconTemplate(item.icon);
      }
      if (item.items && item.items.length > 0) {
        processedItem.items = processItems(item.items);
      }
      return processedItem;
    });
  };
  const processedItems = processItems(menuItemsFromHook);
  if (loading) {
    return /*#__PURE__*/React.createElement("div", null, "Cargando men\xFA...");
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Menubar, {
    model: processedItems,
    className: "custom-responsive-megamenu"
  }), /*#__PURE__*/React.createElement("style", null, navbarMenuStyle));
};
export default NavbarHeader;