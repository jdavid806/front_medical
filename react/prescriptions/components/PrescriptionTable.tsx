import React, { useCallback, useEffect, useRef } from "react";
import { ConfigColumns } from "datatables.net-bs5";
import { PrescriptionDto, PrescriptionTableItem } from "../../models/models.js";
import CustomDataTable from "../../components/CustomDataTable.js";
import { TableBasicActions } from "../../components/TableBasicActions.js";
import { PrintTableAction } from "../../components/table-actions/PrintTableAction.js";
import { DownloadTableAction } from "../../components/table-actions/DownloadTableAction.js";
import { ShareTableAction } from "../../components/table-actions/ShareTableAction.js";
import TableActionsWrapper from "../../components/table-actions/TableActionsWrapper.js";
import { generarFormato } from "../../../funciones/funcionesJS/generarPDF.js";
import { useTemplate } from "../../hooks/useTemplate.js";
import { useMassMessaging } from "../../hooks/useMassMessaging.js";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
  formatDate,
} from "../../../services/utilidades";
import { SwalManager } from "../../../services/alertManagerImported.js";

interface PrescriptionTableProps {
  prescriptions: PrescriptionDto[];
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

const PrescriptionTable: React.FC<PrescriptionTableProps> = ({
  prescriptions,
  onEditItem,
  onDeleteItem,
}) => {

  const [tablePrescriotions, setTablePrescriptions] = React.useState<
    PrescriptionTableItem[]
  >([]);
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "recetas-compartir",
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
    const mappedPrescriptions: PrescriptionTableItem[] = prescriptions
      .sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
      .map((prescription: any) => ({
        id: prescription.id,
        doctor: `${prescription.prescriber.first_name} ${prescription.prescriber.last_name}`,
        prescriber: prescription.prescriber,
        patient: prescription.patient,
        recipe_items: prescription.recipe_items,
        clinical_record: prescription.clinical_record,
        created_at: new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(prescription.created_at)),
      }));
    setTablePrescriptions(mappedPrescriptions);
  }, [prescriptions]);

  const columns: ConfigColumns[] = [
    { data: "doctor" },
    { data: "created_at" },
    { orderable: false, searchable: false },
  ];

  async function generatePdfFile(prescription) {
    //@ts-ignore
    generarFormato("Receta", prescription, "Impresion", "prescriptionInput");

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput: any = document.getElementById(
          "pdf-input-hidden-to-prescriptionInput"
        );
        let file = fileInput?.files[0];

        if (!file) {
          resolve(null);
          return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\ClinicalRecords");
        formData.append("model_id", prescription.id);
        //@ts-ignore
        guardarArchivo(formData, true)
          .then((response) => {
            resolve(response.file);
          })
          .catch(reject);
      }, 1500);
    });
  }

  const sendMessageWhatsapp = useCallback(
    async (prescription) => {
      const templatePrescriptions = await fetchTemplateRef.current();
        const dataToFile: any = await generatePdfFile(prescription);
        //@ts-ignore
        const urlPDF = getUrlImage(
          dataToFile.file_url.replaceAll("\\", "/"),
          true
        );

        const replacements = {
          NOMBRE_PACIENTE: `${prescription.patient.first_name} ${prescription.patient.middle_name} ${prescription.patient.last_name} ${prescription.patient.second_last_name}`,
          ESPECIALISTA: `${prescription.prescriber.first_name} ${prescription.prescriber.middle_name} ${prescription.prescriber.last_name} ${prescription.prescriber.second_last_name}`,
          ESPECIALIDAD: `${prescription.prescriber.specialty.name}`,
          RECOMENDACIONES: `${prescription.clinical_record.description}`,
          FECHA_RECETA: `${prescription.createdAt}`,
          "ENLACE DOCUMENTO": "",
        };

        const templateFormatted = formatWhatsAppMessage(
          templatePrescriptions.template,
          replacements
        );

        const dataMessage = {
          channel: "whatsapp",
          recipients: [
            getIndicativeByCountry(prescription.patient.country_id) +
              prescription.patient.whatsapp,
          ],
          message_type: "media",
          message: templateFormatted,
          attachment_url: urlPDF,
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

  const slots = {
    2: (cell, data: PrescriptionTableItem) => (
      <>
        <div className="text-end flex justify-cointent-end">
          <TableActionsWrapper>
            <PrintTableAction
              onTrigger={() => {
                //@ts-ignore
                // crearDocumento(data.id, "Impresion", "Receta", "Completa", "Receta");
                // console.log("data", data);
                generarFormato("Receta", data, "Impresion");
              }}
            />
            <DownloadTableAction
              onTrigger={() => {
                //@ts-ignore
                generarFormato("Receta", data, "Descarga");
              }}
            />
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li className="dropdown-header">Compartir</li>
            <ShareTableAction
              shareType="whatsapp"
              onTrigger={() => {
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
            data={tablePrescriotions}
            slots={slots}
            columns={columns}
          >
            <thead>
              <tr>
                <th className="border-top custom-th">Doctor</th>
                <th className="border-top custom-th">Fecha de creación</th>
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

export default PrescriptionTable;
