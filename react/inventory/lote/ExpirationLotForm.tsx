import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Nullable } from "primereact/ts-helpers";

export type ExpirationLotFormInputs = {
  expirationDate: Nullable<Date>;
  lotNumber: string;
  deposit: string;
  quantity: any;
};

interface ExpirationLotFormProps {
  formId: string;
  onSubmit: (data: ExpirationLotFormInputs) => void;
  onCancel?: () => void;
  initialData?: ExpirationLotFormInputs;
  productName?: string;
  deposits: { id: string; name: string }[];
  showCancelButton?: boolean;
  onChange?: (field: keyof ExpirationLotFormInputs, value: any) => void;
  availableQuantity?: number;
  isEditing?: boolean;
}

const ExpirationLotForm: React.FC<ExpirationLotFormProps> = ({
  formId,
  onSubmit,
  initialData,
  deposits,
  productName,
  isEditing,
}) => {
  const [localFormData, setLocalFormData] = useState<ExpirationLotFormInputs>(
    initialData || {
      expirationDate: null,
      lotNumber: "",
      deposit: "",
      quantity: "", // Valor inicial
    }
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<ExpirationLotFormInputs>({
    defaultValues: localFormData,
    mode: "onChange",
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: ExpirationLotFormInputs) => {
    onSubmit(data);
  };

  const renderLotNumber = ({ field }: { field: any }) => (
    <div className="input-wrapper">
      <label htmlFor={field.name} className="form-label">
        Número de Lote *
      </label>
      <InputText
        {...field}
        placeholder="Ej: LOTE-2023-001"
        autoComplete="off"
        className="w-100"
      />
      {errors.lotNumber && (
        <small className="p-error">{errors.lotNumber.message}</small>
      )}
    </div>
  );

  const renderExpirationDate = ({ field }: { field: any }) => (
    <>
      <label htmlFor={field.name} className="form-label">
        Fecha de Caducidad *
      </label>
      <Calendar
        {...field}
        dateFormat="dd/mm/yy"
        showIcon
        minDate={new Date()}
        placeholder="Seleccione fecha"
        className="w-100"
      />
    </>
  );

  const renderDeposit = ({ field }: { field: any }) => (
    <>
      <label htmlFor={field.name} className="form-label">
        Depósito *
      </label>
      <Dropdown
        {...field}
        options={deposits}
        optionLabel="name"
        optionValue="id"
        placeholder="Seleccione depósito"
        filter
        className="w-100"
      />
    </>
  );

  // NUEVO: Render para el campo de cantidad
  const renderQuantity = ({ field }: { field: any }) => (
    <>
      <label htmlFor={field.name} className="form-label">
        Cantidad *
      </label>
      <InputNumber
        value={field.value || 0} // Forzar valor numérico
        placeholder="Cantidad"
        className="w-100"
        min={0}
        onValueChange={(e) => {
          console.log("Value changed:", e.value); // Para debug
          field.onChange(e.value);
        }}
      />
    </>
  );

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h5 className="h5 mb-0">
          <i className="pi pi-box me-2 text-primary"></i>
          {isEditing ? `Editar Lote - ${productName}` : `Agregar Lote - ${productName}`}
        </h5>
      </div>
      <div className="card-body">
        <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="row g-3">
            <div className="col-md-6">
              <Controller
                name="lotNumber"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={renderLotNumber}
              />
            </div>
            <div className="col-md-6">
              <Controller
                name="expirationDate"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={renderExpirationDate}
              />
            </div>
            <div className="col-md-6">
              <Controller
                name="deposit"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={renderDeposit}
              />
            </div>
            <div className="col-md-6">
              <Controller
                name="quantity"
                control={control}
                rules={{
                  required: "Campo obligatorio",
                  min: { value: 1, message: "La cantidad debe ser mayor a 0" },
                }}
                render={renderQuantity}
              />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button
              type="button"
              label="Guardar"
              disabled={!isValid}
              onClick={handleSubmit(handleFormSubmit)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpirationLotForm;
