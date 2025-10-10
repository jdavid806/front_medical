import { useState } from 'react';
import { googleCalendarService } from '../../../services/api/index.js';
export const useGoogleCalendarConfig = toast => {
  const [loading, setLoading] = useState(false);
  const createGoogleCalendarConfig = async config => {
    setLoading(true);
    try {
      const payload = {
        user_id: config.user_id,
        nombre: config.nombre.trim(),
        fecha: config.fecha,
        hora: config.hora,
        hora_final: config.hora_final,
        motivo: config.motivo.trim()
      };
      const response = await googleCalendarService.createConfig(payload);
      console.log("response cita", response);
      toast?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Configuración de Google Calendar guardada correctamente',
        life: 3000
      });
      return response;
    } catch (error) {
      console.error('Error saving Google Calendar config:', error);
      toast?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo guardar la configuración de Google Calendar',
        life: 3000
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    createGoogleCalendarConfig,
    loading
  };
};