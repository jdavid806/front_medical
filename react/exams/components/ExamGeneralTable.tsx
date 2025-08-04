import React from 'react'
import { ConfigColumns } from 'datatables.net-bs5';
import CustomDataTable from '../../components/CustomDataTable';
import { useEffect } from 'react';
import { useState } from 'react';
import { ExamOrderDto } from '../../models/models';
import { examOrderStateColors, examOrderStates } from '../../../services/commons';
import { PrintTableAction } from '../../components/table-actions/PrintTableAction';
import { DownloadTableAction } from '../../components/table-actions/DownloadTableAction';
import { ShareTableAction } from '../../components/table-actions/ShareTableAction';
import { formatDate, ordenarPorFecha } from '../../../services/utilidades';
import { CustomModal } from '../../components/CustomModal';
import { examOrderService, userService } from '../../../services/api';
import { SwalManager } from '../../../services/alertManagerImported';

export type ExamTableItem = {
    id: string
    examName: string
    status: string
    statusColor: string
    state: string
    created_at: string
    dateTime: string
    patientId: string
    appointmentId: string
    minioId?: string
}

type ExamTableProps = {
    exams: ExamOrderDto[]
    onLoadExamResults: (id: ExamTableItem) => void
    onViewExamResults: (examTableItem: ExamTableItem, minioId?: string) => void
    onReload: () => void
}

export const ExamGeneralTable: React.FC<ExamTableProps> = ({ exams, onLoadExamResults, onViewExamResults, onReload }) => {
    const [tableExams, setTableExams] = useState<ExamTableItem[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const mappedExams: ExamTableItem[] = exams.map(exam => {
            return {
                id: exam.id,
                examName: (exam.items.length > 0 ? exam.items.map(item => item.exam.name).join(', ') : exam.exam_type?.name) || '--',
                status: examOrderStates[exam.exam_order_state?.name.toLowerCase()] ?? '--',
                statusColor: examOrderStateColors[exam.exam_order_state?.name.toLowerCase()] ?? '--',
                minioId: exam.minio_id,
                patientId: exam.patient_id,
                patientName: `${exam.patient.first_name || ''} ${exam.patient.middle_name || ''} ${exam.patient?.last_name || ''} ${exam.patient?.second_last_name || ''}`.trim(),
                appointmentId: exam.appointment_id,
                state: exam.exam_order_state?.name || 'pending',
                created_at: exam.created_at,
                dateTime: formatDate(exam.created_at)
            }
        })

        ordenarPorFecha(mappedExams, 'created_at')

        console.log('Mapped exams', mappedExams);

        setTableExams(mappedExams);
    }, [exams])

    const onUploadExamsFile = (examOrderId) => {
        setSelectedOrderId(examOrderId);
        setShowPdfModal(true);
    }

    const handleUploadExamsFile = async () => {
        try {
            // Llamar a la función guardarArchivoExamen
            //@ts-ignore
            const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);

            // Acceder a la PromiseResult
            if (enviarPDf !== undefined) {
                console.log("PDF de prueba:", enviarPDf);
                console.log("Resultado de la promesa:", enviarPDf);
                await examOrderService.updateMinioFile(selectedOrderId, enviarPDf);
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            // Limpiar el estado después de la operación
            setShowPdfModal(false);
            setPdfFile(null);
            setPdfPreviewUrl(null);
            onReload()
        }
    }

    const columns: ConfigColumns[] = [
        { data: 'patientName', },
        { data: 'examName', },
        { data: 'status' },
        { data: 'dateTime' },
        { orderable: false, searchable: false }
    ]

    const slots = {
        2: (cell, data: ExamTableItem) => (
            <span className={`badge badge-phoenix badge-phoenix-${data.statusColor}`}>{data.status}</span>
        ),
        4: (cell, data: ExamTableItem) => (
            <div className="d-flex justify-content-end">
                <div className="dropdown">
                    <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i data-feather="settings"></i> Acciones
                    </button>
                    <ul className="dropdown-menu">
                        {data.state === 'generated' && <>
                            <li>
                                <a className="dropdown-item" href="#" id="cargarResultadosBtn" onClick={() => onLoadExamResults(data)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-stethoscope" style={{ width: '20px' }}></i>
                                        <span>Realizar examen</span>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#" id="cargarResultadosBtn" onClick={() => onUploadExamsFile(data.id)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-file-pdf" style={{ width: '20px' }}></i>
                                        <span>Subir examen</span>
                                    </div>
                                </a>
                            </li>
                        </>}
                        {data.state === 'uploaded' && <>
                            <li>
                                <a className="dropdown-item" href="#" id="cargarResultadosBtn" onClick={() => onViewExamResults(data, data.minioId)}>
                                    <div className="d-flex gap-2 align-items-center">
                                        <i className="fa-solid fa-eye" style={{ width: '20px' }}></i>
                                        <span>Visualizar resultados</span>
                                    </div>
                                </a>
                            </li>
                            <PrintTableAction onTrigger={async () => {
                                console.log(data);

                                if (data.minioId) {
                                    //@ts-ignore
                                    const url = await getFileUrl(data.minioId);
                                    window.open(url, '_blank');
                                } else {
                                    //@ts-ignore
                                    crearDocumento(data.id, "Impresion", "Examen", "Completa", "Orden de examen");
                                }

                            }} />
                            <DownloadTableAction onTrigger={async () => {
                                if (data.minioId) {
                                    try {
                                        //@ts-ignore
                                        const url = await getFileUrl(data.minioId);
                                        var link = document.createElement('a');
                                        link.href = url.replace('http', 'https');
                                        link.download = 'file.pdf';
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    } catch (error) {
                                        console.error('Error al descargar:', error);
                                    }
                                } else {
                                    //@ts-ignore
                                    crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
                                }
                            }} />
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li className="dropdown-header">Compartir</li>
                            <ShareTableAction shareType='whatsapp' onTrigger={async () => {
                                const user = await userService.getLoggedUser()
                                //@ts-ignore
                                enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
                            }} />
                        </>}
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
                                <th className="border-top custom-th">Paciente</th>
                                <th className="border-top custom-th">Exámenes ordenados</th>
                                <th className="border-top custom-th">Estado</th>
                                <th className="border-top custom-th">Fecha y hora de creación</th>
                                <th className="text-end align-middle pe-0 border-top mb-2" scope="col"></th>
                            </tr>
                        </thead>
                    </CustomDataTable>
                </div>
            </div>
            <CustomModal
                title='Subir examen'
                show={showPdfModal}
                onHide={() => setShowPdfModal(false)}
                footerTemplate={<>
                    <input
                        type="file"
                        accept=".pdf"
                        id="inputPdf"
                        onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            if (file) {
                                setPdfFile(file);
                                setPdfPreviewUrl(URL.createObjectURL(file));
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setShowPdfModal(false);
                            setPdfFile(null);
                            setPdfPreviewUrl(null);
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                            handleUploadExamsFile();
                            setShowPdfModal(false);
                            setPdfFile(null);
                            setPdfPreviewUrl(null);
                        }}
                    >
                        Confirmar
                    </button>
                </>}
            >
                {pdfPreviewUrl ? (
                    <embed
                        src={pdfPreviewUrl}
                        width="100%"
                        height="500px"
                        type="application/pdf"
                    />
                ) : (
                    <p>Por favor, seleccione un archivo PDF.</p>
                )}
            </CustomModal>
        </>
    )
}
