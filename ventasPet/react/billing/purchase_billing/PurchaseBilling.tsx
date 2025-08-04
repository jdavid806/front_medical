import React, { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../third-parties/hooks/useThirdParties";
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods";
import { useProductTypes } from "../../product-types/hooks/useProductTypes";
import { useUsers } from "../../users/hooks/useUsers";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts";
import { SplitButton } from "primereact/splitbutton";
import MedicationFormModal from "../../inventory/medications/MedicationFormModal";
import { MedicationFormInputs } from "../../inventory/medications/MedicationForm";
import SupplyFormModal from "../../inventory/supply/SupplyFormModal";
import { SupplyFormInputs } from "../../inventory/supply/SupplyForm";
import VaccineFormModal from "../../inventory/vaccine/VaccineFormModal";
import { VaccineFormInputs } from "../../inventory/vaccine/VaccineForm";
import { useInvoicePurchase } from "./hooks/usePurchaseBilling";
import { useInventory } from "./hooks/useInventory";
import {
  TypeOption,
  CostCenterOption,
  PaymentMethod,
  InvoiceProduct,
} from "./types/purchaseTypes";
import {
  ExpirationLotFormInputs,
} from "../../inventory/lote/ExpirationLotForm";
import ExpirationLotModal from "../../inventory/lote/ExpirationLotModal";

export const PurchaseBilling: React.FC = () => {

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productForExpiration, setProductForExpiration] = useState<{
    id: string;
    productId: string;
    productName: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const toast = useRef<Toast>(null);
  const [productsArray, setProductsArray] = useState<InvoiceProduct[]>([
    {
      id: generateId(),
      typeProduct: "medications", // Valor por defecto
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      iva: null,
      withholdingtax: null,
    },
  ]);

  const { thirdParties } = useThirdParties();
  const { users } = useUsers();
  const { centresCosts } = useCentresCosts();  
  const { productTypes, loading: loadingProductTypes } = useProductTypes();
  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

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
  };

  const handleSaveExpiration = (data: ExpirationLotFormInputs) => {
    if (productForExpiration) {
      // Aquí puedes hacer lo que necesites con los datos de expiración y lote
      console.log("Datos de caducidad/lote para producto:", {
        productId: productForExpiration.productId,
        ...data,
      });

      // Actualizar el producto en el estado si es necesario
      setProductsArray((prev) =>
        prev.map((p) =>
          p.id === productForExpiration.id
            ? {
              ...p,
            }
            : p
        )
      );
    }

    setIsModalVisible(false);
    setProductForExpiration(null);
  };
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [initialDataMedication, setInitialDataMedication] = useState<
    MedicationFormInputs | undefined
  >(undefined);
  const [initialDataSupply, setInitialDataSupply] = useState<
    SupplyFormInputs | undefined
  >(undefined);
  const [initialDataVaccine, setInitialDataVaccine] = useState<
    VaccineFormInputs | undefined
  >(undefined);
  const { storeInvoice, loading } = useInvoicePurchase();

  useEffect(() => {
    if (paymentMethods) {
      setFilteredPaymentMethods(
        paymentMethods.filter((paymentMethod) =>
          ["transactional", "supplier_expiration", "supplier_advance"].includes(
            paymentMethod.category
          )
        )
      );
    }
  }, [paymentMethods]);

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

  const costCenterOptions: CostCenterOption[] = [
    { id: 1, name: "COMPRAS" },
    { id: 2, name: "INVENTARIO" },
    { id: 3, name: "LOGISTICA" },
    { id: 4, name: "ADMINISTRACION" },
  ];

  const ivaOptions: TypeOption[] = [
    { id: 0, name: "0%" },
    { id: 12, name: "12%" },
    { id: 18, name: "18%" },
  ];

  const retentionTaxOptions: TypeOption[] = [
    { id: 0, name: "NO_APLICA" },
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

  const calculateTotalWithholding = (): number => {
    return productsArray.reduce((total, product) => {
      const subtotal =
        (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const withholdingRate = product.withholdingtax
        ? Number(product.withholdingtax.id)
        : 0;
      return total + subtotalAfterDiscount * (withholdingRate / 100);
    }, 0);
  };

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

  const removeProduct = (id: string) => {
    if (productsArray.length > 1) {
      setProductsArray(productsArray.filter((product) => product.id !== id));
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos un producto",
        life: 3000,
      });
    }
  };

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
      setPaymentMethodsArray(
        paymentMethodsArray.filter((payment) => payment.id !== id)
      );
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos un método de pago",
        life: 3000,
      });
    }
  };

  const handleSubmitMedication = (data: MedicationFormInputs) => {
    console.log("Conectar SupplyFormInputs");
  };

  const handleSubmitSupply = (data: SupplyFormInputs) => {
    console.log("Conectar SupplyFormInputs");
  };

  const handleSubmitVaccine = (data: VaccineFormInputs) => {
    console.log("Conectar VaccineFormInputs");
  };

  // Función para manejar el cambio en los métodos de pago
  const handlePaymentChange = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) => {
    setPaymentMethodsArray((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id
          ? { ...payment, [field]: field === "value" ? Number(value) : value }
          : payment
      )
    );
  };

  // Función para construir el objeto de datos a enviar al backend
  const buildInvoiceData = (formData: any) => {
    return {
      invoice: {
        invoice_code: formData.invoiceNumber,
        resolution_number: "RES-2025-02", // Puedes hacerlo dinámico si lo necesitas
        type: formData.type,
        user_id: formData.buyer?.id || 1,
        due_date: formData.expirationDate,
        observations: `Factura de compra ${formData.invoiceNumber}`,
        payment_method_id: paymentMethodsArray?.[0]?.method || 1,
      },

      invoice_detail: productsArray.map((product) => ({
        product_id: product.product,
        quantity: product.quantity,
        unit_price: product.price,
        discount: product.discount,
      })),

      retentions: {
        retention_type: productsArray?.[0]?.withholdingtax?.id || 0,
      },

      payments: paymentMethodsArray.map((payment) => ({
        payment_method_id: payment.method,
        payment_date: formData.elaborationDate,
        amount: payment.value,
        notes: payment.authorizationNumber || "Pago",
      })),
    };
  };

  // ✅ Función para guardar (solo validación y vista previa en consola)
  const save = (formData: any) => {
    // Validaciones
    if (productsArray.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un producto",
        life: 5000,
      });
      return;
    }

    if (paymentMethodsArray.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un método de pago",
        life: 5000,
      });
      return;
    }

    if (!paymentCoverage()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(
          2
        )}) no cubren el total de la factura (${calculateTotal().toFixed(2)})`,
        life: 5000,
      });
      return;
    }

    const invoiceData = buildInvoiceData(formData);

    console.log("Datos de la factura de compra:", invoiceData);

    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Factura de compra validada correctamente",
      life: 3000,
    });
  };

  // ✅ Función para guardar y enviar (envía al backend usando tu hook)
  const saveAndSend = async (formData: any) => {
    try {
      const invoiceData = buildInvoiceData(formData);
      await storeInvoice(invoiceData);

      console.log("Factura de compra enviada al backend:", invoiceData);

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura de compra guardada y enviada",
        life: 3000,
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Error al guardar la factura",
        life: 3000,
      });
    }
  };

  // Columnas para la tabla de productos
  const getProductColumns = () => {

    return [
      {
        field: "type",
        header: "Tipo",
        body: (rowData: InvoiceProduct) => (
          <TypeColumnBody onChange={(newType: string) => {
            handleProductChange(rowData.id, "typeProduct", newType);
            handleProductChange(rowData.id, "product", null);
          }} />
        )
      },
      {
        field: "product",
        header: "Producto",
        body: (rowData: InvoiceProduct) => {
          return (
            <ProductColumnBody type={rowData.typeProduct} onChange={(value: string) => {
              handleProductChange(rowData.id, "product", value)
            }} />
          );
        }
      },
      {
        field: "quantity",
        header: "Cantidad",
        body: (rowData: InvoiceProduct) => (
          <QuantityColumnBody onChange={(value: number | null) => handleProductChange(rowData.id, "quantity", value || 0)} />
        ),
        style: { minWidth: "90px" },
      },
      {
        field: "price",
        header: "Valor unitario",
        body: (rowData: InvoiceProduct) => (
          <PriceColumnBody onChange={(value: number | null) => handleProductChange(rowData.id, "price", value || 0)} />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "discount",
        header: "Descuento %",
        body: (rowData: InvoiceProduct) => (
          <DiscountColumnBody onChange={(value: number | null) => handleProductChange(rowData.id, "discount", value || 0)} />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "iva",
        header: "IVA %",
        body: (rowData: InvoiceProduct) => (
          <IvaColumnBody ivaOptions={ivaOptions} onChange={(value: string | null) => handleProductChange(rowData.id, "iva", value)} />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "withholdingtax",
        header: "Retención %",
        body: (rowData: InvoiceProduct) => (
          <WithholdingTaxColumnBody retentionTaxOptions={retentionTaxOptions} onChange={(value: string | null) => handleProductChange(rowData.id, "withholdingtax", value)} />
        ),
        style: { minWidth: "100px" },
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

  return (
    <div className="container-fluid p-4">
      {/* Main Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-0 text-primary">
                    <i className="pi pi-file-invoice me-2"></i>
                    Crear nueva factura de compra
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(save)}>
            {/* Basic Information Section */}
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
                      <label className="form-label">Número de factura *</label>
                      <Controller
                        name="invoiceNumber"
                        control={control}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            placeholder="Número de factura"
                            className="w-100"
                          />
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
                          <Calendar
                            {...field}
                            placeholder="Seleccione fecha"
                            className={classNames("w-100")}
                            showIcon
                            dateFormat="dd/mm/yy"
                          />
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
                        render={({ field }) => (
                          <Calendar
                            {...field}
                            placeholder="Seleccione fecha"
                            className={classNames("w-100")}
                            showIcon
                            dateFormat="dd/mm/yy"
                          />
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
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={thirdParties}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Seleccione proveedor"
                            className={classNames("w-100")}
                          />
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
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Comprador *</label>
                      <Controller
                        name="buyer"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={users}
                            optionLabel="full_name"
                            optionValue="id"
                            placeholder="Seleccione comprador"
                            className={classNames("w-100")}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="pi pi-shopping-cart me-2 text-primary"></i>
                  Productos/Servicios
                </h2>
                <SplitButton
                  label="Añadir producto"
                  icon="pi pi-plus"
                  model={[
                    {
                      label: "Insumo",
                      command: () => setShowInsumoModal(true),
                    },
                    {
                      label: "Vacuna",
                      command: () => setShowVaccineModal(true),
                    },
                    {
                      label: "Medicamento",
                      command: () => setShowMedicamentoModal(true),
                    },
                  ]}
                  severity="contrast"
                  onClick={addProduct}
                  disabled={loadingProductTypes}
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
                      responsiveLayout="scroll"
                      emptyMessage="No hay productos agregados"
                      className="p-datatable-sm p-datatable-gridlines"
                      showGridlines
                      scrollable
                      stripedRows
                      scrollHeight="flex"
                      loading={false}
                      size="small"
                    >
                      {getProductColumns().map((col, i) => (
                        <Column
                          key={i}
                          field={col.field}
                          header={col.header}
                          body={col.body}
                          style={col.style}
                        />
                      ))}
                    </DataTable>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Methods Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="pi pi-credit-card me-2 text-primary"></i>
                  Método de pago (DOP)
                </h2>
                <Button
                  icon="pi pi-plus"
                  label="Agregar método"
                  className="btn btn-primary"
                  onClick={addPayment}
                >
                  <i className="fa-solid fa-plus me-2"></i>
                </Button>
              </div>
              <div className="card-body">
                <div className="payment-methods-section">
                  {paymentMethodsArray.map((payment) => (
                    <div key={payment.id} className="payment-method-row">
                      <div className="payment-method-field">
                        <label className="payment-method-label">Método *</label>
                        <Dropdown
                          value={payment.method}
                          options={filteredPaymentMethods}
                          optionLabel="method"
                          optionValue="id"
                          placeholder="Seleccione método"
                          className="payment-dropdown"
                          onChange={(e) =>
                            handlePaymentChange(payment.id, "method", e.value)
                          }
                        />
                      </div>

                      <div className="payment-method-field">
                        <label className="payment-method-label">
                          Número autorización *
                        </label>
                        <InputText
                          value={payment.authorizationNumber}
                          placeholder="Número autorización"
                          className="payment-input"
                          onChange={(e) =>
                            handlePaymentChange(
                              payment.id,
                              "authorizationNumber",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="payment-method-field">
                        <label className="payment-method-label">Valor</label>
                        <InputNumber
                          value={payment.value}
                          placeholder="Ingrese valor"
                          className="payment-input"
                          mode="currency"
                          currency="DOP"
                          locale="es-DO"
                          min={0}
                          minFractionDigits={2}
                          maxFractionDigits={6}
                          onValueChange={(e) =>
                            handlePaymentChange(
                              payment.id,
                              "value",
                              e.value || 0
                            )
                          }
                        />
                      </div>

                      <div className="payment-method-actions">
                        <Button
                          className="payment-delete-button"
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

                  <div className="payment-summary">
                    <div
                      className={`payment-summary-card ${!paymentCoverage()
                        ? "payment-warning"
                        : "payment-success"
                        }`}
                    >
                      <div className="payment-summary-item">
                        <strong>Total factura:</strong>
                        <InputNumber
                          value={calculateTotal()}
                          className="payment-summary-input"
                          mode="currency"
                          currency="DOP"
                          locale="es-DO"
                          minFractionDigits={2}
                          maxFractionDigits={3}
                          readOnly
                        />
                      </div>

                      <div className="payment-summary-item">
                        <strong>Total pagos:</strong>
                        <InputNumber
                          value={calculateTotalPayments()}
                          className="payment-summary-input"
                          mode="currency"
                          currency="DOP"
                          locale="es-DO"
                          minFractionDigits={2}
                          maxFractionDigits={3}
                          readOnly
                        />
                      </div>

                      <div className="payment-summary-status">
                        {!paymentCoverage() ? (
                          <span className="payment-status-warning">
                            <i className="pi pi-exclamation-triangle me-2"></i>
                            Faltan{" "}
                            {(
                              calculateTotal() - calculateTotalPayments()
                            ).toFixed(2)}{" "}
                            DOP
                          </span>
                        ) : (
                          <span className="payment-status-success">
                            <i className="pi pi-check-circle me-2"></i>
                            Pagos completos
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light">
                <h2 className="h5 mb-0">
                  <i className="pi pi-calculator me-2 text-primary"></i>
                  Resumen de compra (DOP)
                </h2>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="form-label">SUBTOTAL</label>
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
                      <label className="form-label">IVA</label>
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
                        value={calculateTotalWithholding()}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">TOTAL</label>
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

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-3 mb-4">
              <Button
                label="Guardar"
                icon="pi pi-check"
                className="btn-info"
                type="submit"
              />
              <Button
                label="Guardar y enviar"
                icon="pi pi-send"
                className="btn-info"
                onClick={handleSubmit(saveAndSend)}
                disabled={!paymentCoverage()}
              />
            </div>
          </form>

          {/* Modals */}
          <MedicationFormModal
            show={showMedicamentoModal}
            handleSubmit={handleSubmitMedication}
            onHide={() => setShowMedicamentoModal(false)}
            initialData={initialDataMedication}
          />

          <SupplyFormModal
            show={showInsumoModal}
            handleSubmit={handleSubmitSupply}
            onHide={() => setShowInsumoModal(false)}
            initialData={initialDataSupply}
          />

          <VaccineFormModal
            show={showVaccineModal}
            handleSubmit={handleSubmitVaccine}
            onHide={() => setShowVaccineModal(false)}
            initialData={initialDataVaccine}
          />
          <ExpirationLotModal
            isVisible={isModalVisible}
            onSave={handleSaveExpiration}
            onClose={() => {
              setIsModalVisible(false);
              setProductForExpiration(null);
            }}
            productName={productForExpiration?.productName}
          />
        </div>
      </div>
      <Toast ref={toast} />

      <style>{`
                .p-datatable .p-inputnumber {
                    width: 100% !important;
                }
                .p-datatable .p-inputnumber-input {
                    width: 100% !important;
                }
                /* Estilos para la sección de métodos de pago */
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
            `}</style>
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
      onChange={async (e: DropdownChangeEvent) => {
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
      onChange={(e: DropdownChangeEvent) => {
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
    onChange={(e: DropdownChangeEvent) => {
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
    placeholder="Seleccione Retenciónnnnnnnnn"
    className="w-100"
    onChange={(e: DropdownChangeEvent) => {
      setValue(e.value);
      onChange(e.value);
    }}
  />
};

