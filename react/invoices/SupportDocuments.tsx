import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

interface DocumentoSoporte {
  id: string;
  numeroDocumento: string;
  tipoDocumento: string;
  producto: string;
  identificacion: string;
  cliente: string;
  fechaDocumento: Date;
  valorTotal: number;
  estado: string;
}

interface FiltrosDocumentos {
  numeroDocumento: string;
  producto: string;
  identificacion: string;
  cliente: string;
  rangoFechas: Date[] | null;
}

export const SupportDocuments = () => {
  const [documentos, setDocumentos] = useState<DocumentoSoporte[]>([]);
  const [documentosFiltrados, setDocumentosFiltrados] = useState<
    DocumentoSoporte[]
  >([]);
  const [loading, setLoading] = useState(false);

  const [filtros, setFiltros] = useState<FiltrosDocumentos>({
    numeroDocumento: "",
    producto: "",
    identificacion: "",
    cliente: "",
    rangoFechas: null,
  });

  const tiposDocumento = [
    { label: "Factura", value: "Factura" },
    { label: "Nota de Crédito", value: "Nota de Crédito" },
    { label: "Nota de Débito", value: "Nota de Débito" },
    { label: "Comprobante", value: "Comprobante" },
    { label: "Recibo", value: "Recibo" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const datosMock: DocumentoSoporte[] = [
        {
          id: "1",
          numeroDocumento: "DS-001-0000001",
          tipoDocumento: "Factura",
          producto: "Laptop HP EliteBook",
          identificacion: "131246375",
          cliente: "Distribuidora Pérez S.A.",
          fechaDocumento: new Date(2023, 0, 15),
          valorTotal: 125000,
          estado: "Aprobado",
        },
        {
          id: "2",
          numeroDocumento: "DS-001-0000002",
          tipoDocumento: "Nota de Crédito",
          producto: "Teclado inalámbrico",
          identificacion: "101584796",
          cliente: "Supermercado Nacional",
          fechaDocumento: new Date(2023, 0, 16),
          valorTotal: 8750,
          estado: "Pendiente",
        },
        {
          id: "3",
          numeroDocumento: "DS-001-0000003",
          tipoDocumento: "Comprobante",
          producto: "Servicio de mantenimiento",
          identificacion: "130456892",
          cliente: "Farmacia Carol",
          fechaDocumento: new Date(2023, 0, 18),
          valorTotal: 45600,
          estado: "Rechazado",
        },
        {
          id: "4",
          numeroDocumento: "DS-001-0000004",
          tipoDocumento: "Recibo",
          producto: "Impresora LaserJet",
          identificacion: "101234567",
          cliente: "Tiendas Bravo",
          fechaDocumento: new Date(2023, 1, 2),
          valorTotal: 210000,
          estado: "Aprobado",
        },
        {
          id: "5",
          numeroDocumento: "DS-001-0000005",
          tipoDocumento: "Nota de Débito",
          producto: "Mouse ergonómico",
          identificacion: "131987654",
          cliente: "Restaurante El Conuco",
          fechaDocumento: new Date(2023, 1, 5),
          valorTotal: 6890,
          estado: "Aprobado",
        },
        {
          id: "6",
          numeroDocumento: "DS-001-0000006",
          tipoDocumento: "Factura",
          producto: 'Monitor 24" Full HD',
          identificacion: "101112131",
          cliente: "Hotel Jaragua",
          fechaDocumento: new Date(2023, 1, 10),
          valorTotal: 315000,
          estado: "Pendiente",
        },
        {
          id: "7",
          numeroDocumento: "DS-001-0000007",
          tipoDocumento: "Comprobante",
          producto: "Licencia de software",
          identificacion: "130987654",
          cliente: "Distribuidora Olivo",
          fechaDocumento: new Date(2023, 1, 15),
          valorTotal: 78500,
          estado: "Aprobado",
        },
      ];
      setDocumentos(datosMock);
      setDocumentosFiltrados(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (field: keyof FiltrosDocumentos, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    setLoading(true);

    let resultados = [...documentos];

    // Filtro por número de documento
    if (filtros.numeroDocumento) {
      resultados = resultados.filter((doc) =>
        doc.numeroDocumento
          .toLowerCase()
          .includes(filtros.numeroDocumento.toLowerCase())
      );
    }

    // Filtro por producto
    if (filtros.producto) {
      resultados = resultados.filter((doc) =>
        doc.producto.toLowerCase().includes(filtros.producto.toLowerCase())
      );
    }

    // Filtro por identificación
    if (filtros.identificacion) {
      resultados = resultados.filter((doc) =>
        doc.identificacion.includes(filtros.identificacion)
      );
    }

    // Filtro por cliente
    if (filtros.cliente) {
      resultados = resultados.filter((doc) =>
        doc.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
      );
    }

    // Filtro por rango de fechas
    if (filtros.rangoFechas && filtros.rangoFechas.length === 2) {
      const [inicio, fin] = filtros.rangoFechas;
      resultados = resultados.filter((doc) => {
        const fechaDoc = new Date(doc.fechaDocumento);
        return fechaDoc >= inicio && fechaDoc <= fin;
      });
    }

    setTimeout(() => {
      setDocumentosFiltrados(resultados);
      setLoading(false);
    }, 300);
  };

  const limpiarFiltros = () => {
    setFiltros({
      numeroDocumento: "",
      producto: "",
      identificacion: "",
      cliente: "",
      rangoFechas: null,
    });
    setDocumentosFiltrados(documentos);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (value: Date) => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getEstadoSeverity = (estado: string) => {
    switch (estado) {
      case "Aprobado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Rechazado":
        return "danger";
      default:
        return null;
    }
  };

  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  return (
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Documento Soporte"
          icon="pi pi-file-edit"
          className="btn btn-primary"
          onClick={() => (window.location.href = "DocumentoSoporte")}
        />
      </div>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Número de documento */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Número de documento</label>
            <InputText
              value={filtros.numeroDocumento}
              onChange={(e) =>
                handleFilterChange("numeroDocumento", e.target.value)
              }
              placeholder="DS-001-0000001"
              className="w-100"
            />
          </div>

          {/* Filtro: Producto */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Producto/Servicio</label>
            <InputText
              value={filtros.producto}
              onChange={(e) => handleFilterChange("producto", e.target.value)}
              placeholder="Nombre del producto o servicio"
              className="w-100"
            />
          </div>

          {/* Filtro: Identificación */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Identificación</label>
            <InputText
              value={filtros.identificacion}
              onChange={(e) =>
                handleFilterChange("identificacion", e.target.value)
              }
              placeholder="RNC/Cédula del cliente"
              className="w-100"
            />
          </div>

          {/* Filtro: Cliente */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Cliente</label>
            <InputText
              value={filtros.cliente}
              onChange={(e) => handleFilterChange("cliente", e.target.value)}
              placeholder="Nombre del cliente"
              className="w-100"
            />
          </div>

          {/* Filtro: Rango de fechas */}
          <div className="col-md-6 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
            <Calendar
              value={filtros.rangoFechas}
              onChange={(e) => handleFilterChange("rangoFechas", e.value)}
              selectionMode="range"
              readOnlyInput
              dateFormat="dd/mm/yy"
              placeholder="Seleccione rango de fechas"
              className="w-100"
              showIcon
            />
          </div>

          {/* Botones de acción */}
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar"
              icon="pi pi-trash"
              className="btn btn-phoenix-secondary"
              onClick={limpiarFiltros}
            />
            <Button
              label="Aplicar Filtros"
              icon="pi pi-filter"
              className="btn btn-primary"
              onClick={aplicarFiltros}
              loading={loading}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Documentos Soporte" style={styles.card}>
        <DataTable
          value={documentosFiltrados}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron documentos"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="numeroDocumento"
            header="No. Documento"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="tipoDocumento"
            header="Tipo"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="producto"
            header="Producto"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="identificacion"
            header="Identificación"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="cliente"
            header="Cliente"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="fechaDocumento"
            header="Fecha"
            sortable
            body={(rowData) => formatDate(rowData.fechaDocumento)}
            style={styles.tableCell}
          />
          <Column
            field="valorTotal"
            header="Valor Total"
            sortable
            body={(rowData) => formatCurrency(rowData.valorTotal)}
            style={styles.tableCell}
          />
          <Column
            field="estado"
            header="Estado"
            sortable
            body={(rowData) => (
              <Tag
                value={rowData.estado}
                severity={getEstadoSeverity(rowData.estado)}
              />
            )}
            style={styles.tableCell}
          />
        </DataTable>
      </Card>
    </div>
  );
};
