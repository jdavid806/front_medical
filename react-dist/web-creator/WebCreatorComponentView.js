import React from "react";
import { WebCreatorLogo } from "./components/WebCreatorLogo.js";
import { WebCreatorMenuBar } from "./components/WebCreatorMenuBar.js";
import { WebCreatorButton } from "./components/WebCreatorButton.js";
import { WebCreatorInput } from "./components/WebCreatorInput.js";
export const WebCreatorComponentView = props => {
  const {
    component
  } = props;
  switch (component.type) {
    case "logo":
      return /*#__PURE__*/React.createElement(WebCreatorLogo, {
        component: component
      });
    case "menubar":
      return /*#__PURE__*/React.createElement(WebCreatorMenuBar, {
        component: component
      });
    case "button":
      return /*#__PURE__*/React.createElement(WebCreatorButton, {
        component: component
      });
    case "sidebar":
      return /*#__PURE__*/React.createElement("div", null, "Sidebar settings");
    case "input":
      return /*#__PURE__*/React.createElement(WebCreatorInput, {
        component: component
      });
    default:
      return /*#__PURE__*/React.createElement("div", null, "Unknown component type");
  }
};