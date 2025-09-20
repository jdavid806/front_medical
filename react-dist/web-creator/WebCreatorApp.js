import React, { useState, useRef } from "react";
import { WebCreatorComponentList } from "./WebCreatorComponentList.js";
import { WebCreatorComponentSettings } from "./WebCreatorComponentSettings.js";
import { Card } from "primereact/card";
import { WebCreatorSplitterEditor } from "./WebCreatorSplitterEditor.js";
import { WebCreatorPanelSetting } from "./WebCreatorPanelSetting.js";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { WebCreatorPreview } from "./WebCreatorPreview.js"; // Nuevo componente para previsualización
// Componente principal de la aplicación
export const WebCreatorApp = () => {
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false); // Estado para controlar la previsualización
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
  const handlePanelChange = panel => {
    if (selectedPanel) {
      setSelectedPanel(panel);
      splitterEditorRef.current?.updatePanel(panel);
    }
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
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };

  // Obtener la configuración actual de la grilla
  const getGridConfiguration = () => {
    // Esta función debería devolver la estructura completa de la grilla
    // Por ahora devolvemos un objeto con la información básica
    return {
      rootPanel: splitterEditorRef.current?.getRootPanel() || {
        uuid: 'root',
        cols: 12,
        layout: 'horizontal',
        children: [],
        component: null
      }
      // Otras configuraciones necesarias
    };
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
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-eye"
    }),
    text: true,
    rounded: true,
    onClick: togglePreview,
    tooltip: "Previsualizar p\xE1gina",
    tooltipOptions: {
      position: 'bottom'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: isFullScreen ? "fa fa-compress" : "fa fa-expand"
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
    panel: selectedPanel,
    addSiblingAbove: addSiblingAbove,
    addSiblingBelow: addSiblingBelow,
    addSiblingLeft: addSiblingLeft,
    addSiblingRight: addSiblingRight,
    addHorizontalChild: addHorizontalChild,
    addVerticalChild: addVerticalChild,
    removeSelectedPanel: removeSelectedPanel,
    onPanelStyleChange: handlePanelChange
  })), selectedComponent && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(WebCreatorComponentSettings, {
    selectedComponent: selectedComponent,
    onChange: handleComponentChange
  }))))), /*#__PURE__*/React.createElement(Dialog, {
    visible: previewVisible,
    onHide: () => setPreviewVisible(false),
    header: "Previsualizaci\xF3n de la P\xE1gina",
    position: "center",
    style: {
      width: '100vw',
      height: '100vh'
    },
    maximizable: true,
    className: "preview-dialog"
  }, /*#__PURE__*/React.createElement(WebCreatorPreview, {
    gridConfiguration: getGridConfiguration()
  })));
};