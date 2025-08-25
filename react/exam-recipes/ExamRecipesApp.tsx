import React, { useCallback, useEffect, useRef, useState } from "react";
import { ConfigColumns } from "datatables.net-bs5";
import { useExamRecipes } from "./hooks/useExamRecipes";
import TableActionsWrapper from "../components/table-actions/TableActionsWrapper";
import { PrintTableAction } from "../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../components/table-actions/ShareTableAction";
import CustomDataTable from "../components/CustomDataTable";
import { examRecipeService, userService } from "../../services/api";
import { SwalManager } from "../../services/alertManagerImported";
import {
  examRecipeStatus,
  examRecipeStatusColors,
} from "../../services/commons";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF";
import { useTemplate } from "../hooks/useTemplate.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import {
  formatDate,
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from "../../services/utilidades.js";

interface ExamRecipesTableItem {
  id: string;
  doctor: string;
  exams: string;
  patientId: string;
  created_at: string;
  status: string;
  resultMinioUrl?: string;
}

const patientId = new URLSearchParams(window.location.search).get("patient_id");

export const ExamRecipesApp: React.FC = () => {
  const { examRecipes, fetchExamRecipes } = useExamRecipes(patientId);
  const [tableExamRecipes, setTableExamRecipes] = useState<
    ExamRecipesTableItem[]
  >([]);

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
    const mappedExamRecipes: ExamRecipesTableItem[] = examRecipes
      .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
      .map((prescription: any) => {
        return {
          id: prescription.id,
          doctor: `${prescription.user.first_name || ""} ${
            prescription.user.middle_name || ""
          } ${prescription.user.last_name || ""} ${
            prescription.user.second_last_name || ""
          }`,
          exams: prescription.details
            .map((detail) => detail.exam_type.name)
            .join(", "),
          patientId: prescription.patient_id,
          created_at: new Intl.DateTimeFormat("es-AR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(prescription.created_at)),
          status: prescription.status,
          resultMinioUrl: prescription.result?.result_minio_url,
          user: prescription.user,
          details: prescription.details,
          patient: prescription.patient,
        };
      });
    setTableExamRecipes(mappedExamRecipes);
  }, [examRecipes]);

  const cancelPrescription = async (id: string) => {
    SwalManager.confirmCancel(async () => {
      try {
        await examRecipeService.cancel(id);

        SwalManager.success({
          title: "Receta anulada",
          text: "La receta ha sido anulada correctamente.",
        });

        fetchExamRecipes(patientId!);
      } catch (error) {
        SwalManager.error({
          title: "Error",
          text: "No se pudo anular la receta.",
        });
      }
    });
  };

  const seeExamRecipeResults = async (minioUrl: string | undefined | null) => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, "_blank");
    }
  };

  async function generatePdfFile(exam) {
    if (exam.resultMinioUrl) {
      //@ts-ignore
      return {
        file_url: exam.resultMinioUrl,
        model_type: "xxxxxxx",
        model_id: 0,
        id: 0,
      };
    } else {
      //@ts-ignore
      generarFormato("RecetaExamen", exam, "Impresion", "examInput");

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
        }, 2000);
      });
    }
  }

  const sendMessageWhatsapp = useCallback(
    async (exam) => {
      console.log("Sending message for exam", exam);
      const templateExam = await fetchTemplateRef.current();
      const dataToFile: any = await generatePdfFile(exam);
      console.log("dataToFile", dataToFile);

      const replacements = {
        NOMBRE_PACIENTE: `${exam.patient.first_name ?? ""} ${
          exam.patient.middle_name ?? ""
        } ${exam.patient.last_name ?? ""} ${
          exam.patient.second_last_name ?? ""
        }`,
        NOMBRE_EXAMEN: `${exam.details
          .map((detail) => detail.exam_type.name)
          .join(" ,")}`,
        FECHA_EXAMEN: `${exam.created_at}`,
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
        //@ts-ignore
        attachment_url: await getUrlImage(dataToFile.file_url, true).replace(/\\/g, "/"),
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

  const columns: ConfigColumns[] = [
    { data: "doctor" },
    { data: "exams" },
    { data: "created_at" },
    { data: "status" },
    { orderable: false, searchable: false },
  ];

  const slots = {
    3: (cell, data: ExamRecipesTableItem) => {
      const color = examRecipeStatusColors[data.status];
      const text = examRecipeStatus[data.status] || "SIN ESTADO";
      return (
        <span className={`badge badge-phoenix badge-phoenix-${color}`}>
          {text}
        </span>
      );
    },
    4: (cell, data: ExamRecipesTableItem) => (
      <>
        <div className="text-end flex justify-cointent-end">
          <TableActionsWrapper>
            <PrintTableAction
              onTrigger={() => {
                //@ts-ignore
                generarFormato("RecetaExamen", data, "Impresion");
                // crearDocumento(
                //   data.id,
                //   "Impresion",
                //   "RecetaExamen",
                //   "Completa",
                //   "Receta_de_examenes"
                // );
              }}
            />
            <DownloadTableAction
              onTrigger={() => {
                //@ts-ignore
                generarFormato("RecetaExamen", data, "Descarga");
                // crearDocumento(
                //   data.id,
                //   "Descarga",
                //   "RecetaExamen",
                //   "Completa",
                //   "Receta_de_examenes"
                // );
              }}
            />
            {data.status === "uploaded" && (
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  id="cargarResultadosBtn"
                  onClick={() => seeExamRecipeResults(data.resultMinioUrl)}
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
            )}
            {data.status === "pending" && (
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={() => cancelPrescription(data.id)}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      className="fa-solid fa-ban"
                      style={{ width: "20px" }}
                    ></i>
                    <span>Anular receta</span>
                  </div>
                </a>
              </li>
            )}
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
          </TableActionsWrapper>
        </div>
      </>
    ),
  };

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <CustomDataTable
            data={tableExamRecipes}
            slots={slots}
            columns={columns}
          >
            <thead>
              <tr>
                <th className="border-top custom-th">Doctor</th>
                <th className="border-top custom-th">Examenes recetados</th>
                <th className="border-top custom-th">Fecha de creación</th>
                <th className="border-top custom-th">Estado</th>
                <th
                  className="text-end align-middle pe-0 border-top mb-2"
                  scope="col"
                ></th>
              </tr>
            </thead>
          </CustomDataTable>
        </div>
      </div>
    </>
  );
};
