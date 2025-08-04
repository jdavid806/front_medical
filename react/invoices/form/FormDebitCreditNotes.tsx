import React, { Suspense, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  InputText,
  Dropdown,
  Calendar,
  DataTable,
  Column,
  Toast,
  InputNumber,
} from "primereact";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts";
import { getUserLogged } from "../../../services/utilidades";
import { productService, invoiceService } from "../../../services/api";
import { useTaxes } from "../hooks/useTaxes";
import { useBillingByType } from "../../billing/hooks/useBillingByType";

// Definición de tipos

type CostCenterOption = {
  id: number;
  name: string;
};

type Product = {
  id: string;
  name: string;
};

type Client = {
  id: number;
  name: string;
};

type TaxOption = {
  id: number;
  name: string;
  percentage: number;
};

type BillingItem = {
  id: string;
  productId?: string;
  productName?: string;
  product?: Product | string;
  description: string;
  quantity: number;
  originalQuantity?: number;
  unitPrice: any;
  originalUnitPrice?: number;
  discount: any;
  taxId?: number;
  tax: TaxOption | number;
  totalValue: number;
  fromInvoice?: boolean;
};

type FormData = {
  documentType: null;
  documentNumber: string;
  noteType: any;
  client: Client | null;
  elaborationDate: Date | null;
  costCenter: CostCenterOption | null;
};

