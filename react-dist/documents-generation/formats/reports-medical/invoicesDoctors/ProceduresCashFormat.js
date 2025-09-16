import React from "react";
export const ProceduresCashFormat = ({
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

  // Función para formatear currency
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted.replace("RD$", "$");
  };

  // Procesar datos como en generateDoctorsTable
  const procedureDoctorTotals = {};
  const doctors = new Set();
  const procedureSet = new Set();
  reportData.forEach(entry => {
    const doctor = entry.billing_doctor;
    doctors.add(doctor);
    entry.billed_procedure?.forEach(proc => {
      const procedureName = proc.product?.name;
      const amount = parseFloat(proc.amount) || 0;
      const entityAmount = parseFloat(entry.entity_authorized_amount) || 0;
      procedureSet.add(procedureName);
      if (!procedureDoctorTotals[procedureName]) {
        procedureDoctorTotals[procedureName] = {};
      }
      if (!procedureDoctorTotals[procedureName][doctor]) {
        procedureDoctorTotals[procedureName][doctor] = {
          count: 0,
          amount: 0,
          avg: 0
        };
      }

      // Copago (count)
      if (entry.sub_type === "entity") {
        procedureDoctorTotals[procedureName][doctor].count += amount;
      }

      // Particular (amount)
      if (entry.sub_type === "public") {
        procedureDoctorTotals[procedureName][doctor].amount += amount;
      }

      // Monto autorizado (avg)
      procedureDoctorTotals[procedureName][doctor].avg += entityAmount;
    });
  });

  // Calcular totales por doctor
  const doctorTotals = {};
  Array.from(doctors).forEach(doctor => {
    doctorTotals[doctor] = {
      count: 0,
      amount: 0,
      avg: 0,
      total: 0
    };
    Array.from(procedureSet).forEach(proc => {
      const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
        count: 0,
        amount: 0,
        avg: 0
      };
      doctorTotals[doctor].count += doctorData.count;
      doctorTotals[doctor].amount += doctorData.amount;
      doctorTotals[doctor].avg += doctorData.avg;
      doctorTotals[doctor].total += doctorData.amount;
    });
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map(doctor => {
    const userProcedures = Array.from(procedureSet).map(proc => {
      const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
        count: 0,
        amount: 0,
        avg: 0
      };
      return {
        procedure: proc,
        copago: doctorData.count,
        particular: doctorData.amount,
        seguro: doctorData.avg,
        total: doctorData.amount
      };
    }).filter(item => item.copago > 0 || item.particular > 0 || item.seguro > 0);
    return {
      doctor,
      procedures: userProcedures,
      totals: doctorTotals[doctor]
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
    className: "procedures-by-user"
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
  }, "Reporte de Procedimientos por Especialista"), /*#__PURE__*/React.createElement("div", {
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
  }, "Procedimiento"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Copago"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Particular"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Seguro"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "right",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, userData.procedures.map((procedure, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, procedure.procedure), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, procedure.copago > 0 ? formatCurrency(procedure.copago) : "-"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, procedure.particular > 0 ? formatCurrency(procedure.particular) : "-"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, procedure.seguro > 0 ? formatCurrency(procedure.seguro) : "-"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, formatCurrency(procedure.total))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, formatCurrency(userData.totals.count)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, formatCurrency(userData.totals.amount)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, formatCurrency(userData.totals.avg)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "right",
      border: "1px solid #dee2e6"
    }
  }, formatCurrency(userData.totals.total))))))));
};