import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from '../../components/TableBasicActions';
import { ExamTypeDto } from '../../models/models';

type ExamConfigTableItem = {
    id: string
    examTypeName: string
    description: string
}

type ExamConfigTableProps = {
    exams: ExamTypeDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

export const ExamConfigTable: React.FC<ExamConfigTableProps> = ({ exams, onEditItem, onDeleteItem }) => {
    const [tableExams, setTableExams] = useState<ExamConfigTableItem[]>([]);

    useEffect(() => {
        const mappedExams: ExamConfigTableItem[] = exams.map(exam => {
            return {
                id: exam.id,
                examTypeName: exam.name,
                description: exam.description ?? '--'
            }
        })
        setTableExams(mappedExams);
    }, [exams])

    const columns: ConfigColumns[] = [
        { data: 'examTypeName' },
        { data: 'description' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        2: (cell, data: ExamConfigTableItem) => (
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
                        data={tableExams}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Nombre</th>
                                <th className="border-top custom-th">Descripción</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
