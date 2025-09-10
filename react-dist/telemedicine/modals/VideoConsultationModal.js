import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { useSocket } from "../hooks/useSocket.js";
export const VideoConsultationModal = ({
  visible,
  onHide,
  cita
}) => {
  const [roomId, setRoomId] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const socket = useSocket();
  useEffect(() => {
    if (visible && socket) {
      // Configurar eventos de socket
      // socket.on('room-created', (newRoomId: string) => {
      //     setRoomId(newRoomId);
      //     setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);
      // });
    }
    return () => {
      // if (socket) {
      //     socket.off('room-created');
      // }
    };
  }, [visible, socket]);
  const crearSala = () => {
    const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomId(newRoomId);
    setRoomLink(`${window.location.origin}/video-llamada?roomId=${newRoomId}`);

    // if (socket) {
    //     socket.emit('create-room', 'doctor');
    // }
  };
  const copiarEnlace = () => {
    navigator.clipboard.writeText(roomLink).then(() => {
      // Mostrar notificación de éxito
    }).catch(err => console.error('Error al copiar:', err));
  };
  const footerContent = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: onHide,
    className: "p-button-text"
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-video mr-2"
    }), " Video Consulta"),
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '700px'
    },
    footer: footerContent,
    onHide: onHide,
    className: "video-consultation-modal"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "border-0"
  }, cita && /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    icon: "pi pi-user",
    size: "large",
    shape: "circle",
    className: "mr-3 bg-primary"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, cita.paciente), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Paciente"))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calendar mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Fecha:"), " ", cita.fecha), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-phone mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Tel\xE9fono:"), " ", cita.telefono)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Avatar, {
    icon: "pi pi-user-md",
    size: "large",
    shape: "circle",
    className: "mr-3 bg-info"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "mb-0"
  }, cita.doctor), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "M\xE9dico"))), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-inbox mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Correo:"), " ", cita.correo), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-comment mr-2"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Motivo:"), " ", cita.motivo))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-key mr-2"
  }), " C\xF3digo de sala"), /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gray-100 border-round"
  }, /*#__PURE__*/React.createElement("span", {
    className: roomId ? 'text-primary font-bold text-xl' : 'text-color-secondary'
  }, roomId || 'Presiona "Crear sala" para generar un código'))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("h5", null, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2"
  }), " Estado"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: `badge ${roomId ? 'bg-success' : 'bg-secondary'} me-2`
  }, roomId ? "Abierta" : "No creada")), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-color-secondary mt-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-clock mr-1"
  }), " Apertura: ", new Date().toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50 p-3 border-round text-sm"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-info-circle mr-2 text-blue-500"
  }), "Esta informaci\xF3n junto con el enlace para ingresar a la sala ser\xE1 enviada por correo electr\xF3nico a ", /*#__PURE__*/React.createElement("strong", null, cita?.correo || 'user@test.com'), " y por WhatsApp a ", /*#__PURE__*/React.createElement("strong", null, cita?.telefono || '96385214')))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Crear sala",
    className: "w-full",
    onClick: crearSala,
    disabled: !!roomId
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-sign-in",
    label: "Entrar",
    className: "p-button-outlined p-button-primary w-full",
    disabled: !roomId
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-link",
    label: "Copiar enlace",
    className: "p-button-outlined p-button-help w-full",
    onClick: copiarEnlace,
    disabled: !roomId
  })))));
};