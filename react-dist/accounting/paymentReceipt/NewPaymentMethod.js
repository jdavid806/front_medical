import React, { useState } from "react";
import { TabView, TabPanel, DataTable, Column, InputText, InputSwitch, Button, MultiSelect, FilterMatchMode, FilterOperator } from "primereact";
export const NewPaymentMethod = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [editingRow, setEditingRow] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [newMethod, setNewMethod] = useState({
    nombre: '',
    codigo: '',
    cuentaContable: '',
    medioPago: [] // Ahora es un string[] vacío en lugar de never[]
  });

  // Filtros para la tabla
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

  // Datos mock
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
  }, {
    id: 3,
    codigo: "TD",
    nombre: "Tarjeta Débito",
    relacionCon: "cliente",
    cuentaContable: "1110501 - Billetera privada",
    medioPago: ["tarjeta_debito", "transferencia"],
    enUso: false,
    fechaCreacion: "2023-03-10"
  }]);

  // Funciones para edición de celdas
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
  const onEnUsoChange = (rowIndex, value) => {
    const updatedData = [...paymentMethods];
    updatedData[rowIndex].enUso = value;
    setPaymentMethods(updatedData);
  };

  // Funciones para el formulario de nuevo método
  const handleInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setNewMethod(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleMultiSelectChange = e => {
    setNewMethod(prev => ({
      ...prev,
      medioPago: e.value
    }));
  };
  const handleAddMethod = () => {
    const newId = Math.max(...paymentMethods.map(p => p.id), 0) + 1;
    const newPaymentMethod = {
      id: newId,
      codigo: newMethod.codigo,
      nombre: newMethod.nombre,
      relacionCon: "proveedor",
      cuentaContable: newMethod.cuentaContable,
      medioPago: newMethod.medioPago,
      enUso: true,
      fechaCreacion: new Date().toISOString().split('T')[0]
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
    setNewMethod({
      nombre: '',
      codigo: '',
      cuentaContable: '',
      medioPago: []
    });
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
    header: "M\xE9todos de Pago",
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
    header: "Medio de Pago",
    body: medioPagoBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaCreacion",
    header: "Fecha Creaci\xF3n",
    body: fechaBodyTemplate,
    sortable: true
  })))), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Nuevo M\xE9todo",
    leftIcon: "pi pi-plus me-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "nombre",
    className: "form-label"
  }, "Nombre del M\xE9todo"), /*#__PURE__*/React.createElement(InputText, {
    id: "nombre",
    name: "nombre",
    value: newMethod.nombre,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ej: Transferencia Bancaria"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "codigo",
    className: "form-label"
  }, "C\xF3digo"), /*#__PURE__*/React.createElement(InputText, {
    id: "codigo",
    name: "codigo",
    value: newMethod.codigo,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ej: TRF"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cuentaContable",
    className: "form-label"
  }, "Cuenta Contable"), /*#__PURE__*/React.createElement(InputText, {
    id: "cuentaContable",
    name: "cuentaContable",
    value: newMethod.cuentaContable,
    onChange: handleInputChange,
    className: "w-100",
    placeholder: "Ej: 11050501 - Caja general"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "medioPago",
    className: "form-label"
  }, "Medios de Pago"), /*#__PURE__*/React.createElement(MultiSelect, {
    id: "medioPago",
    value: newMethod.medioPago,
    options: medioPagoOptions,
    onChange: handleMultiSelectChange,
    placeholder: "Seleccione medios",
    className: "w-100",
    filter: true
  })))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar M\xE9todo",
    icon: "pi pi-check",
    className: "p-button-primary",
    onClick: handleAddMethod,
    disabled: !newMethod.nombre || !newMethod.codigo
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card-footer bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Total m\xE9todos: ", paymentMethods.length)))));
};