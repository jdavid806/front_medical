import React, { useCallback, useRef } from "react";
import { PrimeReactProvider } from "primereact/api";
import { useSpecializables } from "../specializables/hooks/useSpecializables";
import { useEffect } from "react";
import { PatientClinicalRecordDto } from "../models/models";
import { useState } from "react";
import { useClinicalRecordTypes } from "../clinical-record-types/hooks/useClinicalRecordTypes";
import { PatientClinicalRecordsTable } from "./components/PatientClinicalRecordsTable";
import UserManager from "../../services/userManager";
import { OptometryBillingModal } from "./optometry/modal/OptometryBillingModal";
import { Button } from "primereact/button";
import { CustomFormModal } from "../components/CustomFormModal";
import {
  MakeRequestForm,
  MakeRequestFormInputs,
} from "../general-request/components/MakeRequestForm";
import { useMakeRequest } from "../general-request/hooks/useMakeRequest";
import { SwalManager } from "../../services/alertManagerImported";
import { useClinicalRecordsPendingCancellation } from "./hooks/useClinicalRecordsPendingCancellation";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { useTemplate } from "../hooks/useTemplate";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
  formatDate,
} from "../../services/utilidades";
import { set } from "react-hook-form";

interface PatientClinicalRecordHistoryProps { }

const specialtyId =
  new URLSearchParams(window.location.search).get("especialidad") || "";
const patientId =
  new URLSearchParams(window.location.search).get("patient_id") ||
  new URLSearchParams(window.location.search).get("id") ||
  "";

export const PatientClinicalRecordHistory: React.FC<
  PatientClinicalRecordHistoryProps
> = () => {
  const { clinicalRecords, fetchClinicalRecords, loading, totalRecords } =
    useClinicalRecordsPendingCancellation();
  const { makeRequest } = useMakeRequest();

  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState<
    string | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState<string | null>(null);
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "historia_clinica-compartir",
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

  useEffect(() => {
    sendMessageWppRef.current = sendMessageWpp;
  }, [sendMessageWpp]);

  useEffect(() => {
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: search ?? "",
      patientId: patientId,
      forCurrentUserRole: specialtyId,
    });
  }, []);

  const printClinicalRecord = (data: any, id: string, title: string) => {
    generarFormato("Consulta", data, "Impresion");
  };

  const downloadClinicalRecord = (id: string, title: string) => {
    generarFormato("Consulta", data, "Descarga");
  };

  const shareClinicalRecord = (data, type) => {
    switch (type) {
      case "whatsapp":
        sendMessageWhatsapp(data);
        break;

      default:
        break;
    }
  };

  async function generatePdfFile(recordHistory) {
    //@ts-ignore
    generarFormato(
      "Consulta",
      recordHistory,
      "Impresion",
      "recordHistoryInput"
    );

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let fileInput: any = document.getElementById(
          "pdf-input-hidden-to-recordHistoryInput"
        );
        let file = fileInput?.files[0];

        if (!file) {
          resolve(null);
          return;
        }

        let formData = new FormData();
        formData.append("file", file);
        formData.append("model_type", "App\\Models\\ClinicalRecords");
        formData.append("model_id", recordHistory.id);
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
    async (recordHistory) => {
      const dataToFile: any = await generatePdfFile(recordHistory);
      //@ts-ignore
      const urlPDF = getUrlImage(dataToFile.file_url.replaceAll("\\", "/"), true);

      const replacements = {
        NOMBRE_PACIENTE: `${recordHistory.patient.first_name} ${recordHistory.patient.middle_name} ${recordHistory.patient.last_name} ${recordHistory.patient.second_last_name}`,
        ESPECIALISTA: `${recordHistory.user.first_name} ${recordHistory.user.middle_name} ${recordHistory.user.last_name} ${recordHistory.user.second_last_name}`,
        ESPECIALIDAD: `${recordHistory.user.specialty.name}`,
        FECHA_HISTORIA: `${recordHistory.createdAt}`,
        "ENLACE DOCUMENTO": "",
      };

      const templateFormatted = formatWhatsAppMessage(
        template.template,
        replacements
      );

      const dataMessage = {
        channel: "whatsapp",
        recipients: [
          getIndicativeByCountry(recordHistory.patient.country_id) +
          recordHistory.patient.whatsapp,
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
    [sendMessageWpp]
  );

  const seeDetail = (id: string, clinicalRecordType: string) => {
    window.location.href = `detalleConsulta?clinicalRecordId=${id}&patient_id=${patientId}&tipo_historia=${clinicalRecordType}&especialidad=${specialtyId}`;
  };

  const nombreEspecialidad = new URLSearchParams(window.location.search).get(
    "especialidad"
  );

  const requestCancellation = (id: string) => {
    setSelectedClinicalRecord(id);
    setShowCancellationModal(true);
  };

  const handleMakeRequest = async (requestData: MakeRequestFormInputs) => {
    try {
      if (selectedClinicalRecord) {
        await makeRequest({
          type: "cancellation",
          requestable_id: selectedClinicalRecord,
          requestable_type: "clinical_record",
          notes: requestData.notes || null,
        });
        setShowCancellationModal(false);
        refresh();
      } else {
        SwalManager.error({
          text: "No se ha seleccionado ninguna historia clínica",
          title: "Error",
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page) => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
    fetchClinicalRecords({
      per_page: page.rows,
      page: calculatedPage,
      search: search ?? "",
      patientId: patientId,
      forCurrentUserRole: specialtyId,
    });
  };

  const handleSearchChange = (_search: string) => {
    setSearch(_search);
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: _search,
      patientId: patientId,
      forCurrentUserRole: specialtyId,
    });
  };

  const refresh = () =>
    fetchClinicalRecords({
      per_page: perPage,
      page: currentPage,
      search: search ?? "",
      patientId: patientId,
      forCurrentUserRole: specialtyId,
    });

  return (
    <PrimeReactProvider>
      <div className="row mt-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h2 className="mb-0">Historias Clínicas - {nombreEspecialidad}</h2>
          </div>
        </div>
        <PatientClinicalRecordsTable
          records={clinicalRecords}
          onSeeDetail={seeDetail}
          onPrintItem={printClinicalRecord}
          onDownloadItem={downloadClinicalRecord}
          onShareItem={shareClinicalRecord}
          onCancelItem={requestCancellation}
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loading}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={refresh}
        />
      </div>


      <CustomFormModal
        show={showCancellationModal}
        onHide={() => setShowCancellationModal(false)}
        formId="cancellationForm"
        title="Solicitud de anulación"
      >
        <MakeRequestForm
          formId="cancellationForm"
          onHandleSubmit={handleMakeRequest}
        />
      </CustomFormModal>
    </PrimeReactProvider>
  );
};
