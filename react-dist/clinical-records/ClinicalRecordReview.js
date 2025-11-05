import React, { useEffect, useRef, useState } from "react";
import { useClinicalRecord } from "./hooks/useClinicalRecord.js";
import { DynamicForm } from "../components/dynamic-form/DynamicForm.js";
import { Button } from "primereact/button";
import { FinishClinicalRecordReviewModal } from "./FinishClinicalRecordReviewModal.js";
export const ClinicalRecordReview = props => {
  const {
    clinicalRecordId,
    requestId,
    onSave
  } = props;
  const {
    getClinicalRecord,
    clinicalRecord
  } = useClinicalRecord();
  const [visible, setVisible] = useState(false);
  const [formConfig, setFormConfig] = useState(null);
  const dynamicFormRef = useRef(null);
  const finishClinicalRecordModalRef = useRef(null);
  useEffect(() => {
    getClinicalRecord(+clinicalRecordId);
  }, [clinicalRecordId]);
  useEffect(() => {
    const pastMedicalHistory = clinicalRecord?.clinical_record_type;
    const asyncScope = async () => {
      const historyType = pastMedicalHistory?.key_;
      const jsonPath = `./ConsultasJson/${historyType}.json`;
      try {
        const response = await fetch(jsonPath);
        const formData = await response.json();
        formData.form1.values = clinicalRecord?.data.values;
        setFormConfig(formData.form1);
      } catch (error) {
        console.log(error);
      }
    };
    if (pastMedicalHistory) {
      asyncScope();
    }
  }, [clinicalRecord]);
  return /*#__PURE__*/React.createElement("div", null, formConfig && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicForm, {
    form: formConfig,
    ref: dynamicFormRef
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Finalizar consulta",
    className: "mt-4 btn btn-primary",
    onClick: () => {
      finishClinicalRecordModalRef.current?.updateExternalDynamicData(dynamicFormRef.current?.getFormValues());
      setVisible(true);
    }
  }), /*#__PURE__*/React.createElement(FinishClinicalRecordReviewModal, {
    ref: finishClinicalRecordModalRef,
    clinicalRecordId: clinicalRecord?.id,
    requestId: requestId,
    initialExternalDynamicData: dynamicFormRef.current?.getFormValues(),
    visible: visible,
    onHide: () => setVisible(false),
    onSave: onSave
  })));
};