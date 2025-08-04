import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { usePatientExamRecipes } from '../exam-recipes/hooks/usePatientExamRecipes';
import { useEffect } from 'react';
import { Nullable } from 'primereact/ts-helpers';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';

export type ExamRecipeResultFormInputs = {
    date: Nullable<Date>;
    exam_recipe_id: string | null;
    comment: string | undefined;
    uploaded_by_user_id: string | undefined;
    result_minio_url?: string | undefined;
}

interface AddParaclinicalFormProps {
    formId: string;
    onHandleSubmit: (data: ExamRecipeResultFormInputs) => void;
    patientId?: string;
}

export interface AddParaclinicalFormHandle {
    trigger: () => Promise<boolean>;
    getValues: () => ExamRecipeResultFormInputs;
}

export const AddParaclinicalForm = forwardRef<AddParaclinicalFormHandle, AddParaclinicalFormProps>(({
    patientId = new URLSearchParams(window.location.search).get('patient_id'),
    formId,
    onHandleSubmit
}, ref) => {

    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const { control, handleSubmit, trigger, getValues, formState: { errors } } = useForm<ExamRecipeResultFormInputs>();
    const onSubmit: SubmitHandler<ExamRecipeResultFormInputs> = (data) => onHandleSubmit(data);

    const { patientExamRecipes, fetchPatientExamRecipes } = usePatientExamRecipes();

    useImperativeHandle(ref, () => ({
        trigger,
        getValues,
    }));

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

    useEffect(() => {
        if (!patientId) {
            console.error('No se encontró el ID del paciente en la URL.');
            return;
        }
        fetchPatientExamRecipes(patientId);
    }, []);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFormErrorMessage = (name: keyof ExamRecipeResultFormInputs) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const previewFile = () => {
        if (!file) return;
        const fileUrl = URL.createObjectURL(file);
        window.open(fileUrl, '_blank');
        setTimeout(() => URL.revokeObjectURL(fileUrl), 600000);
    };

    const handleTakePhoto = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
            toggleCameraElements(true);
        } catch (error) {
            console.error("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara. Por favor verifica los permisos.");
        }
    };

    const handleCapturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (!blob || !fileInputRef.current) return;

            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            const url = URL.createObjectURL(file);
            handleFileChange(file);

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;

            stopCamera();
            toggleCameraElements(false);
        }, "image/jpeg", 0.95);
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    const toggleCameraElements = (showCamera: boolean) => {
        const cameraParent = document.getElementById("camera")?.parentElement;
        const takePhotoBtn = document.getElementById("takePhoto");
        const capturePhotoBtn = document.getElementById("capturePhoto");

        if (showCamera) {
            cameraParent?.classList.remove("d-none");
            takePhotoBtn?.classList.add("d-none");
            capturePhotoBtn?.classList.remove("d-none");
        } else {
            cameraParent?.classList.add("d-none");
            takePhotoBtn?.classList.remove("d-none");
            capturePhotoBtn?.classList.add("d-none");
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    return (
        <div>
            <form id={formId} className="needs-validation" noValidate onSubmit={handleSubmit(onSubmit)}>
                {/* Campo de Fecha */}
                <div className="mb-3">
                    <Controller
                        name='date'
                        control={control}
                        rules={{ required: 'Este campo es requerido' }}
                        render={({ field }) => (
                            <>
                                <label htmlFor={field.name} className="form-label">Fecha *</label>
                                <Calendar
                                    id={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    className={classNames('w-100', { 'p-invalid': errors.date })}
                                    appendTo={'self'}
                                    placeholder="Seleccione una fecha"
                                    showIcon
                                    dateFormat="dd/mm/yy"
                                />
                            </>
                        )}
                    />
                    {getFormErrorMessage('date')}
                </div>

                {/* Campo de Receta de Examen */}
                <div className="mb-3">
                    <Controller
                        name='exam_recipe_id'
                        control={control}
                        rules={{ required: 'Seleccione una receta de examen' }}
                        render={({ field }) => (
                            <>
                                <label htmlFor={field.name} className="form-label">Receta de examen *</label>
                                <Dropdown
                                    inputId={field.name}
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    options={patientExamRecipes}
                                    optionLabel="label"
                                    optionValue="id"
                                    filter
                                    showClear
                                    placeholder="Seleccione una receta de examen"
                                    className={classNames('w-100', { 'p-invalid': errors.exam_recipe_id })}
                                    appendTo={'self'}
                                />
                            </>
                        )}
                    />
                    {getFormErrorMessage('exam_recipe_id')}
                </div>

                {/* Campo de Comentarios */}
                <div className="mb-3">
                    <Controller
                        name='comment'
                        control={control}
                        render={({ field }) => (
                            <>
                                <label htmlFor={field.name} className="form-label">Comentarios (opcional)</label>
                                <InputTextarea
                                    id={field.name}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    autoResize
                                    rows={5}
                                    cols={30}
                                    className="w-100"
                                />
                            </>
                        )}
                    />
                </div>

                {/* Sección de Adjuntar Archivos */}
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

                {/* Previsualización de Archivo/Imagen */}
                <div className="position-relative d-flex justify-content-center mb-3">
                    {fileUrl && (
                        <div className="profile-img-container">
                            <img
                                id="profilePreview"
                                src={fileUrl}
                                alt="Previsualización"
                                style={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    height: "auto",
                                    maxHeight: "300px",
                                    border: "2px solid #ddd",
                                    borderRadius: "8px"
                                }}
                            />
                        </div>
                    )}
                    <div className="video-container d-none">
                        <video
                            id="camera"
                            ref={videoRef}
                            autoPlay
                            playsInline
                            style={{
                                width: "100%",
                                maxWidth: "300px",
                                height: "auto",
                                border: "2px solid #ddd",
                                borderRadius: "8px"
                            }}
                        ></video>
                    </div>
                </div>

                {/* Controles de Cámara */}
                <div className="mt-3 d-flex flex-column justify-content-center gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary"
                        id="takePhoto"
                        onClick={handleTakePhoto}
                    >
                        <i className="fa-solid fa-camera me-2"></i> Tomar Foto
                    </button>
                    <button
                        type="button"
                        className="btn btn-success d-none"
                        id="capturePhoto"
                        onClick={handleCapturePhoto}
                    >
                        <i className="fa-solid fa-check me-2"></i> Capturar Foto
                    </button>

                    <canvas ref={canvasRef} style={{ display: "none" }} />
                </div>
            </form>
        </div>
    );
});