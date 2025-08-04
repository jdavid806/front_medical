import { useState } from "react";
import { massMessagingService } from "../../services/api";
import { useCommunication } from "./useCommunication";

export const useMassMessaging = () => {
  const { communication } = useCommunication(); // Solo usamos lo necesario
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (dataMessage: any) => {
    // Usa un tipo adecuado en lugar de 'any'
    setLoading(true);
    setError(null);

    try {
      const headersSendMessage = {
        Accept: "application/json",
        "Evolution-API-Key": communication.api_key,
        "instance-name": communication.instance,
      };

      const response = await massMessagingService.sendMessage(
        dataMessage,
        headersSendMessage
      );

      if (response.data.recipients.valid.length) {
        setResponseMsg("Enviado con éxito");
      } else {
        setResponseMsg("Número no encontrado en el sistema");
      }
      document.querySelectorAll('input[id^="pdf-input-"]').forEach(el => el.remove());
    } catch (err) {
      setError(err as Error);
      setResponseMsg("Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage, // 🔥 ¡Ahora está disponible para otros componentes!
    responseMsg,
    loading,
    error,
  };
};
