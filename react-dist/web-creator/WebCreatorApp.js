import React, { useState, useRef } from "react";
import { WebCreatorComponentList } from "./WebCreatorComponentList.js";
import { WebCreatorComponentSettings } from "./WebCreatorComponentSettings.js";
import { Card } from "primereact/card";
import { WebCreatorSplitterEditor } from "./WebCreatorSplitterEditor.js";
import { WebCreatorPanelSetting } from "./WebCreatorPanelSetting.js"; // Componente principal de la aplicación
export const WebCreatorApp = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
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
  const addSiblingAbove = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'before');
    }
  };
  const addSiblingBelow = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'after');
    }
  };
  const addSiblingLeft = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'before');
    }
  };
  const addSiblingRight = () => {
    if (selectedPanel) {
      splitterEditorRef.current?.addSiblingPanel(selectedPanel, 'after');
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
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex w-100 h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex h-100 overflow-auto px-3",
    style: {
      minWidth: componentsContainerWidth,
      width: componentsContainerWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 w-100 overflow-auto"
  }, !selectedPanel && /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Selecciona un panel para agregar un componente")), selectedPanel && /*#__PURE__*/React.createElement(Card, {
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex h-100 overflow-auto px-3",
    style: {
      minWidth: componentSettingsContainerWidth,
      width: componentSettingsContainerWidth
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column h-100 overflow-auto"
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
    selectedComponent: selectedComponent
  })))));
};