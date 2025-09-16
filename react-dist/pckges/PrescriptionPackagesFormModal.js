import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { PrescriptionPackagesForm } from "./PrescriptionPackagesForm.js";
export const PrescriptionPackagesFormModal = props => {
  const formId = `prescription-packages-form-modal-${props.packageId}`;
  const {
    visible,
    onHide,
    packageId
  } = props;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: "Nuevo paquete",
    style: {
      width: '90vw'
    },
    dismissableMask: true,
    draggable: false,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-times"
      }),
      className: "btn btn-danger",
      onClick: onHide
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-save"
      }),
      className: "btn btn-primary",
      type: "submit",
      form: formId
    })))
  }, /*#__PURE__*/React.createElement(PrescriptionPackagesForm, {
    formId: formId,
    packageId: packageId
  })));
};