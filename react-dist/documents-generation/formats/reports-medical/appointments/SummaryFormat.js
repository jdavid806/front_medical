import React from "react";
export const SummaryFormat = ({
  entries,
  state,
  dateRange
}) => {
  if (!entries || entries.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles para el estado ", state));
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

  // Calcular total de citas para este estado
  const totalAppointments = entries.reduce((sum, entry) => sum + entry.count, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "appointments-specialty-doctor-visualization"
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
  }, "Reporte de Citas por Especialidad y M\xE9dico"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d",
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Estado:"), " ", state), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatDate(dateRange[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatDate(dateRange[1])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total citas:"), " ", totalAppointments))), /*#__PURE__*/React.createElement("div", {
    className: "state-container",
    style: {
      marginBottom: "3rem",
      border: "1px solid #ddd",
      padding: "1.5rem",
      borderRadius: "8px",
      backgroundColor: "#fff"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: "center",
      marginBottom: "1.5rem",
      backgroundColor: "#424a51",
      color: "white",
      padding: "15px",
      borderRadius: "4px",
      fontSize: "18px"
    }
  }, "Estado: ", state, " - Total: ", totalAppointments, " citas"), /*#__PURE__*/React.createElement("table", {
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
  }, "Especialidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "M\xE9dico"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "12px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Cantidad"))), /*#__PURE__*/React.createElement("tbody", null, entries.map((entry, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, entry.specialty), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, entry.doctorName), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, entry.count)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      backgroundColor: "#f8f9fa",
      fontWeight: "bold"
    }
  }, /*#__PURE__*/React.createElement("td", {
    colSpan: 2,
    style: {
      padding: "12px 8px",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, "Total ", state, ":"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "12px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, totalAppointments)))), entries.map((entry, entryIndex) => /*#__PURE__*/React.createElement("div", {
    key: entryIndex,
    className: "specialty-doctor-container",
    style: {
      marginBottom: "2rem",
      padding: "1rem",
      border: "1px solid #e9ecef",
      borderRadius: "6px",
      backgroundColor: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      textAlign: "center",
      marginBottom: "1rem",
      color: "#2c3e50",
      fontSize: "16px",
      padding: "10px",
      backgroundColor: "#e9ecef",
      borderRadius: "4px"
    }
  }, entry.specialty, " - Dr. ", entry.doctorName, " (", entry.count, " citas)"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "11px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Documento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Ciudad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Producto"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "rgb(66, 74, 81)",
      color: "white",
      fontWeight: "normal",
      border: "1px solid #dee2e6"
    }
  }, "Fecha y Hora"))), /*#__PURE__*/React.createElement("tbody", null, entry.appointments.map(appointment => /*#__PURE__*/React.createElement("tr", {
    key: appointment.id
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 6px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, `${appointment.patient.first_name} ${appointment.patient.last_name}`), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 6px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.patient.document_number || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 6px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.patient.city_id || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 6px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.product_id || "N/A"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "8px 6px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, dateTemplate(appointment))))))))));
};