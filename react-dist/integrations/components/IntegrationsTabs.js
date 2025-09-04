import React from "react";
export const IntegrationsTabs = props => {
  const {
    tabs
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row gx-3 gy-4 mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-underline fs-9 flex-column me-3",
    id: "tabs-typeMessages",
    role: "tablist"
  }, tabs.map(tab => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
    key: tab.id,
    className: "nav-item",
    role: "presentation"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav-link",
    id: tab.id,
    "data-bs-toggle": "tab",
    "data-bs-target": `#${tab.id}-pane`,
    type: "button",
    role: "tab",
    "aria-controls": `#${tab.id}-pane`,
    "aria-selected": "true"
  }, /*#__PURE__*/React.createElement("i", {
    className: tab.icon
  }), " ", tab.label))))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content w-100",
    id: "typeMessages-tabContent"
  }, tabs.map(tab => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    key: `#${tab.id}-pane`,
    className: "tab-pane fade show",
    id: `${tab.id}-pane`,
    role: "tabpanel",
    "aria-labelledby": `${tab.id}-pane`
  }, tab.content))))))), /*#__PURE__*/React.createElement("style", null, `
                #tabs-typeMessages {
                    min-width: 200px;
                    max-width: 250px;
                }
                #tabs-typeMessages .nav-link {
                    width: 100%;
                    text-align: left;
                }
                `));
};