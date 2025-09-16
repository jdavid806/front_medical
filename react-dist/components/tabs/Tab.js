import React from "react";
export const Tab = ({
  tab,
  activeTab,
  onActiveTabChange,
  showCheckIcon
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: `w-100 p-3 btn btn-outline-primary ${activeTab === tab.key ? "btn-primary text-white" : ""} btn-sm`,
    onClick: () => {
      if (activeTab === tab.key) {
        onActiveTabChange?.(null);
        return;
      }
      onActiveTabChange?.(tab.key);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: showCheckIcon ? "d-block" : "d-none"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-check-circle`,
    style: {
      width: "20px",
      height: "20px"
    }
  })), tab.label)));
};