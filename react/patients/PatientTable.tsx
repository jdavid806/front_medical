import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import { useEffect } from 'react';
import { useState } from 'react';
import { Patient } from '../models/models';
import { getAge } from '../../services/utilidades';
import CustomDataTable from '../components/CustomDataTable';

type PatientTableItem = {
    id: string
    patientName: string
    documentNumber: string
    phone: string
    age: string
    dateLastAppointment: string
}

type PatientTableProps = {
    items: Patient[]
}

export const PatientTable: React.FC<PatientTableProps> = ({ items }) => {
    const [tableItems, setTableItems] = useState<PatientTableItem[]>([]);

    useEffect(() => {
        const mappedItems: PatientTableItem[] = items.map(item => {

            const lastAppointment = item.appointments
                .sort((a, b) => {
                    const dateComparison = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime();
                    if (dateComparison !== 0) return dateComparison;
                    const timeComparison = a.appointment_time.localeCompare(b.appointment_time);
                    return timeComparison;
                })[0] || null;

            const age = getAge(item.date_of_birth);

            return {
                id: item.id.toString(),
                patientName: (`${item.first_name || ''} ${item.middle_name || ''} ${item.last_name || ''} ${item.second_last_name || ''}`.trim()) || '--',
                documentNumber: item.document_number,
                phone: item.whatsapp || '--',
                age: age > 0 ? `${getAge(item.date_of_birth).toString()} años` : '--',
                dateLastAppointment: lastAppointment?.appointment_date || '--',
            }
        })
        setTableItems(mappedItems);
    }, [items])

    const columns: ConfigColumns[] = [
        { data: 'patientName' },
        { data: 'documentNumber' },
        { data: 'phone' },
        { data: 'age' },
        { data: 'dateLastAppointment' }
    ]

    const slots = {
        0: (cell, data: PatientTableItem) => (
            <>
                <a href={`verPaciente?id=${data.id}`}>
                    {data.patientName}
                </a>
            </>
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
                                <th className="border-top custom-th" style={{ width: '250px' }}>Nombre</th>
                                <th className="border-top custom-th">Identificación</th>
                                <th className="border-top custom-th">Teléfono</th>
                                <th className="border-top custom-th">Edad</th>
                                <th className="border-top custom-th">Fecha última cita</th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
