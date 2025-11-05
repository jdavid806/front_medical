import React, { useEffect, useRef, useState } from "react";
import { useClinicalRecord } from "./hooks/useClinicalRecord";
import { DynamicForm } from "../components/dynamic-form/DynamicForm";
import { Button } from "primereact/button";
import { FinishClinicalRecordReviewModal } from "./FinishClinicalRecordReviewModal";

interface ClinicalRecordReviewProps {
    clinicalRecordId: string;
    requestId: string;
    onSave?: (data: any) => void;
}

export const ClinicalRecordReview = (props: ClinicalRecordReviewProps) => {
    const { clinicalRecordId, requestId, onSave } = props;

    const { getClinicalRecord, clinicalRecord } = useClinicalRecord();

    const [visible, setVisible] = useState(false);
    const [formConfig, setFormConfig] = useState<any | null>(null);

    const dynamicFormRef = useRef<any>(null);
    const finishClinicalRecordModalRef = useRef<any>(null);

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

                setFormConfig(formData.form1)
            } catch (error) {
                console.log(error);
            }
        }
        if (pastMedicalHistory) {
            asyncScope()
        }
    }, [clinicalRecord])

    return (
        <div>
            {formConfig && <>
                <DynamicForm form={formConfig} ref={dynamicFormRef} />
                <Button
                    label="Finalizar consulta"
                    className="mt-4 btn btn-primary"
                    onClick={() => {
                        finishClinicalRecordModalRef.current?.updateExternalDynamicData(dynamicFormRef.current?.getFormValues());
                        setVisible(true)
                    }}
                />
                <FinishClinicalRecordReviewModal
                    ref={finishClinicalRecordModalRef}
                    clinicalRecordId={clinicalRecord?.id}
                    requestId={requestId}
                    initialExternalDynamicData={dynamicFormRef.current?.getFormValues()}
                    visible={visible}
                    onHide={() => setVisible(false)}
                    onSave={onSave}
                />
            </>}
        </div>
    );
}