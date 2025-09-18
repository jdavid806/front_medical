import React from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
export const WebCreatorPanelSetting = ({
  addSiblingAbove,
  addSiblingBelow,
  addSiblingLeft,
  addSiblingRight,
  addHorizontalChild,
  addVerticalChild,
  removeSelectedPanel
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("h4", null, "Configuraci\xF3n del Panel"), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", null, "A\xF1adir panel"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-up"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Agregar panel arriba",
    onClick: addSiblingAbove
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-down"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Agregar panel abajo",
    onClick: addSiblingBelow
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-left"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Agregar panel a la izquierda",
    onClick: addSiblingLeft
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrow-right"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Agregar panel a la derecha",
    onClick: addSiblingRight
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("p", null, "Dividir panel"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrows-h"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Dividir horizontalmente",
    onClick: addHorizontalChild
  }), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-arrows-v"
    }),
    rounded: true,
    text: true,
    severity: "help",
    tooltip: "Dividir verticalmente",
    onClick: addVerticalChild
  })), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash"
    }),
    label: "Eliminar panel",
    rounded: true,
    text: true,
    severity: "danger",
    onClick: removeSelectedPanel
  })));
};