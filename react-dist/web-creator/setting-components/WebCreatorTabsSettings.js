// WebCreatorTabsSettings.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { generateUUID } from "../../../services/utilidades.js";
export const WebCreatorTabsSettings = ({
  panel,
  onTabsChange
}) => {
  const [newTabLabel, setNewTabLabel] = useState('');
  const initializeTabsConfig = () => {
    if (!panel.tabsConfig) {
      const defaultTabId = generateUUID();
      return {
        ...panel,
        tabsConfig: {
          tabs: [{
            id: defaultTabId,
            label: 'Pestaña 1',
            content: {
              uuid: generateUUID(),
              component: null,
              children: [],
              cols: 12,
              styles: {
                backgroundColor: '#ffffff',
                padding: 16,
                margin: 0,
                borderRadius: 0
              }
            }
          }],
          activeTab: defaultTabId
        }
      };
    }
    return panel;
  };
  const addTab = () => {
    if (!newTabLabel.trim()) return;
    const updatedPanel = initializeTabsConfig();
    const newTabId = generateUUID();
    const newTab = {
      id: newTabId,
      label: newTabLabel,
      content: {
        uuid: generateUUID(),
        component: null,
        children: [],
        cols: 12,
        styles: {
          backgroundColor: '#ffffff',
          padding: 16,
          margin: 0,
          borderRadius: 0
        }
      }
    };
    const updatedTabsConfig = {
      ...updatedPanel.tabsConfig,
      tabs: [...updatedPanel.tabsConfig.tabs, newTab]
    };
    onTabsChange({
      ...updatedPanel,
      tabsConfig: updatedTabsConfig
    });
    setNewTabLabel('');
  };
  const removeTab = tabId => {
    const updatedPanel = initializeTabsConfig();
    const currentTabs = updatedPanel.tabsConfig.tabs;
    if (currentTabs.length <= 1) return;
    const filteredTabs = currentTabs.filter(tab => tab.id !== tabId);
    let newActiveTab = updatedPanel.tabsConfig.activeTab;

    // Si eliminamos el tab activo, activamos el primero
    if (newActiveTab === tabId && filteredTabs.length > 0) {
      newActiveTab = filteredTabs[0].id;
    }
    onTabsChange({
      ...updatedPanel,
      tabsConfig: {
        tabs: filteredTabs,
        activeTab: newActiveTab
      }
    });
  };
  const updateTabLabel = (tabId, newLabel) => {
    const updatedPanel = initializeTabsConfig();
    const updatedTabs = updatedPanel.tabsConfig.tabs.map(tab => tab.id === tabId ? {
      ...tab,
      label: newLabel
    } : tab);
    onTabsChange({
      ...updatedPanel,
      tabsConfig: {
        ...updatedPanel.tabsConfig,
        tabs: updatedTabs
      }
    });
  };
  const setActiveTab = tabId => {
    const updatedPanel = initializeTabsConfig();
    onTabsChange({
      ...updatedPanel,
      tabsConfig: {
        ...updatedPanel.tabsConfig,
        activeTab: tabId
      }
    });
  };
  const tabsConfig = panel.tabsConfig || initializeTabsConfig().tabsConfig;
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Configuraci\xF3n de Tabs"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newTabLabel",
    className: "block text-sm font-medium mb-2"
  }, "Nueva Pesta\xF1a"), /*#__PURE__*/React.createElement(InputText, {
    id: "newTabLabel",
    value: newTabLabel,
    onChange: e => setNewTabLabel(e.target.value),
    placeholder: "Nombre de la pesta\xF1a",
    className: "w-full"
  })), /*#__PURE__*/React.createElement(Button, {
    icon: "fa fa-plus",
    onClick: addTab,
    disabled: !newTabLabel.trim(),
    tooltip: "Agregar pesta\xF1a"
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("h5", null, "Pesta\xF1as (", tabsConfig?.tabs?.length, ")"), tabsConfig?.tabs?.map(tab => /*#__PURE__*/React.createElement("div", {
    key: tab.id,
    className: "d-flex gap-2 align-items-center p-2 border-round surface-100"
  }, /*#__PURE__*/React.createElement(InputText, {
    value: tab.label,
    onChange: e => updateTabLabel(tab.id, e.target.value),
    className: "flex-grow-1"
  }), /*#__PURE__*/React.createElement(Button, {
    icon: `fa fa-${tabsConfig.activeTab === tab.id ? 'check' : 'circle'}`,
    text: true,
    severity: tabsConfig.activeTab === tab.id ? "success" : "secondary",
    onClick: () => setActiveTab(tab.id),
    tooltip: "Activar pesta\xF1a"
  }), /*#__PURE__*/React.createElement(Button, {
    icon: "fa fa-trash",
    text: true,
    severity: "danger",
    onClick: () => removeTab(tab.id),
    disabled: tabsConfig.tabs.length <= 1,
    tooltip: "Eliminar pesta\xF1a"
  })))), /*#__PURE__*/React.createElement("small", {
    className: "text-color-secondary"
  }, "Cada pesta\xF1a funciona como un contenedor independiente donde puedes agregar componentes."));
};