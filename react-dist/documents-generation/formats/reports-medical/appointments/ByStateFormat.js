import React from "react";
export const ByStateFormat = ({
  appointments,
  state,
  dateRange
}) => {
  if (!appointments || appointments.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement("span", null, "No hay citas en el estado ", state));
  }
  const formatDate = date => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const dateTemplate = rowData => {
    return new Date(rowData.created_at).toLocaleDateString("es-DO") + ", " + (rowData.appointment_time || "");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "appointments-visualization"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      marginBottom: "2rem",
      padding: "1.5rem",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      borderRadius: "8px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "10px",
      left: "15px",
      fontSize: "12px",
      color: "#495057"
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Generado el:"), " ", formatDate(new Date())), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "1rem"
    }
  }, "Reporte de Citas - ", state), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatDate(dateRange[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatDate(dateRange[1])))), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
      marginBottom: "2rem"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Documento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Ciudad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Especialista"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Especialidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Producto"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Fecha y Hora"))), /*#__PURE__*/React.createElement("tbody", null, appointments.map(appointment => /*#__PURE__*/React.createElement("tr", {
    key: appointment.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, `${appointment.patient.first_name} ${appointment.patient.last_name}`), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.patient.document_number || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.patient.city_id || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.assigned_user_availability?.user ? `${appointment.assigned_user_availability.user.first_name || ""} ${appointment.assigned_user_availability.user.last_name || ""}` : "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.assigned_user_availability?.user?.specialty?.name || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.product.name || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, dateTemplate(appointment)))))));
};