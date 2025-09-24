import React from "react";
export const AverageBySpecialist = ({
  data,
  mainNode,
  dateRange
}) => {
  // Función para formatear fechas
  const formatDate = (date, includeYear = false) => {
    // Implementa tu lógica de formato de fecha aquí
    if (typeof date === "string") {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    if (includeYear) {
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return `${day}/${month}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "2rem",
      border: "1px solid #ddd",
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            .user-table-container {
              page-break-inside: avoid;
            }
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 25px;
            font-size: 12px;
          }
          th { 
            color: white; 
            padding: 10px; 
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: bold;
          }
          td { 
            padding: 10px 8px; 
            border: 1px solid #dee2e6;
          }
          
          .summary-table {
            width: 100%; 
            border-collapse: collapse; 
            font-size: 13px;
            margin-bottom: 20px;
          }
          
          .summary-table td {
            padding: 8px 0;
            border-bottom: none;
          }
          
          .currency {
            text-align: right;
          }
          
          .user-header {
            text-align: center; 
            margin-bottom: 1rem; 
            background-color: #424a51; 
            color: white; 
            padding: 10px;
            border-radius: 4px;
          }
        `), /*#__PURE__*/React.createElement("div", {
    className: "print-container"
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
  }, /*#__PURE__*/React.createElement("strong", null, "Generado el:"), " ", formatDate(new Date(), true)), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "1rem"
    }
  }, "Reporte Agendamiento - ", mainNode.full_name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "16px",
      color: "#575e64ff"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Promedio:"), `${mainNode.average_consultation_duration.hours}:${mainNode.average_consultation_duration.minutes}:${mainNode.average_consultation_duration.seconds} `)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha inicio:"), " ", formatDate(dateRange[0], true)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha fin:"), " ", formatDate(dateRange[1], true)))), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Paciente"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "N\xB0 Documento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Fecha y hora - Cita"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Inicio consulta"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Fin consulta"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Duraci\xF3n consulta"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Tipo"))), /*#__PURE__*/React.createElement("tbody", null, data.map((item, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.appointment?.patient?.full_name.toLowerCase() ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.appointment?.patient?.document_number ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.appointment?.appointment_date + ", " + item.appointment?.appointment_time), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.start_time ?? "Sin iniciar"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.created_at_formatted), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.consultation_duration ?? "00:00:00"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.clinical_record_type.name ?? "Sin tipo")))))));
};