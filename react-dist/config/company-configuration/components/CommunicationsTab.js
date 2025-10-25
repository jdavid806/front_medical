import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import WhatsAppConnection from "./WhatsAppConnection.js";
const CommunicationsTab = ({
  whatsAppStatus,
  onStatusChange,
  onValidationChange
}) => {
  useEffect(() => {
    const isValid = whatsAppStatus.connected === true;
    onValidationChange?.(isValid);
  }, [whatsAppStatus, onValidationChange]);
  const handleStatusChange = status => {
    onStatusChange(status);
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-4"
  }, "Configuraci\xF3n de Comunicaciones"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-4"
  }, "Configura la conexi\xF3n de WhatsApp para enviar notificaciones a tus pacientes."), /*#__PURE__*/React.createElement(WhatsAppConnection, {
    onStatusChange: handleStatusChange
  })))));
};
export default CommunicationsTab;