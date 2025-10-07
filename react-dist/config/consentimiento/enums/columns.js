import { Button } from "primereact/button";
import React from "react";
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
  body: rowData => {
    const html = rowData.description || "";
    const text = html.replace(/<[^>]+>/g, "");
    const shortText = text.slice(0, 300);
    const isLong = text.length > 300;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: "600px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      id: `desc-${rowData.id}`,
      "data-full": html,
      "data-short": shortText,
      "data-expanded": "false",
      dangerouslySetInnerHTML: {
        __html: isLong ? shortText + "..." : html
      }
    }), isLong && /*#__PURE__*/React.createElement("span", {
      onClick: e => {
        const el = document.getElementById(`desc-${rowData.id}`);
        if (!el) return;
        const expanded = el.dataset.expanded === "true";
        el.innerHTML = expanded ? el.dataset.short + "..." : el.dataset.full || "";
        el.dataset.expanded = expanded ? "false" : "true";
        e.currentTarget.textContent = expanded ? "Ver más" : "Ver menos";
      },
      style: {
        color: "#007bff",
        cursor: "pointer",
        textDecoration: "underline",
        display: "inline-block",
        marginTop: "4px"
      }
    }, "Ver m\xE1s"));
  }
}, {
  field: "",
  header: "Acciones",
  style: {
    width: "60px"
  },
  body: rowData => /*#__PURE__*/React.createElement("div", {
    key: rowData.id
  }, /*#__PURE__*/React.createElement(Button, {
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