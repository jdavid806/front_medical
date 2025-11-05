import React, { useEffect, useRef, useState } from "react";
import { useCurrentUserPastClinicalRecord } from "./hooks/useCurrentUserPastClinicalRecord.js";
import { PastMedicalHistoryForm } from "./PastMedicalHistoryForm.js";
import { DynamicForm } from "../components/dynamic-form/DynamicForm.js";
import { ProgressSpinner } from "primereact/progressspinner";
import { clinicalRecordService, userService } from "../../services/api/index.js";
import { PastMedicalHistoryDetail } from "./PastMedicalHistoryDetail.js";
import { DynamicFormSummary } from "../components/dynamic-form-summary/DynamicFormSummary.js";
export const SpecialtyPastMedicalHistoryDetail = props => {
  const {
    patientId = new URLSearchParams(window.location.search).get("patient_id")
  } = props;
  const {
    pastMedicalHistory,
    loading
  } = useCurrentUserPastClinicalRecord();
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedClinicalRecord, setSelectedClinicalRecord] = useState(null);
  const [formConfig, setFormConfig] = useState(null);
  const dynamicFormRef = useRef(null);
  useEffect(() => {
    const asyncScope = async () => {
      const historyType = pastMedicalHistory?.key_;
      const jsonPath = `./ConsultasJson/${historyType}.json`;
      try {
        const response = await fetch(jsonPath);
        const formData = await response.json();
        setLoadingDetail(true);
        const data = await clinicalRecordService.ofParentByType(historyType, patientId);
        if (data.length > 0) {
          setSelectedClinicalRecord(data[0]);
          formData.form1.values = data[0].data;
        }
        setFormConfig(formData.form1);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingDetail(false);
      }
    };
    if (pastMedicalHistory) {
      asyncScope();
    }
  }, [pastMedicalHistory]);
  const handleGetFormValues = () => {
    if (dynamicFormRef.current) {
      return dynamicFormRef.current.getFormValues();
    }
    return null;
  };
  const onSave = async () => {
    const formData = handleGetFormValues();
    const loggedUser = await userService.getLoggedUser();
    const requestData = {
      clinical_record_type_id: pastMedicalHistory.id,
      created_by_user_id: loggedUser.id,
      branch_id: 1,
      data: formData
    };
    if (selectedClinicalRecord) {
      clinicalRecordService.updateForParent(selectedClinicalRecord.id, requestData).then(response => {
        window.location.reload();
      }).catch(error => {
        console.error("Error:", error);
      });
    } else {
      clinicalRecordService.createForParent(patientId, requestData).then(response => {
        window.location.reload();
      }).catch(error => {
        console.error("Error:", error);
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, loading || loadingDetail && /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)), !loading && !loadingDetail && !selectedClinicalRecord && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning",
    role: "alert"
  }, "El paciente no tiene ningun registro de antecedentes. Por favor diligencie el formulario."), !loading && pastMedicalHistory && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicForm, {
    ref: dynamicFormRef,
    form: formConfig
  }), /*#__PURE__*/React.createElement("div", {
    className: "modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: onSave
  }, "Guardar"))), !loading && !pastMedicalHistory && /*#__PURE__*/React.createElement(PastMedicalHistoryForm, null)), !loading && !loadingDetail && selectedClinicalRecord && pastMedicalHistory && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicFormSummary, {
    form: formConfig
  })), !loading && !loadingDetail && selectedClinicalRecord && !pastMedicalHistory && /*#__PURE__*/React.createElement(PastMedicalHistoryDetail, null));
};