import React from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { useAllTableEstimates } from "./hooks/useAllTableEstimates.js";
import { EstimatesTableActions } from "./EstimatesTableActions.js";
export const EstimatesTable = () => {
  const {
    estimates
  } = useAllTableEstimates();
  const columns = [{
    data: "id"
  }, {
    data: "estimate_date"
  }, {
    data: "dueDate"
  }, {
    data: "total"
  }, {
    data: "amount_paid"
  }, {
    data: "missing_amount"
  }, {
    data: "quantity"
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    7: (cell, data) => /*#__PURE__*/React.createElement(EstimatesTableActions, null)
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: estimates,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de prespuesto"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Fecha de vencimiento"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Total"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Monto pagado"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Monto faltante"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Cantidad"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))));
};