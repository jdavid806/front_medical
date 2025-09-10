function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef, useImperativeHandle } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { userAvailabilityService, userService } from "../../services/api/index.js";
import { stringToDate } from "../../services/utilidades.js";
import { useUserSpecialties } from "../user-specialties/hooks/useUserSpecialties.js";
import { generarFormato } from "../../funciones/funcionesJS/generarPDF.js";
export const LeavingConsultationAppointmentForm = /*#__PURE__*/forwardRef(({
  patientId,
  userSpecialtyId,
  userId
}, ref) => {
  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([]);
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState([]);
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState("");
  const {
    userSpecialties
  } = useUserSpecialties();
  useImperativeHandle(ref, () => ({
    mapAppointmentToServer: () => mapAppointmentToServer()
  }));
  const {
    control,
    setValue,
    formState: {
      errors,
      isValid
    }
  } = useForm({
    defaultValues: {
      user_specialty: null,
      appointment_date: null,
      appointment_time: "",
      assigned_user_availability: null,
      assigned_user_assistant_availability_id: null
    }
  });
  const mapAppointmentToServer = async () => {
    const currentUser = await userService.getLoggedUser();
    const assignedUserAvailabilityId = assignedUserAssistantAvailabilityId || assignedUserAvailability?.id;
    const supervisorUserId = assignedUserAssistantAvailabilityId ? assignedUserAvailability?.id : null;
    const data = {
      appointment_date: appointmentDate?.toISOString().split("T")[0],
      appointment_time: appointmentTime + ":00",
      assigned_user_availability_id: assignedUserAvailabilityId,
      created_by_user_id: currentUser?.id,
      assigned_supervisor_user_availability_id: supervisorUserId
    };
    console.log(data);
    return data;
  };
  const userSpecialty = useWatch({
    control,
    name: "user_specialty"
  });
  const appointmentDate = useWatch({
    control,
    name: "appointment_date"
  });
  const appointmentTime = useWatch({
    control,
    name: "appointment_time"
  });
  const assignedUserAvailability = useWatch({
    control,
    name: "assigned_user_availability"
  });
  const assignedUserAssistantAvailabilityId = useWatch({
    control,
    name: "assigned_user_assistant_availability_id"
  });
  useEffect(() => {
    if (userSpecialtyId && userSpecialties.length > 0) {
      const userSpecialty = userSpecialties.find(userSpecialty => userSpecialty.id == userSpecialtyId);
      setValue('user_specialty', userSpecialty || null);
    }
  }, [userSpecialties, userSpecialtyId]);
  useEffect(() => {
    if (!userSpecialty) {
      setShowUserSpecialtyError(false);
      setAppointmentDateDisabled(true);
      setAppointmentTimeDisabled(true);
      setUserAvailabilityDisabled(true);
      setValue("appointment_date", null);
      setValue("appointment_time", "");
      setValue("assigned_user_availability", null);
      return;
    }
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
        setUserSpecialtyError(userSpecialty?.label || "");
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
    if (!enabledDates.length) return;
    setValue("appointment_date", enabledDates.length > 0 ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0] : null);
  }, [enabledDates]);
  useEffect(() => {
    if (appointmentTimeOptions.length > 0 && appointmentDate) {
      const selectedTime = appointmentTimeOptions.length > 0 ? appointmentTimeOptions[0].value : null;
      setValue("appointment_time", selectedTime || null);
    }
  }, [appointmentTimeOptions]);
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
  const printAppointment = () => {
    // 
    generarFormato("Cita", {
      fechaConsulta: appointmentDate?.toISOString().split("T")[0],
      horaConsulta: appointmentTime,
      patientId: patientId
    }, "Impresion");
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true
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
  }), getFormErrorMessage("user_specialty")), showUserSpecialtyError && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, "No hay especialistas de: ", /*#__PURE__*/React.createElement("span", null, userSpecialtyError), " ", "disponibles en este momento"), /*#__PURE__*/React.createElement("div", {
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
  }), getFormErrorMessage("appointment_time")))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, isValid && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-secondary",
    type: "button",
    onClick: printAppointment
  }, /*#__PURE__*/React.createElement("span", {
    className: "fa fa-print me-2"
  }), " Imprimir Cita")));
});