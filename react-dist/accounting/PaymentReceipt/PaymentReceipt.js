import React, { useState } from 'react';
import { Button, Dropdown, InputText, InputTextarea, Calendar, Dialog } from 'primereact';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
export const PaymentReceiptModal = ({
  visible,
  onHide,
  onSubmit,
  initialData = {}
}) => {
  const [formData, setFormData] = useState({
    tipo: 'RP - 1 - recibo de pago egreso',
    proveedor: '',
    fecha: null,
    costo: '',
    dinero: '',
    valorPagado: '',
    observaciones: '',
    ...initialData
  });
  const tipoOptions = [{
    label: 'RP - 1 - recibo de pago egreso',
    value: 'RP - 1 - recibo de pago egreso'
  }];
  const costoOptions = [{
    label: 'Opción 1',
    value: 'opcion1'
  }, {
    label: 'Opción 2',
    value: 'opcion2'
  }];
  const dineroOptions = [{
    label: 'Opción 1',
    value: 'opcion1'
  }, {
    label: 'Opción 2',
    value: 'opcion2'
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
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleCancel = () => {
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo recibo de pago",
    visible: visible,
    style: {
      width: '50vw'
    },
    onHide: onHide,
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tipo",
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "tipo",
    value: formData.tipo,
    options: tipoOptions,
    disabled: true,
    className: "w-100",
    onChange: e => onDropdownChange(e, 'tipo')
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "proveedor",
    className: "form-label"
  }, "Proveedor / Otras"), /*#__PURE__*/React.createElement(InputText, {
    id: "proveedor",
    name: "proveedor",
    value: formData.proveedor,
    onChange: onInputChange,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3 mb-md-0"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fecha",
    className: "form-label"
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fecha",
    name: "fecha",
    value: formData.fecha ? new Date(formData.fecha) : null,
    onChange: onDateChange,
    dateFormat: "mm/dd/yy",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "valorPagado",
    className: "form-label"
  }, "Valor pagado"), /*#__PURE__*/React.createElement(InputText, {
    id: "valorPagado",
    name: "valorPagado",
    value: formData.valorPagado,
    onChange: onInputChange,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3 mb-md-0"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "costo",
    className: "form-label"
  }, "Costo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "costo",
    value: formData.costo,
    options: costoOptions,
    onChange: e => onDropdownChange(e, 'costo'),
    name: "costo",
    placeholder: "Seleccionar",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dinero",
    className: "form-label"
  }, "De donde sale el dinero"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "dinero",
    value: formData.dinero,
    options: dineroOptions,
    onChange: e => onDropdownChange(e, 'dinero'),
    name: "dinero",
    placeholder: "Seleccionar",
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
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
    rows: 5,
    className: "w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-secondary",
    onClick: handleCancel
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y descargar",
    type: "submit",
    className: "p-button-primary"
  })))));
};