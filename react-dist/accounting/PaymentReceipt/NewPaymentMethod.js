import React, { useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { TabPanel, TabView } from "primereact/tabview";
export const NewPaymentMethod = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Estados para General
  const [editingRow, setEditingRow] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  // Estados para Pago en línea
  const [editingRowOnline, setEditingRowOnline] = useState(null);
  const [editingFieldOnline, setEditingFieldOnline] = useState(null);
  const [editingValueOnline, setEditingValueOnline] = useState('');

  // Filtros para General
  const [filters, setFilters] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    codigo: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH
      }]
    },
    nombre: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    },
    relacionCon: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    },
    cuentaContable: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    }
  });

  // Filtros para Pago en línea
  const [filtersOnline, setFiltersOnline] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    codigo: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.STARTS_WITH
      }]
    },
    nombre: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    },
    relacionCon: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    },
    cuentaContable: {
      operator: FilterOperator.AND,
      constraints: [{
        value: null,
        matchMode: FilterMatchMode.CONTAINS
      }]
    }
  });

  // Opciones para dropdowns
  const relacionOptions = [{
    label: 'Proveedor',
    value: 'proveedor'
  }, {
    label: 'Cliente',
    value: 'cliente'
  }, {
    label: 'Empleado',
    value: 'empleado'
  }, {
    label: 'Socio',
    value: 'socio'
  }, {
    label: 'Contratista',
    value: 'contratista'
  }];
  const medioPagoOptions = [{
    label: 'Transferencia',
    value: 'transferencia'
  }, {
    label: 'Efectivo',
    value: 'efectivo'
  }, {
    label: 'Cheque',
    value: 'cheque'
  }, {
    label: 'Tarjeta crédito',
    value: 'tarjeta_credito'
  }, {
    label: 'Tarjeta débito',
    value: 'tarjeta_debito'
  }, {
    label: 'Débito automático',
    value: 'debito_automatico'
  }];

  // Datos mock para General
  const [paymentMethods, setPaymentMethods] = useState([{
    id: 1,
    codigo: "EFC",
    nombre: "Efectivo",
    relacionCon: "proveedor",
    cuentaContable: "11050501 - Caja general",
    medioPago: ["efectivo"],
    enUso: true,
    fechaCreacion: "2023-01-15"
  }, {
    id: 2,
    codigo: "CRE",
    nombre: "Crédito",
    relacionCon: "cliente",
    cuentaContable: "13050501 - Clientes nacionales",
    medioPago: ["tarjeta_credito"],
    enUso: true,
    fechaCreacion: "2023-02-20"
  }]);

  // Datos mock para Pago en línea
  const [paymentMethodsOnline, setPaymentMethodsOnline] = useState([{
    id: 1,
    codigo: "PAY",
    nombre: "PayPal",
    relacionCon: "cliente",
    cuentaContable: "11050502 - Cuentas en línea",
    medioPago: ["transferencia"],
    enUso: true,
    fechaCreacion: "2023-04-15"
  }, {
    id: 2,
    codigo: "MP",
    nombre: "Mercado Pago",
    relacionCon: "cliente",
    cuentaContable: "13050502 - Clientes en línea",
    medioPago: ["tarjeta_credito", "tarjeta_debito"],
    enUso: true,
    fechaCreacion: "2023-05-20"
  }]);

  // Funciones para edición de celdas (General)
  const onCellClick = (rowIndex, field, value) => {
    setEditingRow(rowIndex);
    setEditingField(field);
    setEditingValue(value);
  };
  const onCellEditComplete = e => {
    const updatedData = [...paymentMethods];
    updatedData[e.rowIndex][e.field] = e.value;
    setPaymentMethods(updatedData);
    setEditingRow(null);
    setEditingField(null);
  };

  // Funciones para edición de celdas (Pago en línea)
  const onCellClickOnline = (rowIndex, field, value) => {
    setEditingRowOnline(rowIndex);
    setEditingFieldOnline(field);
    setEditingValueOnline(value);
  };
  const onCellEditCompleteOnline = e => {
    const updatedData = [...paymentMethodsOnline];
    updatedData[e.rowIndex][e.field] = e.value;
    setPaymentMethodsOnline(updatedData);
    setEditingRowOnline(null);
    setEditingFieldOnline(null);
  };

  // Renderizado de celdas editables (General)
  const renderCellEditor = (rowData, field, rowIndex) => {
    if (editingRow === rowIndex && editingField === field) {
      return /*#__PURE__*/React.createElement(InputText, {
        autoFocus: true,
        value: editingValue,
        onChange: e => setEditingValue(e.target.value),
        onBlur: () => onCellEditComplete({
          rowIndex,
          field,
          value: editingValue
        }),
        onKeyPress: e => e.key === 'Enter' && onCellEditComplete({
          rowIndex,
          field,
          value: editingValue
        })
      });
    }
    return /*#__PURE__*/React.createElement("span", {
      onClick: () => onCellClick(rowIndex, field, rowData[field])
    }, rowData[field]);
  };

  // Renderizado de celdas editables (Pago en línea)
  const renderCellEditorOnline = (rowData, field, rowIndex) => {
    if (editingRowOnline === rowIndex && editingFieldOnline === field) {
      return /*#__PURE__*/React.createElement(InputText, {
        autoFocus: true,
        value: editingValueOnline,
        onChange: e => setEditingValueOnline(e.target.value),
        onBlur: () => onCellEditCompleteOnline({
          rowIndex,
          field,
          value: editingValueOnline
        }),
        onKeyPress: e => e.key === 'Enter' && onCellEditCompleteOnline({
          rowIndex,
          field,
          value: editingValueOnline
        })
      });
    }
    return /*#__PURE__*/React.createElement("span", {
      onClick: () => onCellClickOnline(rowIndex, field, rowData[field])
    }, rowData[field]);
  };

  // Templates comunes para ambas tablas
  const relacionConBodyTemplate = rowData => {
    const option = relacionOptions.find(opt => opt.value === rowData.relacionCon);
    return option ? option.label : rowData.relacionCon;
  };
  const medioPagoBodyTemplate = rowData => {
    return rowData.medioPago.map(mp => {
      const option = medioPagoOptions.find(opt => opt.value === mp);
      return option ? /*#__PURE__*/React.createElement("span", {
        key: mp,
        className: "badge bg-primary me-1"
      }, option.label) : null;
    });
  };
  const fechaBodyTemplate = rowData => {
    return new Date(rowData.fechaCreacion).toLocaleDateString('es-CO');
  };

  // Handlers para switches (General)
  const onEnUsoChange = (rowIndex, value) => {
    const updatedData = [...paymentMethods];
    updatedData[rowIndex].enUso = value;
    setPaymentMethods(updatedData);
  };

  // Handlers para switches (Pago en línea)
  const onEnUsoChangeOnline = (rowIndex, value) => {
    const updatedData = [...paymentMethodsOnline];
    updatedData[rowIndex].enUso = value;
    setPaymentMethodsOnline(updatedData);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-primary text-white"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h4 mb-0"
  }, "Gesti\xF3n de M\xE9todos de Pago")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "General",
    leftIcon: "pi pi-list me-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left w-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar en todos los campos...",
    className: "w-100",
    onInput: e => {
      const target = e.target;
      setFilters({
        ...filters,
        global: {
          value: target.value,
          matchMode: FilterMatchMode.CONTAINS
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: paymentMethods,
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 25],
    filters: filters,
    globalFilterFields: ['codigo', 'nombre', 'relacionCon', 'cuentaContable'],
    emptyMessage: "No se encontraron m\xE9todos de pago",
    editMode: "cell",
    responsiveLayout: "scroll",
    className: "border-0"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "enUso",
    header: "En Uso",
    body: (rowData, {
      rowIndex
    }) => /*#__PURE__*/React.createElement(InputSwitch, {
      checked: rowData.enUso,
      onChange: e => onEnUsoChange(rowIndex, e.value)
    }),
    style: {
      width: '90px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    filter: true,
    filterPlaceholder: "Buscar c\xF3digo",
    body: (rowData, {
      rowIndex
    }) => renderCellEditor(rowData, 'codigo', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    filter: true,
    filterPlaceholder: "Buscar nombre",
    body: (rowData, {
      rowIndex
    }) => renderCellEditor(rowData, 'nombre', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "relacionCon",
    header: "Relaci\xF3n con",
    filter: true,
    filterPlaceholder: "Buscar relaci\xF3n",
    body: relacionConBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cuentaContable",
    header: "Cuenta Contable",
    filter: true,
    filterPlaceholder: "Buscar cuenta",
    body: (rowData, {
      rowIndex
    }) => renderCellEditor(rowData, 'cuentaContable', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "medioPago",
    header: "Medio de pago D. Electr\xF3nico",
    body: medioPagoBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaCreacion",
    header: "Fecha Creaci\xF3n",
    body: fechaBodyTemplate,
    sortable: true
  })))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Pago en l\xEDnea",
    leftIcon: "pi pi-globe me-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "p-input-icon-left w-100"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-search"
  }), /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar en todos los campos...",
    className: "w-100",
    onInput: e => {
      const target = e.target;
      setFiltersOnline({
        ...filtersOnline,
        global: {
          value: target.value,
          matchMode: FilterMatchMode.CONTAINS
        }
      });
    }
  }))), /*#__PURE__*/React.createElement(DataTable, {
    value: paymentMethodsOnline,
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 25],
    filters: filtersOnline,
    globalFilterFields: ['codigo', 'nombre', 'relacionCon', 'cuentaContable'],
    emptyMessage: "No se encontraron m\xE9todos de pago en l\xEDnea",
    editMode: "cell",
    responsiveLayout: "scroll",
    className: "border-0"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "enUso",
    header: "En Uso",
    body: (rowData, {
      rowIndex
    }) => /*#__PURE__*/React.createElement(InputSwitch, {
      checked: rowData.enUso,
      onChange: e => onEnUsoChangeOnline(rowIndex, e.value)
    }),
    style: {
      width: '90px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo",
    filter: true,
    filterPlaceholder: "Buscar c\xF3digo",
    body: (rowData, {
      rowIndex
    }) => renderCellEditorOnline(rowData, 'codigo', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    filter: true,
    filterPlaceholder: "Buscar nombre",
    body: (rowData, {
      rowIndex
    }) => renderCellEditorOnline(rowData, 'nombre', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "relacionCon",
    header: "Relaci\xF3n con",
    filter: true,
    filterPlaceholder: "Buscar relaci\xF3n",
    body: relacionConBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "cuentaContable",
    header: "Cuenta Contable",
    filter: true,
    filterPlaceholder: "Buscar cuenta",
    body: (rowData, {
      rowIndex
    }) => renderCellEditorOnline(rowData, 'cuentaContable', rowIndex),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "medioPago",
    header: "Medio de pago D. Electr\xF3nico",
    body: medioPagoBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaCreacion",
    header: "Fecha Creaci\xF3n",
    body: fechaBodyTemplate,
    sortable: true
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card-footer bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Total m\xE9todos: ", paymentMethods.length, " | Total m\xE9todos en l\xEDnea: ", paymentMethodsOnline.length)))));
};