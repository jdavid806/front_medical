import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UserAssistantForm } from "./UserAssistantForm.js";
import { useUserAssistantBulkCreate } from "./hooks/useUserAssistantBulkCreate.js";
import { userAssistantService } from "../../services/api/index.js";
import { CustomPRTable } from "../components/CustomPRTable.js";
import { GoogleCalendarModal } from "./components/GoogleCalendarModal.js";
export const UserTable = ({
  users,
  onEditItem,
  onDeleteItem,
  onAddSignature,
  onAddStamp,
  onDeleteSignature,
  onDeleteStamp,
  onReload,
  onCreateUser,
  loading = false
}) => {
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filtros, setFiltros] = useState({
    fullName: "",
    role: "",
    city: "",
    email: ""
  });
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
  const syncFilteredData = () => {
    let result = [...users];
    if (filtros.fullName) {
      result = result.filter(user => user.fullName.toLowerCase().includes(filtros.fullName.toLowerCase()));
    }
    if (filtros.role) {
      result = result.filter(user => user.role.toLowerCase().includes(filtros.role.toLowerCase()));
    }
    setFilteredUsers(result);
  };
  useEffect(() => {
    syncFilteredData();
  }, [users, filtros]);
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSearchChange = searchValue => {
    console.log("Search value:", searchValue);
  };
  const limpiarFiltros = () => {
    setFiltros({
      fullName: "",
      role: "",
      city: "",
      email: ""
    });
  };
  const handleRefresh = async () => {
    limpiarFiltros();
    if (onReload) {
      await onReload();
    }
  };
  const showToast = (severity, summary, detail) => {
    toast.current?.show({
      severity,
      summary,
      detail,
      life: 3000
    });
  };
  const confirmDelete = user => {
    setUserToDelete(user);
    setDeleteDialogVisible(true);
  };
  const deleteUser = async () => {
    if (userToDelete && onDeleteItem) {
      await onDeleteItem(userToDelete.id);
      showToast("success", "Éxito", `Usuario ${userToDelete.fullName} eliminado`);
      if (onReload) {
        await onReload();
      }
    }
    setDeleteDialogVisible(false);
    setUserToDelete(null);
  };
  const deleteDialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    className: "p-button-text",
    onClick: () => setDeleteDialogVisible(false)
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Eliminar",
    icon: "pi pi-check",
    className: "p-button-danger",
    onClick: deleteUser
  }));

  // Funciones existentes (sin cambios)
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
  const TableMenu = ({
    rowData,
    onEdit,
    onDelete
  }) => {
    const menu = useRef(null);
    const handleEdit = () => {
      console.log("Editando usuario con ID:", rowData.id);
      onEdit(rowData.id);
    };
    const handleDelete = () => {
      console.log("Solicitando eliminar usuario con ID:", rowData.id);
      onDelete(rowData);
    };
    const handleSignature = () => {
      setCurrentUserId(rowData.id);
      setActionType("signature");
      document.getElementById("fileInput")?.click();
    };
    const handleStamp = () => {
      setCurrentUserId(rowData.id);
      setActionType("stamp");
      document.getElementById("fileInput")?.click();
    };
    const handleGoogleCalendar = () => {
      openGoogleCalendarModal(rowData);
    };
    const handleAssistants = () => {
      openAssistantsModal(rowData.id);
    };
    const menuItems = [{
      label: "Editar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-edit me-2"
      }),
      command: handleEdit
    }, {
      label: "Eliminar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fas fa-trash me-2"
      }),
      command: handleDelete
    }];

    // Agregar items específicos para DOCTOR
    if (rowData.roleGroup === "DOCTOR") {
      menuItems.push({
        label: rowData.signatureMinioUrl ? "Actualizar firma" : "Añadir firma",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-file-signature me-2"
        }),
        command: handleSignature
      }, {
        label: rowData.imageMinioUrl ? "Actualizar sello" : "Añadir sello",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-stamp me-2"
        }),
        command: handleStamp
      }, {
        label: "Configurar Google Calendar",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-calendar-alt me-2"
        }),
        command: handleGoogleCalendar
      }, {
        label: "Gestionar asistentes",
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fas fa-user-nurse me-2"
        }),
        command: handleAssistants
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement(Button, {
      className: "p-button-primary flex items-center gap-2",
      onClick: e => menu.current?.toggle(e),
      "aria-controls": `popup_menu_${rowData.id}`,
      "aria-haspopup": true
    }, "Acciones", /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog ml-2"
    })), /*#__PURE__*/React.createElement(Menu, {
      model: menuItems,
      popup: true,
      ref: menu,
      id: `popup_menu_${rowData.id}`,
      appendTo: document.body,
      style: {
        zIndex: 9999
      }
    }));
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenu, {
      rowData: rowData,
      onEdit: onEditItem ? onEditItem : () => {},
      onDelete: confirmDelete
    }));
  };

  // Mapear los datos para la tabla
  const tableItems = filteredUsers.map(user => ({
    id: user.id,
    fullName: user.fullName,
    role: user.role,
    city: user.city,
    phone: user.phone,
    email: user.email,
    actions: user
  }));
  const columns = [{
    field: 'fullName',
    header: 'Nombre',
    sortable: true
  }, {
    field: 'role',
    header: 'Rol',
    sortable: true
  }, {
    field: 'city',
    header: 'Ciudad',
    sortable: true
  }, {
    field: 'phone',
    header: 'Número de contacto',
    sortable: true
  }, {
    field: 'email',
    header: 'Correo',
    sortable: true
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => actionBodyTemplate(rowData.actions),
    exportable: false
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto",
    style: {
      minHeight: "400px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body h-100 w-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary d-flex align-items-center",
    onClick: onCreateUser,
    disabled: loading
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), loading ? 'Cargando...' : 'Nuevo Usuario')), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    loading: false,
    onSearch: handleSearchChange,
    onReload: handleRefresh
  }))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: deleteDialogVisible,
    style: {
      width: "450px"
    },
    header: "Confirmar",
    modal: true,
    footer: deleteDialogFooter,
    onHide: () => setDeleteDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-triangle mr-3",
    style: {
      fontSize: "2rem",
      color: "#F8BB86"
    }
  }), userToDelete && /*#__PURE__*/React.createElement("span", null, "\xBFEst\xE1s seguro que deseas eliminar al usuario ", /*#__PURE__*/React.createElement("b", null, userToDelete.fullName), "?"))), /*#__PURE__*/React.createElement("input", {
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
  }, actionType === "signature" && users.find(user => user.id === currentUserId)?.signatureMinioUrl ? "Eliminar firma" : actionType === "stamp" && users.find(user => user.id === currentUserId)?.imageMinioUrl ? "Eliminar sello" : "Eliminar"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary",
    onClick: handleConfirm
  }, actionType === "signature" && users.find(user => user.id === currentUserId)?.signatureMinioUrl ? "Actualizar firma" : actionType === "stamp" && users.find(user => user.id === currentUserId)?.imageMinioUrl ? "Actualizar sello" : "Confirmar"))))), /*#__PURE__*/React.createElement(CustomFormModal, {
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
  })));
};
export default UserTable;