import React from "react";
import { WebCreatorLogo } from "./components/WebCreatorLogo.js";
import { WebCreatorMenuBar } from "./components/WebCreatorMenuBar.js";
import { WebCreatorButton } from "./components/WebCreatorButton.js";
const renderComponent = component => {
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
      return /*#__PURE__*/React.createElement("div", null, "Sidebar");
    default:
      return /*#__PURE__*/React.createElement("div", null, "Componente no reconocido");
  }
};
const renderPreviewPanel = panel => {
  const hasChildren = panel.children && panel.children.length > 0;
  const hasComponent = panel.component !== null;

  // Calcular ancho basado en columnas
  const widthPercentage = (panel.cols || 12) / 12 * 100;

  // Aplicar estilos configurados
  const panelStyle = {
    flex: `0 0 ${widthPercentage}%`,
    minWidth: '20px',
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
    border: `${panel.styles?.borderWidth || 0}px solid ${panel.styles?.borderColor || '#e5e7eb'}`,
    borderRadius: (panel.styles?.borderRadius || 6) + 'px',
    margin: (panel.styles?.margin || 0) + 'px',
    padding: (panel.styles?.padding || 0) + 'px',
    backgroundColor: panel.styles?.backgroundColor || 'white',
    boxShadow: panel.styles?.boxShadow || 'none'
  };
  const containerStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
    flexDirection: panel.layout === 'vertical' ? 'column' : 'row',
    alignItems: panel.styles?.alignItems || 'center',
    justifyContent: panel.styles?.justifyContent || 'center'
  };
  if (hasChildren) {
    return /*#__PURE__*/React.createElement("div", {
      style: panelStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: containerStyle
    }, panel.children.map(child => /*#__PURE__*/React.createElement("div", {
      key: child.uuid,
      style: {
        flex: `0 0 ${(child.cols || 12) / 12 * 100}%`
      }
    }, renderPreviewPanel(child)))));
  } else if (hasComponent) {
    return /*#__PURE__*/React.createElement("div", {
      style: panelStyle
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, renderComponent(panel.component)));
  } else {
    return /*#__PURE__*/React.createElement("div", {
      style: panelStyle
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#6B7280',
        fontSize: '14px'
      }
    }, "Panel vac\xEDo"));
  }
};
export const WebCreatorPreview = ({
  gridConfiguration
}) => {
  if (!gridConfiguration || !gridConfiguration.rootPanel) {
    return /*#__PURE__*/React.createElement("div", null, "No hay configuraci\xF3n de grilla para previsualizar");
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "web-creator-preview",
    style: {
      width: '100%',
      height: '100%'
    }
  }, renderPreviewPanel(gridConfiguration.rootPanel));
};