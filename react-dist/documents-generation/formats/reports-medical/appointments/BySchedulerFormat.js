import React from "react";
import { appointmentStateFilters } from "../../../../../services/commons.js";
export const ByScheduler = ({
  data,
  scheduler,
  dateRange
}) => {
  // Función para formatear currency (igual que en el primer componente)
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted.replace("RD$", "$");
  };

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
  }, "Reporte Agendamiento - ", scheduler), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatDate(dateRange[0], true)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatDate(dateRange[1], true)))), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "id"), /*#__PURE__*/React.createElement("th", {
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
  }, "Fecha y hora"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "M\xE9dico"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Especialidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Fecha creaci\xF3n"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold",
      color: "#000"
    }
  }, "Estado"))), /*#__PURE__*/React.createElement("tbody", null, data.map((item, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.patient.id ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, [item.patient.first_name.toLowerCase(), item.patient.middle_name.toLowerCase(), item.patient.last_name.toLowerCase(), item.patient.second_last_name.toLowerCase()].filter(Boolean).join(" ")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.appointment_date + ", " + item.appointment_time), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, [item.user_availability?.user.first_name, item.user_availability?.user.middle_name, item.user_availability?.user.last_name, item.user_availability?.user.second_last_name].filter(Boolean).join(" ")), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.user_availability?.user?.specialty?.name ?? ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, item.created_at ? formatDate(item.created_at, true) : ""), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      border: "1px solid #dee2e6",
      textAlign: "left"
    }
  }, appointmentStateFilters[item.appointment_state?.name] || "")))))));
};