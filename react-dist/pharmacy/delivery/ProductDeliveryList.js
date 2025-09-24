import React from "react";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { useSuppliesDeliveries } from "../supplies/hooks/useSuppliesDeliveries.js";
import { formatDateDMY } from "../../../services/utilidades.js";
export const ProductDeliveryList = ({
  onDeliverySelect
}) => {
  const {
    suppliesDeliveries
  } = useSuppliesDeliveries();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Pedidos Pendientes"), /*#__PURE__*/React.createElement("div", {
    className: "input-group"
  }, /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar por # o nombre...",
    id: "searchOrder",
    className: "w-100"
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, suppliesDeliveries.map(delivery => /*#__PURE__*/React.createElement("div", {
    key: delivery.id,
    className: "d-flex flex-column gap-2 cursor-pointer",
    onClick: () => onDeliverySelect(delivery)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("b", {
    className: "card-title mb-0 fs-9"
  }, "Solicitud #", delivery.id), /*#__PURE__*/React.createElement("span", {
    className: `badge bg-warning`
  }, "Pendiente")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "fs-9"
  }, formatDateDMY(delivery.created_at)))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Observaciones: "), /*#__PURE__*/React.createElement("span", null, delivery.observations || 'Sin observaciones')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold"
  }, "Fecha de solicitud: "), /*#__PURE__*/React.createElement("span", null, formatDateDMY(delivery.created_at))), /*#__PURE__*/React.createElement(Divider, null)))));
};