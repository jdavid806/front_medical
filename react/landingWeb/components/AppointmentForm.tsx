import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useUserSpecialties } from "../../user-specialties/hooks/useUserSpecialties";
import { Patient, UserAvailability, UserSpecialtyDto } from "../../models/models";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import {
  userAvailabilityService,
  userService,
} from "../../../services/api";
import { RadioButton } from "primereact/radiobutton";
import { stringToDate } from "../../../services/utilidades";
import {
  externalCauses as commonExternalCauses,
  purposeConsultations,
  typeConsults,
} from "../../../services/commons";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { useAppointmentBulkCreate } from "../../appointments/hooks/useAppointmentBulkCreate";
import { usePatientExamRecipes } from "../../exam-recipes/hooks/usePatientExamRecipes";
import { useProductsByType } from "../../products/hooks/useProductsByType";
import { useMassMessaging } from "../../hooks/useMassMessaging";
import { useTemplate } from "../../hooks/useTemplate";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
  formatDate,
} from "../../../services/utilidades";
import { PrimeReactProvider } from "primereact/api";
import { usePRToast } from "../../hooks/usePRToast";
import { Toast } from "primereact/toast";

export interface AppointmentFormInputs {
  uuid: string;
  user_specialty: UserSpecialtyDto | null;
  show_exam_recipe_field: boolean;
  exam_recipe_id: string | null;
  appointment_date: Nullable<Date>;
  appointment_time: string | null;
  assigned_user_availability: UserAvailability | null;
  assigned_user_assistant_availability_id: string | null;
  appointment_type: "1" | "2" | "3";
  product_id: string | null;
  consultation_purpose: string | null;
  consultation_type: string | null;
  external_cause: string | null;
  patient_whatsapp: string;
  patient_email: string;
}

export interface AppointmentFormModalProps {
  patient: Patient | null;
  onSave: () => void;
}

