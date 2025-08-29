import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useClinicalRecord } from "../clinical-records/hooks/useClinicalRecord.js";
export const SendClinicalRecordMessagesHookWrapper = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    clinicalRecordId
  } = props;
  const {
    getClinicalRecord,
    clinicalRecord
  } = useClinicalRecord();
  const sendClinicalRecordMessages = () => {
    getClinicalRecord(clinicalRecordId);
  };
  useEffect(() => {
    sendClinicalRecordMessages();
  }, [clinicalRecordId]);
  useEffect(() => {
    console.log(clinicalRecord);
  }, [clinicalRecord]);
  useImperativeHandle(ref, () => ({
    sendClinicalRecordMessages
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "d-none"
  });
});