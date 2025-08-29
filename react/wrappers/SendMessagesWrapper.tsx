import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { useClinicalRecord } from "../clinical-records/hooks/useClinicalRecord";

interface SendClinicalRecordMessagesHookWrapperProps {
    clinicalRecordId: number;

}

export const SendClinicalRecordMessagesHookWrapper: React.FC<SendClinicalRecordMessagesHookWrapperProps> = forwardRef((props, ref) => {
    const { clinicalRecordId } = props;

    const { getClinicalRecord, clinicalRecord } = useClinicalRecord();

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

    return (
        <div className="d-none"></div>
    );
});