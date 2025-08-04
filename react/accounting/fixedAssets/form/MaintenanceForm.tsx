// components/MaintenanceForm.tsx
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { Divider } from "primereact/divider";
import { InputTextarea } from "primereact/inputtextarea";
import {
  MaintenanceFormInputs,
  MaintenanceFormProps,
} from "../interfaces/MaintenanceFormTypes";

const MaintenanceForm: React.FC<MaintenanceFormProps> = ({
  formId,
  onSubmit,
  initialData,
  onCancel,
  loading = false,
  statusOptions,
  maintenanceTypeOptions,
  userOptions,
  currentStatus,
  asset,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MaintenanceFormInputs>({
    defaultValues: initialData || {
      assetStatus: currentStatus,
      maintenanceDate: new Date(),
      maintenanceType: "",
      comments: "",
      cost: undefined,
      nextMaintenanceDate: undefined,
    },
  });

  const assetStatus = watch("assetStatus");
  const maintenanceType = watch("maintenanceType");

  const onFormSubmit: SubmitHandler<MaintenanceFormInputs> = (data) =>
    onSubmit(data);

  const getFormErrorMessage = (name: keyof MaintenanceFormInputs) => {
    return (
      errors[name] && <small className="p-error">{errors[name]?.message}</small>
    );
  };

  return (
    <form id={formId} onSubmit={handleSubmit(onFormSubmit)} className="p-fluid">
      {/* Sección Estado del Activo */}
      <div className="mb-4">
        <label
          htmlFor="assetStatus"
          className="font-medium text-900 block mb-2"
        >
          Estado del Activo *
        </label>
        <Controller
          name="assetStatus"
          control={control}
          rules={{ required: "El estado del activo es requerido" }}
          render={({ field }) => (
            <Dropdown
              id="assetStatus"
              options={statusOptions}
              optionLabel="label"
              placeholder="Seleccione estado"
              className={classNames("w-full", {
                "p-invalid": errors.assetStatus,
              })}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              appendTo="self"
            />
          )}
        />
        {getFormErrorMessage("assetStatus")}
      </div>

      {/* Sección Asignación (solo visible cuando estado es "active" o "assigned") */}
      {(assetStatus === "active" || assetStatus === "assigned") && (
        <div className="mb-4">
          <label
            htmlFor="assignedTo"
            className="font-medium text-900 block mb-2"
          >
            {assetStatus === "active" ? "Asignar a" : "Reasignar a"} *
          </label>
          <Controller
            name="assignedTo"
            control={control}
            rules={{
              required: "El asignado es requerido para activos en uso",
            }}
            render={({ field }) => (
              <Dropdown
                id="assignedTo"
                options={userOptions}
                optionLabel="label"
                placeholder="Seleccione usuario"
                className={classNames("w-full", {
                  "p-invalid": errors.assignedTo,
                })}
                value={field.value}
                onChange={(e) => field.onChange(e.value)}
                appendTo="self"
              />
            )}
          />
          {getFormErrorMessage("assignedTo")}
        </div>
      )}

      {/* Mostrar sección de mantenimiento solo si no es estado "active" */}
      {assetStatus !== "active" && (
        <>
          <Divider />

          {/* Sección Mantenimiento */}
          <div className="mb-4">
            <label
              htmlFor="maintenanceType"
              className="font-medium text-900 block mb-2"
            >
              Tipo de Mantenimiento *
            </label>
            <Controller
              name="maintenanceType"
              control={control}
              rules={{ required: "El tipo de mantenimiento es requerido" }}
              render={({ field }) => (
                <Dropdown
                  id="maintenanceType"
                  options={maintenanceTypeOptions}
                  optionLabel="label"
                  placeholder="Seleccione tipo"
                  className={classNames("w-full", {
                    "p-invalid": errors.maintenanceType,
                  })}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  appendTo="self"
                />
              )}
            />
            {getFormErrorMessage("maintenanceType")}
          </div>

          <div className="grid">
            <div className="col-12 md:col-6">
              <div className="mb-3">
                <label
                  htmlFor="maintenanceDate"
                  className="font-medium text-900 block mb-2"
                >
                  Fecha de Mantenimiento *
                </label>
                <Controller
                  name="maintenanceDate"
                  control={control}
                  rules={{ required: "La fecha es requerida" }}
                  render={({ field }) => (
                    <Calendar
                      id="maintenanceDate"
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      dateFormat="dd/mm/yy"
                      showIcon
                      className={classNames("w-full", {
                        "p-invalid": errors.maintenanceDate,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("maintenanceDate")}
              </div>
            </div>
            <div className="col-12 md:col-6">
              <div className="mb-3">
                <label
                  htmlFor="cost"
                  className="font-medium text-900 block mb-2"
                >
                  Costo (opcional)
                </label>
                <Controller
                  name="cost"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id="cost"
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      mode="currency"
                      currency="DOP"
                      locale="es-DO"
                      min={0}
                      className="w-full"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Sección para mantenimientos preventivos */}
          {maintenanceType === "preventive" && (
            <div className="mb-3">
              <label
                htmlFor="nextMaintenanceDate"
                className="font-medium text-900 block mb-2"
              >
                Próximo Mantenimiento *
              </label>
              <Controller
                name="nextMaintenanceDate"
                control={control}
                rules={{
                  required: "La fecha del próximo mantenimiento es requerida",
                }}
                render={({ field }) => (
                  <Calendar
                    id="nextMaintenanceDate"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    className={classNames("w-full", {
                      "p-invalid": errors.nextMaintenanceDate,
                    })}
                  />
                )}
              />
              {getFormErrorMessage("nextMaintenanceDate")}
            </div>
          )}
        </>
      )}

      {/* Sección Comentarios (siempre visible) */}
      <div className="mb-3">
        <label htmlFor="comments" className="font-medium text-900 block mb-2">
          Comentarios *
        </label>
        <Controller
          name="comments"
          control={control}
          rules={{ required: "Los comentarios son requeridos" }}
          render={({ field }) => (
            <InputTextarea
              id="comments"
              className={classNames("w-full", {
                "p-invalid": errors.comments,
              })}
              placeholder="Describa los detalles del cambio de estado o mantenimiento"
              rows={4}
              {...field}
            />
          )}
        />
        {getFormErrorMessage("comments")}
      </div>

      <Divider />

      {/* Botones de acción */}
      <div className="flex justify-content-end gap-2 mt-4">
        {onCancel && (
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-sm"
            onClick={onCancel}
            disabled={loading}
          />
        )}
        <Button
          type="submit"
          label="Guardar Cambios"
          icon="pi pi-check"
          className="p-button-sm"
          loading={loading}
        />
      </div>
    </form>
  );
};

export default MaintenanceForm;
