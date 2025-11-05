function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties.js";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { patientService, userAvailabilityService, userService } from "../../services/api/index.js";
import { RadioButton } from "primereact/radiobutton";
import { stringToDate } from "../../services/utilidades.js";
import { externalCauses as commonExternalCauses, purposeConsultations, typeConsults } from "../../services/commons.js";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { useAppointmentBulkCreate } from "./hooks/useAppointmentBulkCreate.js";
import { usePatientExamRecipes } from "../exam-recipes/hooks/usePatientExamRecipes.js";
import { useValidateBulkAppointments } from "./hooks/useValidateBulkAppointments.js";
import { Tooltip } from "primereact/tooltip";
import { AutoComplete } from "primereact/autocomplete";
import { useProductsByType } from "../products/hooks/useProductsByType.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { formatWhatsAppMessage, getIndicativeByCountry, formatDate } from "../../services/utilidades.js";
import PatientFormModal from "../patients/modals/form/PatientFormModal.js";
import { Dialog } from "primereact/dialog";
import { usePRToast } from "../hooks/usePRToast.js";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import { useAppointmentBulkCreateGroup } from "./hooks/useAppointmentBulkCreateGroup.js";
import { useGoogleCalendarConfig } from "./hooks/useGoogleCalendarConfig.js";
import { Button } from "primereact/button";
export const AppointmentFormModal = ({
  isOpen,
  onClose,
  onAppointmentCreated
}) => {
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);
  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState("");
  const [showRecurrentFields, setShowRecurrentFields] = useState(false);
  const [appointmentFrequency, setAppointmentFrequency] = useState("diary");
  const [appointmentRepetitions, setAppointmentRepetitions] = useState(1);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([]);
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState([]);
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const [patients, setPatients] = useState([]);
  const [disabledProductIdField, setDisabledProductIdField] = useState(false);
  const {
    userSpecialties
  } = useUserSpecialties();
  const {
    productsByType: products,
    fetchProductsByType
  } = useProductsByType();
  const {
    createAppointmentBulk
  } = useAppointmentBulkCreate();
  const {
    createAppointmentBulkGroup
  } = useAppointmentBulkCreateGroup();
  const {
    createGoogleCalendarConfig,
    loading: googleCalendarLoading
  } = useGoogleCalendarConfig(null);
  const {
    validateBulkAppointments
  } = useValidateBulkAppointments();
  const {
    patientExamRecipes,
    setPatientExamRecipes,
    fetchPatientExamRecipes
  } = usePatientExamRecipes();
  const {
    sendMessage,
    responseMsg,
    loading,
    error
  } = useMassMessaging();
  const {
    showSuccessToast,
    showErrorToast,
    showFormErrorsToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const tenant = window.location.hostname.split(".")[0];
  const data = {
    tenantId: tenant,
    belongsTo: "citas-creacion",
    type: "whatsapp"
  };
  const {
    template,
    setTemplate,
    fetchTemplate
  } = useTemplate(data);
  const consultationPurposes = Object.entries(purposeConsultations).map(([key, value]) => ({
    value: key,
    label: value
  }));
  const consultationTypes = Object.entries(typeConsults).map(([key, value]) => ({
    value: key,
    label: value
  }));
  const externalCauses = Object.entries(commonExternalCauses).map(([key, value]) => ({
    value: key,
    label: value
  }));
  const frequencies = [{
    value: "diary",
    label: "Diario"
  }, {
    value: "weekly",
    label: "Semanal"
  }, {
    value: "monthly",
    label: "Mensual"
  }, {
    value: "bimestral",
    label: "Bimestral"
  }, {
    value: "semestral",
    label: "Semestral"
  }, {
    value: "annual",
    label: "Anual"
  }];
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: {
      errors
    }
  } = useForm({
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
      patients: []
    }
  });
  const mapAppointmentsToServer = async appointments => {
    const currentUser = await userService.getLoggedUser();
    return appointments.map(app => {
      const assignedUserAvailability = app.assigned_user_assistant_availability_id || app.assigned_user_availability?.id;
      const supervisorUserId = app.assigned_user_assistant_availability_id ? app.assigned_user_availability?.id : null;
      const data = {
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
        exam_recipe_id: app.exam_recipe_id
      };
      if (app.is_group) {
        data.patients = app.patients.map(patient => patient.id);
      }
      return data;
    });
  };
  const addAppointments = async data => {
    if (editingId && appointments.find(app => app.uuid === editingId)) {
      setAppointments(appointments.map(app => app.uuid === editingId ? {
        ...app,
        ...data
      } : app));
      setEditingId(null);
      clearAppointmentForm();
    } else {
      clearAppointmentForm();
      const newAppointments = [];
      let currentDate = data.appointment_date ? new Date(data.appointment_date) : null;
      for (let i = 0; i < (appointmentRepetitions || 1); i++) {
        if (currentDate) {
          const appointmentDateCopy = new Date(currentDate);
          const newAppointment = {
            ...data,
            uuid: crypto.randomUUID(),
            appointment_date: appointmentDateCopy
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
      setAppointments(prev => [...prev, ...validatedAppointments]);
    }
  };
  const validateAppointments = async _appointments => {
    const mappedAppointments = await mapAppointmentsToServer(_appointments);
    try {
      await validateBulkAppointments(mappedAppointments);

      // Si la validación es exitosa, limpiamos los errores
      return _appointments.map(appointment => ({
        ...appointment,
        errors: {}
      }));
    } catch (error) {
      if (error.response?.status === 422) {
        // Parseamos el error correctamente
        const errorData = error.data?.errors || {};
        return _appointments.map((appointment, index) => ({
          ...appointment,
          errors: errorData[index.toString()] || {}
        }));
      }

      // En caso de otros errores, mantenemos las citas como están
      return _appointments;
    }
  };
  const onSubmit = async e => {
    e.preventDefault();
    const data = await mapAppointmentsToServer(appointments);
    try {
      if (!isGroup) {
        await createAppointmentBulk({
          appointments: data
        }, patient.id?.toString());
      } else {
        await createAppointmentBulkGroup({
          appointments: data
        });
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
  const calcularHoraFinal = (horaInicio, duracionMinutos) => {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, 0, 0);
    fecha.setMinutes(fecha.getMinutes() + duracionMinutos);
    return `${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}:00`;
  };
  async function sendMessageWhatsapp(appointment, patient) {
    const replacements = {
      NOMBRE_PACIENTE: `${patient.first_name} ${patient.middle_name} ${patient.last_name} ${patient.second_last_name}`,
      ESPECIALISTA: `${appointment.assigned_user_availability.full_name}`,
      ESPECIALIDAD: `${appointment.user_specialty.name}`,
      FECHA_CITA: `${formatDate(appointment.appointment_date, true)}`,
      HORA_CITA: `${appointment.appointment_time}`
    };
    const templateFormatted = formatWhatsAppMessage(template.template, replacements);
    const dataMessage = {
      channel: "whatsapp",
      message_type: "text",
      recipients: [getIndicativeByCountry(patient.country_id) + patient.whatsapp],
      message: templateFormatted,
      webhook_url: "https://example.com/webhook"
    };
    await sendMessage(dataMessage);
  }
  const isGroup = useWatch({
    control,
    name: "is_group"
  });
  const userSpecialty = useWatch({
    control,
    name: "user_specialty"
  });
  const showExamRecipeField = useWatch({
    control,
    name: "show_exam_recipe_field"
  });
  const appointmentDate = useWatch({
    control,
    name: "appointment_date"
  });
  const appointmentTime = useWatch({
    control,
    name: "appointment_time"
  });
  const appointmentType = useWatch({
    control,
    name: "appointment_type"
  });
  const patient = useWatch({
    control,
    name: "patient"
  });
  const assignedUserAvailability = useWatch({
    control,
    name: "assigned_user_availability"
  });
  const assignedUserAssistantAvailabilityId = useWatch({
    control,
    name: "assigned_user_assistant_availability_id"
  });
  const examRecipeId = useWatch({
    control,
    name: "exam_recipe_id"
  });
  useEffect(() => {
    if (!showExamRecipeField) {
      setValue("exam_recipe_id", null);
    }
  }, [showExamRecipeField]);
  useEffect(() => {
    if (examRecipeId) {
      const laboratory = products.find(product => product.attention_type === "LABORATORY");
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
        const availableBlocks = await userAvailabilityService.availableBlocks({
          user_specialty_id: userSpecialty?.id
        });
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
        let availableDates = [];
        availableBlocks.forEach(item => {
          item.days.forEach(day => {
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
        updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAvailability.id, "doctor");
      }
    } else {
      setAssistantAvailabilityOptions([]);
    }
  }, [assignedUserAvailability]);
  useEffect(() => {
    if (assignedUserAssistantAvailabilityId && appointmentDate) {
      updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAssistantAvailabilityId, "assistant");
    } else if (assignedUserAvailability && appointmentDate) {
      // Si se deselecciona, volver a horas del doctor
      updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAvailability.id, "doctor");
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
    setValue("appointment_date", currentAppointment?.appointment_date || enabledDates.length > 0 ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0] : null);
  }, [enabledDates]);
  useEffect(() => {
    if (appointmentTimeOptions.length > 0 && appointmentDate) {
      const selectedTime = appointmentTimeOptions.length > 0 ? appointmentTimeOptions[0].value : null;
      setValue("appointment_time", currentAppointment?.appointment_time || selectedTime || null);
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
  const handleRemove = id => {
    setAppointments(appointments.filter(app => app.uuid !== id));
  };
  const handleEdit = appointment => {
    setEditingId(appointment.uuid);
    fillAppointmentForm(appointment);
  };
  const handleClear = () => {
    clearAppointmentForm();
    setEditingId(null);
  };
  const handleCopy = appointment => {
    setEditingId(null);
    fillAppointmentForm(appointment);
  };
  const fillAppointmentForm = appointment => {
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
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== "required" && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const hasValidationErrors = () => {
    return appointments.some(appointment => {
      return Object.keys(appointment.errors).length > 0;
    });
  };
  const computeTimeSlots = (start, end, duration) => {
    const slots = [];
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
  const updateAppointmentTimeOptions = (availableBlocks, date) => {
    const dateString = date.toISOString().split("T")[0];

    // Filtramos doctores disponibles en esa fecha
    let availableDoctors = [];
    availableBlocks.forEach(item => {
      item.days.forEach(day => {
        if (day.date === dateString) {
          availableDoctors.push({
            ...item,
            full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
            id: item.availability_id,
            user_id: item.user.id // Agregamos el user_id para referencia
          });
        }
      });
    });

    // Eliminar duplicados
    const uniqueDoctors = availableDoctors.filter((doctor, index, self) => index === self.findIndex(d => d.availability_id === doctor.availability_id));

    // Actualizar opciones de doctores
    setUserAvailabilityOptions(uniqueDoctors);

    // Seleccionar primer doctor disponible
    const firstDoctor = uniqueDoctors[0] || null;
    setValue("assigned_user_availability", firstDoctor);
    setValue("assigned_user_assistant_availability_id", null);
    setAssistantAvailabilityOptions([]); // Limpiar asistentes al cambiar doctor

    // Actualizar horas disponibles
    if (firstDoctor) {
      updateTimeSlotsForProfessional(availableBlocks, dateString, firstDoctor.id, "doctor");
    } else {
      setAppointmentTimeOptions([]);
      setValue("appointment_time", null);
    }
  };
  const loadAssistantsForSelectedDoctor = doctorId => {
    if (!doctorId || !appointmentDate) {
      setAssistantAvailabilityOptions([]);
      return;
    }

    // Buscar el doctor seleccionado
    const selectedDoctor = userAvailabilityOptions.find(doc => doc.id === doctorId);
    if (!selectedDoctor || !selectedDoctor.user.assistants) {
      setAssistantAvailabilityOptions([]);
      return;
    }

    // Filtrar asistentes que tienen disponibilidad en la fecha seleccionada
    const dateString = appointmentDate.toISOString().split("T")[0];
    let availableAssistants = [];
    availableBlocks.forEach(item => {
      // Buscar disponibilidades de asistentes del doctor seleccionado
      if (selectedDoctor.user.assistants.some(assistant => assistant.id === item.user.id)) {
        // Verificar que tenga disponibilidad en la fecha
        const hasAvailability = item.days.some(day => day.date === dateString);
        if (hasAvailability) {
          availableAssistants.push({
            ...item,
            full_name: `${item.user.first_name || ""} ${item.user.middle_name || ""} ${item.user.last_name || ""} ${item.user.second_last_name || ""}`,
            id: item.availability_id,
            // Usamos el ID de disponibilidad
            user_id: item.user.id // Guardamos también el user_id
          });
        }
      }
    });
    setAssistantAvailabilityOptions(availableAssistants);
  };
  const updateTimeSlotsForProfessional = (availableBlocks, dateString, availabilityId, professionalType) => {
    let blocks = [];
    availableBlocks.forEach(item => {
      // Buscar por ID de disponibilidad
      if (item.availability_id === availabilityId) {
        item.days.forEach(day => {
          if (day.date === dateString) {
            day.blocks.forEach(block => {
              blocks.push({
                start: block.start_time,
                end: block.end_time,
                duration: item.appointment_duration
              });
            });
          }
        });
      }
    });
    let options = [];
    blocks.forEach(block => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(slots.map(slot => ({
        label: slot,
        value: slot
      })));
    });

    // Eliminar duplicados y ordenar
    let uniqueOptions = options.filter((option, index, self) => index === self.findIndex(o => o.value === option.value)).sort((a, b) => a.value.localeCompare(b.value));

    // Filtrar horas pasadas si es la fecha actual
    const now = new Date();
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (dateString === todayDate) {
      uniqueOptions = uniqueOptions.filter(option => option.value >= currentTime);
    }
    setAppointmentTimeOptions(uniqueOptions);
    setValue("appointment_time", uniqueOptions[0]?.value || null);
  };
  const updateTimeSlotsForDoctor = (availableBlocks, dateString, doctorId) => {
    let blocks = [];

    // Buscamos los bloques del doctor específico
    availableBlocks.forEach(item => {
      if (item.availability_id === doctorId) {
        item.days.forEach(day => {
          if (day.date === dateString) {
            day.blocks.forEach(block => {
              blocks.push({
                start: block.start_time,
                end: block.end_time,
                duration: item.appointment_duration
              });
            });
          }
        });
      }
    });
    let options = [];
    blocks.forEach(block => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(slots.map(slot => ({
        label: slot,
        value: slot
      })));
    });

    // Eliminar duplicados y ordenar
    let uniqueOptions = options.filter((option, index, self) => index === self.findIndex(o => o.value === option.value)).sort((a, b) => a.value.localeCompare(b.value));

    // Filtrar horas pasadas si es la fecha actual
    const now = new Date();
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    if (dateString === todayDate) {
      uniqueOptions = uniqueOptions.filter(option => option.value >= currentTime);
    }
    setAppointmentTimeOptions(uniqueOptions);
    setValue("appointment_time", uniqueOptions[0]?.value || null);
  };
  const searchPatients = async event => {
    const filteredPatients = await patientService.getByFilters({
      per_page: 1000000,
      search: event.query
    });
    setPatients(filteredPatients.data.data.map(patient => ({
      ...patient,
      label: `${patient.first_name} ${patient.last_name}, Tel: ${patient.whatsapp}, Doc: ${patient.document_number}`
    })));
  };
  const getProfessional = app => {
    const assignedUserAvailability = app.assigned_user_assistant_availability_id || app.assigned_user_availability?.id;
    const userAvailability = userAvailabilityOptions.find(userAvailability => userAvailability.id === assignedUserAvailability);
    const currentUserAvailability = userAvailability || app.assigned_user_availability || null;
    app.professional_name = currentUserAvailability?.full_name;
    app.specialty_name = currentUserAvailability?.user?.specialty?.name;
    return {
      professional_name: app.professional_name,
      specialty_name: app.specialty_name
    };
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PatientFormModal, {
    visible: showPatientModal,
    onHide: () => setShowPatientModal(false),
    onSuccess: () => {
      setShowPatientModal(false);
    }
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: isOpen,
    onHide: onClose,
    header: "Crear cita",
    appendTo: "self",
    style: {
      width: "90vw",
      maxWidth: "1200px"
    },
    maximizable: true
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true,
    onSubmit: onSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, isGroup && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-100"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patients",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Pacientes *"), /*#__PURE__*/React.createElement("div", {
      className: "d-flex w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-grow-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid row p-fluid w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(AutoComplete, _extends({
      inputId: field.name,
      placeholder: "Seleccione uno o m\xE1s pacientes",
      field: "label",
      suggestions: patients,
      completeMethod: searchPatients,
      inputClassName: "w-100",
      panelClassName: "w-100",
      multiple: true,
      className: classNames("w-100", {
        "p-invalid": errors.patients
      }),
      appendTo: "self"
    }, field))))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      label: "Agregar Paciente",
      className: "p-button-primary",
      onClick: () => setShowPatientModal(true)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    })))))
  }), getFormErrorMessage("patients"))), !isGroup && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 w-100"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Paciente *"), /*#__PURE__*/React.createElement("div", {
      className: "d-flex w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-grow-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "grid row p-fluid w-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-12"
    }, /*#__PURE__*/React.createElement(AutoComplete, _extends({
      inputId: field.name,
      placeholder: "Seleccione un paciente",
      field: "label",
      suggestions: patients,
      completeMethod: searchPatients,
      inputClassName: "w-100",
      panelClassName: "w-100",
      className: classNames("w-100", {
        "p-invalid": errors.patient
      }),
      appendTo: "self"
    }, field))))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Registrar Paciente",
      type: "button",
      className: "p-button-primary",
      onClick: () => setShowPatientModal(true)
    }))))
  }), getFormErrorMessage("patient"))), !isGroup && /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient_whatsapp",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Whatsapp *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.patient_whatsapp
      })
    }, field)))
  }), getFormErrorMessage("patient_whatsapp")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient_email",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Email"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames("w-100", {
        "p-invalid": errors.patient_email
      })
    }, field)))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 px-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-7"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_specialty",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Especialidad m\xE9dica *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userSpecialties,
      optionLabel: "label",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una especialidad",
      className: classNames("w-100", {
        "p-invalid": errors.user_specialty
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("user_specialty")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2 mb-3"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "showExamRecipeField",
    name: "showExamRecipeField",
    checked: showExamRecipeField,
    onChange: e => setValue("show_exam_recipe_field", e.target.checked || false)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "showExamRecipeField",
    className: "ml-2 form-check-label"
  }, "Relacionar receta de examen")), showExamRecipeField && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "exam_recipe_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Receta de examen"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: patientExamRecipes,
      optionLabel: "label",
      optionValue: "id",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una receta de examen",
      className: classNames("w-100", {
        "p-invalid": errors.exam_recipe_id
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("exam_recipe_id"))), showUserSpecialtyError && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, "No hay especialistas de: ", /*#__PURE__*/React.createElement("span", null, userSpecialtyError), " ", "disponibles en este momento"), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label mb-2"
  }, "Tipo de cita *"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + "1",
      checked: appointmentType === "1",
      className: classNames("", {
        "p-invalid": errors.appointment_type
      }),
      value: "1",
      onChange: e => field.onChange(e.value)
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + "1",
      className: "ml-2 form-check-label"
    }, "Presencial"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + "3",
      checked: appointmentType === "3",
      className: classNames("", {
        "p-invalid": errors.appointment_type
      }),
      onChange: e => field.onChange(e.value),
      value: "3"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + "3",
      className: "ml-2 form-check-label"
    }, "Domiciliaria"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + "2",
      checked: appointmentType === "2",
      className: classNames("", {
        "p-invalid": errors.appointment_type
      }),
      onChange: e => field.onChange(e.value),
      value: "2"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + "2",
      className: "ml-2 form-check-label"
    }, "Virtual"))
  })), /*#__PURE__*/React.createElement(Controller, {
    name: "is_group",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(InputSwitch, {
      checked: field.value,
      onChange: e => {
        clearPatientForm();
        clearAppointmentForm();
        field.onChange(e.value);
      }
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Grupal")))
  })), getFormErrorMessage("appointment_type")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_date",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Fecha de la consulta *"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      value: field.value,
      onChange: e => field.onChange(e.value),
      className: classNames("w-100", {
        "p-invalid": errors.appointment_date
      }),
      disabled: appointmentDateDisabled,
      enabledDates: enabledDates,
      appendTo: "self",
      placeholder: "Seleccione una fecha"
    }))
  }), getFormErrorMessage("appointment_date")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assigned_user_availability",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Doctor(a) *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: userAvailabilityOptions,
      optionLabel: "full_name",
      filter: true,
      placeholder: "Seleccione un usuario",
      className: classNames("w-100", {
        "p-invalid": errors.assigned_user_availability
      }),
      appendTo: "self",
      disabled: userAvailabilityDisabled
    }, field)))
  }), getFormErrorMessage("assigned_user_availability")), assistantAvailabilityOptions.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assigned_user_assistant_availability_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Asistente"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: assistantAvailabilityOptions,
      optionLabel: "full_name",
      optionValue: "id",
      filter: true,
      showClear: true,
      placeholder: "Seleccione un asistente",
      className: classNames("w-100", {
        "p-invalid": errors.assigned_user_assistant_availability_id
      }),
      appendTo: "self",
      disabled: userAvailabilityDisabled
    }, field)))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_time",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Hora de la consulta *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: appointmentTimeOptions,
      virtualScrollerOptions: {
        itemSize: 38
      },
      optionLabel: "label",
      filter: true,
      placeholder: "Seleccione una hora",
      className: classNames("w-100", {
        "p-invalid": errors.appointment_time
      }),
      appendTo: "self",
      disabled: appointmentTimeDisabled
    }, field)))
  }), getFormErrorMessage("appointment_time")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "product_id",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Procedimiento *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: products,
      optionLabel: "label",
      optionValue: "id",
      virtualScrollerOptions: {
        itemSize: 38
      },
      filter: true,
      showClear: true,
      placeholder: "Seleccione un procedimiento",
      className: classNames("w-100", {
        "p-invalid": errors.product_id
      }),
      appendTo: "self"
    }, field, {
      disabled: disabledProductIdField
    })))
  }), getFormErrorMessage("product_id")))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "consultation_purpose",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Finalidad de la consulta *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: consultationPurposes,
      optionValue: "value",
      optionLabel: "label",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una finalidad",
      className: classNames("w-100 dropdown-appointment", {
        "p-invalid": errors.consultation_purpose
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("consultation_purpose")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "consultation_type",
    control: control,
    rules: {
      required: "Este campo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de consulta *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: consultationTypes,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      showClear: true,
      placeholder: "Seleccione un tipo de consulta",
      className: classNames("w-100 dropdown-appointment", {
        "p-invalid": errors.consultation_type
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("consultation_type")))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "external_cause",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Causa externa"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: externalCauses,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      showClear: true,
      placeholder: "Seleccione una causa externa",
      className: classNames("w-100 dropdown-appointment"),
      appendTo: "self"
    }, field)))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, !editingId && /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: "recurrent",
    name: "recurrent",
    checked: showRecurrentFields,
    onChange: e => setShowRecurrentFields(e.target.checked || false)
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "recurrent",
    className: "ml-2 form-check-label"
  }, "Cita recurrente")), showRecurrentFields && /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "appointment_frequency",
    className: "form-label"
  }, "Frecuencia de la cita"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "appointment_frequency",
    options: frequencies,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    showClear: true,
    placeholder: "Seleccione una frecuencia",
    className: classNames("w-100"),
    appendTo: "self",
    value: appointmentFrequency,
    onChange: e => setAppointmentFrequency(e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "appointment_repetitions",
    className: "form-label"
  }, "N\xFAmero de repeticiones"), /*#__PURE__*/React.createElement(InputNumber, {
    inputId: "appointment_repetitions",
    value: appointmentRepetitions,
    onValueChange: e => setAppointmentRepetitions(e.value),
    className: "w-100",
    min: 1
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-primary",
    onClick: () => handleClear()
  }, "Limpiar"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    className: "p-button-primary",
    onClick: handleSubmit(addAppointments)
  }, editingId && appointments.find(a => a.uuid === editingId) ? "Actualizar cita" : "Agregar cita"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("h5", null, "Citas programadas"), /*#__PURE__*/React.createElement("hr", null), appointments.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "No hay citas programadas") : /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3 align-items-center"
  }, appointments.map(appointment => {
    const hasErrors = Object.keys(appointment.errors).length > 0;
    return /*#__PURE__*/React.createElement("div", {
      key: `${appointment.uuid}-${Object.keys(appointment.errors).length}`,
      className: `appointment-card card ${hasErrors ? "appointment-error border-danger" : "appointment-success border-success"}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-body d-flex flex-column"
    }, /*#__PURE__*/React.createElement("div", {
      className: "appointment-info flex-grow-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-start mb-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-100"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-bold"
    }, "Fecha:"), " ", /*#__PURE__*/React.createElement("small", null, appointment.appointment_date?.toLocaleDateString())), hasErrors && /*#__PURE__*/React.createElement(AppointmentErrorIndicator, {
      appointmentId: appointment.uuid,
      errors: appointment.errors
    })), /*#__PURE__*/React.createElement("div", {
      className: "w-100 mb-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-bold"
    }, "Hora:"), " ", /*#__PURE__*/React.createElement("small", null, appointment.appointment_time)), /*#__PURE__*/React.createElement("div", {
      className: "w-100 mb-1"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-bold"
    }, "Profesional:"), " ", /*#__PURE__*/React.createElement("small", null, getProfessional(appointment)?.professional_name || "--")), /*#__PURE__*/React.createElement("div", {
      className: "w-100"
    }, /*#__PURE__*/React.createElement("small", {
      className: "fw-bold"
    }, "Especialidad:"), " ", /*#__PURE__*/React.createElement("small", null, getProfessional(appointment)?.specialty_name || "--"))), /*#__PURE__*/React.createElement("div", {
      className: "appointment-actions mt-3 pt-2"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      severity: "secondary",
      onClick: () => handleEdit(appointment),
      text: true
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-pencil-alt"
    })), /*#__PURE__*/React.createElement(Button, {
      type: "button",
      severity: "info",
      onClick: () => handleCopy(appointment),
      text: true
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-copy"
    })), /*#__PURE__*/React.createElement(Button, {
      type: "button",
      severity: "danger",
      onClick: () => handleRemove(appointment.uuid),
      text: true
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash-alt"
    })))));
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-link text-danger px-3 my-0",
    "aria-label": "Close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Cita",
    className: "p-button-primary",
    disabled: !formValid || hasValidationErrors()
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark",
    style: {
      marginLeft: "5px"
    }
  }))))));
};
const AppointmentErrorIndicator = ({
  appointmentId,
  errors
}) => {
  const errorMessages = Object.values(errors).flat();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Tooltip, {
    target: `#error-${appointmentId}`,
    position: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-2"
  }, errorMessages.map((msg, i) => /*#__PURE__*/React.createElement("ul", {
    key: i
  }, msg)))), /*#__PURE__*/React.createElement("i", {
    id: `error-${appointmentId}`,
    className: "fas fa-warning p-error cursor-pointer"
  }));
};