import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FileUpload } from 'primereact/fileupload';
import { Tooltip } from 'primereact/tooltip';
export const RecordingModal = ({
  visible,
  onHide,
  cita
}) => {
  const [grabaciones, setGrabaciones] = useState([{
    id: 1,
    fecha: '2025-10-16 10:30:45',
    nombre: 'Consulta completa',
    archivo: 'grabacion1.mp4'
  }, {
    id: 2,
    fecha: '2025-10-16 10:45:22',
    nombre: 'Segmento importante',
    archivo: 'grabacion2.mp4'
  }]);
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      target: ".view-btn",
      content: "Ver grabaci\xF3n"
    }), /*#__PURE__*/React.createElement(Tooltip, {
      target: ".download-btn",
      content: "Descargar"
    }), /*#__PURE__*/React.createElement(Tooltip, {
      target: ".delete-btn",
      content: "Eliminar"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-eye",
      className: "p-button-rounded p-button-text p-button-info view-btn mr-1"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-download",
      className: "p-button-rounded p-button-text p-button-success download-btn mr-1"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-trash",
      className: "p-button-rounded p-button-text p-button-danger delete-btn"
    }));
  };
  const fechaBodyTemplate = rowData => {
    return new Date(rowData.fecha).toLocaleString();
  };
  const footerContent = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: onHide,
    className: "p-button-text"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-cloud-upload mr-2"
    }), " Gesti\xF3n de Grabaciones"),
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '900px'
    },
    footer: footerContent,
    onHide: onHide,
    className: "recording-modal"
  }, cita && /*#__PURE__*/React.createElement(Card, {
    className: "mb-4 border-0",
    title: "Informaci\xF3n de la cita"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-ticket mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "ID Cita:"), " ", cita.id), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calendar mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Fecha:"), " ", cita.fecha)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Paciente:"), " ", cita.paciente), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user-md mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "M\xE9dico:"), " ", cita.doctor)))), /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-upload mr-2"
    }), " Subir nueva grabaci\xF3n"),
    className: "mb-4 border-0"
  }, /*#__PURE__*/React.createElement(FileUpload, {
    mode: "advanced",
    name: "grabacion",
    url: "/api/upload",
    accept: "video/*",
    maxFileSize: 100000000,
    chooseLabel: "Seleccionar archivo",
    uploadLabel: "Subir",
    cancelLabel: "Cancelar",
    customUpload: true,
    className: "w-full",
    emptyTemplate: /*#__PURE__*/React.createElement("p", {
      className: "m-0"
    }, "Arrastra y suelta un archivo de video aqu\xED.")
  })), /*#__PURE__*/React.createElement(Card, {
    title: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-list mr-2"
    }), " Grabaciones existentes"),
    className: "border-0"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: grabaciones,
    responsiveLayout: "stack",
    breakpoint: "768px",
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "fecha",
    header: "Fecha",
    body: fechaBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nombre",
    header: "Nombre",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: accionesBodyTemplate,
    header: "Acciones",
    style: {
      width: '150px'
    }
  }))));
};