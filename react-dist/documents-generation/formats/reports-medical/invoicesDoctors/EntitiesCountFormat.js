import React from "react";
export const EntitiesCountFormat = ({
  reportData,
  dateRange
}) => {
  if (!reportData || reportData.length === 0 || !reportData.some(item => item.insurance)) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-center align-items-center",
      style: {
        height: "200px"
      }
    }, /*#__PURE__*/React.createElement("span", null, "No hay datos disponibles"));
  }

  // Procesar datos como en generateEntityCountTable
  // Filtrar datos que tienen seguro/entidad
  const filteredData = reportData.filter(item => item.insurance);
  const entityDoctorCounts = {};
  const doctors = new Set();
  const entities = new Set();
  filteredData.forEach(entry => {
    const entity = entry.insurance?.name;
    const doctor = entry.billing_doctor;
    const procedureCount = entry.billed_procedure?.length || 0;
    if (entity && doctor) {
      entities.add(entity);
      doctors.add(doctor);
      if (!entityDoctorCounts[entity]) {
        entityDoctorCounts[entity] = {};
      }
      entityDoctorCounts[entity][doctor] = (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
    }
  });

  // Calcular totales por doctor
  const doctorTotals = {};
  Array.from(doctors).forEach(doctor => {
    doctorTotals[doctor] = Array.from(entities).reduce((sum, entity) => {
      return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
    }, 0);
  });

  // Calcular totales por entidad
  const entityTotals = {};
  Array.from(entities).forEach(entity => {
    entityTotals[entity] = Array.from(doctors).reduce((sum, doctor) => {
      return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
    }, 0);
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map(doctor => {
    const userEntities = Array.from(entities).map(entity => {
      const count = entityDoctorCounts[entity]?.[doctor] || 0;
      return {
        entity,
        count
      };
    }).filter(item => item.count > 0);
    return {
      doctor,
      entities: userEntities,
      total: doctorTotals[doctor] || 0
    };
  });
  const formatDate = date => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "entity-count-by-user"
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
  }, "Reporte de Conteo de Procedimientos por Entidad"), /*#__PURE__*/React.createElement("div", {
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
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Cantidad de Procedimientos"))), /*#__PURE__*/React.createElement("tbody", null, userData.entities.map((entity, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, entity.entity), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, entity.count)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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
  }, "TOTAL"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, userData.total)))))), /*#__PURE__*/React.createElement("div", {
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
  }, "Resumen Total por Entidad"), /*#__PURE__*/React.createElement("table", {
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
  }, "Entidad"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#e6f7ff",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Total de Procedimientos"))), /*#__PURE__*/React.createElement("tbody", null, Array.from(entities).sort().map((entity, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, entity), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, entityTotals[entity] || 0)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, Object.values(entityTotals).reduce((sum, total) => sum + total, 0)))))));
};