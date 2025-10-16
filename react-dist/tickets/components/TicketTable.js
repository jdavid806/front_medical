import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast } from "primereact/toast";
import { useAllTableTickets } from "../hooks/useAllTableTickets.js";
import CustomDataTable from "../../components/CustomDataTable.js";
import { ticketPriorities, ticketStatus, ticketStatusColors, ticketStatusSteps } from "../../../services/commons.js";
import { ticketService, userService } from "../../../services/api/index.js";
import "https://js.pusher.com/8.2.0/pusher.min.js";
import { useLoggedUser } from "../../users/hooks/useLoggedUser.js";
import { getJWTPayload } from "../../../services/utilidades.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import { formatWhatsAppMessage, getIndicativeByCountry } from "../../../services/utilidades.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { templateService } from "../../../services/api/index.js";
export const TicketTable = () => {
  const {
    loggedUser
  } = useLoggedUser();
  const {
    tickets
  } = useAllTableTickets();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [ticketReasonsBackend, setTicketReasonsBackend] = useState({});
  const toast = useRef(null);
  const columns = [{
    data: "ticket_number"
  }, {
    data: "reason"
  }, {
    data: "priority"
  }, {
    data: "statusView"
  }, {
    orderable: false,
    searchable: false
  }];
  const {
    sendMessage: sendMessageTickets,
    responseMsg,
    loading: loadingMsg,
    error: errorMsg
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const dataTemplate = {
    tenantId: tenant,
    belongsTo: "turnos-llamado",
    type: "whatsapp"
  };
  const {
    template,
    setTemplate,
    fetchTemplate
  } = useTemplate(dataTemplate);
  const sendMessageTicketsRef = useRef(sendMessageTickets);
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const response = await ticketService.getAllTicketReasons();
        // Transformar array a objeto { key: label }
        const reasonsMap = response.reasons.reduce((acc, reason) => {
          acc[reason.key] = reason.label;
          return acc;
        }, {});
        setTicketReasonsBackend(reasonsMap);
      } catch (error) {
        console.error("Error al cargar ticket reasons:", error);
      }
    };
    fetchReasons();
  }, []);
  useEffect(() => {
    sendMessageTicketsRef.current = sendMessageTickets;
  }, [sendMessageTickets]);
  useEffect(() => {
    // @ts-ignore
    const pusher = new Pusher("5e57937071269859a439", {
      cluster: "us2"
    });
    var hostname = window.location.hostname.split(".")[0];
    const channel = pusher.subscribe(`tickets.${hostname}`);
    channel.bind("ticket.generated", function (data) {
      const newTicketData = {
        id: data.ticket.id,
        ticket_number: data.ticket.ticket_number,
        phone: data.ticket.phone,
        reason: data.ticket.reason_label,
        reason_key: data.ticket.reason,
        priority: ticketPriorities[data.ticket.priority],
        status: data.ticket.status,
        statusView: ticketStatus[data.ticket.status],
        statusColor: ticketStatusColors[data.ticket.status],
        step: ticketStatusSteps[data.ticket.status],
        created_at: data.ticket.created_at,
        branch_id: data.ticket.branch_id,
        branch: data.branch || "Sin consultorio",
        module: data.module || "Sin modulo",
        module_id: data.ticket.module_id,
        patient: data?.ticket?.patient
      };
      setData(prevData => {
        const newData = [...prevData];
        const priorityOrder = (a, b) => {
          const priorities = ["PREGNANT", "SENIOR", "DISABILITY", "CHILDREN_BABY"];
          const priorityA = priorities.indexOf(a.priority);
          const priorityB = priorities.indexOf(b.priority);
          return priorityA - priorityB;
        };
        newData.splice(0, 0, newTicketData);
        newData.sort((a, b) => priorityOrder(a, b) || a.created_at.localeCompare(b.created_at));
        return newData;
      });
    });
    channel.bind("ticket.state.updated", function (data) {
      setData(prevData => {
        const newData = [...prevData];
        const index = newData.findIndex(item => item.id == data.ticketId.toString());
        if (index > -1) {
          newData[index].status = data.newState;
          newData[index].statusView = ticketStatus[data.newState];
          newData[index].statusColor = ticketStatusColors[data.newState];
          newData[index].step = ticketStatusSteps[data.newState];
          newData[index].module_id = data.moduleId;
        }
        return newData;
      });
    });
    return () => {
      channel.unbind_all(); // Eliminar todos los listeners
      channel.unsubscribe(); // Desuscribirse del canal
      pusher.disconnect(); // Desconectar Pusher
    };
  }, []);
  useEffect(() => {
    // console.log("ticketReasonsBackend", ticketReasonsBackend);
    // console.log("ticket", tickets);
    // if (Object.keys(ticketReasonsBackend).length === 0) return; // Espera a que el backend cargue

    setData(tickets.map(ticket => {
      return {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        phone: ticket.phone,
        reason: ticket.reason_label,
        reason_key: ticket.reason,
        priority: ticketPriorities[ticket.priority],
        module_name: ticket.module?.name || "",
        status: ticket.status,
        statusView: ticketStatus[ticket.status],
        statusColor: ticketStatusColors[ticket.status],
        step: ticketStatusSteps[ticket.status],
        created_at: ticket.created_at,
        branch_id: ticket.branch_id,
        branch: ticket.branch || "Sin consultorio",
        module: ticket.module || "Sin modulo",
        module_id: ticket.module_id,
        patient: ticket.patient
      };
    }));
  }, [tickets, ticketReasonsBackend]);

  // useEffect(() => {
  //   console.log("loggeduser", loggedUser);
  //   console.log("data", data);
  //   setFilteredData(
  //     data.filter((item) => {
  //       return (
  //         item.status == "PENDING" ||
  //         (item.status == "CALLED" &&
  //           item.module_id == loggedUser?.today_module_id)
  //       );
  //     })
  //   );
  // }, [data, loggedUser]);

  useEffect(() => {
    setFilteredData(data.filter(item => {
      const statusMatch = item.status === "PENDING" || item.status === "CALLED";
      const reasonMatch = Array.isArray(item.module?.allowed_reasons) && item.module.allowed_reasons.includes(item.reason_key);
      return statusMatch && reasonMatch;
    }));
  }, [data, loggedUser]);
  const updateStatus = async (id, status) => {
    await ticketService.update(id, {
      status
    });
    setData(prevData => prevData.map(item => item.id === id ? {
      ...item,
      step: ticketStatusSteps[status],
      status,
      statusView: ticketStatus[status]
    } : item));
  };

  // const callTicket = async (data: any) => {
  //   console.log("callticket",data);
  //   const status = "CALLED";
  //   const user = await userService.getByExternalId(getJWTPayload().sub);
  //   await ticketService.update(data.id, {
  //     status,
  //     module_id: user?.today_module_id,
  //   });

  //   setData((prevData) =>
  //     prevData.map((item) =>
  //       item.id === data.id
  //         ? {
  //             ...item,
  //             step: ticketStatusSteps[status],
  //             status,
  //             statusView: ticketStatus[status],
  //           }
  //         : item
  //     )
  //   );
  //   await sendMessageWhatsapp(data);
  // };

  const callTicket = async ticket => {
    const user = await userService.getByExternalId(getJWTPayload().sub);

    // Bloqueo: ya hay un turno en curso en este módulo
    const hasActiveTicket = data.some(t => t.status === "CALLED" && t.module_id === user?.today_module_id);
    if (hasActiveTicket) {
      toast.current?.show({
        severity: "warn",
        summary: "Turno en curso",
        detail: "Ya hay un turno en curso en este módulo.",
        life: 4000
      });
      return;
    }
    const status = "CALLED";
    await ticketService.update(ticket.id, {
      status,
      module_id: user?.today_module_id
    });
    setData(prevData => prevData.map(item => item.id === ticket.id ? {
      ...item,
      step: ticketStatusSteps[status],
      status,
      statusView: ticketStatus[status]
    } : item));
    await sendMessageWhatsapp(ticket);
  };
  const sendMessageWhatsapp = useCallback(async data => {
    const replacements = {
      NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""} ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""}`,
      TICKET: `${data?.ticket_number}`,
      MODULO: `${data?.module?.name ?? ""}`,
      ESPECIALISTA: `${""}`,
      CONSULTORIO: `${data?.branch?.address ?? ""}`
    };
    try {
      const response = await templateService.getTemplate(dataTemplate);
      const templateFormatted = formatWhatsAppMessage(response.data.template, replacements);
      const dataMessage = {
        channel: "whatsapp",
        message_type: "text",
        recipients: [getIndicativeByCountry(data?.patient ? data?.patient.country_id : data?.branch?.country) + data?.phone],
        message: templateFormatted,
        webhook_url: "https://example.com/webhook"
      };
      await sendMessageTicketsRef.current(dataMessage);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [sendMessageTickets]);

  // const slots = {
  //   3: (cell, data: TicketTableItemDto) => (
  //     <span
  //       className={`badge badge-phoenix badge-phoenix-${
  //         ticketStatusColors[data.status]
  //       }`}
  //     >
  //       {data.statusView}
  //     </span>
  //   ),
  //   4: (cell, data: TicketTableItemDto) => (
  //     <>
  //       <button
  //         className={`btn btn-primary ${data.step === 1 ? "" : "d-none"}`}
  //         onClick={() => callTicket(data)}
  //       >
  //         <i className="fas fa-phone"></i>
  //       </button>
  //       <div
  //         className={`d-flex flex-wrap gap-1 ${
  //           data.step === 2 ? "" : "d-none"
  //         }`}
  //       >
  //         <button
  //           className={`btn btn-success`}
  //           onClick={() => updateStatus(data.id, "COMPLETED")}
  //         >
  //           <i className="fas fa-check"></i>
  //         </button>
  //         <button
  //           className={`btn btn-danger`}
  //           onClick={() => updateStatus(data.id, "MISSED")}
  //         >
  //           <i className="fas fa-times"></i>
  //         </button>
  //       </div>
  //     </>
  //   ),
  // };

  const slots = {
    3: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${ticketStatusColors[data.status]}`
    }, data.statusView),
    4: (cell, data) => {
      // Validar si ya hay un turno en curso en este módulo
      const hasActiveTicket = filteredData.some(t => t.status === "CALLED" && t.module_id === loggedUser?.today_module_id);

      // Validar si este turno es el siguiente en la cola
      const nextTicket = filteredData.find(t => t.status === "PENDING");
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
        className: `btn btn-primary ${data.step === 1 && nextTicket?.id === data.id && !hasActiveTicket ? "" : "d-none"}`,
        onClick: () => callTicket(data)
      }, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-phone"
      })), /*#__PURE__*/React.createElement("div", {
        className: `d-flex flex-wrap gap-1 ${data.step === 2 ? "" : "d-none"}`
      }, /*#__PURE__*/React.createElement("button", {
        className: `btn btn-success`,
        onClick: () => updateStatus(data.id, "COMPLETED")
      }, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-check"
      })), /*#__PURE__*/React.createElement("button", {
        className: `btn btn-danger`,
        onClick: () => updateStatus(data.id, "MISSED")
      }, /*#__PURE__*/React.createElement("i", {
        className: "fas fa-times"
      }))));
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-warning"
  }, "Pendientes:", " ", data.filter(item => item.status === "PENDING").length), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-success"
  }, "Completados:", " ", data.filter(item => item.status === "COMPLETED" && item.module_id == loggedUser?.today_module_id).length), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-danger"
  }, "Perdidos:", " ", data.filter(item => item.status === "MISSED").length)), /*#__PURE__*/React.createElement(CustomDataTable, {
    data: filteredData,
    slots: slots,
    columns: columns
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Turno"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Motivo"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Prioridad"), /*#__PURE__*/React.createElement("th", {
    className: "border-top custom-th"
  }, "Estado"), /*#__PURE__*/React.createElement("th", {
    className: "text-end align-middle pe-0 border-top mb-2 text-center",
    scope: "col"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 d-flex flex-column gap-3 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => {
      const nextTicket = filteredData.find(ticket => ticket.status === "PENDING");
      if (!nextTicket) {
        toast.current?.show({
          severity: "warn",
          summary: "Sin turnos pendientes",
          detail: "No hay turnos pendientes para llamar.",
          life: 4000
        });
        return;
      }
      callTicket(nextTicket);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-right me-2"
  }), "Llamar siguiente turno"), /*#__PURE__*/React.createElement("div", {
    className: "card d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, data.filter(ticket => ticket.status === "MISSED").length > 0 ? data.filter(ticket => ticket.status === "MISSED").map(ticket => /*#__PURE__*/React.createElement("div", {
    key: ticket.ticket_number,
    className: "border-bottom mb-2 pb-2"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, "Ticket ", ticket.ticket_number), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Motivo: ", ticket.reason), /*#__PURE__*/React.createElement("p", {
    className: "card-text"
  }, "Prioridad: ", ticket.priority), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => callTicket(ticket)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-phone me-2"
  }), "Llamar nuevamente"))) : /*#__PURE__*/React.createElement("p", {
    className: "text-center text-muted"
  }, "No hay turnos perdidos")))))));
};