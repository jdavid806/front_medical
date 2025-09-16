import React from "react";
export const ProceduresCountFormat = ({
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

  // Obtener todos los usuarios únicos
  const users = [...new Set(reportData.map(item => item.billing_user))].filter(Boolean);

  // Obtener todos los procedimientos únicos
  const allProcedures = reportData.flatMap(item => item.billed_procedure?.map(p => p.product.name) || []);
  const uniqueProcedures = [...new Set(allProcedures)].filter(Boolean);

  // Procesar datos para cada usuario - CONTEOS en lugar de montos
  const processUserData = user => {
    const userData = reportData.filter(item => item.billing_user === user);

    // Para cada procedimiento, calcular los conteos
    const procedureRows = uniqueProcedures.map(procedure => {
      let conteoParticular = 0;
      let conteoAutorizado = 0;
      userData.forEach(item => {
        const hasProcedure = item.billed_procedure?.some(proc => proc.product.name === procedure);
        if (hasProcedure) {
          if (item.sub_type === "public") {
            conteoParticular++;
          } else {
            conteoAutorizado++;
          }
        }
      });
      return {
        procedimiento: procedure,
        conteoParticular,
        conteoAutorizado,
        total: conteoParticular + conteoAutorizado
      };
    });

    // Calcular totales para el usuario
    const totals = procedureRows.reduce((acc, row) => ({
      conteoParticular: acc.conteoParticular + row.conteoParticular,
      conteoAutorizado: acc.conteoAutorizado + row.conteoAutorizado,
      total: acc.total + row.total
    }), {
      conteoParticular: 0,
      conteoAutorizado: 0,
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
    className: "procedures-count-visualization"
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
        padding: "1rem",
        backgroundColor: "white"
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        textAlign: "center",
        marginBottom: "1rem",
        backgroundColor: "#424a51",
        color: "white",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "16px",
        fontWeight: "bold"
      }
    }, user), /*#__PURE__*/React.createElement("table", {
      style: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
        marginBottom: "1rem",
        border: "1px solid #dee2e6"
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "left",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "200px"
      }
    }, "Procedimiento"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "100px"
      }
    }, "Conteo Particular"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "120px"
      }
    }, "Conteo Autorizado"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "100px"
      }
    }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, procedureRows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
      key: index,
      style: {
        backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa"
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "left"
      }
    }, row.procedimiento), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "center"
      }
    }, row.conteoParticular > 0 ? row.conteoParticular : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "center"
      }
    }, row.conteoAutorizado > 0 ? row.conteoAutorizado : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "center",
        fontWeight: "bold"
      }
    }, row.total)))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        fontWeight: "bold",
        backgroundColor: "#e9ecef"
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
    }, totals.conteoParticular), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        textAlign: "center",
        border: "1px solid #dee2e6"
      }
    }, totals.conteoAutorizado), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        textAlign: "center",
        border: "1px solid #dee2e6"
      }
    }, totals.total)))));
  }));
};