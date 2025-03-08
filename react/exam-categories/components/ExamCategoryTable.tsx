import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from '../../components/TableBasicActions';
import { ExamCategoryDto } from '../../models/models';

type ExamCategoryTableItem = {
    id: string
    examCategoryName: string
}

type ExamCategoryTableProps = {
    examCategories: ExamCategoryDto[]
    onEditItem: (id: string) => void
    onDeleteItem: (id: string) => void
}

export const ExamCategoryTable: React.FC<ExamCategoryTableProps> = ({ examCategories, onEditItem, onDeleteItem }) => {
    const [tableExamCategories, setTableExamCategories] = useState<ExamCategoryTableItem[]>([]);

    useEffect(() => {
        const mappedExamCategories: ExamCategoryTableItem[] = examCategories.map(examCategory => {
            return {
                id: examCategory.id,
                examCategoryName: examCategory.name
            }
        })
        setTableExamCategories(mappedExamCategories);
    }, [examCategories])

    const columns: ConfigColumns[] = [
        { data: 'examCategoryName' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        1: (cell, data: ExamCategoryTableItem) => (
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
                        data={tableExamCategories}
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
