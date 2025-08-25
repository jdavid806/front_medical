import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { TabView, TabPanel } from "primereact/tabview";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { Badge } from "primereact/badge";
import { useActiveFixed } from "../hooks/useActiveFixed.js";
export const DepreciationHistoryTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [filteredMaintenanceRecords, setFilteredMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [maintenanceDateRange, setMaintenanceDateRange] = useState(null);
  const [changeTypeFilter, setChangeTypeFilter] = useState(null);
  const [maintenanceTypeFilter, setMaintenanceTypeFilter] = useState(null);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  //traer el servicion de activo fijos
  const {
    getActiveFixed,
    loading: loadingActiveFixed,
    error: errorActiveFixed,
    success: successActiveFixed
  } = useActiveFixed();
  const statusOptions = [{
    label: "Activo",
    value: "active"
  }, {
    label: "Inactivo",
    value: "inactive"
  }, {
    label: "En Mantenimiento",
    value: "maintenance"
  }, {
    label: "Dado de Baja",
    value: "disposed"
  }];
  const formatProductToDepreciation = product => {
    return [{
      id: product.id.toString(),
      assetId: product.id.toString(),
      assetName: product.name,
      internalCode: product.reference ?? `PRD-${product.id}`,
      date: product.created_at ? new Date(product.created_at) : new Date(),
      previousValue: product.purchase_price ?? 0,
      newValue: product.sale_price ?? 0,
      changeAmount: (product.sale_price ?? 0) - (product.purchase_price ?? 0),
      changeType: (product.sale_price ?? 0) >= (product.purchase_price ?? 0) ? "appreciation" : "depreciation",
      changePercentage: product.purchase_price && product.purchase_price > 0 ? ((product.sale_price || 0) - product.purchase_price) / product.purchase_price * 100 : 0,
      notes: product.description ?? ""
    }];
  };
  const formatProductToMaintenance = product => {
    return [{
      id: product.id.toString(),
      assetId: product.id.toString(),
      assetName: product.name,
      internalCode: product.reference ?? `PRD-${product.id}`,
      maintenanceDate: product.maintenance_date ?? new Date(),
      maintenanceType: product.maintenance_type ?? "preventive",
      maintenanceCost: product.maintenance_cost ?? 0,
      statusBefore: product.status_before ?? "active",
      statusAfter: product.status_after ?? "active",
      assignedToBefore: product.assigned_to_before ?? "",
      assignedToAfter: product.assigned_to_after ?? "",
      nextMaintenanceDate: product.next_maintenance_date ?? new Date(),
      comments: product.comments ?? ""
    }];
  };
  useEffect(() => {
    console.log("useEffect");
    const loadData = async () => {
      try {
        setLoading(true);
        const products = await getActiveFixed();
        console.log("products", products);

        // Procesar todos los productos
        const depreciationData = [];
        const maintenanceData = [];

        // Si products es un array, procesamos cada producto
        if (Array.isArray(products)) {
          products.forEach(product => {
            depreciationData.push(...formatProductToDepreciation(product));
            maintenanceData.push(...formatProductToMaintenance(product));
          });
        } else if (products) {
          // Si es un solo producto
          depreciationData.push(...formatProductToDepreciation(products));
          maintenanceData.push(...formatProductToMaintenance(products));
        }
        setRecords(depreciationData);
        setFilteredRecords(depreciationData);
        setMaintenanceRecords(maintenanceData);
        setFilteredMaintenanceRecords(maintenanceData);
      } catch (error) {
        console.error("Error cargando productos:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  const formatCurrency = value => {
    try {
      return new Intl.NumberFormat("es-DO", {
        style: "currency",
        currency: "DOP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      // Fallback if Intl.NumberFormat is not supported
      return `DOP $${value.toFixed(2)}`;
    }
  };
  const formatDate = value => {
    if (!value) return "N/A";
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const getChangeTypeSeverity = type => {
    return type === "depreciation" ? "danger" : "success";
  };
  const getChangeTypeLabel = type => {
    return type === "depreciation" ? "Depreciación" : "Apreciación";
  };
  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = [...records];
      let filteredMaintenance = [...maintenanceRecords];

      // Filtros para depreciación
      if (dateRange && dateRange.length === 2) {
        const [start, end] = dateRange;
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= start && recordDate <= end;
        });
      }
      if (changeTypeFilter) {
        filtered = filtered.filter(record => record.changeType === changeTypeFilter);
      }

      // Filtros para mantenimiento
      if (maintenanceDateRange && maintenanceDateRange.length === 2) {
        const [start, end] = maintenanceDateRange;
        filteredMaintenance = filteredMaintenance.filter(record => {
          const recordDate = new Date(record.maintenanceDate);
          return recordDate >= start && recordDate <= end;
        });
      }
      if (maintenanceTypeFilter) {
        filteredMaintenance = filteredMaintenance.filter(record => record.maintenanceType === maintenanceTypeFilter);
      }
      setFilteredRecords(filtered);
      setFilteredMaintenanceRecords(filteredMaintenance);
      setLoading(false);
    }, 300);
  };
  const clearFilters = () => {
    setDateRange(null);
    setMaintenanceDateRange(null);
    setChangeTypeFilter(null);
    setMaintenanceTypeFilter(null);
    setFilteredRecords(records);
    setFilteredMaintenanceRecords(maintenanceRecords);
  };
  const changeTypeOptions = [{
    label: "Depreciación",
    value: "depreciation"
  }, {
    label: "Apreciación",
    value: "appreciation"
  }];
  const maintenanceTypeOptions = [{
    label: "Preventivo",
    value: "preventive"
  }, {
    label: "Correctivo",
    value: "corrective"
  }, {
    label: "Calibración",
    value: "calibration"
  }, {
    label: "Predictivo",
    value: "predictive"
  }];
  const renderChangeAmount = rowData => {
    const isDepreciation = rowData.changeType === "depreciation";
    const icon = isDepreciation ? "arrow-down" : "arrow-up";
    const color = isDepreciation ? "text-red-500" : "text-green-500";
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: `pi pi-${icon} ${color}`
    }), /*#__PURE__*/React.createElement("span", {
      className: color
    }, formatCurrency(Math.abs(rowData.changeAmount))), /*#__PURE__*/React.createElement(Badge, {
      value: `${(rowData.changePercentage || 0).toFixed(2)}%`,
      severity: isDepreciation ? "danger" : "success",
      className: "ml-2"
    }));
  };
  const getMaintenanceTypeLabel = type => {
    switch (type) {
      case "preventive":
        return "Preventivo";
      case "corrective":
        return "Correctivo";
      case "predictive":
        return "Predictivo";
      case "calibration":
        return "Calibración";
      default:
        return type;
    }
  };
  const getMaintenanceTypeSeverity = type => {
    switch (type) {
      case "preventive":
        return "info";
      case "corrective":
        return "warning";
      case "predictive":
        return "success";
      case "calibration":
        return "secondary";
      default:
        return null;
    }
  };
  const getStatusSeverity = status => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "maintenance":
        return "info";
      case "disposed":
        return "danger";
      default:
        return null;
    }
  };
  const getStatusLabel = status => {
    const statusOptions = [{
      label: "Activo",
      value: "active"
    }, {
      label: "Inactivo",
      value: "inactive"
    }, {
      label: "En Mantenimiento",
      value: "maintenance"
    }, {
      label: "Dado de Baja",
      value: "disposed"
    }];
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };
  const renderStatusChange = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-arrow-right text-500"
    }), /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(rowData.statusAfter),
      severity: getStatusSeverity(rowData.statusAfter),
      className: "text-xs"
    }));
  };
  const renderAssignmentChange = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-column"
    }, rowData.assignedToBefore && /*#__PURE__*/React.createElement("small", {
      className: "text-500"
    }, rowData.assignedToBefore));
  };
  const renderAssetCard = assetId => {
    const assetRecords = records.filter(r => r.assetId === assetId);
    if (assetRecords.length === 0) return null;
    const asset = assetRecords[0];
    const totalDepreciation = assetRecords.filter(r => r.changeType === "depreciation").reduce((sum, r) => sum + r.changeAmount, 0);
    const totalAppreciation = assetRecords.filter(r => r.changeType === "appreciation").reduce((sum, r) => sum + r.changeAmount, 0);
    const netChange = totalDepreciation + totalAppreciation;
    const previousValue = assetRecords[assetRecords.length - 1]?.previousValue || 0;
    const netPercentage = previousValue > 0 ? netChange / previousValue * 100 : 0;
    return /*#__PURE__*/React.createElement(Card, {
      key: assetId,
      className: "mb-4 shadow-2",
      title: /*#__PURE__*/React.createElement("div", {
        className: "flex justify-content-between align-items-center"
      }, /*#__PURE__*/React.createElement("span", null, asset.assetName), /*#__PURE__*/React.createElement(Tag, {
        value: asset.internalCode,
        severity: "info",
        className: "ml-2"
      }))
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round bg-blue-50"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-600 mb-1"
    }, "Valor Inicial"), /*#__PURE__*/React.createElement("p", {
      className: "text-xl font-bold text-900"
    }, formatCurrency(previousValue)))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round bg-green-50"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-600 mb-1"
    }, "Valor Actual"), /*#__PURE__*/React.createElement("p", {
      className: "text-xl font-bold text-900"
    }, formatCurrency(assetRecords[0].newValue)))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round bg-red-50"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-600 mb-1"
    }, "Depreciaci\xF3n Total"), /*#__PURE__*/React.createElement("p", {
      className: "text-xl font-bold text-red-500"
    }, "-", formatCurrency(Math.abs(totalDepreciation))))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 md:col-6 lg:col-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-3 border-round bg-teal-50"
    }, /*#__PURE__*/React.createElement("p", {
      className: "text-sm font-medium text-600 mb-1"
    }, "Apreciaci\xF3n Total"), /*#__PURE__*/React.createElement("p", {
      className: "text-xl font-bold text-green-500"
    }, "+", formatCurrency(totalAppreciation)))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 mt-3"
    }, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
      className: "flex flex-column"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-between mb-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "font-medium"
    }, "Cambio Neto"), /*#__PURE__*/React.createElement("span", {
      className: classNames("font-bold", {
        "text-green-500": netChange > 0,
        "text-red-500": netChange < 0
      })
    }, netChange > 0 ? "+" : "", formatCurrency(netChange), " (", (netPercentage || 0).toFixed(2), "%)")), /*#__PURE__*/React.createElement(ProgressBar, {
      value: Math.abs(netPercentage || 0),
      showValue: false,
      color: netChange > 0 ? "#22C55E" : "#EF4444",
      style: {
        height: "6px"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "col-12 mt-3"
    }, /*#__PURE__*/React.createElement("small", {
      className: "text-500"
    }, "\xDAltima actualizaci\xF3n: ", formatDate(assetRecords[0].date)))));
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
    },
    rangeCalendar: {
      width: "100%"
    },
    depreciationBar: {
      height: "6px",
      borderRadius: "3px"
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "m-0"
  }, "Historial"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Registro",
    icon: "pi pi-plus",
    className: "btn btn-primary",
    onClick: () => setShowNewDialog(true)
  })), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Historial Detallado",
    leftIcon: "pi pi-history mr-2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de Cambio"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "changeType",
    value: changeTypeFilter,
    options: changeTypeOptions,
    onChange: e => setChangeTypeFilter(e.value),
    optionLabel: "label",
    placeholder: "Todos los tipos",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    className: "btn btn-phoenix-secondary",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: applyFilters,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredRecords,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron registros",
    responsiveLayout: "scroll",
    removableSort: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "date",
    header: "Fecha",
    body: rowData => formatDate(rowData.date),
    sortable: true,
    style: {
      minWidth: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assetName",
    header: "Activo",
    body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "font-bold"
    }, rowData.assetName), /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-500"
    }, rowData.internalCode)),
    sortable: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "previousValue",
    header: "Valor Anterior",
    body: rowData => formatCurrency(rowData.previousValue),
    sortable: true,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "newValue",
    header: "Nuevo Valor",
    body: rowData => formatCurrency(rowData.newValue),
    sortable: true,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "changeType",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getChangeTypeLabel(rowData.changeType),
      severity: getChangeTypeSeverity(rowData.changeType),
      icon: rowData.changeType === "depreciation" ? "pi pi-arrow-down" : "pi pi-arrow-up"
    }),
    sortable: true,
    style: {
      minWidth: "140px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Variaci\xF3n",
    body: renderChangeAmount,
    sortable: true,
    sortField: "changeAmount",
    style: {
      minWidth: "180px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "notes",
    header: "Notas",
    style: {
      minWidth: "200px"
    }
  })))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Resumen por Activo",
    leftIcon: "pi pi-chart-bar mr-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, Array.from(new Set(records.map(r => r.assetId))).map(renderAssetCard))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Historial Mantenimiento",
    leftIcon: "pi pi-wrench mr-2"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de Mantenimiento",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Rango de Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "maintenanceDateRange",
    value: maintenanceDateRange,
    onChange: e => setMaintenanceDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de Mantenimiento"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "maintenanceType",
    value: maintenanceTypeFilter,
    options: maintenanceTypeOptions,
    onChange: e => setMaintenanceTypeFilter(e.value),
    optionLabel: "label",
    placeholder: "Todos los tipos",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    className: "btn btn-phoenix-secondary",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: applyFilters,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredMaintenanceRecords,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron registros de mantenimiento",
    responsiveLayout: "scroll",
    removableSort: true
  }, /*#__PURE__*/React.createElement(Column, {
    field: "maintenanceDate",
    header: "Fecha",
    body: rowData => formatDate(rowData.maintenanceDate),
    sortable: true,
    style: {
      minWidth: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "assetName",
    header: "Activo",
    body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "font-bold"
    }, rowData.assetName), /*#__PURE__*/React.createElement("div", {
      className: "text-sm text-500"
    }, rowData.internalCode)),
    sortable: true,
    style: {
      minWidth: "200px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "maintenanceType",
    header: "Tipo",
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getMaintenanceTypeLabel(rowData.maintenanceType),
      severity: getMaintenanceTypeSeverity(rowData.maintenanceType)
    }),
    sortable: true,
    style: {
      minWidth: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Estado",
    body: renderStatusChange,
    style: {
      minWidth: "180px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Asignaci\xF3n",
    body: renderAssignmentChange,
    style: {
      minWidth: "150px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nextMaintenanceDate",
    header: "Pr\xF3ximo",
    body: rowData => rowData.nextMaintenanceDate ? formatDate(rowData.nextMaintenanceDate) : "N/A",
    sortable: true,
    style: {
      minWidth: "120px"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "comments",
    header: "Detalles",
    style: {
      minWidth: "250px"
    }
  }))))), /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo Registro de Depreciaci\xF3n/Apreciaci\xF3n",
    visible: showNewDialog,
    style: {
      width: "50vw"
    },
    onHide: () => setShowNewDialog(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "asset",
    className: "block mb-2 font-medium"
  }, "Activo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "asset",
    options: Array.from(new Set(records.map(r => ({
      label: `${r.assetName} (${r.internalCode})`,
      value: r.assetId
    })))),
    optionLabel: "label",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date",
    className: "block mb-2 font-medium"
  }, "Fecha"), /*#__PURE__*/React.createElement(Calendar, {
    id: "date",
    dateFormat: "dd/mm/yy",
    className: "w-full",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "type",
    className: "block mb-2 font-medium"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "type",
    options: changeTypeOptions,
    placeholder: "Seleccione tipo",
    className: "w-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "previousValue",
    className: "block mb-2 font-medium"
  }, "Valor Anterior"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "previousValue",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "newValue",
    className: "block mb-2 font-medium"
  }, "Nuevo Valor"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "newValue",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    className: "w-full"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "notes",
    className: "block mb-2 font-medium"
  }, "Notas"), /*#__PURE__*/React.createElement("textarea", {
    id: "notes",
    rows: 3,
    className: "w-full p-2 border-1 surface-border border-round"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-outlined p-button-secondary",
    onClick: () => setShowNewDialog(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-success"
  })))));
};
export default DepreciationHistoryTable;