// components/GoogleCalendarModal.tsx
import React, { useState, useEffect } from 'react';
import { useGoogleCalendarConfig } from "../hooks/useGoogleCalendarConfig.js";
const timezones = [{
  value: 'America/New_York',
  label: 'EST - Este Norteamérica'
}, {
  value: 'America/Chicago',
  label: 'CST - Centro Norteamérica'
}, {
  value: 'America/Denver',
  label: 'MST - Montaña Norteamérica'
}, {
  value: 'America/Los_Angeles',
  label: 'PST - Pacífico Norteamérica'
}, {
  value: 'America/Mexico_City',
  label: 'Centro - México & Centroamérica'
}, {
  value: 'America/Panama',
  label: 'EST - Panamá & Caribe'
}, {
  value: 'America/Bogota',
  label: 'Colombia - Bogotá'
}, {
  value: 'America/Lima',
  label: 'Perú - Lima'
}, {
  value: 'America/Quito',
  label: 'Ecuador - Quito'
}, {
  value: 'America/Caracas',
  label: 'Venezuela - Caracas'
}, {
  value: 'America/La_Paz',
  label: 'Bolivia - La Paz'
}, {
  value: 'America/Sao_Paulo',
  label: 'Brasil - São Paulo'
}, {
  value: 'America/Argentina/Buenos_Aires',
  label: 'Argentina - Buenos Aires'
}, {
  value: 'America/Santiago',
  label: 'Chile - Santiago'
}, {
  value: 'UTC',
  label: 'UTC - Tiempo Universal'
}];
export const GoogleCalendarModal = ({
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
  const [existingConfig, setExistingConfig] = useState(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const {
    saveGoogleCalendarConfig,
    getGoogleCalendarConfig,
    loading
  } = useGoogleCalendarConfig(toast);
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
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const configToSend = config.syncEnabled ? {
        calendar_id: config.calendarId,
        timezone: config.timezone
      } : {
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
  const handleSyncChange = value => {
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
  return /*#__PURE__*/React.createElement("div", {
    className: "modal fade show",
    style: {
      display: 'block',
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    tabIndex: -1
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, existingConfig ? 'Configuración de Google Calendar' : 'Configurar Google Calendar'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: onHide,
    disabled: loading
  })), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, existingConfig && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info mb-3"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "alert-heading"
  }, "\u2705 Configuraci\xF3n existente encontrada")), loadingConfig ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner-border text-primary",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "visually-hidden"
  }, "Cargando configuraci\xF3n...")), /*#__PURE__*/React.createElement("p", {
    className: "mt-2"
  }, "Cargando configuraci\xF3n existente...")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "syncEnabled",
    className: "form-label"
  }, "\xBFDesea sincronizar su Google Calendar?"), /*#__PURE__*/React.createElement("select", {
    id: "syncEnabled",
    className: "form-select",
    value: config.syncEnabled.toString(),
    onChange: e => handleSyncChange(e.target.value),
    disabled: loading
  }, /*#__PURE__*/React.createElement("option", {
    value: "false"
  }, "No"), /*#__PURE__*/React.createElement("option", {
    value: "true"
  }, "S\xED"))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "calendarId",
    className: "form-label"
  }, "Calendar ID"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "calendarId",
    className: "form-control",
    value: config.calendarId,
    onChange: e => setConfig(prev => ({
      ...prev,
      calendarId: e.target.value
    })),
    placeholder: "Ingrese el ID de su calendario de Google",
    disabled: loading || !config.syncEnabled,
    required: config.syncEnabled
  }), /*#__PURE__*/React.createElement("div", {
    className: "form-text"
  }, "El Calendar ID es el identificador \xFAnico de su calendario en Google Calendar.")), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "timezone",
    className: "form-label"
  }, "Zona Horaria"), /*#__PURE__*/React.createElement("select", {
    id: "timezone",
    className: "form-select",
    value: config.timezone,
    onChange: e => setConfig(prev => ({
      ...prev,
      timezone: e.target.value
    })),
    disabled: loading || !config.syncEnabled
  }, timezones.map(tz => /*#__PURE__*/React.createElement("option", {
    key: tz.value,
    value: tz.value
  }, tz.label)))), config.syncEnabled && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "alert-heading"
  }, "Instrucciones para compartir el calendario:"), /*#__PURE__*/React.createElement("ol", {
    className: "mb-0"
  }, /*#__PURE__*/React.createElement("li", null, "Acceda a su Google Calendar en la web"), /*#__PURE__*/React.createElement("li", null, "Encuentre el calendario que desea compartir en la lista de \"Mis calendarios\""), /*#__PURE__*/React.createElement("li", null, "Haga clic en los tres puntos junto al calendario y seleccione \"Configuraci\xF3n y compartir\""), /*#__PURE__*/React.createElement("li", null, "En la secci\xF3n \"Compartir con determinadas personas\", haga clic en \"Agregar personas\""), /*#__PURE__*/React.createElement("li", null, "Ingrese el siguiente email: ", /*#__PURE__*/React.createElement("strong", null, "calendar-sa@productopolis.iam.gserviceaccount.com")), /*#__PURE__*/React.createElement("li", null, "Seleccione el permiso \"Hacer cambios en los eventos\""), /*#__PURE__*/React.createElement("li", null, "Haga clic en \"Enviar\""), /*#__PURE__*/React.createElement("li", null, "Copie el \"Calendar ID\" de la secci\xF3n \"Integrar calendario\" y p\xE9guelo en el campo anterior"))))), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-outline-secondary",
    onClick: handleResetConfig,
    disabled: loading || loadingConfig
  }, "Limpiar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onHide,
    disabled: loading
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary",
    disabled: loading || loadingConfig || config.syncEnabled && !config.calendarId.trim()
  }, loading ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "spinner-border spinner-border-sm me-2",
    role: "status",
    "aria-hidden": "true"
  }), "Guardando...") : existingConfig ? 'Actualizar Configuración' : 'Guardar Configuración'))))));
};