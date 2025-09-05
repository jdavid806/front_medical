import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Editor } from "primereact/editor"; // 👈 importar el Editor

export const NewVideoModal = ({
  visible,
  onHide,
  onSubmit,
  categories
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // guardará HTML
  const [url, setUrl] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const handleSave = () => {
    if (!categoryId) return;
    onSubmit({
      title,
      description,
      url,
      category_id: categoryId
    });
    setTitle("");
    setDescription("");
    setUrl("");
    setCategoryId(null);
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo Video",
    visible: visible,
    style: {
      width: "600px"
    },
    modal: true,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Categor\xEDa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: categoryId,
    options: categories.map(cat => ({
      label: cat.name,
      value: cat.id
    })),
    onChange: e => setCategoryId(e.value),
    placeholder: "Seleccione una categor\xEDa"
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "T\xEDtulo"), /*#__PURE__*/React.createElement(InputText, {
    value: title,
    onChange: e => setTitle(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement(Editor, {
    value: description,
    onTextChange: e => setDescription(e.htmlValue ?? ""),
    style: {
      height: "200px"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "URL del Video (YouTube, Vimeo...)"), /*#__PURE__*/React.createElement(InputText, {
    value: url,
    onChange: e => setUrl(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "p-button-primary",
    disabled: !title || !url || !categoryId,
    onClick: handleSave
  }))));
};