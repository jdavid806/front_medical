import React, { useState, useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { UserTableItem } from "../models/models.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UserAssistantForm, UserAssistantFormInputs } from "./UserAssistantForm.js";
import { useUserAssistantBulkCreate } from "./hooks/useUserAssistantBulkCreate.js";
import { userAssistantService } from "../../services/api/index.js";
import { CustomPRTable, CustomPRTableColumnProps } from "../components/CustomPRTable.js";
import { GoogleCalendarModal } from "./components/GoogleCalendarModal.js";

interface UserTableProps {
  users: UserTableItem[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  onAddSignature?: (file: File, id: string) => void;
  onAddStamp?: (file: File, id: string) => void;
  onDeleteSignature?: (id: string) => void;
  onDeleteStamp?: (id: string) => void;
  onReload?: () => void;
  onCreateUser?: () => void;
  loading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
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
  const [userToDelete, setUserToDelete] = useState<UserTableItem | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<UserTableItem[]>([]);
  const [filtros, setFiltros] = useState({
    fullName: "",
    role: "",
    city: "",
    email: "",
  });

  const [showAssistantsModal, setShowAssistantsModal] = useState(false);
  const [assistantsFormInitialData, setAssistantsFormInitialData] = useState<UserAssistantFormInputs | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"signature" | "stamp" | null>(null);
  const toast = useRef<Toast>(null);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);

  const { createUserAssistantBulk } = useUserAssistantBulkCreate();

  const syncFilteredData = () => {
    let result = [...users];

    if (filtros.fullName) {
      result = result.filter((user) =>
        user.fullName.toLowerCase().includes(filtros.fullName.toLowerCase())
      );
    }

    if (filtros.role) {
      result = result.filter((user) =>
        user.role.toLowerCase().includes(filtros.role.toLowerCase())
      );
    }

    setFilteredUsers(result);
  };

  useEffect(() => {
    syncFilteredData();
  }, [users, filtros]);

  const handleFilterChange = (field: string, value: any) => {
    setFiltros((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearchChange = (searchValue: string) => {
    console.log("Search value:", searchValue);
  };

  const limpiarFiltros = () => {
    setFiltros({
      fullName: "",
      role: "",
      city: "",
      email: "",
    });
  };

  const handleRefresh = async () => {
    limpiarFiltros();

    if (onReload) {
      await onReload();
    }
  };

  const showToast = (severity: any, summary: string, detail: string) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const confirmDelete = (user: UserTableItem) => {
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

  const deleteDialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setDeleteDialogVisible(false)}
      />
      <Button
        label="Eliminar"
        icon="pi pi-check"
        className="p-button-danger"
        onClick={deleteUser}
      />
    </div>
  );

  // Funciones existentes (sin cambios)
  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "signature" | "stamp"
  ) => {
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

  function saveSignature(signatureId: any, userId: string) {
    //@ts-ignore
    let urlUser = obtenerRutaPrincipal() + `/medical/users/` + userId;
    let jsonData = {
      firma_minio_url: signatureId,
    };
    //@ts-ignore
    actualizarDatos(urlUser, jsonData);
  }

  function saveStamp(stamp: any, userId: string) {
    //@ts-ignore
    let urlUser = obtenerRutaPrincipal() + `/medical/users/` + userId;
    let jsonData = {
      image_minio_url: stamp,
    };
    //@ts-ignore
    actualizarDatos(urlUser, jsonData);
  }

  const openAssistantsModal = async (userId: string) => {
    setCurrentUserId(userId);
    setShowAssistantsModal(true);

    const assistants = await userAssistantService.getAssistantsByUserId(userId);

    setAssistantsFormInitialData({
      assistants: assistants.data.map((assistant: any) => assistant.id),
    });
  };

  const handleAssistantsSubmit = async (data: UserAssistantFormInputs) => {
    await createUserAssistantBulk(currentUserId!, data.assistants).then(() => {
      setShowAssistantsModal(false);
      onReload && onReload();
    });
  };

  const openGoogleCalendarModal = (data: any) => {
    setCurrentUserId(data.id);
    setCurrentEmail(data.email);
    setShowGoogleCalendarModal(true);
  };

  const TableMenu: React.FC<{
    rowData: UserTableItem,
    onEdit: (id: string) => void,
    onDelete: (user: UserTableItem) => void
  }> = ({ rowData, onEdit, onDelete }) => {

    const menu = useRef<Menu>(null);

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

    const menuItems = [
      {
        label: "Editar",
        icon: <i className="fas fa-edit me-2"></i>,
        command: handleEdit,
      },
      {
        label: "Eliminar",
        icon: <i className="fas fa-trash me-2"></i>,
        command: handleDelete,
      }
    ];

    // Agregar items específicos para DOCTOR
    if (rowData.roleGroup === "DOCTOR") {
      menuItems.push(
        {
          label: rowData.signatureMinioUrl ? "Actualizar firma" : "Añadir firma",
          icon: <i className="fas fa-file-signature me-2"></i>,
          command: handleSignature,
        },
        {
          label: rowData.imageMinioUrl ? "Actualizar sello" : "Añadir sello",
          icon: <i className="fas fa-stamp me-2"></i>,
          command: handleStamp,
        },
        {
          label: "Configurar Google Calendar",
          icon: <i className="fas fa-calendar-alt me-2"></i>,
          command: handleGoogleCalendar,
        },
        {
          label: "Gestionar asistentes",
          icon: <i className="fas fa-user-nurse me-2"></i>,
          command: handleAssistants,
        }
      );
    }

    return (
      <div style={{ position: "relative" }}>
        <Button
          className="p-button-primary flex items-center gap-2"
          onClick={(e) => menu.current?.toggle(e)}
          aria-controls={`popup_menu_${rowData.id}`}
          aria-haspopup
        >
          Acciones
          <i className="fas fa-cog ml-2"></i>
        </Button>
        <Menu
          model={menuItems}
          popup
          ref={menu}
          id={`popup_menu_${rowData.id}`}
          appendTo={document.body}
          style={{ zIndex: 9999 }}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData: UserTableItem) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ gap: "0.5rem", minWidth: "120px" }}
      >
        <TableMenu
          rowData={rowData}
          onEdit={onEditItem ? onEditItem : () => { }}
          onDelete={confirmDelete}
        />
      </div>
    );
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

  const columns: CustomPRTableColumnProps[] = [
    {
      field: 'fullName',
      header: 'Nombre',
      sortable: true
    },
    {
      field: 'role',
      header: 'Rol',
      sortable: true
    },
    {
      field: 'city',
      header: 'Ciudad',
      sortable: true
    },
    {
      field: 'phone',
      header: 'Número de contacto',
      sortable: true
    },
    {
      field: 'email',
      header: 'Correo',
      sortable: true
    },
    {
      field: 'actions',
      header: 'Acciones',
      body: (rowData: any) => actionBodyTemplate(rowData.actions),
      exportable: false
    }
  ];

  return (
    <>
      <div className="w-100">
        <div
          className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
          style={{ minHeight: "400px" }}
        >
          <div className="card-body h-100 w-100 d-flex flex-column">
            <div className="d-flex justify-content-end mb-3">
              <Button
                className="p-button-primary d-flex align-items-center"
                onClick={onCreateUser}
                disabled={loading}
              >
                <i className="fas fa-plus me-2"></i>
                {loading ? 'Cargando...' : 'Nuevo Usuario'}
              </Button>
            </div>

            <CustomPRTable
              columns={columns}
              data={tableItems}
              loading={false}
              onSearch={handleSearchChange}
              onReload={handleRefresh}
            />
          </div>
        </div>

        <Toast ref={toast} />

        <Dialog
          visible={deleteDialogVisible}
          style={{ width: "450px" }}
          header="Confirmar"
          modal
          footer={deleteDialogFooter}
          onHide={() => setDeleteDialogVisible(false)}
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="fas fa-exclamation-triangle mr-3"
              style={{ fontSize: "2rem", color: "#F8BB86" }}
            />
            {userToDelete && (
              <span>
                ¿Estás seguro que deseas eliminar al usuario <b>{userToDelete.fullName}</b>?
              </span>
            )}
          </div>
        </Dialog>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            if (actionType === "signature") {
              handleFileChange(e, "signature");
            } else if (actionType === "stamp") {
              handleFileChange(e, "stamp");
            }
          }}
        />

        {
          previewUrl && (
            <div
              className="modal fade show"
              style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Previsualización</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <img
                      src={previewUrl}
                      alt="Previsualización"
                      style={{ width: "100%" }}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setPreviewUrl(null);
                        setSelectedFile(null);
                      }}
                    >
                      Cancelar
                    </button>
                    {/* Botón de Eliminar */}
                    {currentUserId && (
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          if (actionType === "signature" && onDeleteSignature) {
                            onDeleteSignature(currentUserId);
                          } else if (actionType === "stamp" && onDeleteStamp) {
                            onDeleteStamp(currentUserId);
                          }
                          setPreviewUrl(null);
                          setSelectedFile(null);
                        }}
                      >
                        {actionType === "signature" &&
                          users.find((user) => user.id === currentUserId)?.signatureMinioUrl
                          ? "Eliminar firma"
                          : actionType === "stamp" &&
                            users.find((user) => user.id === currentUserId)?.imageMinioUrl
                            ? "Eliminar sello"
                            : "Eliminar"}
                      </button>
                    )}
                    {/* Botón de Confirmar/Actualizar */}
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleConfirm}
                    >
                      {actionType === "signature" &&
                        users.find((user) => user.id === currentUserId)?.signatureMinioUrl
                        ? "Actualizar firma"
                        : actionType === "stamp" &&
                          users.find((user) => user.id === currentUserId)?.imageMinioUrl
                          ? "Actualizar sello"
                          : "Confirmar"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

        <CustomFormModal
          show={showAssistantsModal}
          formId="assistantsForm"
          title="Gestionar asistentes"
          onHide={() => setShowAssistantsModal(false)}
        >
          <UserAssistantForm
            formId="assistantsForm"
            onHandleSubmit={handleAssistantsSubmit}
            initialData={assistantsFormInitialData}
          />
        </CustomFormModal>

        <GoogleCalendarModal
          show={showGoogleCalendarModal}
          userId={currentUserId || ''}
          userEmail={currentEmail || ''}
          onHide={() => setShowGoogleCalendarModal(false)}
          onSuccess={() => {
            onReload && onReload();
          }}
          toast={toast.current}
        />
      </div>
    </>
  );
};

export default UserTable;