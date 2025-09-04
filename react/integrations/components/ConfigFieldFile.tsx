import React, { useEffect } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { useFileInput } from "../hooks/useFileInput";

export const ConfigFieldFile = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onFileChange } = props;

    const { fileUrl, setFileUrl, fileInputRef, handleFileChange: handleFileChangeInput, previewFile } = useFileInput();

    useEffect(() => {
        if (initialValue) {
            setFileUrl(initialValue);
        }
    }, [initialValue]);

    const handleFileChange = (newFile: File | null) => {
        handleFileChangeInput(newFile);
        onFileChange?.({ field, file: newFile });
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <div className="d-flex flex-fill">
                <input
                    className="form-control"
                    type="file"
                    id="addParaclinicalFormFile"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.p12"
                    onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
                    ref={fileInputRef}
                />
                {fileUrl && (
                    <div className="d-flex">
                        <button
                            className="btn btn-primary ms-2"
                            type='button'
                            onClick={previewFile}
                            disabled={!fileUrl}
                        >
                            <i className="fas fa-eye"></i> Previsualizar
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
