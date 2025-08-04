import { useForm, useWatch } from 'react-hook-form';
import { useState } from 'react';
import { useUserSpecialties } from "../../user-specialties/hooks/useUserSpecialties.js";
import { useEffect } from 'react';
import { patientService, userAvailabilityService, userService } from "../../../services/api/index.js";
import { stringToDate } from "../../../services/utilidades.js";
import { useProductsByType } from "../../products/hooks/useProductsByType.js";
import { useAppointmentBulkCreate } from "./useAppointmentBulkCreate.js";
import { useValidateBulkAppointments } from "./useValidateBulkAppointments.js";
import { usePatientExamRecipes } from "../../exam-recipes/hooks/usePatientExamRecipes.js";
export const useAppointmentFormLogic = ({
  isOpen,
  onClose
}) => {
  const [appointments, setAppointments] = useState([]);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [showUserSpecialtyError, setShowUserSpecialtyError] = useState(false);
  const [userSpecialtyError, setUserSpecialtyError] = useState('');
  const [showRecurrentFields, setShowRecurrentFields] = useState(false);
  const [appointmentFrequency, setAppointmentFrequency] = useState('diary');
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
    validateBulkAppointments
  } = useValidateBulkAppointments();
  const {
    patientExamRecipes,
    setPatientExamRecipes,
    fetchPatientExamRecipes
  } = usePatientExamRecipes();
  const {
    control,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      uuid: '',
      appointment_date: null,
      appointment_time: '',
      assigned_user_availability: null,
      appointment_type: '1',
      consultation_type: 'FOLLOW_UP',
      external_cause: 'NOT_APPLICABLE',
      consultation_purpose: 'TREATMENT'
    }
  });

  // Watchers
  const userSpecialty = useWatch({
    control,
    name: 'user_specialty'
  });
  const showExamRecipeField = useWatch({
    control,
    name: 'show_exam_recipe_field'
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
  const patient = useWatch({
    control,
    name: 'patient'
  });
  const assignedUserAvailability = useWatch({
    control,
    name: 'assigned_user_availability'
  });
  const examRecipeId = useWatch({
    control,
    name: 'exam_recipe_id'
  });

  // Efecto para cargar productos al iniciar
  useEffect(() => {
    fetchProductsByType('Servicios');
  }, []);

  // Efecto para manejar cambios en la especialidad
  useEffect(() => {
    if (userSpecialty) {
      setShowUserSpecialtyError(false);
      setValue('appointment_date', null);
      setAppointmentTimeOptions([]);
      setUserAvailabilityOptions([]);
      const fetchAvailableBlocks = async () => {
        try {
          const availableBlocks = await userAvailabilityService.availableBlocks({
            user_specialty_id: userSpecialty?.id
          });
          setAvailableBlocks(availableBlocks);
          if (availableBlocks.length > 0) {
            // Calcular fechas habilitadas
            const dates = new Set();
            availableBlocks.forEach(item => {
              item.days.forEach(day => {
                dates.add(day.date);
              });
            });
            const enabledDates = Array.from(dates).map(date => stringToDate(date));
            setEnabledDates(enabledDates);
          } else {
            setShowUserSpecialtyError(true);
            setUserSpecialtyError(userSpecialty?.label);
            setEnabledDates([]);
          }
        } catch (error) {
          console.error('Error fetching available blocks:', error);
        }
      };
      fetchAvailableBlocks();
    } else {
      setShowUserSpecialtyError(false);
      setValue('appointment_date', null);
      setValue('appointment_time', '');
      setValue('assigned_user_availability', null);
      setAvailableBlocks([]);
      setEnabledDates([]);
      setAppointmentTimeOptions([]);
      setUserAvailabilityOptions([]);
    }
  }, [userSpecialty]);

  // Efecto para manejar cambios en la fecha seleccionada
  useEffect(() => {
    if (appointmentDate && availableBlocks.length > 0) {
      const dateString = appointmentDate.toISOString().split('T')[0];
      const availableUsers = new Map();
      availableBlocks.forEach(item => {
        item.days.forEach(day => {
          if (day.date === dateString) {
            availableUsers.set(item.user.id, {
              ...item.user,
              availability_id: item.availability_id,
              appointment_duration: item.appointment_duration,
              blocks: day.blocks
            });
          }
        });
      });
      const userOptions = Array.from(availableUsers.values()).map(user => ({
        ...user,
        id: user.availability_id,
        label: `${user.first_name} ${user.last_name}`,
        value: user.availability_id,
        full_name: `${user.first_name} ${user.middle_name || ''} ${user.last_name} ${user.second_last_name || ''}`
      }));
      setUserAvailabilityOptions(userOptions);
      setValue('assigned_user_availability', currentAppointment?.assigned_user_availability || userOptions[0] || null);
      setValue('appointment_time', null);
      setAppointmentTimeOptions([]);
    }
  }, [appointmentDate, availableBlocks]);

  // Efecto para manejar cambios en el usuario seleccionado
  useEffect(() => {
    if (assignedUserAvailability && appointmentDate) {
      const dateString = appointmentDate.toISOString().split('T')[0];

      // Encontrar los bloques del usuario seleccionado
      const userBlocks = availableBlocks.find(block => block.availability_id === assignedUserAvailability.id)?.days.find(day => day.date === dateString)?.blocks || [];

      // Generar opciones de tiempo
      let timeOptions = [];
      userBlocks.forEach(block => {
        const slots = computeTimeSlots(block.start_time, block.end_time, assignedUserAvailability.appointment_duration);
        timeOptions = timeOptions.concat(slots.map(time => ({
          label: time,
          value: time
        })));
      });

      // Ordenar y filtrar horas
      timeOptions.sort((a, b) => a.value.localeCompare(b.value));
      const now = new Date();
      if (appointmentDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        timeOptions = timeOptions.filter(option => option.value >= currentTime);
      }
      setAppointmentTimeOptions(timeOptions);
      setValue('appointment_time', currentAppointment?.appointment_time || timeOptions[0]?.value || null);
    }
  }, [assignedUserAvailability, appointmentDate]);

  // Efecto para manejar asistentes cuando se selecciona un usuario
  useEffect(() => {
    if (assignedUserAvailability) {
      const currentAvailableUserIds = userAvailabilityOptions.map(availability => availability.user.id);
      const assistants = assignedUserAvailability.user.assistants.filter(assistant => currentAvailableUserIds.includes(assistant.id)).map(assistant => ({
        id: assistant.id,
        label: `${assistant.first_name} ${assistant.middle_name} ${assistant.last_name} ${assistant.second_last_name}`,
        value: assistant.id
      }));
      setAssistantAvailabilityOptions(assistants);
      setValue('assigned_user_assistant_availability_id', currentAppointment?.assigned_user_assistant_availability_id || null);
    } else {
      setAssistantAvailabilityOptions([]);
      setValue('assigned_user_assistant_availability_id', null);
    }
  }, [assignedUserAvailability]);

  // Efecto para manejar recetas de examen
  useEffect(() => {
    if (patient) {
      fetchPatientExamRecipes(patient.id?.toString());
    } else {
      setPatientExamRecipes([]);
    }
  }, [patient?.id]);

  // Efecto para manejar campo de producto cuando hay receta de examen
  useEffect(() => {
    if (examRecipeId) {
      const laboratory = products.find(product => product.attention_type === "LABORATORY");
      setValue('product_id', laboratory?.id);
      setDisabledProductIdField(true);
    } else {
      setValue('product_id', null);
      setDisabledProductIdField(false);
    }
  }, [examRecipeId]);

  // Efecto para validar formulario
  useEffect(() => {
    setFormValid(appointments.length > 0 && !!patient);
  }, [appointments, patient]);

  // Función para calcular franjas horarias
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

  // Función para mapear citas al formato del servidor
  const mapAppointmentsToServer = async appointments => {
    const currentUser = await userService.getLoggedUser();
    return appointments.map(app => {
      const assignedUserAvailability = app.assigned_user_assistant_availability_id || app.assigned_user_availability?.id;
      const supervisorUserId = app.assigned_user_assistant_availability_id ? app.assigned_user_availability?.id : null;
      return {
        "appointment_date": app.appointment_date?.toISOString().split('T')[0],
        "appointment_time": app.appointment_time + ":00",
        "assigned_user_availability_id": assignedUserAvailability,
        "product_id": app.product_id,
        "created_by_user_id": currentUser?.id,
        "appointment_state_id": 1,
        "attention_type": "CONSULTATION",
        "consultation_purpose": app.consultation_purpose,
        "consultation_type": app.consultation_type,
        "external_cause": app.external_cause,
        "assigned_supervisor_user_availability_id": supervisorUserId,
        "exam_recipe_id": app.exam_recipe_id
      };
    });
  };

  // Función para agregar citas
  const addAppointments = async data => {
    if (editingId && appointments.find(app => app.uuid === editingId)) {
      setAppointments(appointments.map(app => app.uuid === editingId ? {
        ...app,
        ...data
      } : app));
      setEditingId(null);
      clearAppointmentForm();
    } else {
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

          // Calcular siguiente fecha según frecuencia
          switch (appointmentFrequency) {
            case 'diary':
              currentDate.setDate(currentDate.getDate() + 1);
              break;
            case 'weekly':
              currentDate.setDate(currentDate.getDate() + 7);
              break;
            case 'monthly':
              currentDate.setMonth(currentDate.getMonth() + 1);
              break;
            case 'bimestral':
              currentDate.setMonth(currentDate.getMonth() + 2);
              break;
            case 'semestral':
              currentDate.setMonth(currentDate.getMonth() + 6);
              break;
            case 'annual':
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

  // Función para validar citas
  const validateAppointments = async _appointments => {
    const mappedAppointments = await mapAppointmentsToServer(_appointments);
    try {
      await validateBulkAppointments(mappedAppointments, patient?.id?.toString() || '');
      return _appointments.map(appointment => ({
        ...appointment,
        errors: {}
      }));
    } catch (error) {
      if (error.response?.status === 422) {
        const errorData = error.data?.errors || {};
        return _appointments.map((appointment, index) => ({
          ...appointment,
          errors: errorData[index.toString()] || {}
        }));
      }
      return _appointments;
    }
  };

  // Función para enviar el formulario
  const onSubmit = async e => {
    e.preventDefault();
    const data = await mapAppointmentsToServer(appointments);
    try {
      await createAppointmentBulk({
        appointments: data
      }, patient.id?.toString());
      setTimeout(() => {
        location.reload();
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  // Funciones auxiliares
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
    setValue('user_specialty', appointment.user_specialty);
    setValue('show_exam_recipe_field', appointment.show_exam_recipe_field);
    setValue('exam_recipe_id', appointment.exam_recipe_id);
    setValue('appointment_type', appointment.appointment_type);
    setValue('product_id', appointment.product_id);
    setValue('consultation_purpose', appointment.consultation_purpose);
    setValue('consultation_type', appointment.consultation_type);
    setValue('external_cause', appointment.external_cause);
    setShowRecurrentFields(false);
    setAppointmentFrequency('diary');
    setAppointmentRepetitions(1);
  };
  const clearAppointmentForm = () => {
    setValue('user_specialty', null);
    setValue('show_exam_recipe_field', false);
    setValue('exam_recipe_id', null);
    setValue('appointment_type', '1');
    setValue('appointment_date', null);
    setValue('appointment_time', null);
    setValue('assigned_user_availability', null);
    setValue('product_id', null);
    setValue('consultation_purpose', null);
    setValue('consultation_type', null);
    setValue('external_cause', null);
    setShowRecurrentFields(false);
    setAppointmentFrequency('diary');
    setAppointmentRepetitions(1);
    setEditingId(null);
  };

  // Función para buscar pacientes
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

  // Función para obtener información del profesional
  const getProfessional = app => {
    const assignedUserAvailability = app.assigned_user_assistant_availability_id || app.assigned_user_availability?.id;
    return userAvailabilityOptions.find(userAvailability => userAvailability.id === assignedUserAvailability);
  };

  // Función para obtener mensajes de error
  const getFormErrorMessage = name => {
    return errors[name] && errors[name].type !== 'required' && errors[name].message;
  };

  // Función para verificar si hay errores de validación
  const hasValidationErrors = () => {
    return appointments.some(appointment => Object.keys(appointment.errors).length > 0);
  };
  return {
    // State
    appointments,
    setAppointments,
    editingId,
    formValid,
    showUserSpecialtyError,
    userSpecialtyError,
    showRecurrentFields,
    appointmentFrequency,
    appointmentRepetitions,
    appointmentTimeOptions,
    userAvailabilityOptions,
    assistantAvailabilityOptions,
    enabledDates,
    patients,
    disabledProductIdField,
    userSpecialties,
    products,
    patientExamRecipes,
    errors,
    currentAppointment,
    // Handlers
    handleSubmit,
    addAppointments,
    onSubmit,
    handleRemove,
    handleEdit,
    handleClear,
    handleCopy,
    searchPatients,
    getProfessional,
    getFormErrorMessage,
    hasValidationErrors,
    validateAppointments,
    // Setters
    setShowRecurrentFields,
    setAppointmentFrequency,
    setAppointmentRepetitions,
    // Form control
    control,
    setValue
  };
};