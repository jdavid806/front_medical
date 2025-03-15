import React, { useEffect, useRef, useState } from 'react';
import { useExam } from "../hooks/useExam.js";
import { DynamicForm } from "../../components/dynamic-form/DynamicForm.js";
export const ExamResultsForm = ({
  examId,
  handleSave
}) => {
  const {
    exam,
    fetchExam
  } = useExam();
  const [formConfig, setFormConfig] = useState();
  const dynamicFormRef = useRef(null);
  useEffect(() => {
    fetchExam(examId);
  }, [examId]);
  useEffect(() => {
    setFormConfig(exam?.exam_type?.form_config);
  }, [exam]);
  const handleGetFormValues = () => {
    if (dynamicFormRef.current) {
      console.log(dynamicFormRef.current.getFormValues());
      return dynamicFormRef.current.getFormValues();
    }
    return null;
  };
  const onSave = () => {
    handleSave?.(handleGetFormValues());
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicForm, {
    ref: dynamicFormRef,
    form: formConfig
  }), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onSave
  }, "Guardar")));
};