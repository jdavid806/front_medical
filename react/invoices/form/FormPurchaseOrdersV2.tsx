import React, { useState, useRef, useEffect, use } from "react";
import { useForm, Controller, set } from "react-hook-form";

import { Button } from "primereact/button";
import { Dropdown } from "primereact";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber, InputNumberChangeEvent } from "primereact";

import { classNames } from "primereact/utils";
import { SplitButton } from "primereact/splitbutton";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts";
import { useProductTypes } from "../../product-types/hooks/useProductTypes";
import { useTaxes } from "../hooks/useTaxes";
import { useUsers } from "../../users/hooks/useUsers";
import MedicationFormModal from "../../inventory/medications/MedicationFormModal";
import { MedicationFormInputs } from "../../inventory/medications/MedicationForm";
import SupplyFormModal from "../../inventory/supply/SupplyFormModal";
import { SupplyFormInputs } from "../../inventory/supply/SupplyForm";
import VaccineFormModal from "../../inventory/vaccine/VaccineFormModal";
import { VaccineFormInputs } from "../../inventory/vaccine/VaccineForm";
import { useInvoicePurchase } from "../../billing/purchase_billing/hooks/usePurchaseBilling";
import { useInventory } from "../../billing/purchase_billing/hooks/useInventory";
import {
  TypeOption,
  CostCenterOption,
  PaymentMethod,
  InvoiceProduct,
} from "../../billing/purchase_billing/types/purchaseTypes";
import ExpirationLotForm, {
  ExpirationLotFormInputs,
} from "../../inventory/lote/ExpirationLotForm";
import ExpirationLotModal from "../../inventory/lote/ExpirationLotModal";
import { DropdownChangeEvent } from "primereact/dropdown";
import { invoiceService, purchaseOrdersService } from "../../../services/api";
import { PrimeReactProvider } from "primereact/api";
import { depositService } from "../../../services/api";
import { useAccountingAccountsByCategory } from "../../accounting/hooks/useAccountingAccounts";
import { useThirdPartyModal } from "../../billing/third-parties/hooks/useThirdPartyModal";