export const FormDebitCreditNotes: React.FC<any> = ({
  initialData,
  onSuccess,
}) => {
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      documentType: null,
      documentNumber: "",
      noteType: null,
      client: null,
      elaborationDate: new Date(),
      costCenter: null,
    },
  });
  const { thirdParties } = useThirdParties();
  const { centresCosts } = useCentresCosts();
  const { fetchBillingByType } = useBillingByType();
  const [billing, setBilling] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clientSelected, setClientSelected] = useState<any>(null);
  const [centresCostsSelected, setCentresCostsSelected] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const toast = useRef<Toast>(null);
  const [billingItems, setBillingItems] = useState<BillingItem[]>([
    {
      id: generateId(),
      product: "",
      description: "",
      quantity: 0,
      unitPrice: null,
      discount: null,
      tax: 0,
      totalValue: 0,
    },
  ]);

  const noteType: any = watch("noteType");

  useEffect(() => {
    if (invoices.length && initialData) {
      const invoice = invoices.filter(
        (invoice: any) => invoice.id === Number(initialData.id)
      )[0];
      if (invoice) {
        setSelectedInvoice(invoice);
        handleProductsOfInvoice(invoice);
        setIsModalActive(true);
        setValue("noteType", initialData.noteType);
        setValue("elaborationDate", new Date(initialData.fecha));
      }
    }

    if (thirdParties.length && initialData && initialData.third_party) {
      const clientFound = thirdParties.find(
        (client: any) => client.id == initialData.third_party.id
      );
      setClientSelected(clientFound);
    }
    if (centresCosts.length && initialData && initialData.centre_cost) {
      const centreCostFound = centresCosts.find(
        (centre: any) => centre.id == initialData.centre_cost.id
      );
      setCentresCostsSelected(centreCostFound);
    }
  }, [initialData, invoices]);

  useEffect(() => {
    loadInvoices();
    loadProducts();
  }, []);

  async function loadInvoices() {
    const invoices = await invoiceService.getTogenerateNotes();
    setInvoices(invoices);
  }

  const loadProducts = async () => {
    const response = await productService.getAllProducts();
    setProducts(response.data.map((product) => product.attributes));
  };

  // Helper function to generate unique IDs
  function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = (item: BillingItem): number => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate =
      typeof item.tax === "object"
        ? item.tax.percentage
        : Number(item.tax) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);

    const lineTotal = subtotalAfterDiscount + taxAmount;

    return parseFloat(lineTotal.toFixed(2));
  };

  const calculateSubtotal = (): number => {
    return billingItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return total + quantity * unitPrice;
    }, 0);
  };

  const calculateTotalDiscount = (): number => {
    return billingItems.reduce((total, item) => {
      const subtotal =
        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discount = Number(item.discount) || 0;
      return total + subtotal * (discount / 100);
    }, 0);
  };

  const calculateTotalTax = (): number => {
    return billingItems.reduce((total, item) => {
      const subtotal =
        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxRate =
        typeof item.tax === "object"
          ? item.tax.percentage
          : Number(item.tax) || 0;
      return total + subtotalAfterDiscount * (taxRate / 100);
    }, 0);
  };

  const calculateSubtotalAfterDiscount = (): number => {
    return calculateSubtotal() - calculateTotalDiscount();
  };

  const calculateTotal = (): number => {
    return billingItems.reduce((total, item) => {
      return total + calculateLineTotal(item);
    }, 0);
  };

  // Funciones para manejar items de facturación
  const addBillingItem = (): void => {
    setBillingItems([
      ...billingItems,
      {
        id: generateId(),
        product: "",
        description: "",
        quantity: 0,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        totalValue: 0,
        fromInvoice: false,
      },
    ]);
  };

  const removeBillingItem = (id: string): void => {
    if (billingItems.length > 1) {
      setBillingItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    }
  };

  const handleBillingItemChange = (id: string, field, value: any): void => {
    setBillingItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  function validatedCreditDebitNoteProducts(billingItems) {
    let isIrregularNoteType = false;
    let productsWithErrors: any = [];

    billingItems.forEach((item: any) => {
      switch (noteType?.id) {
        case "DEBIT":
          if (
            item.quantity < item.originalQuantity ||
            item.unitPrice < item.originalUnitPrice
          ) {
            isIrregularNoteType = true;
            productsWithErrors.push(item.productName);
          }
          break;
        case "CREDIT":
          if (
            item.quantity > item.originalQuantity ||
            item.unitPrice > item.originalUnitPrice
          ) {
            isIrregularNoteType = true;
            productsWithErrors.push(item.productName);
          }
          break;
      }
    });

    if (isIrregularNoteType) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Hay itens de factura irregulares en la nota" +
          noteType?.name +
          ", productos: " +
          productsWithErrors.join(", "),
        life: 5000,
      });
    }

    return isIrregularNoteType;
  }

  // Funciones para guardar
  const save = async (formData: any): void => {
    const validateForm = validatedCreditDebitNoteProducts(billingItems);
    const billingTypeMap = {
      DEBIT: "debit_note",
      CREDIT: "credit_note",
    }
    const billing = await fetchBillingByType(billingTypeMap[noteType?.id]);
    const noteData = {
      invoice_id: selectedInvoice?.id,
      amount: calculateTotal(),
      reason: "Ajuste por error en la facturación",
      details: billingItems.map((item: any) => {
        const priceAdjustment = item.unitPrice - Number(item.originalUnitPrice);
        return {
          product_id: item.productId || item.product.id,
          quantity: item.quantity,
          price_adjustment: priceAdjustment,
        };
      }),
      billing: billing.data,
    };
    if (!validateForm) {
      switch (noteType?.id) {
        case "DEBIT":
          invoiceService
            .createDebitNote(noteData)
            .then((response) => {
              if (response) {
                toast.current?.show({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Nota débito guardada",
                  life: 2000,
                });
              }
              if (isModalActive) {
                onSuccess();
              } else {
                setTimeout(() => {
                  window.location.href = "FE_FCE";
                }, 1000);
              }
            })
            .catch((error) => { });
          break;
        case "CREDIT":
          invoiceService
            .createCreditNote(noteData)
            .then((response) => {
              if (response) {
                toast.current?.show({
                  severity: "success",
                  summary: "Éxito",
                  detail: "Nota crédito guardada",
                  life: 2000,
                });
              }
              if (isModalActive) {
                onSuccess();
              } else {
                setTimeout(() => {
                  window.location.href = "FE_FCE";
                }, 1000);
              }
            })
            .catch((error) => { });
          break;
      }
    }
  };

  const saveAndSend = (formData: FormData): void => {
    save(formData);
  };

  function handleProductsOfInvoice(invoice) {
    setSelectedInvoice(invoice);
    setBillingItems([]);
    if (invoice.third_party) {
      const clientFound = thirdParties.find(
        (client: any) => client.id == invoice.third_party.id
      );
      setClientSelected(clientFound);
    } else {
      setClientSelected(null);
    }
    if (invoice.centre_cost) {
      const centreCostFound = centresCosts.find(
        (centre: any) => centre.id == invoice.centre_cost.id
      );
      setCentresCostsSelected(centreCostFound);
    } else {
      setCentresCostsSelected(null);
    }
    setValue("elaborationDate", new Date(invoice.created_at));
    const productsMapped = invoice?.details.map((product) => {
      const rateDiscunt =
        (Number(product.discount) / Number(product.amount)) * 100 || 0;
      return {
        id: generateId(),
        productId: product.product.id, // Guardamos solo el ID
        productName: product.product.name,
        description: "",
        quantity: product.quantity,
        originalQuantity: product.quantity, // Guardamos el valor original
        unitPrice: product.unit_price,
        originalUnitPrice: product.unit_price,
        discount: rateDiscunt,
        taxId: product?.tax_charge?.id || 0,
        totalValue: 0,
        fromInvoice: true,
      };
    });
    setBillingItems(productsMapped);
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
    }).format(value || 0);
  };

  const [tableKey, setTableKey] = useState(0);

  useEffect(() => {
    // Forzar recreación de la tabla cuando noteType cambie
    setTableKey((prevKey) => prevKey + 1);
  }, [noteType]);

  // Columnas para la tabla de items de facturación
  const billingItemColumns = React.useMemo(
    () => [
      {
        field: "product",
        header: "Producto",
        body: (rowData: BillingItem) => (
          <ProductDropdown
            key={`${rowData.id}-${selectedInvoice?.id}`}
            rowData={rowData}
            handleBillingItemChange={handleBillingItemChange}
          />
        ),
      },
      {
        field: "quantity",
        header: "Cantidad",
        body: (rowData: BillingItem) => (
          <InputNumber
            value={rowData.quantity}
            placeholder="Cantidad"
            className="w-100"
            min={
              noteType?.id === "DEBIT" ? rowData.originalQuantity : undefined
            }
            max={
              noteType?.id === "CREDIT" ? rowData.originalQuantity : undefined
            }
            disabled={!noteType}
            onValueChange={(e) => {
              if (!noteType) return;

              const newValue = e.value || 0;
              const originalValue = rowData.originalQuantity || 0;

              if (noteType.id === "DEBIT") {
                // Débito: solo permite aumentar
                if (newValue >= originalValue) {
                  handleBillingItemChange(rowData.id, "quantity", newValue);
                } else {
                  // Si intenta disminuir, mantenemos el valor original
                  handleBillingItemChange(
                    rowData.id,
                    "quantity",
                    originalValue
                  );
                }
              } else {
                // Crédito: solo permite disminuir
                if (newValue <= originalValue && newValue >= 0) {
                  handleBillingItemChange(rowData.id, "quantity", newValue);
                } else {
                  // Si intenta aumentar, mantenemos el valor original
                  handleBillingItemChange(
                    rowData.id,
                    "quantity",
                    originalValue
                  );
                }
              }
            }}
            tooltip={
              noteType
                ? noteType.id === "DEBIT"
                  ? `Mínimo: ${rowData.originalQuantity} (valor original)`
                  : `Máximo: ${rowData.originalQuantity} (valor original)`
                : "Seleccione tipo de nota"
            }
          />
        ),
      },
      {
        field: "unitPrice",
        header: "Valor unitario",
        body: (rowData: BillingItem) => (
          <InputNumber
            value={rowData.unitPrice}
            placeholder="Precio"
            className="w-100"
            mode="currency"
            currency="DOP"
            locale="es-DO"
            min={
              noteType?.id === "DEBIT" ? rowData.originalUnitPrice : undefined
            }
            max={
              noteType?.id === "CREDIT" ? rowData.originalUnitPrice : undefined
            }
            disabled={!noteType}
            onValueChange={(e) => {
              if (!noteType) return;

              const newValue = e.value || 0;
              const originalValue = rowData.originalUnitPrice || 0;

              if (noteType.id === "DEBIT") {
                // Débito: solo permite aumentar
                if (newValue >= originalValue) {
                  handleBillingItemChange(rowData.id, "unitPrice", newValue);
                } else {
                  handleBillingItemChange(
                    rowData.id,
                    "unitPrice",
                    originalValue
                  );
                }
              } else {
                // Crédito: solo permite disminuir
                if (newValue <= originalValue && newValue >= 0) {
                  handleBillingItemChange(rowData.id, "unitPrice", newValue);
                } else {
                  handleBillingItemChange(
                    rowData.id,
                    "unitPrice",
                    originalValue
                  );
                }
              }
            }}
            tooltip={
              noteType
                ? noteType.id === "DEBIT"
                  ? `Mínimo: ${formatCurrency(
                    rowData.originalUnitPrice || 0
                  )} (valor original)`
                  : `Máximo: ${formatCurrency(
                    rowData.originalUnitPrice || 0
                  )} (valor original)`
                : "Seleccione tipo de nota"
            }
          />
        ),
      },
      {
        field: "discount",
        header: "% Dscto",
        body: (rowData: BillingItem) => (
          <InputNumber
            value={rowData.discount}
            readOnly
            placeholder="Descuento"
            className="w-100"
            suffix="%"
            min={0}
            max={100}
            onValueChange={(e) =>
              handleBillingItemChange(rowData.id, "discount", e.value || 0)
            }
          />
        ),
      },
      {
        field: "tax",
        header: "Impuesto",
        body: (rowData: BillingItem) => (
          <IvaColumnBody
            key={`${rowData.id}-${selectedInvoice?.id}`}
            rowData={rowData}
            handleBillingItemChange={handleBillingItemChange}
          />
        ),
      },
      {
        field: "totalValue",
        header: "Valor total",
        body: (rowData: BillingItem) => (
          <InputNumber
            value={calculateLineTotal(rowData)}
            className="w-100"
            mode="currency"
            currency="DOP"
            locale="es-DO"
            readOnly
          />
        ),
      },
      {
        field: "description",
        header: "Descripción",
        body: (rowData: BillingItem) => (
          <InputText
            value={rowData.description}
            placeholder="Ingresar Descripción"
            className="w-100"
            onChange={(e) =>
              handleBillingItemChange(rowData.id, "description", e.target.value)
            }
          />
        ),
      },
      {
        field: "actions",
        header: "Acciones",
        body: (rowData: BillingItem) =>
          rowData.fromInvoice ? null : (
            <Button
              className="p-button-rounded p-button-danger p-button-text"
              onClick={() => removeBillingItem(rowData.id)}
              disabled={billingItems.length <= 1}
              tooltip="Eliminar item"
            >
              <i className="fa-solid fa-trash"></i>
            </Button>
          ),
      },
    ],
    [
      noteType,
      selectedInvoice,
      handleBillingItemChange,
      billingItems,
      removeBillingItem,
      calculateLineTotal,
    ]
  );

  return (
    <div className="container-fluid p-4">
      {/* Encabezado */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="h3 mb-0 text-primary">
                <i className="pi pi-file-edit me-2"></i>
                Crear Nota de Débito/Crédito
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
                      <label className="form-label">Factura *</label>
                      <Controller
                        name="documentType"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            options={invoices}
                            optionLabel="invoice_code"
                            placeholder="Seleccione"
                            className="w-100"
                            filter
                            virtualScrollerOptions={{ itemSize: 38 }}
                            value={selectedInvoice} // Esto muestra visualmente la selección
                            onChange={(e) => {
                              field.onChange(e.value); // Si estás usando Formik o similar
                              handleProductsOfInvoice(e.value);
                            }}
                            disabled={isModalActive}
                            appendTo="self"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Número de nota *</label>
                      <Controller
                        name="documentNumber"
                        control={control}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            placeholder="Número generado automáticamente"
                            className="w-100"
                            readOnly
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Tipo *</label>
                      <Controller
                        name="noteType"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            options={[
                              { id: "DEBIT", name: "Débito" },
                              { id: "CREDIT", name: "Crédito" },
                            ]}
                            optionLabel="name"
                            placeholder="Seleccione tipo"
                            className="w-100"
                            appendTo="self"
                            disabled={isModalActive}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Cliente *</label>
                      <Controller
                        name="client"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            options={thirdParties}
                            value={clientSelected}
                            optionLabel="name"
                            placeholder="Seleccione cliente"
                            className="w-100"
                            filter
                            virtualScrollerOptions={{ itemSize: 38 }}
                            appendTo="self"
                            disabled={true}
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
                            className="w-100"
                            showIcon
                            dateFormat="dd/mm/yy"
                            disabled={true}
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
                            options={centresCosts}
                            value={centresCostsSelected}
                            optionLabel="name"
                            placeholder="Seleccione centro"
                            className="w-100"
                            filter
                            virtualScrollerOptions={{ itemSize: 38 }}
                            appendTo="self"
                            disabled={true}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sección de Información de Facturación */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-light d-flex justify-content-between align-items-center">
                <h2 className="h5 mb-0">
                  <i className="pi pi-shopping-cart me-2 text-primary"></i>
                  Información de Facturación
                </h2>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label={`${!noteType ? "Seleccione tipo" : "Añadir "}`}
                  className={`btn ${!noteType ? "btn-secondary" : "btn-primary"
                    }`}
                  onClick={addBillingItem}
                  disabled={!noteType || noteType?.id === "CREDIT"}
                />
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <DataTable
                    key={tableKey}
                    value={billingItems}
                    responsiveLayout="scroll"
                    emptyMessage="No hay items agregados"
                    className="p-datatable-sm"
                    showGridlines
                    stripedRows
                  >
                    {billingItemColumns.map((col, i) => (
                      <Column
                        key={i}
                        field={col.field}
                        header={col.header}
                        body={col.body}
                        style={{ minWidth: "150px" }}
                      />
                    ))}
                  </DataTable>
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
                <div className="d-flex flex-wrap gap-2">
                  <div className="col-fixed">
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
                  <div className="col-fixed">
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
                  <div className="col-fixed">
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
                  <div className="col-fixed">
                    <div className="form-group">
                      <label className="form-label">Impuestos</label>
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
                  <div className="col-fixed">
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
              <Button
                label="Guardar y Enviar"
                icon="pi pi-send"
                className="btn-info"
                onClick={handleSubmit(saveAndSend)}
              />
            </div>
          </form>
        </div>
      </div>

      <Toast ref={toast} />
    </div>
  );
};

