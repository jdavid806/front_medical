import React, { useEffect, useRef, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Toast } from "primereact/toast";
import { useTicketReasons } from "./hooks/useTicketReasons.js";
import { useTicketReason } from "./hooks/useTicketReason.js";
import { useTicketReasonCreate } from "./hooks/useTicketReasonCreate.js";
import { useTicketReasonUpdate } from "./hooks/useTicketReasonUpdate.js";
import { useTicketReasonDelete } from "./hooks/useTicketReasonDelete.js";
import { TicketReasonTable } from "./components/TicketReasonTable.js";
import { TicketReasonFormModal } from "./components/TicketReasonFormModal.js";
export const ReasonTicket = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [initialData, setInitialData] = useState(undefined);
  const toast = useRef(null);
  const {
    ticketReasons,
    fetchTicketReasons
  } = useTicketReasons();
  const {
    ticketReason,
    fetchTicketReason
  } = useTicketReason();
  const {
    createTicketReason
  } = useTicketReasonCreate();
  const {
    updateTicketReason
  } = useTicketReasonUpdate();
  const {
    deleteTicketReason
  } = useTicketReasonDelete();
  const onCreate = () => {
    setInitialData(undefined);
    setShowFormModal(true);
  };
  const showSuccess = msg => {
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: msg,
      life: 3000
    });
  };
  const showError = msg => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 3000
    });
  };
  const handleSubmit = async data => {
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
  const handleTableEdit = async id => {
    await fetchTicketReason(id);
    setShowFormModal(true);
  };
  const handleTableDelete = async id => {
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
        is_active: ticketReason.reason.is_active
      });
    }
  }, [ticketReason]);
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Motivos de Consulta"), /*#__PURE__*/React.createElement("div", {
    className: "text-end mb-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }), " Nuevo"))), /*#__PURE__*/React.createElement(TicketReasonTable, {
    ticketReasons: ticketReasons,
    onEditItem: handleTableEdit,
    onDeleteItem: handleTableDelete
  }), /*#__PURE__*/React.createElement(TicketReasonFormModal, {
    title: ticketReason ? "Editar motivo de consulta" : "Crear motivo de consulta",
    show: showFormModal,
    handleSubmit: handleSubmit,
    onHide: () => setShowFormModal(false),
    initialData: initialData
  }));
};