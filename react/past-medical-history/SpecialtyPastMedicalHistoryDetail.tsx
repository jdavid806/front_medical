import React, { useEffect, useRef, useState } from "react";
import { useCurrentUserPastClinicalRecord } from "./hooks/useCurrentUserPastClinicalRecord";
import { PastMedicalHistoryForm } from "./PastMedicalHistoryForm";
import { DynamicForm } from "../components/dynamic-form/DynamicForm";
import { ProgressSpinner } from "primereact/progressspinner";
import { clinicalRecordService, userService } from "../../services/api";
import { PastMedicalHistoryDetail } from "./PastMedicalHistoryDetail";
import { DynamicFormSummary } from "../components/dynamic-form-summary/DynamicFormSummary";

interface Props {
    patientId: string;
}

export const SpecialtyPastMedicalHistoryDetail: React.FC<Props> = (props) => {

    const { patientId = new URLSearchParams(window.location.search).get("patient_id") } = props;
    const { pastMedicalHistory, loading } = useCurrentUserPastClinicalRecord();

    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [selectedClinicalRecord, setSelectedClinicalRecord] = useState<any | null>(null);
    const [formConfig, setFormConfig] = useState<any | null>(null)

    const dynamicFormRef = useRef<any>(null);

    useEffect(() => {
        const asyncScope = async () => {
            const historyType = pastMedicalHistory?.key_;
            const jsonPath = `./ConsultasJson/${historyType}.json`;

            try {
                const response = await fetch(jsonPath);
                const formData = await response.json();

                setLoadingDetail(true);
                const data = await clinicalRecordService.ofParentByType(
                    historyType,
                    patientId
                );

                if (data.length > 0) {
                    setSelectedClinicalRecord(data[0])
                    formData.form1.values = data[0].data;
                }

                setFormConfig(formData.form1)
            } catch (error) {
                console.log(error);
            } finally {
                setLoadingDetail(false);
            }
        }
        if (pastMedicalHistory) {
            asyncScope()
        }
    }, [pastMedicalHistory])

    const handleGetFormValues = () => {
        if (dynamicFormRef.current) {
            return dynamicFormRef.current.getFormValues();
        }
        return null
    };

    const onSave = async () => {
        const formData = handleGetFormValues();
        const loggedUser = await userService.getLoggedUser();
        const requestData = {
            clinical_record_type_id: pastMedicalHistory.id,
            created_by_user_id: loggedUser.id,
            branch_id: 1,
            data: formData,
        };

        if (selectedClinicalRecord) {
            clinicalRecordService
                .updateForParent(selectedClinicalRecord.id, requestData)
                .then((response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        } else {
            clinicalRecordService
                .createForParent(patientId, requestData)
                .then((response) => {
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }

    return (<>
        {loading || loadingDetail && (
            <div className="d-flex justify-content-center">
                <ProgressSpinner />
            </div>
        )}

        {!loading && !loadingDetail && !selectedClinicalRecord && (<>
            <div className="alert alert-warning" role="alert">
                El paciente no tiene ningun registro de antecedentes. Por favor diligencie el formulario.
            </div>

            {!loading && pastMedicalHistory && (<>
                <DynamicForm
                    ref={dynamicFormRef}
                    form={formConfig}>
                </DynamicForm>

                <div className="modal-footer">
                    <button className="btn btn-primary" onClick={onSave}>
                        Guardar
                    </button>
                </div>
            </>)}

            {!loading && !pastMedicalHistory && (
                <PastMedicalHistoryForm />
            )}
        </>)}

        {!loading && !loadingDetail && selectedClinicalRecord && pastMedicalHistory && (<>
            <DynamicFormSummary
                form={formConfig}>
            </DynamicFormSummary>
        </>)}

        {!loading && !loadingDetail && selectedClinicalRecord && !pastMedicalHistory && (
            <PastMedicalHistoryDetail />
        )}
    </>)
}