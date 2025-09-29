import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
const WhatsAppConnection = ({
  status,
  onStatusChange
}) => {
  const [showQRModal, setShowQRModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //     checkStatus();
  // }, []);

  // const checkStatus = async () => {
  //     try {
  //         const newStatus = await checkWhatsAppStatus();
  //         onStatusChange(newStatus);
  //     } catch (error) {
  //         console.error('Error checking WhatsApp status:', error);
  //     }
  // };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const qrData = await generateQRCode();
      onStatusChange({
        ...status,
        qrCode: qrData
      });
      setShowQRModal(true);
    } catch (error) {
      console.error('Error generating QR:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnectWhatsApp();
      onStatusChange({
        connected: false
      });
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
    } finally {
      setLoading(false);
    }
  };
  const qrModalFooter = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: () => setShowQRModal(false)
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-column align-items-center text-center"
  }, status.connected ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
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
    loading: loading,
    onClick: handleDisconnect
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
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
    loading: loading,
    onClick: handleConnect
  })), /*#__PURE__*/React.createElement(Dialog, {
    header: "Vincular WhatsApp",
    visible: showQRModal,
    footer: qrModalFooter,
    onHide: () => setShowQRModal(false),
    style: {
      width: '400px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("p", null, "Escanea este c\xF3digo QR para vincular tu cuenta de WhatsApp."), status.qrCode && /*#__PURE__*/React.createElement("img", {
    src: status.qrCode,
    alt: "C\xF3digo QR WhatsApp",
    className: "mt-3 img-fluid",
    style: {
      maxWidth: '200px'
    }
  }))));
};
export default WhatsAppConnection;