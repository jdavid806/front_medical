import React, { useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { TicketReasonFormInputs } from "./components/TicketReasonForm";
import { useTicketReasons } from "./hooks/useTicketReasons";
import { useTicketReason } from "./hooks/useTicketReason";
import { useTicketReasonCreate } from "./hooks/useTicketReasonCreate";
import { useTicketReasonUpdate } from "./hooks/useTicketReasonUpdate";
import { useTicketReasonDelete } from "./hooks/useTicketReasonDelete";
import { TicketReasonTable } from "./components/TicketReasonTable";
import { TicketReasonFormModal } from "./components/TicketReasonFormModal";

export const ReasonTicket = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState<
    TicketReasonFormInputs | undefined
  >(undefined);
  const toast = useRef<Toast>(null);

  const { ticketReasons, fetchTicketReasons } = useTicketReasons();
  const { ticketReason, fetchTicketReason } = useTicketReason();
  const { createTicketReason } = useTicketReasonCreate();
  const { updateTicketReason } = useTicketReasonUpdate();
  const { deleteTicketReason } = useTicketReasonDelete();

  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };

  const showSuccess = (msg: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: msg,
      life: 3000,
    });
  };

  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000,
    });
  };

  const handleSubmit = async (data: TicketReasonFormInputs) => {
    try {
      if (initialData?.id) {
        await updateTicketReason(initialData.id, data);
        showSuccess("Motivo de consulta actualizado correctamente");
      } else {
        await createTicketReason(data);
        showSuccess("Motivo de consulta creado correctamente");
      }
      fetchTicketReasons();
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
      showError("Error al guardar el motivo de consulta");
    }
  };

  const handleTableEdit = async (id: string) => {
    await fetchTicketReason(id);
    setShowFormModal(true);
  };

  const handleTableDelete = async (id: string) => {
    const success = await deleteTicketReason(id);
    if (success) {
      showSuccess("Motivo de consulta eliminado correctamente");
      fetchTicketReasons();
    } else {
      showError("Error al eliminar el motivo de consulta");
    }
  };

  useEffect(() => {
    if (ticketReason) {
      console.log(ticketReason.reason);
      setInitialData({
        id: ticketReason.reason.id,
        key: ticketReason.reason.key,
        label: ticketReason.reason.label,
        tag: ticketReason.reason.tag,
        is_active: ticketReason.reason.is_active,
      });
    }
  }, [ticketReason]);

  return (
    <PrimeReactProvider
      value={{ appendTo: "self", zIndex: { overlay: 100000 } }}
    >
      <Toast ref={toast} />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-1">Motivos de Consulta</h4>
        <div className="text-end mb-2">
          <button className="btn btn-primary" onClick={onCreate}>
            <i className="fas fa-plus"></i> Nuevo
          </button>
        </div>
      </div>
      <TicketReasonTable
        ticketReasons={ticketReasons}
        onEditItem={handleTableEdit}
        onDeleteItem={handleTableDelete}
      />
      <TicketReasonFormModal
        title={
          ticketReason
            ? "Editar motivo de consulta"
            : "Crear motivo de consulta"
        }
        show={showFormModal}
        handleSubmit={handleSubmit}
        onHide={() => setShowFormModal(false)}
        initialData={initialData}
      />
    </PrimeReactProvider>
  );
};
