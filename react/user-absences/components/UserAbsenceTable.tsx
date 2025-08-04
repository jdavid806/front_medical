import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from '../../components/TableBasicActions';
import { UserAbsenceDto } from '../../models/models';
import { formatDate, formatDateDMY } from '../../../services/utilidades';

type UserAbsenceTableItem = {
    id: string
    doctorName: string
    reason: string
    startDate: string
    endDate: string
}

type UserAbsenceTableProps = {
    items: UserAbsenceDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

export const UserAbsenceTable: React.FC<UserAbsenceTableProps> = ({ items, onEditItem, onDeleteItem }) => {
    const [tableItems, setTableItems] = useState<UserAbsenceTableItem[]>([]);

    useEffect(() => {
        const mappedItems: UserAbsenceTableItem[] = items.map(item => {
            return {
                id: item.id,
                doctorName: `${item.user.first_name} ${item.user.middle_name} ${item.user.last_name} ${item.user.second_last_name}`,
                reason: item.reason,
                startDate: formatDateDMY(item.start_date),
                endDate: formatDateDMY(item.end_date),
            }
        })
        setTableItems(mappedItems);
    }, [items])

    const columns: ConfigColumns[] = [
        { data: 'startDate' },
        { data: 'endDate' },
        { data: 'doctorName' },
        { data: 'reason' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        4: (cell, data: UserAbsenceTableItem) => (
            <TableBasicActions
                onEdit={() => onEditItem(data.id)}
                onDelete={() => onDeleteItem(data.id)}
            >
            </TableBasicActions>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={tableItems}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Fecha inicial</th>
                                <th className="border-top custom-th">Fecha final</th>
                                <th className="border-top custom-th">Usuario</th>
                                <th className="border-top custom-th">Motivo</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
