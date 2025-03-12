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
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { useUsers } from "../../users/hooks/useUsers.js";
const UserAvailabilityForm = ({
  formId,
  onHandleSubmit
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    trigger,
    watch
  } = useForm();
  const onSubmit = data => onHandleSubmit(data);
  const [office, setOffice] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [selectedUserObject, setSelectedUserObject] = useState(undefined);
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
  const daysOfWeekOptions = daysOfWeek.map((day, index) => ({
    label: day,
    value: index
  }));
  const stepperRef = useRef(null);
  const handleAddFreeSlot = () => {
    setFreeSlots([...freeSlots, {
      start: new Date(),
      end: new Date()
    }]);
  };
  const handleSlotChange = (index, field, value) => {
    const updatedFreeSlots = [...freeSlots];
    updatedFreeSlots[index][field] = value;
    setFreeSlots(updatedFreeSlots);
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    const {
      unsubscribe
    } = watch(value => {
      console.log(value);
      console.log(users);
      if (value.user_id) {
        const user = users.find(user => user.id.toString() == value.user_id);
        setSelectedUserObject(user);
        console.log(user);
      }
    });
    return () => unsubscribe();
  }, [watch]);
  useEffect(() => {
    setUsersForSelect(users.map(user => {
      return {
        value: user.id.toString(),
        label: user.first_name + ' ' + user.last_name
      };
    }));
  }, [users]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
    id: formId,
    className: "needs-validation",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Informaci\xF3n general xd ho"
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
  }), getFormErrorMessage('user_id')), /*#__PURE__*/React.createElement("div", {
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
      className: "form-label"
    }, "Consultorio *"), /*#__PURE__*/React.createElement(InputText, {
      className: "w-100",
      type: "text",
      id: "office",
      value: office,
      onChange: e => setOffice(e.target.value),
      placeholder: "Ingrese el consultorio"
    }))
  }), getFormErrorMessage('user_id')), /*#__PURE__*/React.createElement("div", {
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
  }), getFormErrorMessage('appointment_duration')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "branch_id",
    control: control,
    rules: {
      required: 'Este campo es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: field.name,
      className: "form-label"
    }, "Sucursal *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      inputId: field.name,
      options: branches,
      optionLabel: "label",
      optionValue: "value",
      filter: true,
      placeholder: "Seleccione una sucursal",
      className: classNames('w-100', {
        'p-invalid': errors.branch_id
      }),
      defaultValue: field.value
    }, field)))
  }), getFormErrorMessage('branch_id')), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "days_of_week",
    className: "form-label"
  }, "D\xEDas de la semana ", /*#__PURE__*/React.createElement("span", {
    className: "text-primary"
  }, "*")), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "days_of_week",
    name: "days_of_week",
    value: selectedDays,
    placeholder: "Seleccione uno o varios d\xEDas de la semana",
    onChange: e => setSelectedDays(e.value),
    options: daysOfWeekOptions,
    filter: true,
    className: "w-100 position-relative",
    panelStyle: {
      zIndex: 100000,
      padding: 0
    },
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "start_time",
    className: "form-label"
  }, "Hora de Inicio"), /*#__PURE__*/React.createElement(Calendar, {
    id: "start_time",
    hourFormat: "24",
    showTime: true,
    timeOnly: true,
    value: startTime,
    onChange: e => setStartTime(e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "end_time",
    className: "form-label"
  }, "Hora de Fin"), /*#__PURE__*/React.createElement(Calendar, {
    id: "end_time",
    hourFormat: "24",
    showTime: true,
    timeOnly: true,
    value: endTime,
    onChange: e => setEndTime(e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "mb-0"
  }, "Espacios Libres")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, freeSlots.length === 0 ? /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "Puedes agregar espacios libres a continuaci\xF3n.") : freeSlots.map((slot, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: `start_${index}`,
    className: "form-label"
  }, "Inicio"), /*#__PURE__*/React.createElement(Calendar, {
    id: `start_${index}`,
    hourFormat: "24",
    showTime: true,
    timeOnly: true,
    value: slot.start,
    onChange: e => handleSlotChange(index, 'start', e.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1 gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: `end_${index}`,
    className: "form-label"
  }, "Fin"), /*#__PURE__*/React.createElement(Calendar, {
    id: `end_${index}`,
    hourFormat: "24",
    showTime: true,
    timeOnly: true,
    value: slot.end,
    onChange: e => handleSlotChange(index, 'end', e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger align-self-end",
    onClick: () => setFreeSlots(freeSlots.filter((_, i) => i !== index))
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash-alt"
  })))))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary mt-2",
    onClick: handleAddFreeSlot
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