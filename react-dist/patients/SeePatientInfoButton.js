import React from "react";
import { Dialog } from "primereact/dialog";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useState } from "react";
import { PatientInfoContainer } from "./PatientInfoContainer.js";
import { PatientEvolution } from "./PatientEvolution.js";
import { PastMedicalHistoryDetail } from "../past-medical-history/PastMedicalHistoryDetail.js";
import { PreadmissionTable } from "../appointments/PreadmissionTable.js";
import { PrescriptionApp } from "../prescriptions/PrescriptionApp.js";
import ExamApp from "../exams/ExamApp.js";
export const SeePatientInfoButton = props => {
  const {
    patientId = new URLSearchParams(window.location.search).get('patient_id') || new URLSearchParams(window.location.search).get('id') || "0"
  } = props;
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const showDialog = () => {
    setVisible(true);
  };
  const hideDialog = () => {
    setVisible(false);
  };
  const steps = [{
    label: "Datos Generales",
    content: /*#__PURE__*/React.createElement(PatientInfoContainer, {
      patientId: patientId
    })
  }, {
    label: "Antecedentes",
    content: /*#__PURE__*/React.createElement(PastMedicalHistoryDetail, null)
  }, {
    label: "Historial del Paciente",
    content: /*#__PURE__*/React.createElement(PatientEvolution, null)
  }, {
    label: "Historial de Recetas",
    content: /*#__PURE__*/React.createElement(PrescriptionApp, null)
  }, {
    label: "Historial de Examenes",
    content: /*#__PURE__*/React.createElement(ExamApp, null)
  }, {
    label: "Historial de Preadmisiones",
    content: /*#__PURE__*/React.createElement(PreadmissionTable, null)
  }];
  const items = steps.map((step, index) => ({
    label: step.label,
    command: () => setActiveIndex(index)
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Ver Informaci\xF3n del Paciente",
    onClick: showDialog,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user me-2"
    }),
    className: "btn btn-primary"
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: hideDialog,
    header: "Informaci\xF3n del Paciente",
    position: "center",
    style: {
      width: '90vw',
      overflow: 'auto'
    },
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cerrar",
      className: "btn btn-secondary",
      onClick: hideDialog
    }), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end gap-2"
    }, activeIndex > 0 && /*#__PURE__*/React.createElement(Button, {
      label: "Anterior",
      className: "btn btn-secondary",
      onClick: () => setActiveIndex(activeIndex - 1)
    }), activeIndex < steps.length - 1 && /*#__PURE__*/React.createElement(Button, {
      label: "Siguiente",
      className: "btn btn-primary",
      onClick: () => setActiveIndex(activeIndex + 1)
    })))
  }, /*#__PURE__*/React.createElement(Steps, {
    model: items,
    activeIndex: activeIndex,
    onSelect: e => setActiveIndex(e.index),
    readOnly: false,
    className: "mb-4"
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, steps.map((step, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: index === activeIndex ? "" : "d-none"
  }, step.content)))));
};