"use client"

import { ChatApp } from "./ChatApp";
import { ChatBubble } from "./ChatBubble";

export default function ChatMain() {
  const token = sessionStorage.getItem("auth_token") || "";

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Bienvenido</h1>
          <p className="text-lg text-muted-foreground">
            Haz clic en el botón de chat en la esquina inferior derecha para comenzar a conversar
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Contenido de ejemplo</h2>
          <p className="text-muted-foreground mb-4">
            Esta es una página de ejemplo. El módulo de chat flotante está disponible en todo momento desde el botón en
            la esquina inferior derecha.
          </p>
          <p className="text-muted-foreground">
            Puedes navegar por tu sitio web mientras mantienes conversaciones activas con tus contactos.
          </p>
        </div>

        {/* Chat de pantalla completa */}
        <div className="mb-8 border border-border rounded-lg p-4 shadow-sm">
          <ChatApp token={token} />
        </div>
      </div>

      {/* Chat flotante */}
      <ChatBubble />
    </main>
  )
}
