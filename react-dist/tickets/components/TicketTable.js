import React, { useState, useEffect } from 'react';
import { useAllTableTickets } from "../hooks/useAllTableTickets.js";
import CustomDataTable from "../../components/CustomDataTable.js";
import { ticketPriorities, ticketReasons, ticketStatus, ticketStatusColors, ticketStatusSteps } from "../../../services/commons.js";
import { ticketService } from "../../../services/api/index.js";
import 'https://js.pusher.com/8.2.0/pusher.min.js';
export const TicketTable = () => {
  const {
    tickets
  } = useAllTableTickets();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const columns = [{
    data: 'ticket_number'
  }, {
    data: 'reason'
  }, {
    data: 'priority'
  }, {
    data: 'statusView'
  }, {
    orderable: false,
    searchable: false
  }];
  useEffect(() => {
    localStorage.setItem('module_id', '1');

    // @ts-ignore
    const pusher = new Pusher('5e57937071269859a439', {
      cluster: 'us2'
    });
    var hostname = window.location.hostname.split('.')[0];
    const channel = pusher.subscribe(`tickets.${hostname}.3`);
    channel.bind('ticket.generated', function (data) {
      console.log('ticket.generated', data);
      const newTicketData = {
        id: data.ticket.id,
        ticket_number: data.ticket.ticket_number,
        phone: data.ticket.phone,
        reason: ticketReasons[data.ticket.reason],
        priority: ticketPriorities[data.ticket.priority],
        status: data.ticket.status,
        statusView: ticketStatus[data.ticket.status],
        statusColor: ticketStatusColors[data.ticket.status],
        step: ticketStatusSteps[data.ticket.status],
        created_at: data.ticket.created_at,
        branch_id: data.ticket.branch_id,
        module_id: data.ticket.module_id
      };
      setData(prevData => {
        const newData = [...prevData];
        const priorityOrder = (a, b) => {
          const priorities = ['PREGNANT', 'SENIOR', 'DISABILITY', 'CHILDREN_BABY'];
          const priorityA = priorities.indexOf(a.priority);
          const priorityB = priorities.indexOf(b.priority);
          return priorityA - priorityB;
        };
        newData.splice(0, 0, newTicketData);
        newData.sort((a, b) => priorityOrder(a, b) || a.created_at.localeCompare(b.created_at));
        return newData;
      });
    });
    channel.bind('ticket.state.updated', function (data) {
      console.log('ticket.state.updated', data);
      setData(prevData => {
        const newData = [...prevData];
        const index = newData.findIndex(item => item.id == data.ticketId.toString());
        if (index > -1) {
          console.log(index, newData, data);
          newData[index].status = data.newState;
          newData[index].statusView = ticketStatus[data.newState];
          newData[index].statusColor = ticketStatusColors[data.newState];
          newData[index].step = ticketStatusSteps[data.newState];
          newData[index].module_id = data.moduleId;
        }
        return newData;
      });
    });
    console.log('module_id', localStorage.getItem('module_id'));
    return () => {
      channel.unbind_all(); // Eliminar todos los listeners
      channel.unsubscribe(); // Desuscribirse del canal
      pusher.disconnect(); // Desconectar Pusher
    };
  }, []);
  useEffect(() => {
    setData(tickets.map(ticket => {
      return {
        id: ticket.id,
        ticket_number: ticket.ticket_number,
        phone: ticket.phone,
        reason: ticketReasons[ticket.reason],
        priority: ticketPriorities[ticket.priority],
        module_name: ticket.module?.name || '',
        status: ticket.status,
        statusView: ticketStatus[ticket.status],
        statusColor: ticketStatusColors[ticket.status],
        step: ticketStatusSteps[ticket.status],
        created_at: ticket.created_at,
        branch_id: ticket.branch_id,
        module_id: ticket.module_id
      };
    }));
  }, [tickets]);
  useEffect(() => {
    setFilteredData(data.filter(item => {
      return (item.status == 'PENDING' || item.status == 'CALLED' && item.module_id == localStorage.getItem('module_id')) && item.branch_id == "3";
    }));
  }, [data]);
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
  const callTicket = async id => {
    const status = 'CALLED';
    await ticketService.update(id, {
      status,
      module_id: localStorage.getItem('module_id')
    });
    setData(prevData => prevData.map(item => item.id === id ? {
      ...item,
      step: ticketStatusSteps[status],
      status,
      statusView: ticketStatus[status]
    } : item));
  };
  const slots = {
    3: (cell, data) => /*#__PURE__*/React.createElement("span", {
      className: `badge badge-phoenix badge-phoenix-${ticketStatusColors[data.status]}`
    }, data.statusView),
    4: (cell, data) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      className: `btn btn-primary ${data.step === 1 ? "" : "d-none"}`,
      onClick: () => callTicket(data.id)
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
    }))))
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-9"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-warning"
  }, "Pendientes: ", data.filter(item => item.status === "PENDING").length), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-success"
  }, "Completados: ", data.filter(item => item.status === "COMPLETED" && item.module_id == localStorage.getItem('module_id')).length), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-phoenix badge-phoenix-danger"
  }, "Perdidos: ", data.filter(item => item.status === "MISSED").length)), /*#__PURE__*/React.createElement(CustomDataTable, {
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
      if (nextTicket) {
        callTicket(nextTicket.id);
      }
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
    onClick: () => callTicket(ticket.id)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-phone me-2"
  }), "Llamar nuevamente"))) : /*#__PURE__*/React.createElement("p", {
    className: "text-center text-muted"
  }, "No hay turnos perdidos")))))));
};