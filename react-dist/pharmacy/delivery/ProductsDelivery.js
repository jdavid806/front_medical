import React, { useState } from 'react';
import useTimer from "../../components/timer/hooks/useTimer.js";
import { InputText } from 'primereact/inputtext';
import { ProductDeliveryDetail } from "./ProductDeliveryDetail.js";
import { Tag } from 'primereact/tag';
import { formatDateDMY } from "../../../services/utilidades.js";
import { Divider } from 'primereact/divider';
import { useSuppliesDeliveries } from "../supplies/hooks/useSuppliesDeliveries.js";
export const ProductsDelivery = () => {
  const {
    formatCurrentTime
  } = useTimer({
    autoStart: true,
    interval: 1000
  });
  const {
    suppliesDeliveries
  } = useSuppliesDeliveries();
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h4", null, "ProductsDelivery"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("span", null, new Date().toISOString().split('T')[0]), /*#__PURE__*/React.createElement("span", null, formatCurrentTime(true)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary"
  }, "Nueva Solicitud"))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex",
    style: {
      width: '300px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
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
    onClick: () => setSelectedDelivery(delivery)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Pedido #", delivery.id), /*#__PURE__*/React.createElement(Tag, {
    value: "En espera"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, formatDateDMY(delivery.created_at)))))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex w-100 flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, selectedDelivery && /*#__PURE__*/React.createElement(ProductDeliveryDetail, {
    deliveryId: selectedDelivery?.id
  }), !selectedDelivery && /*#__PURE__*/React.createElement("p", null, "Seleccione un pedido")))))));
};