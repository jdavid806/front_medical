import React, { useState, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { classNames } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { Toast } from "primereact/toast";
import FixedAssetsModal from "../modal/FixedAssetsModal.js";
import DepreciationAppreciationModal from "../modal/DepreciationAppreciationModal.js";
import MaintenanceModal from "../modal/MaintenanceModal.js";
import { useAssets } from "../hooks/useAssets.js";
export const FixedAssetsTable = () => {
  const {
    assets,
    fetchAssets
  } = useAssets();
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [maintenanceModalVisible, setMaintenanceModalVisible] = useState(false);
  const [selectedAssetForMaintenance, setSelectedAssetForMaintenance] = useState(null);
  const [depreciationModalVisible, setDepreciationModalVisible] = useState(false);
  const [selectedAssetForAdjustment, setSelectedAssetForAdjustment] = useState(null);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    assetName: "",
    assetCategory: null,
    brand: "",
    internalCode: "",
    status: null,
    dateRange: null
  });
  const assetCategories = [{
    label: "Computador",
    value: "computer"
  }, {
    label: "Vehículo",
    value: "vehicle"
  }, {
    label: "Mobiliario",
    value: "furniture"
  }, {
    label: "Maquinaria",
    value: "machinery"
  }, {
    label: "Equipo Electrónico",
    value: "electronic"
  }, {
    label: "Otro",
    value: "other"
  }];

  // En tu FixedAssetsTable.tsx, agrega estas constantes junto a las otras opciones
  const maintenanceTypeOptions = [{
    label: "Preventivo",
    value: "preventive"
  }, {
    label: "Correctivo",
    value: "corrective"
  }, {
    label: "Predictivo",
    value: "predictive"
  }, {
    label: "Calibración",
    value: "calibration"
  }];
  const userOptions = [{
    label: "Juan Pérez",
    value: "Juan Pérez"
  }, {
    label: "María García",
    value: "María García"
  }, {
    label: "Carlos López",
    value: "Carlos López"
  }, {
    label: "Ana Rodríguez",
    value: "Ana Rodríguez"
  }, {
    label: "Logística",
    value: "Logística"
  }, {
    label: "Departamento Contable",
    value: "Departamento Contable"
  }];
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
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleMaintenanceClick = asset => {
    setSelectedAssetForMaintenance(asset);
    setMaintenanceModalVisible(true);
  };
  const applyFilters = () => {
    setLoading(true);
    let results = [...assets];

    // Filter by asset name
    if (filters.assetName) {
      results = results.filter(asset => asset.attributes.description?.toLowerCase().includes(filters.assetName.toLowerCase()));
    }

    // Filter by category
    if (filters.assetCategory) {
      results = results.filter(asset => asset.relationships.category.data.id === filters.assetCategory);
    }

    // Filter by brand
    if (filters.brand) {
      results = results.filter(asset => asset.attributes.brand?.toLowerCase().includes(filters.brand.toLowerCase()));
    }

    // Filter by internal code
    if (filters.internalCode) {
      results = results.filter(asset => asset.attributes.internal_code?.toLowerCase().includes(filters.internalCode.toLowerCase()));
    }

    // Filter by status
    if (filters.status) {
      results = results.filter(asset => asset.attributes.status === filters.status);
    }

    // Filter by date range
    /*if (filters.dateRange && filters.dateRange.length === 2) {
      const [start, end] = filters.dateRange;
      results = results.filter((asset) => {
        const assetDate = new Date(asset.acquisitionDate);
        return assetDate >= start && assetDate <= end;
      });
    }*/

    setTimeout(() => {
      console.log(results);
      setFilteredAssets(results);
      setLoading(false);
    }, 300);
  };
  const clearFilters = () => {
    setFilters({
      assetName: "",
      assetCategory: null,
      brand: "",
      internalCode: "",
      status: null,
      dateRange: null
    });
    setFilteredAssets(assets);
  };
  const formatCurrency = value => {
    return value.toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  const formatDate = value => {
    return value.toLocaleDateString("es-DO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
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
        return "secondary";
    }
  };
  const getStatusLabel = status => {
    const option = statusOptions.find(opt => opt.value === status);
    return (option ? option.label : status) || "Sin Estado";
  };
  const getCategoryLabel = category => {
    const option = assetCategories.find(opt => opt.value === category);
    return option ? option.label : category;
  };
  const calculateDepreciation = (purchaseValue, currentValue) => {
    return (purchaseValue - currentValue) / purchaseValue * 100;
  };
  const changeStatus = asset => {
    setSelectedAssetForAdjustment(asset);
    setDepreciationModalVisible(true);
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

  // Acciones para cada fila
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Mantenimiento/Estado",
      template: createActionTemplate("book-open", "Mantenimiento/Estado", "text-purple-500"),
      command: () => handleMaintenanceClick(rowData)
    }, {
      label: "depreciacion o  apreciacion",
      template: createActionTemplate("exchange-alt", "Depreciación/Apreciación", "text-purple-500"),
      command: () => changeStatus(rowData)
    }];
    return /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      icon: "pi pi-cog",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      menuButtonClassName: "p-button-sm point",
      style: {
        width: "100%"
      },
      menuStyle: {
        minWidth: "300px",
        maxWidth: "300px",
        cursor: "pointer"
      }
    });
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
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
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Activo Fijo",
    icon: "pi pi-plus",
    className: "btn btn-primary",
    onClick: () => setModalVisible(true)
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre/Descripci\xF3n"), /*#__PURE__*/React.createElement(InputText, {
    value: filters.assetName,
    onChange: e => handleFilterChange("assetName", e.target.value),
    placeholder: "Nombre del activo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.assetCategory,
    options: assetCategories,
    onChange: e => handleFilterChange("assetCategory", e.value),
    optionLabel: "label",
    placeholder: "Seleccione categor\xEDa",
    className: "w-100",
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "C\xF3digo Interno"), /*#__PURE__*/React.createElement(InputText, {
    value: filters.internalCode,
    onChange: e => handleFilterChange("internalCode", e.target.value),
    placeholder: "C\xF3digo del activo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filters.status,
    options: statusOptions,
    onChange: e => handleFilterChange("status", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha de Adquisici\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filters.dateRange,
    onChange: e => handleFilterChange("dateRange", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: clearFilters
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "btn btn-primary",
    onClick: applyFilters,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Activos Fijos",
    style: styles.card
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: filteredAssets,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron activos",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: "50rem"
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "attributes.internal_code",
    header: "C\xF3digo",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.description",
    header: "Nombre/Descripci\xF3n",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "includes.category.attributes.name",
    header: "Categor\xEDa",
    sortable: true,
    body: rowData => getCategoryLabel(rowData.includes.category?.attributes.name) || '--',
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.brand",
    header: "Marca",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attributes.model",
    header: "Modelo",
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getStatusLabel(rowData.attributes.status),
      severity: getStatusSeverity(rowData.attributes.status)
    }),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Depreciaci\xF3n",
    body: rowData => /*#__PURE__*/React.createElement("div", {
      className: "flex flex-column gap-1"
    }, /*#__PURE__*/React.createElement("span", null, calculateDepreciation(rowData.purchaseValue, rowData.currentValue).toFixed(2), "%"), /*#__PURE__*/React.createElement(ProgressBar, {
      value: calculateDepreciation(rowData.purchaseValue, rowData.currentValue),
      showValue: false,
      style: styles.depreciationBar,
      className: classNames({
        "p-progressbar-determinate": true,
        "p-progressbar-danger": calculateDepreciation(rowData.purchaseValue, rowData.currentValue) > 50,
        "p-progressbar-warning": calculateDepreciation(rowData.purchaseValue, rowData.currentValue) > 30 && calculateDepreciation(rowData.purchaseValue, rowData.currentValue) <= 50,
        "p-progressbar-success": calculateDepreciation(rowData.purchaseValue, rowData.currentValue) <= 30
      })
    })),
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      ...styles.tableCell,
      width: "150px"
    }
  }))), /*#__PURE__*/React.createElement(FixedAssetsModal, {
    isVisible: modalVisible,
    onClose: () => {
      setModalVisible(false);
      setSelectedAsset(null);
    },
    onSave: assetData => {
      setFilteredAssets([...assets]);
      setModalVisible(false);
      setSelectedAsset(null);
    }
  }), selectedAssetForAdjustment && /*#__PURE__*/React.createElement(DepreciationAppreciationModal, {
    isVisible: depreciationModalVisible,
    onClose: () => {
      setDepreciationModalVisible(false);
      setSelectedAssetForAdjustment(null);
    },
    onSave: async adjustmentData => {
      // Aquí implementas la lógica para guardar el ajuste
      console.log("Ajuste guardado:", adjustmentData);

      // Actualiza el estado de los activos si es necesario
      setDepreciationModalVisible(false);
      setSelectedAssetForAdjustment(null);

      // Muestra notificación de éxito
      showToast("success", "Ajuste registrado", `El ajuste de valor para ${selectedAssetForAdjustment.attributes.description} ha sido registrado correctamente.`);
    },
    asset: selectedAssetForAdjustment
  }), selectedAssetForMaintenance && /*#__PURE__*/React.createElement(MaintenanceModal, {
    isVisible: maintenanceModalVisible,
    onSave: async maintenanceData => {
      const updatedAssets = (await fetchAssets()) || [];
      setFilteredAssets(updatedAssets);
      setMaintenanceModalVisible(false);

      // Mostrar notificación
      showToast("success", "Mantenimiento registrado", `El estado de ${selectedAssetForMaintenance.attributes.description} ha sido actualizado.`);
    },
    onClose: () => {
      setMaintenanceModalVisible(false);
      setSelectedAssetForMaintenance(null);
    },
    asset: selectedAssetForMaintenance,
    statusOptions: statusOptions,
    maintenanceTypeOptions: maintenanceTypeOptions,
    userOptions: userOptions
  }));
};
export default FixedAssetsTable;