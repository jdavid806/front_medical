import React from 'react';
export const FormTabs = ({
  tabs,
  activeTab,
  setActiveTab,
  addNewTab
}) => /*#__PURE__*/React.createElement("ul", {
  className: "nav nav-tabs",
  id: "customTabs"
}, tabs.map((tab, index) => /*#__PURE__*/React.createElement("li", {
  key: index,
  className: "nav-item"
}, /*#__PURE__*/React.createElement("a", {
  className: `nav-link cursor-pointer ${activeTab === index ? 'active' : ''}`,
  onClick: () => setActiveTab(index)
}, tab.tab))), /*#__PURE__*/React.createElement("li", {
  className: "nav-item"
}, /*#__PURE__*/React.createElement("button", {
  type: "button",
  className: "btn btn-primary ms-2",
  onClick: addNewTab
}, "Agregar Pesta\xF1a")));