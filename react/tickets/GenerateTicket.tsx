import React, { useState, useEffect } from "react";
import { TicketDto, Patient } from "../models/models";
import { ticketService, patientService } from "../../services/api";
import { SelectButton } from "primereact/selectbutton";
import { classNames } from "primereact/utils";
import Swal from "sweetalert2";
import { useMassMessaging } from "../hooks/useMassMessaging";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
} from "../../services/utilidades";
import { useTemplate } from "../hooks/useTemplate";
import { generatePDFReceipts } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { useLoggedUser } from "../users/hooks/useLoggedUser";

export const GenerateTicket = () => {
  const [formData, setFormData] = useState({
    patient_name: "",
    phone: "",
    reason: "",
    priority: "NONE",
  });
  const [ticket, setTicket] = useState<TicketDto | any>(null); // <-- STATE DEFINIDO
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reasons, setReasons] = useState([]);
  const [priorities, setPriorities] = useState([]);
    const { loggedUser } = useLoggedUser();

  const [patientDni, setPatientDni] = useState("");
  const [loading, setLoading] = useState({
    ticket: false,
    patient: false,
  });
  const [error, setError] = useState("");
  const [showPatientInputs, setShowPatientInputs] = useState(false);
  const {
    sendMessage,
    responseMsg,
    loading: loadingMsg,
    error: errorMsg,
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "turnos-creacion",
    type: "whatsapp",
  };
  const { template, setTemplate, fetchTemplate } = useTemplate(data);
  const { company } = useCompany();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reasonsRes, prioritiesRes] = await Promise.all([
          ticketService.getAllTicketReasons(),
          ticketService.getAllTicketPriorities(),
        ]);

        const formattedReasons = reasonsRes.reasons.map((r: any) => ({
          value: r.key,
          label: r.label,
          icon: mapReasonIcon(r.key),
        }));

        const formattedPriorities = prioritiesRes.priorities.map((p: any) => ({
          value: p.key,
          label: p.label,
          icon: mapPriorityIcon(p.key),
        }));
    
        setReasons(formattedReasons);
        setPriorities(formattedPriorities);
      } catch (error) {
        console.error("Error cargando reasons/priorities:", error);
      }
    };

    fetchData();
  }, []);

  // Helpers para mapear iconos
  const mapReasonIcon = (key: string) => {
    switch (key) {
      case "ADMISSION_PRESCHEDULED":
        return "fas fa-calendar";
      case "EXIT_CONSULTATION":
        return "fas fa-sign-out-alt";
      case "CONSULTATION_GENERAL":
        return "fas fa-file";
      case "SPECIALIST":
        return "fas fa-user-md";
      case "VACCINATION":
        return "fas fa-syringe";
      case "LABORATORY":
        return "fas fa-flask";
      default:
        return "fas fa-tag";
    }
  };

  const mapPriorityIcon = (key: string) => {
    switch (key) {
      case "NONE":
        return "fas fa-circle";
      case "PREGNANT":
        return "fas fa-heart";
      case "SENIOR":
        return "fas fa-user";
      case "DISABILITY":
        return "fas fa-wheelchair";
      case "CHILDREN_BABY":
        return "fas fa-child";
      default:
        return "fas fa-tag";
    }
  };

  // Buscar paciente cuando cambia el ID
  const handleSearchPatient = async () => {
    if (!patientDni) return;

    setLoading((prev) => ({ ...prev, patient: true }));
    setError("");

    try {
      const response = await patientService.findByField({
        field: "document_number",
        value: patientDni,
      });

      setPatient(response);
      setFormData((prev) => ({
        ...prev,
        patient_name: `${response.first_name ?? ""} ${
          response.middle_name ?? ""
        } ${response.last_name ?? ""} ${response.second_last_name ?? ""}`,
        phone: response.whatsapp,
      }));
      setShowPatientInputs(true);
    } catch (err) {
      setPatient(null);
      setShowPatientInputs(true);
      setFormData((prev) => ({ ...prev, patient_name: "", phone: "" }));
      setError("Paciente no encontrado, ingrese número telefónico manualmente");
    } finally {
      setLoading((prev) => ({ ...prev, patient: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, ticket: true }));
    setError("");

    try {
      const ticketData = {
        ...formData,
        branch_id: 3,
        patient_id: patient?.id,
        module_id: loggedUser?.today_module_id
      };

      const response = await ticketService.create(ticketData);
      setTicket(response);
    } catch (err) {
      setError(err.response?.data?.message || "Error generando turno");
    } finally {
      setLoading((prev) => ({ ...prev, ticket: false }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const printElement = (element: any) => {
    // Clonar el elemento para no modificar el DOM original
    const clone = element.cloneNode(true) as HTMLElement;
    // Eliminar los botones dentro del clon
    clone.querySelectorAll("button").forEach((btn) => btn.remove());
    // Agregar estilos para mejorar la apariencia del ticket
    clone.style.border = "2px dashed #007bff";
    clone.style.padding = "24px";
    clone.style.margin = "16px auto";
    clone.style.maxWidth = "350px";
    clone.style.background = "#f8f9fa";
    clone.style.borderRadius = "12px";
    clone.style.boxShadow = "0 2px 8px rgba(0,0,0,0.07)";

    const printContents = clone.innerHTML;
    const configPDF = {
      name: "ticket",
      dimensions: [0, 0, 212.6, 210],
    };
    generatePDFReceipts(printContents, configPDF);
  };

  const BadgeTemplate = (option: any) => {
    return (
      <div className="d-flex align-items-center gap-2">
        <i className={classNames("pi", option.icon)}></i>
        <span>{option.label}</span>
      </div>
    );
  };

  const options = ["Off", "On"];
  const [value, setValue] = useState(options[0]);

  async function sendMessageWhatsapp() {
    const replacements = {
      NOMBRE_PACIENTE: `${ticket?.patient_name}`,
      TICKET: `${ticket?.ticket_number}`,
    };

    const templateFormatted = formatWhatsAppMessage(
      template.template,
      replacements
    );

    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [
        getIndicativeByCountry(patient?.country_id || "Dominican Republic") +
          ticket.phone,
      ],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook",
    };
    await sendMessage(dataMessage);
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Generar Nuevo Turno</h2>

      <div className="row justify-content-center">
        <div className="col-md-6 card p-4">
          <form onSubmit={handleSubmit}>
            {/* Búsqueda de paciente */}
            <div className="mb-3">
              <label className="form-label">Número de Identificación</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ingrese identificación"
                  value={patientDni}
                  onChange={(e) => setPatientDni(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleSearchPatient}
                  disabled={!patientDni || loading.patient}
                >
                  {loading.patient ? "Buscando..." : "Buscar"}
                </button>
              </div>
            </div>

            {/* Teléfono (condicional) */}
            {showPatientInputs && (
              <>
                <div className="mb-3">
                  <label className="form-label">Nombre del paciente *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="patient_name"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required={showPatientInputs}
                    disabled={!!patient}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required={showPatientInputs}
                    disabled={!!patient}
                  />
                </div>
              </>
            )}

            {formData.phone && formData.phone !== "" && (
              <>
                {/* Motivo de visita */}
                <div className="card mb-4">
                  <div className="card-header text-center">
                    <label className="block text-sm font-medium mb-2">
                      Motivo de la Visita
                    </label>
                  </div>
                  <div className="card-body d-flex justify-content-center">
                    <SelectButton
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.value })
                      }
                      options={reasons}
                      optionLabel="label"
                      optionValue="value"
                      itemTemplate={BadgeTemplate}
                      pt={{
                        root: {
                          className:
                            "d-flex flex-wrap gap-2 justify-content-center",
                        },
                        button: (options) => ({
                          className: classNames("rounded", {
                            "btn btn-outline-secondary":
                              !options?.context.selected,
                            "btn btn-primary": options?.context.selected,
                          }),
                        }),
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Prioridad */}
                <div className="card mb-4">
                  <div className="card-header text-center">
                    <label className="block text-sm font-medium mb-2">
                      Prioridad
                    </label>
                  </div>
                  <div className="card-body d-flex justify-content-center">
                    <SelectButton
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.value })
                      }
                      options={priorities}
                      optionLabel="label"
                      itemTemplate={BadgeTemplate}
                      pt={{
                        root: {
                          className:
                            "d-flex flex-wrap gap-2 justify-content-center",
                        },
                        button: (options) => ({
                          className: classNames("rounded", {
                            "btn btn-outline-secondary":
                              !options?.context.selected,
                            "btn btn-primary": options?.context.selected,
                          }),
                        }),
                      }}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {formData.phone && formData.phone !== "" && (
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading.ticket}
              >
                {loading.ticket ? "Generando..." : "Generar Turno"}
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Mostrar ticket generado */}
      {ticket && (
        <div
          id="ticket-printable"
          className="mt-4 p-4 bg-light rounded text-center"
        >
          <h3 className="text-success">Turno Generado</h3>
          <div className="h2 fw-bold text-primary">{ticket.ticket_number}</div>
          <div className="text-muted">
            Prioridad:{" "}
            {priorities.find((p) => p.value === ticket.priority)?.label}
          </div>
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() =>
                printElement(document.getElementById("ticket-printable"))
              }
            >
              Imprimir
            </button>
            <button
              type="button"
              className="btn btn-outline-success"
              onClick={async () => {
                const ticketPrintable =
                  document.getElementById("ticket-printable");

                if (ticketPrintable) {
                  sendMessageWhatsapp();
                }
              }}
            >
              Enviar por WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
