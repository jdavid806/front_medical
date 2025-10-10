import { useState } from 'react';
import { Toast } from 'primereact/toast';

export interface GoogleCalendarEventPayload {
  user_id: number;
  nombre: string;
  fecha: string;
  hora: string;
  hora_final: string;
  motivo: string;
}

export interface GoogleCalendarConfigPayload {
  user_email: string;
  calendar_id: string;
  timezone: string;
  user_id: string;
}

export const useGoogleCalendarPayload = () => {
  const [loading, setLoading] = useState(false);

  /**
   * Organiza el payload para crear un evento en Google Calendar
   */
  const organizeEventPayload = (
    patientId: number,
    patientName: string,
    appointmentDate: Date | null,
    appointmentTime: string,
    durationMinutes: number = 30,
    reason: string = 'Consulta médica'
  ): GoogleCalendarEventPayload | null => {
    if (!appointmentDate || !appointmentTime) {
      console.error('Fecha y hora son requeridos para el payload');
      return null;
    }

    try {
      const formattedDate = appointmentDate.toISOString().split('T')[0];
      const formattedStartTime = appointmentTime.includes(':') 
        ? (appointmentTime.length === 5 ? appointmentTime + ':00' : appointmentTime)
        : appointmentTime + ':00:00';
      
      const formattedEndTime = calculateEndTime(appointmentTime, durationMinutes);

      return {
        user_id: patientId,
        nombre: patientName.trim(),
        fecha: formattedDate,
        hora: formattedStartTime,
        hora_final: formattedEndTime,
        motivo: reason.trim()
      };
    } catch (error) {
      console.error('Error organizando payload del evento:', error);
      return null;
    }
  };

  /**
   * Organiza el payload para configurar Google Calendar
   */
  const organizeConfigPayload = (
    config: {
      calendar_id: string;
      timezone: string;
    },
    userEmail: string,
    userId: string
  ): GoogleCalendarConfigPayload => {
    return {
      user_email: userEmail.trim(),
      calendar_id: config.calendar_id.trim(),
      timezone: config.timezone,
      user_id: userId.toString()
    };
  };

  /**
   * Organiza múltiples eventos para Google Calendar
   */
  const organizeMultipleEventsPayload = (
    appointments: Array<{
      patientId: number;
      patientName: string;
      appointmentDate: Date | null;
      appointmentTime: string;
      durationMinutes?: number;
      reason?: string;
    }>
  ): GoogleCalendarEventPayload[] => {
    return appointments
      .map(appointment => 
        organizeEventPayload(
          appointment.patientId,
          appointment.patientName,
          appointment.appointmentDate,
          appointment.appointmentTime,
          appointment.durationMinutes,
          appointment.reason
        )
      )
      .filter((payload): payload is GoogleCalendarEventPayload => payload !== null);
  };

  /**
   * Calcula la hora final basada en la hora inicial y duración
   */
  const calculateEndTime = (startTime: string, durationMinutes: number = 30): string => {
    if (!startTime) return '00:00:00';
    
    try {
      // Limpiar y formatear la hora
      const cleanTime = startTime.split(':').slice(0, 2).join(':');
      const [hours, minutes] = cleanTime.split(':').map(Number);
      
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + (durationMinutes * 60000));
      
      const endHours = endDate.getHours().toString().padStart(2, '0');
      const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
      
      return `${endHours}:${endMinutes}:00`;
    } catch (error) {
      console.error('Error calculando hora final:', error);
      return '00:00:00';
    }
  };

  /**
   * Valida si un payload de evento es válido
   */
  const isValidEventPayload = (payload: GoogleCalendarEventPayload): boolean => {
    return (
      !!payload.user_id &&
      !!payload.nombre &&
      !!payload.fecha &&
      !!payload.hora &&
      !!payload.hora_final &&
      !!payload.motivo
    );
  };

  /**
   * Valida si un payload de configuración es válido
   */
  const isValidConfigPayload = (payload: GoogleCalendarConfigPayload): boolean => {
    return (
      !!payload.user_email &&
      !!payload.calendar_id &&
      !!payload.timezone &&
      !!payload.user_id
    );
  };

  return {
    organizeEventPayload,
    organizeConfigPayload,
    organizeMultipleEventsPayload,
    calculateEndTime,
    isValidEventPayload,
    isValidConfigPayload,
    loading
  };
};