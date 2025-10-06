import React, { useState } from "react";
import { Card, Button, Spinner, Alert, Form, ListGroup } from "react-bootstrap";
import { useGenericFilter } from "../hooks/userSearchModel.js";
import { AppointmentForm } from "../components/AppointmentForm.js";
export const PatientSearch = () => {
  const {
    data: patients,
    loading,
    error,
    search
  } = useGenericFilter("Patient");
  const [searchType, setSearchType] = useState("document_number");
  const [searchValue, setSearchValue] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const handleSearch = () => {
    if (!searchValue) return;
    search({
      [`${searchType}__like`]: searchValue
    }, {
      field: "created_at",
      direction: "desc"
    }, 10, 10);
    setSelectedPatient(null);
    setShowAppointmentForm(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm mb-4"
  }, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("h2", {
    className: "text-center text-primary mb-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-user-injured"
  }), " B\xFAsqueda de Pacientes"), /*#__PURE__*/React.createElement("div", {
    className: "row g-2 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement(Form.Group, null, /*#__PURE__*/React.createElement(Form.Label, {
    className: "fw-semibold"
  }, "Buscar por:"), /*#__PURE__*/React.createElement(Form.Select, {
    value: searchType,
    onChange: e => setSearchType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "document_number"
  }, "C\xE9dula"), /*#__PURE__*/React.createElement("option", {
    value: "email"
  }, "Correo"), /*#__PURE__*/React.createElement("option", {
    value: "phone"
  }, "Tel\xE9fono")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement(Form.Group, null, /*#__PURE__*/React.createElement(Form.Label, {
    className: "fw-semibold"
  }, "Valor:"), /*#__PURE__*/React.createElement(Form.Control, {
    type: "text",
    placeholder: `Escribe ${searchType}...`,
    value: searchValue,
    onChange: e => setSearchValue(e.target.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    className: "w-100",
    onClick: handleSearch,
    disabled: loading || !searchValue
  }, loading ? /*#__PURE__*/React.createElement(Spinner, {
    size: "sm",
    animation: "border"
  }) : "Buscar"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, error && /*#__PURE__*/React.createElement(Alert, {
    variant: "danger"
  }, error), patients.length > 0 && /*#__PURE__*/React.createElement(ListGroup, null, patients.map(patient => /*#__PURE__*/React.createElement(ListGroup.Item, {
    key: patient.id,
    action: true,
    onClick: () => {
      setSelectedPatient(patient);
      setShowAppointmentForm(false);
    }
  }, patient.first_name, " ", patient.last_name, " (C\xE9dula:", " ", patient.document_number, ")"))), patients.length === 0 && !loading && searchValue && /*#__PURE__*/React.createElement("p", {
    className: "text-center text-muted"
  }, "No se encontraron pacientes.")))), selectedPatient && /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm mb-4"
  }, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement("h4", {
    className: "fw-bold text-secondary mb-3"
  }, "Informaci\xF3n del Paciente"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-primary"
  }, "Nombre:"), " ", /*#__PURE__*/React.createElement("br", null), selectedPatient.first_name, " ", selectedPatient.last_name)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-light rounded"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "text-primary"
  }, "C\xE9dula:"), " ", /*#__PURE__*/React.createElement("br", null), selectedPatient.document_number))), /*#__PURE__*/React.createElement("div", {
    className: "text-center mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "success",
    size: "lg",
    onClick: () => setShowAppointmentForm(true)
  }, "Agendar Cita"))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, showAppointmentForm && selectedPatient && /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement(Card.Body, null, /*#__PURE__*/React.createElement(AppointmentForm, {
    patient: selectedPatient,
    onSave: data => {
      console.log("Cita guardada:", data);
      setShowAppointmentForm(false);
    },
    onCancel: () => setShowAppointmentForm(false)
  }))))));
};