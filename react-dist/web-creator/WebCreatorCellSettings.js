import React from "react";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
export const WebCreatorCellSettings = ({
  addColumnBefore,
  addColumnAfter,
  removeColumn
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Celda"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column justify-content-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center justify-content-between"
  }, /*#__PURE__*/React.createElement("span", null, "Agregar columna: "), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-left"
    }),
    tooltip: "Agregar columna detr\xE1s",
    rounded: true,
    text: true,
    severity: "help",
    onClick: addColumnBefore
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-right"
    }),
    tooltip: "Agregar columna delante",
    rounded: true,
    text: true,
    severity: "help",
    onClick: addColumnAfter
  }))), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash"
    }),
    label: "Eliminar columna",
    rounded: true,
    text: true,
    severity: "danger",
    onClick: removeColumn
  })));
};