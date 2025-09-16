import React from "react";

interface ProductivityByUserProps {
  reportData: any[];
  dateRange: any;
}

export const ProductivityFormat: React.FC<ProductivityByUserProps> = ({
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

  // Procesar datos como en generateTableProductivity
  const userProductivityData = reportData.map((user: any, userIndex) => {
    let countAppointments = user.appointments.length;
    let countProceduresInvoiced = 0;
    const fullName = `${user.first_name ?? ""} ${user.middle_name ?? ""} ${
      user.last_name ?? ""
    } ${user.second_name ?? ""}`;

    const appointmentDetails = user.appointments.map((appointment, appointmentIndex) => {
      let status = "unInvoiced";
      if (appointment.admission && appointment.admission.invoice && appointment?.admission?.invoice?.status !== "cancelled") {
        countProceduresInvoiced++;
        status = "invoiced";
      }

      return {
        key: `${userIndex}-${appointmentIndex}`,
        date: appointment.appointment_date,
        procedures: appointment.exam_recipe.details
          .map((detail) => detail.exam_type.name)
          .join(", "),
        proceduresInvoiced: appointment?.admission?.invoice?.details
          .map((detail) => detail.product.name)
          .join(", ") ?? "Sin factura",
        status: status,
        isLeaf: true,
      };
    });

    const productivityPercentage = countAppointments > 0 
      ? ((countProceduresInvoiced / countAppointments) * 100).toFixed(2) + "%"
      : "0%";

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

  const formatHeaderDate = (date: Date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Calcular totales generales
  const grandTotals = userProductivityData.reduce(
    (acc, user) => ({
      totalAppointments: acc.totalAppointments + user.countAppointments,
      totalInvoiced: acc.totalInvoiced + user.countProceduresInvoiced,
    }),
    { totalAppointments: 0, totalInvoiced: 0 }
  );

  const grandProductivity = grandTotals.totalAppointments > 0
    ? ((grandTotals.totalInvoiced / grandTotals.totalAppointments) * 100).toFixed(2) + "%"
    : "0%";

  return (
    <div className="productivity-by-user">
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
          <strong>Generado el:</strong> {formatHeaderDate(new Date())}
        </div>

        <h1
          style={{
            color: "#2c3e50",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Reporte de Productividad por Especialista
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
            <strong>Fecha de inicio:</strong> {formatHeaderDate(dateRange[0])}
          </div>
          <div>
            <strong>Fecha de fin:</strong> {formatHeaderDate(dateRange[1])}
          </div>
        </div>
      </div>

      {userProductivityData.map((userData, index) => (
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

          {/* Resumen de productividad del usuario */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              border: "1px solid #dee2e6",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "0.5rem" }}>
                Total Citas
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#2c3e50" }}>
                {userData.countAppointments}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "0.5rem" }}>
                Procedimientos Facturados
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
                {userData.countProceduresInvoiced}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "14px", color: "#6c757d", marginBottom: "0.5rem" }}>
                Productividad
              </div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
                {userData.productivityPercentage}
              </div>
            </div>
          </div>

          {/* Tabla de detalle de citas del usuario */}
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
                  Fecha Cita
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                  }}
                >
                  Procedimientos Solicitados
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "10px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    fontWeight: "bold",
                  }}
                >
                  Procedimientos Facturados
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
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.appointments.map((appointment, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {formatDate(appointment.date)}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {appointment.procedures}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {appointment.proceduresInvoiced}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "center",
                      border: "1px solid #dee2e6",
                      color: appointment.status === "invoiced" ? "#28a745" : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {appointment.status === "invoiced" ? "Facturado" : "No Facturado"}
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
                    textAlign: "left",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.countAppointments} citas
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "left",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.countProceduresInvoiced} procedimientos
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    border: "1px solid #dee2e6",
                    color: "#007bff",
                  }}
                >
                  {userData.productivityPercentage}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

    </div>
  );
};