import React, { useEffect, useRef, useState } from "react";
import { ExamOrderDto } from "../../models/models";
import { examOrderStateColors, examOrderStates } from "../../../services/commons";
import { formatDate, ordenarPorFecha } from "../../../services/utilidades";
import { examOrderService, userService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF";

// PrimeReact imports
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { CustomModal } from "../../components/CustomModal";

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
    patientName: string
    original: any
    updated_at?: string
}

type ExamTableProps = {
    exams: ExamOrderDto[]
    onLoadExamResults: (id: ExamTableItem) => void
    onViewExamResults: (examTableItem: ExamTableItem, minioId?: string) => void
    onReload: () => void
}

export const ExamGeneralTable: React.FC<ExamTableProps> = ({ exams, onLoadExamResults, onViewExamResults, onReload }) => {
    const [tableExams, setTableExams] = useState<ExamTableItem[]>([]);
    const [uploadedExams, setUploadedExams] = useState<ExamTableItem[]>([]);
    const [pendingExams, setPendingExams] = useState<ExamTableItem[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);


    useEffect(() => {
      const mappedExams: ExamTableItem[] = exams
    .map((exam: any) => ({
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
        dateTime: formatDate(exam.created_at),
        original: exam,
        updated_at: exam.updated_at_formatted || undefined
    }))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


        const sortedExams = [...mappedExams].sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        setTableExams(sortedExams);

        setUploadedExams(sortedExams.filter(exam => exam.state === "uploaded"));
        setPendingExams(sortedExams.filter(exam => exam.state === "generated" || exam.state === "pending"));
    }, [exams])

    const onUploadExamsFile = (examOrderId) => {
        setSelectedOrderId(examOrderId);
        setShowPdfModal(true);
    }

    const handleUploadExamsFile = async () => {
        try {
            //@ts-ignore
            const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);

            if (enviarPDf !== undefined) {
                await examOrderService.updateMinioFile(selectedOrderId, enviarPDf);
                SwalManager.success({ text: "Resultados guardados exitosamente" });
            } else {
                console.error("No se obtuvo un resultado válido.");
            }
        } catch (error) {
            console.error("Error al guardar el archivo:", error);
        } finally {
            setShowPdfModal(false);
            setPdfFile(null);
            setPdfPreviewUrl(null);
            onReload()
        }
    }

    // Columnas para la tabla
    const columnsUploadExams: CustomPRTableColumnProps[] = [
        {
            field: "id",
            header: "ID",
            sortable: true,
        },
        {
            field: "patientName",
            header: "Paciente",
            sortable: true
        },
        {
            field: "examName",
            header: "Exámenes ordenados",
            sortable: true
        },
        {
            field: "status",
            header: "Estado",
            body: (data: ExamTableItem) => {
                const color = examOrderStateColors[data.state] || "secondary";
                const text = examOrderStates[data.state] || "SIN ESTADO";

                const severityMap: Record<string, string> = {
                    'success': 'success',
                    'warning': 'warning',
                    'danger': 'danger',
                    'info': 'info',
                    'primary': 'secondary',
                    'secondary': 'secondary'
                };

                const severity = severityMap[color] || 'secondary';

                return (
                    <Badge
                        value={text}
                        severity={severity}
                        className="p-badge-lg"
                    />
                );
            }
        },
        {
            field: "dateTime",
            header: "Fecha y hora de creación",
            sortable: true
        },
        {
            field: "updated_at",
            header: "Fecha y hora de subida",
            sortable: true
        },
        {
            field: "actions",
            header: "Acciones",
            body: (data: ExamTableItem) => (
                <TableActionsMenu
                    data={data}
                    onLoadExamResults={onLoadExamResults}
                    onViewExamResults={onViewExamResults}
                    onUploadExamsFile={onUploadExamsFile}
                    onPrint={async () => {
                        if (data.minioId) {
                            //@ts-ignore
                            const url = await getFileUrl(data.minioId);
                            window.open(url, "_blank");
                        } else {
                            //@ts-ignore
                            generarFormato("Examen", data.original, "Impresion");
                        }
                    }}
                    onDownload={async () => {
                        if (data.minioId) {
                            try {
                                //@ts-ignore
                                const url = await getFileUrl(data.minioId);
                                var link = document.createElement("a");
                                link.href = url.replace("http", "https");
                                link.download = "file.pdf";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } catch (error) {
                                console.error("Error al descargar:", error);
                            }
                        } else {
                            //@ts-ignore
                            crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
                        }
                    }}
                    onShare={async () => {
                        const user = await userService.getLoggedUser();
                        //@ts-ignore
                        enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
                    }}
                />
            )
        },
    ];

    const columnsPendingExams: CustomPRTableColumnProps[] = [
        {
            field: "patientName",
            header: "Paciente",
            sortable: true
        },
        {
            field: "examName",
            header: "Exámenes ordenados",
            sortable: true
        },
        {
            field: "status",
            header: "Estado",
            body: (data: ExamTableItem) => {
                const color = examOrderStateColors[data.state] || "secondary";
                const text = examOrderStates[data.state] || "SIN ESTADO";

                const severityMap: Record<string, string> = {
                    'success': 'success',
                    'warning': 'warning',
                    'danger': 'danger',
                    'info': 'info',
                    'primary': 'secondary',
                    'secondary': 'secondary'
                };

                const severity = severityMap[color] || 'secondary';

                return (
                    <Badge
                        value={text}
                        severity={severity}
                        className="p-badge-lg"
                    />
                );
            }
        },
        {
            field: "dateTime",
            header: "Fecha y hora de creación",
            sortable: true
        },
        {
            field: "actions",
            header: "Acciones",
            body: (data: ExamTableItem) => (
                <TableActionsMenu
                    data={data}
                    onLoadExamResults={onLoadExamResults}
                    onViewExamResults={onViewExamResults}
                    onUploadExamsFile={onUploadExamsFile}
                    onPrint={async () => {
                        if (data.minioId) {
                            //@ts-ignore
                            const url = await getFileUrl(data.minioId);
                            window.open(url, "_blank");
                        } else {
                            //@ts-ignore
                            generarFormato("Examen", data.original, "Impresion");
                        }
                    }}
                    onDownload={async () => {
                        if (data.minioId) {
                            try {
                                //@ts-ignore
                                const url = await getFileUrl(data.minioId);
                                var link = document.createElement("a");
                                link.href = url.replace("http", "https");
                                link.download = "file.pdf";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            } catch (error) {
                                console.error("Error al descargar:", error);
                            }
                        } else {
                            //@ts-ignore
                            crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
                        }
                    }}
                    onShare={async () => {
                        const user = await userService.getLoggedUser();
                        //@ts-ignore
                        enviarDocumento(data.id, "Descarga", "Examen", "Completa", data.patientId, user.id, "Orden de examen");
                    }}
                />
            )
        },
    ];

    return (
        <>
            <div className="card mb-3">
                <div className="card-body">
                    <TabView>
                        <TabPanel header="Resultados Cargados">
                            <CustomPRTable
                                columns={columnsUploadExams}
                                data={uploadedExams}
                                lazy={false}
                                onReload={onReload}
                            />
                        </TabPanel>
                        <TabPanel header="Pendientes por cargar">
                            <CustomPRTable
                                columns={columnsPendingExams}
                                data={pendingExams}
                                lazy={false}
                                onReload={onReload}
                            />
                        </TabPanel>
                    </TabView>
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
    );
};

