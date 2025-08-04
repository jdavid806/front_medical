import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
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
import { InvoiceService } from "../../../services/api/classes/invoiceService";
import { SwalManager } from "../../../services/alertManagerImported";
import { useUsers } from "../../users/hooks/useUsers";
import { useEffect } from "react";
import AdvanceHistoryModal from "./modal/ModalAdvanceHistory";
import { useInventory } from "./hooks/useInventory";
import {
  TypeOption,
  CostCenterOption,
  PaymentMethod,
  InvoiceProduct,
} from "../purchase_billing/types/purchaseTypes";// Definición de tipos



type Product = {
  name: string;
  code: string;
};



export const SalesBilling: React.FC = () => {
  const { control, getValues, handleSubmit } = useForm({
    defaultValues: {
      type: null,
      invoiceNumber: "",
      elaborationDate: null,
      expirationDate: null,
      costCenter: null,
      supplier: null,
      contact: null,
      seller_id: null,
    },
  });

  const { thirdParties } = useThirdParties();
  const { users } = useUsers();
  const { products, loading: loadingProducts } = useProducts();
  const { productTypes, loading: loadingProductTypes } = useProductTypes();
  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [showAdvancesModal, setShowAdvancesModal] = useState(false);
  const [customerId, setCustomerId] = useState<number | null>(null);
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
  const [paymentMethodsArray, setPaymentMethodsArray] = useState<
    PaymentMethod[]
  >([
    {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: 0,
    },
  ]);

  

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

  const ivaOptions = [
    { id: 0, name: "0%" },
    { id: 12, name: "12%" },
    { id: 14, name: "14%" },
  ];

  const retentionTaxOptions = [
    { id: 0, name: "No Aplica" },
    { id: 1, name: "1%" },
    { id: 2, name: "2%" },
    { id: 5, name: "5%" },
    { id: 10, name: "10%" },
  ];

  // Funciones de cálculo en DOP
  const calculateLineTotal = (product: InvoiceProduct): number => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const ivaRate = product.iva ? Number(product.iva.id) : 0;
    const withholdingRate = product.withholdingtax
      ? Number(product.withholdingtax.id)
      : 0;

    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (ivaRate / 100);
    const withholdingAmount = subtotalAfterDiscount * (withholdingRate / 100);

    const lineTotal = subtotalAfterDiscount + taxAmount - withholdingAmount;

    // Redondeamos a 2 decimales para evitar errores de precisión
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
      const ivaRate = product.iva ? Number(product.iva.id) : 0;
      return total + subtotalAfterDiscount * (ivaRate / 100);
    }, 0);
  };

  const calculateSubtotalAfterDiscount = (): number => {
    return calculateSubtotal() - calculateTotalDiscount();
  };

  // const calculateTotalWithholdingTax = (): number => {
  //   return productsArray.reduce((total, product) => {
  //     const subtotal =
  //       (Number(product.quantity) || 0) * (Number(product.price) || 0);
  //     const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
  //     const subtotalAfterDiscount = subtotal - discountAmount;
  //     const withholdingRate = product.withholdingtax || 0;
  //     return total + subtotalAfterDiscount * (withholdingRate / 100);
  //   }, 0);
  // };

  const calculateTotal = (): number => {
    return productsArray.reduce((total, product) => {
      return total + calculateLineTotal(product);
    }, 0);
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
        typeProduct: null,
        product: null,
        description: "",
        quantity: 0,
        price: 0,
        discount: 0,
        iva: null,
        withholdingtax: null,
      },
    ]);
  };

  // Función para manejar la selección de anticipos
  const handleSelectAdvances = (selectedAdvances: AdvancePayment[]) => {
    // Lógica para agregar los anticipos a los métodos de pago
    console.log("Anticipos seleccionados:", selectedAdvances);

    setPaymentMethodsArray((prev) => [
      ...prev.filter((p) => p.method !== "customer_advance"),
      ...selectedAdvances.map((advance) => ({
        id: generateId(),
        method: "customer_advance",
        authorizationNumber: advance.reference,
        value: advance.amount_to_use || 0,
        advanceId: advance.id,
      })),
    ]);

    setShowAdvancesModal(false);
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
    setProductsArray((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
            ...p,
            [field]: value,
            ...(field === "typeProduct" && {
              product: null,
              price: 0,
            }),
          }
          : p
      )
    );

  // Funciones para manejar métodos de pago
  const addPayment = () => {
    setPaymentMethodsArray([
      ...paymentMethodsArray,
      {
        id: generateId(),
        method: "",
        authorizationNumber: "",
        value: 0,
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

  const handlePaymentChange = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) => {
    if (field === "method") {
      // Buscar el método de pago seleccionado en la lista de paymentMethods
      const selectedMethod = paymentMethods.find(
        (method) => method.id === value
      );

      // Si es el método de anticipo, mostrar el modal
      if (selectedMethod?.method === "Anticipito Clientes") {
        // Obtener el ID del cliente seleccionado en el formulario
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
        setShowAdvancesModal(true);
        return; // No actualizamos el estado todavía, esperamos a que se seleccionen los anticipos
      }
    }

    // Para otros casos, actualizar el estado normalmente
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

    // Función para formatear fechas
    const formatDate = (date: any) => {
      if (!date) return "";
      if (date instanceof Date) return date.toISOString();
      return date;
    };

    // Construir objeto de datos
    const invoiceData = {
      // Información básica
      type: formData.type ? formData.type : "",
      invoiceNumber: formData.invoiceNumber || "",
      elaborationDate: formatDate(formData.elaborationDate),
      expirationDate: formatDate(formData.expirationDate),
      third_party_id: formData.supplier,
      seller_id: formData.seller_id,

      // Productos
      products: productsArray.map((product) => ({
        id: product.product,
        quantity: product.quantity || 0,
        unitPrice: product.price || 0,
        discount:
          product.quantity * product.price * ((product.discount || 0) / 100),
        iva: product.iva || 0,
        withholdingTax: product.withholdingtax || 0,
        lineTotal: (product.quantity || 0) * (product.price || 0),
      })),

      // Métodos de pago
      paymentMethods: paymentMethodsArray.map((payment) => ({
        method: payment.method,
        amount: payment.value || 0,
      })),

      // Totales en DOP
      subtotal: calculateSubtotal(),
      totalDiscount: calculateTotalDiscount(),
      subtotalAfterDiscount: calculateSubtotalAfterDiscount(),
      totalTax: calculateTotalTax(),
      totalWithholdingTax: calculateTotalWithholdingTax(),
      grandTotal: calculateTotal(),
      currency: "DOP", // Especificamos que todos los montos son en pesos dominicanos
    };

    console.log("📄 Datos completos de la factura:", invoiceData);
    // Aquí iría la llamada a la API para guardar los datos

    const formattedData = await formatInvoiceForBackend(invoiceData);

    console.log("Formatted data:", formattedData);

    try {
      const invoiceService = new InvoiceService();
      const response = await invoiceService.storeSale(formattedData);
      console.log("Response:", response);
      SwalManager.success({
        title: "Factura creada",
        text: "La factura fue creada correctamente.",
      });
    } catch (error) {
      console.error("Error al guardar la factura:", error);
      SwalManager.error({
        title: "Error",
        text: "No se pudo crear la factura.",
      });
    }
  };

  async function formatInvoiceForBackend(frontendData: any) {
    return {
      invoice: {
        user_id: frontendData.seller_id,
        due_date: frontendData.expirationDate,
        observations: "",
        invoice_code: frontendData.invoiceNumber,
        resolution_number: "0",
        type: "sale",
        sub_type: frontendData.type,
        third_party_id: frontendData.third_party_id,
      },
      invoice_detail: frontendData.products.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        unit_price: product.unitPrice,
        discount: product.discount,
      })),
      payments: frontendData.paymentMethods.map((payment) => ({
        payment_method_id: payment.method,
        payment_date: frontendData.elaborationDate,
        amount: payment.amount,
      })),
    };
  }

  const getProductColumns = () => {
    return [
      {
        field: "type",
        header: "Tipo",
        body: (rowData: InvoiceProduct) => (
          <Dropdown
            value={rowData.typeProduct}
            options={productTypes}
            optionLabel="attributes.name"
            placeholder="Seleccione Tipo"
            className="w-100"
            onChange={(e) =>
              handleProductChange(rowData.id, "typeProduct", e.value)
            }
          />
        ),
      },
      {
        field: "product",
        header: "Producto",
        body: (rowData: InvoiceProduct) => (
          <Dropdown
            value={rowData.product}
            options={products}
            optionLabel="label"
            optionValue="id"
            placeholder="Seleccione Producto"
            className="w-100"
            filter
            onChange={(e) =>
              handleProductChange(rowData.id, "product", e.value)
            }
            virtualScrollerOptions={{ itemSize: 38 }}
          />
        ),
      },
      {
        field: "quantity",
        header: "Cantidad",
        body: (rowData: InvoiceProduct) => (
          <InputNumber
            value={rowData.quantity}
            placeholder="Cantidad"
            className="w-100"
            min={0}
            onValueChange={(e) =>
              handleProductChange(rowData.id, "quantity", e.value || 0)
            }
          />
        ),
      },
      {
        field: "price",
        header: "Valor unitario",
        body: (rowData: InvoiceProduct) => (
          <InputNumber
            value={rowData.price}
            placeholder="Precio"
            className="w-100"
            mode="currency"
            currency="DOP"
            locale="es-DO"
            min={0}
            onValueChange={(e) =>
              handleProductChange(rowData.id, "price", e.value || 0)
            }
          />
        ),
      },
      {
        field: "discount",
        header: "Descuento %",
        body: (rowData: InvoiceProduct) => (
          <InputNumber
            value={rowData.discount}
            placeholder="Descuento"
            className="w-100"
            suffix="%"
            min={0}
            max={100}
            onValueChange={(e) =>
              handleProductChange(rowData.id, "discount", e.value || 0)
            }
          />
        ),
      },
      {
        field: "iva",
        header: "Impuesto %",
        body: (rowData: InvoiceProduct) => (
          <Dropdown
            value={rowData.iva}
            options={ivaOptions}
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione IVA"
            className="w-100"
            onChange={(e) => handleProductChange(rowData.id, "iva", e.value)}
          />
        ),
      },
      {
        field: "withholdingtax",
        header: "Retención %",
        body: (rowData: InvoiceProduct) => (
          <Dropdown
            value={rowData.withholdingtax}
            options={retentionTaxOptions}
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione Retención"
            className="w-100"
            onChange={(e) =>
              handleProductChange(rowData.id, "withholdingtax", e.value)
            }
          />
        ),
      },
      {
        field: "totalvalue",
        header: "Valor total",
        body: (rowData: InvoiceProduct) => (
          <InputNumber
            value={(rowData.quantity || 0) * (rowData.price || 0)}
            className="w-100"
            mode="currency"
            currency="DOP"
            locale="es-DO"
            readOnly
          />
        ),
      },
      {
        field: "actions",
        header: "Acciones",
        body: (rowData: InvoiceProduct) => (
          <Button
            className="p-button-rounded p-button-danger p-button-text"
            onClick={() => removeProduct(rowData.id)}
            disabled={productsArray.length <= 1}
            tooltip="Eliminar producto"
          >
            {" "}
            <i className="fa-solid fa-trash"></i>
          </Button>
        ),
      },
    ];
  };

  return (
    <div className="container-fluid p-4">
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
                              {...field}
                              options={typeOptions}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Seleccione un tipo"
                              className={classNames("w-100")}
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
                            <Dropdown
                              {...field}
                              filter
                              options={thirdParties}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Seleccione un proveedor"
                              className={classNames("w-100")}
                            />
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
                            />
                          </>
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
                  onClick={addProduct}
                />
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  {!loadingProductTypes &&
                    !loadingProducts &&
                    (() => {
                      const productColumns = getProductColumns();

                      return (
                        <>
                          <DataTable
                            key={`products-table-${productTypes.length}`}
                            value={productsArray}
                            responsiveLayout="scroll"
                            emptyMessage="No hay productos agregados"
                            className="p-datatable-sm"
                            showGridlines
                            stripedRows
                          >
                            {productColumns.map((col, i) => (
                              <Column
                                key={i}
                                field={col.field}
                                header={col.header}
                                body={col.body}
                                style={{ minWidth: "150px" }}
                              />
                            ))}
                          </DataTable>
                        </>
                      );
                    })()}
                </div>
              </div>
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
                  onClick={addPayment}
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
                          value={payment.method}
                          options={filteredPaymentMethods}
                          optionLabel="method"
                          optionValue="id"
                          placeholder="Seleccione método"
                          className="w-100"
                          onChange={(e) => {
                            handlePaymentChange(payment.id, "method", e.value);

                            const selectedMethod = paymentMethods.find(
                              (m) => m.id === e.value
                            );
                            if (
                              selectedMethod?.method === "Anticipito Clientes"
                            ) {
                              handlePaymentChange(payment.id, "value", 0);
                            }
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-5">
                      <div className="form-group">
                        <label className="form-label">Valor *</label>
                        <InputNumber
                          value={payment.value}
                          placeholder="Valor"
                          className="w-100"
                          mode="currency"
                          currency="DOP"
                          locale="es-DO"
                          min={0}
                          onValueChange={(e) =>
                            handlePaymentChange(
                              payment.id,
                              "value",
                              e.value || 0
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
                      <label className="form-label">Retención</label>
                      <InputNumber
                        value={calculateTotalWithholdingTax()}
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
      <h1>Hola</h1>

      <Toast ref={(el) => (window["toast"] = el)} />
      <style>{`
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

                /* Efecto de desvanecido mientras carga */
                .loading-overlay {
                position: relative;
                }

                .loading-overlay::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.7);
                z-index: 10;
                display: flex;
                justify-content: center;
                align-items: center;
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
      <AdvanceHistoryModal
        show={showAdvancesModal}
        customerId={customerId}
        invoiceTotal={calculateTotal()}
        onSelectAdvances={handleSelectAdvances}
        onHide={() => setShowAdvancesModal(false)}
      />
    </div>
  );
};
const TypeColumnBody = ({ onChange }: {
  onChange: (value: string) => void;
}) => {

  const options = [
    { id: "supplies", name: "Insumos" },
    { id: "medications", name: "Medicamentos" },
    { id: "vaccines", name: "Vacunas" },
    { id: "services", name: "Servicios" },
  ]
  const [value, setValue] = useState<string | null>(null);

  return <>
    <Dropdown
      value={value}
      options={options}
      optionLabel="name"
      optionValue="id"
      placeholder="Seleccione Tipo"
      className="w-100"
      onChange={async (e: any) => {
        setValue(e.value);
        onChange(e.value);
      }}
    />
  </>
};

const ProductColumnBody = ({ type, onChange }: {
  type: string | null;
  onChange: (value: string) => void;
}) => {

  const { getByType, products } = useInventory();

  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    console.log('Type in ProductColumnBody', type);

    if (!type) return;
    getByType(type);
  }, [type]);



  return <>
    <Dropdown
      value={value}
      options={products}
      optionLabel="label"
      optionValue="id"
      placeholder="Seleccione Producto"
      className="w-100"
      filter
      onChange={(e: any) => {
        setValue(e.value);
        onChange(e.value);
      }}
      virtualScrollerOptions={{ itemSize: 38 }}
      emptyMessage={"No hay productos disponibles"}
    />
  </>
};

const QuantityColumnBody = ({ onChange }: {
  onChange: (value: number | null) => void;
}) => {

  const [value, setValue] = useState<number | null>(null);

  return <>
    <InputNumber
      value={value}
      placeholder="Cantidad"
      className="w-100"
      style={{ maxWidth: "100px" }}
      min={0}
      onValueChange={(e: any) => {
        setValue(e.value)
        onChange(e.value)
      }}
    />
  </>
};

const PriceColumnBody = ({ onChange }: {
  onChange: (value: number | null) => void;
}) => {

  const [value, setValue] = useState<number | null>(null);

  return <InputNumber
    value={value}
    placeholder="Precio"
    className="w-100"
    mode="currency"
    currency="DOP"
    style={{ maxWidth: "130px" }}
    locale="es-DO"
    min={0}
    onValueChange={(e: any) => {
      setValue(e.value)
      onChange(e.value)
    }}
  />
};

const DiscountColumnBody = ({ onChange }: {
  onChange: (value: number | null) => void;
}) => {

  const [value, setValue] = useState<number | null>(null);

  return <>
    <InputNumber
      value={value}
      placeholder="Descuento"
      className="w-100"
      style={{ maxWidth: "120px" }}
      suffix="%"
      min={0}
      max={100}
      onValueChange={(e: any) => {
        setValue(e.value)
        onChange(e.value)
      }}
    />
  </>
};

const IvaColumnBody = ({ ivaOptions, onChange }: {
  ivaOptions: any[];
  onChange: (value: string | null) => void;
}) => {

  const [value, setValue] = useState<string | null>(null);

  return <Dropdown
    value={value}
    options={ivaOptions}
    optionLabel="name"
    optionValue="id"
    placeholder="Seleccione IVA"
    className="w-100"
    onChange={(e: any) => {
      setValue(e.value);
      onChange(e.value);
    }}
  />
};

const WithholdingTaxColumnBody = ({
  onChange,
  retentionTaxOptions
}: {
  onChange: (value: string | null) => void;
  retentionTaxOptions: any[];
}) => {

  const [value, setValue] = useState<string | null>(null);

  return <Dropdown
    value={value}
    options={retentionTaxOptions}
    optionLabel="name"
    optionValue="id"
    placeholder="Seleccione Retención"
    className="w-100"
    onChange={(e: any) => {
      setValue(e.value);
      onChange(e.value);
    }}
  />
}};