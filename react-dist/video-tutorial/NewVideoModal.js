import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
export const NewVideoModal = ({
  visible,
  onHide,
  onSubmit,
  categoryId
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
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
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo Video",
    visible: visible,
    style: {
      width: "500px"
    },
    modal: true,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "T\xEDtulo"), /*#__PURE__*/React.createElement(InputText, {
    value: title,
    onChange: e => setTitle(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Descripci\xF3n"), /*#__PURE__*/React.createElement(InputTextarea, {
    rows: 3,
    value: description,
    onChange: e => setDescription(e.target.value)
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
    disabled: !title || !url,
    onClick: handleSave
  }))));
};