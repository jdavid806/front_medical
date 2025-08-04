function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { CustomModal } from "../components/CustomModal.js";
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { appointmentService, userAvailabilityService } from "../../services/api/index.js";
import { RadioButton } from 'primereact/radiobutton';
import { stringToDate } from "../../services/utilidades.js";
import { InputText } from 'primereact/inputtext';
export const RescheduleAppointmentModal = ({
  isOpen,
  onClose,
  appointmentId
}) => {
  const [patientName, setPatientName] = useState('');
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentDateDisabled, setAppointmentDateDisabled] = useState(true);
  const [appointmentTimeDisabled, setAppointmentTimeDisabled] = useState(true);
  const [userAvailabilityDisabled, setUserAvailabilityDisabled] = useState(true);
  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState('');
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState([]);
  const [userAvailabilityOptions, setUserAvailabilityOptions] = useState([]);
  const [assistantAvailabilityOptions, setAssistantAvailabilityOptions] = useState([]);
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [enabledDates, setEnabledDates] = useState([]);
  const {
    control,
    register,
    reset,
    handleSubmit,
    setValue,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      appointment_date: null,
      appointment_time: null,
      assigned_user_availability_id: null,
      appointment_type: '1'
    }
  });
  const onSubmit = async data => {
    console.log(data);
  };
  const userSpecialty = useWatch({
    control,
    name: 'user_specialty'
  });
  const appointmentDate = useWatch({
    control,
    name: 'appointment_date'
  });
  const appointmentTime = useWatch({
    control,
    name: 'appointment_time'
  });
  const appointmentType = useWatch({
    control,
    name: 'appointment_type'
  });
  const assignedUserAvailabilityId = useWatch({
    control,
    name: 'assigned_user_availability_id'
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
        setValue('patient_whatsapp', appointment.patient.whatsapp);
        setValue('patient_email', appointment.patient.email);
        setValue('user_specialty', appointment.user_availability.user.specialty);
        setValue('appointment_type', appointment.user_availability.appointment_type_id.toString());
      };
      asyncScope();
    }
  }, [appointmentId]);
  useEffect(() => {
    if (userSpecialty) {
      setShowUserSpecialtyError(false);
      setValue('appointment_date', null);
      setAppointmentTimeOptions([]);
      const asyncScope = async () => {
        const availableBlocks = await userAvailabilityService.availableBlocks({
          user_specialty_id: userSpecialty?.id
        });
        console.log('availableBlocks', availableBlocks);
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
      setValue('appointment_date', null);
      setValue('appointment_time', '');
      setValue('assigned_user_availability_id', null);
      setAvailableBlocks([]);
      setEnabledDates([]);
      setAppointmentTimeOptions([]);
      setUserAvailabilityOptions([]);
    }
  }, [userSpecialty]);
  useEffect(() => {
    if (appointmentDate) {
      updateAppointmentTimeOptions(availableBlocks, appointmentDate);
    }
  }, [appointmentDate]);
  useEffect(() => {
    if (appointmentTime && appointmentDate) {
      filterDoctors(availableBlocks, appointmentDate.toISOString().split('T')[0], appointmentTime, appointmentType);
    }
  }, [appointmentTime]);
  useEffect(() => {
    if (appointmentType && appointmentDate && appointmentTime) {
      filterDoctors(availableBlocks, appointmentDate.toISOString().split('T')[0], appointmentTime, appointmentType);
    }
  }, [appointmentType]);
  useEffect(() => {
    if (assignedUserAvailabilityId) {
      const currentAvailableUserIds = userAvailabilityOptions.map(availability => availability.user.id);
      const assignedUserAvailability = userAvailabilityOptions.find(availability => availability.id == assignedUserAvailabilityId);
      const userAssistantAvailabilities = assignedUserAvailability.user.assistants.map(assistant => {
        if (!currentAvailableUserIds.includes(assistant.id)) {
          return null;
        }
        return {
          id: assistant.id,
          label: `${assistant.first_name} ${assistant.middle_name} ${assistant.last_name} ${assistant.second_last_name}`,
          value: assistant.id
        };
      }).filter(assistant => assistant !== null);
      if (userAssistantAvailabilities.length > 0) {
        setAssistantAvailabilityOptions(userAssistantAvailabilities);
        setValue('assigned_user_assistant_availability_id', userAssistantAvailabilities.find(availability => availability.user.id == currentAppointment?.assigned_user_availability_id) ? currentAppointment?.assigned_user_availability_id : null);
      } else {
        setAssistantAvailabilityOptions([]);
        setValue('assigned_user_assistant_availability_id', null);
      }
    } else {
      setAssistantAvailabilityOptions([]);
      setValue('assigned_user_assistant_availability_id', null);
    }
  }, [assignedUserAvailabilityId]);
  useEffect(() => {
    if (!enabledDates.length) return;
    setValue('appointment_date', enabledDates.find(date => date.getTime() == new Date(currentAppointment?.appointment_date).getTime()) ? currentAppointment?.appointment_date : enabledDates.length > 0 ? enabledDates.sort((a, b) => a.getTime() - b.getTime())[0] : null);
  }, [enabledDates]);
  useEffect(() => {
    if (appointmentTimeOptions.length > 0 && appointmentDate) {
      const selectedTime = appointmentTimeOptions.find(time => time.value == currentAppointment?.appointment_time) ? currentAppointment?.appointment_time : appointmentTimeOptions.length > 0 ? appointmentTimeOptions[0].value : null;
      setValue('appointment_time', selectedTime);
      filterDoctors(availableBlocks, appointmentDate?.toISOString().split('T')[0], selectedTime);
    }
  }, [appointmentTimeOptions]);
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== 'required' && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const computeTimeSlots = (start, end, duration) => {
    const slots = [];
    let current = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    while (current.getTime() + duration * 60000 <= endTime.getTime()) {
      const hours = current.getHours().toString().padStart(2, '0');
      const minutes = current.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
      current = new Date(current.getTime() + duration * 60000);
    }
    return slots;
  };
  function filterDoctors(availableBlocks, selectedDate, selectedTime, appointmentType = '1') {
    const selectedTimeDate = new Date(`1970-01-01T${selectedTime}`);
    let availableAvailabilities = [];
    let filteredAvailableBlocks = availableBlocks.filter(item => item.appointment_type.id == appointmentType);
    filteredAvailableBlocks.forEach(item => {
      item.days.forEach(day => {
        if (day.date === selectedDate) {
          day.blocks.forEach(block => {
            const blockStart = new Date(`1970-01-01T${block.start_time}`);
            const blockEnd = new Date(`1970-01-01T${block.end_time}`);
            if (selectedTimeDate >= blockStart && selectedTimeDate < blockEnd) {
              availableAvailabilities.push(item);
            }
          });
        }
      });
    });
    const uniqueAvailabilities = [];
    const seenIds = new Set();
    availableAvailabilities.forEach(avail => {
      if (!seenIds.has(avail.availability_id)) {
        seenIds.add(avail.availability_id);
        uniqueAvailabilities.push(avail);
      }
    });
    const doctorOptions = uniqueAvailabilities.map(avail => ({
      ...avail,
      id: avail.availability_id,
      full_name: `${avail.user.first_name || ''} ${avail.user.middle_name || ''} ${avail.user.last_name || ''} ${avail.user.second_last_name || ''}`
    }));
    setUserAvailabilityOptions(doctorOptions);
    const currentUserAvailabilityId = currentAppointment?.assigned_supervisor_user_availability_id || currentAppointment?.assigned_user_availability_id || null;
    setValue('assigned_user_availability_id', doctorOptions.find(item => item.id == currentUserAvailabilityId) ? currentUserAvailabilityId : doctorOptions[0]?.id || null);
  }
  const updateAppointmentTimeOptions = (availableBlocks, date) => {
    const dateString = date.toISOString().split('T')[0];
    setAppointmentTimeOptions([]);
    let blocks = [];
    availableBlocks.forEach(item => {
      item.days.forEach(day => {
        if (day.date === dateString) {
          day.blocks.forEach(block => {
            blocks.push({
              start: block.start_time,
              end: block.end_time,
              duration: item.appointment_duration,
              user: item.user,
              availability_id: item.availability_id
            });
          });
        }
      });
    });
    let options = [];
    blocks.forEach(block => {
      const slots = computeTimeSlots(block.start, block.end, block.duration);
      options = options.concat(slots.map(slot => ({
        time: slot,
        availability_id: block.availability_id,
        user: block.user
      })));
    });
    let uniqueOptions = [];
    const seenTimes = new Set();
    options.forEach(option => {
      if (!seenTimes.has(option.time)) {
        seenTimes.add(option.time);
        uniqueOptions.push(option);
      }
    });
    uniqueOptions.sort((a, b) => a.time.localeCompare(b.time));
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    if (appointmentDate?.toISOString().split('T')[0] === todayDate) {
      uniqueOptions = uniqueOptions.filter(opcion => opcion.time >= currentTime);
    }
    setAppointmentTimeOptions(uniqueOptions.map(opcion => ({
      label: opcion.time,
      value: opcion.time
    })));
  };
  return /*#__PURE__*/React.createElement(CustomModal, {
    show: isOpen,
    onHide: onClose,
    title: `Reagendar cita | ${patientName}`
  }, /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient_whatsapp",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Whatsapp *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      className: classNames('w-100', {
        'p-invalid': errors.patient_whatsapp
      })
    }, field)))
  }), getFormErrorMessage('patient_whatsapp')), /*#__PURE__*/React.createElement("div", {
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
      className: classNames('w-100', {
        'p-invalid': errors.patient_email
      })
    }, field)))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 px-3 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, showUserSpecialtyError && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger",
    role: "alert"
  }, "No hay especialistas de: ", /*#__PURE__*/React.createElement("span", null, userSpecialtyError), " disponibles en este momento"), /*#__PURE__*/React.createElement("div", {
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
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + '1',
      checked: appointmentType == '1',
      className: classNames('', {
        'p-invalid': errors.appointment_type
      }),
      value: "1",
      onChange: e => field.onChange(e.value)
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + '1',
      className: "ml-2 form-check-label"
    }, "Presencial"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + '3',
      checked: appointmentType == '3',
      className: classNames('', {
        'p-invalid': errors.appointment_type
      }),
      onChange: e => field.onChange(e.value),
      value: "3"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + '3',
      className: "ml-2 form-check-label"
    }, "Domiciliaria"))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: field.name + '2',
      checked: appointmentType == '2',
      className: classNames('', {
        'p-invalid': errors.appointment_type
      }),
      onChange: e => field.onChange(e.value),
      value: "2"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name + '2',
      className: "ml-2 form-check-label"
    }, "Virtual"))
  }))), getFormErrorMessage('appointment_type')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_date",
    control: control,
    rules: {
      required: 'Este campo es requerido'
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
      className: classNames('w-100', {
        'p-invalid': errors.appointment_date
      }),
      appendTo: 'self',
      disabled: appointmentDateDisabled,
      enabledDates: enabledDates,
      placeholder: "Seleccione una fecha"
    }))
  }), getFormErrorMessage('appointment_date')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_time",
    control: control,
    rules: {
      required: 'Este campo es requerido'
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
      className: classNames('w-100', {
        'p-invalid': errors.appointment_time
      }),
      appendTo: 'self',
      disabled: appointmentTimeDisabled
    }, field)))
  }), getFormErrorMessage('appointment_time')))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "assigned_user_availability_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
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
      optionValue: "id",
      filter: true,
      placeholder: "Seleccione un usuario",
      className: classNames('w-100', {
        'p-invalid': errors.assigned_user_availability_id
      }),
      appendTo: 'self',
      disabled: userAvailabilityDisabled
    }, field)))
  }), getFormErrorMessage('assigned_user_availability_id')), assistantAvailabilityOptions.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
      optionLabel: "label",
      optionValue: "id",
      filter: true,
      showClear: true,
      placeholder: "Seleccione un asistente",
      className: classNames('w-100', {
        'p-invalid': errors.assigned_user_assistant_availability_id
      }),
      appendTo: 'self',
      disabled: userAvailabilityDisabled
    }, field)))
  })))))), /*#__PURE__*/React.createElement("div", {
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