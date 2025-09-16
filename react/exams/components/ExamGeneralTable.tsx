import React, { useCallback, useEffect, useRef, useState } from "react";
import { ExamOrderDto } from "../../models/models";
import {
  examOrderStateColors,
  examOrderStates,
} from "../../../services/commons";
import {
  formatDate,
  formatWhatsAppMessage,
  getIndicativeByCountry,
  ordenarPorFecha,
} from "../../../services/utilidades";
import { examOrderService, userService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF";

// PrimeReact imports
import { Badge } from "primereact/badge";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../../components/CustomPRTable";
import { CustomModal } from "../../components/CustomModal";
import { useMassMessaging } from "../../hooks/useMassMessaging";
import { useTemplate } from "../../hooks/useTemplate";

export type ExamTableItem = {
  id: string;
  examName: string;
  status: string;
  statusColor: string;
  state: string;
  created_at: string;
  dateTime: string;
  patientId: string;
  appointmentId: string;
  minioId?: string;
  patientName: string;
  original: any;
};

type ExamTableProps = {
  exams: ExamOrderDto[];
  onLoadExamResults: (id: ExamTableItem) => void;
  onViewExamResults: (examTableItem: ExamTableItem, minioId?: string) => void;
  onReload: () => void;
};

export const ExamGeneralTable: React.FC<ExamTableProps> = ({
  exams,
  onLoadExamResults,
  onViewExamResults,
  onReload,
}) => {
  const [tableExams, setTableExams] = useState<ExamTableItem[]>([]);
  const [uploadedExams, setUploadedExams] = useState<ExamTableItem[]>([]);
  const [pendingExams, setPendingExams] = useState<ExamTableItem[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "examenes-compartir",
    type: "whatsapp",
  };
  const { template, setTemplate, fetchTemplate } = useTemplate(data);
  const {
    sendMessage: sendMessageWpp,
    responseMsg,
    loading: loadingMessage,
    error,
  } = useMassMessaging();

  const sendMessageWppRef = useRef(sendMessageWpp);
  const fetchTemplateRef = useRef(fetchTemplate);

  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);

  useEffect(() => {
    fetchTemplateRef.current = fetchTemplate;
  }, [fetchTemplate]);

  useEffect(() => {
    const mappedExams: ExamTableItem[] = exams.map((exam) => {
      return {
        id: exam.id,
        examName:
          (exam.items.length > 0
            ? exam.items.map((item) => item.exam.name).join(", ")
            : exam.exam_type?.name) || "--",
        status:
          examOrderStates[exam.exam_order_state?.name.toLowerCase()] ?? "--",
        statusColor:
          examOrderStateColors[exam.exam_order_state?.name.toLowerCase()] ??
          "--",
        minioId: exam.minio_id,
        patientId: exam.patient_id,
        patientName: `${exam.patient.first_name || ""} ${exam.patient.middle_name || ""
          } ${exam.patient?.last_name || ""} ${exam.patient?.second_last_name || ""
          }`.trim(),
        appointmentId: exam.appointment_id,
        state: exam.exam_order_state?.name || "pending",
        created_at: exam.created_at,
        dateTime: formatDate(exam.created_at),
        original: exam,
      };
    });

    ordenarPorFecha(mappedExams, "created_at");
    setTableExams(mappedExams);
    // Separar exámenes por estado
    setUploadedExams(mappedExams.filter((exam) => exam.state === "uploaded"));
    setPendingExams(
      mappedExams.filter(
        (exam) => exam.state === "generated" || exam.state === "pending"
      )
    );
  }, [exams]);

  const onUploadExamsFile = (examOrderId) => {
    setSelectedOrderId(examOrderId);
    setShowPdfModal(true);
  };

  const handleUploadExamsFile = async () => {
    try {
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);
      const dataUpload = {
        minio_url: enviarPDf,
      };

      if (enviarPDf !== undefined) {
        const responseUpdate = await examOrderService.updateMinioFile(selectedOrderId, dataUpload);
        if (responseUpdate.success) {
          sendMessageWhatsapp(responseUpdate.data);
        }
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
      onReload();
    }
  };

  async function generatePdfFile(exam) {
    if (exam.minio_url) {
      //@ts-ignore
      const url = await getUrlImage(exam.minio_url, true);
      return {
        file_url: url,
        model_type: "xxxxxxx",
        model_id: 0,
        id: 0,
      };
    } else {
      //@ts-ignore
      await generarFormato("Examen", exam, "Impresion", "examInput");

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let fileInput: any = document.getElementById(
            "pdf-input-hidden-to-examInput"
          );
          let file = fileInput?.files[0];

          if (!file) {
            resolve(null);
            return;
          }

          let formData = new FormData();
          formData.append("file", file);
          formData.append("model_type", "App\\Models\\exam");
          formData.append("model_id", exam.id);
          //@ts-ignore
          guardarArchivo(formData, true)
            .then(async (response) => {
              resolve({
                file_url: await getUrlImage(
                  response.file.file_url.replaceAll("\\", "/"),
                  true
                ),
                model_type: response.file.model_type,
                model_id: response.file.model_id,
                id: response.file.id,
              });
            })
            .catch(reject);
        }, 1000);
      });
    }
  }

  const sendMessageWhatsapp = useCallback(
    async (exam) => {
      const templateExam = await fetchTemplateRef.current();
      const dataToFile: any = await generatePdfFile(exam);

      const replacements = {
        NOMBRE_PACIENTE: `${exam.patient.first_name ?? ""} ${exam.patient.middle_name ?? ""
          } ${exam.patient.last_name ?? ""} ${exam.patient.second_last_name ?? ""
          }`,
        NOMBRE_EXAMEN: `${exam.examName}`,
        FECHA_EXAMEN: `${exam.dateTime}`,
        "ENLACE DOCUMENTO": "",
      };

      const templateFormatted = formatWhatsAppMessage(
        templateExam.template,
        replacements
      );

      const dataMessage = {
        channel: "whatsapp",
        recipients: [
          getIndicativeByCountry(exam.patient.country_id) +
          exam.patient.whatsapp,
        ],
        message_type: "media",
        message: templateFormatted,
        attachment_url: dataToFile.file_url,
        attachment_type: "document",
        minio_model_type: dataToFile?.model_type,
        minio_model_id: dataToFile?.model_id,
        minio_id: dataToFile?.id,
        webhook_url: "https://example.com/webhook",
      };
      await sendMessageWppRef.current(dataMessage);
      SwalManager.success({
        text: "Mensaje enviado correctamente",
        title: "Éxito",
      });
    },
    [sendMessageWpp, fetchTemplate]
  );

  // Columnas para la tabla
  const columns: CustomPRTableColumnProps[] = [
    {
      field: "patientName",
      header: "Paciente",
      sortable: true,
    },
    {
      field: "examName",
      header: "Exámenes ordenados",
      sortable: true,
    },
    {
      field: "status",
      header: "Estado",
      body: (data: ExamTableItem) => {
        const color = examOrderStateColors[data.state] || "secondary";
        const text = examOrderStates[data.state] || "SIN ESTADO";

        const severityMap: Record<string, string> = {
          success: "success",
          warning: "warning",
          danger: "danger",
          info: "info",
          primary: "secondary",
          secondary: "secondary",
        };

        const severity = severityMap[color] || "secondary";

        return (
          <Badge value={text} severity={severity} className="p-badge-lg" />
        );
      },
    },
    {
      field: "dateTime",
      header: "Fecha y hora de creación",
      sortable: true,
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
            if (data.original.minio_url) {
              //@ts-ignore
              const url = await getUrlImage(data.original.minio_url);
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
              crearDocumento(
                data.id,
                "Descarga",
                "Examen",
                "Completa",
                "Orden de examen"
              );
            }
          }}
          onShare={async () => {
            sendMessageWhatsapp(data.original);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <TabView>
            <TabPanel header="Resultados subidos">
              <CustomPRTable
                columns={columns}
                data={uploadedExams}
                lazy={false}
                onReload={onReload}
              />
            </TabPanel>
            <TabPanel header="Pendientes por cargar">
              <CustomPRTable
                columns={columns}
                data={pendingExams}
                lazy={false}
                onReload={onReload}
              />
            </TabPanel>
          </TabView>
        </div>
      </div>

      <CustomModal
        title="Subir examen"
        show={showPdfModal}
        onHide={() => setShowPdfModal(false)}
        footerTemplate={
          <>
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
          </>
        }
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

// Componente de menú de acciones
const TableActionsMenu: React.FC<{
  data: ExamTableItem;
  onLoadExamResults: (id: ExamTableItem) => void;
  onViewExamResults: (examTableItem: ExamTableItem, minioUrl?: string) => void;
  onUploadExamsFile: (examOrderId: string) => void;
  onPrint: () => void;
  onDownload: () => void;
  onShare: () => void;
}> = ({
  data,
  onLoadExamResults,
  onViewExamResults,
  onUploadExamsFile,
  onPrint,
  onDownload,
  onShare,
}) => {
    const menu = useRef<Menu>(null);

    const items = [
      ...(data.state === "generated"
        ? [
          {
            label: "Realizar examen",
            icon: "pi pi-stethoscope",
            command: (e) => {
              e.originalEvent?.stopPropagation();
              onLoadExamResults(data);
            },
          },
          {
            label: "Subir examen",
            icon: "pi pi-file-pdf",
            command: (e) => {
              e.originalEvent?.stopPropagation();
              onUploadExamsFile(data.id);
            },
          },
        ]
        : []),
      ...(data.state === "uploaded"
        ? [
          {
            label: "Visualizar resultados",
            icon: "pi pi-eye",
            command: (e) => {
              e.originalEvent?.stopPropagation();
              onViewExamResults(data, data.original.minio_url);
            },
          },
          {
            label: "Imprimir",
            icon: "pi pi-print",
            command: (e) => {
              e.originalEvent?.stopPropagation();
              onPrint();
            },
          },
          {
            label: "Descargar",
            icon: "pi pi-download",
            command: (e) => {
              e.originalEvent?.stopPropagation();
              onDownload();
            },
          },
          {
            separator: true,
          },
          {
            label: "Compartir",
            icon: "pi pi-share-alt",
            items: [
              {
                label: "WhatsApp",
                icon: "pi pi-whatsapp",
                command: (e) => {
                  e.originalEvent?.stopPropagation();
                  onShare();
                },
              },
            ],
          },
        ]
        : []),
    ];

    const handleMenuHide = () => { };

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
          appendTo={typeof document !== "undefined" ? document.body : undefined}
        />
      </div>
    );
  };
