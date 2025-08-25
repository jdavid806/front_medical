import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';
import { useDebounce } from 'primereact/hooks';
export const PricesTableConfig = ({
  onEditItem,
  prices,
  onDeleteItem
}) => {
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [activeTab, setActiveTab] = useState('prices');

  // Filtros state
  const [filtros, setFiltros] = useState({
    tipoAtencion: null,
    codigo: null,
    nombre: null,
    fechaDesde: null,
    fechaHasta: null
  });

  // Global search filter state
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    }
  });
  const [globalFilterValue, debounceGlobalFilterValue, setGlobalFilterValue] = useDebounce('', 500);

  // Options for dropdowns
  const tiposAtencion = [{
    label: 'Consulta',
    value: 'Consulta'
  }, {
    label: 'Laboratorio',
    value: 'Laboratorio'
  }, {
    label: 'Imágenes',
    value: 'Imágenes'
  }, {
    label: 'Procedimiento',
    value: 'Procedimiento'
  }];

  // Estilos consistentes con ThirdPartiesTable
  const styles = {
    card: {
      marginBottom: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#333'
    },
    tableHeader: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      fontWeight: 600
    },
    tableCell: {
      padding: '0.75rem 1rem'
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: '0.5rem',
      display: 'block'
    }
  };

  // Action buttons template
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-row items-center gap-2",
      style: {
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm",
      onClick: e => {
        e.stopPropagation();
        handleEditPrice(rowData);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      onClick: e => {
        e.stopPropagation();
        handleDeletePrice(rowData);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    })));
  };

  // Currency format for Dominican Peso (DOP)
  const currencyFormat = value => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Handle edit price
  const handleEditPrice = price => {
    onEditItem(price.id.toString());
    setModalVisible(true);
  };

  // Handle delete price
  const handleDeletePrice = price => {
    onDeleteItem(price.id.toString());
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply filters
  const aplicarFiltros = () => {
    // Implementar lógica de filtrado aquí
    console.log('Aplicando filtros:', filtros);
  };

  // Clear filters
  const limpiarFiltros = () => {
    setFiltros({
      tipoAtencion: null,
      codigo: null,
      nombre: null,
      fechaDesde: null,
      fechaHasta: null
    });
  };

  // Handle global filter change
  const onGlobalFilterChange = e => {
    const value = e.target.value;
    let _filters = {
      ...filters
    };

    // @ts-ignore
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  // Table header with search
  const tableHeader = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-0"
    }, "Listado de Precios"), /*#__PURE__*/React.createElement(InputText, {
      value: globalFilterValue,
      onChange: onGlobalFilterChange,
      placeholder: "Buscar por nombre...",
      className: "w-auto"
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: '100%',
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: prices,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    className: "p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron precios",
    responsiveLayout: "scroll",
    tableStyle: {
      minWidth: '50rem'
    },
    globalFilterFields: ['name'],
    filters: filters,
    header: tableHeader
  }, /*#__PURE__*/React.createElement(Column, {
    field: "Cups",
    header: "Cups",
    body: rowData => rowData.barcode,
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Nombre",
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "attentionType",
    header: "Tipo de Atenci\xF3n",
    body: rowData => {
      const attentionTypeMap = {
        PROCEDURE: "Procedimiento",
        CONSULTATION: "Consulta",
        LABORATORY: "Laboratorio",
        REHABILITATION: "Rehabilitación",
        OPTOMETRY: "Optometría"
      };
      return attentionTypeMap[rowData.attention_type] || rowData.attention_type || "";
    },
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Precio P\xFAblico",
    body: rowData => currencyFormat(rowData.sale_price),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Copago",
    body: rowData => currencyFormat(rowData.copayment),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      ...styles.tableCell,
      width: '120px',
      textAlign: 'center'
    }
  })));
};