export const AppointmentForm = ({ patient, onSave }: AppointmentFormModalProps) => {

  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);

  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState("");

  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<any[]>([]);
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState<any[]>([]);
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState<any[]>([]);

  const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
  const [enabledDates, setEnabledDates] = useState<Date[]>([]);

  const [disabledProductIdField, setDisabledProductIdField] = useState(false);

  const { userSpecialties } = useUserSpecialties();
  const { productsByType: products, fetchProductsByType } = useProductsByType();
  const { createAppointmentBulk } = useAppointmentBulkCreate();
  const { patientExamRecipes, setPatientExamRecipes, fetchPatientExamRecipes } = usePatientExamRecipes();
  const { sendMessage } = useMassMessaging();
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast,
  } = usePRToast();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "citas-creacion",
    type: "whatsapp",
  };
  const { template } = useTemplate(data);

  const consultationPurposes = Object.entries(purposeConsultations).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );
  const consultationTypes = Object.entries(typeConsults).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );
  const externalCauses = Object.entries(commonExternalCauses).map(
    ([key, value]) => ({
      value: key,
      label: value,
    })
  );

  const {
    control,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<AppointmentFormInputs>({
    defaultValues: {
      uuid: "",
      appointment_date: null,
      appointment_time: "",
      assigned_user_availability: null,
      appointment_type: "1",
      consultation_type: "FOLLOW_UP",
      external_cause: "NOT_APPLICABLE",
      consultation_purpose: "TREATMENT",
    },
  });

  const mapAppointmentToServer = async () => {
    const currentUser = await userService.getLoggedUser();

    const app = getValues();

    const assignedUserAvailability =
      app.assigned_user_assistant_availability_id ||
      app.assigned_user_availability?.id;
    const supervisorUserId = app.assigned_user_assistant_availability_id
      ? app.assigned_user_availability?.id
      : null;

    return {
      appointment_date: app.appointment_date?.toISOString().split("T")[0],
      appointment_time: app.appointment_time + ":00",
      assigned_user_availability_id: assignedUserAvailability,
      product_id: app.product_id,
      created_by_user_id: currentUser?.id,
      appointment_state_id: 1,
      attention_type: "CONSULTATION",
      consultation_purpose: app.consultation_purpose,
      consultation_type: app.consultation_type,
      external_cause: app.external_cause,
      assigned_supervisor_user_availability_id: supervisorUserId,
      exam_recipe_id: app.exam_recipe_id,
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const data = await mapAppointmentToServer();

    try {
      await createAppointmentBulk({
        appointments: [data],
      }, patient!.id?.toString());

      showSuccessToast();
      onSave?.();

      const appointment = getValues();
      await sendMessageWhatsapp(appointment, patient);

    } catch (error) {
      showServerErrorsToast(error);
      console.error(error);
    }
  };

  async function sendMessageWhatsapp(appointment: any, patient: any) {
    const replacements = {
      NOMBRE_PACIENTE: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`,
      ESPECIALISTA: `${appointment.assigned_user_availability.full_name}`,
      ESPECIALIDAD: `${appointment.user_specialty.name}`,
      FECHA_CITA: `${formatDate(appointment.appointment_date, true)}`,
      HORA_CITA: `${appointment.appointment_time}`,
    };

    const templateFormatted = formatWhatsAppMessage(
      template.template,
      replacements
    );

    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [
        getIndicativeByCountry(patient.country_id) +
        patient.whatsapp,
      ],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook",
    };
    await sendMessage(dataMessage);
  }

  const userSpecialty = useWatch({
    control,
    name: "user_specialty",
  });

  const showExamRecipeField = useWatch({
    control,
    name: "show_exam_recipe_field",
  });

  const appointmentDate = useWatch({
    control,
    name: "appointment_date",
  });

  const appointmentType = useWatch({
    control,
    name: "appointment_type",
  });

  const assignedUserAvailability = useWatch({
    control,
    name: "assigned_user_availability",
  });

  const assignedUserAssistantAvailabilityId = useWatch({
    control,
    name: "assigned_user_assistant_availability_id",
  });

  const examRecipeId = useWatch({
    control,
    name: "exam_recipe_id",
  });

  useEffect(() => {
    if (!showExamRecipeField) {
      setValue("exam_recipe_id", null);
    }
  }, [showExamRecipeField]);

  useEffect(() => {
    if (examRecipeId) {
      const laboratory = products.find(
        (product) => product.attention_type === "LABORATORY"
      );
      setValue("product_id", laboratory?.id);
      setDisabledProductIdField(true);
    } else {
      setValue("product_id", null);
      setDisabledProductIdField(false);
    }
  }, [examRecipeId]);

  useEffect(() => {
    if (patient) {
      fetchPatientExamRecipes(patient.id?.toString());
    } else {
      setPatientExamRecipes([]);
    }
  }, [patient?.id]);

  useEffect(() => {
    if (userSpecialty) {
      setShowUserSpecialtyError(false);
      setValue("appointment_date", null);
      setAppointmentTimeOptions([]);

      const asyncScope = async () => {
        const availableBlocks: any[] =
          await userAvailabilityService.availableBlocks({
            user_specialty_id: userSpecialty?.id,
          } as any);

        setAvailableBlocks(availableBlocks);

        if (availableBlocks.length > 0) {
          setAppointmentDateDisabled(false);
          setAppointmentTimeDisabled(false);
          setUserAvailabilityDisabled(false);
        } else {
          setShowUserSpecialtyError(true);
          setUserSpecialtyError(userSpecialty?.label);
        }

        setEnabledDates([]);

        let availableDates: Date[] = [];

        availableBlocks.forEach((item: any) => {
          item.days.forEach((day: any) => {
            if (!enabledDates.includes(day.date)) {
              availableDates.push(stringToDate(day.date));
            }
          });
        });

        setEnabledDates(availableDates);

        updateAppointmentTimeOptions(availableBlocks, availableDates[0]);
      };
      asyncScope();
    } else {
      setShowUserSpecialtyError(false);
      setAppointmentDateDisabled(true);
      setAppointmentTimeDisabled(true);
      setUserAvailabilityDisabled(true);
      setValue("appointment_date", null);
      setValue("appointment_time", "");
      setValue("assigned_user_availability", null);
    }
  }, [userSpecialty]);

  useEffect(() => {
    if (appointmentDate) {
      updateAppointmentTimeOptions(availableBlocks, appointmentDate);
    }
  }, [appointmentDate]);

  useEffect(() => {
    if (assignedUserAvailability) {
      // Cargar asistentes para el doctor seleccionado
      loadAssistantsForSelectedDoctor(assignedUserAvailability.id);

      // Actualizar horas si no hay asistente seleccionado
      if (!assignedUserAssistantAvailabilityId && appointmentDate) {
        updateTimeSlotsForProfessional(
          availableBlocks,
          appointmentDate.toISOString().split("T")[0],
          assignedUserAvailability.id
        );
      }
    } else {
      setAssistantAvailabilityOptions([]);
    }
  }, [assignedUserAvailability]);

  useEffect(() => {
    if (assignedUserAssistantAvailabilityId && appointmentDate) {
      updateTimeSlotsForProfessional(
        availableBlocks,
        appointmentDate.toISOString().split("T")[0],
        assignedUserAssistantAvailabilityId
      );
    } else if (assignedUserAvailability && appointmentDate) {
      // Si se deselecciona, volver a horas del doctor
      updateTimeSlotsForProfessional(
        availableBlocks,
        appointmentDate.toISOString().split("T")[0],
        assignedUserAvailability.id
      );
    }
  }, [assignedUserAssistantAvailabilityId]);

  useEffect(() => {
    if (patient) {
      const whatsapp = patient.whatsapp || "";
      const email = patient.email || "";

      if (getValues("patient_whatsapp") !== whatsapp) {
        setValue("patient_whatsapp", whatsapp);
      }

      if (getValues("patient_email") !== email) {
        setValue("patient_email", email);
      }
    } else {
      setValue("patient_whatsapp", "");
      setValue("patient_email", "");
    }
  }, [patient?.id, patient?.whatsapp, patient?.email]);

  useEffect(() => {
    if (!enabledDates.length) return;
    setValue(
      "appointment_date",
      enabledDates.length > 0
        ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0]
        : null
    );
  }, [enabledDates]);

  useEffect(() => {
    if (appointmentTimeOptions.length > 0 && appointmentDate) {
      const selectedTime =
        appointmentTimeOptions.length > 0
          ? appointmentTimeOptions[0].value
          : null;

      setValue(
        "appointment_time",
        selectedTime || null
      );
    }
  }, [appointmentTimeOptions]);

  useEffect(() => {
    fetchProductsByType("Servicios");
  }, []);

  const getFormErrorMessage = (name: keyof AppointmentFormInputs) => {
    return (
      errors[name] &&
      errors[name].type !== "required" && (
        <small className="p-error">{errors[name].message}</small>
      )
    );
  };

  const computeTimeSlots = (start: string, end: string, duration: number) => {
    const slots: string[] = [];
    let current = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    while (current.getTime() + duration * 60000 <= endTime.getTime()) {
      const hours = current.getHours().toString().padStart(2, "0");
      const minutes = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hours}:${minutes}`);
      current = new Date(current.getTime() + duration * 60000);
    }

    return slots;
  };

  const updateAppointmentTimeOptions = (availableBlocks: any[], date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // Filtramos doctores disponibles en esa fecha
    let availableDoctors: any[] = [];

    availableBlocks.forEach((item: any) => {
      item.days.forEach((day: any) => {
        if (day.date === dateString) {
          availableDoctors.push({
            ...item,
            full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""
              } ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
            id: item.availability_id,
            user_id: item.user.id, // Agregamos el user_id para referencia
          });
        }
      });
    });

    // Eliminar duplicados
    const uniqueDoctors = availableDoctors.filter(
      (doctor, index, self) =>
        index ===
        self.findIndex((d) => d.availability_id === doctor.availability_id)
    );

    // Actualizar opciones de doctores
    setUserAvailabilityOptions(uniqueDoctors);

    // Seleccionar primer doctor disponible
    const firstDoctor = uniqueDoctors[0] || null;
    setValue("assigned_user_availability", firstDoctor);
    setValue("assigned_user_assistant_availability_id", null);
    setAssistantAvailabilityOptions([]); // Limpiar asistentes al cambiar doctor

    // Actualizar horas disponibles
    if (firstDoctor) {
      updateTimeSlotsForProfessional(
        availableBlocks,
        dateString,
        firstDoctor.id
      );
    } else {
      setAppointmentTimeOptions([]);
      setValue("appointment_time", null);
    }
  };

  const loadAssistantsForSelectedDoctor = (doctorId: string) => {
    if (!doctorId || !appointmentDate) {
      setAssistantAvailabilityOptions([]);
      return;
    }

    // Buscar el doctor seleccionado
    const selectedDoctor = userAvailabilityOptions.find(
      (doc) => doc.id === doctorId
    );

    if (!selectedDoctor || !selectedDoctor.user.assistants) {
      setAssistantAvailabilityOptions([]);
      return;
    }

    // Filtrar asistentes que tienen disponibilidad en la fecha seleccionada
    const dateString = appointmentDate.toISOString().split("T")[0];
    let availableAssistants: any[] = [];

    availableBlocks.forEach((item) => {
      // Buscar disponibilidades de asistentes del doctor seleccionado
      if (
        selectedDoctor.user.assistants.some(
          (assistant: any) => assistant.id === item.user.id
        )
      ) {
        // Verificar que tenga disponibilidad en la fecha
        const hasAvailability = item.days.some(
          (day: any) => day.date === dateString
        );

        if (hasAvailability) {
          availableAssistants.push({
            ...item,
            full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""
              } ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
            id: item.availability_id, // Usamos el ID de disponibilidad
            user_id: item.user.id, // Guardamos también el user_id
          });
        }
      }
    });

    setAssistantAvailabilityOptions(availableAssistants);
  };

  const updateTimeSlotsForProfessional = (
    availableBlocks: any[],
    dateString: string,
    availabilityId: string
  ) => {
    let blocks: any[] = [];

    availableBlocks.forEach((item: any) => {
      // Buscar por ID de disponibilidad
      if (item.availability_id === availabilityId) {
        item.days.forEach((day: any) => {
          if (day.date === dateString) {
            day.blocks.forEach((block: any) => {
              blocks.push({
                start: block.start_time,
                end: block.end_time,
                duration: item.appointment_duration,
              });
            });
          }
        });
      }
    });

    let options: any[] = [];

    blocks.forEach((block: any) => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(
        slots.map((slot: any) => ({
          label: slot,
          value: slot,
        }))
      );
    });

    // Eliminar duplicados y ordenar
    let uniqueOptions = options
      .filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.value === option.value)
      )
      .sort((a, b) => a.value.localeCompare(b.value));

    // Filtrar horas pasadas si es la fecha actual
    const now = new Date();
    const todayDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    if (dateString === todayDate) {
      uniqueOptions = uniqueOptions.filter(
        (option) => option.value >= currentTime
      );
    }

    setAppointmentTimeOptions(uniqueOptions);
    setValue("appointment_time", uniqueOptions[0]?.value || null);
  };

  const clearAppointmentForm = () => {
    setValue("user_specialty", null);
    setValue("show_exam_recipe_field", false);
    setValue("exam_recipe_id", null);
    setValue("appointment_type", "1");
    setValue("appointment_date", null);
    setValue("appointment_time", null);
    setValue("assigned_user_availability", null);
    setValue("product_id", null);
  };

  return (
    <>
      <PrimeReactProvider value={{
        zIndex: {
          overlay: 1000,
        }
      }}>
        <Toast ref={toast} />
        {/* Columna izquierda - Formulario */}
        <form className="needs-validation row" noValidate onSubmit={onSubmit}>
          <div className="col-12">
            <div className="row">
              <div className="col-md-6 mb-3">
                <Controller
                  name="patient_whatsapp"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Whatsapp *
                      </label>
                      <InputText
                        id={field.name}
                        className={classNames("w-100", {
                          "p-invalid": errors.patient_whatsapp,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("patient_whatsapp")}
              </div>
              <div className="col-md-6 mb-3">
                <Controller
                  name="patient_email"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Email
                      </label>
                      <InputText
                        id={field.name}
                        className={classNames("w-100", {
                          "p-invalid": errors.patient_email,
                        })}
                        {...field}
                      />
                    </>
                  )}
                />
              </div>
            </div>
          </div>
          <div className="col-12 px-3 mb-3">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-3">
                  <Controller
                    name="user_specialty"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Especialidad médica *
                        </label>
                        <Dropdown
                          inputId={field.name}
                          options={userSpecialties}
                          optionLabel="label"
                          virtualScrollerOptions={{ itemSize: 38 }}
                          filter
                          showClear
                          placeholder="Seleccione una especialidad"
                          className={classNames("w-100", {
                            "p-invalid": errors.user_specialty,
                          })}
                          appendTo={"self"}
                          {...field}
                        ></Dropdown>
                      </>
                    )}
                  />
                  {getFormErrorMessage("user_specialty")}
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <Checkbox
                    inputId="showExamRecipeField"
                    name="showExamRecipeField"
                    checked={showExamRecipeField}
                    onChange={(e) =>
                      setValue(
                        "show_exam_recipe_field",
                        e.target.checked || false
                      )
                    }
                  />
                  <label
                    htmlFor="showExamRecipeField"
                    className="ml-2 form-check-label"
                  >
                    Relacionar receta de examen
                  </label>
                </div>

                {showExamRecipeField && (
                  <>
                    <div className="mb-3">
                      <Controller
                        name="exam_recipe_id"
                        control={control}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Receta de examen
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={patientExamRecipes}
                              virtualScrollerOptions={{ itemSize: 38 }}
                              optionLabel="label"
                              optionValue="id"
                              filter
                              showClear
                              placeholder="Seleccione una receta de examen"
                              className={classNames("w-100", {
                                "p-invalid": errors.exam_recipe_id,
                              })}
                              appendTo={"self"}
                              {...field}
                            ></Dropdown>
                          </>
                        )}
                      />
                      {getFormErrorMessage("exam_recipe_id")}
                    </div>
                  </>
                )}

                {showUserSpecialtyError && (
                  <div className="alert alert-danger" role="alert">
                    No hay especialistas de: <span>{userSpecialtyError}</span>{" "}
                    disponibles en este momento
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label mb-2">Tipo de cita *</label>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <Controller
                        name="appointment_type"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <RadioButton
                              inputId={field.name + "1"}
                              checked={appointmentType === "1"}
                              className={classNames("", {
                                "p-invalid": errors.appointment_type,
                              })}
                              value="1"
                              onChange={(e) => field.onChange(e.value)}
                            />
                            <label
                              htmlFor={field.name + "1"}
                              className="ml-2 form-check-label"
                            >
                              Presencial
                            </label>
                          </>
                        )}
                      />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Controller
                        name="appointment_type"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <RadioButton
                              inputId={field.name + "3"}
                              checked={appointmentType === "3"}
                              className={classNames("", {
                                "p-invalid": errors.appointment_type,
                              })}
                              onChange={(e) => field.onChange(e.value)}
                              value="3"
                            />
                            <label
                              htmlFor={field.name + "3"}
                              className="ml-2 form-check-label"
                            >
                              Domiciliaria
                            </label>
                          </>
                        )}
                      />
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <Controller
                        name="appointment_type"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <RadioButton
                              inputId={field.name + "2"}
                              checked={appointmentType === "2"}
                              className={classNames("", {
                                "p-invalid": errors.appointment_type,
                              })}
                              onChange={(e) => field.onChange(e.value)}
                              value="2"
                            />
                            <label
                              htmlFor={field.name + "2"}
                              className="ml-2 form-check-label"
                            >
                              Virtual
                            </label>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  {getFormErrorMessage("appointment_type")}
                </div>

                <div className="mb-3">
                  <Controller
                    name="appointment_date"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Fecha de la consulta *
                        </label>
                        <Calendar
                          id={field.name}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          className={classNames("w-100", {
                            "p-invalid": errors.appointment_date,
                          })}
                          appendTo={"self"}
                          disabled={appointmentDateDisabled}
                          enabledDates={enabledDates}
                          placeholder="Seleccione una fecha"
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("appointment_date")}
                </div>

                <div className="mb-3">
                  <Controller
                    name="assigned_user_availability"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Doctor(a) *
                        </label>
                        <Dropdown
                          inputId={field.name}
                          options={userAvailabilityOptions}
                          virtualScrollerOptions={{ itemSize: 38 }}
                          optionLabel="full_name"
                          filter
                          placeholder="Seleccione un usuario"
                          className={classNames("w-100", {
                            "p-invalid": errors.assigned_user_availability,
                          })}
                          appendTo={"self"}
                          disabled={userAvailabilityDisabled}
                          {...field}
                        ></Dropdown>
                      </>
                    )}
                  />
                  {getFormErrorMessage("assigned_user_availability")}
                </div>

                {assistantAvailabilityOptions.length > 0 && (
                  <>
                    <div className="mb-3">
                      <Controller
                        name="assigned_user_assistant_availability_id"
                        control={control}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Asistente
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={assistantAvailabilityOptions}
                              virtualScrollerOptions={{ itemSize: 38 }}
                              optionLabel="full_name"
                              optionValue="id"
                              filter
                              showClear
                              placeholder="Seleccione un asistente"
                              className={classNames("w-100", {
                                "p-invalid":
                                  errors.assigned_user_assistant_availability_id,
                              })}
                              appendTo={"self"}
                              disabled={userAvailabilityDisabled}
                              {...field}
                            ></Dropdown>
                          </>
                        )}
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <Controller
                    name="appointment_time"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Hora de la consulta *
                        </label>
                        <Dropdown
                          inputId={field.name}
                          options={appointmentTimeOptions}
                          virtualScrollerOptions={{ itemSize: 38 }}
                          optionLabel="label"
                          filter
                          placeholder="Seleccione una hora"
                          className={classNames("w-100", {
                            "p-invalid": errors.appointment_time,
                          })}
                          appendTo={"self"}
                          disabled={appointmentTimeDisabled}
                          {...field}
                        ></Dropdown>
                      </>
                    )}
                  />
                  {getFormErrorMessage("appointment_time")}
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-md-12">
                      <Controller
                        name="product_id"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Procedimiento *
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={products}
                              optionLabel="label"
                              optionValue="id"
                              virtualScrollerOptions={{ itemSize: 38 }}
                              filter
                              showClear
                              placeholder="Seleccione un procedimiento"
                              className={classNames("w-100", {
                                "p-invalid": errors.product_id,
                              })}
                              appendTo={"self"}
                              {...field}
                              disabled={disabledProductIdField}
                            ></Dropdown>
                          </>
                        )}
                      />
                      {getFormErrorMessage("product_id")}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        name="consultation_purpose"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Finalidad de la consulta *
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={consultationPurposes}
                              optionValue="value"
                              optionLabel="label"
                              virtualScrollerOptions={{ itemSize: 38 }}
                              filter
                              showClear
                              placeholder="Seleccione una finalidad"
                              className={classNames("w-100", {
                                "p-invalid": errors.consultation_purpose,
                              })}
                              appendTo={"self"}
                              {...field}
                            ></Dropdown>
                          </>
                        )}
                      />
                      {getFormErrorMessage("consultation_purpose")}
                    </div>
                    <div className="col-md-6">
                      <Controller
                        name="consultation_type"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Tipo de consulta *
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={consultationTypes}
                              virtualScrollerOptions={{ itemSize: 38 }}
                              optionLabel="label"
                              optionValue="value"
                              filter
                              showClear
                              placeholder="Seleccione un tipo de consulta"
                              className={classNames("w-100", {
                                "p-invalid": errors.consultation_type,
                              })}
                              appendTo={"self"}
                              {...field}
                            ></Dropdown>
                          </>
                        )}
                      />
                      {getFormErrorMessage("consultation_type")}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="row">
                    <div className="col-md-6">
                      <Controller
                        name="external_cause"
                        control={control}
                        render={({ field }) => (
                          <>
                            <label
                              htmlFor={field.name}
                              className="form-label"
                            >
                              Causa externa
                            </label>
                            <Dropdown
                              inputId={field.name}
                              options={externalCauses}
                              virtualScrollerOptions={{ itemSize: 38 }}
                              optionLabel="label"
                              optionValue="value"
                              filter
                              showClear
                              placeholder="Seleccione una causa externa"
                              className={classNames("w-100")}
                              appendTo={"self"}
                              {...field}
                            ></Dropdown>
                          </>
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => clearAppointmentForm()}
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              type="submit"
              className="btn btn-primary my-0"
              disabled={!isValid}
            >
              <i className="fas fa-bookmark"></i> Guardar
            </button>
          </div>
        </form>
      </PrimeReactProvider>
    </>
  );
};
