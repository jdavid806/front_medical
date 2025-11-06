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
      try {
        const userConfig = await googleCalendarService.getConfig(config.user_id.toString());
        if (!userConfig.data || !userConfig.data.data) {
          console.log('Usuario no tiene calendario configurado, omitiendo creación de evento');
          return {
            success: true,
            skipped: true,
            message: 'Calendario no configurado'
          };
        }
      } catch (error) {
        console.log('No se pudo verificar configuración de calendario, omitiendo evento');
        return {
          success: true,
          skipped: true,
          message: 'No se pudo verificar calendario'
        };
      }
      const response = await googleCalendarService.createConfig(payload);
      console.log("Evento de Google Calendar creado:", response);
      toast?.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Evento agregado al calendario',
        life: 3000
      });
      return {
        ...response,
        success: true,
        skipped: false
      };
    } catch (error) {
      console.error('Error saving Google Calendar config:', error);
      console.warn('No se pudo crear el evento en Google Calendar, pero la cita se creará normalmente');
      return {
        success: true,
        skipped: true,
        message: 'Cita creada sin evento en calendario'
      };
    } finally {
      setLoading(false);
    }
  };
  return {
    createGoogleCalendarConfig,
    loading
  };
};