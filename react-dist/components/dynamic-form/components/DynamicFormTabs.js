import React from 'react';
export const DynamicFormTabs = ({
  tabs,
  activeTab,
  setActiveTab
}) => /*#__PURE__*/React.createElement("ul", {
  className: "nav nav-tabs",
  id: "customTabs"
}, tabs.map((tab, index) => /*#__PURE__*/React.createElement("li", {
  key: index,
  className: "nav-item"
}, /*#__PURE__*/React.createElement("a", {
  className: `nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`,
  onClick: () => setActiveTab(index)
}, tab.tab))));