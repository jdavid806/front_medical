import React, { useEffect, useState } from 'react';
import { patientService } from '../../services/api/index.js';
export const PatientEvolution = () => {
  const [evolution, setEvolution] = useState([]);
  const patientId = new URLSearchParams(window.location.search).get('id') || new URLSearchParams(window.location.search).get('patient_id');
  useEffect(() => {
    const fetchEvolution = async () => {
      const data = await patientService.evolution(patientId);
      setEvolution(data);
    };
    fetchEvolution();
  }, [patientId]);
  return /*#__PURE__*/React.createElement("div", {
    className: "timeline",
    id: "patient-evolution-container"
  }, evolution.map((item, index) => /*#__PURE__*/React.createElement("div", {
    className: "timeline-item align-items-start",
    key: index
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-md-3 align-items-start mb-8 mb-lg-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-auto d-flex"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-item-date text-end order-1 order-md-0 me-md-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "fs-10 fw-semibold text-body-tertiary mb-0"
  }, new Date(item.created_at).toLocaleDateString(), /*#__PURE__*/React.createElement("br", {
    className: "d-none d-md-block"
  }), new Date(item.created_at).toLocaleTimeString())), /*#__PURE__*/React.createElement("div", {
    className: "timeline-item-bar position-relative me-3 me-md-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "icon-item icon-item-sm bg-success",
    "data-bs-theme": "light"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fa-solid fa-check text-white fs-10"
  })), /*#__PURE__*/React.createElement("span", {
    className: "timeline-bar border-end border-success"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "timeline-item-content text-start ps-6 ps-md-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-start"
  }, item.title), /*#__PURE__*/React.createElement("p", {
    className: "fs-9 text-body-secondary mb-0",
    style: {
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, item.content)))))));
};
export default PatientEvolution;