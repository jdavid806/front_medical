// massMessaging.js (o .ts si usas TypeScript)
import { massMessagingService } from "../../services/api/index.js";


export const createMassMessaging = (communication) => {
  // Estado "reactivo" manual
  let state = {
    responseMsg: null,
    loading: false,
    error: null,
  };

  // Listeners para reaccionar a cambios (opcional, si necesitas observabilidad)
  const listeners = new Set();

  const notifyListeners = () => {
    listeners.forEach((listener) => listener(state));
  };

  const sendMessage = async (dataMessage) => {
    // Actualización del estado
    state.loading = true;
    state.error = null;
    notifyListeners();

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

      state.responseMsg = response.data.recipients.valid.length
        ? "Enviado con éxito"
        : "Número no encontrado en el sistema";
    } catch (err) {
      state.error = err;
      state.responseMsg = "Error al enviar el mensaje";
    } finally {
      state.loading = false;
      notifyListeners();
    }
  };

  // Opcional: Método para suscribirse a cambios
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return {
    sendMessage,
    subscribe,
    getState: () => ({ ...state }), // Copia del estado actual
  };
};