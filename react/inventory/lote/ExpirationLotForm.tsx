import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";

export type ExpirationLotFormInputs = {
  expirationDate: Nullable<Date>;
  lotNumber: string;
  deposit: string;
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
}

const ExpirationLotForm: React.FC<ExpirationLotFormProps> = ({
  formId,
  onSubmit,
  initialData,
  deposits,
  productName,
}) => {
  const [localFormData, setLocalFormData] = useState<ExpirationLotFormInputs>(
    initialData || {
      expirationDate: null,
      lotNumber: "",
      deposit: "",
    }
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
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
    onSubmit(data); // Envía TODOS los datos al padre
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

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-light">
        <h5 className="h5 mb-0">
          <i className="pi pi-box me-2 text-primary"></i>
          {productName ? `Lote - ${productName}` : "Agregar Lote"}
        </h5>
      </div>
      <div className="card-body">
        <form id={formId} onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Campos del formulario usando los renderers modificados */}
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
            <div className="col-md-12">
              <Controller
                name="deposit"
                control={control}
                rules={{ required: "Campo obligatorio" }}
                render={renderDeposit}
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
