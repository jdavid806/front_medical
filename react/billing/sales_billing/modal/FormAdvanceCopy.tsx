import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { useAdvancePayments } from "../../hooks/useAdvancePayments";

interface FormValues {
  amount: any;
}

export const FormAdvanceCopy: React.FC<any> = ({
  advances,
  invoiceTotal,
  onSubmit
}) => {
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      amount: null,
    },
  });


  const handleOnSubmit = (data: FormValues) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <div className="field" style={{ position: "relative" }}>
        <label htmlFor="amount">Monto</label>
        <Controller
          name="amount"
          control={control}
          rules={{
            required: "Este campo es requerido",
            min: { value: 1, message: "El monto debe ser mayor a 0" },
          }}
          render={({ field, fieldState }) => (
            <>
              <InputNumber
                id={field.name}
                value={field.value}
                onValueChange={(e) => field.onChange(e.value)}
                mode="currency"
                currency="DOP"
                placeholder="DOP 0.00"
                className={fieldState.error ? "p-invalid" : ""}
              />
              {fieldState.error && (
                <small className="p-error">{fieldState.error.message}</small>
              )}
            </>
          )}
        />
      </div>

      <div className="d-flex flex-column mt-3">
        <div className="d-flex justify-content-between">
          <div>Total de la factura:</div>
          <div>{invoiceTotal}</div>
        </div>
        <div className="d-flex justify-content-between">
          <div>Anticipo disponible:</div>
          <div>
            {advances?.original?.advance_balance}
          </div>
        </div>
      </div>

      <Button
        type="button"
        label="Aplicar"
        className="mt-2"
        onClick={handleSubmit(handleOnSubmit)}
      />
    </form>
  );
};
