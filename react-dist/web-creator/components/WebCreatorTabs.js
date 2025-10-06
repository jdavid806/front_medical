// WebCreatorTabs.tsx
import React from 'react';
export const WebCreatorTabs = ({
  panel,
  onPanelClick,
  onComponentClick,
  onTabChange
}) => {
  if (!panel.tabsConfig || panel.tabsConfig.tabs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px',
        textAlign: 'center',
        color: '#6B7280',
        border: '1px dashed #e5e7eb',
        borderRadius: '6px'
      }
    }, "No hay pesta\xF1as configuradas");
  }
  const {
    tabs,
    activeTab
  } = panel.tabsConfig;
  const activeTabConfig = tabs.find(tab => tab.id === activeTab) || tabs[0];
  const handleTabClick = (tabId, event) => {
    onTabChange(panel, tabId);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb'
    }
  }, tabs.map(tab => /*#__PURE__*/React.createElement("button", {
    key: tab.id,
    onClick: e => handleTabClick(tab.id, e),
    style: {
      padding: '10px 16px',
      border: 'none',
      backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
      borderBottom: activeTab === tab.id ? '2px solid #3B82F6' : 'none',
      color: activeTab === tab.id ? '#3B82F6' : '#6B7280',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: activeTab === tab.id ? '600' : '400',
      transition: 'all 0.2s ease'
    }
  }, tab.label))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      height: 'calc(100% - 49px)',
      // Restar altura de la navegación
      overflow: 'auto'
    }
  }));
};