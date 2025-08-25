import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { PaymentReceiptModal } from "./PaymentReceiptModal.js";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export const PaymentReceiptTable = () => {
  // Estado para los datos
  const [recibos, setRecibos] = useState([]);
  const [loading, setLoading] = useState(false);

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [reciboEdit, setReciboEdit] = useState(null);

  // Estado para los filtros
  const [filtros, setFiltros] = useState({
    numeroRecibo: "",
    proveedor: "",
    tipo: null,
    fechaInicio: null,
    fechaFin: null,
    valorMinimo: null,
    valorMaximo: null,
    estado: null
  });

  // Opciones para dropdowns
  const tiposRecibo = [{
    label: 'RP - 1 - recibo de pago egreso',
    value: 'RP - 1 - recibo de pago egreso'
  }];
  const estadosRecibo = [{
    label: 'Pendiente',
    value: 'Pendiente'
  }, {
    label: 'Pagado',
    value: 'Pagado'
  }, {
    label: 'Anulado',
    value: 'Anulado'
  }, {
    label: 'Rechazado',
    value: 'Rechazado'
  }];

  // Cargar datos iniciales
  useEffect(() => {
    setLoading(true);
    // Simular carga de API
    setTimeout(() => {
      const mockData = [{
        id: "1",
        numeroRecibo: "RP-2023-0001",
        tipo: "RP - 1 - recibo de pago egreso",
        proveedor: "Proveedor Ejemplo 1",
        fecha: new Date(2023, 5, 15),
        costo: "opcion1",
        origenDinero: "opcion1",
        valorPagado: 15000,
        estado: "Pagado",
        observaciones: "Pago por servicios profesionales"
      }, {
        id: "2",
        numeroRecibo: "RP-2023-0002",
        tipo: "RP - 1 - recibo de pago egreso",
        proveedor: "Proveedor Ejemplo 2",
        fecha: new Date(2023, 5, 18),
        costo: "opcion2",
        origenDinero: "opcion2",
        valorPagado: 23500,
        estado: "Pendiente",
        observaciones: "Compra de materiales"
      }];
      setRecibos(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  // Manejadores de filtros
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const aplicarFiltros = () => {
    setLoading(true);
    // Aquí iría la llamada a la API con los filtros
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };
  const limpiarFiltros = () => {
    setFiltros({
      numeroRecibo: "",
      proveedor: "",
      tipo: null,
      fechaInicio: null,
      fechaFin: null,
      valorMinimo: null,
      valorMaximo: null,
      estado: null
    });
  };

  // Formateadores
  const formatCurrency = value => {
    return value.toLocaleString('es-DO', {
      style: 'currency',
      currency: 'DOP'
    });
  };
  const formatDate = value => {
    return value.toLocaleDateString('es-DO');
  };

  // Estilo para tags de estado
  const getEstadoSeverity = estado => {
    switch (estado) {
      case 'Pagado':
        return 'success';
      case 'Pendiente':
        return 'warning';
      case 'Anulado':
      case 'Rechazado':
        return 'danger';
      default:
        return null;
    }
  };

  // Acciones para la tabla
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-pencil",
      className: "p-button-rounded p-button-success p-button-text",
      tooltip: "Editar",
      onClick: () => {
        setReciboEdit(rowData);
        setShowModal(true);
      }
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-danger p-button-text",
      tooltip: "Anular",
      onClick: () => anularRecibo(rowData.id),
      disabled: rowData.estado === 'Anulado'
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-download",
      className: "p-button-rounded p-button-info p-button-text",
      tooltip: "Descargar",
      onClick: () => descargarRecibo(rowData.id)
    }));
  };
  const anularRecibo = id => {
    // Lógica para anular recibo
    setRecibos(recibos.map(r => r.id === id ? {
      ...r,
      estado: 'Anulado'
    } : r));
  };
  const descargarRecibo = id => {
    // Lógica para descargar recibo
    console.log(`Descargando recibo ${id}`);
  };

  // Manejar submit del modal
  const handleSubmitRecibo = formData => {
    if (reciboEdit) {
      // Editar recibo existente
      setRecibos(recibos.map(r => r.id === reciboEdit.id ? {
        ...r,
        ...formData
      } : r));
    } else {
      // Crear nuevo recibo
      const nuevoRecibo = {
        id: Math.random().toString(36).substring(2, 9),
        numeroRecibo: `RP-2023-${(recibos.length + 1).toString().padStart(4, '0')}`,
        estado: 'Pendiente',
        ...formData
      };
      setRecibos([...recibos, nuevoRecibo]);
    }
    setShowModal(false);
    setReciboEdit(null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 text-end"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Recibo",
    icon: "pi pi-plus",
    className: "p-button-primary",
    onClick: () => {
      setReciboEdit(null);
      setShowModal(true);
    }
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Filtros de B\xFAsqueda",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 lg:col-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "N\xFAmero de Recibo"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroRecibo,
    onChange: e => handleFilterChange('numeroRecibo', e.target.value),
    placeholder: "Ej: RP-2023-0001",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 lg:col-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.tipo,
    options: tiposRecibo,
    onChange: e => handleFilterChange('tipo', e.value),
    placeholder: "Seleccionar tipo",
    className: "w-full"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 lg:col-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Fecha desde"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaInicio,
    onChange: e => handleFilterChange('fechaInicio', e.value),
    dateFormat: "dd/mm/yy",
    className: "w-full",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6 lg:col-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block mb-2"
  }, "Fecha hasta"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaFin,
    onChange: e => handleFilterChange('fechaFin', e.value),
    dateFormat: "dd/mm/yy",
    className: "w-full",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-filter-slash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: aplicarFiltros,
    loading: loading
  })))), /*#__PURE__*/React.createElement(Card, {
    title: "Recibos de Pago"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: recibos,
    loading: loading,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25],
    emptyMessage: "No se encontraron recibos",
    responsiveLayout: "scroll"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "numeroRecibo",
    header: "N\xFAmero",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "proveedor",
    header: "Proveedor",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "tipo",
    header: "Tipo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fecha",
    header: "Fecha",
    sortable: true,
    body: rowData => formatDate(rowData.fecha)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "valorPagado",
    header: "Valor",
    sortable: true,
    body: rowData => formatCurrency(rowData.valorPagado)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "estado",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.estado,
      severity: getEstadoSeverity(rowData.estado)
    })
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: accionesBodyTemplate,
    style: {
      width: '180px'
    }
  }))), /*#__PURE__*/React.createElement(PaymentReceiptModal, {
    visible: showModal,
    onHide: () => {
      setShowModal(false);
      setReciboEdit(null);
    },
    onSubmit: handleSubmitRecibo,
    initialData: reciboEdit || undefined
  }));
};