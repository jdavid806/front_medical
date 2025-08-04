import React, { useEffect, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { VaccineFormInputs, VaccineFormProps } from "./interfaces/VaccineForm";
import { Dropdown } from "primereact/dropdown";
import { brandService } from "../../../services/api/index.js";

const VaccineForm: React.FC<VaccineFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<VaccineFormInputs>({
    defaultValues: initialData || {
      name: "",
      reference: "",
      brand: "",
      sanitary_registration: "",
      weight: 0,
      concentration: "",
      minimum_stock: 0,
      maximum_stock: 0,
      sale_price: 0,
    },
  });

  const stepperRef = useRef<any>(null);
  const [brands, setBrands] = React.useState<any[]>([]);

  useEffect(() => {
    getBrands();
  }, []);

  const onSubmit: SubmitHandler<VaccineFormInputs> = (data) => {
    onHandleSubmit(data);
  };

  async function getBrands() {
    const brandsData = await brandService.getAll();
    setBrands(brandsData?.data);
  }

  const getFormErrorMessage = (name: keyof VaccineFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  const validateAndNext = async (fields: (keyof VaccineFormInputs)[]) => {
    const isValid = await trigger(fields, { shouldFocus: true });
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
                      Nombre de la vacuna *
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
                name="reference"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Referencia *
                    </label>
                    <InputText
                      id={field.name}
                      className={classNames("w-100", {
                        "p-invalid": errors.reference,
                      })}
                      {...field}
                    />
                    {getFormErrorMessage("reference")}
                  </>
                )}
              />
            </div>

            <div className="mb-3">
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Marca
                    </label>
                    <Dropdown
                      id={field.name}
                      options={brands}
                      optionLabel="attributes.name"
                      optionValue="id"
                      placeholder="Seleccione"
                      className={classNames("w-100", {
                        "p-invalid": errors.brand,
                      })}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      appendTo={"self"}
                    />
                  </>
                )}
              />
            </div>

            <div className="mb-3">
              <Controller
                name="sanitary_registration"
                control={control}
                rules={{ required: "Este campo es requerido" }}
                render={({ field }) => (
                  <>
                    <label htmlFor={field.name} className="form-label">
                      Registro sanitario *
                    </label>
                    <InputText
                      id={field.name}
                      className={classNames("w-100", {
                        "p-invalid": errors.sanitary_registration,
                      })}
                      {...field}
                    />
                    {getFormErrorMessage("sanitary_registration")}
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
                onClick={() =>
                  validateAndNext([
                    "name",
                    "reference",
                    "brand",
                    "sanitary_registration",
                  ])
                }
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
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Peso (g)
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
              <div className=" col-md-6 mb-3">
                <Controller
                  name="concentration"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Concentración
                      </label>
                      <InputText id={field.name} className="w-100" {...field} />
                    </>
                  )}
                />
              </div>
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
              <div className="col-md-6">
                <Controller
                  name="sale_price"
                  control={control}
                  rules={{
                    required: "Este campo es requerido",
                    min: { value: 0, message: "El valor mínimo es 0" },
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
            </div>
          </StepperPanel>
        </Stepper>
      </form>
    </div>
  );
};

export default VaccineForm;
