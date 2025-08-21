import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
export const TaxConfigTable = ({
  onEditItem,
  loading = false,
  onDeleteItem
}) => {
  const toast = useRef(null);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [filteredTaxes, setFilteredTaxes] = useState([]);
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
  }];

  // useEffect(() => {
  //     setFilteredTaxes(taxes);
  // }, [taxes]);

  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    let result = [...taxes];
    if (filtros.name) {
      result = result.filter(tax => tax.name.toLowerCase().includes(filtros.name.toLowerCase()));
    }
    if (filtros.document_type) {
      result = result.filter(tax => tax.document_type === filtros.document_type);
    }
    if (filtros.city_id) {
      result = result.filter(tax => tax.city_id.toLowerCase().includes(filtros.city_id.toLowerCase()));
    }
    setFilteredTaxes(result);
  };
  const limpiarFiltros = () => {
    setFiltros({
      name: "",
      document_type: null,
      city_id: ""
    });
    setFilteredTaxes(taxes);
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
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
      onClick: () => editTax(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: () => confirmDelete(rowData)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };
  const editTax = tax => {
    if (onEditItem) {
      onEditItem(tax.id.toString());
    }
    showToast("info", "Editar", `Editando impuesto: ${tax.name}`);
  };
  const confirmDelete = tax => {
    setTaxToDelete(tax);
    setDeleteDialogVisible(true);
  };
  const deleteTax = () => {
    if (taxToDelete && onDeleteItem) {
      onDeleteItem(taxToDelete.id.toString());
      showToast("success", "Éxito", `Impuesto ${taxToDelete.name} eliminado`);
    }
    setDeleteDialogVisible(false);
    setTaxToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    className: "p-button-danger",
    onClick: deleteTax
  }));
  const getDocumentTypeLabel = value => {
    const type = documentTypes.find(doc => doc.value === value);
    return type ? type.label : value;
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
  }), taxToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar el impuesto ", /*#__PURE__*/React.createElement("b", null, taxToDelete.name), "? Esta acci\xF3n no se puede deshacer."))), /*#__PURE__*/React.createElement(Card, {
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
    className: "w-100"
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
    className: "w-100",
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Ciudad"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.city_id,
    onChange: e => handleFilterChange("city_id", e.target.value),
    placeholder: "Buscar por ciudad",
    className: "w-100"
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
    title: "Configuraci\xF3n de Impuestos",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredTaxes,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron impuestos",
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
    body: rowData => getDocumentTypeLabel(rowData.document_type),
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
    field: "city_id",
    header: "Ciudad",
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