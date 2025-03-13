import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../components/CustomDataTable.js';
import { UserTableItem } from '../models/models.js';
import TableActionsWrapper from '../components/table-actions/TableActionsWrapper.js';
import { EditTableAction } from '../components/table-actions/EditTableAction.js';
import { DeleteTableAction } from '../components/table-actions/DeleteTableAction.js';

interface UserTableProps {
    users: UserTableItem[]
    onEditItem?: (id: string) => void
    onDeleteItem?: (id: string) => void
    onAddSignature?: (id: string) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, onEditItem, onDeleteItem, onAddSignature }) => {

    const columns: ConfigColumns[] = [
        { data: 'fullName', },
        { data: 'role' },
        { data: 'city' },
        { data: 'phone' },
        { data: 'email' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        5: (cell, data: UserTableItem) => (
            <TableActionsWrapper>
                <EditTableAction onTrigger={() => onEditItem && onEditItem(data.id)} />
                <DeleteTableAction onTrigger={() => onDeleteItem && onDeleteItem(data.id)} />
                {data.roleGroup === 'DOCTOR' && (
                    <li>
                        <a className="dropdown-item"
                            href="#"
                            onClick={() => onAddSignature && onAddSignature(data.id)}>
                            <div className="d-flex gap-2 align-items-center">
                                <i className="fas fa-file-signature" style={{ width: '20px' }}></i>
                                <span>Añadir firma</span>
                            </div>
                        </a>
                    </li>
                )}
            </TableActionsWrapper>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={users}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Nombre</th>
                                <th className="border-top custom-th">Rol</th>
                                <th className="border-top custom-th">Ciudad</th>
                                <th className="border-top custom-th">Número de contacto</th>
                                <th className="border-top custom-th">Correo</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}

export default UserTable
