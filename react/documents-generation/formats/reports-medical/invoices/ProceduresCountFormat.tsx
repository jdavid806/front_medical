import React from "react";

interface ProceduresCountFormatProps {
  reportData: any[];
  dateRange: any;
}

export const ProceduresCountFormat: React.FC<ProceduresCountFormatProps> = ({
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

  // Obtener todos los usuarios únicos
  const users = [
    ...new Set(reportData.map((item) => item.billing_user)),
  ].filter(Boolean);

  // Obtener todos los procedimientos únicos
  const allProcedures = reportData.flatMap(
    (item) => item.billed_procedure?.map((p) => p.product.name) || []
  );
  const uniqueProcedures = [...new Set(allProcedures)].filter(Boolean);

  // Procesar datos para cada usuario - CONTEOS en lugar de montos
  const processUserData = (user: string) => {
    const userData = reportData.filter((item) => item.billing_user === user);

    // Para cada procedimiento, calcular los conteos
    const procedureRows = uniqueProcedures.map((procedure) => {
      let conteoParticular = 0;
      let conteoAutorizado = 0;

      userData.forEach((item) => {
        const hasProcedure = item.billed_procedure?.some(
          (proc) => proc.product.name === procedure
        );

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
        total: conteoParticular + conteoAutorizado,
      };
    });

    // Calcular totales para el usuario
    const totals = procedureRows.reduce(
      (acc, row) => ({
        conteoParticular: acc.conteoParticular + row.conteoParticular,
        conteoAutorizado: acc.conteoAutorizado + row.conteoAutorizado,
        total: acc.total + row.total,
      }),
      { conteoParticular: 0, conteoAutorizado: 0, total: 0 }
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
    <div className="procedures-count-visualization">
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

            {/* Tabla de conteos de procedimientos del usuario */}
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
                    Procedimiento
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "100px",
                    }}
                  >
                    Conteo Particular
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "120px",
                    }}
                  >
                    Conteo Autorizado
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      minWidth: "100px",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {procedureRows.map((row: any, index) => (
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
                      {row.procedimiento}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "center",
                      }}
                    >
                      {row.conteoParticular > 0 ? row.conteoParticular : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "center",
                      }}
                    >
                      {row.conteoAutorizado > 0 ? row.conteoAutorizado : "-"}
                    </td>
                    <td
                      style={{
                        padding: "10px 8px",
                        border: "1px solid #dee2e6",
                        textAlign: "center",
                        fontWeight: "bold",
                      }}
                    >
                      {row.total}
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
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {totals.conteoParticular}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {totals.conteoAutorizado}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {totals.total}
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
