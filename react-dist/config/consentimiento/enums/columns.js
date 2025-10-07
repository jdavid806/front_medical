import React from "react";
import { Button } from "primereact/button";
export const DescriptionCell = ({
  html
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const contentRef = React.useRef(null);
  const [isOverflowing, setIsOverflowing] = React.useState(false);
  React.useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setIsOverflowing(el.scrollHeight > 250); // 🔹 detecta si hay más contenido que la altura visible
    }
  }, [html]);
  if (!html) return /*#__PURE__*/React.createElement("span", null, "Sin descripci\xF3n");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "800px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: contentRef,
    dangerouslySetInnerHTML: {
      __html: html
    },
    style: {
      maxHeight: expanded ? "none" : "250px",
      overflow: expanded ? "visible" : "hidden",
      whiteSpace: "normal",
      transition: "max-height 0.3s ease"
    }
  }), isOverflowing && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: e => {
      e.stopPropagation();
      setExpanded(prev => !prev);
    },
    style: {
      color: "#007bff",
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      marginTop: "6px",
      textDecoration: "underline",
      fontWeight: 500
    }
  }, expanded ? "Ver menos" : "Ver más"));
};
export const getColumns = ({
  editConsentimiento,
  deleteConsentimiento
}) => [{
  field: "title",
  header: "Título"
}, {
  field: "data",
  header: "Datos"
}, {
  field: "description",
  header: "Descripción",
  body: rowData => /*#__PURE__*/React.createElement(DescriptionCell, {
    html: rowData.description
  })
}, {
  field: "",
  header: "Acciones",
  style: {
    width: "60px"
  },
  body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm",
    onClick: e => {
      e.stopPropagation();
      editConsentimiento(rowData.id ?? "");
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-pencil-alt"
  })), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-text p-button-sm p-button-danger",
    onClick: e => {
      e.stopPropagation();
      deleteConsentimiento(rowData.id ?? "");
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  })))
}];