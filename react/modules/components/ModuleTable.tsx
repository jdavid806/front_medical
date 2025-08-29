import React, { useEffect, useState } from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { TableBasicActions } from '../../components/TableBasicActions';
import { ModuleDto } from '../../models/models';
import { ticketService } from '../../../services/api';

type ModuleTableItem = {
    id: string
    moduleName: string
    branchName: string
    allowedReasons: string
}

type ModuleTableProps = {
    modules: ModuleDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

export const ModuleTable: React.FC<ModuleTableProps> = ({ modules, onEditItem, onDeleteItem }) => {
    const [tableModules, setTableModules] = useState<ModuleTableItem[]>([]);
    const [reasonMap, setReasonMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchReasons = async () => {
            try {
                const response = await ticketService.getAllTicketReasons();
                const map: { [key: string]: string } = {};
                response.reasons.forEach((r: any) => {
                    map[r.key] = r.label;
                });
                setReasonMap(map);
            } catch (error) {
                console.error("Error cargando razones:", error);
            }
        };

        fetchReasons();
    }, []);

    useEffect(() => {
        if (Object.keys(reasonMap).length === 0) return;

        const mappedModules: ModuleTableItem[] = modules.map(module_ => {
            return {
                id: module_.id,
                moduleName: module_.name,
                branchName: module_.branch.address,
                allowedReasons: module_.allowed_reasons
                    .map(reason => reasonMap[reason] || reason)
                    .join(', ')
            }
        });
        setTableModules(mappedModules);
    }, [modules, reasonMap]);

    const columns: ConfigColumns[] = [
        { data: 'moduleName' },
        { data: 'allowedReasons' },
        { orderable: false, searchable: false }
    ];

    const slots = {
        2: (cell, data: ModuleTableItem) => (
            <TableBasicActions
                onEdit={() => onEditItem(data.id)}
                onDelete={() => onDeleteItem(data.id)}
            />
        )
    };

    return (
        <div className="card mb-3">
            <div className="card-body">
                <CustomDataTable
                    data={tableModules}
                    slots={slots}
                    columns={columns}
                >
                    <thead>
                        <tr>
                            <th className="border-top custom-th">Nombre</th>
                            {/* <th className="border-top custom-th">Sucursal</th> */}
                            <th className="border-top custom-th">Motivos de visita a atender</th>
                            <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                        </tr>
                    </thead>
                </CustomDataTable>
            </div>
        </div>
    )
}
