import React from "react";
export const ProductivityFormat = ({
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

  // Procesar datos como en generateTableProductivity
  const userProductivityData = reportData.map((user, userIndex) => {
    let countAppointments = user.appointments.length;
    let countProceduresInvoiced = 0;
    const fullName = `${user.first_name ?? ""} ${user.middle_name ?? ""} ${user.last_name ?? ""} ${user.second_name ?? ""}`;
    const appointmentDetails = user.appointments.map((appointment, appointmentIndex) => {
      let status = "unInvoiced";
      if (appointment.admission && appointment.admission.invoice && appointment?.admission?.invoice?.status !== "cancelled") {
        countProceduresInvoiced++;
        status = "invoiced";
      }
      return {
        key: `${userIndex}-${appointmentIndex}`,
        date: appointment.appointment_date,
        procedures: appointment.exam_recipe.details.map(detail => detail.exam_type.name).join(", "),
        proceduresInvoiced: appointment?.admission?.invoice?.details.map(detail => detail.product.name).join(", ") ?? "Sin factura",
        status: status,
        isLeaf: true
      };
    });
    const productivityPercentage = countAppointments > 0 ? (countProceduresInvoiced / countAppointments * 100).toFixed(2) + "%" : "0%";
    return {
      doctor: fullName,
      countAppointments,
      countProceduresInvoiced,
      productivityPercentage,
      appointments: appointmentDetails,
      totals: {
        appointments: countAppointments,
        invoiced: countProceduresInvoiced,
        productivity: productivityPercentage
      }
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
  const formatHeaderDate = date => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calcular totales generales
  const grandTotals = userProductivityData.reduce((acc, user) => ({
    totalAppointments: acc.totalAppointments + user.countAppointments,
    totalInvoiced: acc.totalInvoiced + user.countProceduresInvoiced
  }), {
    totalAppointments: 0,
    totalInvoiced: 0
  });
  const grandProductivity = grandTotals.totalAppointments > 0 ? (grandTotals.totalInvoiced / grandTotals.totalAppointments * 100).toFixed(2) + "%" : "0%";
  return /*#__PURE__*/React.createElement("div", {
    className: "productivity-by-user"
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
  }, /*#__PURE__*/React.createElement("strong", null, "Generado el:"), " ", formatHeaderDate(new Date())), /*#__PURE__*/React.createElement("h1", {
    style: {
      color: "#2c3e50",
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "1rem"
    }
  }, "Reporte de Productividad por Especialista"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatHeaderDate(dateRange[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatHeaderDate(dateRange[1])))), userProductivityData.map((userData, index) => /*#__PURE__*/React.createElement("div", {
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
  }, userData.doctor), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
      marginBottom: "1.5rem",
      padding: "1rem",
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
      border: "1px solid #dee2e6"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "0.5rem"
    }
  }, "Total Citas"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#2c3e50"
    }
  }, userData.countAppointments)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "0.5rem"
    }
  }, "Procedimientos Facturados"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#28a745"
    }
  }, userData.countProceduresInvoiced)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "14px",
      color: "#6c757d",
      marginBottom: "0.5rem"
    }
  }, "Productividad"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#007bff"
    }
  }, userData.productivityPercentage))), /*#__PURE__*/React.createElement("table", {
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
  }, "Fecha Cita"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Procedimientos Solicitados"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "left",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Procedimientos Facturados"), /*#__PURE__*/React.createElement("th", {
    style: {
      textAlign: "center",
      padding: "10px",
      backgroundColor: "#f8f9fa",
      border: "1px solid #dee2e6",
      fontWeight: "bold"
    }
  }, "Estado"))), /*#__PURE__*/React.createElement("tbody", null, userData.appointments.map((appointment, idx) => /*#__PURE__*/React.createElement("tr", {
    key: idx
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, formatDate(appointment.date)), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.procedures), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, appointment.proceduresInvoiced), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
      border: "1px solid #dee2e6",
      color: appointment.status === "invoiced" ? "#28a745" : "#dc3545",
      fontWeight: "bold"
    }
  }, appointment.status === "invoiced" ? "Facturado" : "No Facturado")))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, userData.countAppointments, " citas"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "left",
      border: "1px solid #dee2e6"
    }
  }, userData.countProceduresInvoiced, " procedimientos"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: "10px 8px",
      textAlign: "center",
      border: "1px solid #dee2e6",
      color: "#007bff"
    }
  }, userData.productivityPercentage)))))));
};