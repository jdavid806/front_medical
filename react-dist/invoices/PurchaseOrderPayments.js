import React from "react";
import { usePurchaseOrderPayments } from "./hooks/usePurchaseOrderPayments.js";
import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { formatDate } from "../../services/utilidades.js";
export const PurchaseOrderPayments = ({
  purchaseOrderId
}) => {
  const {
    purchaseOrderPayments,
    fetchPurchaseOrderPayments
  } = usePurchaseOrderPayments();
  const [mappedPurchaseOrderPayments, setMappedPurchaseOrderPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [purchaseOrderTotal, setPurchaseOrderTotal] = useState(0);
  useEffect(() => {
    fetchPurchaseOrderPayments({
      purchaseOrderId
    });
  }, [purchaseOrderId]);
  useEffect(() => {
    if (purchaseOrderPayments.data.length > 0) {
      // Mapear los pagos para la tabla
      setMappedPurchaseOrderPayments(purchaseOrderPayments.data.map(payment => ({
        id: payment.attributes.id.toString(),
        created_at: formatDate(payment.attributes.created_at),
        total_amount: payment.attributes.total_amount,
        payment_method: payment.includes.payments[0].payment_method_name,
        observations: payment.attributes.observations
      })));

      // Calcular total abonado
      const paid = purchaseOrderPayments.data.reduce((sum, payment) => sum + parseFloat(payment.attributes.paid_amount), 0);
      setTotalPaid(paid);

      // Obtener el total de la orden de compra
      const poTotal = parseFloat(purchaseOrderPayments.data[0].includes.purchase_order.total_amount);
      setPurchaseOrderTotal(poTotal);

      // Calcular saldo pendiente
      setRemainingAmount(poTotal - paid);
    }
  }, [purchaseOrderPayments.data]);
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-primary bg-opacity-10 text-white"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title mb-0"
  }, "Resumen de Pagos")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-info bg-opacity-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, "Total Orden de Compra"), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, "$", purchaseOrderTotal.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded bg-success bg-opacity-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, "Total Abonado"), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, "$", totalPaid.toFixed(2)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `p-3 border rounded ${remainingAmount > 0 ? 'bg-danger bg-opacity-10' : 'bg-success bg-opacity-10'}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted small"
  }, "Saldo Pendiente"), /*#__PURE__*/React.createElement("div", {
    className: "fw-bold fs-4"
  }, "$", remainingAmount.toFixed(2))))))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-primary bg-opacity-10 text-white"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title mb-0"
  }, "Historial de Abonos")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: mappedPurchaseOrderPayments,
    tableStyle: {
      minWidth: '50rem'
    },
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_amount",
    header: "Monto",
    body: rowData => `$${rowData.total_amount}`
  }), /*#__PURE__*/React.createElement(Column, {
    field: "payment_method",
    header: "M\xE9todo de pago"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "observations",
    header: "Observaciones"
  })))))));
};