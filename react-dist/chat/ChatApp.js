// ChatApp.tsx
import React, { useState, useEffect, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export const ChatApp = ({
  token
}) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [typingMessage, setTypingMessage] = useState("");
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);
  const [username, setUsername] = useState("");

  // ===============================
  // Decodificar JWT
  // ===============================
  useEffect(() => {
    if (!token) return;
    function parseJwt(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(atob(base64).split("").map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)).join(""));
      return JSON.parse(jsonPayload);
    }
    try {
      const decoded = parseJwt(token);
      setUsername(decoded.username);
    } catch (err) {
      console.error("Error decodificando token:", err);
    }
  }, [token]);

  // ===============================
  // Conexión a Socket.IO
  // ===============================
  useEffect(() => {
    if (!username) return;
    const socket = io("https://dev.monaros.co/chat-internal", {
      query: {
        token
      },
      transports: ["websocket"]
    });
    socketRef.current = socket;

    // Historial
    socket.on("chat:history", msgs => {
      const mapped = msgs.map(msg => ({
        from: msg.userId,
        to: msg.toUserId || "all",
        text: msg.content || msg.text || "",
        timestamp: new Date(msg.createdAt || Date.now()).getTime(),
        time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      }));
      setMessages(mapped.sort((a, b) => a.timestamp - b.timestamp));
    });

    // Mensajes entrantes
    const handleMessage = data => {
      const now = Date.now();
      const msg = {
        from: data.from,
        to: data.to || "all",
        text: data.message,
        time: new Date(now).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        timestamp: now
      };
      setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
    };
    socket.on("message:receive", handleMessage);

    // Lista de usuarios
    socket.on("user:list", onlineUsers => {
      setUsers(onlineUsers.filter(u => u !== username)); // opcional: excluir tu propio usuario
    });

    // Indicador de escribiendo
    socket.on("user:typing", ({
      username: typingUser
    }) => {
      setTypingMessage(`${typingUser} está escribiendo...`);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setTypingMessage(""), 2500);
    });
    socket.on("user:stopTyping", ({
      from
    }) => {
      if (typingMessage.includes(from)) setTypingMessage("");
    });
    return () => {
      socket.off("message:receive", handleMessage);
      socket.disconnect();
    };
  }, [username, token]);

  // ===============================
  // Scroll automático
  // ===============================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  // ===============================
  // Enviar mensaje
  // ===============================
  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const now = Date.now();
    const msg = {
      from: username,
      to: selectedUser || "all",
      text: inputMessage.trim(),
      time: new Date(now).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      timestamp: now
    };
    socketRef.current?.emit("message:send", {
      message: msg.text,
      toUser: selectedUser || null
    });
    setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
    setInputMessage("");
    socketRef.current?.emit("user:stopTyping", {
      toUser: selectedUser || null
    });
    isTypingRef.current = false;
  };

  // ===============================
  // Detectar escribiendo
  // ===============================
  const handleInputChange = value => {
    setInputMessage(value);
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit("user:typing", {
        username,
        toUser: selectedUser || null
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      socketRef.current?.emit("user:stopTyping", {
        toUser: selectedUser || null
      });
    }, 1500);
  };

  // ===============================
  // Filtrar mensajes según chat seleccionado
  // ===============================
  const filteredMessages = messages.filter(msg => {
    if (!selectedUser || selectedUser === "all") return msg.to === "all" || msg.from === username || msg.to === username;
    return msg.from === username && msg.to === selectedUser || msg.from === selectedUser && msg.to === username;
  }).sort((a, b) => a.timestamp - b.timestamp);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "users-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "Usuarios Conectados"), /*#__PURE__*/React.createElement("div", {
    className: "users-list"
  }, users.length === 0 ? /*#__PURE__*/React.createElement("p", null, "No hay usuarios conectados") : users.map((u, idx) => {
    const displayName = u;
    const avatarLetter = displayName.charAt(0).toUpperCase();
    return /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: `user-item ${selectedUser === u ? "active" : ""}`,
      onClick: () => setSelectedUser(u)
    }, /*#__PURE__*/React.createElement("div", {
      className: "chat-header-avatar"
    }, avatarLetter), /*#__PURE__*/React.createElement("div", {
      className: "user-info"
    }, /*#__PURE__*/React.createElement("div", {
      className: "user-name"
    }, displayName), /*#__PURE__*/React.createElement("div", {
      className: "user-status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-indicator status-online"
    }), "En l\xEDnea")));
  }))), /*#__PURE__*/React.createElement("div", {
    className: "chat-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header-avatar"
  }, username.charAt(0)), /*#__PURE__*/React.createElement("div", {
    className: "chat-header-info"
  }, /*#__PURE__*/React.createElement("h3", null, username), /*#__PURE__*/React.createElement("p", null, "Conectado"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-messages"
  }, filteredMessages.map((msg, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: `message ${msg.from === username ? "sent" : "received"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "message-bubble"
  }, msg.text), /*#__PURE__*/React.createElement("div", {
    className: "message-time"
  }, msg.time))), /*#__PURE__*/React.createElement("div", {
    ref: chatEndRef
  })), /*#__PURE__*/React.createElement("div", {
    className: "typing-indicator"
  }, typingMessage), /*#__PURE__*/React.createElement("div", {
    className: "chat-input"
  }, /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Escribe un mensaje...",
    value: inputMessage,
    onChange: e => handleInputChange(e.target.value),
    onKeyPress: e => {
      if (e.key === "Enter") sendMessage();
    }
  }), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-send",
    onClick: sendMessage
  })))));
};