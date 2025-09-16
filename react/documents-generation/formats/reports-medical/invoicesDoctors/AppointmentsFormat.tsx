import React from "react";

interface ConsultationsByUserProps {
  reportData: any[];
  dateRange: any;
}

export const AppointmentsFormat: React.FC<ConsultationsByUserProps> = ({
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

  // Procesar datos como en generateConsultationsTable
  const doctorDateCounts: Record<
    string,
    Record<string, { particular: number; seguro: number }>
  > = {};
  const dates = new Set<string>();
  const doctors = new Set<string>();

  reportData.forEach((entry: any) => {
    const doctor = entry.billing_doctor;
    const date = entry.appointment_date_time?.date;

    if (doctor && date) {
      doctors.add(doctor);
      dates.add(date);

      if (!doctorDateCounts[doctor]) {
        doctorDateCounts[doctor] = {};
      }

      if (!doctorDateCounts[doctor][date]) {
        doctorDateCounts[doctor][date] = { particular: 0, seguro: 0 };
      }

      if (entry.sub_type === "public") {
        doctorDateCounts[doctor][date].particular += 1;
      } else if (entry.sub_type === "entity") {
        doctorDateCounts[doctor][date].seguro += 1;
      }
    }
  });

  // Ordenar fechas
  const sortedDates = Array.from(dates).sort();

  // Calcular totales por doctor
  const doctorTotals: Record<string, { particular: number; seguro: number; total: number }> = {};
  Array.from(doctors).forEach((doctor: string) => {
    doctorTotals[doctor] = { particular: 0, seguro: 0, total: 0 };
    
    sortedDates.forEach((date: string) => {
      const counts = doctorDateCounts[doctor]?.[date] || { particular: 0, seguro: 0 };
      doctorTotals[doctor].particular += counts.particular;
      doctorTotals[doctor].seguro += counts.seguro;
      doctorTotals[doctor].total += counts.particular + counts.seguro;
    });
  });

  // Calcular totales por fecha
  const dateTotals: Record<string, { particular: number; seguro: number }> = {};
  sortedDates.forEach((date: string) => {
    dateTotals[date] = { particular: 0, seguro: 0 };

    Array.from(doctors).forEach((doctor: string) => {
      const counts = doctorDateCounts[doctor]?.[date] || { particular: 0, seguro: 0 };
      dateTotals[date].particular += counts.particular;
      dateTotals[date].seguro += counts.seguro;
    });
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map((doctor: string) => {
    const userConsultations = sortedDates.map((date: string) => {
      const counts = doctorDateCounts[doctor]?.[date] || { particular: 0, seguro: 0 };
      return {
        date,
        particular: counts.particular,
        seguro: counts.seguro,
        total: counts.particular + counts.seguro
      };
    });

    return {
      doctor,
      consultations: userConsultations,
      totals: doctorTotals[doctor]
    };
  });

  const formatDate = (dateString: string) => {
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

  const formatHeaderDate = (dateString: string) => {
    return formatDate(dateString);
  };

  return (
    <div className="consultations-by-user">
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
          <strong>Generado el:</strong> {formatDate(new Date().toISOString().split('T')[0])}
        </div>

        <h1
          style={{
            color: "#2c3e50",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Reporte de Consultas por Especialista
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

          {/* Tabla de consultas del usuario */}
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
                  Fecha
                </th>
                <th
                  style={{
                    textAlign: "center",
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
                    textAlign: "center",
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
                    textAlign: "center",
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
              {userData.consultations.map((consultation, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatHeaderDate(consultation.date)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {consultation.particular > 0 ? consultation.particular : "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {consultation.seguro > 0 ? consultation.seguro : "-"}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {consultation.total > 0 ? consultation.total : "-"}
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
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.totals.particular}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.totals.seguro}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.totals.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {/* Tabla resumen de totales por fecha */}
      <div
        className="summary-table-container"
        style={{
          marginBottom: "2rem",
          border: "1px solid #ddd",
          padding: "1rem",
          backgroundColor: "#f0f8ff",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            backgroundColor: "#2c5282",
            color: "white",
            padding: "10px",
            borderRadius: "4px",
          }}
        >
          Resumen Total por Fecha
        </h3>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "12px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Fecha
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Particular
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Seguro
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "10px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDates.map((date: string, idx) => (
              <tr key={idx}>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "left",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {formatHeaderDate(date)}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {dateTotals[date]?.particular || 0}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {dateTotals[date]?.seguro || 0}
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid #eee",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {(dateTotals[date]?.particular || 0) + (dateTotals[date]?.seguro || 0)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr style={{ fontWeight: "bold", backgroundColor: "#e6f7ff" }}>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "left",
                  border: "1px solid #dee2e6",
                }}
              >
                TOTAL GENERAL
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {Object.values(dateTotals).reduce((sum, total) => sum + total.particular, 0)}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {Object.values(dateTotals).reduce((sum, total) => sum + total.seguro, 0)}
              </td>
              <td
                style={{
                  padding: "10px 8px",
                  textAlign: "center",
                  border: "1px solid #dee2e6",
                }}
              >
                {Object.values(dateTotals).reduce((sum, total) => sum + total.particular + total.seguro, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};