import React, { useState } from "react";
import { Button, Dropdown, InputTextarea, Calendar, FileUpload, InputNumber, Dialog } from "primereact";
export const NewReceiptBoxModal = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload
}) => {
  const [formData, setFormData] = useState({
    tipo: "",
    clientes: "",
    realizarUn: "",
    origenDinero: "",
    numeroFactura: 0,
    fechaElaboracion: null,
    centroCosto: "",
    valorPagado: 0,
    observaciones: "",
    archivo: null
  });

  // Datos mock para los dropdowns
  const tipoOptions = [{
    label: "Opción 1",
    value: "opcion1"
  }, {
    label: "Opción 2",
    value: "opcion2"
  }, {
    label: "Opción 3",
    value: "opcion3"
  }];
  const clientesOptions = [{
    label: "Cliente A",
    value: "clienteA"
  }, {
    label: "Cliente B",
    value: "clienteB"
  }, {
    label: "Cliente C",
    value: "clienteC"
  }];
  const realizarUnOptions = [{
    label: "Acción 1",
    value: "accion1"
  }, {
    label: "Acción 2",
    value: "accion2"
  }, {
    label: "Acción 3",
    value: "accion3"
  }];
  const origenDineroOptions = [{
    label: "Caja menor",
    value: "caja_menor"
  }, {
    label: "Cuenta corriente",
    value: "cuenta_corriente"
  }, {
    label: "Fondo de reserva",
    value: "fondo_reserva"
  }];
  const centroCostoOptions = [{
    label: "Administración",
    value: "admin"
  }, {
    label: "Ventas",
    value: "ventas"
  }, {
    label: "Producción",
    value: "produccion"
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
        fechaElaboracion: e.value
      }));
    }
  };
  const onNumberChange = (e, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.value
    }));
  };
  const onFileUpload = e => {
    setFormData(prev => ({
      ...prev,
      archivo: e.files[0]
    }));
  };
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };
  const handleSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };
  const handleSaveAndDownload = () => {
    if (onSaveAndDownload) {
      onSaveAndDownload(formData);
    }
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo recibo de Caja",
    visible: visible,
    style: {
      width: "80vw"
    },
    onHide: onHide,
    maximizable: true,
    modal: true,
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tipo",
    className: "form-label"
  }, "Tipo"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "tipo",
    value: formData.tipo,
    options: tipoOptions,
    onChange: e => onDropdownChange(e, "tipo"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "clientes",
    className: "form-label"
  }, "Clientes"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "clientes",
    value: formData.clientes,
    options: clientesOptions,
    onChange: e => onDropdownChange(e, "clientes"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "realizarUn",
    className: "form-label"
  }, "Realizar un"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "realizarUn",
    value: formData.realizarUn,
    options: realizarUnOptions,
    onChange: e => onDropdownChange(e, "realizarUn"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "origenDinero",
    className: "form-label"
  }, "De donde ingresa el dinero"), /*#__PURE__*/React.createElement(Dropdown, {
    id: "origenDinero",
    value: formData.origenDinero,
    options: origenDineroOptions,
    onChange: e => onDropdownChange(e, "origenDinero"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "numeroFactura",
    className: "form-label"
  }, "N\xFAmero de factura (N\xFAmeraci\xF3n autom\xE1tica)"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "numeroFactura",
    value: formData.numeroFactura,
    onValueChange: e => onNumberChange(e, "numeroFactura"),
    mode: "decimal",
    className: "w-100",
    disabled: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaElaboracion",
    className: "form-label"
  }, "Fecha de elaboraci\xF3n"), /*#__PURE__*/React.createElement(Calendar, {
    id: "fechaElaboracion",
    value: formData.fechaElaboracion,
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
    onChange: e => onDropdownChange(e, "centroCosto"),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true,
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "valorPagado",
    className: "form-label"
  }, "Valor pagado"), /*#__PURE__*/React.createElement(InputNumber, {
    id: "valorPagado",
    value: formData.valorPagado,
    onValueChange: e => onNumberChange(e, "valorPagado"),
    mode: "currency",
    currency: "USD",
    locale: "en-US",
    className: "w-100"
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
  }, "Agregar archivo"), /*#__PURE__*/React.createElement(FileUpload, {
    mode: "basic",
    name: "archivo",
    accept: "image/*,.pdf,.doc,.docx",
    maxFileSize: 1000000,
    chooseLabel: "Seleccionar archivo",
    className: "w-100",
    onUpload: onFileUpload
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-secondary",
    onClick: onHide
  }), onSaveAndDownload && /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Descargar",
    icon: "fa fa-plus",
    className: "btn btn-phoenix-secondary",
    onClick: handleSaveAndDownload
  }), onSave && /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "fa fa-plus",
    className: "btn btn-primary",
    onClick: handleSave
  }))));
};