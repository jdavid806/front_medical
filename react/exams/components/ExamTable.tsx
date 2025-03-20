import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { ExamOrderDto } from '../../models/models';
import { examOrderStateColors, examOrderStates } from '../../../services/commons';
import { EditTableAction } from '../../components/table-actions/EditTableAction';
import { PrintTableAction } from '../../components/table-actions/PrintTableAction';
import { DownloadTableAction } from '../../components/table-actions/DownloadTableAction';
import { ShareTableAction } from '../../components/table-actions/ShareTableAction';

type ExamTableItem = {
    id: string
    examName: string
    status: string
    statusColor: string
}

type ExamTableProps = {
    exams: ExamOrderDto[]
    onLoadExamResults: (id: string) => void
}

export const ExamTable: React.FC<ExamTableProps> = ({ exams, onLoadExamResults }) => {
    const [tableExams, setTableExams] = useState<ExamTableItem[]>([]);

    useEffect(() => {
        const mappedExams: ExamTableItem[] = exams.map(exam => {
            return {
                id: exam.id,
                examName: exam.exam_type?.name ?? '--',
                status: examOrderStates[exam.exam_order_state?.name] ?? '--',
                statusColor: examOrderStateColors[exam.exam_order_state?.name] ?? '--'
            }
        })
        console.log('Mapped exams', mappedExams);

        setTableExams(mappedExams);
    }, [exams])

    const columns: ConfigColumns[] = [
        { data: 'examName', },
        { data: 'status' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        1: (cell, data: ExamTableItem) => (
            <span className={`badge badge-phoenix badge-phoenix-${data.statusColor}`}>{data.status}</span>
        ),
        2: (cell, data: ExamTableItem) => (
            <div className="d-flex justify-content-end">
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                    </button>
                    <ul className="dropdown-menu">
                        <li>
                            <a className="dropdown-item" href="#" id="cargarResultadosBtn" onClick={() => onLoadExamResults(data.id)}>
                                <div className="d-flex gap-2 align-items-center">
                                    <i className="fa-solid fa-upload" style={{ width: '20px' }}></i>
                                    <span>Cargar resultados</span>
                                </div>
                            </a>
                        </li>
                        <PrintTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(id, "Impresion", "Examen", "Completa", "Examen de prueba");
                        }} />
                        <DownloadTableAction onTrigger={() => {
                            //@ts-ignore
                            crearDocumento(id, "Impresion", "Examen", "Completa", "Examen de prueba");
                        }} />
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li className="dropdown-header">Compartir</li>
                        <ShareTableAction shareType='whatsapp' onTrigger={() => {
                            //@ts-ignore
                            enviarDocumento(id, "Descarga", "Consulta", "Completa", patient_id, UserManager.getUser().id, title)
                        }} />
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
                        data={tableExams}
                        slots={slots}
                        columns={columns}
                    >
                        <thead>
                            <tr>
                                <th className="border-top custom-th">Tipo de Examen</th>
                                <th className="border-top custom-th">Estado</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
        </>
    )
}
