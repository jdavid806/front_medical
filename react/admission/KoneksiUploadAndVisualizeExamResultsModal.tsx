import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispensedClaim } from "../koneksi/hooks/useDispensedClaim";
import { useAdmission } from "./hooks/useAdmission";
import { useSupportingDocumentsPolicy } from "../koneksi/hooks/useSupportingDocumentsPolicy";
import { useViewDocument } from "../koneksi/hooks/useViewDocument";
import { useAddFilesToPreauthorization } from "../koneksi/hooks/useAddFilesToPreauthorization";

interface KoneksiUploadAndVisualizeExamResultsModalProps {
    admissionId: string
}

interface KoneksiUploadAndVisualizeExamResultsModalFormInputs {
    document_type: string | null;
}

export const KoneksiUploadAndVisualizeExamResultsModal: React.FC<KoneksiUploadAndVisualizeExamResultsModalProps> = ({
    admissionId
}) => {

    const { admission, fetchAdmission } = useAdmission();
    const { dispensedClaim, dispensedClaimFiles, fetchDispensedClaim } = useDispensedClaim();
    const { supportingDocuments, fetchSupportingDocumentsPolicy } = useSupportingDocumentsPolicy();
    const { viewDocumentPDF } = useViewDocument();
    const { addFilesToPreauthorization } = useAddFilesToPreauthorization();

    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const {
        control,
        register,
        reset,
        handleSubmit,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<KoneksiUploadAndVisualizeExamResultsModalFormInputs>({
        defaultValues: {
            document_type: null,
        },
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchAdmission(admissionId);
    }, []);

    useEffect(() => {
        if (admission) {
            fetchDispensedClaim(admission.koneksi_claim_id);
        }
    }, [admission]);

    useEffect(() => {
        if (dispensedClaim) {
            fetchSupportingDocumentsPolicy({
                preauthorizationId: dispensedClaim.authorization_id
            });
        }
    }, [dispensedClaim]);

    useEffect(() => {
    }, [supportingDocuments]);

    const getFormErrorMessage = (name: keyof KoneksiUploadAndVisualizeExamResultsModalFormInputs) => {
        return (
            errors[name] &&
            errors[name].type !== "required" && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const handleFileChange = (newFile: File | null) => {
        setFile(newFile);
        if (fileUrl) {
            URL.revokeObjectURL(fileUrl);
            setFileUrl(null);
        }
        if (newFile) {
            setFileUrl(URL.createObjectURL(newFile));
        }
    };

    const previewFile = () => {
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
    };

    const onSubmit = async (data: KoneksiUploadAndVisualizeExamResultsModalFormInputs) => {
        if (data.document_type && file) {
            const formData = new FormData();

            formData.append('file', file);

            try {
                const response = await addFilesToPreauthorization(dispensedClaim.authorization_request_id, formData, {
                    authorization_id: dispensedClaim.authorization_id,
                    document_type_slug: data.document_type,
                    coverage: dispensedClaim.transaction_type,
                    product_type: dispensedClaim.product_type
                });

                fetchSupportingDocumentsPolicy({
                    preauthorizationId: dispensedClaim.authorization_id
                });
            } catch (error) {
            }
        }
    };

    return <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
                <Controller
                    name="document_type"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Tipo de archivo
                            </label>
                            <Dropdown
                                options={supportingDocuments}
                                optionLabel="fallback_name"
                                optionValue="slug"
                                placeholder="Seleccione un tipo de archivo"
                                className={classNames("w-100", {
                                    "p-invalid": errors.document_type,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("document_type")}
            </div>
            <div className="mb-3">
                <label htmlFor="addParaclinicalFormFile" className="form-label">Adjuntar resultados de exámenes</label>
                <div className="d-flex">
                    <div className="d-flex flex-fill">
                        <input
                            className="form-control"
                            type="file"
                            id="addParaclinicalFormFile"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                            ref={fileInputRef}
                        />
                        {file && (
                            <div className="d-flex">
                                <button
                                    className="btn btn-primary ms-2"
                                    type='button'
                                    onClick={previewFile}
                                    disabled={!file}
                                >
                                    <i className="fas fa-eye"></i> Previsualizar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <small className="text-muted">Formatos aceptados: PDF, JPG, PNG, DOC, XLS</small>
            </div>
            <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">Cargar archivo</button>
            </div>
        </form>
        <hr />
        <h4 className="mb-3">Archivos cargados</h4>
        <div className="d-flex flex-wrap">
            {dispensedClaimFiles.map(file => (
                <div key={file.id} className="d-flex justify-content-between align-items-center w-100 mb-2">
                    <span>{file.fallback_name}</span>
                    <button type="button" className="btn btn-secondary btn-sm"
                        onClick={() => viewDocumentPDF(file.id)}
                    >
                        <i className="fas fa-eye"></i>
                    </button>
                </div>
            ))}
        </div>
    </>
};