import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { MenubarTreeSettings } from "./MenubarTreeSettings.js";
export const MenubarSettings = ({
  component,
  onChange
}) => {
  const [showMenuItemsDialog, setShowMenuItemsDialog] = useState(false);

  // Asegurarnos de que menuItems siempre sea un array
  const menuItems = component.menuItems || [];
  const handleMenuItemsChange = newMenuItems => {
    onChange({
      ...component,
      menuItems: newMenuItems
    });
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Configurar Items del Men\xFA",
    icon: "pi pi-cog",
    onClick: () => setShowMenuItemsDialog(true)
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, menuItems.length, " items del men\xFA configurados"))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showMenuItemsDialog,
    onHide: () => setShowMenuItemsDialog(false),
    header: "Configurar Items del Men\xFA",
    position: "center",
    style: {
      width: '80vw',
      maxWidth: '1200px'
    },
    modal: true,
    className: "menu-items-dialog"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement(MenubarTreeSettings, {
    menuItems: menuItems,
    onMenuItemsChange: handleMenuItemsChange
  }))));
};