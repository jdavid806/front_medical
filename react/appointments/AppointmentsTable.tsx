import React, { useCallback, useEffect, useRef, useState } from "react";
import { AppointmentTableItem } from "../models/models";
import CustomDataTable from "../components/CustomDataTable";
import { ConfigColumns } from "datatables.net-bs5";
import { useFetchAppointments } from "./hooks/useFetchAppointments";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { CustomFormModal } from "../components/CustomFormModal";
import { PreadmissionForm } from "./PreadmissionForm";
import { PrintTableAction } from "../components/table-actions/PrintTableAction";
import { DownloadTableAction } from "../components/table-actions/DownloadTableAction";
import { ShareTableAction } from "../components/table-actions/ShareTableAction";
import {
  appointmentService,
  templateService,
  examOrderService,
  examRecipeResultService,
  examRecipeService,
} from "../../services/api";
import UserManager from "../../services/userManager";
import {
  appointmentStatesColors,
  appointmentStateColorsByKey,
  appointmentStateFilters,
  appointmentStatesByKeyTwo,
} from "../../services/commons";
import { ExamResultsFileForm } from "../exams/components/ExamResultsFileForm";
import { SwalManager } from "../../services/alertManagerImported";
import { RescheduleAppointmentModalV2 } from "./RescheduleAppointmentModalV2";
import { getUserLogged } from "../../services/utilidades";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { useTemplate } from "../hooks/useTemplate";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
  formatDate,
} from "../../services/utilidades";
import {
  CustomPRTable,
  CustomPRTableColumnProps,
} from "../components/CustomPRTable";
import { useTemplateBuilded } from "../hooks/useTemplateBuilded";

