import React, { useEffect, useState } from 'react';
import { ExamTable } from "./components/ExamTable.js";
import { ExamForm } from "./components/ExamForm.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { useExams } from "./hooks/useExams.js";
const ExamApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const {
    exams,
    fetchExams
  } = useExams(patientId);
  useEffect(() => {
    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    if (patientId) {
      setPatientId(patientId);
    }
  }, []);
  const handleHideFormModal = () => {
    setShowFormModal(false);
  };
  const handleLoadExamResults = examTableItem => {
    window.location.href = `cargarResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}&appointment_id=${examTableItem.appointmentId}`;
  };
  let sum = 0;
  const handleViewExamResults = async (examTableItem, minioUrl) => {
    if (minioUrl) {
      //@ts-ignore
      const url = await getUrlImage(minioUrl);
      window.open(url, '_blank');
    } else {
      window.location.href = `verResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}`;
    }
  };
  const handleReload = () => {
    fetchExams(patientId);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Ex\xE1menes"))))), /*#__PURE__*/React.createElement(ExamTable, {
    exams: exams,
    onLoadExamResults: handleLoadExamResults,
    onViewExamResults: handleViewExamResults,
    onReload: handleReload
  }), /*#__PURE__*/React.createElement(CustomFormModal, {
    formId: 'createExam',
    show: showFormModal,
    onHide: handleHideFormModal,
    title: "Crear Ex\xE1menes"
  }, /*#__PURE__*/React.createElement(ExamForm, null)));
};
export default ExamApp;