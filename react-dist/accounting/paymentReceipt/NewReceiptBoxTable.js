import React, { useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { NewReceiptBoxModalTable } from "./modalNewReceiptBox/NewReceiptBoxModalTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { cashRecipes, resourcesAdminService } from "../../../services/api/index.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { formatDate } from "../../../services/utilidades.js";
export const NewReceiptBoxTable = () => {
  const [thirdParties, setThirdParties] = useState(null);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [currentReceiptType, setCurrentReceiptType] = useState("advance");
  const [filtros, setFiltros] = useState({
    type: "",
    action: "",
    thirdParty: null,
    createdAt: null,
    status: ""
  });

  // Opciones para los dropdowns
  const tiposRecibo = [{
    label: "Ingreso",
    value: "ingreso"
  }, {
    label: "Egreso",
    value: "egreso"
  }];
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  useEffect(() => {
    fectThirdParties();
  }, []);
  async function fectThirdParties() {
    const data = await resourcesAdminService.getThirdParties();
    setThirdParties(data.data);
  }
  // Función para obtener recibos de caja
  const fetchCashRecipe = async params => {
    try {
      // Aplicar filtros adicionales a los parámetros de paginación
      const filters = {
        ...params,
        type: filtros.type,
        action: filtros.action,
        status: filtros.status,
        createdAt: filtros.createdAt?.filter(date => !!date).map(date => date.toISOString().split("T")[0]).join(","),
        thirdParty: filtros.thirdParty?.id ?? null
      };
      const response = await cashRecipes.getAllCashRecipes(filters);
      return {
        data: response.data.data || response.data,
        // Ajusta según la estructura de tu API
        total: response.data.total || response.data.count || 0
      };
    } catch (error) {
      console.error("Error fetching cash recipes:", error);
      return {
        data: [],
        total: 0
      };
    }
  };
  const {
    data: cashRecipesData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: fetchCashRecipe,
    defaultPerPage: 10
  });
  const limpiarFiltros = () => {
    setFiltros({
      type: "",
      action: "",
      thirdParty: null,
      createdAt: null,
      status: ""
    });
  };
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const generatePrintReceipt = recibo => {
    console.log("Imprimir recibo:", recibo);
    // generarFormatoContable("ReciboCaja", recibo, "Impresion");
  };
  const generateCancelReceipt = recibo => {
    console.log("Anular recibo:", recibo);
  };
  const openModalWithType = type => {
    setCurrentReceiptType(type);
    setShowReciboModal(true);
  };
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
      label: "Imprimir Recibo",
      template: createActionTemplate("receipt", "Imprimir Recibo", "text-green-500"),
      command: () => generatePrintReceipt(rowData)
    }, {
      label: "Anular Recibo Caja",
      template: createActionTemplate("money-bill-transfer", "Anular Recibo Caja", "text-green-500"),
      command: () => generateCancelReceipt(rowData)
    }];
    return /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      menuButtonClassName: "p-button-sm point",
      menuStyle: {
        minWidth: "220px",
        cursor: "pointer"
      }
    });
  };
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "approved":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
      case "Anulado":
        return "danger";
      default:
        return null;
    }
  };
  const getStatusLabel = type => {
    switch (type) {
      case "approved":
        return "Aprobado";
      case "pending":
        return "Pendiente";
      case "cancelled":
        return "Anulado";
      case "completed":
        return "Completado";
      default:
        return null;
    }
  };
  const getTipoSeverity = tipo => {
    switch (tipo) {
      case "ingreso":
        return "success";
      case "egreso":
        return "danger";
      case "reembolso":
        return "info";
      default:
        return null;
    }
  };
  const getAction = action => {
    switch (action) {
      case "partial_payment":
        return "Pago Parcial";
      default:
        return action;
    }
  };

  // Definición de columnas para la tabla
  const columns = [{
    field: "id",
    header: "Número Recibo"
  }, {
    field: "type",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.type,
      severity: getTipoSeverity(rowData.type)
    })
  }, {
    field: "third_party.name",
    header: "Cliente"
  }, {
    field: "action",
    header: "Origen Dinero",
    body: rowData => /*#__PURE__*/React.createElement("span", null, getAction(rowData.action))
  }, {
    field: "created_at",
    header: "Fecha",
    body: data => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, formatDate(data.created_at, true)))
  }, {
    field: "total_amount",
    header: "Valor",
    body: data => /*#__PURE__*/React.createElement("span", null, `$${formatCurrency(data.total_amount)}`)
  }, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(rowData.status),
      severity: getEstadoSeverity(rowData.status)
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: actionBodyTemplate
  }];
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
    label: "Nuevo Recibo de Caja",
    className: "btn btn-primary",
    onClick: () => setShowReciboModal(true)
  })), /*#__PURE__*/React.createElement(Card, {
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-8 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de Recibo"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.type,
    options: tiposRecibo,
    onChange: e => handleFilterChange("type", e.value),
    optionLabel: "label",
    placeholder: "Tipo",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.createdAt,
    onChange: e => handleFilterChange("createdAt", e.value),
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    placeholder: "Rango fechas",
    className: classNames("w-100"),
    showIcon: true,
    readOnlyInput: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.status,
    options: [{
      label: "Aprobado",
      value: "approved"
    }, {
      label: "Pendiente",
      value: "pending"
    }, {
      label: "Completado",
      value: "completed"
    }, {
      label: "Anulado",
      value: "cancelled"
    }],
    onChange: e => handleFilterChange("status", e.value),
    placeholder: "Estado",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Origen"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.action,
    options: [{
      label: "Anticipo",
      value: "advance_payment"
    }, {
      label: "Pago Parcial ",
      value: "partial_payment"
    }, {
      label: "Pago completo",
      value: "full_payment"
    }],
    onChange: e => handleFilterChange("action", e.value),
    placeholder: "Origen",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-8 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Cliente"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.thirdParty,
    options: thirdParties,
    onChange: e => handleFilterChange("thirdParty", e.value),
    optionLabel: "name",
    placeholder: "Cliente",
    className: classNames("w-100")
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar filtros",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar filtro",
    className: "btn btn-primary",
    onClick: refresh,
    loading: loadingPaginator
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Recibos de Caja",
    className: "shadow-2"
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: cashRecipesData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refresh
  })), /*#__PURE__*/React.createElement(NewReceiptBoxModalTable, {
    visible: showReciboModal,
    onHide: () => setShowReciboModal(false),
    receiptType: currentReceiptType,
    onSubmit: data => {
      setShowReciboModal(false);
      refresh(); // Refrescar la tabla después de crear un nuevo recibo
    }
  }));
};