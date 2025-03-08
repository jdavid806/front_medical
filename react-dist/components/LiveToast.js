import React from 'react';
const Toast = ({
  show
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "position-fixed bottom-0 end-0 p-3",
    style: {
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `toast ${show ? 'show' : 'fade'}`,
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "toast-header"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "me-auto"
  }, "Bootstrap"), /*#__PURE__*/React.createElement("small", {
    className: "text-body-secondary"
  }, "11 mins ago"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn ms-2 p-0",
    "data-bs-dismiss": "toast",
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("span", {
    className: "uil uil-times fs-7"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "toast-body"
  }, "Hello, world! This is a toast message.")));
};
export default Toast;