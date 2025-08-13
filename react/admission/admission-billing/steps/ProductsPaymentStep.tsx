import React, { useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import {
  calculateTotal,
  calculatePaid,
  calculateChange,
  validateProductsStep,
  validatePaymentStep
} from "../utils/helpers";
import { paymentMethodOptions } from "../utils/constants";

interface ProductsPaymentStep {
  formData: any;
  updateFormData: (section: string, data: any) => void;
  addPayment: (payment: any) => void;
  removePayment: (id: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toast: React.RefObject<Toast>;
}

const ProductsPaymentStep: React.FC<ProductsPaymentStep> = ({
  formData,
  updateFormData,
  addPayment,
  removePayment,
  nextStep,
  prevStep,
  toast,
}) => {
  const [showChangeField, setShowChangeField] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [modalChange, setModalChange] = useState(0);

  const total = calculateTotal(formData.products);
  const paid = calculatePaid(formData.payments);
  const change = calculateChange(total, paid);
  const remaining = Math.max(0, total - paid);

  const getPaymentMethodLabel = (value: string) => {
    return paymentMethodOptions.find(m => m.value === value)?.label || value;
  };

  const getPaymentMethodIcon = (method: string) => {
    const methodLabel = paymentMethodOptions.find(m => m.value === method)?.label || method;

    switch (methodLabel) {
      case 'Efectivo': return 'fa-money-bill-wave';
      case 'Tarjeta de Crédito': return 'fa-credit-card';
      case 'Transferencia Bancaria': return 'fa-bank';
      case 'Cheque': return 'fa-file-invoice-dollar';
      default: return 'fa-wallet';
    }
  };

  const handleAddProduct = (product: any) => {
    // Lógica para agregar producto
  };

  const handleRemoveProduct = (id: number) => {
    updateFormData(
      "products",
      formData.products.filter((p: any) => p.id !== id)
    );
  };


  const handlePaymentChange = (field: string, value: any) => {
    updateFormData("currentPayment", { [field]: value });

    if (field === 'method') {
      setShowChangeField(value === 'CASH');
    }
  };

  const handleAddPayment = () => {
    const { method, amount } = formData.currentPayment;

    if (!method || !amount) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Método de pago y monto son requeridos",
        life: 3000,
      });
      return;
    }

    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount)) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El monto debe ser un número válido",
        life: 3000,
      });
      return;
    }

    addPayment({
      method: method,
      amount: paymentAmount,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes,
    });

    updateFormData("currentPayment", {
      method: "",
      amount: "",
      authorizationNumber: "",
      notes: "",
    });

    setShowChangeField(false);
  };

  const handleNext = () => {
    const total = calculateTotal(formData.products);
    if (
      validateProductsStep(formData.products, toast) &&
      validatePaymentStep(formData.payments, total, toast)
    ) {
      nextStep();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const openPaymentModal = () => {
    setShowPaymentModal(true);
    setModalAmount(remaining);
    setModalChange(0);
  };

  const calculateModalChange = (amount: number) => {
    setModalAmount(amount);
    setModalChange(Math.max(0, amount - remaining));
  };

  const applyModalPayment = () => {
    updateFormData("currentPayment", {
      ...formData.currentPayment,
      method: "CASH",
      amount: modalAmount
    });
    setShowPaymentModal(false);
    setShowChangeField(true);
  };

  const productPriceBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.price);
  };

  const productTaxBodyTemplate = (rowData: any) => {
    return <Tag value={`${rowData.tax}%`} severity="info" />;
  };

  const productTotalBodyTemplate = (rowData: any) => {
    const total = rowData.price * rowData.quantity * (1 + rowData.tax / 100);
    return <strong>{formatCurrency(total)}</strong>;
  };

  const paymentAmountBodyTemplate = (rowData: any) => {
    return <span className="font-bold">{formatCurrency(rowData.amount)}</span>;
  };

  const paymentMethodBodyTemplate = (rowData: any) => {
    const methodLabel = paymentMethodOptions.find(m => m.value === rowData.method)?.label || rowData.method;
    return (
      <div className="flex align-items-center gap-2">
        <i className={`fas ${getPaymentMethodIcon(rowData.method)} mr-2`}></i>
        <span>{methodLabel}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any, isProduct: boolean) => {
    return (
      <Button
        icon={<i className="fas fa-trash"></i>}
        className="p-button-danger p-button-rounded p-button-outlined p-button-sm"
        onClick={() =>
          isProduct
            ? handleRemoveProduct(rowData.id)
            : removePayment(rowData.id)
        }
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
      />
    );
  };

  const paymentModalFooter = (
    <div>
      <Button
        label="Cancelar"
        icon={<i className="fas fa-times"></i>}
        onClick={() => setShowPaymentModal(false)}
        className="p-button-text"
      />
      <Button
        label="Aplicar Pago"
        icon={<i className="fas fa-check"></i>}
        onClick={applyModalPayment}
        disabled={modalAmount <= 0}
        className="p-button-success"
      />
    </div>
  );

  return (
    <div className="grid">
      <div className="col-12 md:col-8">
        <Card
          title={
            <>
              <i className="fas fa-shopping-cart mr-2"></i> Lista de Productos
            </>
          }
          className="mb-4 shadow-3"
        >
          <div className="flex flex-column md:flex-row gap-3 mb-2">
            <div className="flex-1 mb-4">
              <Dropdown
                placeholder="Seleccione un producto"
                options={[
                  {
                    label: "Consulta Endocrinologia",
                    value: "Consulta Endocrinologia",
                  },
                ]}
                className="w-full"
                panelClassName="shadow-3"
              />
            </div>
            <Button
              label="Agregar Producto"
              className="p-button-secondary p-button-sm mb-2"
              icon={<i className="fas fa-plus-square"></i>}
              onClick={() => handleAddProduct({})}
            />
          </div>

          <div className="border-round border-1 surface-border">
            <DataTable
              value={formData.products}
              className="p-datatable-sm p-datatable-gridlines"
              scrollable
              scrollHeight="flex"
              emptyMessage="No se han agregado productos"
              stripedRows
            >
              <Column
                field="id"
                header="#"
                headerStyle={{ width: "50px" }}
              ></Column>
              <Column
                field="description"
                header="Descripción"
                headerStyle={{ minWidth: "200px" }}
              ></Column>
              <Column
                field="price"
                header="Precio Unitario"
                body={productPriceBodyTemplate}
              ></Column>
              <Column field="quantity" header="Cantidad"></Column>
              <Column
                field="tax"
                header="Impuesto"
                body={productTaxBodyTemplate}
              ></Column>
              <Column
                field="total"
                header="Total"
                body={productTotalBodyTemplate}
              ></Column>
              <Column
                field="Actions"
                header="Acciones"
                body={(rowData) => actionBodyTemplate(rowData, true)}
                headerStyle={{ width: "80px" }}
              ></Column>
            </DataTable>
          </div>

          <Divider />

          <div className="flex justify-content-end align-items-center gap-3 mt-3">
            <span className="text-lg">Total General:</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-4">
        <Card
          title={
            <>
              <i className="fas fa-credit-card mr-2"></i> Métodos de Pago
            </>
          }
          className="mb-4 shadow-3"
        >
          {/* Tarjetas de resumen mejoradas */}
          <div className="grid mb-4">
            <div className="col-12 md:col-6">
              <Card className="mb-3 border-left-3 border-green-500 bg-green-50">
                <div className="flex flex-column p-3">
                  <div className="flex align-items-center gap-2 mb-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span className="text-sm font-medium">Total Pagado</span>
                  </div>
                  <span className="text-xl font-bold text-green-700">
                    {formatCurrency(paid)}
                  </span>
                </div>
              </Card>
            </div>
            <div className="col-12 md:col-6">
              <Card className="mb-3 border-left-3 border-blue-500 bg-blue-50">
                <div className="flex flex-column p-3">
                  <div className="flex align-items-center gap-2 mb-2">
                    <i className="fas fa-exclamation-circle text-blue-500"></i>
                    <span className="text-sm font-medium">Saldo Pendiente</span>
                  </div>
                  <span className="text-xl font-bold text-blue-700">
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </Card>
            </div>
          </div>

          {change > 0 && (
            <Card className="mb-4 border-left-3 border-teal-500 bg-teal-50">
              <div className="flex justify-content-between align-items-center p-3">
                <div className="flex align-items-center gap-2">
                  <i className="fas fa-money-bill-wave text-teal-500"></i>
                  <span className="text-lg font-medium">Cambio a devolver</span>
                </div>
                <span className="text-xl font-bold text-teal-700">
                  {formatCurrency(change)}
                </span>
              </div>
            </Card>
          )}

          <div className="border-round border-1 surface-border mb-4">
            <DataTable
              value={formData.payments}
              className="p-datatable-sm p-datatable-gridlines"
              emptyMessage={
                <div className="text-center p-4">
                  <i className="fas fa-info-circle mr-2"></i>
                  No se han agregado métodos de pago
                </div>
              }
              stripedRows
            >
              <Column
                field="id"
                header="#"
                headerStyle={{ width: "50px" }}
              ></Column>
              <Column
                field="method"
                header="Método"
                body={paymentMethodBodyTemplate}
              ></Column>
              <Column
                field="amount"
                header="Monto"
                body={paymentAmountBodyTemplate}
              ></Column>
              <Column
                header="Acciones"
                body={(rowData) => actionBodyTemplate(rowData, false)}
                headerStyle={{ width: "80px" }}
              ></Column>
            </DataTable>
          </div>

          <Dialog
            header={
              <div className="flex align-items-center gap-2">
                <i className="fas fa-calculator"></i>
                <span>Calcular Pago en Efectivo</span>
              </div>
            }
            visible={showPaymentModal}
            style={{ width: '450px' }}
            footer={paymentModalFooter}
            onHide={() => setShowPaymentModal(false)}
            breakpoints={{ '960px': '75vw', '640px': '90vw' }}
          >
            <div className="p-fluid">
              <div className="field">
                <label htmlFor="remainingAmount" className="block font-medium mb-2">
                  <i className="fas fa-receipt mr-2"></i>Total Pendiente
                </label>
                <InputNumber
                  id="remainingAmount"
                  value={remaining}
                  mode="currency"
                  currency="DOP"
                  locale="es-DO"
                  readOnly
                  className="w-full"
                  inputClassName="font-bold"
                />
              </div>

              <div className="field mt-4">
                <label htmlFor="cashAmount" className="block font-medium mb-2">
                  <i className="fas fa-hand-holding-usd mr-2"></i>Monto Recibido
                </label>
                <InputNumber
                  id="cashAmount"
                  value={modalAmount}
                  onValueChange={(e) => calculateModalChange(e.value || 0)}
                  mode="currency"
                  currency="DOP"
                  locale="es-DO"
                  className="w-full"
                  inputClassName="font-bold"
                />
              </div>

              <div className="field mt-4">
                <label htmlFor="changeAmount" className="block font-medium mb-2">
                  <i className="fas fa-exchange-alt mr-2"></i>Cambio a Devolver
                </label>
                <InputNumber
                  id="changeAmount"
                  value={modalChange}
                  mode="currency"
                  currency="DOP"
                  locale="es-DO"
                  readOnly
                  className={`w-full ${modalChange > 0 ? 'bg-green-100 font-bold' : ''}`}
                  inputClassName={modalChange > 0 ? 'text-green-700' : ''}
                />
              </div>
            </div>
          </Dialog>

          <div className="surface-card p-4 border-round-lg border-1 surface-border shadow-2">
            <div className="flex align-items-center mb-4">
              <h3 className="m-0 text-700">
                Agregar Nuevo Pago
                <i className="fas fa-credit-card mr-3 text-xl text-primary">
                </i>
              </h3>
            </div>

            <Button
              label="Calcular Pago en Efectivo"
              icon={<i className="fas fa-calculator"></i>}
              className="mb-3 w-full p-button-outlined"
              onClick={openPaymentModal}
            />

            <Card className="border-round-lg shadow-1 mb-4">
              <div className="grid">
                <div className="col-12 md:col-6">
                  <div className="field mb-4">
                    <label
                      htmlFor="paymentMethod"
                      className="block font-medium mb-2 text-700"
                    >
                      <i className="fas fa-money-check-alt mr-2"></i>Método de pago <span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      inputId="paymentMethod"
                      options={paymentMethodOptions}
                      value={formData.currentPayment.method}
                      onChange={(e) => handlePaymentChange("method", e.value)}
                      placeholder="Seleccione método..."
                      className="w-full"
                      optionLabel="label"
                      panelClassName="shadow-3"
                      showClear
                      filter
                      filterPlaceholder="Buscar método..."
                      emptyFilterMessage="No se encontraron métodos"
                    />
                    {!formData.currentPayment.method && (
                      <small className="p-error block mt-1">
                        Seleccione un método de pago
                      </small>
                    )}
                  </div>
                </div>

                <div className="col-12 md:col-6">
                  <div className="field mb-4">
                    <label
                      htmlFor="paymentAmount"
                      className="block font-medium mb-2 text-700"
                    >
                      <i className="fas fa-dollar-sign mr-2"></i>Monto <span className="text-red-500">*</span>
                    </label>
                    <InputNumber
                      inputId="paymentAmount"
                      value={formData.currentPayment.amount}
                      onValueChange={(e) =>
                        handlePaymentChange("amount", e.value)
                      }
                      className="w-full"
                      mode="currency"
                      currency="DOP"
                      locale="es-DO"
                      min={0}
                      maxFractionDigits={2}
                      showButtons
                      buttonLayout="horizontal"
                      incrementButtonIcon={<i className="fas fa-plus-square"></i>}
                      decrementButtonIcon={<i className="fas fa-window-close"></i>}
                    />
                    {(!formData.currentPayment.amount ||
                      formData.currentPayment.amount <= 0) && (
                        <small className="p-error block mt-1">
                          Ingrese un monto válido
                        </small>
                      )}
                  </div>
                </div>

                {showChangeField && formData.currentPayment.amount > 0 && (
                  <div className="col-12">
                    <div className="p-3 bg-green-100 border-round mb-3 border-1 border-green-200">
                      <div className="flex justify-content-between align-items-center">
                        <div className="flex align-items-center gap-2">
                          <i className="fas fa-money-bill-wave text-green-600"></i>
                          <span className="font-medium">Cambio a devolver:</span>
                        </div>
                        <span className="font-bold text-green-700">
                          {formatCurrency(calculateChange(total, formData.currentPayment.amount))}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className="flex justify-content-end mt-4">
              <Button
                label="Agregar Pago"
                icon={<i className="fas fa-cash-register"></i>}
                className="p-button-success"
                onClick={handleAddPayment}
                disabled={
                  !formData.currentPayment.method ||
                  !formData.currentPayment.amount
                }
                tooltip="Agregar este pago al registro"
                tooltipOptions={{ position: "top" }}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="d-flex pt-4 justify-content-between gap-3">
        <Button
          label="Atrás"
          icon={<i className="fas fa-arrow-left me-1"></i>}
          onClick={prevStep}
          className="p-button-secondary"
          tooltip="Volver al paso anterior"
        />
        <Button
          className="p-button-primary"
          label="Continuar"
          icon={<i className="fas fa-save me-1"></i>}
          iconPos="right"
          onClick={handleNext}
          disabled={
            formData.payments.length === 0 || formData.products.length === 0
          }
          tooltip="Ir al siguiente paso"
        />
      </div>
    </div>
  );
};

export default ProductsPaymentStep;