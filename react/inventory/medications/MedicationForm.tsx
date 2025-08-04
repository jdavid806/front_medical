import React, { useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import {
  MedicationFormInputs,
  MedicationFormProps,
} from "./interfaces/MedicationForm";

const presentationOptions = [
  { label: "Crema", value: "Crema" },
  { label: "Tabletas", value: "Tabletas" },
  { label: "Jarabe", value: "Jarabe" },
  { label: "Inyección", value: "Inyección" },
];

const unitOptions = [
  { label: "Ml", value: "Ml" },
  { label: "Mg", value: "Mg" },
  { label: "UI", value: "UI" },
];

const MedicationForm: React.FC<MedicationFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<MedicationFormInputs>({
    defaultValues: initialData || {
      name: "",
      presentation: "",
      concentration: "",
      minimum_stock: 0,
      maximum_stock: 0,
      description: "",
      weight: 0,
      capacity: 0,
      sale_price: 0,
    },
  });

  const stepperRef = useRef<any>(null);

  const onSubmit: SubmitHandler<MedicationFormInputs> = (data) => {
    onHandleSubmit(data);
  };

  const getFormErrorMessage = (name: keyof MedicationFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const validateAndNext = async () => {
    const fieldsToValidate: (keyof MedicationFormInputs)[] = [
      "name",
      "presentation",
      "concentration",
      "minimum_stock",
      "maximum_stock",
    ];

    const isValid = await trigger(fieldsToValidate, { shouldFocus: true });
    if (isValid && stepperRef.current) {
      stepperRef.current.nextCallback();
    }
  };

  return (
    <div>
      <form id={formId} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stepper ref={stepperRef}>
          <StepperPanel header="Información básica">
            <div className="mb-3">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Nombre del medicamento *
                    </label>
                    <InputText
                      id={field.name}
                      className={classNames("w-100", {
                        "p-invalid": errors.name,
                      })}
                      {...field}
                    />
                    {getFormErrorMessage("name")}
                  </>
                )}
              />
            </div>

            <div className="mb-3">
              <Controller
                name="presentation"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Presentación *
                    </label>
                    <Dropdown
                      id={field.name}
                      options={presentationOptions}
                      placeholder="Seleccione una presentación"
                      className={classNames("w-100", {
                        "p-invalid": errors.presentation,
                      })}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      appendTo="self"
                    />
                    {getFormErrorMessage("presentation")}
                  </>
                )}
              />
            </div>

            <div className="row mb-3">
              <div className="col-md-12">
                <Controller
                  name="concentration"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Concentración *
                      </label>
                      <InputText
                        id={field.name}
                        className={classNames("w-100", {
                          "p-invalid": errors.concentration,
                        })}
                        {...field}
                      />
                      {getFormErrorMessage("concentration")}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Controller
                  name="minimum_stock"
                  control={control}
                  rules={{
                    required: "Este campo es requerido",
                    min: { value: 0, message: "El valor mínimo es 0" },
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Stock mínimo *
                      </label>
                      <InputNumber
                        inputId={field.name}
                        min={0}
                        className={classNames("w-100", {
                          "p-invalid": errors.minimum_stock,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage("minimum_stock")}
                    </>
                  )}
                />
              </div>
              <div className="col-md-6">
                <Controller
                  name="maximum_stock"
                  control={control}
                  rules={{
                    required: "Este campo es requerido",
                    min: { value: 0, message: "El valor mínimo es 0" },
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Stock máximo *
                      </label>
                      <InputNumber
                        inputId={field.name}
                        min={0}
                        className={classNames("w-100", {
                          "p-invalid": errors.maximum_stock,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage("maximum_stock")}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="mb-3">
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Descripción
                    </label>
                    <InputText id={field.name} className="w-100" {...field} />
                  </>
                )}
              />
            </div>

            <div className="d-flex pt-4 justify-content-end">
              <Button
                className="btn btn-primary btn-sm"
                type="button"
                label="Siguiente"
                icon={<i className="fas fa-arrow-right me-1"></i>}
                iconPos="right"
                onClick={validateAndNext}
              />
            </div>
          </StepperPanel>

          <StepperPanel header="Detalles adicionales">
            <div className="row mb-3">
              <div className="col-md-6">
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    min: { value: 0, message: "El valor mínimo es 0" },
                    validate: (value) =>
                      value === 0 || value > 0 || "El peso debe ser positivo",
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Peso del medicamento (g)
                      </label>
                      <InputNumber
                        inputId={field.name}
                        min={0}
                        suffix=" g"
                        className={classNames("w-100", {
                          "p-invalid": errors.weight,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage("weight")}
                    </>
                  )}
                />
              </div>
              <div className="col-md-6">
                <Controller
                  name="capacity"
                  control={control}
                  rules={{
                    min: { value: 0, message: "El valor mínimo es 0" },
                    validate: (value) =>
                      value === 0 ||
                      value > 0 ||
                      "La capacidad debe ser positiva",
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Capacidad del medicamento (ml)
                      </label>
                      <InputNumber
                        inputId={field.name}
                        min={0}
                        suffix=" ml"
                        className={classNames("w-100", {
                          "p-invalid": errors.capacity,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage("capacity")}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <Controller
                  name="sale_price"
                  control={control}
                  rules={{
                    required: "El precio de venta es requerido",
                    min: { value: 0, message: "El valor mínimo es 0" },
                    validate: (value) =>
                      value > 0 || "El precio debe ser mayor que 0",
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Precio de venta *
                      </label>
                      <InputNumber
                        inputId={field.name}
                        min={0}
                        mode="currency"
                        currency="USD"
                        locale="en-US"
                        className={classNames("w-100", {
                          "p-invalid": errors.sale_price,
                        })}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                      {getFormErrorMessage("sale_price")}
                    </>
                  )}
                />
              </div>
            </div>

            <div className="d-flex pt-4 justify-content-end gap-3">
              <Button
                className="btn btn-secondary btn-sm"
                type="button"
                label="Atrás"
                icon={<i className="fas fa-arrow-left me-1"></i>}
                onClick={() => stepperRef.current?.prevCallback()}
              />
              <Button
                className="btn btn-primary btn-sm"
                label="Guardar"
                type="submit"
                icon={<i className="fas fa-save me-1"></i>}
                iconPos="right"
              />
            </div>
          </StepperPanel>
        </Stepper>
      </form>
    </div>
  );
};

export default MedicationForm;
