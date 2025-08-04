function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useCallback, useRef } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { CustomModal } from "../components/CustomModal.js";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties.js";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { appointmentService, templateService, userAvailabilityService, userService } from "../../services/api/index.js";
import { RadioButton } from "primereact/radiobutton";
import { stringToDate } from "../../services/utilidades.js";
import { externalCauses as commonExternalCauses, purposeConsultations, typeConsults } from "../../services/commons.js";
import { Checkbox } from "primereact/checkbox";
import { usePatientExamRecipes } from "../exam-recipes/hooks/usePatientExamRecipes.js";
import { useProductsByType } from "../products/hooks/useProductsByType.js";
import { useMassMessaging } from "../hooks/useMassMessaging.js";
import { useTemplate } from "../hooks/useTemplate.js";
import { formatWhatsAppMessage, getIndicativeByCountry, formatDate } from "../../services/utilidades.js";
import { useAppointmentUpdate } from "./hooks/useAppointmentUpdate.js";
export const RescheduleAppointmentModalV2 = ({
  isOpen,
  onClose,
  appointmentId,
  onSuccess
}) => {
  const [patientName, setPatientName] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);
  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState("");
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([]);
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState([]);
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const [disabledProductIdField, setDisabledProductIdField] = useState(false);
  const {
    userSpecialties
  } = useUserSpecialties();
  const {
    productsByType: products,
    fetchProductsByType
  } = useProductsByType();
  //const { createAppointmentBulk } = useAppointmentBulkCreate();
  const {
    updateAppointment
  } = useAppointmentUpdate();
  const {
    patientExamRecipes,
    setPatientExamRecipes,
    fetchPatientExamRecipes
  } = usePatientExamRecipes();
  const {
    sendMessage: sendMessageAppointments,
    responseMsg,
    loading,
    error
  } = useMassMessaging();
  const tenant = window.location.hostname.split(".")[0];
  const dataTemplate = {
    tenantId: tenant,
    belongsTo: "citas-reagendamiento",
    type: "whatsapp"
  };
  const {
    template,
    setTemplate,
    fetchTemplate
  } = useTemplate(dataTemplate);
  const sendMessageAppointmentsRef = useRef(sendMessageAppointments);
  useEffect(() => {
    sendMessageAppointmentsRef.current = sendMessageAppointments;
  }, [sendMessageAppointments]);
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
      consultation_purpose: "TREATMENT"
    }
  });
  const mapAppointmentToServer = async () => {
    const currentUser = await userService.getLoggedUser();
    const assignedUserAvailabilityId = assignedUserAssistantAvailabilityId || assignedUserAvailability?.id;
    const supervisorUserId = assignedUserAssistantAvailabilityId ? assignedUserAvailability?.id : null;
    return {
      appointment_date: appointmentDate?.toISOString().split("T")[0],
      appointment_time: appointmentTime + ":00",
      assigned_user_availability_id: assignedUserAvailabilityId,
      product_id: getValues("product_id"),
      created_by_user_id: currentUser?.id,
      appointment_state_id: currentAppointment.appointment_state_id,
      attention_type: currentAppointment.attention_type,
      consultation_purpose: getValues("consultation_purpose"),
      consultation_type: getValues("consultation_type"),
      external_cause: getValues("external_cause"),
      assigned_supervisor_user_availability_id: supervisorUserId,
      exam_recipe_id: examRecipeId
    };
  };
  const onSubmit = async e => {
    e.preventDefault();
    const data = await mapAppointmentToServer();
    try {
      await updateAppointment(appointmentId, data);
      await sendMessageWhatsapp(currentAppointment);
      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };
  const sendMessageWhatsapp = useCallback(async appointment => {
    console.log(appointment);
    const replacements = {
      NOMBRE_PACIENTE: `${appointment.patient.first_name} ${appointment.patient.middle_name} ${appointment.patient.last_name} ${appointment.patient.second_last_name}`,
      ESPECIALISTA: `${appointment.user_availability.user.first_name} ${appointment.user_availability.user.middle_name} ${appointment.user_availability.user.last_name} ${appointment.user_availability.user.second_last_name}`,
      ESPECIALIDAD: `${appointment.user_availability.user.specialty.name}`,
      FECHA_CITA: `${formatDate(appointment.appointment_date, true)}`,
      HORA_CITA: `${appointment.appointment_time}`
    };
    try {
      const response = await templateService.getTemplate(dataTemplate);
      const templateFormatted = formatWhatsAppMessage(response.data.template, replacements);
      const dataMessage = {
        channel: "whatsapp",
        message_type: "text",
        recipients: [getIndicativeByCountry(appointment.patient.country_id) + appointment.patient.whatsapp],
        message: templateFormatted,
        webhook_url: "https://example.com/webhook"
      };
      await sendMessageAppointmentsRef.current(dataMessage);
    } catch (error) {
      console.error("Error:", error);
    }
  }, [sendMessageAppointments]);
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
    if (appointmentId) {
      const asyncScope = async () => {
        const appointment = await appointmentService.get(appointmentId);
        const mappedAppointment = {
          ...appointment,
          appointment_date: stringToDate(appointment.appointment_date),
          appointment_time: appointment.appointment_time.substring(0, 5)
        };
        console.log('appointment', appointment);
        console.log('mappedAppointment', mappedAppointment);
        setCurrentAppointment(mappedAppointment);
        setPatientName(`${appointment.patient.first_name} ${appointment.patient.middle_name} ${appointment.patient.last_name} ${appointment.patient.second_last_name}`);
        console.log('userSpecialties', userSpecialties);
        const userSpecialty = userSpecialties.find(userSpecialty => userSpecialty.id === appointment.user_availability.user.specialty.id);
        console.log('user_specialty', appointment.user_availability.user.specialty);
        setValue('patient', appointment.patient);
        setValue('patient_whatsapp', appointment.patient.whatsapp);
        setValue('patient_email', appointment.patient.email);
        setValue('user_specialty', userSpecialty || null);
        setValue('product_id', appointment.product_id);
        setValue('appointment_type', appointment.user_availability.appointment_type_id.toString());
      };
      asyncScope();
    }
  }, [appointmentId]);
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
        updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAvailability.id);
      }
    } else {
      setAssistantAvailabilityOptions([]);
    }
  }, [assignedUserAvailability]);
  useEffect(() => {
    if (assignedUserAssistantAvailabilityId && appointmentDate) {
      updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAssistantAvailabilityId);
    } else if (assignedUserAvailability && appointmentDate) {
      // Si se deselecciona, volver a horas del doctor
      updateTimeSlotsForProfessional(availableBlocks, appointmentDate.toISOString().split("T")[0], assignedUserAvailability.id);
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
    setValue("appointment_date", currentAppointment?.appointment_date || enabledDates.length > 0 ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0] : null);
  }, [enabledDates]);
  useEffect(() => {
    if (appointmentTimeOptions.length > 0 && appointmentDate) {
      const selectedTime = appointmentTimeOptions.length > 0 ? appointmentTimeOptions[0].value : null;
      setValue("appointment_time", currentAppointment?.appointment_time || selectedTime || null);
    }
  }, [appointmentTimeOptions]);
  useEffect(() => {
    fetchProductsByType("Servicios");
  }, []);
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== "required" && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
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

    /*// Seleccionar primer doctor disponible
    //const firstDoctor = uniqueDoctors[0] || null;
    //setValue("assigned_user_availability", firstDoctor);
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
    }*/
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
  const updateTimeSlotsForProfessional = (availableBlocks, dateString, availabilityId) => {
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
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: isOpen,
    onHide: onClose,
    title: `Reagendar cita | ${patientName}`
  }, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true,
    onSubmit: onSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 px-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
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
  }))), getFormErrorMessage("appointment_type")), /*#__PURE__*/React.createElement("div", {
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
      appendTo: "self",
      disabled: appointmentDateDisabled,
      enabledDates: enabledDates,
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
    className: "col-md-6"
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
  }), getFormErrorMessage("product_id")), /*#__PURE__*/React.createElement("div", {
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
      className: classNames("w-100", {
        "p-invalid": errors.consultation_purpose
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("consultation_purpose")))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
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
      className: classNames("w-100", {
        "p-invalid": errors.consultation_type
      }),
      appendTo: "self"
    }, field)))
  }), getFormErrorMessage("consultation_type")), /*#__PURE__*/React.createElement("div", {
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
      className: classNames("w-100"),
      appendTo: "self"
    }, field)))
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-link text-danger px-3 my-0",
    "aria-label": "Close",
    type: "button",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary my-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark"
  }), " Guardar"))));
};