import React, { use } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { CustomModal } from "../components/CustomModal";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties";
import { Patient, UserAvailability, UserSpecialtyDto } from "../models/models";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import {
  patientService,
  userAvailabilityService,
  userService,
  massMessagingService,
} from "../../services/api";
import { RadioButton } from "primereact/radiobutton";
import { stringToDate } from "../../services/utilidades";
import { useProducts } from "../products/hooks/useProducts";
import {
  externalCauses as commonExternalCauses,
  purposeConsultations,
  typeConsults,
} from "../../services/commons";
import { usePatients } from "../patients/hooks/usePatients";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { useAppointmentBulkCreate } from "./hooks/useAppointmentBulkCreate";
import { usePatientExamRecipes } from "../exam-recipes/hooks/usePatientExamRecipes";
import { useValidateBulkAppointments } from "./hooks/useValidateBulkAppointments";
import { Tooltip } from "primereact/tooltip";
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import { useProductsByType } from "../products/hooks/useProductsByType";
import { useMassMessaging } from "../hooks/useMassMessaging";
import { useTemplate } from "../hooks/useTemplate";
import {
  formatWhatsAppMessage,
  getIndicativeByCountry,
  formatDate,
} from "../../services/utilidades";
import PatientFormModal from "../patients/modals/form/PatientFormModal";
import { Dialog } from "primereact/dialog";
import { PrimeReactProvider } from "primereact/api";
import { usePRToast } from "../hooks/usePRToast";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { useAppointmentBulkCreateGroup } from "./hooks/useAppointmentBulkCreateGroup";
import { useGoogleCalendarConfig } from './hooks/useGoogleCalendarConfig';
import { Button } from "primereact/button";

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
  patients: Patient[];
  patient: Patient | null;
  patient_whatsapp: string;
  patient_email: string;
  is_group: boolean;
}

export interface FormAppointment extends AppointmentFormInputs {
  errors: Record<string, any>;
  professional_name: string;
  specialty_name: string;
}

