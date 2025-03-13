import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from '../../components/TableBasicActions';
import { UserRoleDto } from '../../models/models';
import TableActionsWrapper from '../../components/table-actions/TableActionsWrapper';
import { EditTableAction } from '../../components/table-actions/EditTableAction';
import { DeleteTableAction } from '../../components/table-actions/DeleteTableAction';

interface UserRoleTableItem {
    id: string;
    name: string;
}

type UserRoleTableProps = {
    userRoles: UserRoleDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

export const UserRoleTable: React.FC<UserRoleTableProps> = ({ userRoles, onEditItem, onDeleteItem }) => {
    const [tableUserRoles, setTableUserRoles] = useState<UserRoleTableItem[]>([]);

    useEffect(() => {
        const mappedUserRoles: UserRoleTableItem[] = userRoles.map(userRole => {
            return {
                id: userRole.id,
                name: userRole.name
            }
        })
        setTableUserRoles(mappedUserRoles);
    }, [userRoles])

    const columns: ConfigColumns[] = [
        { data: 'name' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        1: (cell, data: UserRoleTableItem) => (
            <div className='d-flex justify-content-end'>
                <TableActionsWrapper>
                    <EditTableAction onTrigger={() => onEditItem && onEditItem(data.id)}></EditTableAction>
                    <DeleteTableAction onTrigger={() => onDeleteItem && onDeleteItem(data.id)}></DeleteTableAction>
                </TableActionsWrapper>
            </div>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={tableUserRoles}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Nombre</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
