import React from "react";

interface EntityCountByUserProps {
  reportData: any[];
  dateRange: any;
}

export const EntitiesCountFormat: React.FC<EntityCountByUserProps> = ({
  reportData,
  dateRange,
}) => {
  if (!reportData || reportData.length === 0 || !reportData.some((item) => item.insurance)) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "200px" }}
      >
        <span>No hay datos disponibles</span>
      </div>
    );
  }

  // Procesar datos como en generateEntityCountTable
  // Filtrar datos que tienen seguro/entidad
  const filteredData = reportData.filter((item: any) => item.insurance);
  
  const entityDoctorCounts: Record<string, Record<string, number>> = {};
  const doctors = new Set<string>();
  const entities = new Set<string>();

  filteredData.forEach((entry: any) => {
    const entity = entry.insurance?.name;
    const doctor = entry.billing_doctor;
    const procedureCount = entry.billed_procedure?.length || 0;

    if (entity && doctor) {
      entities.add(entity);
      doctors.add(doctor);

      if (!entityDoctorCounts[entity]) {
        entityDoctorCounts[entity] = {};
      }

      entityDoctorCounts[entity][doctor] =
        (entityDoctorCounts[entity][doctor] || 0) + procedureCount;
    }
  });

  // Calcular totales por doctor
  const doctorTotals: Record<string, number> = {};
  Array.from(doctors).forEach((doctor: string) => {
    doctorTotals[doctor] = Array.from(entities).reduce(
      (sum, entity: string) => {
        return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
      },
      0
    );
  });

  // Calcular totales por entidad
  const entityTotals: Record<string, number> = {};
  Array.from(entities).forEach((entity: string) => {
    entityTotals[entity] = Array.from(doctors).reduce(
      (sum, doctor: string) => {
        return sum + (entityDoctorCounts[entity]?.[doctor] || 0);
      },
      0
    );
  });

  // Preparar datos para cada usuario
  const userTablesData = Array.from(doctors).map((doctor: string) => {
    const userEntities = Array.from(entities)
      .map((entity: string) => {
        const count = entityDoctorCounts[entity]?.[doctor] || 0;

        return {
          entity,
          count,
        };
      })
      .filter((item) => item.count > 0);

    return {
      doctor,
      entities: userEntities,
      total: doctorTotals[doctor] || 0,
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
    <div className="entity-count-by-user">
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
          Reporte de Conteo de Procedimientos por Entidad
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

          {/* Tabla de entidades del usuario */}
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
                  Entidad
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
                  Cantidad de Procedimientos
                </th>
              </tr>
            </thead>
            <tbody>
              {userData.entities.map((entity, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {entity.entity}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {entity.count}
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
                  TOTAL
                </td>
                <td
                  style={{
                    padding: "10px 8px",
                    textAlign: "right",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {userData.total}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      ))}

      {/* Tabla resumen de totales por entidad */}
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
          Resumen Total por Entidad
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
                Entidad
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "10px",
                  backgroundColor: "#e6f7ff",
                  border: "1px solid #dee2e6",
                  fontWeight: "bold",
                }}
              >
                Total de Procedimientos
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from(entities)
              .sort()
              .map((entity: string, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "left",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {entity}
                  </td>
                  <td
                    style={{
                      padding: "10px 8px",
                      borderBottom: "1px solid #eee",
                      textAlign: "right",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {entityTotals[entity] || 0}
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
                  textAlign: "right",
                  border: "1px solid #dee2e6",
                }}
              >
                {Object.values(entityTotals).reduce((sum, total) => sum + total, 0)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};