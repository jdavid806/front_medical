"use client"

import React, { useState, useRef, useEffect } from "react"
import { InputText } from "primereact/inputtext"
import { Button } from "primereact/button"


interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: Date
}


interface Contact {
  id: string
  name: string
  status: "online" | "offline" | "away"
}

export function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<"contacts" | "chat">("contacts")
  const [contacts] = useState<Contact[]>([
    { id: "1", name: "Ana García", status: "online" },
    { id: "2", name: "Carlos López", status: "away" },
  ])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0])
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", content: "Hola, ¿cómo estás?", sender: "contact", timestamp: new Date(Date.now() - 600000) },
    { id: "2", content: "Todo bien, gracias!", sender: "user", timestamp: new Date(Date.now() - 300000) },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages])

  const sendMessage = () => {
    if (!inputValue.trim() || !selectedContact) return
    const newMsg: Message = { id: Date.now().toString(), content: inputValue, sender: "user", timestamp: new Date() }
    setMessages(prev => [...prev, newMsg])
    setInputValue("")

    // Simular respuesta
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), content: "Gracias por tu mensaje!", sender: "contact", timestamp: new Date() }])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter") { e.preventDefault(); sendMessage() } }

  const statusColor = (status: Contact["status"]) => {
    switch(status){
      case "online": return "green"
      case "away": return "orange"
      default: return "gray"
    }
  }

  const openChat = (contact: Contact) => { setSelectedContact(contact); setView("chat") }
  const backToContacts = () => setView("contacts")

  return (
    <>
      {/* Botón flotante */}
      <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>💬</button>

      {/* Ventana de chat */}
      <div className={`chat-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chat-header">
          <div>
            {view === "chat" && <button onClick={backToContacts} className="back-button">←</button>}
            <span>{view === "contacts" ? "Chats" : selectedContact?.name}</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="close-button">✖</button>
        </div>

        {/* Contenido */}
        {view === "contacts" ? (
          <div className="chat-contacts">
            {contacts.map(c => (
              <div key={c.id} className="contact-item" onClick={() => openChat(c)}>
                <span>{c.name}</span>
                <span className="status-dot" style={{ backgroundColor: statusColor(c.status) }}></span>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="chat-messages">
              {messages.map(m => (
                <div key={m.id} className={`message-row ${m.sender}`}>
                  <div className="message-bubble">{m.content}</div>
                  <div className="message-time">{m.timestamp.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}</div>
                </div>
              ))}
              {isTyping && <div className="typing">Escribiendo...</div>}
              <div ref={messagesEndRef}></div>
            </div>

            <div className="chat-input-area">
              <InputText value={inputValue} onChange={e=>setInputValue(e.target.value)} onKeyPress={handleKeyPress} placeholder="Escribe un mensaje..." className="chat-input"/>
              <Button onClick={sendMessage}>Enviar</Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
