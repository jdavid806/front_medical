import React, { useState, useEffect, useCallback, useRef } from "react";
import { Toast } from "primereact/toast";
import { ConfigColumns } from "datatables.net-bs5";
import { TicketDto, TicketTableItemDto } from "../../models/models";
import { useAllTableTickets } from "../hooks/useAllTableTickets";
import CustomDataTable from "../../components/CustomDataTable";
import {
  ticketPriorities,
  ticketReasons,
  ticketStatus,
  ticketStatusColors,
  ticketStatusSteps,
} from "../../../services/commons";
import { ticketService, userService } from "../../../services/api";
import "https://js.pusher.com/8.2.0/pusher.min.js";
import { useLoggedUser } from "../../users/hooks/useLoggedUser";
import { getJWTPayload } from "../../../services/utilidades";
import { useMassMessaging } from "../../hooks/useMassMessaging";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from "../../../services/utilidades";
import { useTemplate } from "../../hooks/useTemplate";
import { templateService } from "../../../services/api";

export const TicketTable = () => {
  const { loggedUser } = useLoggedUser();
  const { tickets } = useAllTableTickets();
  const [data, setData] = useState<TicketTableItemDto[]>([]);
  const [filteredData, setFilteredData] = useState<TicketTableItemDto[]>([]);
  const [ticketReasonsBackend, setTicketReasonsBackend] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [tableKey, setTableKey] = useState(0);
  const toast = useRef<Toast>(null);

  const columns: ConfigColumns[] = [
  { 
    data: "ticket_number",
    render: (data) => data || "-"
  },
  { 
    data: "reason",
    defaultContent: "Motivo no disponible",
    render: (data) => data || "Motivo no disponible"
  },
  { 
    data: "priority",
    render: (data) => data || "-"
  },
  { 
    data: "statusView",
    render: (data) => data || "-"
  },
  // { orderable: false, searchable: false },
];

  const {
    sendMessage: sendMessageTickets,
    responseMsg,
    loading: loadingMsg,
    error: errorMsg,
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const dataTemplate = {
    tenantId: tenant,
    belongsTo: "turnos-llamado",
    type: "whatsapp",
  };
  const { template, setTemplate, fetchTemplate } = useTemplate(dataTemplate);
  const sendMessageTicketsRef = useRef(sendMessageTickets);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        setLoading(true);

        const response = await ticketService.getAllTicketReasons();
        const reasonsMap = response.reasons.reduce((acc: any, reason: any) => {
          acc[reason.key] = reason.label;
          return acc;
        }, {});
        setTicketReasonsBackend(reasonsMap);
        setDataReady(true);
        setTableKey(prev => prev + 1);
      } catch (error) {
        console.error("Error al cargar ticket reasons:", error);
        setDataReady(true);
        setTableKey(prev => prev + 1);
      } finally {
        setLoading(false);
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
      cluster: "us2",
    });

    var hostname = window.location.hostname.split(".")[0];
    const channel = pusher.subscribe(`tickets.${hostname}`);

    channel.bind(
      "ticket.generated",
      function (data: { ticket: TicketDto | any } | any) {
        console.log("data0", data)
        console.log("data0", data);
        console.log("data1", data)
        const reasonText =(data.ticket.reason &&
                  ticketReasonsBackend[data.ticket.reason]) ||
                  "Motivo no disponible";
        const newTicketData: TicketTableItemDto | any = {
          id: data.ticket.id,
          ticket_number: data.ticket.ticket_number,
          phone: data.ticket.phone,
          reason: reasonText,
          reason_key: data.ticket.reason,
          priority: ticketPriorities[data.ticket.priority] || "NORMAL",
          status: data.ticket.status,
          statusView: ticketStatus[data.ticket.status] || "PENDIENTE",
          statusColor: ticketStatusColors[data.ticket.status],
          step: ticketStatusSteps[data.ticket.status],
          created_at: data.ticket.created_at,
          branch_id: data.ticket.branch_id,
          branch: data.branch || "Sin consultorio",
          module: data.module || "Sin modulo",
          module_id: data.ticket.module_id,
          patient: data?.ticket?.patient,
        };

        setData((prevData) => {
          const newData = [...prevData];
          const priorityOrder = (
            a: TicketTableItemDto,
            b: TicketTableItemDto
          ) => {
            const priorities = [
              "PREGNANT",
              "SENIOR",
              "DISABILITY",
              "CHILDREN_BABY",
            ];
            const priorityA = priorities.indexOf(a.priority);
            const priorityB = priorities.indexOf(b.priority);
            return priorityA - priorityB;
          };
          newData.splice(0, 0, newTicketData);
          newData.sort(
            (a, b) =>
              priorityOrder(a, b) ||
              new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
          );
          return newData;
        });
      }
    );
    
    channel.bind("ticket.state.updated", function (data) {
      setData((prevData) => {
        const newData = [...prevData];
        const index = newData.findIndex(
          (item) => item.id == data.ticketId.toString()
        );

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
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [tickets, ticketReasonsBackend]);

  // ⬇️ MEJORADO: Solo procesar cuando ticketReasonsBackend esté listo
  useEffect(() => {
    if (Object.keys(ticketReasonsBackend).length === 0 || !tickets.length) {
      return;
    }

    const processedData = tickets.map((ticket: any) => {
      // ⬇️ VALIDACIÓN MÁS ROBUSTA
      const reasonText = ticket.reason_label || 
                        (ticket.reason && ticketReasonsBackend[ticket.reason]) || 
                        "Motivo no disponible";

      return {
        id: ticket.id,
        ticket_number: ticket.ticket_number || "-",
        phone: ticket.phone || "-",
        reason: reasonText,
        reason_key: ticket.reason,
        priority: ticketPriorities[ticket.priority] || "NORMAL",
        module_name: ticket.module?.name || "",
        status: ticket.status || "PENDING",
        statusView: ticketStatus[ticket.status] || "PENDIENTE",
        statusColor: ticketStatusColors[ticket.status],
        step: ticketStatusSteps[ticket.status],
        created_at: ticket.created_at,
        branch_id: ticket.branch_id,
        branch: ticket.branch || "Sin consultorio",
        module: ticket.module || "Sin modulo",
        module_id: ticket.module_id,
        patient: ticket.patient,
      };
    });

    setData(processedData);
  }, [tickets, ticketReasonsBackend]);

  // ⬇️ MEJORADO: Filtrar y ordenar datos
  useEffect(() => {

    if (!data.length || !loggedUser || !Array.isArray(loggedUser.availabilities)) {
      setFilteredData([]);
      return;
    }

    const filteredAndSorted = data
      .filter((item) => {
        if (!item.status || (!item.reason_key && !item.reason)) {
          console.warn("Item inválido omitido:", item);
          return false;
        }

        const statusMatch = item.status === "PENDING" || item.status === "CALLED";

        const reasonMatch = loggedUser.availabilities.some((availability) => {
          const allowed = availability?.module?.allowed_reasons || [];
          return item.reason_key && allowed.includes(item.reason_key);
        });

        return statusMatch && reasonMatch;
      })
      .sort((a, b) => {
        const priorities = ["PREGNANT", "SENIOR", "DISABILITY", "CHILDREN_BABY"];
        const priorityA = priorities.indexOf(a.priority);
        const priorityB = priorities.indexOf(b.priority);

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });

    console.log("Datos filtrados y ordenados:", filteredAndSorted.length);
    setFilteredData(filteredAndSorted);
  }, [data, loggedUser]);

  const updateStatus = async (id: string, status: string) => {
    await ticketService.update(id, { status });
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              step: ticketStatusSteps[status],
              status,
              statusView: ticketStatus[status],
            }
          : item
      )
    );
  };

  const callTicket = async (ticket: any) => {
    console.log("ticket", ticket)
    const user = await userService.getByExternalId(getJWTPayload().sub);

    const hasActiveTicket = data.some(
      (t) => t.status === "CALLED" && t.module_id === user?.today_module_id
    );
    
    if (hasActiveTicket) {
      toast.current?.show({
        severity: "warn",
        summary: "Turno en curso",
        detail: "Ya hay un turno en curso en este módulo.",
        life: 4000,
      });
      return;
    }

    const status = "CALLED";
    await ticketService.update(ticket.id, { status, module_id: user?.today_module_id });

    setData((prevData) =>
      prevData.map((item) =>
        item.id === ticket.id
          ? { ...item, step: ticketStatusSteps[status], status, statusView: ticketStatus[status] }
          : item
      )
    );
    
    await sendMessageWhatsapp(ticket);
  };

  const sendMessageWhatsapp = useCallback(async (data) => {
    const replacements = {
      NOMBRE_PACIENTE: `${data?.patient?.first_name ?? ""} ${data?.patient?.middle_name ?? ""} ${data?.patient?.last_name ?? ""} ${data?.patient?.second_last_name ?? ""}`,
      TICKET: `${data?.ticket_number}`,
      MODULO: `${data?.module?.name ?? ""}`,
      ESPECIALISTA: `${""}`,
      CONSULTORIO: `${data?.branch?.address ?? ""}`,
    };

    try {
      const response = await templateService.getTemplate(dataTemplate);
      const templateFormatted = formatWhatsAppMessage(response.data.template, replacements);

      const dataMessage = {
        channel: "whatsapp",
        message_type: "text",
        recipients: [getIndicativeByCountry(data?.patient ? data?.patient.country_id : data?.branch?.country) + data?.phone],
        message: templateFormatted,
        webhook_url: "https://example.com/webhook",
      };

      await sendMessageTicketsRef.current(dataMessage);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [sendMessageTickets]);

  const slots = {
    3: (cell, data: TicketTableItemDto) => (
      <span className={`badge badge-phoenix badge-phoenix-${ticketStatusColors[data.status] || "secondary"}`}>
        {data.statusView || "PENDIENTE"}
      </span>
    ),
    4: (cell, data: TicketTableItemDto) => {
      const ticketIndex = filteredData.findIndex((t) => t.id === data.id);
      const firstPendingIndex = filteredData.findIndex((t) => t.status === "PENDING");
      const hasActiveTicket = filteredData.some(
        (t) => t.status === "CALLED" && t.module_id === loggedUser?.today_module_id
      );

      return (
        <>
          <div className={`d-flex flex-wrap gap-1 ${data.status === "CALLED" ? "" : "d-none"}`}>
            <button className="btn btn-success" onClick={() => updateStatus(data.id, "COMPLETED")}>
              <i className="fas fa-check"></i>
            </button>
            <button className="btn btn-danger" onClick={() => updateStatus(data.id, "MISSED")}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </>
      );
    },
  };

  return (
    <div className="card mb-3">
      <Toast ref={toast} />
      <div className="card-body">
        <div className="row">
          <div className="col-md-9">
            <div className="d-flex flex-wrap gap-2 mb-4">
              <span className="badge badge-phoenix badge-phoenix-warning">
                Pendientes: {data.filter((item) => item.status === "PENDING").length}
              </span>
              <span className="badge badge-phoenix badge-phoenix-success">
                Completados: {data.filter((item) => item.status === "COMPLETED" && item.module_id == loggedUser?.today_module_id).length}
              </span>
              <span className="badge badge-phoenix badge-phoenix-danger">
                Perdidos: {data.filter((item) => item.status === "MISSED").length}
              </span>
            </div>

            {/* ⬇️ SOLUCIÓN DEFINITIVA: Key para forzar re-render */}
            {!dataReady ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p>Cargando turnos...</p>
              </div>
            ) : (
              <CustomDataTable
                key={tableKey}
                data={filteredData}
                slots={slots}
                columns={columns}
                customOptions={{
                  ordering: false,
                  searching: false,
                  info: false,
                  deferRender: true,
                  responsive: true,
                  autoWidth: false,
                }}
              >
                <thead>
                  <tr>
                    <th className="border-top custom-th">Turno</th>
                    <th className="border-top custom-th">Motivo</th>
                    <th className="border-top custom-th">Prioridad</th>
                    <th className="border-top custom-th">Estado</th>
                    <th className="text-end align-middle pe-0 border-top mb-2 text-center" scope="col"></th>
                  </tr>
                </thead>
              </CustomDataTable>
            )}
          </div>

          <div className="col-md-3 d-flex flex-column gap-3 text-center">
            <button
              className="btn btn-primary"
              onClick={() => {
                const nextTicket = filteredData.find((ticket) => ticket.status === "PENDING");
                if (!nextTicket) {
                  toast.current?.show({ severity: "warn", summary: "Sin turnos pendientes", detail: "No hay turnos pendientes para llamar.", life: 4000 });
                  return;
                }
                const hasActiveTicket = filteredData.some((t) => t.status === "CALLED" && t.module_id === loggedUser?.today_module_id);
                if (hasActiveTicket) {
                  toast.current?.show({ severity: "warn", summary: "Turno en curso", detail: "Ya hay un turno en curso en este módulo.", life: 4000 });
                  return;
                }
                callTicket(nextTicket);
              }}
              disabled={!dataReady || loading}
            >
              <i className="fas fa-arrow-right me-2"></i>
              {!dataReady || loading ? "Cargando..." : "Llamar siguiente turno"}
            </button>

            <div className="card d-flex flex-grow-1">
              <div className="card-body">
                {data.filter((ticket) => ticket.status === "MISSED").length > 0 ? (
                  data.filter((ticket) => ticket.status === "MISSED").map((ticket) => (
                    <div key={ticket.ticket_number} className="border-bottom mb-2 pb-2">
                      <h5 className="card-title">Ticket {ticket.ticket_number}</h5>
                      <p className="card-text">Motivo: {ticket.reason}</p>
                      <p className="card-text">Prioridad: {ticket.priority}</p>
                      <button className="btn btn-primary" onClick={() => callTicket(ticket)} disabled={!dataReady || loading}>
                        <i className="fas fa-phone me-2"></i>
                        Llamar nuevamente
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">No hay turnos perdidos</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};