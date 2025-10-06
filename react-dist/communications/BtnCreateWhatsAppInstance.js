import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { CreateWhatsAppInstanceForm } from "./CreateWhatsAppInstanceForm.js";
import { useCreateEAInstance } from "./hooks/useCreateEAInstance.js";
import { SwalManager } from "../../services/alertManagerImported.js";
import { PrimeReactProvider } from 'primereact/api';
import { useCompanyCommunication } from "../config/company-configuration/hooks/useCompanyCommunication.js";
export const BtnCreateWhatsAppInstance = ({
  onSave
}) => {
  const [visible, setVisible] = useState(false);
  const {
    createEAInstance
  } = useCreateEAInstance();
  const {
    saveCommunication
  } = useCompanyCommunication();
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
      await saveCommunication({
        api_key: response.hash || 'oEQ0j9ft1FX43QkGLDCEM0arw',
        instance: data.instanceName,
        email: "",
        password: "",
        smtp_server: "",
        port: 587,
        security: "tls"
      });
      SwalManager.success('Instancia creada correctamente');
      onSave?.();
      setVisible(false);

      // Recargar la página para actualizar el estado
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error creating instance:', error);
      SwalManager.error('Error al crear la instancia');
    }
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
    className: "fas fa-plus-circle"
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