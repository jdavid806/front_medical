import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { useCashRecipes } from "../hooks/useCashReceipts";
import { classNames } from "primereact/utils";
import { FiltrosRecibos, ReciboCaja } from "../interface/interfaceCashRecipe";
import { SplitButton } from "primereact/splitbutton";
import { MenuItem } from "primereact/menuitem";
import { NewReceiptBoxModalTable } from "./modalNewReceiptBox/NewReceiptBoxModalTable"; 
import { generarFormatoContable } from "../../funciones/funcionesJS/generarPDFContable";

export const NewReceiptBoxTable = () => {
  const { recipes, isLoading, error } = useCashRecipes();
  const [recibos, setRecibos] = useState<ReciboCaja[]>([]);
  const [loading, setLoading] = useState(false);
  const [recibosFiltrados, setRecibosFiltrados] = useState<ReciboCaja[]>([]);
  const [showReciboModal, setShowReciboModal] = useState(false);
  // Estado para controlar el tipo de recibo
  const [currentReceiptType, setCurrentReceiptType] = useState<
    "advance" | "purchase" | "quotation"
  >("advance");

  const [filtros, setFiltros] = useState<FiltrosRecibos>({
    numeroRecibo: "",
    tipoRecibo: null,
    cliente: "",
    identificacion: "",
    origenDinero: null,
    centroCosto: null,
    fechaRango: null,
    valorMinimo: null,
    valorMaximo: null,
    estado: null,
  });

  // Opciones para los dropdowns
  const tiposRecibo = [
    { label: "Ingreso", value: "Ingreso" },
    { label: "Egreso", value: "Egreso" },
    { label: "Reembolso", value: "Reembolso" },
  ];

  useEffect(() => {
    if (!isLoading) {
      if (recipes.length > 0) {
        try {
          console.log("recipes", recipes);
          const recibosAdaptados: ReciboCaja[] = recipes.map((recibo: any) => {
            const thirdParty = recibo.includes?.third_party || null;
            const payment = recibo.includes?.payments?.[0] || null;

            return {
              id: String(recibo.id),
              numeroRecibo: `RC-${recibo.id.toString().padStart(4, "0")}`,
              numeroFactura: recibo.invoices?.[0]?.invoice_number ?? undefined,
              tipoRecibo: "Ingreso",
              cliente:
                thirdParty?.name || thirdParty?.full_name || "No asignado",
              identificacion:
                thirdParty?.document_number || "Sin Identificacion",
              origenDinero: payment?.notes || "Sin especificar",
              fechaElaboracion: recibo.attributes?.created_at
                ? new Date(recibo.attributes.created_at)
                : new Date(),
              centroCosto: "Sin asignar",
              valor: parseFloat(payment?.amount || "0"),
              estado:
                recibo.attributes?.status === "pagado"
                  ? "Aprobado"
                  : "Pendiente",
              ...recibo.attributes,
            };
          });
          setRecibos(recibosAdaptados);
          setRecibosFiltrados(recibosAdaptados);
        } catch (error) {
          console.error("Error al transformar los datos:", error);
        }
      } else {
        setRecibos([]);
        setRecibosFiltrados([]);
      }
    }
  }, [recipes, isLoading]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    setLoading(true);
    let resultados = [...recibos];

    if (filtros.numeroRecibo) {
      resultados = resultados.filter((recibo) =>
        recibo.numeroRecibo
          .toLowerCase()
          .includes(filtros.numeroRecibo.toLowerCase())
      );
    }

    if (filtros.tipoRecibo) {
      resultados = resultados.filter(
        (recibo) => recibo.tipoRecibo === filtros.tipoRecibo
      );
    }

    if (filtros.fechaRango && filtros.fechaRango[0] && filtros.fechaRango[1]) {
      const fechaInicio = new Date(filtros.fechaRango[0]);
      const fechaFin = new Date(filtros.fechaRango[1]);
      fechaFin.setHours(23, 59, 59, 999);

      resultados = resultados.filter((recibo) => {
        const fechaRecibo = new Date(recibo.fechaElaboracion);
        return fechaRecibo >= fechaInicio && fechaRecibo <= fechaFin;
      });
    }

    if (filtros.cliente) {
      resultados = resultados.filter((recibo) =>
        recibo.cliente.toLowerCase().includes(filtros.cliente.toLowerCase())
      );
    }

    if (filtros.estado) {
      resultados = resultados.filter(
        (recibo) => recibo.estado === filtros.estado
      );
    }

    if (filtros.valorMinimo) {
      resultados = resultados.filter(
        (recibo) => recibo.valor >= filtros.valorMinimo!
      );
    }

    if (filtros.valorMaximo) {
      resultados = resultados.filter(
        (recibo) => recibo.valor <= filtros.valorMaximo!
      );
    }

    setRecibosFiltrados(resultados);
    setLoading(false);
  };

  const limpiarFiltros = () => {
    setFiltros({
      numeroRecibo: "",
      tipoRecibo: null,
      cliente: "",
      identificacion: "",
      origenDinero: null,
      centroCosto: null,
      fechaRango: null,
      valorMinimo: null,
      valorMaximo: null,
      estado: null,
    });
    setRecibosFiltrados(recibos);
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

  const generatePrintReceipt = (recibo) => {
    // generarFormatoContable("ReciboCaja", recibo, "Impresion");
  };

  const generateCancelReceipt = (recibo) => {
    console.log("recibo", recibo);
  };

  const openModalWithType = (type: "advance" | "purchase" | "quotation") => {
    setCurrentReceiptType(type);
    setShowReciboModal(true);
  };

  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }} // Agrega el cursor pointer aquí
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    const items: MenuItem[] = [
      {
        label: "Imprimir Recibo",
        template: createActionTemplate(
          "receipt",
          "Imprimir Recibo",
          "text-green-500"
        ),
        command: () => generatePrintReceipt(rowData),
      },
      {
        label: "Anular Recibo Caja",
        template: createActionTemplate(
          "money-bill-transfer",
          "Anular Recibo Caja",
          "text-green-500"
        ),
        command: () => generateCancelReceipt(rowData),
      },
    ];

    return (
      <SplitButton
        label="Acciones"
        model={items}
        severity="contrast"
        className="p-button-sm point"
        buttonClassName="p-button-sm"
        menuButtonClassName="p-button-sm point"
        menuStyle={{ minWidth: "220px", cursor: "pointer" }}
      />
    );
  };

  const getEstadoSeverity = (estado: string) => {
    switch (estado) {
      case "Aprobado":
      case "Conciliado":
        return "success";
      case "Pendiente":
        return "warning";
      case "Rechazado":
      case "Anulado":
        return "danger";
      default:
        return null;
    }
  };

  const getTipoSeverity = (tipo: string) => {
    switch (tipo) {
      case "Ingreso":
        return "success";
      case "Egreso":
        return "danger";
      case "Reembolso":
        return "info";
      default:
        return null;
    }
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

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
          label="Nuevo Recibo de Caja"
          className="btn btn-primary"
          onClick={() => setShowReciboModal(true)}
        />
      </div>

      {/* Card de Filtros - Estilo mejorado */}
      <Card style={styles.card}>
        <div className="row g-3">
          {/* Tipo de Recibo */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Tipo de Recibo</label>
            <Dropdown
              value={filtros.tipoRecibo}
              options={tiposRecibo}
              onChange={(e) => handleFilterChange("tipoRecibo", e.value)}
              optionLabel="label"
              placeholder="Tipo"
              className={classNames("w-100")}
            />
          </div>

          {/* Rango de fechas */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Rango de fechas</label>
            <Calendar
              value={filtros.fechaRango}
              onChange={(e) => handleFilterChange("fechaRango", e.value)}
              selectionMode="range"
              dateFormat="dd/mm/yy"
              placeholder="Rango fechas"
              className={classNames("w-100")}
              showIcon
              readOnlyInput
            />
          </div>

          {/* Estado */}
          <div className="col-md-8 col-lg-3">
            <label style={styles.formLabel}>Estado</label>
            <Dropdown
              value={filtros.estado}
              options={[
                { label: "Aprobado", value: "Aprobado" },
                { label: "Pendiente", value: "Pendiente" },
                { label: "Anulado", value: "Anulado" },
              ]}
              onChange={(e) => handleFilterChange("estado", e.value)}
              placeholder="Estado"
              className={classNames("w-100")}
            />
          </div>

          {/* Botones compactos */}
          <div className="col-12 d-flex justify-content-end gap-2">
            <Button
              label="Limpiar filtros"
              className="btn btn-phoenix-secondary"
              onClick={limpiarFiltros}
            />
            <Button
              label="Aplicar filtro"
              className="btn btn-primary"
              onClick={aplicarFiltros}
              loading={loading}
            />
          </div>
        </div>
      </Card>

      {/* Tabla de resultados */}
      <Card title="Recibos de Caja" className="shadow-2">
        <DataTable
          value={recibosFiltrados}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron recibos"
          responsiveLayout="scroll"
        >
          <Column field="numeroRecibo" header="No. Recibo" sortable />
          <Column
            field="tipoRecibo"
            header="Tipo"
            sortable
            body={(rowData) => (
              <Tag
                value={rowData.tipoRecibo}
                severity={getTipoSeverity(rowData.tipoRecibo)}
              />
            )}
          />
          <Column field="cliente" header="Cliente" sortable />
          <Column field="identificacion" header="Identificación" sortable />
          {/* <Column field="numeroFactura" header="No. Factura" sortable /> */}
          <Column field="origenDinero" header="Origen Dinero" sortable />
          <Column field="centroCosto" header="Centro Costo" sortable />
          <Column
            field="fechaElaboracion"
            header="Fecha"
            sortable
            body={(rowData) => formatDate(rowData.fechaElaboracion)}
          />
          <Column
            field="valor"
            header="Valor"
            sortable
            body={(rowData) => formatCurrency(rowData.valor)}
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
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "100px" }}
            exportable={false}
          />
        </DataTable>
      </Card>

      {/* Modal para nuevo recibo */}
      <NewReceiptBoxModalTable
        visible={showReciboModal}
        onHide={() => setShowReciboModal(false)}
        receiptType={currentReceiptType}
        onSubmit={(data) => {
          setShowReciboModal(false);
        }}
      />
    </div>
  );
};
