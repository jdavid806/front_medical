import React from "react";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useFetchAppointments } from "./hooks/useFetchAppointments.js";
import { Panel } from "primereact/panel";
import { ScrollPanel } from "primereact/scrollpanel";
import { Paginator } from "primereact/paginator";
const appointmentStatesByKey = {
  Pendiente: "Pendiente",
  "En espera de consulta": "En espera de consulta",
  "En espera de examen": "En espera de examen",
  "En consulta": "En consulta",
  "Consulta Finalizada": "Consulta Finalizada",
  Cancelada: "Cancelada",
  Reprogramada: "Reprogramada"
};

// Definir colores directamente en el componente
const stateColors = {
  Pendiente: {
    backgroundColor: "rgb(255, 239, 202)",
    color: "#000"
  },
  // Amarillo
  "En espera de consulta": {
    backgroundColor: "#17A2B8",
    color: "#fff"
  },
  // Azul claro
  "En espera de examen": {
    backgroundColor: "#6F42C1",
    color: "#fff"
  },
  // Morado
  "En consulta": {
    backgroundColor: "#007BFF",
    color: "#fff"
  },
  // Azul
  "Consulta Finalizada": {
    backgroundColor: "#28A745",
    color: "#fff"
  },
  // Verde
  Cancelada: {
    backgroundColor: "#DC3545",
    color: "#fff"
  },
  // Rojo
  Reprogramada: {
    backgroundColor: "#6610F2",
    color: "#fff"
  } // Violeta
};
export const LobbyAppointments = () => {
  const getCustomFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    return {
      sort: "-appointment_date,appointment_time",
      appointmentDate: today
    };
  };
  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAppointments,
    perPage
  } = useFetchAppointments(getCustomFilters);
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const stateKey = appointment.stateDescription;
    const stateLabel = appointmentStatesByKey[stateKey] || "Sin Cita";
    if (stateLabel !== "Sin Cita") {
      if (!acc[stateLabel]) acc[stateLabel] = [];
      acc[stateLabel].push(appointment);
    }
    return acc;
  }, {});
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      color: "#007BFF",
      marginBottom: "1rem"
    }
  }, "Lista de Citas"), Object.entries(groupedAppointments).map(([stateLabel, stateAppointments]) => /*#__PURE__*/React.createElement(Panel, {
    key: stateLabel,
    header: stateLabel,
    toggleable: true,
    collapsed: true,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(ScrollPanel, {
    style: {
      maxHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: "1rem",
      justifyContent: "center",
      // Centrar tarjetas en pantallas grandes
      alignItems: "stretch" // Mantener misma altura en tarjetas
    }
  }, stateAppointments?.map(appointment => /*#__PURE__*/React.createElement(Card, {
    key: appointment.id,
    title: /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("a", {
      href: `verPaciente?id=${appointment.patientId}`
    }, appointment.patientName)),
    style: {
      flex: "1 1 300px",
      // Las tarjetas ocupan el mismo ancho mínimo de 300px
      maxWidth: "400px",
      // Evita que sean demasiado grandes
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Fecha:"), " ", appointment.date), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Hora:"), " ", appointment.time), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Doctor:"), " ", appointment.doctorName)), /*#__PURE__*/React.createElement(Tag, {
    value: stateLabel,
    style: {
      ...stateColors[stateLabel],
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "5px",
      display: "inline-block",
      fontSize: "14px",
      alignSelf: "flex-start" // Asegura que la etiqueta no estire la tarjeta
    }
  }))))))), /*#__PURE__*/React.createElement(Paginator, {
    first: first,
    rows: perPage,
    rowsPerPageOptions: [10, 20, 30],
    totalRecords: totalRecords,
    onPageChange: handlePageChange
  }));
};