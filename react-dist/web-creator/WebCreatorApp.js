import React, { useState, useRef } from "react";
import { WebCreatorComponentList } from "./WebCreatorComponentList.js";
import { WebCreatorComponentSettings } from "./WebCreatorComponentSettings.js";
import { Card } from "primereact/card";
import { WebCreatorSplitterEditor } from "./WebCreatorSplitterEditor.js";
import { WebCreatorPanelSetting } from "./WebCreatorPanelSetting.js";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";

// Componente principal de la aplicación
export const WebCreatorApp = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const splitterEditorRef = useRef(null);
  const componentsContainerWidth = "300px";
  const componentSettingsContainerWidth = "300px";
  const handleSelectComponentFromList = component => {
    if (selectedPanel) {
      splitterEditorRef.current?.addComponentToPanel(selectedPanel, component);
    }
  };
  const handleSelectComponentFromGrid = component => {
    setSelectedComponent(component);
    setSelectedPanel(null);
  };
  const handleSelectPanel = panel => {
    setSelectedPanel(panel);
    setSelectedComponent(null);
  };
  const handleComponentChange = component => {
    setSelectedComponent(component);
    splitterEditorRef.current?.updateComponentInPanel(component);
  };
  const addSiblingAbove = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'above');
    }
  };
  const addSiblingBelow = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'below');
    }
  };
  const addSiblingLeft = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'left');
    }
  };
  const addSiblingRight = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'right');
    }
  };
  const addHorizontalChild = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addChildPanel(selectedPanel, 'horizontal');
    }
  };
  const addVerticalChild = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addChildPanel(selectedPanel, 'vertical');
    }
  };
  const removeSelectedPanel = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.removePanel(selectedPanel);
    }
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // Barra de herramientas superior
  const toolbarLeft = /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-lg"
  }, "Editor de Grilla"));
  const toolbarRight = /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: isFullScreen ? /*#__PURE__*/React.createElement("i", {
      className: "fa fa-compress"
    }) : /*#__PURE__*/React.createElement("i", {
      className: "fa fa-expand"
    }),
    text: true,
    rounded: true,
    onClick: toggleFullScreen,
    tooltip: isFullScreen ? "Salir de pantalla completa" : "Pantalla completa",
    tooltipOptions: {
      position: 'bottom'
    }
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column w-100 h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border-bottom-1 surface-border mb-3"
  }, /*#__PURE__*/React.createElement(Toolbar, {
    left: toolbarLeft,
    right: toolbarRight,
    style: {
      padding: '0.5rem 1rem',
      backgroundColor: 'white',
      border: 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 w-100 h-100"
  }, !isFullScreen && selectedPanel && /*#__PURE__*/React.createElement("div", {
    className: "d-flex h-100 overflow-auto px-3",
    style: {
      minWidth: componentsContainerWidth,
      width: componentsContainerWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 w-100 overflow-auto"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100"
  }, /*#__PURE__*/React.createElement(WebCreatorComponentList, {
    onComponentClick: handleSelectComponentFromList
  })))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 h-100 w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 w-100 overflow-auto"
  }, /*#__PURE__*/React.createElement(WebCreatorSplitterEditor, {
    onPanelClick: handleSelectPanel,
    onComponentClick: handleSelectComponentFromGrid,
    ref: splitterEditorRef
  }))), !isFullScreen && /*#__PURE__*/React.createElement("div", {
    className: "d-flex h-100 overflow-auto px-3",
    style: {
      minWidth: componentSettingsContainerWidth,
      width: componentSettingsContainerWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 w-100 overflow-auto"
  }, !selectedComponent && !selectedPanel && /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Selecciona un elemento para configurarlo")), selectedPanel && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(WebCreatorPanelSetting, {
    addSiblingAbove: addSiblingAbove,
    addSiblingBelow: addSiblingBelow,
    addSiblingLeft: addSiblingLeft,
    addSiblingRight: addSiblingRight,
    addHorizontalChild: addHorizontalChild,
    addVerticalChild: addVerticalChild,
    removeSelectedPanel: removeSelectedPanel
  })), selectedComponent && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(WebCreatorComponentSettings, {
    selectedComponent: selectedComponent,
    onChange: handleComponentChange
  }))))));
};