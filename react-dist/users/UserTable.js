import React, { useState, useRef } from "react";
import { Toast } from 'primereact/toast';
import CustomDataTable from "../components/CustomDataTable.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../components/table-actions/DeleteTableAction.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UserAssistantForm } from "./UserAssistantForm.js";
import { useUserAssistantBulkCreate } from "./hooks/useUserAssistantBulkCreate.js";
import { userAssistantService } from "../../services/api/index.js";
import { GoogleCalendarModal } from "./components/GoogleCalendarModal.js";
const UserTable = ({
  users,
  onEditItem,
  onDeleteItem,
  onAddSignature,
  onAddStamp,
  onDeleteSignature,
  onDeleteStamp,
  onReload
}) => {
  const [showAssistantsModal, setShowAssistantsModal] = useState(false);
  const [assistantsFormInitialData, setAssistantsFormInitialData] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [actionType, setActionType] = useState(null);
  const toast = useRef(null);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);
  const {
    createUserAssistantBulk
  } = useUserAssistantBulkCreate();
  const handleFileChange = (event, type) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setActionType(type);
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    } else {
      setPreviewUrl(null);
    }
  };
  const handleConfirm = async () => {
    //@ts-ignore
    const id_inputUsuario = await guardarArchivoUsuario("fileInput", 40);
    if (selectedFile && currentUserId && actionType) {
      if (actionType === "signature") {
        saveSignature(id_inputUsuario, currentUserId);
      } else if (actionType === "stamp") {
        saveStamp(id_inputUsuario, currentUserId);
      }
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setCurrentUserId(null);
    setActionType(null);
  };
  function saveSignature(signatureId, userId) {
    //@ts-ignore
    let urlUser = obtenerRutaPrincipal() + `/medical/users/` + userId;
    let jsonData = {
      firma_minio_url: signatureId
    };
    //@ts-ignore
    actualizarDatos(urlUser, jsonData);
  }
  function saveStamp(stamp, userId) {
    //@ts-ignore
    let urlUser = obtenerRutaPrincipal() + `/medical/users/` + userId;
    let jsonData = {
      image_minio_url: stamp
    };
    //@ts-ignore
    actualizarDatos(urlUser, jsonData);
  }
  const openAssistantsModal = async userId => {
    setCurrentUserId(userId);
    setShowAssistantsModal(true);
    const assistants = await userAssistantService.getAssistantsByUserId(userId);
    setAssistantsFormInitialData({
      assistants: assistants.data.map(assistant => assistant.id)
    });
  };
  const handleAssistantsSubmit = async data => {
    await createUserAssistantBulk(currentUserId, data.assistants).then(() => {
      setShowAssistantsModal(false);
      onReload && onReload();
    });
  };
  const openGoogleCalendarModal = data => {
    setCurrentUserId(data.id);
    setCurrentEmail(data.email);
    setShowGoogleCalendarModal(true);
  };
  const columns = [{
    data: "fullName"
  }, {
    data: "role"
  }, {
    data: "city"
  }, {
    data: "phone"
  }, {
    data: "email"
  }, {
    orderable: false,
    searchable: false
  }];
  const slots = {
    5: (cell, data) => /*#__PURE__*/React.createElement(TableActionsWrapper, null, /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement(EditTableAction, {
      onTrigger: () => onEditItem && onEditItem(data.id)
    })), /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement(DeleteTableAction, {
      onTrigger: () => onDeleteItem && onDeleteItem(data.id)
    })), data.roleGroup === "DOCTOR" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => {
        setCurrentUserId(data.id);
        setActionType("signature");
        document.getElementById("fileInput")?.click();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-signature",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, data.signatureMinioUrl ? "Actualizar firma" : "Añadir firma")))), /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => {
        setCurrentUserId(data.id);
        setActionType("stamp");
        document.getElementById("fileInput")?.click();
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-stamp",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, data.imageMinioUrl ? "Actualizar sello" : "Añadir sello")))), /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openGoogleCalendarModal(data)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-calendar-alt",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Configurar Google Calendar")))), /*#__PURE__*/React.createElement("li", {
      style: {
        marginBottom: "8px"
      }
    }, /*#__PURE__*/React.createElement("a", {
      className: "dropdown-item",
      href: "#",
      onClick: () => openAssistantsModal(data.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-user-nurse",
      style: {
        width: "20px"
      }
    }), /*#__PURE__*/React.createElement("span", null, "Gestionar asistentes"))))))
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement(CustomDataTable, {
    data: users,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Nombre"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Rol"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Ciudad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "N\xFAmero de contacto"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Correo"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2",
    scope: "col"
  })))))), /*#__PURE__*/React.createElement("input", {
    id: "fileInput",
    type: "file",
    accept: "image/*",
    style: {
      display: "none"
    },
    onChange: e => {
      if (actionType === "signature") {
        handleFileChange(e, "signature");
      } else if (actionType === "stamp") {
        handleFileChange(e, "stamp");
      }
    }
  }), previewUrl && /*#__PURE__*/React.createElement("div", {
    className: "modal fade show",
    style: {
      display: "block",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "modal-title"
  }, "Previsualizaci\xF3n"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: () => {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("img", {
    src: previewUrl,
    alt: "Previsualizaci\xF3n",
    style: {
      width: "100%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: () => {
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, "Cancelar"), currentUserId && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger",
    onClick: () => {
      if (actionType === "signature" && onDeleteSignature) {
        onDeleteSignature(currentUserId);
      } else if (actionType === "stamp" && onDeleteStamp) {
        onDeleteStamp(currentUserId);
      }
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, actionType === "signature" && users.find(user => user.id === currentUserId)?.signature ? "Eliminar firma" : actionType === "stamp" && users.find(user => user.id === currentUserId)?.stamp ? "Eliminar sello" : "Eliminar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: handleConfirm
  }, actionType === "signature" && users.find(user => user.id === currentUserId)?.signature ? "Actualizar firma" : actionType === "stamp" && users.find(user => user.id === currentUserId)?.stamp ? "Actualizar sello" : "Confirmar"))))), /*#__PURE__*/React.createElement(CustomFormModal, {
    show: showAssistantsModal,
    formId: "assistantsForm",
    title: "Gestionar asistentes",
    onHide: () => setShowAssistantsModal(false)
  }, /*#__PURE__*/React.createElement(UserAssistantForm, {
    formId: "assistantsForm",
    onHandleSubmit: handleAssistantsSubmit,
    initialData: assistantsFormInitialData
  })), /*#__PURE__*/React.createElement(GoogleCalendarModal, {
    show: showGoogleCalendarModal,
    userId: currentUserId || '',
    userEmail: currentEmail || '',
    onHide: () => setShowGoogleCalendarModal(false),
    onSuccess: () => {
      onReload && onReload();
    },
    toast: toast.current
  }));
};
export default UserTable;