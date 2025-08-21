import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
export const EntitiesConfiTable = ({
  onEditItem,
  entities = [],
  loading = false,
  onDeleteItem
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState(null);
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [filtros, setFiltros] = useState({
    name: "",
    document_type: null,
    city_id: ""
  });
  const documentTypes = [{
    label: "Cédula de Ciudadanía",
    value: "CC"
  }, {
    label: "NIT",
    value: "NIT"
  }, {
    label: "Cédula de Extranjería",
    value: "CE"
  }, {
    label: "Pasaporte",
    value: "PASSPORT"
  }, {
    label: "Tarjeta de Identidad",
    value: "TI"
  }, {
    label: "RNC",
    value: "RNC"
  }];
  useEffect(() => {
    setFilteredEntities(entities);
  }, [entities]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...entities];
    if (filtros.name) {
      result = result.filter(entity => entity.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.document_type) {
      result = result.filter(entity => entity.document_type === filtros.document_type);
    }
    setFilteredEntities(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      document_type: null,
      city_id: ""
    });
    setFilteredEntities(entities);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-pen"
      }),
      className: "p-button-rounded p-button-text p-button-sm",
      onClick: () => onEditItem && onEditItem(rowData.id.toString())
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-trash"
      }),
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: () => confirmDelete(rowData)
    }));
  };
  const documentTypeBodyTemplate = rowData => {
    const type = documentTypes.find(doc => doc.value === rowData.document_type);
    return type ? type.label : rowData.document_type;
  };
  const confirmDelete = entity => {
    setEntityToDelete(entity);
    setDeleteDialogVisible(true);
  };
  const deleteEntity = () => {
    if (entityToDelete && onDeleteItem) {
      onDeleteItem(entityToDelete.id.toString());
      showToast("success", "Éxito", `Entidad ${entityToDelete.name} eliminada`);
    }
    setDeleteDialogVisible(false);
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: deleteEntity
  }));
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
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#f8bb86"
    }
  }), entityToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar la entidad ", /*#__PURE__*/React.createElement("b", null, entityToDelete.name), "? Esta acci\xF3n no se puede deshacer."))), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.name,
    onChange: e => handleFilterChange("name", e.target.value),
    placeholder: "Buscar por nombre",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de Documento"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.document_type,
    options: documentTypes,
    onChange: e => handleFilterChange("document_type", e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: classNames("w-100"),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Configuraci\xF3n de Entidades",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredEntities,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron entidades",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "document_type",
    header: "Tipo Documento",
    sortable: true,
    body: documentTypeBodyTemplate,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "document_number",
    header: "N\xFAmero Documento",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "email",
    header: "Email",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "phone",
    header: "Tel\xE9fono",
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