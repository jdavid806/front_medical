import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ChatProps, MensajeChat } from '../interfaces/ChatType';
import { useSocket } from '../hooks/useSocket';



const Chat: React.FC<ChatProps> = ({ onNewMessage }) => {
    const [mensajes, setMensajes] = useState<MensajeChat[]>([
        { id: 1, sender: "Usuario Remoto", message: "Hola, ¿cómo estás?", time: "12:05 PM", isOwn: false },
        { id: 2, sender: "Sistema de Seguridad", message: "Reunión protegida", time: "12:06 PM", isOwn: false },
        { id: 3, sender: "Seleccionar", message: "Por favor selecciona una opción", time: "12:06 PM", isOwn: false }
    ]);

    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const socket = useSocket();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const enviarMensaje = () => {
        if (nuevoMensaje.trim() === '') return;

        const mensaje: MensajeChat = {
            id: Date.now(),
            sender: "Tú",
            message: nuevoMensaje,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: true
        };

        setMensajes([...mensajes, mensaje]);
        setNuevoMensaje('');

        if (socket) {
            socket.emit('send-message', nuevoMensaje);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    };

    return (
        <div className="chat-container h-full flex flex-column">
            <div className="chat-header flex justify-content-between align-items-center p-3 border-bottom-1 surface-border">
                <h5 className="m-0">Mensajes</h5>
                <Button icon="pi pi-times" className="p-button-text" />
            </div>

            <div className="chat-messages flex-1 overflow-y-auto p-3">
                {mensajes.map((mensaje) => (
                    <div key={mensaje.id} className={`message ${mensaje.isOwn ? 'own-message' : 'other-message'} mb-3`}>
                        <div className="message-sender font-bold">{mensaje.sender}</div>
                        <div className="message-content p-2 border-round"
                            style={{
                                backgroundColor: mensaje.isOwn ? 'var(--primary-color)' : 'var(--surface-ground)',
                                color: mensaje.isOwn ? 'white' : 'inherit'
                            }}>
                            {mensaje.message}
                        </div>
                        <div className="message-time text-sm text-color-secondary">{mensaje.time}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-input p-3 border-top-1 surface-border">
                <div className="p-inputgroup">
                    <InputText
                        value={nuevoMensaje}
                        onChange={(e) => setNuevoMensaje(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                    />
                    <Button icon="pi pi-send" onClick={enviarMensaje} />
                </div>
            </div>
        </div>
    );
};

export default Chat;