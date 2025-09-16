import React from "react";

interface PaymentsVisualizationProps {
  reportData: any[];
  dateRange: any;
}

export const PaymentsFormat: React.FC<PaymentsVisualizationProps> = ({
  reportData,
  dateRange,
}) => {
  if (
    !reportData ||
    reportData.length === 0 ||
    !reportData.some(
      (item) => item.payment_methods && item.payment_methods.length > 0
    )
  ) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <span>No hay datos disponibles</span>
      </div>
    );
  }

  // Función para formatear currency
  const formatCurrency = (value: number) => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
    return formatted.replace("RD$", "$");
  };

  // Filtrar datos que tienen métodos de pago
  const filteredData = reportData.filter(
    (item) => item.payment_methods && item.payment_methods.length > 0
  );

  // Obtener todos los usuarios únicos
  const users = [
    ...new Set(filteredData.map((item) => item.billing_user)),
  ].filter(Boolean);

  // Obtener todos los métodos de pago únicos
  const allPaymentMethods = filteredData.flatMap(
    (item) => item.payment_methods?.map((pm) => pm.payment_method.method) || []
  );
  const paymentMethods = [...new Set(allPaymentMethods)].filter(Boolean);

  // Procesar datos para cada usuario
  const processUserData = (user: string) => {
    const userData = filteredData.filter((item) => item.billing_user === user);

    // Para cada método de pago, calcular las métricas
    const paymentRows = paymentMethods.map((method) => {
      let copago = 0;
      let particular = 0;
      let montoAutorizado = 0;
      let total = 0;

      userData.forEach((item) => {
        item.payment_methods?.forEach((pm: any) => {
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
        total,
      };
    });

    // Calcular totales para el usuario
    const totals = paymentRows.reduce(
      (acc, row) => ({
        copago: acc.copago + row.copago,
        particular: acc.particular + row.particular,
        montoAutorizado: acc.montoAutorizado + row.montoAutorizado,
        total: acc.total + row.total,
      }),
      { copago: 0, particular: 0, montoAutorizado: 0, total: 0 }
    );

    return { paymentRows, totals };
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="payments-visualization">
      <div
        style={{
          position: "relative",
          textAlign: "center",
          marginBottom: "2rem",
          padding: "1.5rem",
          backgroundColor: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
        }}
      >
        {/* Fecha de generación en esquina superior izquierda */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "15px",
            fontSize: "12px",
            color: "#495057",
          }}
        >
          <strong>Generado el:</strong> {formatDate(new Date())}
        </div>

        <h1
          style={{
            color: "#2c3e50",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Reporte de Métodos de Pago
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "3rem",
            fontSize: "14px",
            color: "#6c757d",
          }}
        >
          <div>
            <strong>Fecha de inicio:</strong> {formatDate(dateRange[0])}
          </div>
          <div>
            <strong>Fecha de fin:</strong> {formatDate(dateRange[1])}
          </div>
        </div>
      </div>
      {users.map((user: any) => {
        const { paymentRows, totals } = processUserData(user);

        return (
          <div
            key={user}
            className="user-table-container"
            style={{
              marginBottom: "2rem",
              border: "1px solid #ddd",
              padding: "1rem",
              backgroundColor: "white",
            }}
          >
            {/* Header con nombre del usuario */}
            <h3
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                backgroundColor: "#424a51",
                color: "white",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {user}
            </h3>

            {/* Tabla de métodos de pago del usuario */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                marginBottom: "1rem",
                border: "1px solid #dee2e6",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "200px",
                    }}
                  >
                    Método de Pago
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "120px",
                    }}
                  >
                    Copago
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "120px",
                    }}
                  >
                    Particular
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "140px",
                    }}
                  >
                    Monto Autorizado
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "120px",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row: any, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#f8f9fa",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "left",
                      }}
                    >
                      {row.metodo}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "right",
                      }}
                    >
                      {row.copago > 0 ? formatCurrency(row.copago) : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "right",
                      }}
                    >
                      {row.particular > 0 ? formatCurrency(row.particular) : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "right",
                      }}
                    >
                      {row.montoAutorizado > 0 ? formatCurrency(row.montoAutorizado) : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "right",
                        fontWeight: "bold",
                      }}
                    >
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    TOTALES
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatCurrency(totals.copago)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatCurrency(totals.particular)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatCurrency(totals.montoAutorizado)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatCurrency(totals.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        );
      })}
    </div>
  );
};