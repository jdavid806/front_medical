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

  // Obtener todos los usuarios únicos
  const users = [...new Set(reportData.map(item => item.billing_user))].filter(Boolean);

  // Obtener todos los procedimientos únicos
  const allProcedures = reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []);
  const uniqueProcedures = [...new Set(allProcedures)].filter(Boolean);

  // Procesar datos para cada usuario
  const processUserData = user => {
    const userData = reportData.filter(item => item.billing_user === user);

    // Para cada procedimiento, calcular las métricas
    const procedureRows = uniqueProcedures.map(procedure => {
      let copago = 0;
      let particular = 0;
      let montoAutorizado = 0;
      let total = 0;
      userData.forEach(item => {
        item.billed_procedure?.forEach(proc => {
          if (proc.product.name === procedure) {
            const amount = parseFloat(proc.amount) || 0;
            if (item.sub_type === "entity") {
              copago += amount;
            } else if (item.sub_type === "public") {
              particular += amount;
            }

            // Monto autorizado (de entity_authorized_amount)
            const authorizedAmount = parseFloat(item.entity_authorized_amount || "0") || 0;
            montoAutorizado += authorizedAmount;
            total += amount;
          }
        });
      });
      return {
        procedimiento: procedure,
        copago,
        particular,
        montoAutorizado,
        total
      };
    });

    // Calcular totales para el usuario
    const totals = procedureRows.reduce((acc, row) => ({
      copago: acc.copago + row.copago,
      particular: acc.particular + row.particular,
      montoAutorizado: acc.montoAutorizado + row.montoAutorizado,
      total: acc.total + row.total
    }), {
      copago: 0,
      particular: 0,
      montoAutorizado: 0,
      total: 0
    });
    return {
      procedureRows,
      totals
    };
  };
  const formatDate = date => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "procedures-visualization"
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
  }, "Reporte de Facturas por Entidad"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "3rem",
      fontSize: "14px",
      color: "#6c757d"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de inicio:"), " ", formatDate(dateRange[0])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Fecha de fin:"), " ", formatDate(dateRange[1])))), users.map(user => {
    const {
      procedureRows,
      totals
    } = processUserData(user);
    return /*#__PURE__*/React.createElement("div", {
      key: user,
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
    }, user), /*#__PURE__*/React.createElement("table", {
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
    }, "Monto autorizado"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold"
      }
    }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, procedureRows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
      key: index
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        textAlign: "left",
        border: "1px solid #dee2e6"
      }
    }, row.procedimiento), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, row.copago > 0 ? formatCurrency(row.copago) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, row.particular > 0 ? formatCurrency(row.particular) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, row.montoAutorizado > 0 ? formatCurrency(row.montoAutorizado) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        borderBottom: "1px solid #eee",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, formatCurrency(row.total))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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
    }, formatCurrency(totals.copago)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, formatCurrency(totals.particular)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, formatCurrency(totals.montoAutorizado)), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        textAlign: "right",
        border: "1px solid #dee2e6"
      }
    }, formatCurrency(totals.total))))));
  }));
};