function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { AutoComplete } from "primereact/autocomplete";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { RadioButton } from "primereact/radiobutton";
import { Card } from "primereact/card";
import { useAppointmentForm } from "../hooks/useAppointmentForm.js";
export const AppointmentForm = ({
  patient,
  onSave,
  onCancel
}) => {
  const {
    control,
    handleSubmit,
    loadingSpecialties,
    loadingProcedures,
    specialtyOptions,
    doctorOptions,
    procedureOptions,
    selectedSpecialty,
    selectedDoctor,
    setSelectedSpecialty,
    setSelectedDoctor,
    onSubmit
  } = useAppointmentForm(patient, onSave);
  return /*#__PURE__*/React.createElement("form", {
    className: "needs-validation row",
    noValidate: true,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Paciente *"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "patient",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(AutoComplete, _extends({}, field, {
      placeholder: "Seleccione un paciente",
      field: "label",
      className: "w-100"
    }))
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-primary ms-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Whatsapp *"), /*#__PURE__*/React.createElement(Controller, {
    name: "patient_whatsapp",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Email"), /*#__PURE__*/React.createElement(Controller, {
    name: "patient_email",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      className: "w-100"
    }))
  })))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 px-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-7"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Especialidad m\xE9dica *"), /*#__PURE__*/React.createElement(Controller, {
    name: "user_specialty",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      className: "w-100",
      placeholder: "Seleccione una especialidad",
      options: specialtyOptions,
      loading: loadingSpecialties,
      optionLabel: "label",
      optionValue: "value",
      onChange: e => {
        field.onChange(e.value);
        setSelectedSpecialty(e.value);
        setSelectedDoctor(null);
      }
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Doctor(a) *"), /*#__PURE__*/React.createElement(Controller, {
    name: "assigned_user",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      className: "w-100",
      placeholder: selectedSpecialty ? "Seleccione un doctor" : "Primero seleccione una especialidad",
      options: doctorOptions,
      optionLabel: "label",
      optionValue: "value",
      disabled: !selectedSpecialty,
      value: selectedDoctor,
      onChange: e => {
        field.onChange(e.value);
        setSelectedDoctor(e.value);
      }
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label mb-2"
  }, "Tipo de cita *"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-wrap gap-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_type",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RadioButton, {
      inputId: "appointmentType1",
      value: "1",
      onChange: e => field.onChange(e.value),
      checked: field.value === "1"
    }), /*#__PURE__*/React.createElement("label", {
      htmlFor: "appointmentType1",
      className: "form-check-label"
    }, "Presencial"))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de la consulta *"), /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_date",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      className: "w-100",
      placeholder: "Seleccione una fecha"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Hora de la consulta *"), /*#__PURE__*/React.createElement(Controller, {
    name: "appointment_time",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      className: "w-100",
      placeholder: "Seleccione una hora",
      timeOnly: true,
      showIcon: true,
      hourFormat: "24",
      stepMinute: 1
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Procedimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "product_id",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      className: "w-100",
      placeholder: "Seleccione un procedimiento",
      options: procedureOptions,
      loading: loadingProcedures,
      optionLabel: "label",
      optionValue: "value"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-link text-danger px-3 my-0",
    onClick: onCancel
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-arrow-left"
  }), " Cerrar"), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary my-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-bookmark"
  }), " Guardar"))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("h5", null, "Citas programadas"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "Aqu\xED ir\xE1 el listado de citas"))))));
};