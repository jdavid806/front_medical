import React, { useEffect, useState } from "react";
import { Tag } from "primereact/tag";
import { formatDateDMY } from "../../../services/utilidades.js";
import { useProductDelivery } from "./hooks/useProductDelivery.js";
import { MedicalSupplyManager } from "../../helpers/MedicalSupplyManager.js";
import "../../extensions/number.extensions.js";
export const ProductDeliveryDetail = ({
  deliveryId
}) => {
  const {
    delivery,
    getDelivery
  } = useProductDelivery();
  const [deliveryManager, setDeliveryManager] = useState(null);
  useEffect(() => {
    getDelivery(deliveryId);
  }, [deliveryId]);
  useEffect(() => {
    if (delivery) {
      setDeliveryManager(new MedicalSupplyManager(delivery));
    }
  }, [delivery]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Pedido #", delivery?.id), /*#__PURE__*/React.createElement(Tag, {
    value: "En espera"
  })), /*#__PURE__*/React.createElement("p", null, "Creado: ", formatDateDMY(delivery?.created_at)), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("b", null, "Detalles de productos"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, deliveryManager?.getSubtotal().currency())), /*#__PURE__*/React.createElement("span", null, "Impuestos"), /*#__PURE__*/React.createElement("span", null, "Descuento"))))));
};