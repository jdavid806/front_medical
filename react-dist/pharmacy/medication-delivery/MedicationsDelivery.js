import React, { useState } from 'react';
import useTimer from "../../components/timer/hooks/useTimer.js";
import { MedicationDeliveryList } from "./MedicationDeliveryList.js";
import { MedicationDeliveryDetail } from "./MedicationDeliveryDetail.js";
export const ProductsDelivery = () => {
  const {
    formatCurrentTime
  } = useTimer({
    autoStart: true,
    interval: 1000
  });
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [selectedConvenio, setSelectedConvenio] = useState(null);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h4", null, "Entrega de Medicamentos"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("span", null, "Fecha: ", new Date().toISOString().split('T')[0]), /*#__PURE__*/React.createElement("span", null, "Hora: ", formatCurrentTime(true)))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(MedicationDeliveryList, {
    onDeliverySelect: setSelectedDelivery,
    onDeliverySelectConvenio: setSelectedConvenio
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, selectedDelivery && /*#__PURE__*/React.createElement(MedicationDeliveryDetail, {
    deliveryId: selectedDelivery?.id,
    selectedConvenio: selectedConvenio
  }), !selectedDelivery && /*#__PURE__*/React.createElement("p", null, "Seleccione un pedido")))))));
};