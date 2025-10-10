// components/GoogleCalendarModal.tsx
import React, { useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useGoogleCalendarConfig } from '../hooks/useGoogleCalendarConfig';

interface GoogleCalendarModalProps {
  show: boolean;
  userId: string;
  userEmail: string;
  onHide: () => void;
  onSuccess?: () => void;
  toast: Toast | null;
}

const timezones = [
  { value: 'America/New_York', label: 'EST - Este Norteamérica' },
  { value: 'America/Chicago', label: 'CST - Centro Norteamérica' },
  { value: 'America/Denver', label: 'MST - Montaña Norteamérica' },
  { value: 'America/Los_Angeles', label: 'PST - Pacífico Norteamérica' },
  { value: 'America/Mexico_City', label: 'Centro - México & Centroamérica' },
  { value: 'America/Panama', label: 'EST - Panamá & Caribe' },
  { value: 'America/Bogota', label: 'Colombia - Bogotá' },
  { value: 'America/Lima', label: 'Perú - Lima' },
  { value: 'America/Quito', label: 'Ecuador - Quito' },
  { value: 'America/Caracas', label: 'Venezuela - Caracas' },
  { value: 'America/La_Paz', label: 'Bolivia - La Paz' },
  { value: 'America/Sao_Paulo', label: 'Brasil - São Paulo' },
  { value: 'America/Argentina/Buenos_Aires', label: 'Argentina - Buenos Aires' },
  { value: 'America/Santiago', label: 'Chile - Santiago' },
  { value: 'UTC', label: 'UTC - Tiempo Universal' }
];

export const GoogleCalendarModal: React.FC<GoogleCalendarModalProps> = ({
  show,
  userId,
  userEmail,
  onHide,
  onSuccess,
  toast
}) => {
  const [config, setConfig] = useState({
    syncEnabled: false,
    calendarId: '',
    timezone: 'America/Bogota'
  });
  const [existingConfig, setExistingConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);

  const { saveGoogleCalendarConfig, getGoogleCalendarConfig, loading } = useGoogleCalendarConfig(toast);

  
  useEffect(() => {
    if (show) {
      loadExistingConfig();
    }
  }, [show, userId]);

  const loadExistingConfig = async () => {
    setLoadingConfig(true);
    try {
      const existing = await getGoogleCalendarConfig(userId);
      setExistingConfig(existing);
      
      if (existing) {

        setConfig({
          syncEnabled: !!existing.calendar_id,
          calendarId: existing.calendar_id || '',
          timezone: existing.timezone || 'America/Bogota'
        });
      } else {

        setConfig({
          syncEnabled: false,
          calendarId: '',
          timezone: 'America/Bogota'
        });
      }
    } catch (error) {
      console.error('Error cargando configuración existente:', error);

      setConfig({
        syncEnabled: false,
        calendarId: '',
        timezone: 'America/Bogota'
      });
    } finally {
      setLoadingConfig(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const configToSend = config.syncEnabled 
        ? {
            calendar_id: config.calendarId,
            timezone: config.timezone
          }
        : {
            calendar_id: '',
            timezone: config.timezone
          };

      await saveGoogleCalendarConfig(configToSend, userEmail, userId);
      onSuccess?.();
      onHide();
    } catch (error) {
      console.error('Error in modal:', error);
    }
  };

  const handleSyncChange = (value: string) => {
    const syncEnabled = value === 'true';
    setConfig(prev => ({
      ...prev,
      syncEnabled,
      calendarId: syncEnabled ? prev.calendarId : ''
    }));
  };

  const handleResetConfig = () => {
    setConfig({
      syncEnabled: false,
      calendarId: '',
      timezone: 'America/Bogota'
    });
    setExistingConfig(null);
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {existingConfig ? 'Configuración de Google Calendar' : 'Configurar Google Calendar'}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">

              {existingConfig && (
                <div className="alert alert-info mb-3">
                  <h6 className="alert-heading">✅ Configuración existente encontrada</h6>
                </div>
              )}

              {loadingConfig ? (
                <div className="text-center py-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando configuración...</span>
                  </div>
                  <p className="mt-2">Cargando configuración existente...</p>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <label htmlFor="syncEnabled" className="form-label">
                      ¿Desea sincronizar su Google Calendar?
                    </label>
                    <select
                      id="syncEnabled"
                      className="form-select"
                      value={config.syncEnabled.toString()}
                      onChange={(e) => handleSyncChange(e.target.value)}
                      disabled={loading}
                    >
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>

                    <div className="mb-3">
                      <label htmlFor="calendarId" className="form-label">
                        Calendar ID
                      </label>
                      <input
                        type="text"
                        id="calendarId"
                        className="form-control"
                        value={config.calendarId}
                        onChange={(e) => setConfig(prev => ({ ...prev, calendarId: e.target.value }))}
                        placeholder="Ingrese el ID de su calendario de Google"
                        disabled={loading || !config.syncEnabled}
                        required={config.syncEnabled}
                      />
                      <div className="form-text">
                        El Calendar ID es el identificador único de su calendario en Google Calendar.
                      </div>
                    </div>


                  <div className="mb-4">
                    <label htmlFor="timezone" className="form-label">
                      Zona Horaria
                    </label>
                    <select
                      id="timezone"
                      className="form-select"
                      value={config.timezone}
                      onChange={(e) => setConfig(prev => ({ ...prev, timezone: e.target.value }))}
                      disabled={loading || !config.syncEnabled}
                    >
                      {timezones.map(tz => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {config.syncEnabled && (
                    <div className="alert alert-info">
                      <h6 className="alert-heading">Instrucciones para compartir el calendario:</h6>
                      <ol className="mb-0">
                        <li>Acceda a su Google Calendar en la web</li>
                        <li>Encuentre el calendario que desea compartir en la lista de "Mis calendarios"</li>
                        <li>Haga clic en los tres puntos junto al calendario y seleccione "Configuración y compartir"</li>
                        <li>En la sección "Compartir con determinadas personas", haga clic en "Agregar personas"</li>
                        <li>Ingrese el siguiente email: <strong>calendar-sa@productopolis.iam.gserviceaccount.com</strong></li>
                        <li>Seleccione el permiso "Hacer cambios en los eventos"</li>
                        <li>Haga clic en "Enviar"</li>
                        <li>Copie el "Calendar ID" de la sección "Integrar calendario" y péguelo en el campo anterior</li>
                      </ol>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleResetConfig}
                disabled={loading || loadingConfig}
              >
                Limpiar
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onHide}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || loadingConfig || (config.syncEnabled && !config.calendarId.trim())}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Guardando...
                  </>
                ) : (
                  existingConfig ? 'Actualizar Configuración' : 'Guardar Configuración'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};