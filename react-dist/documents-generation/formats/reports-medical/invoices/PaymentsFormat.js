import React from "react";
export const PaymentsFormat = ({
  reportData,
  dateRange
}) => {
  if (!reportData || reportData.length === 0 || !reportData.some(item => item.payment_methods && item.payment_methods.length > 0)) {
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

  // Filtrar datos que tienen métodos de pago
  const filteredData = reportData.filter(item => item.payment_methods && item.payment_methods.length > 0);

  // Obtener todos los usuarios únicos
  const users = [...new Set(filteredData.map(item => item.billing_user))].filter(Boolean);

  // Obtener todos los métodos de pago únicos
  const allPaymentMethods = filteredData.flatMap(item => item.payment_methods?.map(pm => pm.payment_method.method) || []);
  const paymentMethods = [...new Set(allPaymentMethods)].filter(Boolean);

  // Procesar datos para cada usuario
  const processUserData = user => {
    const userData = filteredData.filter(item => item.billing_user === user);

    // Para cada método de pago, calcular las métricas
    const paymentRows = paymentMethods.map(method => {
      let copago = 0;
      let particular = 0;
      let montoAutorizado = 0;
      let total = 0;
      userData.forEach(item => {
        item.payment_methods?.forEach(pm => {
          if (pm.payment_method.method === method) {
            const amount = parseFloat(pm.amount) || 0;
            if (item.sub_type === "entity") {
              copago += amount;
            } else if (item.sub_type === "public") {
              particular += amount;
            } else {
              montoAutorizado += amount;
            }
          }
        });
      });
      total = copago + particular + montoAutorizado;
      return {
        metodo: method,
        copago,
        particular,
        montoAutorizado,
        total
      };
    });

    // Calcular totales para el usuario
    const totals = paymentRows.reduce((acc, row) => ({
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
      paymentRows,
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
    className: "payments-visualization"
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
  }, "Reporte de M\xE9todos de Pago"), /*#__PURE__*/React.createElement("div", {
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
      paymentRows,
      totals
    } = processUserData(user);
    return /*#__PURE__*/React.createElement("div", {
      key: user,
      className: "user-table-container",
      style: {
        pageBreakInside: "avoid",
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
    }, "M\xE9todo de Pago"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "120px"
      }
    }, "Copago"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "120px"
      }
    }, "Particular"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "140px"
      }
    }, "Monto Autorizado"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: "right",
        padding: "10px",
        backgroundColor: "#f8f9fa",
        border: "1px solid #dee2e6",
        fontWeight: "bold",
        minWidth: "120px"
      }
    }, "Total"))), /*#__PURE__*/React.createElement("tbody", null, paymentRows.map((row, index) => /*#__PURE__*/React.createElement("tr", {
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
    }, row.metodo), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "right"
      }
    }, row.copago > 0 ? formatCurrency(row.copago) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "right"
      }
    }, row.particular > 0 ? formatCurrency(row.particular) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "right"
      }
    }, row.montoAutorizado > 0 ? formatCurrency(row.montoAutorizado) : "-"), /*#__PURE__*/React.createElement("td", {
      style: {
        padding: "10px 8px",
        border: "1px solid #dee2e6",
        textAlign: "right",
        fontWeight: "bold"
      }
    }, formatCurrency(row.total))))), /*#__PURE__*/React.createElement("tfoot", null, /*#__PURE__*/React.createElement("tr", {
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