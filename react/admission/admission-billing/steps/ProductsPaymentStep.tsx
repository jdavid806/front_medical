import React, { useState, useEffect } from "react";
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
  validatePaymentStep,
} from "../utils/helpers";
import { useAppointmentProcedures } from "../../../appointments/hooks/useAppointmentProcedures";
import { AdmissionBillingFormData } from "../interfaces/AdmisionBilling";
import { usePaymentMethods } from "../../../payment-methods/hooks/usePaymentMethods";

interface ProductsPaymentStep {
  formData: AdmissionBillingFormData;
  updateFormData: <K extends keyof AdmissionBillingFormData>(
    section: K,
    data: Partial<AdmissionBillingFormData[K]>
  ) => void;
  addPayment: (payment: any) => void;
  removePayment: (id: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  toast: React.RefObject<Toast | null>;
  productsToInvoice?: any[];
  productsLoading?: boolean;
}

const ProductsPaymentStep: React.FC<ProductsPaymentStep> = ({
  updateFormData,
  addPayment,
  removePayment,
  nextStep,
  prevStep,
  toast,
  productsToInvoice = [],
  productsLoading = false,
  formData,
}) => {
  const [showChangeField, setShowChangeField] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [modalAmount, setModalAmount] = useState(0);
  const [modalChange, setModalChange] = useState(0);
  const [selectedProcedure, setSelectedProcedure] = useState<any>(null);
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<any[]>(
    []
  );

  const total = calculateTotal(
    formData.products,
    formData.billing.facturacionEntidad
  );
  const paid = calculatePaid(formData.payments);
  const change = calculateChange(total, paid);
  const remaining = Math.max(0, total - paid);

  const { procedureOptions, loadProcedures } = useAppointmentProcedures();
  const { paymentMethods, fetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    loadProcedures();
    fetchPaymentMethods();
  }, []);

  useEffect(() => {
    if (paymentMethods) {
      const filtered = paymentMethods.filter(
        (method: any) =>
          method.category === "transactional" &&
          method.payment_type === "sale"
      );
      setFilteredPaymentMethods(filtered);
    }
  }, [paymentMethods]);

