import React, { useState, useEffect } from 'react';
import { ConfigColumns } from 'datatables.net-bs5';
import { TicketDto, TicketTableItemDto } from '../../models/models';
import { useAllTableTickets } from '../hooks/useAllTableTickets';
import CustomDataTable from '../../components/CustomDataTable';
import { ticketPriorities, ticketReasons, ticketStatus, ticketStatusColors, ticketStatusSteps } from '../../../services/commons';
import { ticketService, userService } from '../../../services/api';
import 'https://js.pusher.com/8.2.0/pusher.min.js';
import { useLoggedUser } from '../../users/hooks/useLoggedUser';
import { getJWTPayload } from '../../../services/utilidades';

export const TicketTable = () => {
    const { loggedUser } = useLoggedUser()
    const { tickets } = useAllTableTickets();
    const [data, setData] = useState<TicketTableItemDto[]>([]);
    const [filteredData, setFilteredData] = useState<TicketTableItemDto[]>([]);

    const columns: ConfigColumns[] = [
        { data: 'ticket_number' },
        { data: 'reason' },
        { data: 'priority' },
        { data: 'statusView' },
        { orderable: false, searchable: false },
    ];

    useEffect(() => {
        // @ts-ignore
        const pusher = new Pusher('5e57937071269859a439', {
            cluster: 'us2'
        });

        var hostname = window.location.hostname.split('.')[0];
        const channel = pusher.subscribe(`tickets.${hostname}`);

        channel.bind('ticket.generated', function (data: { ticket: TicketDto }) {
            console.log('ticket.generated', data);
            const newTicketData: TicketTableItemDto = {
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
                const priorityOrder = (a: TicketTableItemDto, b: TicketTableItemDto) => {
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

        return () => {
            channel.unbind_all(); // Eliminar todos los listeners
            channel.unsubscribe(); // Desuscribirse del canal
            pusher.disconnect(); // Desconectar Pusher
        };
    }, [])

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
            }
        }));
    }, [tickets]);

    useEffect(() => {
        setFilteredData(
            data.filter(item => {
                return (
                    (
                        item.status == 'PENDING' ||
                        (
                            item.status == 'CALLED' &&
                            item.module_id == loggedUser?.today_module_id
                        )
                    ) &&
                    item.branch_id == "3"
                )
            })
        );
    }, [data]);

    const updateStatus = async (id: string, status: string) => {
        await ticketService.update(id, {
            status
        });
        setData(prevData => prevData.map(item =>
            item.id === id ? {
                ...item,
                step: ticketStatusSteps[status],
                status,
                statusView: ticketStatus[status],
            } : item
        ));
    }

    const callTicket = async (id: string) => {
        const status = 'CALLED';
        const user = await userService.getByExternalId(getJWTPayload().sub);

        console.log(user);


        await ticketService.update(id, {
            status,
            module_id: user?.today_module_id
        });

        setData(prevData => prevData.map(item =>
            item.id === id ? {
                ...item,
                step: ticketStatusSteps[status],
                status,
                statusView: ticketStatus[status],
            } : item
        ));

        // @ts-ignore
        callShiftMessage(id)
    }

    const slots = {
        3: (cell, data: TicketTableItemDto) => (
            <span
                className={`badge badge-phoenix badge-phoenix-${ticketStatusColors[data.status]}`}
            >
                {data.statusView}
            </span>
        ),
        4: (cell, data: TicketTableItemDto) => (
            <>
                <button
                    className={`btn btn-primary ${data.step === 1 ? "" : "d-none"}`}
                    onClick={() => callTicket(data.id)}
                >
                    <i className="fas fa-phone"></i>
                </button>
                <div className={`d-flex flex-wrap gap-1 ${data.step === 2 ? "" : "d-none"}`}>
                    <button
                        className={`btn btn-success`}
                        onClick={() => updateStatus(data.id, "COMPLETED")}
                    >
                        <i className="fas fa-check"></i>
                    </button>
                    <button
                        className={`btn btn-danger`}
                        onClick={() => updateStatus(data.id, "MISSED")}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </>
        )
    }

    return (
        <div className="card mb-3">
            <div className="card-body">
                <div className="row">
                    <div className="col-md-9">
                        <div className="d-flex flex-wrap gap-2 mb-4">
                            <span className="badge badge-phoenix badge-phoenix-warning">
                                Pendientes: {data.filter(item => item.status === "PENDING").length}
                            </span>
                            <span className="badge badge-phoenix badge-phoenix-success">
                                Completados: {data.filter(item => (
                                    item.status === "COMPLETED" &&
                                    item.module_id == loggedUser?.today_module_id
                                )).length}
                            </span>
                            <span className="badge badge-phoenix badge-phoenix-danger">
                                Perdidos: {data.filter(item => item.status === "MISSED").length}
                            </span>
                        </div>

                        <CustomDataTable
                            data={filteredData}
                            slots={slots}
                            columns={columns}
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
                    </div>
                    <div className="col-md-3 d-flex flex-column gap-3 text-center">
                        <button className="btn btn-primary"
                            onClick={() => {
                                const nextTicket = filteredData.find(ticket => ticket.status === "PENDING");
                                if (nextTicket) {
                                    callTicket(nextTicket.id)
                                }
                            }}
                        >
                            <i className="fas fa-arrow-right me-2"></i>
                            Llamar siguiente turno
                        </button>
                        <div className="card d-flex flex-grow-1">
                            <div className="card-body">
                                {data.filter(ticket => ticket.status === "MISSED").length > 0 ? (
                                    data.filter(ticket => ticket.status === "MISSED").map(ticket => (
                                        <div key={ticket.ticket_number} className="border-bottom mb-2 pb-2">
                                            <h5 className="card-title">Ticket {ticket.ticket_number}</h5>
                                            <p className="card-text">Motivo: {ticket.reason}</p>
                                            <p className="card-text">Prioridad: {ticket.priority}</p>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => callTicket(ticket.id)}
                                            >
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

