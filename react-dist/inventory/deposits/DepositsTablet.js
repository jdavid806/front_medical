import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
import DepositModal from "./modal/DepositModal.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { depositService } from "../../../services/api/index.js";
export const DepositsTablet = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [depositoEditando, setDepositoEditando] = useState(null);
  const convertDepositoToFormInputs = deposito => {
    if (!deposito) return null;
    return {
      name: deposito.attributes.name || "",
      notes: deposito.attributes.notes || ""
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
  const abrirEditarDeposito = deposito => {
    setDepositoEditando(deposito);
    setMostrarModal(true);
  };
  const cerrarModal = () => {
    setMostrarModal(false);
    setDepositoEditando(null);
  };

  // Guardar depósito (crear o actualizar)
  const guardarDeposito = async formData => {
    try {
      if (depositoEditando?.id) {
        await depositService.update(depositoEditando?.id, formData);
        SwalManager.success({
          title: "Deposito actualizado"
        });
      } else {
        await depositService.create(formData);
        SwalManager.success({
          title: "Deposito creado"
        });
      }
    } catch (error) {
      console.error("Error creating/updating deposit: ", error);
    } finally {
      await fetchDeposits();
    }
  };

  // Eliminar depósito
  const eliminarDeposito = async id => {
    await depositService.delete(id);
    SwalManager.error({
      title: "Deposito Eliminado"
    });
    await fetchDeposits();
  };

  // Acciones para la tabla
  const createActionTemplate = (icon, label, colorClass = "") => {
    return () => /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2 p-2 point",
      style: {
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${icon} ${colorClass}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  };
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Editar",
      template: createActionTemplate("edit", "Editar", "text-blue-500"),
      command: () => abrirEditarDeposito(rowData)
    }, {
      label: "Eliminar",
      template: createActionTemplate("trash", "Eliminar", "text-red-500"),
      command: () => eliminarDeposito(rowData.id)
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      onClick: () => abrirEditarDeposito(rowData)
    }));
  };

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Dep\xF3sito",
    icon: "pi pi-plus",
    className: "btn btn-primary",
    onClick: abrirNuevoDeposito
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Dep\xF3sitos",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: deposits,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron dep\xF3sitos",
    currentPageReportTemplate: "Mostrando {first} a {last} de {totalRecords} dep\xF3sitos",
    paginatorTemplate: "FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true,
    style: {
      width: "80px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.name",
    header: "Nombre Deposito",
    sortable: true,
    filter: true,
    filterPlaceholder: "Buscar por nombre"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.notes",
    header: "Notas",
    sortable: true,
    filter: true,
    filterPlaceholder: "Buscar en notas"
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    exportable: false,
    style: {
      width: "100px"
    }
  }))), /*#__PURE__*/React.createElement(DepositModal, {
    isVisible: mostrarModal,
    onSave: guardarDeposito,
    initialData: convertDepositoToFormInputs(depositoEditando),
    onClose: cerrarModal,
    closable: true
  }));
};