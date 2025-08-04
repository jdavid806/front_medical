import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAssetCategories } from "../hooks/useAssetCategories";
import {
  FixedAssetsFormInputs,
  FixedAssetsFormProps,
} from "../interfaces/FixedAssetsFormTypes";
import { useCreateAsset } from "../hooks/useCreateAsset";

// Opciones para tipo de activo (físico/no físico)
const assetTypeOptions = [
  { label: "Físico", value: "physical" },
  { label: "No Físico", value: "non-physical" },
];

const FixedAssetsForm: React.FC<FixedAssetsFormProps> = React.memo(
  ({ formId, onSubmit, initialData, onCancel, loading = false }) => {
    const {
      control,
      handleSubmit,
      formState: { errors },
      reset,
      getValues,
    } = useForm<FixedAssetsFormInputs>({
      defaultValues: initialData || {
        assetType: "physical",
        assetName: "",
        asset_category_id: "",
        brand: "",
        model: "",
        serial_number: "",
        internal_code: "",
        description: "",
      },
    });

    // Obtener categorías desde el API
    const {
      categories,
      loading: loadingCategories,
      error: categoriesError,
    } = useAssetCategories();

    // Estado local para opciones de categoría
    const [categoryOptions, setCategoryOptions] = useState<any[]>([]);

    // Observar cambios en el tipo de activo
    const assetType = useWatch({
      control,
      name: "assetType",
      defaultValue: "physical",
    });

    // Sincronizar categorías y mantener selección actual
    useEffect(() => {
      if (categories) {
        const currentValue = getValues("asset_category_id");
        const options = [...categories];

        if (currentValue && !categories.some((c) => c.value === currentValue)) {
          options.push({ value: currentValue, label: currentValue });
        }

        setCategoryOptions(options);
      }
    }, [categories, getValues]);

    // Resetear el formulario solo cuando initialData cambie realmente
    useEffect(() => {
      if (
        initialData &&
        JSON.stringify(initialData) !== JSON.stringify(getValues())
      ) {
        reset(initialData);
      }
    }, [initialData, reset, getValues]);

    const onFormSubmit: SubmitHandler<FixedAssetsFormInputs> = (data) => {
      onSubmit(data);
    };

    const getFormErrorMessage = (name: keyof FixedAssetsFormInputs) => {
      return (
        errors[name] && (
          <small className="p-error">{errors[name]?.message}</small>
        )
      );
    };

    return (
      <form
        id={formId}
        onSubmit={handleSubmit(onFormSubmit)}
        className="p-fluid"
      >
        <div className="row mb-4">
          {/* Columna izquierda */}
          <div className="col-md-6">
            <div className="mb-3 field">
              <Controller
                name="assetType"
                control={control}
                rules={{ required: "El tipo de activo es requerido" }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Tipo de Activo *
                    </label>
                    <Dropdown
                      id={field.name}
                      options={assetTypeOptions}
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Seleccione un tipo"
                      className={classNames("w-100", {
                        "p-invalid": errors.assetType,
                      })}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      appendTo="self"
                    />
                    {getFormErrorMessage("assetType")}
                  </>
                )}
              />
            </div>

            <div className="mb-3 field">
              <Controller
                name="assetName"
                control={control}
                rules={{
                  required: "El nombre/descripción del activo es requerido",
                  minLength: {
                    value: 3,
                    message: "Mínimo 3 caracteres",
                  },
                }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Nombre/Descripción del Activo *
                    </label>
                    <InputText
                      id={field.name}
                      className={classNames("w-100", {
                        "p-invalid": errors.assetName,
                      })}
                      {...field}
                    />
                    {getFormErrorMessage("assetName")}
                  </>
                )}
              />
            </div>

            {assetType === "physical" && (
              <>
                <div className="mb-3 field">
                  <Controller
                    name="asset_category_id"
                    control={control}
                    rules={{ required: "La categoría del activo es requerida" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Categoría/Tipo de Activo *
                        </label>
                        {loadingCategories ? (
                          <div className="d-flex align-items-center">
                            <ProgressSpinner
                              style={{ width: "20px", height: "20px" }}
                              strokeWidth="8"
                            />
                            <span className="ms-2">Cargando categorías...</span>
                          </div>
                        ) : categoriesError ? (
                          <div className="p-error">
                            Error: {categoriesError.message}
                          </div>
                        ) : (
                          <Dropdown
                            id={field.name}
                            options={categoryOptions}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Seleccione una categoría"
                            className={classNames("w-100", {
                              "p-invalid": errors.asset_category_id,
                            })}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            appendTo={"self"}
                          />
                        )}
                        {getFormErrorMessage("asset_category_id")}
                      </>
                    )}
                  />
                </div>

                <div className="mb-3 field">
                  <Controller
                    name="brand"
                    control={control}
                    rules={{
                      required: "La marca es requerida",
                      minLength: {
                        value: 2,
                        message: "Mínimo 2 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Marca *
                        </label>
                        <InputText
                          id={field.name}
                          className={classNames("w-100", {
                            "p-invalid": errors.brand,
                          })}
                          {...field}
                        />
                        {getFormErrorMessage("brand")}
                      </>
                    )}
                  />
                </div>
              </>
            )}
          </div>

          {/* Columna derecha */}
          <div className="col-md-6">
            {assetType === "physical" && (
              <>
                <div className="mb-3 field">
                  <Controller
                    name="model"
                    control={control}
                    rules={{
                      minLength: {
                        value: 2,
                        message: "Mínimo 2 caracteres",
                      },
                    }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Modelo
                        </label>
                        <InputText
                          id={field.name}
                          className="w-100"
                          {...field}
                        />
                      </>
                    )}
                  />
                </div>

                <div className="mb-3 field">
                  <Controller
                    name="serial_number"
                    control={control}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Número de Serie
                        </label>
                        <InputText
                          id={field.name}
                          className="w-100"
                          {...field}
                        />
                      </>
                    )}
                  />
                </div>
              </>
            )}

            <div className="mb-3 field">
              <Controller
                name="internal_code"
                control={control}
                rules={{
                  required: "El código interno es requerido",
                  pattern: {
                    value: /^[A-Za-z0-9-]+$/,
                    message: "Solo letras, números y guiones",
                  },
                }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Código Interno de Activo *
                    </label>
                    <InputText
                      id={field.name}
                      className={classNames("w-100", {
                        "p-invalid": errors.internal_code,
                      })}
                      {...field}
                    />
                    {getFormErrorMessage("internal_code")}
                  </>
                )}
              />
            </div>

            <div className="mb-3 field">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Descripción Adicional
                    </label>
                    <InputText id={field.name} className="w-100" {...field} />
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          {onCancel && (
            <Button
              label="Cancelar"
              icon="pi pi-times"
              className="p-button-text"
              onClick={onCancel}
              disabled={loading}
            />
          )}
          <Button
            type="button"
            label="Guardar"
            icon="pi pi-check"
            className="ms-2"
            loading={loading}
            onClick={handleSubmit(onFormSubmit)}
          />
        </div>
      </form>
    );
  },
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.initialData) ===
    JSON.stringify(nextProps.initialData)
);

export default FixedAssetsForm;