const ProductDropdown = ({ rowData, handleBillingItemChange }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const dataFilter = response.data.map((product) => {
          return {
            ...product.attributes,
            id: product.id,
          };
        });
        if (mounted) {
          setProducts(dataFilter);
          setLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setLoading(false);
          console.error("Error loading products:", error);
        }
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, [rowData.productId]); // Agregamos rowData.productId como dependencia

  useEffect(() => {
    if (rowData.productId) {
      const foundProduct = products.find((p) => p.id === rowData.productId);
      if (foundProduct) {
        setSelectedProduct(foundProduct);
        handleBillingItemChange(rowData.id, "product", foundProduct);
      }
    }
  }, [rowData.productId, products]);

  const handleProductChange = (e) => {
    handleBillingItemChange(rowData.id, "product", e.value);
    if (e.value?.sale_price) {
      handleBillingItemChange(rowData.id, "unitPrice", e.value.sale_price);
    }
  };

  if (loading) {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-spinner pi-spin mr-2"></i>
        Cargando...
      </div>
    );
  }

  return (
    <Dropdown
      value={selectedProduct}
      options={products}
      optionLabel="name"
      placeholder={products.length ? "Seleccione Producto" : "No hay productos"}
      className="w-100"
      disabled={rowData.fromInvoice}
      onChange={handleProductChange}
      filter
      virtualScrollerOptions={{ itemSize: 38 }}
      appendTo="self"
    />
  );
};

