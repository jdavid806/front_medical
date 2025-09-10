import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useSocket } from "../hooks/useSocket.js";
const Chat = ({
  onNewMessage
}) => {
  const [mensajes, setMensajes] = useState([{
    id: 1,
    sender: "Usuario Remoto",
    message: "Hola, ¿cómo estás?",
    time: "12:05 PM",
    isOwn: false
  }, {
    id: 2,
    sender: "Sistema de Seguridad",
    message: "Reunión protegida",
    time: "12:06 PM",
    isOwn: false
  }, {
    id: 3,
    sender: "Seleccionar",
    message: "Por favor selecciona una opción",
    time: "12:06 PM",
    isOwn: false
  }]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const messagesEndRef = useRef(null);
  const socket = useSocket();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);
  const enviarMensaje = () => {
    if (nuevoMensaje.trim() === '') return;
    const mensaje = {
      id: Date.now(),
      sender: "Tú",
      message: nuevoMensaje,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }),
      isOwn: true
    };
    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje('');
    if (socket) {
      socket.emit('send-message', nuevoMensaje);
    }
  };
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      enviarMensaje();
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "chat-container h-full flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header flex justify-content-between align-items-center p-3 border-bottom-1 surface-border"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "m-0"
  }, "Mensajes"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-times",
    className: "p-button-text"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-messages flex-1 overflow-y-auto p-3"
  }, mensajes.map(mensaje => /*#__PURE__*/React.createElement("div", {
    key: mensaje.id,
    className: `message ${mensaje.isOwn ? 'own-message' : 'other-message'} mb-3`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-sender font-bold"
  }, mensaje.sender), /*#__PURE__*/React.createElement("div", {
    className: "message-content p-2 border-round",
    style: {
      backgroundColor: mensaje.isOwn ? 'var(--primary-color)' : 'var(--surface-ground)',
      color: mensaje.isOwn ? 'white' : 'inherit'
    }
  }, mensaje.message), /*#__PURE__*/React.createElement("div", {
    className: "message-time text-sm text-color-secondary"
  }, mensaje.time))), /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-input p-3 border-top-1 surface-border"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-inputgroup"
  }, /*#__PURE__*/React.createElement(InputText, {
    value: nuevoMensaje,
    onChange: e => setNuevoMensaje(e.target.value),
    onKeyPress: handleKeyPress,
    placeholder: "Escribe un mensaje..."
  }), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-send",
    onClick: enviarMensaje
  }))));
};
export default Chat;