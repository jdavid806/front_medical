function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useRef, useState } from 'react';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { daysOfWeek } from "../../../services/commons.js";
import { Dropdown } from 'primereact/dropdown';
import { useAppointmentTypesForSelect } from "../../appointment-types/hooks/useAppointmentTypesForSelect.js";
import { useBranchesForSelect } from "../../branches/hooks/useBranchesForSelect.js";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { useUsers } from "../../users/hooks/useUsers.js";
import { useModules } from "../../modules/hooks/useModules.js";
const UserAvailabilityForm = ({
  formId,
  onHandleSubmit,
  initialData
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    trigger,
    watch,
    resetField,
    getValues,
    setValue,
    reset
  } = useForm({
    defaultValues: initialData || {
      user_id: '',
      appointment_type_id: '',
      appointment_duration: 0,
      branch_id: '1',
      office: '',
      module_id: '',
      days_of_week: [],
      start_time: null,
      end_time: null,
      free_slots: []
    }
  });
  const onSubmit = data => onHandleSubmit(data);
  const {
    fields,
    append,
    remove,
    update
  } = useFieldArray({
    control,
    name: "free_slots"
  });
  const [selectedUser, setSelectedUser] = useState(undefined);
  const watchUserId = watch('user_id');
  const {
    users
  } = useUsers();
  const [usersForSelect, setUsersForSelect] = useState([]);
  const {
    appointmentTypes
  } = useAppointmentTypesForSelect();
  const {
    branches
  } = useBranchesForSelect();
  const {
    modules
  } = useModules();
  const daysOfWeekOptions = daysOfWeek.map((day, index) => ({
    label: day,
    value: index
  }));
  const stepperRef = useRef(null);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    reset(initialData || {
      user_id: '',
      appointment_type_id: '',
      appointment_duration: 0,
      branch_id: '1',
      office: '',
      module_id: '',
      days_of_week: [],
      start_time: null,
      end_time: null,
      free_slots: []
    });
  }, [initialData, reset]);
  useEffect(() => {
    setUsersForSelect(users.map(user => {
      return {
        value: user.id.toString(),
        label: `${user.first_name || ''} ${user.middle_name || ''} ${user.last_name || ''} ${user.second_last_name || ''}`
      };
    }));
  }, [users]);
  useEffect(() => {
    const subscription = watch((value, {
      name
    }) => {
      if (name === 'start_time' && value.start_time && value.end_time && value.start_time > value.end_time) {
        setValue('end_time', value.start_time);
      } else if (name === 'end_time' && value.start_time && value.end_time && value.end_time < value.start_time) {
        setValue('start_time', value.end_time);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);
  useEffect(() => {
    if (watchUserId) {
      const user = users.find(role => role.id == watchUserId);
      setSelectedUser(user);
      resetField('office');
      resetField('module_id');
    } else {
      setSelectedUser(undefined);
    }
  }, [watchUserId, users]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n general"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "user_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Usuario *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: usersForSelect,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione un usuario",
      className: classNames('w-100', {
        'p-invalid': errors.user_id
      })
    }, field)))
  }), getFormErrorMessage('user_id')), selectedUser && selectedUser.role.group === 'DOCTOR' && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "office",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      className: "form-label"
    }, "Consultorio"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: field.name,
      type: "text",
      className: "w-100",
      placeholder: "Ingrese el consultorio"
    }, field)))
  })), selectedUser && selectedUser.role.group === 'ADMIN' && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "module_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Modulo"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: modules,
      optionLabel: "name",
      optionValue: "id",
      filter: true,
      placeholder: "Seleccione un modulo",
      className: classNames('w-100', {
        'p-invalid': errors.user_id
      })
    }, field)))
  })), selectedUser && selectedUser.role.group === 'DOCTOR' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Tipo de cita *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: appointmentTypes,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione un tipo de cita",
      className: classNames('w-100', {
        'p-invalid': errors.appointment_type_id
      }),
      defaultValue: field.value
    }, field)))
  }), getFormErrorMessage('appointment_type_id')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_duration",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Duraci\xF3n de la cita (minutos)"), /*#__PURE__*/React.createElement(InputNumber, {
      inputId: field.name,
      min: 1,
      placeholder: "Ingrese la duraci\xF3n",
      ref: field.ref,
      value: field.value,
      onBlur: field.onBlur,
      onValueChange: e => field.onChange(e),
      className: "w-100",
      inputClassName: classNames('w-100', {
        'p-invalid': errors.appointment_duration
      })
    }))
  }), getFormErrorMessage('appointment_duration'))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "days_of_week",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "D\xEDas de la semana *"), /*#__PURE__*/React.createElement(MultiSelect, {
      inputId: field.name,
      name: field.name,
      value: field.value,
      placeholder: "Seleccione uno o varios d\xEDas de la semana",
      onChange: e => field.onChange(e.value),
      options: daysOfWeekOptions,
      filter: true,
      className: classNames('w-100 position-relative', {
        'p-invalid': errors.branch_id
      }),
      panelStyle: {
        zIndex: 100000,
        padding: 0
      },
      appendTo: "self"
    }))
  }), getFormErrorMessage('days_of_week')), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary btn-sm",
    type: "button",
    label: "Siguiente",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-right me-1"
    }),
    iconPos: "right",
    onClick: async e => {
      let isValid = await trigger();
      if (!isValid) {
        e.preventDefault();
        return;
      }
      stepperRef.current.nextCallback();
    }
  }))), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Horario"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "start_time",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "start_time",
      className: "form-label"
    }, "Hora de Inicio"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      hourFormat: "24",
      showTime: true,
      timeOnly: true,
      value: field.value,
      onChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('start_time')), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "end_time",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "end_time",
      className: "form-label"
    }, "Hora de Fin"), /*#__PURE__*/React.createElement(Calendar, {
      id: field.name,
      hourFormat: "24",
      showTime: true,
      timeOnly: true,
      value: field.value,
      onChange: e => field.onChange(e.value)
    }))
  }), getFormErrorMessage('end_time'))), /*#__PURE__*/React.createElement("div", {
    className: "card mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "mb-0"
  }, "Espacios Libres")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, fields.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "Puedes agregar espacios libres a continuaci\xF3n.") : fields.map((field, index) => /*#__PURE__*/React.createElement("div", {
    key: field.id,
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Inicio"), /*#__PURE__*/React.createElement(Controller, {
    name: `free_slots.${index}.start_time`,
    control: control,
    rules: {
      required: "Hora de inicio requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, {
      hourFormat: "24",
      showTime: true,
      timeOnly: true,
      value: field.value,
      onChange: e => {
        const newStart = e.value;
        const currentEnd = getValues(`free_slots.${index}.end_time`);

        // Actualiza ambos campos al mismo tiempo
        setValue(`free_slots.${index}.start_time`, newStart);
        if (newStart && currentEnd && newStart > currentEnd) {
          setValue(`free_slots.${index}.end_time`, newStart);
        }
      },
      className: classNames({
        'p-invalid': fieldState.error
      })
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fin"), /*#__PURE__*/React.createElement(Controller, {
    name: `free_slots.${index}.end_time`,
    control: control,
    rules: {
      required: "Hora de fin requerida"
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, {
      hourFormat: "24",
      showTime: true,
      timeOnly: true,
      value: field.value,
      onChange: e => {
        const newEnd = e.value;
        const currentStart = getValues(`free_slots.${index}.start_time`);

        // Actualiza ambos campos al mismo tiempo
        setValue(`free_slots.${index}.end_time`, newEnd);
        if (newEnd && currentStart && newEnd < currentStart) {
          setValue(`free_slots.${index}.start_time`, newEnd);
        }
      },
      className: classNames({
        'p-invalid': fieldState.error
      })
    }), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger align-self-end",
    onClick: () => remove(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt"
  })))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary mt-2",
    onClick: () => append({
      start_time: null,
      end_time: null
    })
  }, "Agregar Espacio Libre"))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex pt-4 justify-content-end gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-secondary btn-sm",
    type: "button",
    label: "Atr\xE1s",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-arrow-left me-1"
    }),
    onClick: () => {
      console.log('yendo patras');
      stepperRef.current.prevCallback();
    }
  }), /*#__PURE__*/React.createElement(Button, {
    className: "btn btn-primary btn-sm",
    label: "Guardar",
    type: "submit",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-save me-1"
    }),
    iconPos: "right"
  }))))));
};
export default UserAvailabilityForm;