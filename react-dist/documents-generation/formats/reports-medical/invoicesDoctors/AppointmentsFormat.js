import React from "react";
export const AppointmentsFormat = ({
  reportData,
  dateRange
}) => {
  if (!reportData || reportData.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
  }

  // Procesar datos como en generateConsultationsTable
  const doctorDateCounts = {};
  const dates = new Set();
  const doctors = new Set();
  reportData.forEach(entry => {
    const doctor = entry.billing_doctor;
    const date = entry.appointment_date_time?.date;
    if (doctor && date) {
      doctors.add(doctor);
      dates.add(date);
      if (!doctorDateCounts[doctor]) {
        doctorDateCounts[doctor] = {};
      }
      if (!doctorDateCounts[doctor][date]) {
        doctorDateCounts[doctor][date] = {
          particular: 0,
          seguro: 0
        };
      }
      if (entry.sub_type === "public") {
        doctorDateCounts[doctor][date].particular += 1;
      } else if (entry.sub_type === "entity") {
        doctorDateCounts[doctor][date].seguro += 1;
      }
    }
  });

  // Ordenar fechas
  const sortedDates = Array.from(dates).sort();

  // Calcular totales por doctor
  const doctorTotals = {};
  Array.from(doctors).forEach(doctor => {
    doctorTotals[doctor] = {
      particular: 0,
      seguro: 0,
      total: 0
    };
    sortedDates.forEach(date => {
      const counts = doctorDateCounts[doctor]?.[date] || {
        particular: 0,
        seguro: 0
      };
      doctorTotals[doctor].particular += counts.particular;
      doctorTotals[doctor].seguro += counts.seguro;
      doctorTotals[doctor].total += counts.particular + counts.seguro;
    });
  });

  // Calcular totales por fecha
  const dateTotals = {};
  sortedDates.forEach(date => {
    dateTotals[date] = {
      particular: 0,
      seguro: 0
    };
    Array.from(doctors).forEach(doctor => {
      const counts = doctorDateCounts[doctor]?.[date] || {
        particular: 0,
        seguro: 0
      };
      dateTotals[date].particular += counts.particular;
      dateTotals[date].seguro += counts.seguro;
    });
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map(doctor => {
    const userConsultations = sortedDates.map(date => {
      const counts = doctorDateCounts[doctor]?.[date] || {
        particular: 0,
        seguro: 0
      };
      return {
        date,
        particular: counts.particular,
        seguro: counts.seguro,
        total: counts.particular + counts.seguro
      };
    });
    return {
      doctor,
      consultations: userConsultations,
      totals: doctorTotals[doctor]
    };
  });
  const formatDate = dateString => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return dateString;
    }
  };
  const formatHeaderDate = dateString => {
    return formatDate(dateString);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "consultations-by-user"
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
  }, /*#__PURE__*/React.createElement("strong", null, "Generado el:"), " ", formatDate(new Date().toISOString().split('T')[0])), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "1rem"
    }
  }, "Reporte de Consultas por Especialista"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatDate(dateRange[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatDate(dateRange[1])))), userTablesData.map((userData, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "user-table-container",
    style: {
      marginBottom: "2rem",
      border: "1px solid #ddd",
      padding: "1rem"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      textAlign: "center",
      marginBottom: "1rem",
      backgroundColor: "#424a51",
      color: "white",
      padding: "10px",
      borderRadius: "4px"
    }
  }, userData.doctor), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px",
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Particular"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Seguro"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, userData.consultations.map((consultation, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, formatHeaderDate(consultation.date)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, consultation.particular > 0 ? consultation.particular : "-"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, consultation.seguro > 0 ? consultation.seguro : "-"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, consultation.total > 0 ? consultation.total : "-")))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      fontWeight: "bold",
      backgroundColor: "#f8f9fa"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, "TOTALES"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, userData.totals.particular), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, userData.totals.seguro), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, userData.totals.total)))))), /*#__PURE__*/React.createElement("div", {
    className: "summary-table-container",
    style: {
      marginBottom: "2rem",
      border: "1px solid #ddd",
      padding: "1rem",
      backgroundColor: "#f0f8ff"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      textAlign: "center",
      marginBottom: "1rem",
      backgroundColor: "#2c5282",
      color: "white",
      padding: "10px",
      borderRadius: "4px"
    }
  }, "Resumen Total por Fecha"), /*#__PURE__*/React.createElement("table", {
    style: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "12px"
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#e6f7ff",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Fecha"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#e6f7ff",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Particular"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#e6f7ff",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Seguro"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#e6f7ff",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, sortedDates.map((date, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, formatHeaderDate(date)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, dateTotals[date]?.particular || 0), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, dateTotals[date]?.seguro || 0), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, (dateTotals[date]?.particular || 0) + (dateTotals[date]?.seguro || 0))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      fontWeight: "bold",
      backgroundColor: "#e6f7ff"
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, "TOTAL GENERAL"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, Object.values(dateTotals).reduce((sum, total) => sum + total.particular, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, Object.values(dateTotals).reduce((sum, total) => sum + total.seguro, 0)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6"
    }
  }, Object.values(dateTotals).reduce((sum, total) => sum + total.particular + total.seguro, 0)))))));
};