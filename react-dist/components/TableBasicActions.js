import React from 'react';
export const TableBasicActions = ({
  onEdit,
  onDelete,
  extraActions
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "text-end align-middle"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dropdown"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary dropdown-toggle",
    type: "button",
    "data-bs-toggle": "dropdown",
    "aria-expanded": "false"
  }, /*#__PURE__*/React.createElement("i", {
    "data-feather": "settings"
  }), " Acciones"), /*#__PURE__*/React.createElement("ul", {
    className: "dropdown-menu",
    style: {
      zIndex: 10000
    }
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (onEdit) onEdit();
    },
    "data-column": "editar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen",
    style: {
      width: '20px'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Editar")))), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    className: "dropdown-item",
    href: "#",
    onClick: e => {
      e.preventDefault();
      if (onDelete) onDelete();
    },
    "data-column": "eliminar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash",
    style: {
      width: '20px'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Eliminar")))), extraActions)));
};