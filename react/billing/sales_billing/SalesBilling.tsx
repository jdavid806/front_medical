import React, { use, useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { DropdownChangeEvent } from "primereact/dropdown";
import { Dropdown } from "primereact";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../third-parties/hooks/useThirdParties";
import { useProductTypes } from "../../product-types/hooks/useProductTypes";
import { useProducts } from "../../products/hooks/useProducts";
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods";
import { userService } from "../../../services/api";
import { invoiceService } from "../../../services/api";
import { SwalManager } from "../../../services/alertManagerImported";
import { useUsers } from "../../users/hooks/useUsers";
import { useEffect } from "react";
import { useTaxes } from "../../invoices/hooks/useTaxes";
import AdvanceHistoryModal from "./modal/ModalAdvanceHistory";
import { AdvancePayment } from "./modal/ModalAdvanceHistory";
import { useInventory } from "../purchase_billing/hooks/useInventory";
import {
  RetentionItem,
  RetentionsSection,
} from "../purchase_billing/retention/RetentionsSection";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts";
import { Deposit } from "../purchase_billing/types/MappedPurchase";
import { InvoiceProduct, PaymentMethod } from "./types/MappedSalesBilling";
import { useAccountingAccountsByCategory } from "../../accounting/hooks/useAccountingAccounts";
import AdvanceHistoryForm from "./modal/FormAdvanceHistory";
import { FormAdvanceCopy } from "./modal/FormAdvanceCopy";
import { depositService } from "../../../services/api";
import { Dialog } from "primereact/dialog";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useBillingByType } from "../hooks/useBillingByType";
import { useThirdPartyModal } from "../third-parties/hooks/useThirdPartyModal";

