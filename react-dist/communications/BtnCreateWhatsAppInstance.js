import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { CreateWhatsAppInstanceForm } from "./CreateWhatsAppInstanceForm.js";
import { useCreateEAInstance } from "./hooks/useCreateEAInstance.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { PrimeReactProvider } from 'primereact/api';
export const BtnCreateWhatsAppInstance = () => {
  const [visible, setVisible] = useState(false);
  const {
    createEAInstance
  } = useCreateEAInstance();
  const formId = "create-whatsapp-instance-form";
  const handleCreateEAInstance = async data => {
    try {
      const response = await createEAInstance(data.instanceName);
      console.log("response", response);
      if (response.status == 403) {
        SwalManager.error({
          title: "Error",
          text: "El nombre de la instancia ya existe"
        });
        return;
      }
      const id = document.getElementById("smtpId")?.value;
      if (id) {
        await updateSmtp({
          api_key: response.hash,
          instance: data.instanceName
        });
      } else {
        await createSmtp({
          api_key: response.hash,
          instance: data.instanceName,
          email: "",
          password: "",
          smtp_server: "",
          port: 0,
          security: ""
        });
      }
      await consultarQR();
      await cargarDatosTenant();
      const modalVerQR = document.getElementById("modalButton");
      if (modalVerQR) {
        modalVerQR.click();
      } else {
        throw new Error("No se pudo encontrar el modal para visualizar el QR");
      }
      setVisible(false);
    } catch (error) {}
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      zIndex: {
        modal: 1055
      }
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      setVisible(true);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times-circle"
  }), " Crear conexi\xF3n con WhatsApp"), /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear nueva instancia de WhatsApp",
    visible: visible,
    onHide: () => setVisible(false),
    maximizable: true,
    modal: true,
    dismissableMask: true,
    style: {
      width: '50vw'
    }
  }, /*#__PURE__*/React.createElement(CreateWhatsAppInstanceForm, {
    formId: formId,
    onSubmit: handleCreateEAInstance
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => setVisible(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    form: formId
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-save"
  }), " Guardar")))));
};