export const AppointmentFormModal = ({ isOpen, onClose, onAppointmentCreated }) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [appointments, setAppointments] = useState<FormAppointment[]>([]);
  const [currentAppointment, setCurrentAppointment] =
    useState<FormAppointment | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValid, setFormValid] = useState(false);

  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] =
    useState(true);

  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState("");

  const [showRecurrentFields, setShowRecurrentFields] = useState(false);
  const [appointmentFrequency, setAppointmentFrequency] = useState("diary");
  const [appointmentRepetitions, setAppointmentRepetitions] =
    useState<Nullable<number | null>>(1);

  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<any[]>(
    []
  );
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState<any[]>(
    []
  );
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] =
    useState<any[]>([]);

  const [availableBlocks, setAvailableBlocks] = useState<any[]>([]);
  const [enabledDates, setEnabledDates] = useState<Date[]>([]);

  const [patients, setPatients] = useState<Patient[]>([]);

  const [disabledProductIdField, setDisabledProductIdField] = useState(false);

  const { userSpecialties } = useUserSpecialties();
  const { productsByType: products, fetchProductsByType } = useProductsByType();
  const { createAppointmentBulk } = useAppointmentBulkCreate();
  const { createAppointmentBulkGroup } = useAppointmentBulkCreateGroup();
  const { createGoogleCalendarConfig, loading: googleCalendarLoading } = useGoogleCalendarConfig(null);
  const { validateBulkAppointments } = useValidateBulkAppointments();
  const { patientExamRecipes, setPatientExamRecipes, fetchPatientExamRecipes } =
    usePatientExamRecipes();
  const { sendMessage, responseMsg, loading, error } = useMassMessaging();
  const {
    showSuccessToast,
    showErrorToast,
    showFormErrorsToast,
    showServerErrorsToast,
    toast,
  } = usePRToast();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "citas-creacion",
    type: "whatsapp",
  };
  const { template, setTemplate, fetchTemplate } = useTemplate(data);

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
  const frequencies = [
    { value: "diary", label: "Diario" },
    { value: "weekly", label: "Semanal" },
    { value: "monthly", label: "Mensual" },
    { value: "bimestral", label: "Bimestral" },
    { value: "semestral", label: "Semestral" },
    { value: "annual", label: "Anual" },
  ];

  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
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
      is_group: false,
      patients: [],
    },
  });

  const mapAppointmentsToServer = async (
    appointments: AppointmentFormInputs[]
  ) => {
    const currentUser = await userService.getLoggedUser();

    return appointments.map((app) => {
      const assignedUserAvailability =
        app.assigned_user_assistant_availability_id ||
        app.assigned_user_availability?.id;
      const supervisorUserId = app.assigned_user_assistant_availability_id
        ? app.assigned_user_availability?.id
        : null;

      const data: any = {
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

      if (app.is_group) {
        data.patients = app.patients.map(patient => patient.id);
      }

      return data;
    });
  };

  const addAppointments = async (data: AppointmentFormInputs) => {
    if (editingId && appointments.find((app) => app.uuid === editingId)) {
      setAppointments(
        appointments.map((app) =>
          app.uuid === editingId ? { ...app, ...data } : app
        )
      );
      setEditingId(null);

      clearAppointmentForm();
    } else {
      clearAppointmentForm();

      const newAppointments: any[] = [];
      let currentDate = data.appointment_date
        ? new Date(data.appointment_date)
        : null;

      for (let i = 0; i < (appointmentRepetitions || 1); i++) {
        if (currentDate) {
          const appointmentDateCopy = new Date(currentDate);

          const newAppointment = {
            ...data,
            uuid: crypto.randomUUID(),
            appointment_date: appointmentDateCopy,
          };

          newAppointments.push(newAppointment);

          switch (appointmentFrequency) {
            case "diary":
              currentDate.setDate(currentDate.getDate() + 1);
              break;
            case "weekly":
              currentDate.setDate(currentDate.getDate() + 7);
              break;
            case "monthly":
              currentDate.setMonth(currentDate.getMonth() + 1);
              break;
            case "bimestral":
              currentDate.setMonth(currentDate.getMonth() + 2);
              break;
            case "semestral":
              currentDate.setMonth(currentDate.getMonth() + 6);
              break;
            case "annual":
              currentDate.setFullYear(currentDate.getFullYear() + 1);
              break;
            default:
              currentDate.setDate(currentDate.getDate() + 1);
              break;
          }
        }
      }

      const validatedAppointments = await validateAppointments(newAppointments);

      setAppointments((prev) => [...prev, ...validatedAppointments]);
    }
  };

  const validateAppointments = async (_appointments: FormAppointment[]) => {
    const mappedAppointments = await mapAppointmentsToServer(_appointments);

    try {
      await validateBulkAppointments(mappedAppointments);

      // Si la validación es exitosa, limpiamos los errores
      return _appointments.map((appointment) => ({
        ...appointment,
        errors: {},
      }));
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Parseamos el error correctamente
        const errorData = error.data?.errors || {};

        return _appointments.map((appointment, index) => ({
          ...appointment,
          errors: errorData[index.toString()] || {},
        }));
      }

      // En caso de otros errores, mantenemos las citas como están
      return _appointments;
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();

    const data = await mapAppointmentsToServer(appointments);

    try {
      if (!isGroup) {
        await createAppointmentBulk(
          {
            appointments: data,
          },
          patient!.id?.toString()
        );
      } else {
        await createAppointmentBulkGroup(
          {
            appointments: data,
          }
        );
      }

      for (const appointment of appointments) {
        const googleCalendarPayload = {
          user_id: appointment.assigned_user_availability?.user?.id || "12",
          nombre: `${patient?.first_name || ''} ${patient?.last_name || ''}`.trim(),
          fecha: appointment.appointment_date?.toISOString().split('T')[0] || '',
          hora: `${appointment.appointment_time}:00` || '',
          hora_final: calcularHoraFinal(appointment.appointment_time, appointment.assigned_user_availability?.appointment_duration),
          motivo: appointment.consultation_purpose || 'Consulta médica'
        };

        await createGoogleCalendarConfig(googleCalendarPayload);
      }

      showSuccessToast();
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }

      if (!isGroup) {
        for (const appointment of appointments) {
          await sendMessageWhatsapp(appointment, appointment.patient);
        }
      }

      if (isGroup) {
        for (const appointment of appointments) {
          for (const patient of appointment.patients) {
            await sendMessageWhatsapp(appointment, patient);
          }
        }
      }

      onClose();
      // setTimeout(() => {
      //   location.reload();
      // }, 1000);
    } catch (error) {
      showServerErrorsToast(error);
      console.error(error);
    }
  };

  const calcularHoraFinal = (horaInicio: string, duracionMinutos: number) => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0);
    fecha.setMinutes(fecha.getMinutes() + duracionMinutos);

    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:00`;
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

  const isGroup = useWatch({
    control,
    name: "is_group",
  });

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

  const appointmentTime = useWatch({
    control,
    name: "appointment_time",
  });

  const appointmentType = useWatch({
    control,
    name: "appointment_type",
  });

  const patient = useWatch({
    control,
    name: "patient",
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

        availableBlocks.forEach((item) => {
          item.days.forEach((day) => {
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
          assignedUserAvailability.id,
          "doctor"
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
        assignedUserAssistantAvailabilityId,
        "assistant"
      );
    } else if (assignedUserAvailability && appointmentDate) {
      // Si se deselecciona, volver a horas del doctor
      updateTimeSlotsForProfessional(
        availableBlocks,
        appointmentDate.toISOString().split("T")[0],
        assignedUserAvailability.id,
        "doctor"
      );
    }
  }, [assignedUserAssistantAvailabilityId]);

  useEffect(() => {
    if (editingId === null) {
      setCurrentAppointment(null);
    }
  }, [editingId]);

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
      currentAppointment?.appointment_date || enabledDates.length > 0
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
        currentAppointment?.appointment_time || selectedTime || null
      );
    }
  }, [appointmentTimeOptions]);

  useEffect(() => {
    if (isGroup) {
      // En modo grupal: validar que haya citas y al menos un paciente
      setFormValid(appointments.length > 0 && patients.length > 0);
    } else {
      // En modo individual: validar que haya citas y un paciente seleccionado
      setFormValid(appointments.length > 0 && !!patient);
    }
  }, [appointments, patient, patients, isGroup]);

  useEffect(() => {
    fetchProductsByType("Servicios");
  }, []);

  const handleRemove = (id: string) => {
    setAppointments(appointments.filter((app) => app.uuid !== id));
  };

  const handleEdit = (appointment: FormAppointment) => {
    setEditingId(appointment.uuid);
    fillAppointmentForm(appointment);
  };

  const handleClear = () => {
    clearAppointmentForm();
    setEditingId(null);
  };

  const handleCopy = (appointment: FormAppointment) => {
    setEditingId(null);
    fillAppointmentForm(appointment);
  };

  const fillAppointmentForm = (appointment: FormAppointment) => {
    setCurrentAppointment(appointment);
    setValue("user_specialty", appointment.user_specialty);
    setValue("show_exam_recipe_field", appointment.show_exam_recipe_field);
    setValue("exam_recipe_id", appointment.exam_recipe_id);
    setValue("appointment_type", appointment.appointment_type);
    setValue("product_id", appointment.product_id);
    setValue("consultation_purpose", appointment.consultation_purpose);
    setValue("consultation_type", appointment.consultation_type);
    setValue("external_cause", appointment.external_cause);
    setShowRecurrentFields(false);
    setAppointmentFrequency("diary");
    setAppointmentRepetitions(1);
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
    setShowRecurrentFields(false);
    setAppointmentFrequency("diary");
    setAppointmentRepetitions(1);
    setEditingId(null);
  };

  const clearPatientForm = () => {
    setValue("patient", null);
    setValue("patient_whatsapp", "");
    setValue("patient_email", "");
  };

  const getFormErrorMessage = (name: keyof AppointmentFormInputs) => {
    return (
      errors[name] &&
      errors[name].type !== "required" && (
        <small className="p-error">{errors[name].message}</small>
      )
    );
  };

  const hasValidationErrors = () => {
    return appointments.some((appointment) => {
      return Object.keys(appointment.errors).length > 0;
    });
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

  const updateAppointmentTimeOptions = (availableBlocks, date: Date) => {
    const dateString = date.toISOString().split("T")[0];

    // Filtramos doctores disponibles en esa fecha
    let availableDoctors: any[] = [];

    availableBlocks.forEach((item) => {
      item.days.forEach((day) => {
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
        firstDoctor.id,
        "doctor"
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
          (day) => day.date === dateString
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
    availableBlocks,
    dateString: string,
    availabilityId: string,
    professionalType: "doctor" | "assistant"
  ) => {
    let blocks: any[] = [];

    availableBlocks.forEach((item) => {
      // Buscar por ID de disponibilidad
      if (item.availability_id === availabilityId) {
        item.days.forEach((day) => {
          if (day.date === dateString) {
            day.blocks.forEach((block) => {
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

    blocks.forEach((block) => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(
        slots.map((slot) => ({
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

  const updateTimeSlotsForDoctor = (
    availableBlocks,
    dateString: string,
    doctorId: string
  ) => {
    let blocks: any[] = [];

    // Buscamos los bloques del doctor específico
    availableBlocks.forEach((item) => {
      if (item.availability_id === doctorId) {
        item.days.forEach((day) => {
          if (day.date === dateString) {
            day.blocks.forEach((block) => {
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

    blocks.forEach((block) => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(
        slots.map((slot) => ({
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

  const searchPatients = async (event: AutoCompleteCompleteEvent) => {
    const filteredPatients = await patientService.getByFilters({
      per_page: 1000000,
      search: event.query,
    });

    setPatients(
      filteredPatients.data.data.map((patient) => ({
        ...patient,
        label: `${patient.first_name} ${patient.last_name}, Tel: ${patient.whatsapp}, Doc: ${patient.document_number}`,
      }))
    );
  };

  const getProfessional = (app: FormAppointment) => {
    const assignedUserAvailability =
      app.assigned_user_assistant_availability_id ||
      app.assigned_user_availability?.id;
    const userAvailability = userAvailabilityOptions.find(
      (userAvailability) => userAvailability.id === assignedUserAvailability
    );
    const currentUserAvailability =
      userAvailability || app.assigned_user_availability || null;

    app.professional_name = currentUserAvailability?.full_name;
    app.specialty_name = currentUserAvailability?.user?.specialty?.name;

    return {
      professional_name: app.professional_name,
      specialty_name: app.specialty_name,
    };
  };



  return (
    <>
      <PatientFormModal
        visible={showPatientModal}
        onHide={() => setShowPatientModal(false)}
        onSuccess={() => {
          setShowPatientModal(false);
        }}
      />
      <Dialog
        visible={isOpen}
        onHide={onClose}
        header="Crear cita"
        appendTo={"self"}
        style={{ width: "90vw", maxWidth: "1200px" }}
        maximizable
      >
        <Toast ref={toast} />
        {/* Columna izquierda - Formulario */}
        <form className="needs-validation row" noValidate onSubmit={onSubmit}>
          <div className="col-12">
            {isGroup && <>
              <div className="mb-3 w-100">
                <Controller
                  name="patients"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Pacientes *
                      </label>
                      <div className="d-flex w-100">
                        <div className="d-flex flex-grow-1">
                          <div className="grid row p-fluid w-100">
                            <div className="col-12">
                              <AutoComplete
                                inputId={field.name}
                                placeholder="Seleccione uno o más pacientes"
                                field="label"
                                suggestions={patients}
                                completeMethod={searchPatients}
                                inputClassName="w-100"
                                panelClassName="w-100"
                                multiple={true}
                                className={classNames("w-100", {
                                  "p-invalid": errors.patients,
                                })}
                                appendTo={"self"}
                                {...field}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          <Button
                            type="button"
                            label="Agregar Paciente"
                            className="p-button-primary"
                            onClick={() => setShowPatientModal(true)}
                          >
                            <i className="fas fa-plus"></i>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                />
                {getFormErrorMessage("patients")}
              </div>
            </>}
            {!isGroup && <>
              <div className="mb-3 w-100">
                <Controller
                  name="patient"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Paciente *
                      </label>
                      <div className="d-flex w-100">
                        <div className="d-flex flex-grow-1">
                          <div className="grid row p-fluid w-100">
                            <div className="col-12">
                              <AutoComplete
                                inputId={field.name}
                                placeholder={"Seleccione un paciente"}
                                field="label"
                                suggestions={patients}
                                completeMethod={searchPatients}
                                inputClassName="w-100"
                                panelClassName="w-100"
                                className={classNames("w-100", {
                                  "p-invalid": errors.patient,
                                })}
                                appendTo={"self"}
                                {...field}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          <Button
                            label="Registrar Paciente"
                            type="button"
                            className="p-button-primary"
                            onClick={() => setShowPatientModal(true)}
                          >
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                />
                {getFormErrorMessage("patient")}
              </div>
            </>}
            {!isGroup && (
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
            )}
          </div>
          <div className="col-12 px-3 mb-3">
            <Card>
              <div className="row">
                <div className="col-md-7">
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

                      <Controller
                        name='is_group'
                        control={control}
                        render={({ field }) =>
                          <>
                            <div className="d-flex align-items-center gap-2">
                              <InputSwitch
                                checked={field.value}
                                onChange={(e) => {
                                  clearPatientForm()
                                  clearAppointmentForm()
                                  field.onChange(e.value)
                                }}
                              />
                              <label htmlFor={field.name} className='form-label'>Grupal</label>
                            </div>
                          </>
                        }
                      />
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
                            disabled={appointmentDateDisabled}
                            enabledDates={enabledDates}
                            appendTo={"self"}
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
                                filter
                                showClear
                                placeholder="Seleccione una finalidad"
                                className={classNames("w-100 dropdown-appointment", {
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
                                optionLabel="label"
                                optionValue="value"
                                filter
                                showClear
                                placeholder="Seleccione un tipo de consulta"
                                className={classNames("w-100 dropdown-appointment", {
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
                                optionLabel="label"
                                optionValue="value"
                                filter
                                showClear
                                placeholder="Seleccione una causa externa"
                                className={classNames("w-100 dropdown-appointment")}
                                appendTo={"self"}
                                {...field}
                              ></Dropdown>
                            </>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    {!editingId && (
                      <div className="d-flex align-items-center gap-2">
                        <Checkbox
                          inputId="recurrent"
                          name="recurrent"
                          checked={showRecurrentFields}
                          onChange={(e) =>
                            setShowRecurrentFields(e.target.checked || false)
                          }
                        />
                        <label
                          htmlFor="recurrent"
                          className="ml-2 form-check-label"
                        >
                          Cita recurrente
                        </label>
                      </div>
                    )}
                    {showRecurrentFields && (
                      <div className="mt-3">
                        <div className="row">
                          <div className="col-md-6">
                            <label
                              htmlFor="appointment_frequency"
                              className="form-label"
                            >
                              Frecuencia de la cita
                            </label>
                            <Dropdown
                              inputId="appointment_frequency"
                              options={frequencies}
                              optionLabel="label"
                              optionValue="value"
                              filter
                              showClear
                              placeholder="Seleccione una frecuencia"
                              className={classNames("w-100")}
                              appendTo={"self"}
                              value={appointmentFrequency}
                              onChange={(e) => setAppointmentFrequency(e.value)}
                            />
                          </div>
                          <div className="col-md-6">
                            <label
                              htmlFor="appointment_repetitions"
                              className="form-label"
                            >
                              Número de repeticiones
                            </label>
                            <InputNumber
                              inputId="appointment_repetitions"
                              value={appointmentRepetitions}
                              onValueChange={(e) =>
                                setAppointmentRepetitions(e.value)
                              }
                              className="w-100"
                              min={1}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between">
                    <Button
                      type="button"
                      className="p-button-primary"
                      onClick={() => handleClear()}
                    >
                      Limpiar
                    </Button>
                    <Button
                      type="button"
                      className="p-button-primary"
                      onClick={handleSubmit(addAppointments)}
                    >
                      {editingId &&
                        appointments.find((a) => a.uuid === editingId)
                        ? "Actualizar cita"
                        : "Agregar cita"}
                    </Button>
                  </div>
                </div>

                {/* Columna derecha - Listado de citas */}
                <div className="col-md-5">
                  <h5>Citas programadas</h5>

                  <hr />

                  {appointments.length === 0 ? (
                    <p className="text-muted">No hay citas programadas</p>
                  ) : (
                    <div className="d-flex flex-column gap-3 align-items-center">
                      {appointments.map((appointment) => {
                        const hasErrors = Object.keys(appointment.errors).length > 0;

                        return (
                          <div
                            key={`${appointment.uuid}-${Object.keys(appointment.errors).length}`}
                            className={`appointment-card card ${hasErrors ? "appointment-error border-danger" : "appointment-success border-success"}`}
                          >
                            <div className="card-body d-flex flex-column">
                              <div className="appointment-info flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <div className="w-100">
                                    <small className="fw-bold">Fecha:</small>{" "}
                                    <small>
                                      {appointment.appointment_date?.toLocaleDateString()}
                                    </small>
                                  </div>
                                  {hasErrors && (
                                    <AppointmentErrorIndicator
                                      appointmentId={appointment.uuid}
                                      errors={appointment.errors}
                                    />
                                  )}
                                </div>
                                <div className="w-100 mb-1">
                                  <small className="fw-bold">Hora:</small>{" "}
                                  <small>{appointment.appointment_time}</small>
                                </div>
                                <div className="w-100 mb-1">
                                  <small className="fw-bold">Profesional:</small>{" "}
                                  <small>
                                    {getProfessional(appointment)?.professional_name || "--"}
                                  </small>
                                </div>
                                <div className="w-100">
                                  <small className="fw-bold">Especialidad:</small>{" "}
                                  <small>
                                    {getProfessional(appointment)?.specialty_name || "--"}
                                  </small>
                                </div>
                              </div>
                              <div className="appointment-actions mt-3 pt-2">
                                <Button
                                  type="button"
                                  severity="secondary"
                                  onClick={() => handleEdit(appointment)}
                                  text
                                >
                                  <i className="fas fa-pencil-alt"></i>
                                </Button>
                                <Button
                                  type="button"
                                  severity="info"
                                  onClick={() => handleCopy(appointment)}
                                  text
                                >
                                  <i className="fas fa-copy"></i>
                                </Button>
                                <Button
                                  type="button"
                                  severity="danger"
                                  onClick={() => handleRemove(appointment.uuid)}
                                  text
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
          <div className="d-flex justify-content-end gap-2">
            <Button
              className="btn btn-link text-danger px-3 my-0"
              aria-label="Close"
              type="button"
              onClick={onClose}
            >
              <i className="fas fa-arrow-left"></i> Cerrar
            </Button>
            <Button
              type="submit"
              label="Guardar Cita"
              className="p-button-primary"
              disabled={!formValid || hasValidationErrors()}
            >
              <i className="fas fa-bookmark" style={{ marginLeft: "5px" }}></i>
            </Button>
          </div>
        </form>
      </Dialog >
    </>
  );
};

const AppointmentErrorIndicator = ({
  appointmentId,
  errors,
}: {
  appointmentId: string;
  errors: any;
}) => {
  const errorMessages = Object.values(errors).flat();

  return (
    <>
      <Tooltip target={`#error-${appointmentId}`} position="top">
        <div className="p-2">
          {errorMessages.map((msg: any, i) => (
            <ul key={i}>{msg}</ul>
          ))}
        </div>
      </Tooltip>
      <i
        id={`error-${appointmentId}`}
        className="fas fa-warning p-error cursor-pointer"
      ></i>
    </>
  );
};
