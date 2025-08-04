import React, { useEffect, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { SupplyFormInputs, SupplyFormProps } from "./interfaces/SupplyForm";
import {
  categoryProductsService,
  brandService,
} from "../../../services/api/index.js";

const SupplyForm: React.FC<SupplyFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm<SupplyFormInputs>({
    defaultValues: initialData || {
      name: "",
      category: "",
      presentation: "",
      minimum_stock: 0,
      maximum_stock: 0,
      description: "",
      weight: 0,
      brand: "",
      sale_price: 0,
    },
  });

  const onSubmit: SubmitHandler<SupplyFormInputs> = (data) =>
    onHandleSubmit(data);

  const stepperRef = useRef(null);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [brands, setBrands] = React.useState<any[]>([]);

  useEffect(() => {
    getCategories();
    getBrands();
  }, []);

  const getFormErrorMessage = (name: keyof SupplyFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  async function getCategories() {
    const categories = await categoryProductsService.getAll();
    setCategories(categories);
  }

  async function getBrands() {
    const brandsData = await brandService.getAll();
    setBrands(brandsData?.data);
  }

  const presentationOptions = [
    { label: "Crema", value: "Crema" },
    { label: "Tabletas", value: "Tabletas" },
    { label: "Jarabe", value: "Jarabe" },
    { label: "Inyección", value: "Inyección" },
  ];

  return (
    <div>
      <form
        id={formId}
        className="needs-validation"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
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
                      Nombre del insumo *
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

            <div className="row mb-3">
              <div className="col-md-6">
                <Controller
                  name="category"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Categoría *
                      </label>
                      <Dropdown
                        id={field.name}
                        options={categories}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Seleccione una categoría"
                        className={classNames("w-100", {
                          "p-invalid": errors.category,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo={"self"}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("category")}
              </div>

              <div className="col-md-6">
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
              <div className="col-md-12">
                <Controller
                  name="presentation"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Presentacón *
                      </label>
                      <Dropdown
                        id={field.name}
                        options={presentationOptions}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.presentation,
                        })}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        appendTo={"self"}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("presentation")}
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
                    </>
                  )}
                />
                {getFormErrorMessage("minimum_stock")}
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
                    </>
                  )}
                />
                {getFormErrorMessage("maximum_stock")}
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
                onClick={async (e) => {
                  const isValid = await trigger([
                    "name",
                    "category",
                    "minimum_stock",
                    "maximum_stock",
                  ]);

                  if (!isValid) {
                    e.preventDefault();
                    return;
                  }

                  (stepperRef.current! as any).nextCallback();
                }}
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
                        Peso del insumo (g)
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
                    </>
                  )}
                />
                {getFormErrorMessage("weight")}
              </div>

              <div className="col-md-6">
                <Controller
                  name="sale_price"
                  control={control}
                  rules={{
                    min: { value: 0, message: "El valor mínimo es 0" },
                  }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Precio de venta
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
                    </>
                  )}
                />
                {getFormErrorMessage("sale_price")}
              </div>
            </div>

            <div className="d-flex pt-4 justify-content-end gap-3">
              <Button
                className="btn btn-secondary btn-sm"
                type="button"
                label="Atrás"
                icon={<i className="fas fa-arrow-left me-1"></i>}
                onClick={() => {
                  (stepperRef.current! as any).prevCallback();
                }}
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

export default SupplyForm;
