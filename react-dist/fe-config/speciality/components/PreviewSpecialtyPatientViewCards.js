import React, { useEffect, useState } from "react";
import { useLoadUserPatientViewCards } from "../hooks/useLoadUserPatientViewCards.js";
export const PreviewSpecialtyPatientViewCards = props => {
  const {
    patientId,
    disableRedirects = false,
    availableCardsIds,
    userId
  } = props;
  const {
    patientViewCards,
    fetchUserPatientViewCards
  } = useLoadUserPatientViewCards();
  const [finalAvailableCardsIds, setFinalAvailableCardsIds] = useState();
  useEffect(() => {
    if (availableCardsIds) {
      setFinalAvailableCardsIds(availableCardsIds);
    }
  }, [availableCardsIds]);
  useEffect(() => {
    if (userId) {
      setFinalAvailableCardsIds(patientViewCards);
    }
  }, [patientViewCards]);
  useEffect(() => {
    fetchUserPatientViewCards();
  }, [userId]);
  const cards = [{
    "id": "consulta",
    "icono": "fas fa-address-book",
    "titulo": "Consultas medicas",
    "texto": "Revisa o crea historias médicas",
    "url": "consulta?patient_id=" + patientId
  }, {
    "id": "citas",
    "icono": "calendar-days",
    "titulo": "Citas",
    "texto": "Agenda una nueva cita o revisa todas las citas agendadas a este paciente",
    "url": "verCitas?patient_id=" + patientId
  }, {
    "id": "llamar-paciente",
    "icono": "fas fa-address-book",
    "titulo": "Llamar al paciente",
    "texto": "Revisa o crea historias médicas",
    "url": "llamar_paciente"
  }, {
    "id": "ordenes-medicas",
    "icono": "file-circle-plus",
    "titulo": "Ordenes médicas",
    "texto": "Revisa todos los exámenes clínicos recetados a este paciente",
    "url": "verExamenes?patient_id=" + patientId
  }, {
    "id": "ordenes-laboratorio",
    "icono": "fas fa-microscope",
    "titulo": "Laboratorio",
    "texto": "Revisa todos los exámenes de laboratorio ordenados a este paciente",
    "url": "verOrdenesExamenes?patient_id=" + patientId
  }, {
    "id": "recetas",
    "icono": "kit-medical",
    "titulo": "Recetas médicas",
    "texto": "Genera y revisa todas las recetas médicas para este paciente",
    "url": "verRecetas?patient_id=" + patientId
  }, {
    "id": "recetas-optometria",
    "icono": "kit-medical",
    "titulo": "Recetas Optometría",
    "texto": "Genera y revisa todas las recetas médicas de optometría para este paciente",
    "url": "verRecetasOptometria?patient_id=" + patientId + "&especialidad=Optometria"
  }, {
    "id": "incapacidades",
    "icono": "wheelchair",
    "titulo": "Incapacidades clínicas",
    "texto": "Consulta todas las incapacidades clínicas para este paciente",
    "url": "verIncapacidades?patient_id=" + patientId
  }, {
    "id": "antecedentes",
    "icono": "hospital",
    "titulo": "Antecedentes personales",
    "texto": "Revisa todos los antecedentes personales registrados para este paciente",
    "url": "verAntecedentes?patient_id=" + patientId
  }, {
    "id": "consentimientos",
    "icono": "book-medical",
    "titulo": "Consentimientos",
    "texto": "Genera y revisa todos los consentimientos y certificados registrados para este paciente",
    "url": "verConcentimientos?patient_id=" + patientId
  }, {
    "id": "presupuestos",
    "icono": "file-invoice-dollar",
    "titulo": "Presupuestos",
    "texto": "Genera y revisa todos los presupuestos elaborados para este paciente",
    "url": "registros-presupuestos?patient_id=" + patientId
  }, {
    "id": "esquema-vacunacion",
    "icono": "syringe",
    "titulo": "Esquema de vacunación",
    "texto": "Revisa el esquema de vacunación o genera un nuevo esquema",
    "url": "esquemaVacunacion?patient_id=" + patientId
  }, {
    "id": "notas-enfermeria",
    "icono": "fas fa-user-nurse",
    "titulo": "Notas de Enfermeria",
    "texto": "Revisa las notas de enfermeria del paciente",
    "url": "enfermeria?patient_id=" + patientId
  }, {
    "id": "evoluciones",
    "icono": "fas fa-external-link-alt",
    "titulo": "Evoluciones",
    "texto": "Revisa la evoluciones del paciente",
    "url": "evoluciones?patient_id=" + patientId
  }, {
    "id": "remisiones",
    "icono": "fas fa-retweet",
    "titulo": "Remisiones",
    "texto": "Revisa la remisiones del paciente",
    "url": "remisiones?patient_id=" + patientId
  }, {
    "id": "preadmisiones",
    "icono": "far fa-address-book",
    "titulo": "Preadmisiones",
    "texto": "Revisa las preadmisiones del paciente",
    "url": "preadmisiones?patient_id=" + patientId
  }];
  const handleCardClick = card => {
    switch (card.id) {
      case "llamar-paciente":
        console.log("Llamar paciente");
        break;
      default:
        window.location.href = card.url;
        break;
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "row row-cols-1 row-cols-sm-2 row-cols-xl-3 row-cols-xxl-4 g-3 mb-3 mt-2"
  }, cards.filter(card => finalAvailableCardsIds?.includes(card.id)).map(card => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card text-center",
    style: {
      maxWidth: "15rem",
      minHeight: "15em"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex flex-column justify-content-between align-items-center h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fas fa-${card.icono} fa-2x`
  })), /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, card.titulo), /*#__PURE__*/React.createElement("p", {
    className: "card-text fs-9 text-center"
  }, card.texto), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary btn-icon mt-auto btn-tab",
    onClick: handleCardClick,
    disabled: disableRedirects
  }, /*#__PURE__*/React.createElement("span", {
    className: "fa-solid fa-chevron-right"
  })))))))));
};