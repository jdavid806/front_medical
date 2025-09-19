import React from "react";
import { Divider } from "primereact/divider";
import { LogoSettings } from "./setting-components/LogoSettings.js";
import { MenubarSettings } from "./setting-components/MenubarSettings.js";
export const WebCreatorComponentSettings = ({
  selectedComponent,
  onChange
}) => {
  const getComponentSettings = () => {
    switch (selectedComponent.type) {
      case "logo":
        return /*#__PURE__*/React.createElement(LogoSettings, {
          component: selectedComponent,
          onChange: component => onChange(component)
        });
      case "menubar":
        return /*#__PURE__*/React.createElement(MenubarSettings, {
          component: selectedComponent,
          onChange: component => onChange(component)
        });
      case "button":
        return /*#__PURE__*/React.createElement("div", null, "Button settings");
      case "sidebar":
        return /*#__PURE__*/React.createElement("div", null, "Sidebar settings");
      default:
        return /*#__PURE__*/React.createElement("div", null, "Unknown component type");
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, selectedComponent.name), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, getComponentSettings())));
};