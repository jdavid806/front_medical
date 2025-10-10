import React, { useState, useRef } from "react";
import { Toast } from 'primereact/toast';
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../components/CustomDataTable.js";
import { UserTableItem } from "../models/models.js";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper.js";
import { EditTableAction } from "../components/table-actions/EditTableAction.js";
import { DeleteTableAction } from "../components/table-actions/DeleteTableAction.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { UserAssistantForm, UserAssistantFormInputs } from "./UserAssistantForm.js";
import { useUserAssistantBulkCreate } from "./hooks/useUserAssistantBulkCreate.js";
import { userAssistantService } from "../../services/api/index.js";
import { GoogleCalendarModal } from './components/GoogleCalendarModal.jsx';

interface UserTableProps {
  users: UserTableItem[];
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  onAddSignature?: (file: File, id: string) => void;
  onAddStamp?: (file: File, id: string) => void;
  onDeleteSignature?: (id: string) => void;
  onDeleteStamp?: (id: string) => void;
  onReload?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({
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
  const [assistantsFormInitialData, setAssistantsFormInitialData] = useState<UserAssistantFormInputs | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"signature" | "stamp" | null>(
    null
  );
  const toast = useRef<Toast>(null);
  const [showGoogleCalendarModal, setShowGoogleCalendarModal] = useState(false);

  const { createUserAssistantBulk } = useUserAssistantBulkCreate();

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

  function saveSignature(signatureId, userId) {
    //@ts-ignore
    let urlUser = obtenerRutaPrincipal() + `/medical/users/` + userId;
    let jsonData = {
      firma_minio_url: signatureId,
    };
    //@ts-ignore
    actualizarDatos(urlUser, jsonData);
  }

  function saveStamp(stamp, userId) {
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
      assistants: assistants.data.map((assistant) => assistant.id),
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

  const columns: ConfigColumns[] = [
    { data: "fullName" },
    { data: "role" },
    { data: "city" },
    { data: "phone" },
    { data: "email" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    5: (cell, data: UserTableItem) => (
      <TableActionsWrapper>
        <li style={{ marginBottom: "8px" }}>
          <EditTableAction
            onTrigger={() => onEditItem && onEditItem(data.id)}
          />
        </li>
        <li style={{ marginBottom: "8px" }}>
          <DeleteTableAction
            onTrigger={() => onDeleteItem && onDeleteItem(data.id)}
          />
        </li>
        {data.roleGroup === "DOCTOR" && (
          <>
            <li style={{ marginBottom: "8px" }}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setCurrentUserId(data.id);
                  setActionType("signature");
                  document.getElementById("fileInput")?.click();
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <i
                    className="fas fa-file-signature"
                    style={{ width: "20px" }}
                  ></i>
                  <span>
                    {data.signatureMinioUrl ? "Actualizar firma" : "Añadir firma"}
                  </span>
                </div>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => {
                  setCurrentUserId(data.id);
                  setActionType("stamp");
                  document.getElementById("fileInput")?.click();
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <i className="fas fa-stamp" style={{ width: "20px" }}></i>
                  <span>
                    {data.imageMinioUrl ? "Actualizar sello" : "Añadir sello"}
                  </span>
                </div>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => openGoogleCalendarModal(data)}
              >
                <div className="d-flex gap-2 align-items-center">
                  <i className="fas fa-calendar-alt" style={{ width: "20px" }}></i>
                  <span>Configurar Google Calendar</span>
                </div>
              </a>
            </li>
            <li style={{ marginBottom: "8px" }}>
              <a
                className="dropdown-item"
                href="#"
                onClick={() => openAssistantsModal(data.id)}
              >
                <div className="d-flex gap-2 align-items-center">
                  <i
                    className="fas fa-user-nurse"
                    style={{ width: "20px" }}
                  ></i>
                  <span>Gestionar asistentes</span>
                </div>
              </a>
            </li>
          </>
        )}
      </TableActionsWrapper>
    ),
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable data={users} slots={slots} columns={columns}>
            <thead>
              <tr>
                <th className="border-top custom-th">Nombre</th>
                <th className="border-top custom-th">Rol</th>
                <th className="border-top custom-th">Ciudad</th>
                <th className="border-top custom-th">Número de contacto</th>
                <th className="border-top custom-th">Correo</th>
                <th
                  className="text-end align-middle pe-0 border-top mb-2"
                  scope="col"
                ></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>

      {/* Input de archivo (oculto) */}
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

      {/* Modal para previsualización */}
      {previewUrl && (
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
                      users.find((user) => user.id === currentUserId)?.signature
                      ? "Eliminar firma"
                      : actionType === "stamp" &&
                        users.find((user) => user.id === currentUserId)?.stamp
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
                    users.find((user) => user.id === currentUserId)?.signature
                    ? "Actualizar firma"
                    : actionType === "stamp" &&
                      users.find((user) => user.id === currentUserId)?.stamp
                      ? "Actualizar sello"
                      : "Confirmar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </>
  );
};

export default UserTable;
