import React from "react";

interface ProceduresByUserProps {
  reportData: any[];
  dateRange: any;
}

export const ProceduresCashFormat: React.FC<ProceduresByUserProps> = ({
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

  // Procesar datos como en generateDoctorsTable
  const procedureDoctorTotals: Record<
    string,
    Record<
      string,
      {
        count: number;
        amount: number;
        avg: number;
      }
    >
  > = {};
  const doctors = new Set<string>();
  const procedureSet = new Set<string>();

  reportData.forEach((entry) => {
    const doctor = entry.billing_doctor;
    doctors.add(doctor);

    entry.billed_procedure?.forEach((proc) => {
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
          avg: 0,
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
  const doctorTotals: Record<
    string,
    {
      count: number;
      amount: number;
      avg: number;
      total: number;
    }
  > = {};

  Array.from(doctors).forEach((doctor: string) => {
    doctorTotals[doctor] = {
      count: 0,
      amount: 0,
      avg: 0,
      total: 0,
    };

    Array.from(procedureSet).forEach((proc: string) => {
      const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
        count: 0,
        amount: 0,
        avg: 0,
      };
      doctorTotals[doctor].count += doctorData.count;
      doctorTotals[doctor].amount += doctorData.amount;
      doctorTotals[doctor].avg += doctorData.avg;
      doctorTotals[doctor].total += doctorData.amount;
    });
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map((doctor: string) => {
    const userProcedures = Array.from(procedureSet)
      .map((proc: string) => {
        const doctorData = procedureDoctorTotals[proc]?.[doctor] || {
          count: 0,
          amount: 0,
          avg: 0,
        };

        return {
          procedure: proc,
          copago: doctorData.count,
          particular: doctorData.amount,
          seguro: doctorData.avg,
          total: doctorData.amount,
        };
      })
      .filter((item) => item.copago > 0 || item.particular > 0 || item.seguro > 0);

    return {
      doctor,
      procedures: userProcedures,
      totals: doctorTotals[doctor],
    };
  });

  const formatDate = (date: Date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="procedures-by-user">
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
          Reporte de Procedimientos por Especialista
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

      {userTablesData.map((userData, index) => (
        <div
          key={index}
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
            {userData.doctor}
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
                  Seguro
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
              {userData.procedures.map((procedure, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {procedure.procedure}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {procedure.copago > 0 ? formatCurrency(procedure.copago) : "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {procedure.particular > 0 ? formatCurrency(procedure.particular) : "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {procedure.seguro > 0 ? formatCurrency(procedure.seguro) : "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatCurrency(procedure.total)}
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
                  {formatCurrency(userData.totals.count)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "right",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {formatCurrency(userData.totals.amount)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "right",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {formatCurrency(userData.totals.avg)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "right",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {formatCurrency(userData.totals.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}
    </div>
  );
};