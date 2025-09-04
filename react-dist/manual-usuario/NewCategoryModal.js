import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
export const NewCategoryModal = ({
  visible,
  onHide,
  onSubmit
}) => {
  const [name, setName] = useState("");
  const handleSave = () => {
    onSubmit({
      name
    });
    setName("");
    onHide();
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nueva Categor\xEDa",
    visible: visible,
    style: {
      width: "400px"
    },
    modal: true,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "field"
  }, /*#__PURE__*/React.createElement("label", null, "Nombre de la Categor\xEDa"), /*#__PURE__*/React.createElement(InputText, {
    value: name,
    onChange: e => setName(e.target.value)
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
    disabled: !name,
    onClick: handleSave
  }))));
};