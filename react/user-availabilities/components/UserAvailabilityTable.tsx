import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { UserAvailabilityTableItem } from '../../models/models';
import TableActionsWrapper from '../../components/table-actions/TableActionsWrapper';
import { EditTableAction } from '../../components/table-actions/EditTableAction';
import { DeleteTableAction } from '../../components/table-actions/DeleteTableAction';

export interface UserAvailabilityTableProps {
    availabilities: UserAvailabilityTableItem[]
    onEditItem?: (id: string) => void
    onDeleteItem?: (id: string) => void
}

export const UserAvailabilityTable: React.FC<UserAvailabilityTableProps> = ({ availabilities, onEditItem, onDeleteItem }) => {

    const columns: ConfigColumns[] = [
        { data: 'doctorName', },
        { data: 'appointmentType' },
        { data: 'daysOfWeek' },
        { data: 'startTime' },
        { data: 'endTime' },
        { data: 'branchName' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        6: (cell, data: UserAvailabilityTableItem) => (
            <TableActionsWrapper>
                <EditTableAction onTrigger={() => onEditItem && onEditItem(data.id)}></EditTableAction>
                <DeleteTableAction onTrigger={() => onDeleteItem && onDeleteItem(data.id)}></DeleteTableAction>
            </TableActionsWrapper>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={availabilities}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Usuario</th>
                                <th className="border-top custom-th">Tipo de Cita</th>
                                <th className="border-top custom-th">Día de la Semana</th>
                                <th className="border-top custom-th">Hora de Inicio</th>
                                <th className="border-top custom-th">Hora de Fin</th>
                                <th className="border-top custom-th">Sucursal</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
