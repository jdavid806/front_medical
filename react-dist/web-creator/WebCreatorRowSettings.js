import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
export const WebCreatorRowSettings = ({
  addRowUpper,
  addRowBelow,
  addColumn,
  selectedRow
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Fila"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column justify-content-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center justify-content-between"
  }, /*#__PURE__*/React.createElement("span", null, "Agregar fila: "), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-up"
    }),
    tooltip: "Agregar fila arriba",
    rounded: true,
    text: true,
    severity: "help",
    onClick: addRowUpper
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-down"
    }),
    tooltip: "Agregar fila abajo",
    rounded: true,
    text: true,
    severity: "help",
    onClick: addRowBelow
  }))), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus"
    }),
    label: "Agregar columna",
    rounded: true,
    text: true,
    severity: "info",
    onClick: () => addColumn(selectedRow)
  })));
};