export const AppointmentsTable: React.FC = () => {
  const patientId =
    new URLSearchParams(window.location.search).get("patient_id") || null;
  const [selectedBranch, setSelectedBranch] = React.useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = React.useState<
    Nullable<(Date | null)[]>
  >([new Date(new Date().setDate(new Date().getDate())), new Date()]);
  const userLogged = getUserLogged();

  const getCustomFilters = () => {
    return {
      patientId,
      sort: "-appointment_date,appointment_time",
      appointmentState: selectedBranch,
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
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [selectedExamOrder, setSelectedExamOrder] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [showLoadExamResultsFileModal, setShowLoadExamResultsFileModal] =
    useState(false);

  const [pdfFile, setPdfFile] = useState<File | null>(null); // Para almacenar el archivo PDF
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null); // Para la previsualización del PDF
  const [showPdfModal, setShowPdfModal] = useState(false); // Para controlar la visibilidad del modal de PDF

  const { fetchTemplate, switchTemplate } = useTemplateBuilded();

  const {
    sendMessage: sendMessageAppointmentHook,
    responseMsg,
    loading,
    error,
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];

  const sendMessageAppointment = useRef(sendMessageAppointmentHook);

  useEffect(() => {
    sendMessageAppointment.current = sendMessageAppointmentHook;
  }, [sendMessageAppointmentHook]);

  const columns: CustomPRTableColumnProps[] = [
    {
      header: "Paciente",
      field: "patientName",
      body: (data: AppointmentTableItem) => (
        <>
          <a href={`verPaciente?id=${data.patientId}`}>{data.patientName}</a>
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
    {
      header: "",
      field: "",
      body: (data: AppointmentTableItem) => (
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
              <li>
                <a
                  className="dropdown-item"
                  onClick={() =>
                    setShowFormModal({
                      isShow: true,
                      data: data,
                    })
                  }
                >
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      className="fa-solid far fa-hospital"
                      style={{ width: "20px" }}
                    ></i>
                    <span>Generar preadmision</span>
                  </div>
                </a>F
              </li>
              {(data.stateKey === "pending_consultation" ||
                data.stateKey === "called" ||
                data.stateKey === "in_consultation") &&
                data.attentionType === "CONSULTATION" &&
                patientId && (
                  <li>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMakeClinicalRecord(data.patientId, data.id);
                      }}
                      data-column="realizar-consulta"
                    >
                      <div className="d-flex gap-2 align-items-center">
                        <i
                          className="fa-solid fa-stethoscope"
                          style={{ width: "20px" }}
                        ></i>
                        <span>Realizar consulta</span>
                      </div>
                    </a>
                  </li>
                )}
              {(data.stateId === "2" ||
                data.stateKey === "pending_consultation" ||
                data.stateKey === "called" ||
                data.stateKey === "in_consultation") &&
                data.attentionType === "PROCEDURE" &&
                patientId && (
                  <>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLoadExamResults(
                            data.id,
                            data.patientId,
                            data.productId
                          );
                        }}
                        data-column="realizar-consulta"
                      >
                        <div className="d-flex gap-2 align-items-center">
                          <i
                            className="fa-solid fa-stethoscope"
                            style={{ width: "20px" }}
                          ></i>
                          <span>Realizar examen</span>
                        </div>
                      </a>

                      <a
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedAppointment(data);
                          setSelectedAppointmentId(data.id);
                          setSelectedExamOrder(data.orders[0]);
                          setShowPdfModal(true);
                        }}
                      >
                        <div className="d-flex gap-2 align-items-center">
                          <i
                            className="fa-solid fa-file-pdf"
                            style={{ width: "20px", cursor: "pointer" }}
                          ></i>
                          <span style={{ cursor: "pointer" }}>
                            Subir Examen
                          </span>
                        </div>
                      </a>
                    </li>
                  </>
                )}
              {data.stateId === "1" ||
                (data.stateKey === "pending" && (
                  <>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => openRescheduleAppointmentModal(data.id)}
                      >
                        <div className="d-flex gap-2 align-items-center">
                          <i
                            className="fa-solid fa-calendar-alt"
                            style={{ width: "20px" }}
                          ></i>
                          <span>Reagendar cita</span>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item"
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCancelAppointment(data);
                        }}
                      >
                        <div className="d-flex gap-2 align-items-center">
                          <i
                            className="fa-solid fa-ban"
                            style={{ width: "20px" }}
                          ></i>
                          <span>Cancelar cita</span>
                        </div>
                      </a>
                    </li>
                  </>
                ))}
              <hr />
              <li className="dropdown-header">Cita</li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={async (e) => {
                    e.preventDefault();
                    const dataTemplate = {
                      tenantId: tenant,
                      belongsTo: "citas-compartir",
                      type: "whatsapp",
                    };
                    const dataFormated = {
                      patient: data.patient,
                      assigned_user_availability: data.user_availability,
                      appointment_date: data.date,
                      appointment_time: data.time
                    }
                    const templateAppointments = await fetchTemplate(dataTemplate);
                    const finishTemplate = await switchTemplate(
                      templateAppointments.template,
                      "appointments",
                      dataFormated
                    );
                    await sendMessageWhatsapp(data.patient, finishTemplate, null);
                  }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <i
                      className="fa-brands fa-whatsapp"
                      style={{ width: "20px" }}
                    ></i>
                    <span>Compartir cita</span>
                  </div>
                </a>
              </li>
              <hr />
              <li className="dropdown-header">Factura</li>
              <PrintTableAction
                onTrigger={() => {
                  //@ts-ignore
                  generateInvoice(data.id, false);
                }}
              ></PrintTableAction>
              <DownloadTableAction
                onTrigger={() => {
                  //@ts-ignore
                  generateInvoice(data.id, true);
                }}
              ></DownloadTableAction>
              <ShareTableAction
                shareType="whatsapp"
                onTrigger={() => {
                  //@ts-ignore
                  sendInvoice(data.id, data.patientId);
                }}
              ></ShareTableAction>
              <ShareTableAction
                shareType="email"
                onTrigger={() => {
                  //@ts-ignore
                  sendInvoice(data.id, data.patientId);
                }}
              ></ShareTableAction>
            </ul>
          </div>
        </div>
      ),
    },
  ];

  const [showFormModal, setShowFormModal] = useState({
    isShow: false,
    data: {},
  });

  const handleSubmit = async () => {
    try {
      // Llamar a la función guardarArchivoExamen
      //@ts-ignore
      const enviarPDf = await guardarArchivoExamen("inputPdf", 2);

      // Acceder a la PromiseResult
      if (enviarPDf !== undefined) {
        const dataUpdate = {
          minio_url: enviarPDf,
        };
        const examRecipeResultData = {
          exam_recipe_id: selectedAppointment?.exam_recipe_id,
          uploaded_by_user_id: userLogged.id,
          date: new Date().toISOString(),
          result_minio_url: enviarPDf,
        };
        await examOrderService.updateMinioFile(
          selectedExamOrder?.id,
          dataUpdate
        );
        await examRecipeResultService.create(examRecipeResultData);
        await examRecipeService.changeStatus(
          selectedAppointment?.exam_recipe_id,
          "uploaded"
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

  useEffect(() => {
    refresh();
  }, [selectedBranch, selectedDate]);

  const handleMakeClinicalRecord = (
    patientId: string,
    appointmentId: string
  ) => {
    UserManager.onAuthChange((isAuthenticated, user) => {
      if (user) {
        window.location.href = `consultas-especialidad?patient_id=${patientId}&especialidad=${user.specialty.name}&appointment_id=${appointmentId}`;
      }
    });
  };

  //filtrar objecto en el select
  const getAppointmentStates = () => {
    return Object.entries(appointmentStateFilters).map(([key, label]) => ({
      value: key,
      label: label,
    }));
  };

  const handleCancelAppointment = async (data: any) => {
    SwalManager.confirmCancel(async (data) => {
      await appointmentService.changeStatus(Number(data.id), "cancelled");
      const dataTemplate = {
        tenantId: tenant,
        belongsTo: "cita-canelacion",
        type: "whatsapp",
      };
      const templateAppointment = await fetchTemplate(dataTemplate);
      const finishTemplate = await switchTemplate(
        templateAppointment.template,
        "appointments",
        data
      );
      sendMessageWhatsapp(data.patient, finishTemplate, null);
      SwalManager.success({ text: "Cita cancelada exitosamente" });
    });
  };

  const sendMessageWhatsapp = useCallback(
    async (patient, templateFormatted, dataToFile) => {
      let dataMessage = {};
      if (dataToFile !== null) {
        dataMessage = {
          channel: "whatsapp",
          recipients: [
            getIndicativeByCountry(patient.country_id) + patient.whatsapp,
          ],
          message_type: "media",
          message: templateFormatted,
          attachment_url: dataToFile?.file_url,
          attachment_type: "document",
          minio_model_type: dataToFile?.model_type,
          minio_model_id: dataToFile?.model_id,
          minio_id: dataToFile?.id,
          webhook_url: "https://example.com/webhook",
        };
      } else {
        dataMessage = {
          channel: "whatsapp",
          recipients: [
            getIndicativeByCountry(patient.country_id) + patient.whatsapp,
          ],
          message_type: "text",
          message: templateFormatted,
          webhook_url: "https://example.com/webhook",
        };
      }

      await sendMessageAppointment.current(dataMessage);
    },
    [sendMessageAppointmentHook]
  );

  const openRescheduleAppointmentModal = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setShowRescheduleModal(true);
  };

  const handleHideFormModal = () => {
    setShowFormModal({ isShow: false, data: {} });
  };

  const handleLoadExamResults = (
    appointmentId: string,
    patientId: string,
    productId: string
  ) => {
    window.location.href = `cargarResultadosExamen?patient_id=${patientId}&product_id=${productId}&appointment_id=${appointmentId}`;
  };

  const handleLoadExamResultsFile = () => {
    setShowLoadExamResultsFileModal(true);
  };

  return (
    <>
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
                      <label htmlFor="branch_id" className="form-label">
                        Estados
                      </label>
                      <Dropdown
                        inputId="branch_id"
                        options={getAppointmentStates()}
                        optionLabel="label"
                        optionValue="value"
                        filter
                        placeholder="Filtrar por estado"
                        className="w-100"
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.value)}
                        showClear
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="rangoFechasCitas" className="form-label">
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
        title={"Crear Preadmision" + " - " + showFormModal.data["patientName"]}
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
      <RescheduleAppointmentModalV2
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        appointmentId={selectedAppointmentId}
        onSuccess={() => {
          refresh();
          setShowRescheduleModal(false);
        }}
      />
    </>
  );
};
