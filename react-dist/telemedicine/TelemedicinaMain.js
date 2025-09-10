import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { RecordingModal } from "./modals/RecordingModal.js";
import { VideoConsultationModal } from "./modals/VideoConsultationModal.js";
import { ReportModal } from "./modals/ReportModal.js";
export const TelemedicinaMain = () => {
  const [citas] = useState([{
    id: 1,
    doctor: "Juan Pérez",
    fecha: "2025-10-18",
    paciente: "Camilo Cruz",
    telefono: "555-1234",
    correo: "juan.perez@example.com",
    motivo: "Consulta general",
    estado: 'pendiente'
  }, {
    id: 2,
    doctor: "María García",
    fecha: "2025-10-19",
    paciente: "Ana López",
    telefono: "555-5678",
    correo: "maria.garcia@example.com",
    motivo: "Seguimiento tratamiento",
    estado: 'confirmada'
  }, {
    id: 3,
    doctor: "Carlos Rodríguez",
    fecha: "2025-10-20",
    paciente: "Luis Martínez",
    telefono: "555-9012",
    correo: "carlos.rodriguez@example.com",
    motivo: "Segunda opinión",
    estado: 'completada'
  }]);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [modalGrabacionVisible, setModalGrabacionVisible] = useState(false);
  const [modalReporteVisible, setModalReporteVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const items = [{
    label: 'Inicio',
    url: '/portada'
  }, {
    label: 'Citas telemedicina',
    url: ''
  }];
  const home = {
    icon: 'pi pi-home',
    url: '/'
  };
  const estadoBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Badge, {
      value: rowData.estado,
      severity: rowData.estado === 'pendiente' ? 'warning' : rowData.estado === 'confirmada' ? 'info' : rowData.estado === 'completada' ? 'success' : 'danger',
      className: "text-capitalize"
    });
  };
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-calendar"
      }),
      className: "p-button-outlined p-button-success mb-1 btn-iniciar",
      label: "Iniciar video",
      onClick: () => {
        setCitaSeleccionada(rowData);
        setModalVideoVisible(true);
      }
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-calendar"
      }),
      className: "p-button-outlined p-button-danger mb-1 btn-no-asistio",
      label: "No asisti\xF3"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-video"
      }),
      className: "p-button-outlined p-button-info btn-grabaciones",
      label: "Grabaciones",
      onClick: () => {
        setCitaSeleccionada(rowData);
        setModalGrabacionVisible(true);
      }
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0 text-primary"
  }, "Citas de Telemedicina"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-file-pdf",
    label: "Generar Reporte",
    className: "p-button-outlined p-button-help",
    onClick: () => setModalReporteVisible(true)
  })), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm border-0"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: citas,
    responsiveLayout: "stack",
    breakpoint: "960px",
    paginator: true,
    rows: 5,
    rowsPerPageOptions: [5, 10, 25],
    className: "p-datatable-sm p-datatable-striped p-datatable-gridlines",
    emptyMessage: "No se encontraron citas"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "doctor",
    header: "Doctor",
    sortable: true,
    filter: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "fecha",
    header: "Fecha",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "paciente",
    header: "Paciente",
    sortable: true,
    filter: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "telefono",
    header: "Tel\xE9fono"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "correo",
    header: "Correo"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "motivo",
    header: "Motivo"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "estado",
    header: "Estado",
    body: estadoBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: accionesBodyTemplate,
    header: "Acciones",
    exportable: false,
    style: {
      minWidth: '200px'
    }
  }))))), /*#__PURE__*/React.createElement(VideoConsultationModal, {
    visible: modalVideoVisible,
    onHide: () => setModalVideoVisible(false),
    cita: citaSeleccionada
  }), /*#__PURE__*/React.createElement(RecordingModal, {
    visible: modalGrabacionVisible,
    onHide: () => setModalGrabacionVisible(false),
    cita: citaSeleccionada
  }), /*#__PURE__*/React.createElement(ReportModal, {
    visible: modalReporteVisible,
    onHide: () => setModalReporteVisible(false)
  }));
};
export default TelemedicinaMain;