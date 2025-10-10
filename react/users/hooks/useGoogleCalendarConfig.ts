import { useState } from 'react';
import { Toast } from 'primereact/toast';
import { googleCalendarService,  } from '../../../services/api/index.js';

export const useGoogleCalendarConfig = (toast: Toast | null) => {
  const [loading, setLoading] = useState(false);

  const getGoogleCalendarConfig = async (userId: string) => {
    setLoading(true);
    try {
      const response = await googleCalendarService.getConfig(userId);
      return response.data;
    } catch (error) {
      console.error('Error fetching Google Calendar config:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveGoogleCalendarConfig = async (config: {
    calendar_id: string;
    timezone: string;
  }, userEmail: string, userId: string) => {
    setLoading(true);
    try {
      const payload = {
        user_email: userEmail,
        calendar_id: config.calendar_id,
        timezone: config.timezone,
        user_id: userId
      };

      const response = await googleCalendarService.saveConfig(payload);
      
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
    saveGoogleCalendarConfig,
    getGoogleCalendarConfig,
    loading
  };
};