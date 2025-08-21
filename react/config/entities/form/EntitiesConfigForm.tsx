import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { EntitiesFormInputs, EntitiesFormProps } from "../interfaces/entitiesForm";
import { documentTypes } from "../interfaces/constant";
import useLocationDropdowns from "../../../cities/hooks/useLocationDropdowns";

const EntitiesConfigForm: React.FC<EntitiesFormProps> = ({
    formId,
    onSubmit,
    initialData,
    onCancel,
    loading = false,
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
        watch
    } = useForm<EntitiesFormInputs>({
        defaultValues: initialData || {
            name: "",
            document_type: "CC",
            document_number: "",
            email: "",
            address: "",
            phone: "",
            country_id: "",
            department_id: "",
            city_id: "",
            tax_charge_id: null,
            withholding_tax_id: null,
            koneksi_sponsor_slug: null,
        },
    });

    const watchCountry = watch("country_id");
    const watchDepartment = watch("department_id");

    // Usar el hook de ubicaciones
    const {
        countryOptions,
        departmentOptions,
        cityOptions,
        selectedCountry,
        selectedDepartment,
        selectedCity,
        handleCountryChange,
        handleDepartmentChange,
        handleCityChange,
        loading: locationLoading,
        setInitialValuesFromIds
    } = useLocationDropdowns();

    const onFormSubmit: SubmitHandler<EntitiesFormInputs> = (data) => {
        const countryId = countryOptions.find(c => c.value === data.country_id)?.customProperties?.id;
        const departmentId = departmentOptions.find(d => d.value === data.department_id)?.customProperties?.id;
        const cityId = cityOptions.find(c => c.value === data.city_id)?.customProperties?.id;

        onSubmit({
            ...data,
            country_id: countryId ? Number(countryId) : null,
            department_id: departmentId ? Number(departmentId) : null,
            city_id: cityId ? String(cityId) : null,
        });
    };

    const getFormErrorMessage = (name: keyof EntitiesFormInputs) => {
        return (
            errors[name] && <small className="p-error">{errors[name]?.message}</small>
        );
    };

    useEffect(() => {
        if (initialData) {
            reset(initialData);

            if (initialData.country_id && initialData.department_id && initialData.city_id) {
                setInitialValuesFromIds(
                    Number(initialData.country_id),
                    Number(initialData.department_id),
                    Number(initialData.city_id)
                );
            }
        }
    }, [initialData, reset, setInitialValuesFromIds]);

    useEffect(() => {
        if (selectedCountry) {
            setValue("country_id", selectedCountry, { shouldValidate: true });
        }
    }, [selectedCountry, setValue]);

    useEffect(() => {
        if (selectedDepartment) {
            setValue("department_id", selectedDepartment, { shouldValidate: true });
        }
    }, [selectedDepartment, setValue]);

    useEffect(() => {
        if (selectedCity) {
            setValue("city_id", selectedCity, { shouldValidate: true });
        }
    }, [selectedCity, setValue]);

    return (
        <form id={formId} onSubmit={handleSubmit(onFormSubmit)}>
            <div className="mb-3">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Nombre *
                            </label>
                            <InputText
                                id={field.name}
                                className={classNames("w-100", {
                                    "p-invalid": errors.name,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("name")}
            </div>

            <div className="mb-3">
                <Controller
                    name="document_type"
                    control={control}
                    rules={{ required: "El tipo de documento es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Tipo de Documento *
                            </label>
                            <Dropdown
                                id={field.name}
                                options={documentTypes}
                                optionLabel="label"
                                optionValue="value"
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
                <Controller
                    name="document_number"
                    control={control}
                    rules={{ required: "El número de documento es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Número de Documento *
                            </label>
                            <InputText
                                id={field.name}
                                className={classNames("w-100", {
                                    "p-invalid": errors.document_number,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("document_number")}
            </div>

            <div className="mb-3">
                <Controller
                    name="email"
                    control={control}
                    rules={{
                        required: "El email es requerido",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Email inválido",
                        },
                    }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Email *
                            </label>
                            <InputText
                                id={field.name}
                                className={classNames("w-100", {
                                    "p-invalid": errors.email,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("email")}
            </div>

            <div className="mb-3">
                <Controller
                    name="address"
                    control={control}
                    rules={{ required: "La dirección es requerida" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Dirección *
                            </label>
                            <InputText
                                id={field.name}
                                className={classNames("w-100", {
                                    "p-invalid": errors.address,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("address")}
            </div>

            <div className="mb-3">
                <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "El teléfono es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor={field.name} className="form-label">
                                Teléfono *
                            </label>
                            <InputText
                                id={field.name}
                                className={classNames("w-100", {
                                    "p-invalid": errors.phone,
                                })}
                                {...field}
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("phone")}
            </div>

            {/* Selector de País */}
            <div className="mb-3">
                <Controller
                    name="country_id"
                    control={control}
                    rules={{ required: "El país es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor="country_id" className="form-label">
                                País *
                            </label>
                            <Dropdown
                                id="country_id"
                                value={selectedCountry}
                                options={countryOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => handleCountryChange(e.value)}
                                className={classNames("w-100", {
                                    "p-invalid": errors.country_id,
                                })}
                                placeholder="Selecciona un país"
                                loading={locationLoading}
                                filter
                                filterBy="label"
                                showClear
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("country_id")}
            </div>

            {/* Selector de Departamento */}
            <div className="mb-3">
                <Controller
                    name="department_id"
                    control={control}
                    rules={{ required: "El departamento es requerido" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor="department_id" className="form-label">
                                Departamento *
                            </label>
                            <Dropdown
                                id="department_id"
                                value={selectedDepartment}
                                options={departmentOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => handleDepartmentChange(e.value)}
                                className={classNames("w-100", {
                                    "p-invalid": errors.department_id,
                                })}
                                placeholder="Selecciona un departamento"
                                loading={locationLoading}
                                disabled={!watchCountry}
                                filter
                                filterBy="label"
                                showClear
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("department_id")}
            </div>

            {/* Selector de Ciudad */}
            <div className="mb-3">
                <Controller
                    name="city_id"
                    control={control}
                    rules={{ required: "La ciudad es requerida" }}
                    render={({ field }) => (
                        <>
                            <label htmlFor="city_id" className="form-label">
                                Ciudad *
                            </label>
                            <Dropdown
                                id="city_id"
                                value={selectedCity}
                                options={cityOptions}
                                optionLabel="label"
                                optionValue="value"
                                onChange={(e) => handleCityChange(e.value)}
                                className={classNames("w-100", {
                                    "p-invalid": errors.city_id,
                                })}
                                placeholder="Selecciona una ciudad"
                                loading={locationLoading}
                                disabled={!watchDepartment}
                                filter
                                filterBy="label"
                                showClear
                            />
                        </>
                    )}
                />
                {getFormErrorMessage("city_id")}
            </div>

            <div className="d-flex justify-content-center mt-4 gap-6">
                {onCancel && (
                    <Button
                        label="Cancelar"
                        className="btn btn-phoenix-secondary"
                        onClick={onCancel}
                        style={{ padding: "0 20px", width: "200px", height: "50px", borderRadius: "0px" }}
                        type="button"
                        disabled={loading}
                    >
                        <i className="fas fa-times"></i>
                    </Button>
                )}
                <Button
                    type="submit"
                    label="Guardar"
                    className="p-button-sm"
                    disabled={loading || !isDirty}
                    style={{
                        padding: "0 40px",
                        width: "200px",
                        height: "50px",
                        borderRadius: "0px",
                    }}
                >
                    <i className="fas fa-save"></i>
                </Button>
            </div>
        </form>
    );
};

export default EntitiesConfigForm;