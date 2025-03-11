import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { TableBasicActions } from '../../components/TableBasicActions';
import { PatientClinicalRecordDto, PatientClinicalRecordsTableItem } from '../../models/models';
import { SeeDetailTableAction } from '../../components/table-actions/SeeDetailTableAction';
import { RequestCancellationTableAction } from '../../components/table-actions/RequestCancellationTableAction';
import { PrintTableAction } from '../../components/table-actions/PrintTableAction';
import { DownloadTableAction } from '../../components/table-actions/DownloadTableAction';

type PatientClinicalRecordItem = {
    id: string
    patientName: string
    diagnosis: string
}

type PatientClinicalRecordsTableProps = {
    records: PatientClinicalRecordDto[]
    onSeeDetail: (id: string) => void
    onCancelItem: (id: string) => void
    onPrintItem: (id: string) => void
    onDownloadItem: (id: string) => void
    onShareItem: (id: string, type: string) => void
}

export const PatientClinicalRecordsTable: React.FC<PatientClinicalRecordsTableProps> = ({ records, onSeeDetail, onCancelItem, onPrintItem, onDownloadItem, onShareItem }) => {
    const [tableRecords, setTableRecords] = useState<PatientClinicalRecordsTableItem[]>([]);

    useEffect(() => {
        const mappedRecords: PatientClinicalRecordsTableItem[] = records.map(record => {
            return {
                id: record.id,
                status: record.clinical_record_type.id
            }
        })
        setTableRecords(mappedRecords);
    }, [records])

    const columns: ConfigColumns[] = [
        { data: 'patientName' },
        { data: 'diagnosis' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        4: (cell, data: PatientClinicalRecordsTableItem) => (
            <div className="text-end align-middle">
                <div className="dropdown">
                    <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i data-feather="settings"></i> Acciones
                    </button>
                    <ul className="dropdown-menu" style={{ zIndex: 10000 }}>

                        <SeeDetailTableAction onTrigger={() => onSeeDetail(data.id)} />
                        {data.status === 'approved' && (
                            <RequestCancellationTableAction onTrigger={() => onCancelItem(data.id)} />
                        )}
                        <PrintTableAction onTrigger={() => onPrintItem(data.id)} />
                        <DownloadTableAction onTrigger={() => onDownloadItem(data.id)} />
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-header">Compartir</li>
                        <li>
                            <a className="dropdown-item"
                                href="#"
                                onClick={() => onShareItem(data.id, 'whatsapp')}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-brands fa-whatsapp" style={{ width: '20px' }}></i>
                                    <span>Compartir por Whatsapp</span>
                                </div>
                            </a>
                        </li>
                        <li>
                            <a className="dropdown-item"
                                href="#"
                                onClick={() => onShareItem(data.id, 'email')}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-envelope" style={{ width: '20px' }}></i>
                                    <span>Compartir por Correo</span>
                                </div>
                            </a>
                        </li>
                    </ul>
                </div>
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
                                <th className="border-top custom-th">Descripción</th>
                                <th className="border-top custom-th">Estado</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col">Acciones</th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
