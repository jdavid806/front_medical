import React, { useState } from 'react';
import { ExamForm } from "./components/ExamForm.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { useExamsGeneral } from "./hooks/useExamsGeneral.js";
import { ExamGeneralTable } from "./components/ExamGeneralTable.js";
const ExamGeneralApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const {
    exams,
    fetchExams
  } = useExamsGeneral();
  const handleHideFormModal = () => {
    setShowFormModal(false);
  };
  const handleLoadExamResults = examTableItem => {
    window.location.href = `cargarResultadosExamen?patient_id=${examTableItem.patientId}&exam_id=${examTableItem.id}&appointment_id=${examTableItem.appointmentId}`;
  };
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
    fetchExams();
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Ex\xE1menes"))))), /*#__PURE__*/React.createElement(ExamGeneralTable, {
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
export default ExamGeneralApp;