  const handleAddProduct = () => {
    if (!selectedProcedure) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe seleccionar un procedimiento primero",
        life: 3000,
      });
      return;
    }

    const procedure =
      selectedProcedure.item || selectedProcedure.value || selectedProcedure;

    if (!procedure || !procedure.id) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El procedimiento seleccionado no es válido",
        life: 3000,
      });
      return;
    }

    const price = formData.billing.facturacionEntidad
      ? procedure.copayment
      : procedure.sale_price;

    const newProduct = {
      uuid: `${Math.random().toString(36).slice(2, 8)}${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      id: procedure.id,
      code: procedure.barcode || `PROC-${procedure.id}`,
      name: procedure.name || "Procedimiento sin nombre",
      description:
        procedure.description || procedure.name || "Procedimiento médico",
      price: procedure.sale_price,
      copayment: procedure.copayment,
      currentPrice: price,
      quantity: 1,
      tax: procedure.tax_charge?.percentage || 0,
      discount: 0,
      total: (price || 0) * (1 + (procedure.tax_charge?.percentage || 0) / 100),
    };

    formData.products = [...formData.products, newProduct];

    setSelectedProcedure(null);
  };

  useEffect(() => {
    setModalAmount(remaining);
    setModalChange(0);
  }, [formData.products, formData.billing.facturacionEntidad]);

  const handleRemoveProduct = (uuid: string) => {
    const updatedProducts = formData.products.filter(
      (product) => product.uuid !== uuid
    );

    updateFormData("products", updatedProducts);

    toast.current?.show({
      severity: "success",
      summary: "Producto eliminado",
      detail: "El producto ha sido removido correctamente",
      life: 3000,
    });
  };

  const handleRemovePayment = (id: number) => {
    removePayment(id);

    toast.current?.show({
      severity: "success",
      summary: "Pago eliminado",
      detail: "El pago ha sido removido correctamente",
      life: 3000,
    });
  };

  const handlePaymentChange = (field: string, value: any) => {
    updateFormData("currentPayment", { [field]: value });

    if (field === "method") {
      setShowChangeField(value === "CASH");
    }
  };

  const handleAddPayment = () => {
    const { method } = formData.currentPayment;

    if (remaining <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El pago ya ha sido completado",
        life: 3000,
      });
      return;
    }

    if (!method || !modalAmount) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Método de pago y monto son requeridos",
        life: 3000,
      });
      return;
    }

    const paymentAmount = modalAmount;
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "El monto debe ser un número válido mayor a 0",
        life: 3000,
      });
      return;
    }

    // if (paymentAmount > remaining) {
    //   toast.current?.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: `El monto no puede exceder el saldo pendiente: ${formatCurrency(
    //       remaining
    //     )}`,
    //     life: 3000,
    //   });
    //   return;
    // }

    addPayment({
      method: method.method as string,
      amount: paymentAmount,
      total: paymentAmount - modalChange,
      change: modalChange,
      authorizationNumber: formData.currentPayment.authorizationNumber,
      notes: formData.currentPayment.notes,
    });

    setModalAmount(0);
    setModalChange(0);

    updateFormData("currentPayment", {
      method: "",
      amount: 0,
      authorizationNumber: "",
      notes: "",
    });

    setShowChangeField(false);
  };

  const handleNext = () => {
    const validProducts = formData.products.filter(
      (product) =>
        product &&
        product.description &&
        product.price !== undefined &&
        product.quantity !== undefined
    );

    if (validProducts.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No hay productos válidos para facturar",
        life: 3000,
      });
      return;
    }

    const total = calculateTotal(
      validProducts,
      formData.billing.facturacionEntidad
    );

    if (
      validateProductsStep(validProducts, toast) &&
      validatePaymentStep(formData.payments, total, toast)
    ) {
      nextStep();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculateModalChange = (amount: number) => {
    setModalAmount(amount);
    setModalChange(Math.max(0, amount - remaining));
  };

  const applyModalPayment = () => {
    updateFormData("currentPayment", {
      ...formData.currentPayment,
      method: "CASH",
      amount: modalAmount,
    });
    setShowPaymentModal(false);
    setShowChangeField(true);
  };

  const productPriceBodyTemplate = (rowData: any) => {
    return formatCurrency(rowData.currentPrice);
  };

  const productTaxBodyTemplate = (rowData: any) => {
    return <Tag value={`${rowData.tax}%`} severity="info" />;
  };

  const productTotalBodyTemplate = (rowData: any) => {
    const total =
      rowData.currentPrice * rowData.quantity * (1 + rowData.tax / 100);
    return <strong>{formatCurrency(total)}</strong>;
  };

  const paymentAmountBodyTemplate = (rowData: any) => {
    return <span className="font-bold">{formatCurrency(rowData.total)}</span>;
  };

  const paymentChangeBodyTemplate = (rowData: any) => {
    return <span className="font-bold">{formatCurrency(rowData.change)}</span>;
  };

  const paymentMethodBodyTemplate = (rowData: any) => {
    return (
      <div className="flex align-items-center gap-2">
        <i className={`mr-2`}></i>
        <span>{rowData.method}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <Button
        icon={<i className="fas fa-trash"></i>}
        className="p-button-danger p-button-rounded p-button-outlined p-button-sm"
        onClick={() => handleRemoveProduct(rowData.uuid)}
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
      />
    );
  };

  useEffect(() => {
    if (productsToInvoice.length > 0 && formData.products.length === 0) {
      const initialProducts = productsToInvoice.map((product) => ({
        uuid: product.uuid,
        id: product.id,
        productId: product.id,
        code: product.barcode || `PROD-${product.id}`,
        name: product.name || product.description || `Producto ${product.id}`,
        description:
          product.description || product.name || `Producto ${product.id}`,
        price: product.sale_price || 0,
        copayment: product.copayment || 0,
        currentPrice:
          (formData.billing.facturacionEntidad
            ? product.copayment
            : product.sale_price) || 0,
        quantity: 1,
        tax: product.tax_charge?.percentage || 0,
        discount: 0,
        total:
          (product.sale_price || 0) *
          (1 + (product.tax_charge?.percentage || 0) / 100),
      }));

      updateFormData("products", initialProducts);
      setModalAmount(remaining);
    }
  }, [productsToInvoice, formData.billing.facturacionEntidad]);

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
          {productsToInvoice.length == 0 && (
            <>
              <div className="d-flex pt-4 mb-2">
                <div className="d-flex flex-grow-1 me-2">
                  <Dropdown
                    placeholder="Seleccione un procedimiento"
                    options={procedureOptions}
                    value={selectedProcedure}
                    onChange={(e) => setSelectedProcedure(e.value)}
                    optionLabel="label"
                    filter
                    showClear
                    className="w-100"
                    panelClassName="shadow-3 w-100"
                    emptyMessage="No se encontraron procedimientos"
                  />
                </div>
                <Button
                  label="Agregar Producto"
                  className="p-button-primary d-flex"
                  icon={<i className="fas fa-plus-square"></i>}
                  onClick={handleAddProduct}
                  disabled={!selectedProcedure}
                  tooltip="Agregar procedimiento seleccionado"
                />
              </div>
            </>
          )}

          <div className="border-round border-1 surface-border">
            <DataTable
              value={formData.products}
              className="p-datatable-sm p-datatable-gridlines"
              scrollable
              scrollHeight="flex"
              emptyMessage="No se han agregado productos"
              stripedRows
            >
              <Column field="code" header="Código"></Column>
              <Column field="description" header="Descripción"></Column>
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
                header="Acciones"
                body={(rowData) => (
                  <Button
                    icon={<i className="fas fa-trash"></i>}
                    className="p-button-danger p-button-rounded p-button-outlined p-button-sm"
                    onClick={() => handleRemoveProduct(rowData.uuid)}
                    tooltip="Eliminar"
                    tooltipOptions={{ position: "top" }}
                  />
                )}
                headerStyle={{ width: "100px" }}
                bodyStyle={{ textAlign: "center" }}
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
          <div className="row">
            <div className="col-12 col-md-6 pb-4">
              {change > 0 && (
                <Card className="mb-4 border-left-3 border-teal-500 bg-teal-50">
                  <div className="flex justify-content-between align-items-center p-3">
                    <div className="flex align-items-center gap-2">
                      <i className="fas fa-money-bill-wave text-teal-500"></i>
                      <span className="text-lg font-medium">
                        Cambio a devolver
                      </span>
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
                    field="change"
                    header="Cambio"
                    body={paymentChangeBodyTemplate}
                  ></Column>
                  <Column
                    header="Acciones"
                    body={(rowData) => (
                      <Button
                        icon={<i className="fas fa-trash"></i>}
                        className="p-button-danger p-button-rounded p-button-outlined p-button-sm"
                        onClick={() => handleRemovePayment(rowData.id)}
                        tooltip="Eliminar"
                        tooltipOptions={{ position: "top" }}
                      />
                    )}
                    headerStyle={{ width: "80px" }}
                  />
                </DataTable>
              </div>
            </div>

            <div className="surface-card px-4 pb-4 border-round-lg border-1 surface-border shadow-2 col-12 col-md-6">
              <div className="d-flex align-items-center mb-4 gap-3">
                <h3 className="m-0 text-700 text-right">
                  <i className="fas fa-credit-card mr-3 text-xl text-primary"></i>
                  Agregar Nuevo Pago
                </h3>
              </div>

              <Card className="border-round-lg shadow-1 mb-4">
                <div className="d-flex flex-column gap-3">
                  <div className="p-fluid">
                    <div className="field">
                      <label
                        htmlFor="paymentMethod"
                        className="block font-medium mb-2"
                      >
                        <i className="fas fa-money-check-alt mr-2"></i>Método de
                        pago
                      </label>
                      <Dropdown
                        inputId="paymentMethod"
                        options={filteredPaymentMethods}
                        value={formData.currentPayment.method}
                        onChange={(e) => handlePaymentChange("method", e.value)}
                        placeholder="Seleccione método..."
                        className="w-100"
                        optionLabel="method"
                        panelClassName="shadow-3"
                        showClear
                        filter
                        filterPlaceholder="Buscar método..."
                        emptyFilterMessage="No se encontraron métodos"
                        disabled={remaining <= 0}
                      />
                      {remaining <= 0 && (
                        <div className="mt-2 p-3 border-round-lg bg-green-100 text-green-800">
                          <i className="fas fa-check-circle mr-2"></i>
                          El pago ha sido completado en su totalidad
                        </div>
                      )}
                    </div>
                    {formData.currentPayment.method.is_cash && (
                      <>
                        <div className="field mt-4">
                          <label
                            htmlFor="remainingAmount"
                            className="block font-medium mb-2"
                          >
                            <i className="fas fa-receipt mr-2"></i>Total
                            Pendiente
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
                          <label
                            htmlFor="cashAmount"
                            className="block font-medium mb-2"
                          >
                            <i className="fas fa-hand-holding-usd mr-2"></i>
                            Monto Recibido
                          </label>
                          <InputNumber
                            id="cashAmount"
                            value={modalAmount}
                            onValueChange={(e) =>
                              calculateModalChange(e.value || 0)
                            }
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            className="w-full"
                            inputClassName="font-bold"
                            min={0}
                          />
                        </div>

                        <div className="field mt-4">
                          <label
                            htmlFor="changeAmount"
                            className="block font-medium mb-2"
                          >
                            <i className="fas fa-exchange-alt mr-2"></i>Cambio a
                            Devolver
                          </label>
                          <InputNumber
                            id="changeAmount"
                            value={modalChange}
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            readOnly
                            className={`w-full ${
                              modalChange > 0 ? "bg-green-100 font-bold" : ""
                            }`}
                            inputClassName={
                              modalChange > 0 ? "text-green-700" : ""
                            }
                          />
                        </div>
                      </>
                    )}
                    {formData.currentPayment.method.method != "Efectivo" &&
                      remaining > 0 && (
                        <>
                          <div className="field mt-4">
                            <label
                              htmlFor="cashAmount"
                              className="block font-medium mb-2"
                            >
                              <i className="fas fa-hand-holding-usd mr-2"></i>
                              Monto Recibido
                            </label>
                            <InputNumber
                              id="cashAmount"
                              value={modalAmount}
                              onValueChange={(e) =>
                                calculateModalChange(e.value || 0)
                              }
                              mode="currency"
                              currency="DOP"
                              locale="es-DO"
                              className="w-full"
                              inputClassName="font-bold"
                            />
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </Card>

              <div className="d-flex mt-4">
                <Button
                  label="Agregar Pago"
                  icon={<i className="fas fa-cash-register"></i>}
                  className="p-button-primary"
                  onClick={handleAddPayment}
                  tooltip="Agregar este pago al registro"
                  tooltipOptions={{ position: "left" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="col-12">
        <div className="d-flex justify-content-between pt-4">
          <Button
            label="Atrás"
            icon={<i className="fas fa-arrow-left me-1"></i>}
            onClick={prevStep}
            className="p-button-secondary"
          />
          <Button
            label="Continuar"
            icon={<i className="fas fa-save me-1"></i>}
            className="p-button-primary"
            onClick={handleNext}
            disabled={
              (formData.payments.length === 0 && total > 0) ||
              formData.products.length === 0
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPaymentStep;
