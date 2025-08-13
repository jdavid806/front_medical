import React, { useCallback, useRef } from "react";
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../../components/CustomDataTable";
import { useEffect } from "react";
import { useState } from "react";
import { ExamOrderDto } from "../../models/models";
import {
  examOrderStateColors,
  examOrderStates,
} from "../../../services/commons";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction";
import {
  formatDate,
  ordenarPorFecha,
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from "../../../services/utilidades";
import { CustomModal } from "../../components/CustomModal";
import { examOrderService, userService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF";
import { useTemplate } from "../../hooks/useTemplate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";

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
  minioUrl?: string;
};

type ExamTableProps = {
  exams: ExamOrderDto[];
  onLoadExamResults: (id: ExamTableItem) => void;
  onViewExamResults: (examTableItem: ExamTableItem, minioUrl?: string) => void;
  onReload: () => void;
};

export const ExamTable: React.FC<ExamTableProps> = ({
  exams,
  onLoadExamResults,
  onViewExamResults,
  onReload,
}) => {
  const [tableExams, setTableExams] = useState<ExamTableItem[]>([]);
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
    const mappedExams: ExamTableItem[] = exams.map((exam: any) => {
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
        minioUrl: exam.minio_url,
        patientId: exam.patient_id,
        patient: exam.patient,
        appointmentId: exam.appointment_id,
        state: exam.exam_order_state?.name || "pending",
        created_at: exam.created_at,
        dateTime: formatDate(exam.created_at),
        exam_order_state: exam.exam_order_state,
        exam_type: exam.exam_type,
        items: exam.items,
        original: exam,
      };
    });

    ordenarPorFecha(mappedExams, "created_at");

    setTableExams(mappedExams);
  }, [exams]);

  async function generatePdfFile(exam) {
    if (exam.minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(exam.minioUrl, true);
      return {
        url: url,
        model_type: "xxxxxxx",
        model_id: 0,
        id: 0, // Assuming the ID is the last part of the URL
      };
    } else {
      //@ts-ignore
      generarFormato("Examen", exam.original, "Impresion", "examInput");

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
            .then((response) => {
              resolve(response.file);
            })
            .catch(reject);
        }, 1500);
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
        attachment_url: dataToFile.url,
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

  const onUploadExamsFile = (examOrderId) => {
    setSelectedOrderId(examOrderId);
    setShowPdfModal(true);
  };

  const handleUploadExamsFile = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", selectedOrderId);

      const dataRquest = {
        minio_url: enviarPDf,
      };

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        await examOrderService.updateMinioFile(selectedOrderId, dataRquest);
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
      onReload();
    }
  };

  const columns: ConfigColumns[] = [
    { data: "examName" },
    { data: "status" },
    { data: "dateTime" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    1: (cell, data: ExamTableItem) => (
      <span className={`badge badge-phoenix badge-phoenix-${data.statusColor}`}>
        {data.status}
      </span>
    ),
    3: (cell, data: ExamTableItem) => (
      <div className="d-flex justify-content-end">
        <div className="dropdown">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i data-feather="settings"></i> Acciones
          </button>
          <ul className="dropdown-menu">
            {data.state === "generated" && (
              <>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    id="cargarResultadosBtn"
                    onClick={() => onLoadExamResults(data)}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <i
                        className="fa-solid fa-stethoscope"
                        style={{ width: "20px" }}
                      ></i>
                      <span>Realizar examen</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    id="cargarResultadosBtn"
                    onClick={() => onUploadExamsFile(data.id)}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <i
                        className="fa-solid fa-file-pdf"
                        style={{ width: "20px" }}
                      ></i>
                      <span>Subir examen</span>
                    </div>
                  </a>
                </li>
              </>
            )}
            {data.state === "uploaded" && (
              <>
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    id="cargarResultadosBtn"
                    onClick={() => onViewExamResults(data, data.minioUrl)}
                  >
                    <div className="d-flex gap-2 align-items-center">
                      <i
                        className="fa-solid fa-eye"
                        style={{ width: "20px" }}
                      ></i>
                      <span>Visualizar resultados</span>
                    </div>
                  </a>
                </li>
                <PrintTableAction
                  onTrigger={async () => {
                    if (data.minioUrl) {
                      //@ts-ignore
                      const url = await getUrlImage(data.minioUrl);
                      window.open(url, "_blank");
                    } else {
                      //@ts-ignore
                      generarFormato("Examen", data.original, "Impresion");
                      // crearDocumento(data.id, "Impresion", "Examen", "Completa", "Orden de examen");
                    }
                  }}
                />
                <DownloadTableAction
                  onTrigger={async () => {
                    if (data.minioUrl) {
                      //@ts-ignore
                      const url = await getUrlImage(data.minioUrl);
                      var link = document.createElement("a");
                      link.href = url.replace("http", "https");
                      link.download = "file.pdf";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    } else {
                      //@ts-ignore
                      generarFormato("Examen", data.original, "Descarga");
                      // crearDocumento(data.id, "Descarga", "Examen", "Completa", "Orden de examen");
                    }
                  }}
                />
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li className="dropdown-header">Compartir</li>
                <ShareTableAction
                  shareType="whatsapp"
                  onTrigger={async () => {
                    sendMessageWhatsapp(data);
                  }}
                />
              </>
            )}
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable data={tableExams} slots={slots} columns={columns}>
            <thead>
              <tr>
                <th className="border-top custom-th">Exámenes ordenados</th>
                <th className="border-top custom-th">Estado</th>
                <th className="border-top custom-th">
                  Fecha y hora de creación
                </th>
                <th
                  className="text-end align-middle pe-0 border-top mb-2"
                  scope="col"
                ></th>
              </tr>
            </thead>
          </CustomDataTable>
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
                setShowPdfModal(false);
                setPdfFile(null);
                setPdfPreviewUrl(null);
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
