import React from "react";
import CustomDataTable from "../components/CustomDataTable.js";
import { usePreadmissions } from "./hooks/usePreadmission.js";
export const PreadmissionTable = () => {
  const {
    preadmissions
  } = usePreadmissions();
  const columns = [{
    data: "weight",
    orderable: true
  }, {
    data: "size",
    orderable: true
  }, {
    data: "imc",
    orderable: true
  }, {
    data: "glycemia",
    orderable: true
  }, {
    data: "createdAt",
    orderable: true
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CustomDataTable, {
    columns: columns,
    data: preadmissions
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Peso"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Tama\xF1o"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "IMC"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Glucosa"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th text-start"
  }, "Fecha de creaci\xF3n")))));
};