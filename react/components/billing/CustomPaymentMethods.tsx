import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";

export interface PaymentMethod {
  id: string;
  method: string;
  authorizationNumber: string;
  value: string | number;
}

interface PaymentMethodsSectionProps {
  totalInvoice: number;
  paymentMethods: PaymentMethod[];
  availablePaymentMethods: any[];
  onPaymentMethodsChange: (paymentMethods: PaymentMethod[]) => void;
  onAdvancesFormOpen?: (customerId: number, paymentMethodId: string) => void;
  labelTotal?: string;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  totalInvoice,
  paymentMethods,
  availablePaymentMethods,
  onPaymentMethodsChange,
  labelTotal,
}) => {
  const calculateTotalPayments = (): number => {
    return paymentMethods.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };

  const paymentCoverage = (): boolean => {
    const payments = calculateTotalPayments();
    return Math.abs(payments - totalInvoice) < 0.01;
  };

  const addPayment = () => {
    const newPayment: PaymentMethod = {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: "",
    };
    onPaymentMethodsChange([...paymentMethods, newPayment]);
  };

  const removePayment = (id: string) => {
    if (paymentMethods.length > 1) {
      onPaymentMethodsChange(
        paymentMethods.filter((payment) => payment.id !== id)
      );
    }
  };

  const handlePaymentChange = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) => {
    const updatedPayments = paymentMethods.map((payment) =>
      payment.id === id ? { ...payment, [field]: value } : payment
    );
    onPaymentMethodsChange(updatedPayments);
  };

  const copyTotalToPayment = (paymentId: string) => {
    const currentPaymentsTotal = calculateTotalPayments();
    const remainingAmount = totalInvoice - currentPaymentsTotal;

    const currentPaymentValue = Number(
      paymentMethods.find((p) => p.id === paymentId)?.value || 0
    );
    const amountToSet = remainingAmount + currentPaymentValue;

    if (amountToSet > 0) {
      const updatedPayments = paymentMethods.map((payment) =>
        payment.id === paymentId
          ? { ...payment, value: parseFloat(amountToSet.toFixed(2)) }
          : payment
      );
      onPaymentMethodsChange(updatedPayments);

      window["toast"]?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Valor ${amountToSet.toFixed(2)} DOP copiado al método de pago`,
        life: 3000,
      });
    } else {
      window["toast"]?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El total ya está cubierto por los pagos actuales",
        life: 3000,
      });
    }
  };

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const totalPayments = calculateTotalPayments();
  const coverageStatus = paymentCoverage();

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header bg-light d-flex justify-content-between align-items-center p-3">
        <h2 className="h5 mb-0">
          <i className="pi pi-credit-card me-2 text-primary"></i>
          Métodos de Pago (DOP)
        </h2>
        <Button
          icon="pi pi-plus"
          label="Agregar Método"
          className="btn btn-primary"
          onClick={addPayment}
        />
      </div>
      <div className="card-body p-3">
        {paymentMethods.map((payment) => (
          <div key={payment.id} className="row g-3 mb-3 align-items-center">
            <div className="col-12 col-md-5 mb-1">
              <div className="form-group mb-2 mb-md-0">
                <label className="form-label">Método *</label>
                <Dropdown
                  required
                  value={payment.method}
                  options={availablePaymentMethods}
                  optionLabel="method"
                  optionValue="id"
                  placeholder="Seleccione método"
                  className="w-100"
                  onChange={(e) => {
                    handlePaymentChange(payment.id, "method", e.value);
                  }}
                  appendTo={"self"}
                  filter
                />
              </div>
            </div>

            <div className="col-12 col-md-5">
              <div className="form-group mb-2 mb-md-0">
                <label className="form-label">Valor *</label>
                <div className="d-flex gap-2 align-items-center flex-nowrap">
                  <InputNumber
                    value={payment.value === "" ? null : payment.value}
                    placeholder="RD$ 0.00"
                    className="flex-grow-1"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    min={0}
                    onValueChange={(e) =>
                      handlePaymentChange(
                        payment.id,
                        "value",
                        e.value === null ? "" : e.value
                      )
                    }
                    inputClassName="form-control"
                  />
                  <Button
                    icon={<i className="fa-solid fa-copy"></i>}
                    className="p-button-outlined p-button-info p-button-sm"
                    onClick={() => copyTotalToPayment(payment.id)}
                    tooltip="Copiar valor total restante"
                    tooltipOptions={{ position: "top" }}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-2 mt-3">
              <Button
                type="submit"
                className="p-button-rounded p-button-danger p-button-text p-button-sm mt-4"
                onClick={() => removePayment(payment.id)}
                disabled={paymentMethods.length <= 1}
                tooltip="Eliminar método"
                tooltipOptions={{ position: "top" }}
              >
                <i className="fa-solid fa-trash"></i>
              </Button>
            </div>
          </div>
        ))}

        {/* Resumen de pagos */}
        <div className="row mt-3">
          <div className="col-12">
            <div
              className="alert alert-info p-3"
              style={{
                background: "rgb(194 194 194 / 85%)",
                border: "none",
                color: "black",
              }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                <div className="d-flex align-items-center flex-wrap">
                  <strong className="me-2">
                    {labelTotal ? labelTotal : "Total factura"}:
                  </strong>
                  <InputNumber
                    value={totalInvoice}
                    className="me-3"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    minFractionDigits={2}
                    maxFractionDigits={3}
                    readOnly
                    inputClassName="form-control bg-white"
                    style={{ minWidth: "130px" }}
                  />
                </div>
                <div className="d-flex align-items-center flex-wrap">
                  <strong className="me-2">Total pagos:</strong>
                  <InputNumber
                    value={totalPayments}
                    className="me-3"
                    mode="currency"
                    currency="DOP"
                    locale="es-DO"
                    minFractionDigits={2}
                    maxFractionDigits={3}
                    readOnly
                    inputClassName="form-control bg-white"
                    style={{ minWidth: "130px" }}
                  />
                </div>
                <div className="d-flex align-items-center">
                  {!coverageStatus ? (
                    <span className="text-danger">
                      <i className="pi pi-exclamation-triangle me-1"></i>
                      Faltan {(totalInvoice - totalPayments).toFixed(2)} DOP
                    </span>
                  ) : (
                    <span className="text-success">
                      <i className="pi pi-check-circle me-1"></i>
                      Pagos completos
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
