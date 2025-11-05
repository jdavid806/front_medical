// ChatApp.tsx
import React, { useState, useEffect, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { ChatBubble } from "./ChatBubble";
declare const io: any;

interface Message {
  from: string;
  to: string;
  text: string;
  time: string;
  timestamp: number; // nuevo campo para ordenar correctamente
}

interface ChatAppProps {
  token: string;
}

export const ChatApp: React.FC<ChatAppProps> = ({ token }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [typingMessage, setTypingMessage] = useState("");

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<any>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const [username, setUsername] = useState<string>("");

  // ===============================
  // Decodificar JWT
  // ===============================
  useEffect(() => {
    if (!token) return;

    function parseJwt(token: string) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
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
      query: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    // Historial
    socket.on("chat:history", (msgs: any[]) => {
      const mapped = msgs.map(msg => ({
        from: msg.userId,
        to: msg.toUserId || "all",
        text: msg.content || msg.text || "",
        timestamp: new Date(msg.createdAt || Date.now()).getTime(),
        time: new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }));
      setMessages(mapped.sort((a, b) => a.timestamp - b.timestamp));
    });

    // Mensajes entrantes
    const handleMessage = (data: any) => {
      const now = Date.now();
      const msg: Message = {
        from: data.from,
        to: data.to || "all",
        text: data.message,
        time: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        timestamp: now,
      };
      setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
    };
    socket.on("message:receive", handleMessage);

    // Lista de usuarios
    socket.on("user:list", (onlineUsers: string[]) => {
      setUsers(onlineUsers.filter(u => u !== username)); // opcional: excluir tu propio usuario
    });

    // Indicador de escribiendo
    socket.on("user:typing", ({ username: typingUser }: any) => {
      setTypingMessage(`${typingUser} está escribiendo...`);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = window.setTimeout(() => setTypingMessage(""), 2500);
    });

    socket.on("user:stopTyping", ({ from }: any) => {
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
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ===============================
  // Enviar mensaje
  // ===============================
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const now = Date.now();
    const msg: Message = {
      from: username,
      to: selectedUser || "all",
      text: inputMessage.trim(),
      time: new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: now,
    };

    socketRef.current?.emit("message:send", { message: msg.text, toUser: selectedUser || null });
    setMessages(prev => [...prev, msg].sort((a, b) => a.timestamp - b.timestamp));
    setInputMessage("");
    socketRef.current?.emit("user:stopTyping", { toUser: selectedUser || null });
    isTypingRef.current = false;
  };

  // ===============================
  // Detectar escribiendo
  // ===============================
  const handleInputChange = (value: string) => {
    setInputMessage(value);

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      socketRef.current?.emit("user:typing", { username, toUser: selectedUser || null });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = window.setTimeout(() => {
      isTypingRef.current = false;
      socketRef.current?.emit("user:stopTyping", { toUser: selectedUser || null });
    }, 1500);
  };

  // ===============================
  // Filtrar mensajes según chat seleccionado
  // ===============================
  const filteredMessages = messages
    .filter(msg => {
      if (!selectedUser || selectedUser === "all") return msg.to === "all" || msg.from === username || msg.to === username;
      return (
        (msg.from === username && msg.to === selectedUser) ||
        (msg.from === selectedUser && msg.to === username)
      );
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <PrimeReactProvider value={{ appendTo: "self", zIndex: { overlay: 100000 } }}>
      <div className="chat-container">
        {/* Usuarios */}
        <div className="users-panel">
          <h2>Usuarios Conectados</h2>
          <div className="users-list">
            {users.length === 0 ? (
              <p>No hay usuarios conectados</p>
            ) : (
              users.map((u, idx) => {
                const displayName = u;
                const avatarLetter = displayName.charAt(0).toUpperCase();
                return (
                  <div
                    key={idx}
                    className={`user-item ${selectedUser === u ? "active" : ""}`}
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="chat-header-avatar">{avatarLetter}</div>
                    <div className="user-info">
                      <div className="user-name">{displayName}</div>
                      <div className="user-status">
                        <span className="status-indicator status-online"></span>
                        En línea
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-avatar">{username.charAt(0)}</div>
            <div className="chat-header-info">
              <h3>{username}</h3>
              <p>Conectado</p>
            </div>
          </div>

          <div className="chat-messages">
            {filteredMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.from === username ? "sent" : "received"}`}>
                <div className="message-bubble">{msg.text}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          <div className="typing-indicator">{typingMessage}</div>

          <div className="chat-input">
            <InputText
              placeholder="Escribe un mensaje..."
              value={inputMessage}
              onChange={e => handleInputChange(e.target.value)}
              onKeyPress={e => { if (e.key === "Enter") sendMessage(); }}
            />
            <Button icon="pi pi-send" onClick={sendMessage} />
          </div>
        </div>
      </div>
      <ChatBubble />
    </PrimeReactProvider>
  );
};
