import React from "react";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { SuppliesDeliveryForm } from "./SuppliesDeliveryForm.js";
import { Toast } from "primereact/toast";
import { useSendSuppliesRequest } from "./hooks/useSendSuppliesRequest.js";
export const SuppliesDeliveryFormModal = props => {
  const {
    visible,
    onHide,
    onSave
  } = props;
  const {
    sendSuppliesRequest,
    toast
  } = useSendSuppliesRequest();
  const formId = "suppliesDeliveryForm";
  const handleSubmit = async data => {
    try {
      await sendSuppliesRequest(data);
      onSave();
      onHide();
    } catch (error) {
      console.error(error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: "Solicitud de Insumos",
    style: {
      width: '60vw'
    }
  }, /*#__PURE__*/React.createElement(SuppliesDeliveryForm, {
    formId: formId,
    onSubmit: handleSubmit
  }), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    onClick: onHide,
    className: "btn btn-danger"
  }), /*#__PURE__*/React.createElement(Button, {
    form: formId,
    label: "Enviar Solicitud",
    className: "btn btn-primary"
  }))));
};