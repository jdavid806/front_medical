import React, { useEffect, useState } from 'react';
import { ExamTable } from "./components/ExamTable.js";
import { ExamForm } from "./components/ExamForm.js";
import { CustomModal } from "../components/CustomModal.js";
import { CustomFormModal } from "../components/CustomFormModal.js";
import { useExams } from "./hooks/useExams.js";
import { ExamResultsForm } from "./components/ExamResultsForm.js";
import { SwalManager } from "../../services/alertManagerImported.js";
const ExamApp = () => {
  const [showFormModal, setShowFormModal] = useState(false);
  const [showResultsFormModal, setShowResultsFormModal] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
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
  const handleHideResultsFormModal = () => {
    setShowResultsFormModal(false);
  };
  const handleSave = exams => {
    console.log(exams);
    setShowFormModal(false);
  };
  const handleLoadExamResults = examId => {
    console.log(examId);
    setSelectedExamId(examId);
    setShowResultsFormModal(true);
  };
  const handleViewExamResults = async minioId => {
    if (minioId) {
      //@ts-ignore
      const url = await getFileUrl(minioId);
      console.log('Archivo URL: ', url);
      window.open(url, '_blank');
    } else {
      SwalManager.error({
        text: 'No se pudo obtener la URL del archivo'
      });
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
  }, /*#__PURE__*/React.createElement(ExamForm, null)), /*#__PURE__*/React.createElement(CustomModal, {
    show: showResultsFormModal,
    onHide: handleHideResultsFormModal,
    title: "Cargar Resultados"
  }, /*#__PURE__*/React.createElement(ExamResultsForm, {
    examId: selectedExamId
  })));
};
export default ExamApp;