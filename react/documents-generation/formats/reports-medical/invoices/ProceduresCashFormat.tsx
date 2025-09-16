import React from "react";

interface ProcedureData {
  procedimiento: string;
  [key: string]: any;
}

interface ProceduresCashFormatProps {
  reportData: ProcedureData[];
  dateRange: any;
}

export const ProceduresCashFormat: React.FC<ProceduresCashFormatProps> = ({
  reportData,
  dateRange,
}) => {
  if (!reportData || reportData.length === 0) {
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

  // Obtener todos los usuarios únicos
  const users = [
    ...new Set(reportData.map((item) => item.billing_user)),
  ].filter(Boolean);

  // Obtener todos los procedimientos únicos
  const allProcedures = reportData.flatMap(
    (item) => item.billed_procedure?.map((p) => p.product.name) || []
  );
  const uniqueProcedures = [...new Set(allProcedures)].filter(Boolean);

  // Procesar datos para cada usuario
  const processUserData = (user: string) => {
    const userData = reportData.filter((item) => item.billing_user === user);

    // Para cada procedimiento, calcular las métricas
    const procedureRows = uniqueProcedures.map((procedure) => {
      let copago = 0;
      let particular = 0;
      let montoAutorizado = 0;
      let total = 0;

      userData.forEach((item) => {
        item.billed_procedure?.forEach((proc) => {
          if (proc.product.name === procedure) {
            const amount = parseFloat(proc.amount) || 0;

            if (item.sub_type === "entity") {
              copago += amount;
            } else if (item.sub_type === "public") {
              particular += amount;
            }

            // Monto autorizado (de entity_authorized_amount)
            const authorizedAmount =
              parseFloat(item.entity_authorized_amount || "0") || 0;
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
        total,
      };
    });

    // Calcular totales para el usuario
    const totals = procedureRows.reduce(
      (acc, row) => ({
        copago: acc.copago + row.copago,
        particular: acc.particular + row.particular,
        montoAutorizado: acc.montoAutorizado + row.montoAutorizado,
        total: acc.total + row.total,
      }),
      { copago: 0, particular: 0, montoAutorizado: 0, total: 0 }
    );

    return { procedureRows, totals };
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="procedures-visualization">
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
          Reporte de Facturas por Entidad
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
        const { procedureRows, totals } = processUserData(user);

        return (
          <div
            key={user}
            className="user-table-container"
            style={{
              marginBottom: "2rem",
              border: "1px solid #ddd",
              padding: "1rem",
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
              }}
            >
              {user}
            </h3>

            {/* Tabla de procedimientos del usuario */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                marginBottom: "1rem",
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
                    }}
                  >
                    Procedimiento
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
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
                    }}
                  >
                    Monto autorizado
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {procedureRows.map((row: any, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        padding: "10px 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "left",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {row.procedimiento}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {row.copago > 0 ? formatCurrency(row.copago) : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {row.particular > 0
                        ? formatCurrency(row.particular)
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {row.montoAutorizado > 0
                        ? formatCurrency(row.montoAutorizado)
                        : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        borderBottom: "1px solid #eee",
                        textAlign: "right",
                        border: "1px solid #dee2e6",
                      }}
                    >
                      {formatCurrency(row.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
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
