import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { MedicationPrescriptionManager } from "./helpers/MedicationPrescriptionManager.js";
export const MedicationDeliveryDetailDialog = ({
  visible,
  onHide,
  prescription
}) => {
  if (!prescription) return null;
  const [medicationPrescriptionManager, setMedicationPrescriptionManager] = useState(null);
  useEffect(() => {
    if (prescription) {
      setMedicationPrescriptionManager(new MedicationPrescriptionManager(prescription));
    }
  }, [prescription]);
  const headerTemplate = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center w-100"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, "Detalle de Solicitud #", prescription.id), /*#__PURE__*/React.createElement(Tag, {
    value: medicationPrescriptionManager?.statusLabel,
    severity: medicationPrescriptionManager?.statusSeverity,
    className: "fs-6"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: headerTemplate,
    visible: visible,
    onHide: onHide,
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n del paciente"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.patient?.name || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.patient?.email || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.patient?.phone || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.patient?.address || '--')))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Card, {
    title: "M\xE9dico Prescriptor"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Nombre: "), /*#__PURE__*/React.createElement("span", null, `${medicationPrescriptionManager?.prescriber?.name || ''}`)), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Correo electr\xF3nico: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.prescriber?.email || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.prescriber?.phone || '--')), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("strong", null, "Direcci\xF3n: "), /*#__PURE__*/React.createElement("span", null, medicationPrescriptionManager?.prescriber?.address || '--'))))), /*#__PURE__*/React.createElement(Card, {
    title: `Medicamentos Solicitados (${prescription.recipe_items.length})`,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "table-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Medicamento"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Cantidad"))), /*#__PURE__*/React.createElement("tbody", null, prescription.recipe_items.map(item => /*#__PURE__*/React.createElement("tr", {
    key: item.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-bold"
  }, item.medication), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, item.concentration))), /*#__PURE__*/React.createElement("td", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge bg-primary fs-6"
  }, item.quantity)))))))), /*#__PURE__*/React.createElement(Card, {
    title: "Resumen del Estado"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-boxes fa-2x text-primary mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, medicationPrescriptionManager?.products.length), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Medicamentos solicitados"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-cubes fa-2x text-info mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, medicationPrescriptionManager?.products.reduce((total, item) => total + item.quantity, 0)), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Total de unidades"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clock fa-2x text-warning mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, medicationPrescriptionManager?.statusLabel), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Estado actual")))))));
};