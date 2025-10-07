import React, { useState, useCallback, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useWhatsApp } from "../hooks/useWhatsApp.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { BtnCreateWhatsAppInstance } from "../../../communications/BtnCreateWhatsAppInstance.js";
import SmtpConfigForm from "../form/SmtpConfigForm.js";
const WhatsAppConnection = ({
  onStatusChange
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const {
    status,
    qrCode,
    loading,
    error,
    connectWhatsApp,
    disconnectWhatsApp,
    checkWhatsAppStatus
  } = useWhatsApp();

  // Notificar cambios de estado al componente padre
  useEffect(() => {
    onStatusChange?.({
      connected: status === 'CONECTADA',
      qrCode
    });
  }, [status, qrCode, onStatusChange]);

  // Efecto para sincronizar loading states
  useEffect(() => {
    setLocalLoading(loading);
  }, [loading]);
  const handleConnect = useCallback(async () => {
    setLocalLoading(true);
    try {
      await connectWhatsApp();
      setShowQRModal(true);
    } catch (error) {
      console.error('Error connecting:', error);
    } finally {
      setLocalLoading(false);
    }
  }, [connectWhatsApp]);
  const handleDisconnect = useCallback(async () => {
    await SwalManager.confirmDelete(async () => {
      setLocalLoading(true);
      try {
        await disconnectWhatsApp();
        checkWhatsAppStatus();
      } catch (error) {
        console.error('Error disconnecting:', error);
      } finally {
        setLocalLoading(false);
      }
    });
  }, [disconnectWhatsApp, checkWhatsAppStatus]);
  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };
  useEffect(() => {
    if (showQRModal && status === 'CONECTADA') {
      handleCloseQRModal();
    }
  }, [status, showQRModal]);

  // Renderizado condicional simplificado
  const renderContent = () => {
    if (status === 'CONECTADA') {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-check-circle text-success",
        style: {
          fontSize: '100px'
        }
      }), /*#__PURE__*/React.createElement("p", {
        className: "mt-3"
      }, "WhatsApp conectado correctamente"), /*#__PURE__*/React.createElement(Button, {
        label: "Quitar conexi\xF3n",
        icon: "pi pi-times-circle",
        severity: "danger",
        loading: localLoading,
        onClick: handleDisconnect,
        disabled: localLoading
      }));
    }
    if (status === 'NO-CONECTADA') {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-circle-xmark text-danger",
        style: {
          fontSize: '100px'
        }
      }), /*#__PURE__*/React.createElement("p", {
        className: "mt-3"
      }, "WhatsApp no conectado"), /*#__PURE__*/React.createElement(Button, {
        label: "Conectar WhatsApp",
        icon: "pi pi-whatsapp",
        severity: "warning",
        loading: localLoading,
        onClick: handleConnect,
        disabled: localLoading
      }));
    }

    // Estado por defecto: NO-CREADA
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exclamation-triangle text-warning",
      style: {
        fontSize: '100px'
      }
    }), /*#__PURE__*/React.createElement("p", {
      className: "mt-3"
    }, "Instancia de WhatsApp no creada"), /*#__PURE__*/React.createElement(BtnCreateWhatsAppInstance, {
      onSave: () => handleCloseQRModal()
    }));
  };
  const qrModalFooter = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: handleCloseQRModal,
    className: "p-button-secondary",
    disabled: localLoading
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-column align-items-center text-center p-3"
  }, renderContent(), /*#__PURE__*/React.createElement(SmtpConfigForm, null), /*#__PURE__*/React.createElement(Dialog, {
    header: "Vincular WhatsApp",
    visible: showQRModal,
    footer: qrModalFooter,
    onHide: handleCloseQRModal,
    style: {
      width: '400px'
    },
    modal: true,
    className: "p-fluid",
    closable: !localLoading
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", null, "Escanea este c\xF3digo QR para vincular tu cuenta de WhatsApp."), qrCode ? /*#__PURE__*/React.createElement("img", {
    src: qrCode,
    alt: "C\xF3digo QR WhatsApp",
    className: "mt-3",
    style: {
      width: '200px',
      height: '200px',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-spin pi-spinner",
    style: {
      fontSize: '2rem'
    }
  }), /*#__PURE__*/React.createElement("p", {
    className: "mt-2"
  }, "Generando c\xF3digo QR...")))), error && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger mt-3 w-100"
  }, error));
};
export default WhatsAppConnection;