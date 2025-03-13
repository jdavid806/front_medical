import React from 'react';
import { Modal } from 'react-bootstrap';
export const CustomModal = ({
  children,
  title,
  show,
  onHide,
  footerTemplate,
  scrollable = false
}) => {
  return /*#__PURE__*/React.createElement(Modal, {
    show: show,
    onHide: onHide,
    size: "xl",
    "aria-labelledby": "contained-modal-title-vcenter",
    centered: true,
    className: `${scrollable ? 'modal-dialog-scrollable' : ''}`,
    scrollable: scrollable
  }, /*#__PURE__*/React.createElement(Modal.Header, {
    closeButton: true
  }, /*#__PURE__*/React.createElement(Modal.Title, {
    id: "contained-modal-title-vcenter"
  }, title)), /*#__PURE__*/React.createElement(Modal.Body, null, children), footerTemplate && /*#__PURE__*/React.createElement(Modal.Footer, null, footerTemplate));
};