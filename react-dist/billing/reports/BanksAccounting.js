import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';

// Definición de tipos TypeScript

export const BanksAccounting = () => {
  // Estado para los datos de la tabla
  const [cuentasBancarias, setCuentasBancarias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [totalSaldoDisponible, setTotalSaldoDisponible] = useState(0);
  const [totalSaldoContable, setTotalSaldoContable] = useState(0);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    codigoCuenta: '',
    nombreBanco: '',
    numeroCuenta: '',
    tipoCuenta: null,
    moneda: null,
    estado: null,
    fechaDesde: null,
    fechaHasta: null,
    incluirInactivas: false
  });

  // Opciones para los selects
  const opcionesEstado = [{
    label: 'Todas',
    value: null
  }, {
    label: 'Activas',
    value: 'activa'
  }, {
    label: 'Inactivas',
    value: 'inactiva'
  }];
  const tiposCuenta = [{
    label: 'Ahorros',
    value: 'ahorros'
  }, {
    label: 'Corriente',
    value: 'corriente'
  }, {
    label: 'Nómina',
    value: 'nomina'
  }, {
    label: 'Plazo fijo',
    value: 'plazo_fijo'
  }];
  const monedas = [{
    label: 'DOP - Peso Dominicano',
    value: 'DOP'
  }, {
    label: 'USD - Dólar Americano',
    value: 'USD'
  }, {
    label: 'EUR - Euro',
    value: 'EUR'
  }];

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    // Simulación de llamada a API
    setTimeout(() => {
      const datosMock = [{
        id: '1',
        codigoCuentaContable: '110201',
        nombreCuentaContable: 'Banco Popular Cuenta Corriente',
        banco: 'Banco Popular',
        numeroCuenta: '123456789',
        tipoCuenta: 'corriente',
        moneda: 'DOP',
        saldoDisponible: 3500000,
        saldoContable: 3500000,
        fechaApertura: new Date(2020, 5, 15),
        activa: true
      }, {
        id: '2',
        codigoCuentaContable: '110202',
        nombreCuentaContable: 'Banco BHD Ahorros',
        banco: 'Banco BHD',
        numeroCuenta: '987654321',
        tipoCuenta: 'ahorros',
        moneda: 'USD',
        saldoDisponible: 15000,
        saldoContable: 15000,
        fechaApertura: new Date(2021, 2, 10),
        activa: true
      }, {
        id: '3',
        codigoCuentaContable: '110203',
        nombreCuentaContable: 'ScotiaBank Nómina',
        banco: 'Scotiabank',
        numeroCuenta: '456789123',
        tipoCuenta: 'nomina',
        moneda: 'DOP',
        saldoDisponible: 500000,
        saldoContable: 500000,
        fechaApertura: new Date(2019, 11, 5),
        activa: false
      }, {
        id: '4',
        codigoCuentaContable: '110204',
        nombreCuentaContable: 'Banco Reservas Plazo Fijo',
        banco: 'Banco de Reservas',
        numeroCuenta: '321654987',
        tipoCuenta: 'plazo_fijo',
        moneda: 'DOP',
        saldoDisponible: 2000000,
        saldoContable: 2000000,
        fechaApertura: new Date(2022, 7, 20),
        activa: true
      }];
      setCuentasBancarias(datosMock);
      calcularTotales(datosMock);
      setLoading(false);
    }, 1000);
  }, []);

  // Calcular totales
  const calcularTotales = datos => {
    let totalDisp = 0;
    let totalCont = 0;
    datos.forEach(item => {
      totalDisp += item.saldoDisponible;
      totalCont += item.saldoContable;
    });
    setTotalRegistros(datos.length);
    setTotalSaldoDisponible(totalDisp);
    setTotalSaldoContable(totalCont);
  };

  // Manejadores de cambio de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Función para aplicar filtros
  const aplicarFiltros = () => {
    setLoading(true);
    // Simulación de filtrado
    setTimeout(() => {
      const datosFiltrados = cuentasBancarias.filter(cuenta => {
        // Filtro por código de cuenta contable
        if (filtros.codigoCuenta && !cuenta.codigoCuentaContable.includes(filtros.codigoCuenta)) {
          return false;
        }

        // Filtro por nombre de banco
        if (filtros.nombreBanco && !cuenta.banco.toLowerCase().includes(filtros.nombreBanco.toLowerCase())) {
          return false;
        }

        // Filtro por número de cuenta
        if (filtros.numeroCuenta && !cuenta.numeroCuenta.includes(filtros.numeroCuenta)) {
          return false;
        }

        // Filtro por tipo de cuenta
        if (filtros.tipoCuenta && cuenta.tipoCuenta !== filtros.tipoCuenta) {
          return false;
        }

        // Filtro por moneda
        if (filtros.moneda && cuenta.moneda !== filtros.moneda) {
          return false;
        }

        // Filtro por estado
        if (filtros.estado === 'activa' && !cuenta.activa) {
          return false;
        }
        if (filtros.estado === 'inactiva' && cuenta.activa) {
          return false;
        }

        // Filtro por fecha de apertura
        if (filtros.fechaDesde && new Date(cuenta.fechaApertura) < new Date(filtros.fechaDesde)) {
          return false;
        }
        if (filtros.fechaHasta && new Date(cuenta.fechaApertura) > new Date(filtros.fechaHasta)) {
          return false;
        }

        // Filtro por incluir inactivas
        if (!filtros.incluirInactivas && !cuenta.activa) {
          return false;
        }
        return true;
      });
      setCuentasBancarias(datosFiltrados);
      calcularTotales(datosFiltrados);
      setLoading(false);
    }, 500);
  };

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setFiltros({
      codigoCuenta: '',
      nombreBanco: '',
      numeroCuenta: '',
      tipoCuenta: null,
      moneda: null,
      estado: null,
      fechaDesde: null,
      fechaHasta: null,
      incluirInactivas: false
    });
    // Aquí podrías también resetear los datos a su estado original
  };

  // Función para redirigir a movimientos contables
  const redirectToMovimientos = cuenta => {
    const params = new URLSearchParams();
    params.append('cuentaId', cuenta.id);
    params.append('codigoCuenta', cuenta.codigoCuentaContable);
    params.append('nombreCuenta', encodeURIComponent(cuenta.nombreCuentaContable));
    params.append('banco', encodeURIComponent(cuenta.banco));
    params.append('numeroCuenta', cuenta.numeroCuenta);
    params.append('moneda', cuenta.moneda);
    window.location.href = `ReportesMovimientoAuxiliar?${params.toString()}`;
  };

  // Formatear número para saldos monetarios
  const formatCurrency = (value, currency = 'DOP') => {
    return value.toLocaleString('es-DO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Formatear fecha
  const formatDate = date => {
    return date.toLocaleDateString('es-DO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // Templates para columnas clickeables
  const saldoDisponibleTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-primary cursor-pointer",
      style: {
        textDecoration: 'underline'
      },
      onClick: () => redirectToMovimientos(rowData)
    }, formatCurrency(rowData.saldoDisponible, rowData.moneda));
  };
  const saldoContableTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: "text-primary cursor-pointer",
      style: {
        textDecoration: 'underline'
      },
      onClick: () => redirectToMovimientos(rowData)
    }, formatCurrency(rowData.saldoContable, rowData.moneda));
  };

  // Template para el estado (activo/inactivo)
  const estadoTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.activa ? 'bg-success' : 'bg-secondary'}`
    }, rowData.activa ? 'Activa' : 'Inactiva');
  };

  // Footer para los totales
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Registros:"), " ", totalRegistros), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Disponible:"), /*#__PURE__*/React.createElement("span", {
    className: "text-primary cursor-pointer ml-2",
    style: {
      textDecoration: 'underline'
    },
    onClick: () => window.location.href = "ReportesMovimientoAuxiliar"
  }, formatCurrency(totalSaldoDisponible))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Saldo Contable:"), /*#__PURE__*/React.createElement("span", {
    className: "text-primary cursor-pointer ml-2",
    style: {
      textDecoration: 'underline'
    },
    onClick: () => window.location.href = "ReportesMovimientoAuxiliar"
  }, formatCurrency(totalSaldoContable))));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: '0 15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Gesti\xF3n de Cuentas Bancarias"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Cuenta Bancaria",
    icon: "pi pi-plus",
    className: "btn btn-primary",
    onClick: () => console.log('Nueva cuenta bancaria')
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "C\xF3digo Cuenta Contable"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.codigoCuenta,
    onChange: e => handleFilterChange('codigoCuenta', e.target.value),
    placeholder: "Buscar por c\xF3digo...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Nombre del Banco"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.nombreBanco,
    onChange: e => handleFilterChange('nombreBanco', e.target.value),
    placeholder: "Buscar por banco...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de Cuenta"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroCuenta,
    onChange: e => handleFilterChange('numeroCuenta', e.target.value),
    placeholder: "Buscar por n\xFAmero...",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo de Cuenta"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipoCuenta,
    options: tiposCuenta,
    onChange: e => handleFilterChange('tipoCuenta', e.value),
    optionLabel: "label",
    placeholder: "Seleccione tipo",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Moneda"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.moneda,
    options: monedas,
    onChange: e => handleFilterChange('moneda', e.value),
    optionLabel: "label",
    placeholder: "Seleccione moneda",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.estado,
    options: opcionesEstado,
    onChange: e => handleFilterChange('estado', e.value),
    optionLabel: "label",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha Apertura Desde"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaDesde,
    onChange: e => handleFilterChange('fechaDesde', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/aaaa",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha Apertura Hasta"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaHasta,
    onChange: e => handleFilterChange('fechaHasta', e.value),
    dateFormat: "dd/mm/yy",
    placeholder: "dd/mm/aaaa",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field-checkbox"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "incluirInactivas",
    checked: filtros.incluirInactivas,
    onChange: e => handleFilterChange('incluirInactivas', e.checked)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "incluirInactivas",
    className: "ml-2"
  }, "Incluir cuentas inactivas"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "btn btn-phoenix-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Buscar",
    className: "btn btn-primary",
    icon: "pi pi-search",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Cuentas Bancarias"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: cuentasBancarias,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron cuentas bancarias",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales
  }, /*#__PURE__*/React.createElement(Column, {
    field: "codigoCuentaContable",
    header: "C\xF3digo Contable",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombreCuentaContable",
    header: "Nombre Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "banco",
    header: "Banco",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "numeroCuenta",
    header: "N\xFAmero de Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipoCuenta",
    header: "Tipo de Cuenta",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "moneda",
    header: "Moneda",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoDisponible",
    header: "Saldo Disponible",
    body: saldoDisponibleTemplate,
    style: {
      textAlign: 'right'
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "saldoContable",
    header: "Saldo Contable",
    body: saldoContableTemplate,
    style: {
      textAlign: 'right'
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fechaApertura",
    header: "Fecha Apertura",
    body: rowData => formatDate(rowData.fechaApertura),
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "activa",
    header: "Estado",
    body: estadoTemplate,
    sortable: true
  }))));
};