export const SalesBilling: React.FC<any> = ({
  selectedInvoice,
  successSale,
}) => {
  const { control, getValues, setValue, handleSubmit, watch } = useForm();

  const { thirdParties, fetchThirdParties } = useThirdParties();

  const { users } = useUsers();

  const { productTypes, loading: loadingProductTypes } = useProductTypes();

  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<
    PaymentMethod[]
  >([]);

  const [showAdvancesForm, setShowAdvancesForm] = useState(false);

  const [selectedAdvanceMethodId, setSelectedAdvanceMethodId] = useState<
    string | null
  >(null);

  const [customerId, setCustomerId] = useState<number | null>(null);

  const [disabledInpputs, setDisabledInputs] = useState(false);

  const [purchaseOrderId, setPurchaseOrderId] = useState<any>(0);

  const { fetchBillingByType } = useBillingByType();

  const [billing, setBilling] = useState<any>(null);

  const invoiceType = watch("type");

  useEffect(() => {
    if (paymentMethods) {
      setFilteredPaymentMethods(
        paymentMethods.filter((paymentMethod) =>
          ["transactional", "customer_advance", "customer_expiration"].includes(
            paymentMethod.category
          )
        )
      );
    }
  }, [paymentMethods]);

  const [productsArray, setProductsArray] = useState<InvoiceProduct[]>([
    {
      id: generateId(),
      typeProduct: "",
      product: "",
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      discountType: "percentage",
      iva: 0,
    },
  ]);
  const [retentions, setRetentions] = useState<RetentionItem[]>([
    {
      id: generateId(),
      percentage: 0,
      value: 0,
    },
  ]);
  const [paymentMethodsArray, setPaymentMethodsArray] = useState<
    PaymentMethod[]
  >([
    {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: "",
    },
  ]);
  const { centresCosts } = useCentresCosts();

  const { fetchAdvancePayments, loading, advances } = useAdvancePayments();

  useEffect(() => {
    if (!selectedInvoice) {
      return;
    }
    fetchAdvancePayments(selectedInvoice.third_id || customerId, "client");
  }, [selectedInvoice, customerId]);

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const typeOptions = [
    { id: "tax_invoice", name: "Fiscal" },
    { id: "consumer", name: "Consumidor" },
    { id: "government_invoice", name: "Gubernamental" },
  ];

  useEffect(() => {
    handleProductsToInvoice(selectedInvoice);
  }, [selectedInvoice && centresCosts]);

  function handleProductsToInvoice(selectedInvoice: any) {
    setProductsArray([]);
    if (selectedInvoice) {
      setValue("supplier", selectedInvoice.third_id);
      setValue("elaborationDate", new Date(selectedInvoice.created_at));
      setValue("expirationDate", new Date(selectedInvoice.due_date));
      const selectedCostCenter = centresCosts.find(
        (cc) => cc.id == selectedInvoice.cost_center_id
      );
      setValue("costCenter", selectedCostCenter);
      setValue("seller_id", Number(selectedInvoice.buyer_id));
      setPurchaseOrderId(selectedInvoice.id);
      const productsMapped = selectedInvoice.details.map((item: any) => {
        let typeProduct = "";
        if (item.product?.product_type) {
          switch (item.product.product_type.name.toLowerCase()) {
            case "servicios":
              typeProduct = "services";
              break;
            case "medicamentos":
              typeProduct = "medications";
              break;
            case "vacunas":
              typeProduct = "vaccines";
              break;
            case "insumos":
              typeProduct = "supplies";
              break;
            default:
              typeProduct = "";
          }
        }
        const discount = item.discount
          ? (Number(item.discount) /
              (Number(item.price) * Number(item.quantity))) *
            100
          : 0;

        const subtotal = Number(item.subtotal) - Number(item.discount);

        const percentageTax =
          (Number(item.total_taxes) / Number(subtotal)) * 100;

        return {
          id: generateId(),
          typeProduct: typeProduct,
          product: item.product_id?.toString() || "",
          description: item.product?.name || "",
          quantity: Number(item.quantity),
          price: Number(item.price),
          discount: discount,
          discountType: "percentage",
          iva: percentageTax || 0,
          taxAmount: item.total_taxes,
          depositId: item.deposit_id || null,
          taxAccountingAccountId: item.tax_accounting_account_id || null,
        };
      });
      setProductsArray(productsMapped);
      setDisabledInputs(true);
    }
  }

  const calculateLineTotal = (product: InvoiceProduct): number => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const ivaRate = product.iva || 0;

    const subtotal = quantity * price;

    let discountAmount = 0;
    if (product.discountType === "percentage") {
      discountAmount = subtotal * (discount / 100);
    } else {
      discountAmount = discount; // Valor fijo
    }

    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (ivaRate / 100);

    const lineTotal = subtotalAfterDiscount + taxAmount;
    return parseFloat(lineTotal.toFixed(2));
  };

  const calculateSubtotal = (): number => {
    return productsArray.reduce((total, product) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;
      return total + quantity * price;
    }, 0);
  };

  const calculateTotalDiscount = (): number => {
    return productsArray.reduce((total, product) => {
      const subtotal =
        (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discount = Number(product.discount) || 0;
      if (product.discountType === "percentage") {
        return total + subtotal * (discount / 100);
      } else {
        return total + discount;
      }
    }, 0);
  };

  const calculateTotalTax = (): number => {
    return productsArray.reduce((total, product) => {
      const subtotal =
        (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discount = Number(product.discount) || 0;

      let discountAmount = 0;
      if (product.discountType === "percentage") {
        discountAmount = subtotal * (discount / 100);
      } else {
        discountAmount = discount; // Valor fijo
      }

      const subtotalAfterDiscount = subtotal - discountAmount;
      const ivaRate = product.iva || 0;
      return total + subtotalAfterDiscount * (ivaRate / 100);
    }, 0);
  };

  const calculateSubtotalAfterDiscount = (): number => {
    return calculateSubtotal() - calculateTotalDiscount();
  };
  const calculateTotalWithholdingTax = (): number => {
    return retentions.reduce(
      (total, retention) => total + (retention.value || 0),
      0
    );
  };
  const calculateTotal = (): number => {
    const subtotalAfterDiscount = calculateSubtotalAfterDiscount() || 0;
    const totalTax = calculateTotalTax() || 0;
    const totalWithholding = calculateTotalWithholdingTax() || 0;

    const total = subtotalAfterDiscount + totalTax - totalWithholding;
    return parseFloat(total.toFixed(2));
  };

  const calculateTotalPayments = (): number => {
    return paymentMethodsArray.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };

  const paymentCoverage = (): boolean => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    return Math.abs(payments - total) < 0.01;
  };

  const addProduct = () => {
    setProductsArray([
      ...productsArray,
      {
        id: generateId(),
        typeProduct: "",
        product: "",
        description: "",
        quantity: 0,
        price: 0,
        discount: 0,
        discountType: "percentage",
        iva: 0,
      },
    ]);
  };

  const handleSelectAdvances = (selectedAdvances: any) => {
    if (!selectedAdvanceMethodId) return;

    setPaymentMethodsArray((prev) =>
      prev.map((payment) =>
        payment.id === selectedAdvanceMethodId
          ? {
              ...payment,
              value: selectedAdvances.amount,
            }
          : payment
      )
    );

    setShowAdvancesForm(false);
    setSelectedAdvanceMethodId(null);
  };

  const removeProduct = (id: string) => {
    if (productsArray.length > 1) {
      setProductsArray((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );
    }
  };

  const handleProductChange = (
    id: string,
    field: keyof InvoiceProduct,
    value: any
  ) => {
    setProductsArray((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const addPayment = () => {
    setPaymentMethodsArray([
      ...paymentMethodsArray,
      {
        id: generateId(),
        method: "",
        authorizationNumber: "",
        value: "",
      },
    ]);
  };

  const removePayment = (id: string) => {
    if (paymentMethodsArray.length > 1) {
      setPaymentMethodsArray((prevPayments) =>
        prevPayments.filter((payment) => payment.id !== id)
      );
    }
  };

  async function changeType(type) {
    const billing = await fetchBillingByType(type);
    setBilling(billing.data);
  }

  const handlePaymentChange = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) => {
    if (field === "method") {
      const selectedMethod = paymentMethods.find(
        (method) => method.id === value
      );

      if (selectedMethod?.category === "customer_advance") {
        const customerId = getValues("supplier");
        if (!customerId) {
          window["toast"].show({
            severity: "error",
            summary: "Error",
            detail: "Debe seleccionar un cliente primero",
            life: 5000,
          });
          return;
        }
        setCustomerId(customerId);
        setSelectedAdvanceMethodId(id);
        setShowAdvancesForm(true);
      }
    }

    setPaymentMethodsArray((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  const copyTotalToPayment = (paymentId: string) => {
    const total = calculateTotal();
    const currentPaymentsTotal = calculateTotalPayments();
    const remainingAmount = total - currentPaymentsTotal;

    const currentPaymentValue = Number(
      paymentMethodsArray.find((p) => p.id === paymentId)?.value || 0
    );
    const amountToSet = remainingAmount + currentPaymentValue;

    if (amountToSet > 0) {
      setPaymentMethodsArray((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === paymentId
            ? { ...payment, value: parseFloat(amountToSet.toFixed(2)) }
            : payment
        )
      );

      window["toast"].show({
        severity: "success",
        summary: "Éxito",
        detail: `Valor ${amountToSet.toFixed(2)} DOP copiado al método de pago`,
        life: 3000,
      });
    } else {
      window["toast"].show({
        severity: "warn",
        summary: "Advertencia",
        detail: "El total ya está cubierto por los pagos actuales",
        life: 3000,
      });
    }
  };

  const save = async (formData: any) => {
    if (productsArray.length === 0) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un producto",
        life: 5000,
      });
      return;
    }

    if (paymentMethodsArray.length === 0) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un método de pago",
        life: 5000,
      });
      return;
    }

    if (!paymentCoverage()) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(
          2
        )} DOP) no cubren el total de la factura (${calculateTotal().toFixed(
          2
        )} DOP)`,
        life: 5000,
      });
      return;
    }

    const invoiceData = formatInvoiceForBackend(formData);

    invoiceService
      .storeSale(invoiceData)
      .then((response) => {
        if (selectedInvoice) {
          successSale();
        }
        window["toast"].show({
          severity: "success",
          summary: "Éxito",
          detail: "Factura creada exitosamente",
          life: 5000,
        });
        setTimeout(() => {
          window.location.href = `FE_FCE`;
        }, 2000);
      })
      .catch((error) => {
        window["toast"].show({
          severity: "error",
          summary: "Error",
          detail: error?.message,
          life: 5000,
        });
        console.error("Error creating invoice:", error);
      });
  };

  function formatInvoiceForBackend(frontendData: any) {
    const purchaseIdValue = purchaseOrderId
      ? {
          purchase_order_id: purchaseOrderId,
        }
      : {};
    const retentionsValue =
      retentions[0].value > 0
        ? {
            retentions: retentions.map(
              (retention: any) => retention.percentage.id
            ),
          }
        : {};
    return {
      invoice: {
        user_id: frontendData.seller_id,
        due_date: frontendData.expirationDate,
        observations: "",
        billing_type: frontendData.type,
        third_party_id: frontendData.supplier,
        ...purchaseIdValue,
        billing: billing,
      },
      invoice_detail: productsArray.map((product: any) => {
        const subtotal = Number(product.quantity) * Number(product.price);
        let discountAmount = 0;
        if (product.discountType === "percentage") {
          // Descuento porcentual
          discountAmount = (subtotal * Number(product.discount)) / 100;
        } else {
          // Descuento en valor fijo
          discountAmount = Number(product.discount) || 0;
        }
        return {
          product_id: Number(product.product),
          type_product: product.typeProduct,
          deposit_id: product.depositId,
          quantity: product.quantity,
          unit_price: product.price,
          discount: discountAmount,
          tax_product: product.taxAmount || product.iva || 0,
          tax_accounting_account_id: product.taxAccountingAccountId || null,
          tax_charge_id: product.taxChargeId || null,
        };
      }),
      payments: paymentMethodsArray.map((payment) => {
        return {
          payment_method_id: payment.method,
          payment_date: new Date().toISOString().slice(0, 10),
          amount: payment.value,
          notes: "",
        };
      }),
      ...retentionsValue,
    };
  }

  const { openModal: openThirdPartyModal, ThirdPartyModal } =
    useThirdPartyModal({
      onSuccess: (data) => {
        fetchThirdParties();
      },
    });

  return (
    <div className="container-fluid p-3 p-md-4">
      <ThirdPartyModal />
      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-3">
              <h1 className="h4 mb-0 text-primary">
                <i className="pi pi-file-invoice me-2"></i>
                Crear nueva factura de venta
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(save)}>
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <h2 className="h5 mb-0">
                  <i className="pi pi-user-edit me-2 text-primary"></i>
                  Información básica
                </h2>
              </div>
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Tipo *</label>
                      <Controller
                        name="type"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                          <>
                            <Dropdown
                              required
                              {...field}
                              options={typeOptions}
                              optionLabel="name"
                              optionValue="id"
                              onChange={(e) => {
                                field.onChange(e.value);
                                changeType(e.value);
                              }}
                              placeholder="Seleccione un tipo"
                              className={classNames("w-100")}
                              appendTo={"self"}
                              showClear
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">
                        Fecha de elaboración *
                      </label>
                      <Controller
                        name="elaborationDate"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Calendar
                              {...field}
                              placeholder="Seleccione fecha"
                              className={classNames("w-100")}
                              showIcon
                              dateFormat="dd/mm/yy"
                              disabled={disabledInpputs}
                              inputClassName="form-control"
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Fecha vencimiento *</label>
                      <Controller
                        name="expirationDate"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                          <>
                            <Calendar
                              {...field}
                              placeholder="Seleccione fecha"
                              className={classNames("w-100")}
                              showIcon
                              dateFormat="dd/mm/yy"
                              disabled={disabledInpputs}
                              inputClassName="form-control"
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Proveedor *</label>
                      <Controller
                        name="supplier"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                          <>
                            <div className="d-flex gap-2">
                              <Dropdown
                                {...field}
                                filter
                                options={thirdParties}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Seleccione un proveedor"
                                className={classNames("flex-grow-1")}
                                appendTo={"self"}
                                disabled={disabledInpputs}
                                showClear
                              />
                              <Button
                                type="button"
                                onClick={openThirdPartyModal}
                                icon={<i className="fa-solid fa-plus"></i>}
                                className="p-button-primary"
                              />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Vendedor *</label>
                      <Controller
                        name="seller_id"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                          <>
                            <Dropdown
                              {...field}
                              filter
                              options={users}
                              optionLabel="full_name"
                              optionValue="id"
                              placeholder="Seleccione un vendedor"
                              className={classNames("w-100")}
                              appendTo={"self"}
                              disabled={disabledInpputs}
                              showClear
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Centro de costo *</label>
                      <Controller
                        name="costCenter"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={centresCosts}
                            optionLabel="name"
                            placeholder="Seleccione centro"
                            className={classNames("w-100")}
                            appendTo={"self"}
                            disabled={disabledInpputs}
                            showClear
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center p-3">
                <h2 className="h5 mb-0">
                  <i className="pi pi-shopping-cart me-2 text-primary"></i>
                  Productos
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Añadir Producto"
                  className="btn btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    addProduct();
                  }}
                  disabled={disabledInpputs}
                />
              </div>
              <div className="card-body p-0">
                {loadingProductTypes ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="table-responsive-md">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" style={{ minWidth: "120px" }}>
                            Tipo
                          </th>
                          <th scope="col" style={{ minWidth: "180px" }}>
                            Producto
                          </th>
                          <th scope="col" style={{ minWidth: "100px" }}>
                            Cantidad
                          </th>
                          <th scope="col" style={{ minWidth: "200px" }}>
                            Valor unitario
                          </th>
                          <th scope="col" style={{ minWidth: "220px" }}>
                            Descuento %
                          </th>
                          <th scope="col" style={{ minWidth: "120px" }}>
                            Impuestos
                          </th>
                          <th scope="col" style={{ minWidth: "130px" }}>
                            Depósito
                          </th>
                          <th
                            scope="col"
                            style={{ minWidth: "200px !important" }}
                          >
                            Valor total
                          </th>
                          <th scope="col" style={{ width: "80px" }}>
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productsArray.map((product) => (
                          <tr key={product.id}>
                            <td className="p-2">
                              <TypeColumnBody
                                rowData={product}
                                onChange={(newType: string) => {
                                  handleProductChange(
                                    product.id,
                                    "typeProduct",
                                    newType
                                  );
                                  handleProductChange(
                                    product.id,
                                    "product",
                                    null
                                  );
                                }}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <ProductColumnBody
                                rowData={product}
                                type={product.typeProduct}
                                onChange={(value: string) => {
                                  handleProductChange(
                                    product.id,
                                    "product",
                                    value
                                  );
                                }}
                                handleProductChange={handleProductChange}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <QuantityColumnBody
                                onChange={(value: number | null) =>
                                  handleProductChange(
                                    product.id,
                                    "quantity",
                                    value || 0
                                  )
                                }
                                value={product.quantity}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <PriceColumnBody
                                onChange={(value: number | null) =>
                                  handleProductChange(
                                    product.id,
                                    "price",
                                    value || 0
                                  )
                                }
                                value={product.price}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <DiscountColumnBody
                                onChange={(value: number | null) =>
                                  handleProductChange(
                                    product.id,
                                    "discount",
                                    value || 0
                                  )
                                }
                                onTypeChange={(type: "percentage" | "fixed") =>
                                  handleProductChange(
                                    product.id,
                                    "discountType",
                                    type
                                  )
                                }
                                value={product.discount}
                                discountType={
                                  product.discountType || "percentage"
                                }
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <IvaColumnBody
                                onChange={(value: any | null) => {
                                  handleProductChange(
                                    product.id,
                                    "iva",
                                    value?.percentage || 0
                                  );
                                  handleProductChange(
                                    product.id,
                                    "taxAccountingAccountId",
                                    value?.accounting_account_id || null
                                  );
                                  handleProductChange(
                                    product.id,
                                    "taxChargeId",
                                    value?.id || null
                                  );
                                }}
                                value={product.iva}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <DepositColumnBody
                                onChange={(value: string | null) =>
                                  handleProductChange(
                                    product.id,
                                    "depositId",
                                    value
                                  )
                                }
                                value={product.depositId}
                                disabled={disabledInpputs}
                              />
                            </td>
                            <td className="p-2">
                              <InputNumber
                                value={calculateLineTotal(product)}
                                mode="currency"
                                currency="DOP"
                                locale="es-DO"
                                readOnly
                                inputClassName="form-control bg-light"
                                style={{ minWidth: "200px" }}
                              />
                            </td>
                            <td className="text-center p-2">
                              <Button
                                className="p-button-rounded p-button-danger p-button-text"
                                onClick={() => removeProduct(product.id)}
                                disabled={productsArray.length <= 1}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card mb-4 shadow-sm">
              <RetentionsSection
                subtotal={calculateSubtotal()}
                totalDiscount={calculateTotalDiscount()}
                retentions={retentions}
                onRetentionsChange={setRetentions}
                productsArray={productsArray}
              />
            </div>

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
                  onClick={(e) => {
                    e.preventDefault();
                    addPayment();
                  }}
                />
              </div>
              <div className="card-body p-3">
                {paymentMethodsArray.map((payment) => (
                  <div
                    key={payment.id}
                    className="row g-3 mb-3 align-items-end"
                  >
                    <div className="col-12 col-md-5 mb-1">
                      <div className="form-group mb-2 mb-md-0">
                        <label className="form-label">Método *</label>
                        <Dropdown
                          required
                          value={payment.method}
                          options={filteredPaymentMethods}
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

                    <div className="col-12 col-md-2 text-md-end text-center">
                      <Button
                        className="p-button-rounded p-button-danger p-button-text p-button-sm"
                        onClick={() => removePayment(payment.id)}
                        disabled={paymentMethodsArray.length <= 1}
                        tooltip="Eliminar método"
                        tooltipOptions={{ position: "top" }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                ))}
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
                          <strong className="me-2">Total factura:</strong>
                          <InputNumber
                            value={calculateTotal()}
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
                            value={calculateTotalPayments()}
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
                          {!paymentCoverage() ? (
                            <span className="text-danger">
                              <i className="pi pi-exclamation-triangle me-1"></i>
                              Faltan{" "}
                              {(
                                calculateTotal() - calculateTotalPayments()
                              ).toFixed(2)}{" "}
                              DOP
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

            <Dialog
              style={{ width: "90vw", maxWidth: "800px" }}
              header="Anticipos"
              visible={showAdvancesForm}
              onHide={() => setShowAdvancesForm(false)}
            >
              <FormAdvanceCopy
                advances={advances}
                invoiceTotal={(
                  calculateTotal() - calculateTotalPayments()
                ).toFixed(2)}
                onSubmit={(data) => {
                  handleSelectAdvances(data);
                }}
              ></FormAdvanceCopy>
            </Dialog>

            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <h2 className="h5 mb-0">
                  <i className="pi pi-calculator me-2 text-primary"></i>
                  Totales (DOP)
                </h2>
              </div>
              <div className="card-body p-3">
                <div className="row g-3">
                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">Subtotal</label>
                      <InputNumber
                        value={calculateSubtotal()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light"
                      />
                    </div>
                  </div>
                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">Descuento</label>
                      <InputNumber
                        value={calculateTotalDiscount()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light"
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">
                        Subtotal con descuento
                      </label>
                      <InputNumber
                        value={calculateSubtotalAfterDiscount()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light"
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">Impuesto</label>
                      <InputNumber
                        value={calculateTotalTax()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light"
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">Retenciones</label>
                      <InputNumber
                        value={calculateTotalWithholdingTax()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light"
                      />
                    </div>
                  </div>

                  <div className="col-6 col-md-3 col-lg-2">
                    <div className="form-group">
                      <label className="form-label">Total</label>
                      <InputNumber
                        value={calculateTotal()}
                        className="w-100 font-weight-bold"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                        inputClassName="form-control bg-light fw-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mb-4">
              <Button
                label="Guardar"
                icon="pi pi-check"
                className="btn-info"
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>

      <Toast
        ref={(el) => {
          window["toast"] = el;
        }}
      />

      <style>{`
            .form-control {
              height: 38px;
              padding: 0.375rem 0.75rem;
              font-size: 0.9rem;
              border: 1px solid #ced4da;
              border-radius: 0.375rem;
              transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
            }
            
            .form-control:focus {
              border-color: #86b7fe;
              outline: 0;
              box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
            }
            
            .p-inputnumber-input {
              height: 38px;
              padding: 0.375rem 0.75rem;
              font-size: 0.9rem;
            }
            
            .p-dropdown {
              height: 38px;
              display: flex;
              align-items: center;
            }
            
            .p-calendar {
              height: 38px;
            }
            
            .table-responsive-md {
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            
            .table th, .table td {
              vertical-align: middle;
              padding: 0.75rem;
            }
            
            .table thead th {
              border-bottom: 2px solid #dee2e6;
              background-color: #f8f9fa;
              font-weight: 600;
            }
            
            .price-input {
              width: 200px; !important;
              min-width: 120px;
              width: auto !important;
            }
            
            .price-input .p-inputnumber-input {
              width: auto; !important;
              min-width: 120px;
            }
            
            @media (max-width: 768px) {
              .container-fluid {
                padding-left: 10px;
                padding-right: 10px;
              }
              
              .card-body {
                padding: 1rem;
              }
              
              .table-responsive-md {
                border: 1px solid #dee2e6;
                border-radius: 0.375rem;
              }
              
              .table {
                margin-bottom: 0;
                min-width: 800px;
              }
              
              .btn {
                padding: 0.25rem 0.5rem;
                font-size: 0.875rem;
              }
              
              .price-input {
              width: 300px; !important;
                min-width: 100px;
              }
            }
            
            .table .p-inputnumber, 
            .table .p-dropdown, 
            .table .p-calendar {
              width: 100% !important;
              min-width: 100px;
            }
            
            .p-dropdown-panel {
              z-index: 1100 !important;
            }
            
            @media (max-width: 576px) {
              .alert-info .d-flex {
                flex-direction: column;
                gap: 1rem;
              }
              
              .alert-info .d-flex > div {
                width: 100%;
                justify-content: space-between;
              }
            }
          `}</style>
    </div>
  );
};

const TypeColumnBody = ({
  rowData,
  onChange,
  disabled,
}: {
  rowData: InvoiceProduct;
  onChange: (value: string) => void;
  disabled?: boolean;
}) => {
  const options = [
    { id: "supplies", name: "Insumos" },
    { id: "medications", name: "Medicamentos" },
    { id: "vaccines", name: "Vacunas" },
    { id: "services", name: "Servicios" },
    { id: "assetsFixed", name: "Activos y fijos" },
  ];

  return (
    <div style={{ position: "relative" }}>
      <Dropdown
        value={rowData.typeProduct}
        options={options}
        optionLabel="name"
        optionValue="id"
        placeholder="Seleccione Tipo"
        className="w-100"
        onChange={(e: DropdownChangeEvent) => {
          onChange(e.value);
        }}
        onClick={(e) => e.stopPropagation()}
        disabled={disabled}
        filter
        showClear
      />
    </div>
  );
};

const ProductColumnBody = ({
  rowData,
  type,
  onChange,
  handleProductChange,
  disabled,
}: {
  rowData: InvoiceProduct;
  type: string | null;
  onChange: (value: string) => void;
  handleProductChange: (
    id: string,
    field: keyof InvoiceProduct,
    value: any
  ) => void;
  disabled?: boolean;
}) => {
  const { getByType, products } = useInventory();
  const { accounts: propertyAccounts } = useAccountingAccountsByCategory(
    "sub_account",
    "15"
  );
  const [options, setOptions] = useState<
    { id: string; label: string; name: string }[]
  >([]);

  useEffect(() => {
    if (!type) return;

    if (type === "assetsFixed") {
      // Cargar cuentas de activos fijos
      const formatted =
        propertyAccounts?.map((acc) => ({
          id: String(acc.id),
          label: String(acc.account_name),
          name: String(acc.account_name),
        })) || [];
      setOptions(formatted);
    } else {
      getByType(type);
      const formatted =
        products?.map((p) => ({
          id: String(p.id),
          label: String(p.name || p.label),
          name: String(p.name || p.label),
        })) || [];
      setOptions(formatted);
    }
  }, [type, propertyAccounts, products]);

  if (type === "assetsFixed") {
    return (
      <Dropdown
        value={rowData.product}
        options={options}
        optionLabel="label"
        optionValue="id"
        placeholder="Seleccione Activo"
        className="w-100"
        filter
        onChange={(e: DropdownChangeEvent) => {
          e.originalEvent?.preventDefault();
          e.originalEvent?.stopPropagation();
          const selectedProduct = options.find((opt) => opt.id === e.value);
          onChange(e.value);
          handleProductChange(
            rowData.id,
            "description",
            selectedProduct?.label || ""
          );
        }}
        onClick={(e) => e.stopPropagation()}
        loading={!options.length}
        emptyMessage="No hay activos disponibles"
        disabled={disabled}
        showClear
      />
    );
  }

  return (
    <Dropdown
      value={rowData.product}
      options={options}
      optionLabel="label"
      optionValue="id"
      placeholder="Seleccione Producto"
      className="w-100"
      filter
      onChange={(e: DropdownChangeEvent) => {
        onChange(e.value);
        const selectedProduct = options.find((p) => p.id === e.value);
        if (selectedProduct) {
          handleProductChange(rowData.id, "description", selectedProduct.label);
        }
      }}
      virtualScrollerOptions={{ itemSize: 38 }}
      emptyMessage={"No hay productos disponibles"}
      disabled={disabled}
      showClear
    />
  );
};

const QuantityColumnBody = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: number | null) => void;
  value: number | null;
  disabled?: boolean;
}) => {
  return (
    <>
      <InputNumber
        value={value}
        placeholder="Cantidad"
        className="w-100"
        min={0}
        onValueChange={(e: any) => {
          onChange(e.value);
        }}
        disabled={disabled}
        inputClassName="form-control"
        mode="decimal"
        minFractionDigits={0}
        maxFractionDigits={2}
        useGrouping={false}
      />
    </>
  );
};

const PriceColumnBody = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: number | null) => void;
  value: number | null;
  disabled?: boolean;
}) => {
  return (
    <div className="price-input">
      <InputNumber
        value={value}
        placeholder="RD$ 0.00"
        className="w-100"
        mode="currency"
        currency="DOP"
        locale="es-DO"
        min={0}
        onValueChange={(e: any) => {
          onChange(e.value);
        }}
        disabled={disabled}
        inputClassName="form-control"
        minFractionDigits={2}
        maxFractionDigits={6}
      />
    </div>
  );
};

const DiscountColumnBody = ({
  onChange,
  onTypeChange,
  value,
  discountType,
  disabled,
}: {
  onChange: (value: number | null) => void;
  onTypeChange: (type: "percentage" | "fixed") => void;
  value: number | null;
  discountType: "percentage" | "fixed";
  disabled?: boolean;
}) => {
  const [localDiscountType, setLocalDiscountType] = useState<
    "percentage" | "fixed"
  >(discountType || "percentage");
  useEffect(() => {
    if (discountType && discountType !== localDiscountType) {
      setLocalDiscountType(discountType);
    }
  }, [discountType]);
  const handleTypeChange = (type: "percentage" | "fixed") => {
    setLocalDiscountType(type);
    onTypeChange(type);

    if (type !== (discountType || "percentage")) {
      onChange(0);
    }
  };
  return (
    <div className="d-flex gap-1 align-items-center">
      <Dropdown
        value={discountType}
        options={[
          { label: "%", value: "percentage" },
          { label: "$", value: "fixed" },
        ]}
        optionLabel="label"
        optionValue="value"
        style={{ width: "50px" }}
        onChange={(e: DropdownChangeEvent) => {
          handleTypeChange(e.value);
        }}
        disabled={disabled}
        showClear
      />
      <InputNumber
        value={value}
        placeholder={
          discountType === "percentage" ? "Descuento %" : "Descuento $"
        }
        className="flex-grow-1"
        style={{ minWidth: "100px" }}
        suffix={discountType === "percentage" ? "%" : ""}
        prefix={discountType === "fixed" ? "$ " : ""}
        mode={localDiscountType === "fixed" ? "currency" : "decimal"}
        currency={localDiscountType === "fixed" ? "DOP" : undefined}
        locale="es-DO"
        min={0}
        max={discountType === "percentage" ? 100 : undefined}
        onValueChange={(e: any) => {
          onChange(e.value);
        }}
        disabled={disabled}
        inputClassName="form-control"
      />
    </div>
  );
};

const IvaColumnBody = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: any | null) => void;
  value: any | null;
  disabled?: boolean;
}) => {
  const { taxes, loading: loadingTaxes, fetchTaxes } = useTaxes();

  useEffect(() => {
    fetchTaxes();
  }, []);

  return (
    <Dropdown
      value={value}
      options={taxes}
      optionLabel={(option: any) =>
        `${option.name} - ${Math.floor(option.percentage)}%`
      }
      optionValue="percentage"
      placeholder="Seleccione IVA"
      className="w-100"
      onChange={(e: DropdownChangeEvent) => {
        if (e.value === null) {
          onChange(null);
        } else {
          const selectedTax = taxes.find(
            (tax: any) => tax.percentage === e.value
          );
          if (selectedTax) {
            onChange(selectedTax);
          }
        }
      }}
      appendTo={document.body}
      disabled={disabled}
      filter
      showClear
    />
  );
};
const DepositColumnBody = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: string | null) => void;
  value?: any | null;
  disabled?: boolean;
}) => {
  const [deposits, setDeposits] = useState<any[]>([]);

  useEffect(() => {
    loadtDeposits();
  }, []);

  async function loadtDeposits() {
    const deposits = await depositService.getAllDeposits();
    setDeposits(deposits.data);
  }

  return (
    <Dropdown
      value={value}
      options={deposits}
      optionLabel={(option: any) => `${option.attributes.name}`}
      optionValue="id"
      placeholder="Seleccione"
      className="w-100"
      onChange={(e: DropdownChangeEvent) => {
        onChange(e.value);
      }}
      disabled={disabled}
      appendTo={document.body}
      filter
      showClear
    />
  );
};