const TableActionsMenu: React.FC<{
    data: ExamTableItem;
    onLoadExamResults: (id: ExamTableItem) => void;
    onViewExamResults: (examTableItem: ExamTableItem, minioId?: string) => void;
    onUploadExamsFile: (examOrderId: string) => void;
    onPrint: () => void;
    onDownload: () => void;
    onShare: () => void;
}> = ({ data, onLoadExamResults, onViewExamResults, onUploadExamsFile, onPrint, onDownload, onShare }) => {
    const menu = useRef<Menu>(null);

    const items = [
        ...(data.state === "generated" ? [
            {
                label: "Realizar examen",
                icon: <i className="fa-solid fa-check ml-4"></i>,
                command: () => {
                    onLoadExamResults(data);
                    menu.current?.hide();
                }
            },
            {
                separator: true
            },
            {
                label: "Subir examen",
                icon: <i className="fa-solid fa-arrow-up ml-4"></i>,
                command: () => {
                    onUploadExamsFile(data.id);
                    menu.current?.hide();
                }
            }
        ] : []),
        ...(data.state === "uploaded" ? [
            {
                label: "Visualizar resultados",
                icon: <i className="fa-solid fa-eye"></i>,
                command: () => {
                    onViewExamResults(data, data.minioId);
                    menu.current?.hide();
                }
            },
            {
                separator: true
            },
            {
                label: "Imprimir",
                icon: <i className="fa-solid fa-print"></i>,
                command: () => {
                    onPrint();
                    menu.current?.hide();
                }
            },
            {
                separator: true
            },
            {
                label: "Descargar",
                icon: <i className="fa-solid fa-download "></i>,
                command: () => {
                    onDownload();
                    menu.current?.hide();
                }
            },
            {
                separator: true
            },
            {

                label: "WhatsApp",
                icon: <i className="fa-solid fa-share"></i>,
                command: () => {
                    onShare();
                    menu.current?.hide();

                }

            }
        ] : [])
    ];

    const handleMenuHide = () => {
    };

    return (
        <div className="table-actions-menu">
            <Button
                icon="pi pi-ellipsis-v"
                className="p-button-rounded btn-primary"
                onClick={(e) => menu.current?.toggle(e)}
                aria-controls={`popup_menu_${data.id}`}
                aria-haspopup
            >
                Acciones
                <i className="fa fa-cog ml-2"></i>
            </Button>
            <Menu
                model={items}
                popup
                ref={menu}
                id={`popup_menu_${data.id}`}
                onHide={handleMenuHide}
                appendTo={typeof document !== 'undefined' ? document.body : undefined}
            />
        </div>
    );
};