const IvaColumnBody = ({ rowData, handleBillingItemChange }) => {
  const { taxes, loading: loadingTaxes } = useTaxes();
  const [currentTax, setCurrentTax] = useState<TaxOption | null>(null);

  useEffect(() => {
    if (!loadingTaxes && taxes.length > 0 && rowData.taxId) {
      const foundTax = taxes.find((t: any) => t.id === rowData.taxId);
      if (foundTax) {
        setCurrentTax(foundTax);
        handleBillingItemChange(rowData.id, "tax", foundTax);
      }
    }
  }, [loadingTaxes, taxes, rowData.taxId]);

  if (loadingTaxes) {
    return (
      <div className="flex align-items-center">
        <i className="pi pi-spinner pi-spin mr-2"></i>
        Cargando...
      </div>
    );
  }

  return (
    <Dropdown
      value={currentTax}
      options={taxes}
      optionLabel={(option) =>
        `${option.name} - ${Math.floor(option.percentage)}%`
      } // Usando percentage
      placeholder="Seleccione IVA"
      className="w-100"
      disabled={rowData.fromInvoice}
      onChange={(e) => {
        setCurrentTax(e.value);
        handleBillingItemChange(rowData.id, "tax", e.value);
        handleBillingItemChange(rowData.id, "taxId", e.value.id);
      }}
      filter
      virtualScrollerOptions={{ itemSize: 38 }}
      appendTo="self"
    />
  );
};
