import React, { useState } from "react";
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
// Definición de tipos

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
  // Estados para manejar lotes y activos fijos

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

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Opciones del formulario
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
          // Mapear el tipo de producto según lo que espera tu formulario
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
          iva: percentageTax || 0,
          taxAmount: item.total_taxes,
          depositId: item.deposit_id || null,
        };
      });
      setProductsArray(productsMapped);
      setDisabledInputs(true);
    }
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = (product: InvoiceProduct): number => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const ivaRate = product.iva || 0;

    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
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
      return total + subtotal * (discount / 100);
    }, 0);
  };

  const calculateTotalTax = (): number => {
    return productsArray.reduce((total, product) => {
      const subtotal =
        (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const ivaRate = product.iva || 0; // <-- Cambio aquí
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
    // Permitimos un pequeño margen por redondeos
    return Math.abs(payments - total) < 0.01;
  };
  // Funciones para manejar productos
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
        iva: 0,
      },
    ]);
  };
  // Función para manejar la selección de anticipos
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

  // Funciones para manejar métodos de pago
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

  // Funciones para guardar
  const save = async (formData: any) => {
    // Validación básica
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

        return {
        product_id: Number(product.product),
        deposit_id: product.depositId,
        quantity: product.quantity,
        unit_price: product.price,
        discount: product.discount,
        tax_product: product.taxAmount || product.iva || 0,
      }
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

  const getProductColumns = () => {
    return [
      {
        field: "type",
        header: "Tipo",
        body: (rowData: InvoiceProduct) => (
          <TypeColumnBody
            rowData={rowData}
            onChange={(newType: string) => {
              handleProductChange(rowData.id, "typeProduct", newType);
              handleProductChange(rowData.id, "product", null);
            }}
            disabled={disabledInpputs}
          />
        ),
      },
      {
        field: "product",
        header: "Producto",
        body: (rowData: InvoiceProduct) => {
          return (
            <ProductColumnBody
              rowData={rowData}
              type={rowData.typeProduct}
              onChange={(value: string) => {
                handleProductChange(rowData.id, "product", value);
              }}
              handleProductChange={handleProductChange}
              disabled={disabledInpputs}
            />
          );
        },
      },
      {
        field: "quantity",
        header: "Cantidad",
        body: (rowData: InvoiceProduct) => (
          <QuantityColumnBody
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "quantity", value || 0)
            }
            value={rowData.quantity}
            disabled={disabledInpputs}
          />
        ),
        style: { minWidth: "90px" },
      },
      {
        field: "price",
        header: "Valor unitario",
        body: (rowData: InvoiceProduct) => (
          <PriceColumnBody
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "price", value || 0)
            }
            value={rowData.price}
            disabled={disabledInpputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "discount",
        header: "Descuento %",
        body: (rowData: InvoiceProduct) => (
          <DiscountColumnBody
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "discount", value || 0)
            }
            value={rowData.discount}
            disabled={disabledInpputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "iva",
        header: "Impuestos",
        body: (rowData: InvoiceProduct) => (
          <IvaColumnBody
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "iva", value)
            }
            value={rowData.iva}
            disabled={disabledInpputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "deposit",
        header: "Depósito",
        body: (rowData: InvoiceProduct) => (
          <DepositColumnBody
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "depositId", value)
            }
            value={rowData.depositId}
            disabled={disabledInpputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "totalvalue",
        header: "Valor total",
        body: (rowData: InvoiceProduct) => (
          <InputNumber
            value={calculateLineTotal(rowData)}
            mode="currency"
            style={{ maxWidth: "200px" }}
            className="button-width"
            currency="DOP"
            locale="es-DO"
            readOnly
          />
        ),
        style: { minWidth: "300px" },
      },
      {
        field: "actions",
        header: "Acciones",
        body: (rowData: InvoiceProduct) => (
          <Button
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => removeProduct(rowData.id)}
            disabled={productsArray.length <= 1}
            tooltip="Eliminar Producto"
          >
            {" "}
            <i className="fa-solid fa-trash"></i>
          </Button>
        ),
        style: { width: "120px", textAlign: "center" },
      },
    ];
  };

  const { openModal: openThirdPartyModal, ThirdPartyModal } = useThirdPartyModal({
    onSuccess: (data) => {
      fetchThirdParties();
    }
  });

  return (
    <div className="container-fluid p-4">

      <ThirdPartyModal />

      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-0 text-primary">
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
            {/* Sección de Información Básica */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-user-edit me-2 text-primary"></i>
                  Información básica
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-4">
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
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
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
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
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
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Proveedor *</label>
                      <Controller
                        name="supplier"
                        control={control}
                        rules={{ required: "Campo obligatorio" }}
                        render={({ field }) => (
                          <>
                            <div className="d-flex">
                              <Dropdown
                                {...field}
                                filter
                                options={thirdParties}
                                optionLabel="name"
                                optionValue="id"
                                placeholder="Seleccione un proveedor"
                                className={classNames("w-100")}
                                appendTo={"self"}
                                disabled={disabledInpputs}
                              />
                              <Button
                                type="button"
                                onClick={openThirdPartyModal}
                                icon={<i className="fa-solid fa-plus"></i>}
                                className="p-button-primary" />
                            </div>
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
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
                            />
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
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
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Productos */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
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
              <div className="card-body">
                <div className="table-responsive">
                  {loadingProductTypes ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2 text-muted">Cargando productos...</p>
                    </div>
                  ) : (
                    <DataTable
                      key={`products-table-${productTypes.length}`}
                      value={productsArray}
                      emptyMessage="No hay productos agregados"
                      className="p-datatable-sm p-datatable-gridlines"
                      showGridlines
                      scrollable
                      stripedRows
                      loading={false}
                      size="small"
                    >
                      {getProductColumns().map((col, i) => (
                        <Column
                          key={i}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                        />
                      ))}
                    </DataTable>
                  )}
                </div>
              </div>
            </div>
            <div className="card mb-4 shadow-sm">
              <RetentionsSection
                subtotal={calculateSubtotal()}
                totalDiscount={calculateTotalDiscount()}
                retentions={retentions}
                onRetentionsChange={setRetentions}
              />
            </div>

            {/* Sección de Métodos de Pago */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
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
              <div className="card-body">
                {paymentMethodsArray.map((payment) => (
                  <div
                    key={payment.id}
                    className="row g-3 mb-3 align-items-end"
                  >
                    <div className="col-md-6">
                      <div className="form-group">
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
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Valor *</label>
                        <InputNumber
                          value={payment.value === "" ? null : payment.value}
                          placeholder="$0.00"
                          className="w-100"
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
                        />
                      </div>
                    </div>
                    <div className="col-md-1">
                      <Button
                        className="p-button-rounded p-button-danger p-button-text"
                        onClick={() => removePayment(payment.id)}
                        disabled={paymentMethodsArray.length <= 1}
                        tooltip="Eliminar método"
                      >
                        {" "}
                        <i className="fa-solid fa-trash"></i>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="row mt-3">
                  <div className="col-md-12">
                    <div
                      className="alert alert-info"
                      style={{
                        background: "rgb(194 194 194 / 85%)",
                        border: "none",
                        color: "black",
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>Total factura:</strong>
                          <InputNumber
                            value={calculateTotal()}
                            className="ms-2"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            minFractionDigits={2}
                            maxFractionDigits={3}
                            readOnly
                          />
                        </div>
                        <div>
                          <strong>Total pagos:</strong>
                          <InputNumber
                            value={calculateTotalPayments()}
                            className="ms-2"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            minFractionDigits={2}
                            maxFractionDigits={3}
                            readOnly
                          />
                        </div>
                        <div>
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

            {/* {showAdvancesForm && customerId && (
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">
                    <i className="pi pi-history me-2 text-primary"></i>
                    Seleccionar Anticipos del Cliente
                  </h2>
                </div>
                <div className="card-body">
                  <AdvanceHistoryForm
                    customerId={customerId}
                    invoiceTotal={calculateTotal()}
                    onSelectAdvances={handleSelectAdvances}
                  />
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      label="Cancelar"
                      icon="pi pi-times"
                      className="p-button-secondary"
                      onClick={() => {
                        setShowAdvancesForm(false);
                        setSelectedAdvanceMethodId(null);
                        // Limpiar el método de pago si no se seleccionaron anticipos
                        if (selectedAdvanceMethodId) {
                          setPaymentMethodsArray((prev) =>
                            prev.map((payment) =>
                              payment.id === selectedAdvanceMethodId
                                ? { ...payment, method: "", value: "" }
                                : payment
                            )
                          );
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )} */}

            <Dialog
              style={{ width: "50vw", height: "44vh" }}
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

            {/* Sección de Totales */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-calculator me-2 text-primary"></i>
                  Totales (DOP)
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">Subtotal</label>
                      <InputNumber
                        value={calculateSubtotal()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">Descuento</label>
                      <InputNumber
                        value={calculateTotalDiscount()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
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
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">Impuesto</label>
                      <InputNumber
                        value={calculateTotalTax()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">Total</label>
                      <InputNumber
                        value={calculateTotal()}
                        className="w-100 font-weight-bold"
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

            {/* Botones de Acción */}
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
      />{" "}
      <style>{`
                .p-dropdown-panel {
                  z-index: 1100 !important;
                }
                .overlay-invoices {
                  position: absolute !important;
                  z-index: 1030 !important;
                  height: fit-content !important;
                }
               .payment-methods-section {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
                }

                .payment-method-row {
                display: flex;
                gap: 1rem;
                align-items: flex-end;
                }

                .payment-method-field {
                flex: 1;
                min-width: 0;
                }

                .payment-method-label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 500;
                color: #495057;
                }

                .payment-dropdown, .payment-input {
                width: 100%;
                }

                .payment-method-actions {
                display: flex;
                align-items: center;
                height: 40px;
                margin-bottom: 0.5rem;
                }

                .payment-delete-button {
                color: #dc3545;
                background: transparent;
                border: none;
                transition: all 0.2s;
                }

                .payment-delete-button:hover {
                color: #fff;
                background: #dc3545;
                }

                .payment-delete-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                }

                /* Estilos para el resumen de pagos */
                .payment-summary {
                margin-top: 1.5rem;
                }

                .payment-summary-card {
                background: rgba(194, 194, 194, 0.15);
                border-radius: 8px;
                padding: 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
                }

                .payment-summary-item {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                }

                .payment-summary-input {
                background: transparent;
                border: none;
                font-weight: bold;
                }

                .payment-summary-status {
                flex: 1;
                text-align: right;
                min-width: 200px;
                }

                .payment-status-warning {
                color: #dc3545;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                }

                .payment-status-success {
                color: #28a745;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                }

                .payment-warning {
                border-left: 4px solid #dc3545;
                }

                .payment-success {
                border-left: 4px solid #28a745;
                }

                .spinner-border {
                width: 3rem;
                height: 3rem;
                border-width: 0.25em;
                }

                /* Animación suave para la aparición de la tabla */
                .table-responsive {
                transition: opacity 0.3s ease;
                }

                /* Responsive */
                @media (max-width: 992px) {
                .payment-method-row {
                    flex-wrap: wrap;
                }
                
                .payment-method-field {
                    flex: 0 0 calc(50% - 0.5rem);
                }
                
                .payment-method-actions {
                    flex: 0 0 100%;
                    justify-content: flex-end;
                }
                }

                @media (max-width: 768px) {
                .payment-method-field {
                    flex: 0 0 100%;
                }
                
                .payment-summary-card {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 1rem;
                }
                
                .payment-summary-status {
                    text-align: left;
                    justify-content: flex-start;
                }
                }

                /* Estilos generales para inputs en tablas */
                .p-datatable .p-inputnumber {
                width: 100% !important;
                }

                .p-datatable .p-inputnumber-input {
                width: 100% !important;
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
      // Cargar productos normales
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
  // Si es activo fijo, mostramos un campo de selección diferente
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
          onChange(e.value); // Actualiza el ID del producto
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
        style={{ maxWidth: "100px" }}
        min={0}
        onValueChange={(e: any) => {
          onChange(e.value);
        }}
        disabled={disabled}
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
    <InputNumber
      value={value}
      placeholder="Precio"
      className="w-100"
      mode="currency"
      currency="DOP"
      style={{ maxWidth: "130px" }}
      locale="es-DO"
      min={0}
      onValueChange={(e: any) => {
        onChange(e.value);
      }}
      disabled={disabled}
    />
  );
};

const DiscountColumnBody = ({
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
        placeholder="Descuento"
        className="w-100"
        style={{ maxWidth: "120px" }}
        suffix="%"
        min={0}
        max={100}
        onValueChange={(e: any) => {
          onChange(e.value);
        }}
        disabled={disabled}
      />
    </>
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
        onChange(e.value);
      }}
      appendTo={document.body}
      disabled={disabled}
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

  // useEffect(() => {
  //   const depositFind: any = deposits.find(
  //     (item: any) => item.id === value
  //   );
  //   setTaxSelected(depositFind?.percentage);
  // }, [value && deposits]);
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
    />
  );
};
