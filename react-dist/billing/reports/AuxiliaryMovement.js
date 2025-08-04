import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { FilterMatchMode, PrimeReactProvider } from 'primereact/api';
import { addLocale } from 'primereact/api';
import { Espanish } from "../../../services/translatePrimeReact.js";
addLocale('es', Espanish);
// Definición de tipos TypeScript

export const AuxiliaryMovement = () => {
  // Estado para los datos de la tabla
  const [cuentasContables, setCuentasContables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState(null);
  const [filtrosMovimientos, setFiltrosMovimientos] = useState({
    global: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    comprobante: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    nombreTercero: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    descripcion: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    },
    centroCosto: {
      value: null,
      matchMode: FilterMatchMode.CONTAINS
    }
  });

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    codigoContable: '',
    cuentaContable: '',
    fechaInicial: null,
    fechaFinal: null,
    incluirCierre: false
  });

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        codigo: '1101',
        nombre: 'Caja General',
        saldoInicial: 1000000,
        saldoTotal: 1300000,
        movimientos: [{
          comprobante: 'RC-001',
          secuencia: 1,
          fechaElaboracion: new Date(2023, 5, 15),
          identificacion: '001-1234567-8',
          sucursal: 'Principal',
          nombreTercero: 'Juan Pérez',
          descripcion: 'Pago de servicios',
          centroCosto: 'ADM',
          debito: 500000,
          credito: 0,
          saldoMovimiento: 1500000
        }, {
          comprobante: 'RC-002',
          secuencia: 2,
          fechaElaboracion: new Date(2023, 5, 18),
          identificacion: '001-7654321-8',
          sucursal: 'Secundaria',
          nombreTercero: 'María López',
          descripcion: 'Reembolso gastos',
          centroCosto: 'VENT',
          debito: 0,
          credito: 200000,
          saldoMovimiento: 1300000
        }]
      }, {
        codigo: '110201',
        nombre: 'Banco Popular',
        saldoInicial: 3000000,
        saldoTotal: 3500000,
        movimientos: [{
          comprobante: 'DB-001',
          secuencia: 1,
          fechaElaboracion: new Date(2023, 5, 10),
          identificacion: '001-1234567-8',
          sucursal: 'Principal',
          nombreTercero: 'Empresa XYZ',
          descripcion: 'Depósito por ventas',
          centroCosto: 'VENT',
          debito: 1000000,
          credito: 0,
          saldoMovimiento: 4000000
        }, {
          comprobante: 'CH-001',
          secuencia: 2,
          fechaElaboracion: new Date(2023, 5, 12),
          identificacion: '001-7654321-8',
          sucursal: 'Principal',
          nombreTercero: 'Proveedor ABC',
          descripcion: 'Pago a proveedores',
          centroCosto: 'COMP',
          debito: 0,
          credito: 500000,
          saldoMovimiento: 3500000
        }]
      }, {
        codigo: '1201',
        nombre: 'Cuentas por Cobrar',
        saldoInicial: 3000000,
        saldoTotal: 3500000,
        movimientos: [{
          comprobante: 'FA-001',
          secuencia: 1,
          fechaElaboracion: new Date(2023, 5, 5),
          identificacion: '001-1234567-8',
          sucursal: 'Principal',
          nombreTercero: 'Cliente DEF',
          descripcion: 'Venta a crédito',
          centroCosto: 'VENT',
          debito: 1000000,
          credito: 0,
          saldoMovimiento: 4000000
        }, {
          comprobante: 'RC-003',
          secuencia: 2,
          fechaElaboracion: new Date(2023, 5, 20),
          identificacion: '001-7654321-8',
          sucursal: 'Principal',
          nombreTercero: 'Cliente DEF',
          descripcion: 'Pago parcial',
          centroCosto: 'VENT',
          debito: 0,
          credito: 500000,
          saldoMovimiento: 3500000
        }]
      }];
      setCuentasContables(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Manejadores de cambio de filtros para movimientos
  // Función para aplicar filtros
  const aplicarFiltros = () => {
    setLoading(true);
    // Aquí iría la lógica para filtrar los datos, normalmente una llamada a API
    setTimeout(() => {
      // Simulación de filtrado
      const datosFiltrados = cuentasContables.filter(cuenta => {
        // Filtro por código contable
        if (filtros.codigoContable && !cuenta.codigo.includes(filtros.codigoContable)) {
          return false;
        }

        // Filtro por nombre de cuenta
        if (filtros.cuentaContable && !cuenta.nombre.toLowerCase().includes(filtros.cuentaContable.toLowerCase())) {
          return false;
        }
        return true;
      });
      setCuentasContables(datosFiltrados);
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      codigoContable: '',
      cuentaContable: '',
      fechaInicial: null,
      fechaFinal: null,
      incluirCierre: false
    });
    // Aquí podrías también resetear los datos a su estado original
  };

  // Función para limpiar filtros de movimientos

  // Formatear número para saldos en pesos dominicanos (DOP)
  const formatCurrency = value => {
    return value.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = date => {
    return date.toLocaleDateString('es-DO');
  };

  // Plantilla para el acordeón (detalle de movimientos)
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: data.movimientos,
      responsiveLayout: "scroll",
      filters: filtrosMovimientos,
      globalFilterFields: ['comprobante', 'nombreTercero', 'descripcion', 'centroCosto'],
      emptyMessage: "No se encontraron movimientos"
    }, /*#__PURE__*/React.createElement(Column, {
      field: "comprobante",
      header: "Comprobante",
      filter: true,
      filterField: "comprobante"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "secuencia",
      header: "Secuencia"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "fechaElaboracion",
      header: "Fecha Elaboraci\xF3n",
      body: rowData => formatDate(rowData.fechaElaboracion)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "identificacion",
      header: "Identificaci\xF3n"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "sucursal",
      header: "Sucursal"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "nombreTercero",
      header: "Nombre Tercero",
      filter: true,
      filterField: "nombreTercero"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "descripcion",
      header: "Descripci\xF3n",
      filter: true,
      filterField: "descripcion"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "centroCosto",
      header: "Centro Costo",
      filter: true,
      filterField: "centroCosto"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "debito",
      header: "D\xE9bito",
      body: rowData => formatCurrency(rowData.debito)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "credito",
      header: "Cr\xE9dito",
      body: rowData => formatCurrency(rowData.credito)
    }), /*#__PURE__*/React.createElement(Column, {
      field: "saldoMovimiento",
      header: "Saldo Movimiento",
      body: rowData => formatCurrency(rowData.saldoMovimiento)
    })));
  };
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      locale: 'es'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "C\xF3digo Contable"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.codigoContable,
    onChange: e => handleFilterChange('codigoContable', e.target.value),
    placeholder: "Buscar por c\xF3digo...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre de Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.cuentaContable,
    onChange: e => handleFilterChange('cuentaContable', e.target.value),
    placeholder: "Buscar por nombre de cuenta...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha Inicial"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaInicial,
    onChange: e => handleFilterChange('fechaInicial', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione fecha inicial",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha Final"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaFinal,
    onChange: e => handleFilterChange('fechaFinal', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione fecha final",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "incluirCierre",
    checked: filtros.incluirCierre,
    onChange: e => handleFilterChange('incluirCierre', e.checked)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "incluirCierre",
    className: "ml-2"
  }, "Incluir movimientos de cierre contable"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar Reporte",
    className: "btn btn-primary",
    icon: "pi pi-filter",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Movimiento Auxiliar por Cuenta Contable"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: cuentasContables,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron resultados",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3em'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "codigo",
    header: "C\xF3digo Contable",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Cuenta Contable",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoInicial",
    header: "Saldo Inicial",
    body: rowData => formatCurrency(rowData.saldoInicial),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoTotal",
    header: "Saldo Total",
    body: rowData => formatCurrency(rowData.saldoTotal),
    sortable: true
  })))));
};