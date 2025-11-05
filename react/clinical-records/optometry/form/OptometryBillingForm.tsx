import React, { useEffect, useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  InputText,
  Dropdown,
  Calendar,
  DataTable,
  Column,
  InputNumber,
  Toast,
} from "primereact";
import { classNames } from "primereact/utils";
import {
  productService,
  paymentMethodService,
  optometryService,
  thirdPartyService,
  billingService,
} from "../../../../services/api/index.js";

import { getUserLogged } from "../../../../services/utilidades.js";
import { formatDate } from "../../../../services/utilidades.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { useCompany } from "../../../hooks/useCompany.js";

type Patient = {
  id: number;
  name: string;
};

type OptometryProduct = {
  id: string;
  name: string;
  price: number;
  type: string;
};

type PaymentMethod = {
  id: string;
  method: string;
  authorizationNumber: string;
  value: any;
};

type FormValues = {
  invoiceNumber: string;
  date: Date | null;
  patient: Patient | null;
  doctor_id: number | null;
  product: OptometryProduct | null;
  quantity: number;
  price: string;
  discount: number;
  paymentMethods: PaymentMethod[];
};

export const OptometryBillingForm: React.FC<any> = (receiptId: any) => {
  const patientId = new URLSearchParams(window.location.search).get(
    "patient_id"
  );
  const [thirdId, setThirdId] = useState<any>(null);
  const [products, setProducts] = useState<OptometryProduct[]>([]);
  const [paymentMethodsOptions, setPaymentMethodsOptions] = useState<
    PaymentMethod[]
  >([]);
  const toast = useRef<Toast>(null);

  const { control, handleSubmit, watch, setValue, trigger } =
    useForm<FormValues>({
      defaultValues: {
        invoiceNumber: "",
        date: null,
        patient: null,
        doctor_id: null,
        product: null,
        quantity: 1,
        price: "",
        discount: 0,
        paymentMethods: [
          {
            id: generateId(),
            method: "",
            authorizationNumber: "",
            value: 0, // Cambiado de null a 0 para inicializar con valor numérico
          },
        ],
      },
    });

  const formValues = watch();
  const formPaymentMethods = watch("paymentMethods");
  const userLogged = getUserLogged();
  const { company, setCompany, fetchCompany } = useCompany();
  const [billingInfo, setBillingInfo] = useState<any>(null);

  useEffect(() => {
    loadProducts();
    loadPaymentMethods();
    fetchThirdParty();
  }, []);

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async function fetchThirdParty() {
    const patientThirdParty = await thirdPartyService.getByExternalIdAndType({
      externalId: patientId,
      externalType: "client",
    });
    const billingData = await billingService.getBillingByType("consumer");
    setBillingInfo(billingData.data);
    setThirdId(patientThirdParty);
  }

  async function loadProducts() {
    try {
      const response = await productService.getAllProducts();
      const filteredProducts = response.data.filter(
        (product: any) => product.attributes.attention_type === "OPTOMETRY"
      );
      setProducts(filteredProducts);
    } catch (error) {
      showError("Error al cargar los productos");
    }
  }

  async function loadPaymentMethods() {
    try {
      const response = await paymentMethodService.getPaymentMethods();
      const filteredMethods = response.filter(
        (method: any) => method.category === "transactional"
      );
      setPaymentMethodsOptions(filteredMethods);
    } catch (error) {
      showError("Error al cargar los metodos de pago");
    }
  }

  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };

  const calculateLineTotal = (): number => {
    const quantity = Number(formValues.quantity) || 0;
    const price = Number(formValues.price) || 0;
    const discount = Number(formValues.discount) || 0;

    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);

    return subtotal - discountAmount;
  };

  const subtotal = useMemo(() => {
    return calculateLineTotal();
  }, [formValues.quantity, formValues.price, formValues.discount]);

  const totalPayments = useMemo(() => {
    return formPaymentMethods.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  }, [formPaymentMethods]);

  const paymentCoverage = useMemo(() => {
    return Math.abs(totalPayments - subtotal) < 0.01;
  }, [totalPayments, subtotal]);

  const updatePaymentValue = (index: number, value: number) => {
    const currentPayments = [...formPaymentMethods];
    currentPayments[index].value = value || 0;
    setValue("paymentMethods", currentPayments, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const addPaymentMethod = () => {
    setValue("paymentMethods", [
      ...formPaymentMethods,
      {
        id: generateId(),
        method: "",
        authorizationNumber: "",
        value: 0, // Inicializado en 0 en lugar de null
      },
    ]);
    trigger(); // Forzar actualización del formulario
  };

  const removePaymentMethod = (id: string) => {
    if (formPaymentMethods.length > 1) {
      setValue(
        "paymentMethods",
        formPaymentMethods.filter((payment) => payment.id !== id)
      );
      trigger(); // Forzar actualización del formulario
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!data.product) {
      showError("Debe seleccionar un producto");
      return;
    }

    if (!paymentCoverage) {
      showError(
        `Los pagos no cubren el total de la factura. Faltan ${(
          subtotal - totalPayments
        ).toLocaleString("es-DO", {
          style: "currency",
          currency: "DOP",
        })}`
      );
      return;
    }

    const dataRequest = {
      invoice: {
        user_id: userLogged.id,
        due_date: formatDate(new Date(), true),
        observations: "Sin observacion - receta de optometria",
        third_party_id: thirdId.id,
        sub_type: "optometry",
        billing: {
          ...billingInfo,
        },
      },
      invoice_detail: {
        product_id: data.product.id,
        type_product: "optometry",
        tax_product: 0,
      },
      payments: data.paymentMethods.map((payment) => ({
        payment_method_id: payment.method,
        payment_date: formatDate(new Date(), true),
        amount: payment.value,
        notes: "Pago sin descripcion - receta de optometria",
      })),
    };

    try {
      const response = await optometryService.createOptometryRecipe(
        dataRequest,
        receiptId.receiptId
      );

      SwalManager.success({ text: "Factura creada exitosamente" });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Error al crear la factura:", error);
    }
  };

  return (
    <div className="container-fluid p-4">
      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-0 text-primary">
                <i className="pi pi-eye me-2"></i>
                Facturación de optometría (DOP)
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Producto Optometria */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-shopping-cart me-2 text-primary"></i>
                  Producto Optometria
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {/* Campo Producto */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        Producto Optometria *
                      </label>
                      <Controller
                        name="product"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            id={field.name}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.value);
                              if (e.value && e.value.attributes.sale_price) {
                                setValue(
                                  "price",
                                  e.value.attributes.sale_price
                                );
                              }
                            }}
                            optionLabel="attributes.name"
                            placeholder="Seleccione"
                            options={products}
                            className="w-100"
                            appendTo="self"
                            filter
                            showClear
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Campo Cantidad */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Cantidad *</label>
                      <Controller
                        name="quantity"
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-100"
                            min={1}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Campo Precio */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Precio (DOP) *</label>
                      <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-100"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            min={0}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Campo Descuento */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Descuento %</label>
                      <Controller
                        name="discount"
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            value={field.value}
                            onValueChange={field.onChange}
                            className="w-100"
                            suffix="%"
                            min={0}
                            max={100}
                            readOnly
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Campo Total (readonly) */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">Total (DOP)</label>
                      <InputNumber
                        value={calculateLineTotal()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="pi pi-credit-card me-2 text-primary"></i>
                  Métodos de Pago (DOP)
                </h2>
                <Button
                  type="button"
                  label="Agregar Método"
                  className="btn btn-primary"
                  onClick={addPaymentMethod}
                />
              </div>
              <div className="card-body">
                {formPaymentMethods.map((payment, index) => (
                  <div
                    key={payment.id}
                    className="row g-3 mb-3 align-items-end"
                  >
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Método *</label>
                        <Controller
                          name={`paymentMethods.${index}.method`}
                          control={control}
                          render={({ field }) => (
                            <Dropdown
                              value={field.value}
                              optionLabel="method"
                              optionValue="id"
                              placeholder="Seleccione método"
                              options={paymentMethodsOptions}
                              className="w-100"
                              onChange={(e) => field.onChange(e.value)}
                              appendTo="self"
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Valor (DOP) *</label>
                        <Controller
                          name={`paymentMethods.${index}.value`}
                          control={control}
                          render={({ field }) => (
                            <InputNumber
                              value={field.value}
                              className="w-100"
                              mode="currency"
                              currency="DOP"
                              locale="es-DO"
                              onValueChange={(e) => {
                                field.onChange(e.value);
                                updatePaymentValue(index, e.value || 0);
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <Button
                        className="p-button-rounded p-button-danger"
                        onClick={() => removePaymentMethod(payment.id)}
                        disabled={formPaymentMethods.length <= 1}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="row mt-3">
                  <div className="col-md-12">
                    <div className="p-3 bg-gray-100 rounded">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Total factura:</strong>
                          <InputNumber
                            value={subtotal}
                            className="ml-2"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            readOnly
                          />
                        </div>
                        <div>
                          <strong>Total pagos:</strong>
                          <InputNumber
                            value={totalPayments}
                            className="ml-2"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            readOnly
                          />
                        </div>
                        <div>
                          {!paymentCoverage ? (
                            <span className="text-danger">
                              <i className="pi pi-exclamation-triangle me-1"></i>
                              Faltan{" "}
                              {(subtotal - totalPayments).toLocaleString(
                                "es-DO",
                                {
                                  style: "currency",
                                  currency: "DOP",
                                }
                              )}
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

            {/* Botones de Acción */}
            <div className="d-flex justify-content-end gap-3 mb-4">
              <Button
                label="Guardar Factura"
                icon="pi pi-save"
                className="p-button-primary"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
};
