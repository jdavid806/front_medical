import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
export const PricesTableConfig = ({
  onEditItem,
  prices
}) => {
  // Sample data

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
      tooltip: "Editar",
      onClick: e => {
        e.stopPropagation();
        handleEditPrice(rowData);
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-text p-button-sm p-button-danger",
      tooltip: "Eliminar",
      onClick: e => {
        e.stopPropagation();
        // handleDeletePrice(rowData);
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
  // const handleDeletePrice = (price: PriceItem) => {
  //     confirmDialog({
  //         message: `¿Estás seguro de eliminar el precio para "${price.name}"?`,
  //         header: 'Confirmar eliminación',
  //         icon: 'pi pi-exclamation-triangle',
  //         acceptLabel: 'Sí, eliminar',
  //         rejectLabel: 'Cancelar',
  //         accept: () => {
  //             setPrices(prices.filter(p => p.id !== price.id));
  //         }
  //     });
  // };

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
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: '100%',
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    style: styles.card
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Tipo de atenci\xF3n"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoAtencion,
    options: tiposAtencion,
    onChange: e => handleFilterChange('tipoAtencion', e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "C\xF3digo"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.codigo || '',
    onChange: e => handleFilterChange('codigo', e.target.value),
    placeholder: "Buscar por c\xF3digo...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Nombre"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.nombre || '',
    onChange: e => handleFilterChange('nombre', e.target.value),
    placeholder: "Buscar por nombre...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("label", {
    style: styles.formLabel
  }, "Fecha de creaci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaDesde,
    onChange: e => handleFilterChange('fechaDesde', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "Desde",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: aplicarFiltros
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Listado de Precios",
    style: styles.card
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
    }
  }, /*#__PURE__*/React.createElement(Column, {
    field: "code",
    header: "C\xF3digo",
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
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Precio P\xFAblico",
    body: rowData => currencyFormat(rowData.publicPrice),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Copago",
    body: rowData => currencyFormat(rowData.copayment),
    sortable: true,
    style: styles.tableCell
  }), /*#__PURE__*/React.createElement(Column, {
    field: "createdAt",
    header: "Fecha Creaci\xF3n",
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
  }))));
};