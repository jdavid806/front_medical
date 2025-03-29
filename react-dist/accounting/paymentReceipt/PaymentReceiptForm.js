import React, { useState } from 'react';
import { Button, Dropdown, InputText, InputTextarea, Calendar, FileUpload } from 'primereact';
export const PaymentReceiptForm = () => {
  const [formData, setFormData] = useState({
    tipo: '',
    proveedor: '',
    numeroFactura: '',
    fecha: null,
    centroCosto: '',
    costo: '',
    dinero: '',
    valorPagado: '',
    observaciones: '',
    archivo: null
  });

  // Datos mock para los dropdowns
  const tipoOptions = [{
    label: 'RP - 1 - Recibo de pago egreso',
    value: 'RP - 1 - Recibo de pago egreso'
  }, {
    label: 'RP - 2 - Recibo de pago ingreso',
    value: 'RP - 2 - Recibo de pago ingreso'
  }, {
    label: 'RC - 1 - Recibo de caja',
    value: 'RC - 1 - Recibo de caja'
  }, {
    label: 'RC - 2 - Comprobante de egreso',
    value: 'RC - 2 - Comprobante de egreso'
  }];
  const centroCostoOptions = [{
    label: 'Administración',
    value: 'admin'
  }, {
    label: 'Ventas',
    value: 'ventas'
  }, {
    label: 'Producción',
    value: 'produccion'
  }, {
    label: 'Marketing',
    value: 'marketing'
  }, {
    label: 'TI',
    value: 'ti'
  }];
  const costoOptions = [{
    label: 'Materiales',
    value: 'materiales'
  }, {
    label: 'Servicios',
    value: 'servicios'
  }, {
    label: 'Nómina',
    value: 'nomina'
  }, {
    label: 'Logística',
    value: 'logistica'
  }, {
    label: 'Otros',
    value: 'otros'
  }];
  const dineroOptions = [{
    label: 'Caja menor',
    value: 'caja_menor'
  }, {
    label: 'Cuenta corriente',
    value: 'cuenta_corriente'
  }, {
    label: 'Fondo de reserva',
    value: 'fondo_reserva'
  }, {
    label: 'Inversiones',
    value: 'inversiones'
  }, {
    label: 'Otro origen',
    value: 'otro'
  }];
  const onInputChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const onDropdownChange = (e, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.value
    }));
  };
  const onDateChange = e => {
    if (e.value && !Array.isArray(e.value)) {
      setFormData(prev => ({
        ...prev,
        fecha: e.value
      }));
    }
  };
  const onFileUpload = e => {
    setFormData(prev => ({
      ...prev,
      archivo: e.files[0]
    }));
  };
  const onSubmit = e => {
    e.preventDefault();
    console.log('Form data submitted: ', formData);
    // Lógica de envío aquí
  };
  const onCancel = () => {
    console.log('Form cancelled');
    // Lógica de cancelación aquí
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12 col-lg-10"
  }, " ", /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-primary text-white"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h4 mb-0"
  }, "Nuevo recibo de pago")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: onSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tipo",
    className: "form-label"
  }, "Tipo de documento"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "tipo",
    value: formData.tipo,
    options: tipoOptions,
    onChange: e => onDropdownChange(e, 'tipo'),
    placeholder: "Seleccione el tipo",
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "proveedor",
    className: "form-label"
  }, "Proveedor / Otras entidades"), /*#__PURE__*/React.createElement(InputText, {
    id: "proveedor",
    name: "proveedor",
    value: formData.proveedor,
    onChange: onInputChange,
    className: "w-100",
    placeholder: "Nombre del proveedor"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "costo",
    className: "form-label"
  }, "Costo asociado"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "costo",
    value: formData.costo,
    options: costoOptions,
    onChange: e => onDropdownChange(e, 'costo'),
    placeholder: "Seleccione el costo",
    className: "w-100",
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dinero",
    className: "form-label"
  }, "Origen del dinero"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "dinero",
    value: formData.dinero,
    options: dineroOptions,
    onChange: e => onDropdownChange(e, 'dinero'),
    placeholder: "Seleccione el origen",
    className: "w-100",
    filter: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "numeroFactura",
    className: "form-label"
  }, "N\xFAmero de factura"), /*#__PURE__*/React.createElement(InputText, {
    id: "numeroFactura",
    name: "numeroFactura",
    value: formData.numeroFactura,
    onChange: onInputChange,
    className: "w-100",
    placeholder: "N\xFAmero de documento"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fecha",
    className: "form-label"
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fecha",
    value: formData.fecha,
    onChange: onDateChange,
    dateFormat: "dd/mm/yy",
    className: "w-100",
    showIcon: true,
    placeholder: "Seleccione la fecha"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "centroCosto",
    className: "form-label"
  }, "Centro de costo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "centroCosto",
    value: formData.centroCosto,
    options: centroCostoOptions,
    onChange: e => onDropdownChange(e, 'centroCosto'),
    placeholder: "Seleccione centro",
    className: "w-100",
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "valorPagado",
    className: "form-label"
  }, "Valor pagado ($)"), /*#__PURE__*/React.createElement(InputText, {
    id: "valorPagado",
    name: "valorPagado",
    value: formData.valorPagado,
    onChange: onInputChange,
    className: "w-100",
    placeholder: "0.00",
    keyfilter: "money"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "observaciones",
    className: "form-label"
  }, "Observaciones"), /*#__PURE__*/React.createElement(InputTextarea, {
    id: "observaciones",
    name: "observaciones",
    value: formData.observaciones,
    onChange: onInputChange,
    rows: 3,
    className: "w-100",
    placeholder: "Detalles adicionales..."
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Adjuntar archivo"), /*#__PURE__*/React.createElement(FileUpload, {
    mode: "basic",
    name: "archivo",
    accept: "image/*,.pdf,.doc,.docx",
    maxFileSize: 1000000,
    chooseLabel: "Seleccionar archivo",
    className: "w-100",
    onUpload: onFileUpload
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-center gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: onCancel
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Descargar",
    icon: "pi pi-save",
    type: "submit",
    className: "p-button-primary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-download",
    className: "p-button-success"
  })))))))));
};