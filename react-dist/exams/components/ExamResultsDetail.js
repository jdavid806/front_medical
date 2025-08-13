import React, { useEffect, useRef, useState } from 'react';
import { useExam } from "../hooks/useExam.js";
import { DynamicForm } from "../../components/dynamic-form/DynamicForm.js";
export const ExamResultsDetail = ({
  examId
}) => {
  const {
    exam,
    fetchExam
  } = useExam();
  const [formConfig, setFormConfig] = useState();
  const [examName, setExamName] = useState('Cargando...');
  const dynamicFormRef = useRef(null);
  useEffect(() => {
    fetchExam(examId);
  }, [examId]);
  useEffect(() => {
    if (exam) {
      setExamName(exam?.exam_type?.name || 'Ver resultados de examen');
      const result = exam?.exam_result?.results || {};
      const defaultForm = exam?.exam_type?.form_config.values || {};
      const filledForm = {
        ...defaultForm
      };
      for (const key in result) {
        if (result.hasOwnProperty(key) && filledForm.hasOwnProperty(key)) {
          filledForm[key] = result[key];
        }
      }
      if (filledForm) {
        exam.exam_type.form_config.values = exam.exam_result[0].results;
        setFormConfig(exam?.exam_type?.form_config);
      }
    }
  }, [exam]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", null, examName), /*#__PURE__*/React.createElement(DynamicForm, {
    ref: dynamicFormRef,
    form: formConfig
  }));
};