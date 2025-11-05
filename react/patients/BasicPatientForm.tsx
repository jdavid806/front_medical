import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Controller, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";

import { Toast } from "primereact/toast";
import { Nullable } from "primereact/ts-helpers";
import { patientService } from "../../services/api";
import { usePRToast } from "../hooks/usePRToast";
import { documentTypeOptions, genderOptions, civilStatusOptions, ethnicityOptions, bloodTypeOptions } from "./consts";

interface BasicPatientFormInputs {
    first_name: string;
    last_name: string;
    middle_name: string;
    second_last_name: string;
    document_type: string;
    document_number: string;
    gender: string;
    date_of_birth: Nullable<Date>;
    whatsapp: string;
    email: string;
    civil_status: string;
    ethnicity: string;
    blood_type: string;
}

interface BasicPatientFormData {
    patient: {
        first_name: string;
        last_name: string;
        middle_name: string;
        second_last_name: string;
        document_type: string;
        document_number: string;
        gender: string;
        date_of_birth: string;
        whatsapp: string;
        email: string;
        civil_status: string;
        ethnicity: string;
        blood_type: string;
    }
}

interface BasicPatientFormProps {
    visible: boolean;
    onHide: () => void;
    onSuccess?: () => void;
}

export const BasicPatientForm: React.FC<BasicPatientFormProps> = (props: BasicPatientFormProps) => {

    const { visible, onHide, onSuccess } = props;

    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<BasicPatientFormInputs>({
        defaultValues: {
            document_type: "",
            document_number: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            second_last_name: "",
            gender: "",
            date_of_birth: null,
            whatsapp: "",
            email: "",
            civil_status: "",
            ethnicity: "",
            blood_type: "",
        },
    });

    const onSubmit = async (data: BasicPatientFormInputs) => {
        try {

            const finalData: BasicPatientFormData = {
                patient: {
                    first_name: data.first_name.toUpperCase(),
                    last_name: data.last_name.toUpperCase(),
                    middle_name: data.middle_name?.toUpperCase() || "",
                    second_last_name: data.second_last_name?.toUpperCase() || "",
                    document_type: data.document_type,
                    document_number: data.document_number,
                    gender: data.gender,
                    date_of_birth: data.date_of_birth?.toISOString() || "",
                    whatsapp: data.whatsapp,
                    email: data.email,
                    civil_status: data.civil_status,
                    ethnicity: data.ethnicity,
                    blood_type: data.blood_type,
                }
            };

            await patientService.storePatient(finalData);

            showSuccessToast({
                title: "Éxito",
                message: "Paciente creado correctamente",
            });
            onSuccess?.();
            onHide();
        } catch (error: any) {
            console.error("Error completo:", error);
            showServerErrorsToast(error);
        }
    };

    const getFormErrorMessage = (name: string) => {
        const nameParts = name.split(".");
        let errorObj = errors as any;

        for (const part of nameParts) {
            errorObj = errorObj?.[part];
            if (!errorObj) break;
        }

        return errorObj && <small className="p-error">{errorObj.message}</small>;
    };

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                visible={visible}
                onHide={onHide}
                header="Nuevo Paciente"
                style={{
                    width: "90vw",
                    maxWidth: "1200px",
                    height: "100vh",
                    maxHeight: "900px",
                }}
                appendTo={"self"}
                maximizable
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                        <div className="col-12">
                            <Card title="Datos Personales" className="mb-4">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Controller
                                            name="document_type"
                                            control={control}
                                            rules={{ required: "Tipo de documento es requerido" }}
                                            render={({ field, fieldState }) => {
                                                return (
                                                    <div>
                                                        <label className="form-label">
                                                            Tipo de documento *
                                                        </label>
                                                        <Dropdown
                                                            appendTo="self"
                                                            options={documentTypeOptions}
                                                            optionLabel="label"
                                                            optionValue="value"
                                                            placeholder="Seleccione"
                                                            className={classNames("w-100", {
                                                                "is-invalid": fieldState.error,
                                                            })}
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                field.onChange(e.value);
                                                            }}
                                                        />
                                                        {getFormErrorMessage(field.name)}
                                                    </div>
                                                );
                                            }}
                                        />
                                        <Controller
                                            name="first_name"
                                            control={control}
                                            rules={{ required: "Primer nombre es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">Primer nombre *</label>
                                                    <InputText
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        {...field}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="last_name"
                                            control={control}
                                            rules={{ required: "Primer apellido es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">Primer apellido *</label>
                                                    <InputText
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        {...field}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Controller
                                            name="document_number"
                                            control={control}
                                            rules={{ required: "Número de documento es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">
                                                        Número de documento *
                                                    </label>
                                                    <InputText
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        {...field}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="middle_name"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="form-label">Segundo Nombre *</label>
                                                    <InputText className={classNames("w-100")} {...field} />
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="second_last_name"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="form-label">Segundo apellido *</label>
                                                    <InputText className={classNames("w-100")} {...field} />
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Card>
                            <Card title="Información Adicional">
                                <div className="row">
                                    {/* Columna izquierda */}
                                    <div className="col-md-6">
                                        <Controller
                                            name="gender"
                                            control={control}
                                            rules={{ required: "Género es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">Género *</label>
                                                    <Dropdown
                                                        options={genderOptions}
                                                        placeholder="Seleccione"
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        appendTo={"self"}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="whatsapp"
                                            control={control}
                                            rules={{ required: "WhatsApp es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">WhatsApp *</label>
                                                    <InputText
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        {...field}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="civil_status"
                                            control={control}
                                            rules={{ required: "Estado civil es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">Estado Civil *</label>
                                                    <Dropdown
                                                        options={civilStatusOptions}
                                                        placeholder="Seleccione"
                                                        className={classNames("w-100 h-20", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        appendTo={"self"}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="ethnicity"
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <label className="form-label">Etnia</label>
                                                    <Dropdown
                                                        options={ethnicityOptions}
                                                        placeholder="Seleccione"
                                                        className="w-100 h-50"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        appendTo="self"
                                                        scrollHeight="140px"
                                                    />
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Controller
                                            name="date_of_birth"
                                            control={control}
                                            rules={{
                                                required: "Fecha de nacimiento es requerida",
                                            }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">
                                                        Fecha de nacimiento *
                                                    </label>
                                                    <Calendar
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        dateFormat="dd/mm/yy"
                                                        showIcon
                                                        maxDate={new Date()}
                                                        appendTo={"self"}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <div className="mb-1">
                                                    <label className="form-label">Correo electrónico *</label>
                                                    <InputText
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        {...field}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                        <Controller
                                            name="blood_type"
                                            control={control}
                                            rules={{ required: "Tipo de sangre es requerido" }}
                                            render={({ field, fieldState }) => (
                                                <div>
                                                    <label className="form-label">Tipo de sangre *</label>
                                                    <Dropdown
                                                        options={bloodTypeOptions}
                                                        placeholder="Seleccione"
                                                        className={classNames("w-100", {
                                                            "is-invalid": fieldState.error,
                                                        })}
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        appendTo={"self"}
                                                    />
                                                    {getFormErrorMessage(field.name)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pt-4">
                        <Button
                            label="Guardar"
                            type="button"
                            className="p-button-primary"
                            icon={<i className="fas fa-save me-2"></i>}
                            iconPos="right"
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </form>
            </Dialog>
        </>
    );
};
