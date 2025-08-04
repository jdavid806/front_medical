import React, { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Controller, SubmitHandler, useForm, set } from "react-hook-form";
import { classNames } from "primereact/utils";
import { useAllTableUsers } from "./hooks/useAllTableUsers.js";
import { MultiSelect } from "primereact/multiselect";

interface UserComissionsFormProps {
  formId: string;
  onHandleSubmit: (data: UserComissionsFormInputs) => void;
  initialData?: UserComissionsFormInputs;
}

export type UserComissionsFormInputs = {
  users: Array<number>;
  attention_type: string;
  application_type: string;
  commission_type: string;
  services: Array<number>;
  commission_value: number;
  percentage_base: string;
  percentage_value: number;
  retention_type: string;
  value_retention: number;
  isEditing?: boolean;
  id?: number;
};

export const ComissionForm: React.FC<UserComissionsFormProps> = ({
  formId,
  onHandleSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    register,
    getValues,
  } = useForm<UserComissionsFormInputs>({
    defaultValues: initialData || {
      users: [],
      attention_type: "",
      application_type: "",
      commission_type: "",
      services: [],
      commission_value: 0,
      percentage_base: "",
      percentage_value: 0,
      retention_type: "",
      value_retention: 0,
    },
  });

  const { users, fetchUsers } = useAllTableUsers();
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    reset(
      initialData || {
        users: [],
        attention_type: "",
        application_type: "",
        commission_type: "",
        services: [],
        commission_value: 0,
        percentage_base: "",
        percentage_value: 0,
        retention_type: "",
        value_retention: 0,
      }
    );
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<UserComissionsFormInputs> = (data) =>
    onHandleSubmit(data);

  const getFormErrorMessage = (name: keyof UserComissionsFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  async function fetchServices() {
    //@ts-ignore
    const ruta = obtenerRutaPrincipal() + "/api/v1/admin/products/servicios";
    const response = await fetch(ruta);
    const result = await response.json();
    setServices(result);
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="card mb-2">
          <div className="card-body">
            <div className="row">
              <div className="col-md-12 mb-1">
                <Controller
                  name="users"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Usuarios <span className="text-primary">*</span>
                      </label>
                      <MultiSelect
                        inputId={field.name}
                        filter
                        options={users}
                        optionLabel="fullName"
                        optionValue="id"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.users,
                        })}
                        appendTo={document.body}
                        disabled={initialData?.isEditing}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("users")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="attention_type"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Tipo de atención <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={[
                          { label: "Entidad", value: "entity" },
                          { label: "Particular", value: "private" },
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.attention_type,
                        })}
                        appendTo={document.body}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("attention_type")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="application_type"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Tipo de aplicación{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={[
                          { label: "Servicio", value: "service" },
                          {
                            label: "Orden",
                            value: "order",
                          },
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.application_type,
                        })}
                        appendTo={document.body}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("application_type")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="commission_value"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Valor de la comision{" "}
                        <span className="text-primary">*</span>
                      </label>
                      <InputNumber
                        id={field.name}
                        placeholder="Valor de la comision"
                        className="w-100"
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("commission_value")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="services"
                  control={control}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Servicios <span className="text-primary">*</span>
                      </label>
                      <MultiSelect
                        inputId={field.name}
                        filter
                        options={services}
                        optionLabel="name"
                        optionValue="id"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.services,
                        })}
                        appendTo={document.body}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("services")}
              </div>
              <div className="col-md-6 mb-1">
                <Controller
                  name="commission_type"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Tipo de comisión <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={[
                          { label: "Porcentaje", value: "percentage" },
                          { label: "Cantidad fija", value: "fixed" },
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.commission_type,
                        })}
                        appendTo={document.body}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("commission_type")}
              </div>

              <>
                {watch("commission_type") === "percentage" && (
                  <>
                    <div className="col-md-6 mb-1">
                      <Controller
                        name="percentage_base"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label htmlFor={field.name} className="form-label">
                              Porcentaje base{" "}
                              <span className="text-primary">*</span>
                            </label>
                            <Dropdown
                              inputId={field.name}
                              filter
                              options={[
                                {
                                  label: "Valor pagado por paciente particular",
                                  value: "public",
                                },
                                {
                                  label: "Monto autorizado por entidad",
                                  value: "entity",
                                },
                              ]}
                              optionLabel="label"
                              optionValue="value"
                              placeholder="Seleccione"
                              className={classNames("w-100", {
                                "p-invalid": errors.percentage_base,
                              })}
                              appendTo={document.body}
                              {...field}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("percentage_base")}
                    </div>
                    <div className="col-md-6 mb-1">
                      <Controller
                        name="percentage_value"
                        control={control}
                        rules={{ required: "Este campo es requerido" }}
                        render={({ field }) => (
                          <>
                            <label htmlFor={field.name} className="form-label">
                              Porcentaje <span className="text-primary">*</span>
                            </label>
                            <InputNumber
                              id={field.name}
                              placeholder="Porcentaje"
                              className="w-100"
                              value={field.value}
                              onValueChange={(e) => field.onChange(e.value)}
                            />
                          </>
                        )}
                      />
                      {getFormErrorMessage("percentage_value")}
                    </div>
                  </>
                )}
              </>
              <div className="col-md-6 mb-1">
                <Controller
                  name="retention_type"
                  control={control}
                  rules={{ required: "Este campo es requerido" }}
                  render={({ field }) => (
                    <>
                      <label htmlFor={field.name} className="form-label">
                        Tipo de retención
                        <span className="text-primary">*</span>
                      </label>
                      <Dropdown
                        inputId={field.name}
                        filter
                        options={[
                          {
                            label: "Porcentaje",
                            value: "percentage",
                          },
                          {
                            label: "Monto fijo",
                            value: "fixed_amount",
                          },
                        ]}
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccione"
                        className={classNames("w-100", {
                          "p-invalid": errors.retention_type,
                        })}
                        appendTo={document.body}
                        {...field}
                      />
                    </>
                  )}
                />
                {getFormErrorMessage("retention_type")}
              </div>

              {watch("retention_type") === "percentage" && (
                <div className="col-md-6 mb-1">
                  <Controller
                    name="value_retention"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Porcentaje de retención{" "}
                          <span className="text-primary">*</span>
                        </label>
                        <InputNumber
                          id={field.name}
                          mode="decimal"
                          min={0}
                          max={100}
                          suffix="%"
                          placeholder="Ej: 10%"
                          className="w-100"
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("value_retention")}
                </div>
              )}

              {watch("retention_type") === "fixed_amount" && (
                <div className="col-md-6 mb-1">
                  <Controller
                    name="value_retention"
                    control={control}
                    rules={{ required: "Este campo es requerido" }}
                    render={({ field }) => (
                      <>
                        <label htmlFor={field.name} className="form-label">
                          Valor fijo de retención{" "}
                          <span className="text-primary">*</span>
                        </label>
                        <InputNumber
                          id={field.name}
                          mode="currency"
                          currency="COP"
                          locale="es-CO"
                          min={0}
                          placeholder="Ej: $50,000"
                          className="w-100"
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                        />
                      </>
                    )}
                  />
                  {getFormErrorMessage("value_retention")}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
