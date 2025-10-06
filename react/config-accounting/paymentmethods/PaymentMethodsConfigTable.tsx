import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { classNames } from "primereact/utils";

interface PaymentMethod {
  id: number;
  name: string;
  category: string;
  additionalDetails: string;
}

interface Filtros {
  name: string;
  category: string | null;
}

type ToastSeverity =
  | "info"
  | "success"
  | "warn"
  | "error"
  | "secondary"
  | "contrast";

export const PaymentMethodsConfig = () => {
  const toast = useRef<Toast>(null);

  // Estado para la tabla
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Estado para filtros
  const [filtros, setFiltros] = useState<Filtros>({
    name: "",
    category: null,
  });

  // Categorías predefinidas
  const categories = [
    { label: "Efectivo", value: "cash" },
    { label: "Tarjeta", value: "card" },
    { label: "Transferencia", value: "transfer" },
    { label: "Cheque", value: "check" },
    { label: "Otro", value: "other" },
  ];

  useEffect(() => {
    // Simulación de carga de datos
    const loadPaymentMethods = async () => {
      try {
        setLoading(true);
        // Aquí iría la llamada a la API real
        // const data = await fetchPaymentMethods();

        // Datos de ejemplo
        const mockData: PaymentMethod[] = [
          {
            id: 1,
            name: "Efectivo RD$",
            category: "cash",
            additionalDetails: "Pagos en efectivo en moneda local",
          },
          {
            id: 2,
            name: "Efectivo US$",
            category: "cash",
            additionalDetails: "Pagos en efectivo en dólares",
          },
          {
            id: 3,
            name: "Tarjeta Visa",
            category: "card",
            additionalDetails: "Pagos con tarjeta Visa",
          },
          {
            id: 4,
            name: "Transferencia Bancaria",
            category: "transfer",
            additionalDetails: "Transferencias desde cualquier banco",
          },
          {
            id: 5,
            name: "Cheque",
            category: "check",
            additionalDetails: "Cheques a nombre de la empresa",
          },
        ];

        setPaymentMethods(mockData);
        setFilteredMethods(mockData);
      } catch (error) {
        showToast(
          "error",
          "Error",
          "No se pudieron cargar los métodos de pago"
        );
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, []);

  // Manejadores de filtros
  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const aplicarFiltros = () => {
    let result = [...paymentMethods];

    // Filtro por nombre
    if (filtros.name) {
      result = result.filter((method) =>
        method.name.toLowerCase().includes(filtros.name.toLowerCase())
      );
    }

    // Filtro por categoría
    if (filtros.category) {
      result = result.filter((method) => method.category === filtros.category);
    }

    setFilteredMethods(result);
  };

  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      category: null,
    });
    setFilteredMethods(paymentMethods);
  };

  const showToast = (
    severity: ToastSeverity,
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const getCategoryLabel = (category: string) => {
    const found = categories.find((c) => c.value === category);
    return found ? found.label : category;
  };

  // Acciones para cada fila
  const actionBodyTemplate = (rowData: PaymentMethod) => {
    return (
      <div className="flex gap-2">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-sm p-button-text"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => editMethod(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-sm p-button-text p-button-danger"
          tooltip="Eliminar"
          tooltipOptions={{ position: "top" }}
          onClick={() => confirmDelete(rowData)}
        />
      </div>
    );
  };

  const editMethod = (method: PaymentMethod) => {
    showToast("info", "Editar", `Editando método: ${method.name}`);
    // Aquí iría la lógica para abrir el modal de edición
  };

  const confirmDelete = (method: PaymentMethod) => {
    showToast("warn", "Eliminar", `¿Seguro que desea eliminar ${method.name}?`);
    // Aquí iría la lógica para confirmar y eliminar
  };

  const addNewMethod = () => {
    showToast("info", "Nuevo", "Agregando nuevo método de pago");
    
  };

  // Estilos
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
      <Toast ref={toast} />

      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Método"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={addNewMethod}
        />
      </div>

      <Card title="Filtros de Búsqueda" style={styles.card}>
        <div className="row g-3">
          {/* Filtro: Nombre */}
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Nombre del Método</label>
            <InputText
              value={filtros.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              placeholder="Buscar por nombre"
              className={classNames("w-100")}
            />
          </div>

          {/* Filtro: Categoría */}
          <div className="col-md-6 col-lg-4">
            <label style={styles.formLabel}>Categoría</label>
            <Dropdown
              value={filtros.category}
              options={categories}
              onChange={(e) => handleFilterChange("category", e.value)}
              optionLabel="label"
              placeholder="Seleccione categoría"
              className={classNames("w-100")}
              showClear
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
      <Card title="Métodos de Pago" style={styles.card}>
        <DataTable
          value={filteredMethods}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron métodos de pago"
          responsiveLayout="scroll"
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column
            field="name"
            header="Nombre del Método"
            sortable
            style={styles.tableCell}
          />
          <Column
            field="category"
            header="Categoría"
            sortable
            body={(rowData) => getCategoryLabel(rowData.category)}
            style={styles.tableCell}
          />

          <Column
            field="additionalDetails"
            header="Detalles Adicionales"
            style={styles.tableCell}
            body={(rowData) => (
              <span title={rowData.additionalDetails}>
                {rowData.additionalDetails.length > 30
                  ? `${rowData.additionalDetails.substring(0, 30)}...`
                  : rowData.additionalDetails}
              </span>
            )}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "120px" }}
            exportable={false}
          />
        </DataTable>
      </Card>
    </div>
  );
};
