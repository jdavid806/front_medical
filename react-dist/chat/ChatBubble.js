"use client";

import React, { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("contacts");
  const [contacts] = useState([{
    id: "1",
    name: "Ana García",
    status: "online"
  }, {
    id: "2",
    name: "Carlos López",
    status: "away"
  }]);
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([{
    id: "1",
    content: "Hola, ¿cómo estás?",
    sender: "contact",
    timestamp: new Date(Date.now() - 600000)
  }, {
    id: "2",
    content: "Todo bien, gracias!",
    sender: "user",
    timestamp: new Date(Date.now() - 300000)
  }]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  const sendMessage = () => {
    if (!inputValue.trim() || !selectedContact) return;
    const newMsg = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMsg]);
    setInputValue("");

    // Simular respuesta
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        content: "Gracias por tu mensaje!",
        sender: "contact",
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1500);
  };
  const handleKeyPress = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };
  const statusColor = status => {
    switch (status) {
      case "online":
        return "green";
      case "away":
        return "orange";
      default:
        return "gray";
    }
  };
  const openChat = contact => {
    setSelectedContact(contact);
    setView("chat");
  };
  const backToContacts = () => setView("contacts");
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "chat-button",
    onClick: () => setIsOpen(!isOpen)
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
    className: `chat-window ${isOpen ? "open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("div", null, view === "chat" && /*#__PURE__*/React.createElement("button", {
    onClick: backToContacts,
    className: "back-button"
  }, "\u2190"), /*#__PURE__*/React.createElement("span", null, view === "contacts" ? "Chats" : selectedContact?.name)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setIsOpen(false),
    className: "close-button"
  }, "\u2716")), view === "contacts" ? /*#__PURE__*/React.createElement("div", {
    className: "chat-contacts"
  }, contacts.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "contact-item",
    onClick: () => openChat(c)
  }, /*#__PURE__*/React.createElement("span", null, c.name), /*#__PURE__*/React.createElement("span", {
    className: "status-dot",
    style: {
      backgroundColor: statusColor(c.status)
    }
  })))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "chat-messages"
  }, messages.map(m => /*#__PURE__*/React.createElement("div", {
    key: m.id,
    className: `message-row ${m.sender}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble"
  }, m.content), /*#__PURE__*/React.createElement("div", {
    className: "message-time"
  }, m.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })))), isTyping && /*#__PURE__*/React.createElement("div", {
    className: "typing"
  }, "Escribiendo..."), /*#__PURE__*/React.createElement("div", {
    ref: messagesEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-input-area"
  }, /*#__PURE__*/React.createElement(InputText, {
    value: inputValue,
    onChange: e => setInputValue(e.target.value),
    onKeyPress: handleKeyPress,
    placeholder: "Escribe un mensaje...",
    className: "chat-input"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: sendMessage
  }, "Enviar")))));
}