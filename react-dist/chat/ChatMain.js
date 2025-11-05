"use client";

import { ChatApp } from "./ChatApp.js";
import { ChatBubble } from "./ChatBubble.js";
export default function ChatMain() {
  const token = sessionStorage.getItem("auth_token") || "";
  return /*#__PURE__*/React.createElement("main", {
    className: "min-h-screen bg-background p-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-4xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-8"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl font-bold text-foreground mb-4"
  }, "Bienvenido"), /*#__PURE__*/React.createElement("p", {
    className: "text-lg text-muted-foreground"
  }, "Haz clic en el bot\xF3n de chat en la esquina inferior derecha para comenzar a conversar")), /*#__PURE__*/React.createElement("div", {
    className: "bg-card border border-border rounded-lg p-8 shadow-sm mb-8"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-semibold text-foreground mb-4"
  }, "Contenido de ejemplo"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground mb-4"
  }, "Esta es una p\xE1gina de ejemplo. El m\xF3dulo de chat flotante est\xE1 disponible en todo momento desde el bot\xF3n en la esquina inferior derecha."), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Puedes navegar por tu sitio web mientras mantienes conversaciones activas con tus contactos.")), /*#__PURE__*/React.createElement("div", {
    className: "mb-8 border border-border rounded-lg p-4 shadow-sm"
  }, /*#__PURE__*/React.createElement(ChatApp, {
    token: token
  }))), /*#__PURE__*/React.createElement(ChatBubble, null));
}