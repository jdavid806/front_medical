import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Menu } from "primereact/menu";
import { SplitButton } from "primereact/splitbutton";
import { Deposito, FiltrosDepositos } from "./ts/depositsType";
import DepositModal from "./modal/DepositModal";
import { DepositFormInputs } from "./ts/depositFormType";
import { SwalManager } from "../../../services/alertManagerImported";
import { depositService } from "../../../services/api";
export const DepositsTablet = () => {
  const [deposits, setDeposits] = useState<Deposito[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [depositoEditando, setDepositoEditando] = useState<any>(null);

  const convertDepositoToFormInputs = (
    deposito: Partial<any>
  ): DepositFormInputs | null => {
    if (!deposito) return null;

    return {
      name: deposito.attributes.name || "",
      notes: deposito.attributes.notes || "",
    };
  };

  // Simular carga de datos
  useEffect(() => {
    fetchDeposits();
  }, []);

  async function fetchDeposits() {
    const response = await depositService.getAll();
    setDeposits(response.data);
  }

  const abrirNuevoDeposito = () => {
    setDepositoEditando(null);
    setMostrarModal(true);
  };

  const abrirEditarDeposito = (deposito: Deposito) => {
    setDepositoEditando(deposito);
    setMostrarModal(true);
  };
  const cerrarModal = () => {
    setMostrarModal(false);
    setDepositoEditando(null);
  };

  // Guardar depósito (crear o actualizar)
  const guardarDeposito = async (formData: Partial<Deposito>) => {
    try {
      if (depositoEditando?.id) {
        await depositService.update(depositoEditando?.id, formData);
        SwalManager.success({
          title: "Deposito actualizado",
        });
      } else {
        await depositService.create(formData);
        SwalManager.success({
          title: "Deposito creado",
        });
      }
    } catch (error) {
      console.error("Error creating/updating deposit: ", error);
    } finally {
      await fetchDeposits();
    }
  };

  // Eliminar depósito
  const eliminarDeposito = async (id: number) => {
    await depositService.delete(id);
    SwalManager.error({
      title: "Deposito Eliminado",
    });
    await fetchDeposits();
  };

  // Acciones para la tabla
  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }}
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Deposito) => {
    const items = [
      {
        label: "Editar",
        template: createActionTemplate("edit", "Editar", "text-blue-500"),
        command: () => abrirEditarDeposito(rowData),
      },
      {
        label: "Eliminar",
        template: createActionTemplate("trash", "Eliminar", "text-red-500"),
        command: () => eliminarDeposito(rowData.id),
      },
    ];

    return (
      <div className="flex gap-2">
        <SplitButton
          label="Acciones"
          model={items}
          severity="contrast"
          className="p-button-sm point"
          buttonClassName="p-button-sm"
          onClick={() => abrirEditarDeposito(rowData)}
        />
      </div>
    );
  };

  // Estilos integrados
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
          label="Nuevo Depósito"
          icon="pi pi-plus"
          className="btn btn-primary"
          onClick={abrirNuevoDeposito}
        />
      </div>

      {/* Tabla de depósitos */}
      <Card title="Depósitos" style={styles.card}>
        <DataTable
          value={deposits}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={loading}
          className="p-datatable-striped p-datatable-gridlines"
          emptyMessage="No se encontraron depósitos"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} depósitos"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
          <Column field="id" header="ID" sortable style={{ width: "80px" }} />
          <Column
            field="attributes.name"
            header="Nombre Deposito"
            sortable
            filter
            filterPlaceholder="Buscar por nombre"
          />
          <Column
            field="attributes.notes"
            header="Notas"
            sortable
            filter
            filterPlaceholder="Buscar en notas"
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            exportable={false}
            style={{ width: "100px" }}
          />
        </DataTable>
      </Card>

      <DepositModal
        isVisible={mostrarModal}
        onSave={guardarDeposito}
        initialData={convertDepositoToFormInputs(depositoEditando)}
        onClose={cerrarModal}
        closable={true}
      />
    </div>
  );
};
