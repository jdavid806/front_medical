import React from 'react';
import { Card } from 'primereact/card';
import WhatsAppConnection from "./WhatsAppConnection.js";
import SmtpConfigForm from "../form/SmtpConfigForm.js";
const CommunicationsTab = ({
  whatsAppStatus,
  onStatusChange
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Estado WhatsApp"
  }, /*#__PURE__*/React.createElement(WhatsAppConnection, {
    status: whatsAppStatus,
    onStatusChange: onStatusChange
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n de Correo SMTP"
  }, /*#__PURE__*/React.createElement(SmtpConfigForm, null))));
};
export default CommunicationsTab;