import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { PatientClinicalRecordDto } from '../../models/models';
import { SeeDetailTableAction } from '../../components/table-actions/SeeDetailTableAction';
import { RequestCancellationTableAction } from '../../components/table-actions/RequestCancellationTableAction';
import { PrintTableAction } from '../../components/table-actions/PrintTableAction';
import { DownloadTableAction } from '../../components/table-actions/DownloadTableAction';
import { ShareTableAction } from '../../components/table-actions/ShareTableAction';
import TableActionsWrapper from '../../components/table-actions/TableActionsWrapper';
import { clinicalRecordStateColors, clinicalRecordStates } from '../../../services/commons';

interface PatientClinicalRecordsTableItem {
    id: string
    clinicalRecordName: string
    doctorName: string
    description: string
    status: string
}

type PatientClinicalRecordsTableProps = {
    records: PatientClinicalRecordDto[]
    onSeeDetail?: (id: string) => void
    onCancelItem?: (id: string) => void
    onPrintItem?: (id: string) => void
    onDownloadItem?: (id: string) => void
    onShareItem?: (id: string, type: string) => void
}

export const PatientClinicalRecordsTable: React.FC<PatientClinicalRecordsTableProps> = ({ records, onSeeDetail, onCancelItem, onPrintItem, onDownloadItem, onShareItem }) => {
    const [tableRecords, setTableRecords] = useState<PatientClinicalRecordsTableItem[]>([]);

    useEffect(() => {
        const mappedRecords: PatientClinicalRecordsTableItem[] = records.map(clinicalRecord => {
            return {
                id: clinicalRecord.id,
                clinicalRecordName: clinicalRecord.clinical_record_type.name,
                description: clinicalRecord.description || '--',
                doctorName: `${clinicalRecord.created_by_user.first_name} ${clinicalRecord.created_by_user.middle_name} ${clinicalRecord.created_by_user.last_name} ${clinicalRecord.created_by_user.second_last_name}`,
                status: clinicalRecord.clinical_record_type_id
            }
        })
        setTableRecords(mappedRecords);
    }, [records])

    const columns: ConfigColumns[] = [
        { data: 'clinicalRecordName' },
        { data: 'doctorName' },
        { data: 'description' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        // 3: (cell, data: PatientClinicalRecordsTableItem) => (
        //     <span
        //         className={`badge badge-phoenix badge-phoenix-${clinicalRecordStates[data.status]}`}
        //     >
        //         {clinicalRecordStateColors[data.status]}
        //     </span>
        // ),
        3: (cell, data: PatientClinicalRecordsTableItem) => (
            <div className="text-end align-middle">
                <TableActionsWrapper>
                    <SeeDetailTableAction onTrigger={() => onSeeDetail && onSeeDetail(data.id)} />

                    {data.status === 'approved' && (
                        <RequestCancellationTableAction onTrigger={() => onCancelItem && onCancelItem(data.id)} />
                    )}

                    <PrintTableAction onTrigger={() => onPrintItem && onPrintItem(data.id)} />
                    <DownloadTableAction onTrigger={() => onDownloadItem && onDownloadItem(data.id)} />

                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li className="dropdown-header">Compartir</li>

                    <ShareTableAction shareType='whatsapp' onTrigger={() => onShareItem && onShareItem(data.id, 'whatsapp')} />
                    <ShareTableAction shareType='email' onTrigger={() => onShareItem && onShareItem(data.id, 'email')} />
                </TableActionsWrapper>
            </div>
        )
    }

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <CustomDataTable
                        data={tableRecords}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Nombre de la historia</th>
                                <th className="border-top custom-th">Doctor(a)</th>
                                <th className="border-top custom-th">Observaciones</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col">Acciones</th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
