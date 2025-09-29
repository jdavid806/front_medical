import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { Card } from 'primereact/card';
import { formatDateDMY } from "../../../services/utilidades.js";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager.js";
export const ProductDeliveryDetailDialog = ({
  visible,
  onHide,
  delivery
}) => {
  if (!delivery) return null;
  const [deliveryManager, setDeliveryManager] = useState(null);
  useEffect(() => {
    if (delivery) {
      setDeliveryManager(new MedicalSupplyManager(delivery));
    }
  }, [delivery]);
  const headerTemplate = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center w-100"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, "Detalle de Solicitud #", delivery.id), /*#__PURE__*/React.createElement(Tag, {
    value: deliveryManager?.statusLabel,
    severity: deliveryManager?.statusSeverity,
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
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Informaci\xF3n General",
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Solicitado por:"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user me-2 text-primary"
  }), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.name || '--'))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Email:"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-envelope me-2 text-primary"
  }), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.email || '--'))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Direcci\xF3n:"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-map-marker-alt me-2 text-primary"
  }), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.address || '--')))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Fecha de creaci\xF3n:"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar me-2 text-primary"
  }), /*#__PURE__*/React.createElement("span", null, formatDateDMY(delivery.created_at)))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Tel\xE9fono:"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-phone me-2 text-primary"
  }), /*#__PURE__*/React.createElement("span", null, deliveryManager?.requestedBy?.phone || '--'))))), delivery.observations && /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "fw-bold text-muted small"
  }, "Observaciones:"), /*#__PURE__*/React.createElement("div", {
    className: "mt-1 p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sticky-note me-2 text-muted"
  }), delivery.observations)))), /*#__PURE__*/React.createElement(Card, {
    title: `Productos Solicitados (${delivery.products.length})`,
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement("table", {
    className: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", {
    className: "table-light"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Producto"), /*#__PURE__*/React.createElement("th", {
    className: "text-center"
  }, "Cantidad"))), /*#__PURE__*/React.createElement("tbody", null, delivery.products.map(item => /*#__PURE__*/React.createElement("tr", {
    key: item.id
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "fw-bold"
  }, item.product.name), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, item.product.description))), /*#__PURE__*/React.createElement("td", {
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
  }, delivery.products.length), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Productos solicitados"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-cubes fa-2x text-info mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, delivery.products.reduce((total, item) => total + item.quantity, 0)), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Total de unidades"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-clock fa-2x text-warning mb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, deliveryManager?.statusLabel), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Estado actual")))))));
};