import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { formatDate } from "../../../../services/utilidades.js";
export const AccountingClosingsTable = ({
  closings,
  onEditItem,
  onDeleteItem,
  loading = false
}) => {
  const [filters, setFilters] = useState({
    year: null,
    status: null
  });
  const statusOptions = [{
    label: 'Abierto',
    value: 'open'
  }, {
    label: 'Cerrado',
    value: 'closed'
  }];
  const applyFilters = () => {
    let filtered = [...closings.data];
    if (filters.year) {
      filtered = filtered.filter(c => c.age === filters.year);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    return filtered;
  };
  const clearFilters = () => {
    setFilters({
      year: null,
      status: null
    });
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm",
      onClick: () => onEditItem(rowData.id.toString()),
      tooltip: "Editar",
      tooltipOptions: {
        position: 'top'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-danger p-button-sm",
      onClick: () => onDeleteItem(rowData.id.toString()),
      tooltip: "Eliminar",
      tooltipOptions: {
        position: 'top'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };
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
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "A\xF1o"), /*#__PURE__*/React.createElement(InputText, {
    type: "number",
    value: filters.year?.toString() || '',
    onChange: e => setFilters({
      ...filters,
      year: e.target.value ? parseInt(e.target.value) : null
    }),
    placeholder: "Filtrar por a\xF1o",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.status,
    options: statusOptions,
    onChange: e => setFilters({
      ...filters,
      status: e.value
    }),
    placeholder: "Seleccione estado",
    className: classNames("w-100"),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    className: "p-button-outlined",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: () => {} // Esto activará el filtrado automático
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Per\xEDodos Contables",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: applyFilters(),
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron per\xEDodos contables",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    body: rowData => rowData.status === "open" ? "Abierto" : "Cerrado",
    header: "Estado",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Fecha Inicio",
    body: rowData => formatDate(rowData.start_month),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Fecha Fin",
    body: rowData => formatDate(rowData.end_month),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "warning_days",
    header: "D\xEDas Advertencia",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: "120px"
    },
    exportable: false
  }))));
};