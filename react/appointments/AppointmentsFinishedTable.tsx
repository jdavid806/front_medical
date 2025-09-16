import React, { useEffect, useState } from "react";
import { AppointmentTableItem } from "../models/models";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { CustomFormModal } from "../components/CustomFormModal";
import { PreadmissionForm } from "./PreadmissionForm";
import { appointmentService } from "../../services/api";
import {
  appointmentStatesColors,
  appointmentStateColorsByKey,
  appointmentStatesByKeyTwo,
} from "../../services/commons";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm";
import { SwalManager } from "../../services/alertManagerImported";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { PrimeReactProvider } from "primereact/api";

export const AppointmentsFinishedTable: React.FC = () => {
  const patientId =
    new URLSearchParams(window.location.search).get("patient_id") || null;
  const startDate = new Date(new Date().setDate(new Date().getDate() - 7));
  const endDate = new Date();

  const [selectedDate, setSelectedDate] = React.useState<
    Nullable<(Date | null)[]>
  >([startDate, endDate]);

  const getCustomFilters = () => {
    return {
      patientId,
      sort: "-appointment_date,-appointment_time",
      appointmentState: "consultation_completed",
      appointmentDate: selectedDate
        ?.filter((date) => !!date)
        .map((date) => date.toISOString().split("T")[0])
        .join(","),
    };
  };

  const {
    appointments,
    handlePageChange,
    handleSearchChange,
    refresh,
    totalRecords,
    first,
    loading: loadingAppointments,
    perPage,
  } = useFetchAppointments(getCustomFilters);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] =
    useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null); // Para almacenar el archivo PDF
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null); // Para la previsualización del PDF
  const [showPdfModal, setShowPdfModal] = useState(false); // Para controlar la visibilidad del modal de PDF

  const columns: CustomPRTableColumnProps[] = [
    {
      header: "Paciente",
      field: "patientName",
      body: (data: AppointmentTableItem) => (
        <>
          <a href={`postConsultationGestion?patientId=${data.patientId}`}>
            {data.patientName}
          </a>
        </>
      ),
    },
    { header: "Número de documento", field: "patientDNI" },
    { header: "Fecha Consulta", field: "date" },
    { header: "Hora Consulta", field: "time" },
    { header: "Profesional asignado", field: "doctorName" },
    { header: "Entidad", field: "entity" },
    {
      header: "Estado",
      field: "status",
      body: (data: AppointmentTableItem) => {
        const color =
          appointmentStateColorsByKey[data.stateKey] ||
          appointmentStatesColors[data.stateId];
        const text =
          appointmentStatesByKeyTwo[data.stateKey]?.[data.attentionType] ||
          appointmentStatesByKeyTwo[data.stateKey] ||
          "SIN ESTADO";
        return (
          <span className={`badge badge-phoenix badge-phoenix-${color}`}>
            {text}
          </span>
        );
      },
    },
  ];

  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {},
  });

  const handleSubmit = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        await appointmentService.changeStatus(
          selectedAppointmentId,
          "consultation_completed"
        );
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
      refresh();
    }
  };

  const handleHideFormModal = () => {
    setShowFormModal({ isShow: false, data: {} });
  };

  useEffect(() => {
    refresh();
  }, [selectedDate]);

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <div className="accordion mb-3">
          <div className="accordion-item">
            <h2 className="accordion-header" id="filters">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filtersCollapse"
                aria-expanded="false"
                aria-controls="filtersCollapse"
              >
                Filtrar citas
              </button>
            </h2>
            <div
              id="filtersCollapse"
              className="accordion-collapse collapse"
              aria-labelledby="filters"
            >
              <div className="accordion-body">
                <div className="d-flex gap-2">
                  <div className="flex-grow-1">
                    <div className="row g-3">
                      <div className="col">
                        <label
                          htmlFor="rangoFechasCitas"
                          className="form-label"
                        >
                          Rango de fechas
                        </label>
                        <Calendar
                          id="rangoFechasCitas"
                          name="rangoFechaCitas"
                          selectionMode="range"
                          dateFormat="dd/mm/yy"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.value)}
                          className="w-100"
                          placeholder="Seleccione un rango"
                          appendTo={"self"}
                          panelStyle={{ zIndex: 100000 }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
          style={{ minHeight: "400px" }}
        >

          <div className="card-body h-100 w-100 d-flex flex-column">


            <CustomPRTable
              columns={columns}
              data={appointments}
              lazy
              first={first}
              rows={perPage}
              totalRecords={totalRecords}
              loading={loadingAppointments}
              onPage={handlePageChange}
              onSearch={handleSearchChange}
              onReload={refresh}
            ></CustomPRTable>
          </div>
        </div>
        {showPdfModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Previsualización de PDF</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setPdfFile(null);
                      setPdfPreviewUrl(null);
                    }}
                  ></button>
                </div>
                <div className="modal-body">
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
                </div>
                <div className="modal-footer">
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
                      handleSubmit();
                      setShowPdfModal(false);
                      setPdfFile(null);
                      setPdfPreviewUrl(null);
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <CustomFormModal
          formId={"createPreadmission"}
          show={showFormModal.isShow}
          onHide={handleHideFormModal}
          title={
            "Crear Preadmision" + " - " + showFormModal.data["patientName"]
          }
        >
          <PreadmissionForm
            initialValues={showFormModal.data}
            formId="createPreadmission"
          ></PreadmissionForm>
        </CustomFormModal>
        <CustomFormModal
          formId={"loadExamResultsFile"}
          show={showLoadExamResultsFileModal}
          onHide={() => setShowLoadExamResultsFileModal(false)}
          title={"Subir resultados de examen"}
        >
          <ExamResultsFileForm></ExamResultsFileForm>
        </CustomFormModal>
      </PrimeReactProvider>
    </>
  );
};