export const FormPurchaseOrders: React.FC<any> = ({
  title,
  dataToEdit,
  fieldsConfig,
  onSuccessEdit,
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productForExpiration, setProductForExpiration] = useState<{
    id: string;
    productId: string;
    productName: string;
  } | null>(null);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const toast = useRef<Toast>(null);
  const [productsArray, setProductsArray] = useState<InvoiceProduct[]>([
    {
      id: generateId(),
      typeProduct: null,
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
    },
  ]);
  const purchaseOrderTypes = [
    { label: "Orden de compra", value: "purchase" },
    { label: "Cotizacion", value: "quote_of" },
  ];

  const { thirdParties, fetchThirdParties } = useThirdParties();
  const { users } = useUsers();
  const { centresCosts } = useCentresCosts();
  const { productTypes, loading: loadingProductTypes } = useProductTypes();
  const [isEditMode, setIsEditMode] = useState(false);

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

    // if (field === "product" && value) {
    //     const currentProduct = productsArray.find((p) => p.id === id);
    //     if (
    //         currentProduct?.typeProduct === "medications" ||
    //         currentProduct?.typeProduct === "vaccines"
    //     ) {
    //         const productType = currentProduct.typeProduct;
    //         const selectedProduct = products.find(
    //             (p: any) => p.id === value
    //         );

    //         setProductForExpiration({
    //             id,
    //             productId: value,
    //             productName:
    //                 selectedProduct?.label ||
    //                 (productType === "medications" ? "Medicamento" : "Vacuna"),
    //         });

    //         setIsModalVisible(true);
    //     }
    // }
  };

  const handleSaveExpiration = (data: ExpirationLotFormInputs) => {
    if (productForExpiration) {
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
    if (dataToEdit) {
      handleEditData(dataToEdit);
    }
  }, [dataToEdit && centresCosts]);

  async function handleEditData(dataEdit: any) {

    if (!dataToEdit.orderNumber) {
      setValue("supplier", dataToEdit.third_id);
      setValue("type", dataToEdit.type);

      return;
    }

    try {
      setIsEditMode(true);

      const rowEdit = await purchaseOrdersService.get(dataEdit.orderNumber);
      setValue("supplier", rowEdit.data.third_id);
      setValue("type", rowEdit.data.type);
      setValue("elaborationDate", new Date(rowEdit.data.created_at));
      setValue("expirationDate", new Date(rowEdit.data.due_date));

      const selectedCostCenter = centresCosts.find(
        (cc) => cc.id == rowEdit.data.cost_center_id
      );
      setValue("costCenter", selectedCostCenter);
      setValue("buyer", Number(rowEdit.data.buyer_id));

      const formattedProducts = rowEdit.data.details.map((detail: any) => {
        // Determinar el tipo de producto basado en product_type_id o alguna otra propiedad
        let typeProduct = "";
        if (detail.product?.product_type) {
          // Mapear el tipo de producto según lo que espera tu formulario
          switch (detail.product.product_type.name.toLowerCase()) {
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
        } else {
          typeProduct = "assets";
        }
        // Calcular el descuento porcentual si existe
        const discount = detail.discount
          ? (Number(detail.discount) /
            (Number(detail.price) * Number(detail.quantity))) *
          100
          : 0;

        const subtotal = Number(detail.subtotal) - Number(detail.discount);

        const percentageTax =
          (Number(detail.total_taxes) / Number(subtotal)) * 100;

        const accountingAccount = detail.accounting_account_assignments.length
          ? detail.accounting_account_assignments[0]
          : null;
        const deposit = detail.deposit_assignments.length
          ? detail.deposit_assignments[0].deposit
          : null;

        return {
          id: generateId(),
          typeProduct: typeProduct,
          product: detail.product_id
            ? detail.product_id
            : accountingAccount.accounting_account_id,
          description: detail.product?.name || "",
          quantity: Number(detail.quantity),
          price: Number(detail.price),
          discount: discount,
          tax: percentageTax || 0,
          productData: detail.product,
          depositId: deposit?.id || null,
        };
      });
      setProductsArray(formattedProducts);
    } catch (error) {
      console.error("Error al cargar datos para edición:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar la orden para edición",
        life: 5000,
      });
    }
  }

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = (item: InvoiceProduct): number => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate =
      typeof item.tax === "object" ? item.tax?.id : Number(item.tax) || 0;

    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * ((taxRate ?? 0) / 100);

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
    return productsArray.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.price) || 0);
      const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxRate =
        typeof item.tax === "object" ? item.tax?.id : Number(item.tax) || 0;
      return total + subtotalAfterDiscount * ((taxRate ?? 0) / 100);
    }, 0);
  };

  const calculateSubtotalAfterDiscount = (): number => {
    return calculateSubtotal() - calculateTotalDiscount();
  };

  const calculateTotalNet = (): number => {
    return calculateSubtotalAfterDiscount() + calculateTotalTax();
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
        tax: 0,
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

  const handleSubmitMedication = (data: MedicationFormInputs) => { };

  const handleSubmitSupply = (data: SupplyFormInputs) => { };

  const handleSubmitVaccine = (data: VaccineFormInputs) => { };

  // Función para construir el objeto de datos a enviar al backend
  const buildInvoiceData = (formData: any) => {
    return {
      third_id: formData?.supplier || null,
      status: "pending",
      type: formData.type,
      due_date: formData.expirationDate,
      created_at: formData.elaborationDate,
      cost_center_id: formData?.costCenter?.id || null,
      buyer_id: formData?.buyer?.toString() || null,
      details: productsArray.map((product: any) => {
        const subtotal = product.price * product.quantity;
        const discountAmount = subtotal * (product.discount / 100);
        const tax =
          (subtotal - discountAmount) * (Math.floor(product.tax) / 100);

        return {
          product_id: product.typeProduct !== "assets" ? product.product : null,
          price: product.price,
          quantity: product.quantity,
          discount: Number(discountAmount.toFixed(2)),
          tax: Number(tax.toFixed(2)),
          deposit_id: product.depositId || null,
          accounting_account_id:
            product.typeProduct == "assets" ? Number(product.product) : null,
        };
      }),
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

    const invoiceData = buildInvoiceData(formData);
    purchaseOrdersService.create(invoiceData).then((response) => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura de compra validada correctamente",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  // ✅ Función para guardar y enviar (envía al backend usando tu hook)
  const saveAndSend = (formData: any) => {
    const invoiceData = buildInvoiceData(formData);
    purchaseOrdersService.create(invoiceData).then((response) => {
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura de compra validada correctamente",
        life: 3000,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    });
  };

  function editAndSend(formData: any) {
    const invoiceData = buildInvoiceData(formData);
    purchaseOrdersService
      .update(dataToEdit.orderNumber, invoiceData)
      .then((response) => {
        onSuccessEdit();
      });
  }

  function edit(formData: any) {
    const invoiceData = buildInvoiceData(formData);
    purchaseOrdersService
      .update(dataToEdit.orderNumber, invoiceData)
      .then((response) => {
        onSuccessEdit();
      });
  }

  // Columnas para la tabla de productos
  const getProductColumns = () => {
    return [
      {
        field: "type",
        header: "Tipo",
        body: (rowData: InvoiceProduct) => (
          <TypeColumnBody
            onChange={(newType: string) => {
              handleProductChange(rowData.id, "typeProduct", newType);
              handleProductChange(rowData.id, "product", null);
            }}
            value={rowData.typeProduct}
          />
        ),
      },
      {
        field: "product",
        header: "Producto",
        body: (rowData: InvoiceProduct) => {
          return (
            <ProductColumnBody
              type={rowData.typeProduct}
              onChange={(value: string) => {
                handleProductChange(rowData.id, "product", value);
              }}
              value={rowData.product}
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
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "iva",
        header: "Impuesto %",
        body: (rowData: InvoiceProduct) => (
          <IvaColumnBody
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "tax", value)
            }
            value={rowData.tax}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "deposit",
        header: "Deposito",
        body: (rowData: InvoiceProduct) => (
          <DepositColumnBody
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "depositId", value)
            }
            value={rowData.depositId}
            type={rowData.typeProduct}
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

      {/* Main Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="h3 mb-0 text-primary">
                    <i className="pi pi-file-invoice me-2"></i>
                    {title || "Crear Orden de Compra"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isEditMode) {
                handleSubmit(edit)();
              } else {
                handleSubmit(save)();
              }
            }}
          >
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
                      <label className="form-label">Tipo *</label>
                      <Controller
                        name="type"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={purchaseOrderTypes}
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Seleccione un tipo"
                            className={classNames("w-100")}
                            appendTo="self"
                            disabled={fieldsConfig?.type?.disabled || false}
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
                          <div className="d-flex">

                            <Dropdown
                              {...field}
                              filter
                              options={thirdParties}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Seleccione proveedor"
                              className={classNames("w-100")}
                              appendTo="self"
                              disabled={fieldsConfig?.supplier?.disabled || false}
                            />
                            <Button
                              type="button"
                              onClick={openThirdPartyModal}
                              icon={<i className="fa-solid fa-plus"></i>}
                              className="p-button-primary" />
                          </div>
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
                            appendTo="self"
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
                            appendTo="self"
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
                <div className="">
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
                    (() => {
                      const productColumns = getProductColumns();

                      return (
                        <>
                          <DataTable
                            key={`products-table-${productTypes.length}`}
                            value={productsArray}
                            emptyMessage="No hay productos agregados"
                            tableStyle={{ height: "auto" }}
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
                    })()
                  )}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body p-0">
                <div className="row justify-content-center">
                  <div className="col-lg-8">
                    <div className="p-4">
                      <div className="text-center mb-3">
                        <h3 className="h6 mb-4 font-weight-bold fs-5 text-info">
                          Detalle de Montos
                        </h3>
                      </div>
                      <div className="table-responsive d-flex justify-content-center">
                        <table
                          className="table table-borderless mb-0"
                          style={{ maxWidth: "500px" }}
                        >
                          <tbody>
                            <tr>
                              <td className="text-end font-weight-bold pe-3">
                                Subtotal:
                              </td>
                              <td className="text-end" width="150px">
                                <InputNumber
                                  value={calculateSubtotal()}
                                  className="w-100 text-end border-0 bg-light"
                                  mode="currency"
                                  currency="DOP"
                                  locale="es-DO"
                                  readOnly
                                  inputClassName="text-end font-weight-bold"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-end font-weight-bold pe-3">
                                Descuentos:
                              </td>
                              <td className="text-end">
                                <InputNumber
                                  value={calculateTotalDiscount()}
                                  className="w-100 text-end border-0 bg-light"
                                  mode="currency"
                                  currency="DOP"
                                  locale="es-DO"
                                  readOnly
                                  inputClassName="text-danger text-end"
                                />
                              </td>
                            </tr>
                            <tr className="border-top">
                              <td className="text-end font-weight-bold pe-3">
                                Subtotal después de descuento:
                              </td>
                              <td className="text-end">
                                <InputNumber
                                  value={calculateSubtotalAfterDiscount()}
                                  className="w-100 text-end border-0 bg-light"
                                  mode="currency"
                                  currency="DOP"
                                  locale="es-DO"
                                  readOnly
                                  inputClassName="text-end font-weight-bold"
                                />
                              </td>
                            </tr>
                            <tr>
                              <td className="text-end font-weight-bold pe-3">
                                Impuestos (
                                {calculateTotalTax() > 0
                                  ? (
                                    (calculateTotalTax() /
                                      calculateSubtotalAfterDiscount()) *
                                    100
                                  ).toFixed(2) + "%"
                                  : "0%"}
                                ):
                              </td>
                              <td className="text-end">
                                <InputNumber
                                  value={calculateTotalTax()}
                                  className="w-100 text-end border-0 bg-light"
                                  mode="currency"
                                  currency="DOP"
                                  locale="es-DO"
                                  readOnly
                                  inputClassName="text-end"
                                />
                              </td>
                            </tr>
                            <tr className="border-top border-bottom">
                              <td className="text-end font-weight-bold pe-3">
                                Total Neto:
                              </td>
                              <td className="text-end">
                                <InputNumber
                                  value={calculateTotalNet()}
                                  className="w-100 text-end border-0 bg-light"
                                  mode="currency"
                                  currency="DOP"
                                  locale="es-DO"
                                  readOnly
                                  inputClassName="text-success text-end font-weight-bold fs-6"
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
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
                onClick={(e) => {
                  e.preventDefault();
                  if (isEditMode) {
                    handleSubmit(editAndSend)();
                  } else {
                    handleSubmit(saveAndSend)();
                  }
                }}
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
                  .p-dropdown-panel {
          z-index: 1100 !important;
      
        }

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

const TypeColumnBody = ({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value?: string | null;
}) => {
  const { productTypes, loading } = useProductTypes();
  const [productTypesMapped, setProductTypesMapped] = useState<any[]>([]);

  useEffect(() => {
    const mapped = productTypes.map((type: any) => {
      type.value = "";
      type.value = switchType(type.attributes.name.toLowerCase());

      return {
        ...type,
      };
    });
    setProductTypesMapped(mapped);
  }, [productTypes]);

  function switchType(type: string) {
    switch (type) {
      case "medicamentos":
        return "medications";
      case "vacunas":
        return "vaccines";
      case "insumos":
        return "supplies";
      case "servicios":
        return "services";
      default:
        return "assets";
    }
  }

  return (
    <Dropdown
      value={value}
      options={productTypesMapped}
      optionLabel="attributes.name"
      optionValue="value"
      placeholder="Seleccione Tipo"
      className="w-100"
      onChange={(e: DropdownChangeEvent) => {
        onChange(e.value);
      }}
      appendTo={document.body}
    />
  );
};

const ProductColumnBody = ({
  type,
  onChange,
  value,
}: {
  type: string | null;
  onChange: (value: string) => void;
  value?: string | null;
}) => {
  const { getByType, products } = useInventory();
  const { accounts } = useAccountingAccountsByCategory("sub_account", "15");
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    let formattedOptions: { id: number; label: string; name: string }[] = [];
    if (!type) return;
    getByType(type);
    if (type == "assets") {
      formattedOptions =
        accounts?.map((acc) => ({
          id: acc.id,
          label: String(acc.account_name),
          name: String(acc.account_name),
        })) || [];
    }
    setOptions(formattedOptions);
  }, [type && accounts]);
  return (
    <>
      <Dropdown
        value={value}
        options={type == "assets" ? options : products}
        optionLabel="label"
        optionValue="id"
        placeholder="Seleccione Producto"
        className="w-100"
        filter
        onChange={(e: DropdownChangeEvent) => {
          onChange(e.value);
        }}
        virtualScrollerOptions={{
          itemSize: 38,
        }}
        emptyMessage={"No hay productos disponibles"}
        panelStyle={{
          position: "fixed",
          zIndex: 1100,
        }}
        appendTo={document.body}
      />
    </>
  );
};

const QuantityColumnBody = ({
  onChange,
  value,
}: {
  onChange: (value: number | null) => void;
  value?: number | null;
}) => {
  return (
    <>
      <InputNumber
        value={value}
        placeholder="Cantidad"
        className="w-100"
        style={{ maxWidth: "100px" }}
        min={0}
        onValueChange={(e: InputNumberChangeEvent) => {
          onChange(e.value);
        }}
      />
    </>
  );
};

const PriceColumnBody = ({
  onChange,
  value,
}: {
  onChange: (value: number | null) => void;
  value?: number | null;
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
      onValueChange={(e: InputNumberChangeEvent) => {
        onChange(e.value);
      }}
    />
  );
};

const DiscountColumnBody = ({
  onChange,
  value,
}: {
  onChange: (value: number | null) => void;
  value?: number | null;
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
        onValueChange={(e: InputNumberChangeEvent) => {
          onChange(e.value);
        }}
      />
    </>
  );
};

const IvaColumnBody = ({
  onChange,
  value,
}: {
  onChange: (value: string | null) => void;
  value?: any | null;
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
    />
  );
};

const DepositColumnBody = ({
  onChange,
  value,
  type,
}: {
  onChange: (value: string | null) => void;
  value?: any | null;
  type?: string | null;
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
      disabled={type == "assets" ? true : false}
      appendTo={document.body}
    />
  );
};
