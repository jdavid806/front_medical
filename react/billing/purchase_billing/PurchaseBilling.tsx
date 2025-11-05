import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useForm, Controller, useWatch, Control } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DropdownChangeEvent } from "primereact/dropdown";
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
import SupplyFormModal from "../../inventory/supply/SupplyFormModal";
import VaccineFormModal from "../../inventory/vaccine/VaccineFormModal";
import { useInvoicePurchase } from "./hooks/usePurchaseBilling";
import { useInventory } from "./hooks/useInventory";
import {
  brandService,
  invoiceService,
  accountingAccountsService,
} from "../../../services/api";
import { purchaseOrdersService } from "../../../services/api";
import { BrandFormModal } from "../../inventory/brands/modal/BrandFormModal";

import { useAccountingAccountsByCategory } from "../../accounting/hooks/useAccountingAccounts";
import {
  TypeOption,
  CostCenterOption,
  PaymentMethod,
  InvoiceProduct,
  LotInfo,
} from "./types/purchaseTypes";
import ExpirationLotForm, {
  ExpirationLotFormInputs,
} from "../../inventory/lote/ExpirationLotForm";
import ExpirationLotModal from "../../inventory/lote/ExpirationLotModal";
import {
  RetentionItem,
  RetentionsSection,
} from "./retention/RetentionsSection";
import { CustomTaxes, TaxItem } from "../../components/billing/CustomTaxes";
import { Deposit, PurchaseBillingProps } from "./types/MappedPurchase";
import FixedAssetsModal from "../../accounting/fixedAssets/modal/FixedAssetsModal";
import { FixedAssetsFormInputs } from "../../accounting/fixedAssets/interfaces/FixedAssetsFormTypes";
import FixedAssetsForm from "../../accounting/fixedAssets/form/FixedAssetsForm";
import { AdvancePayment } from "../sales_billing/modal/ModalAdvanceHistory";
import AdvanceHistoryForm from "../sales_billing/modal/FormAdvanceHistory";
import { useAssetCategories } from "../../accounting/fixedAssets/hooks/useAssetCategories";
import { useTaxes } from "../../invoices/hooks/useTaxes";
import { Dialog } from "primereact/dialog";
import { FormAdvanceCopy } from "../sales_billing/modal/FormAdvanceCopy";
import { useAdvancePayments } from "../hooks/useAdvancePayments";
import { useBillingByType } from "../hooks/useBillingByType";
import { InventariableFormModal } from "../../inventory/inventariable/InventariableFormModal";
import { SwalManager } from "../../../services/alertManagerImported";
import { useThirdPartyModal } from "../third-parties/hooks/useThirdPartyModal";

// Componentes memoizados para las columnas
const TypeColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
  }) => {
    const options = [
      { id: "supplies", name: "Insumos" },
      { id: "medications", name: "Medicamentos" },
      { id: "vaccines", name: "Vacunas" },
      { id: "spent", name: "Gastos y servicios" },
      { id: "assets", name: "Activos fijos" },
      { id: "inventariables", name: "Inventariables" },
    ];

    return (
      <Controller
        name={`products.${productIndex}.typeProduct`}
        control={control}
        render={({ field }) => (
          <Dropdown
            {...field}
            options={options}
            optionLabel="name"
            optionValue="id"
            filter
            placeholder="Seleccione Tipo"
            className="w-100"
            onChange={(e: DropdownChangeEvent) => {
              field.onChange(e.value);
            }}
            disabled={disabled}
          />
        )}
      />
    );
  }
);

const ProductColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
    setValue, // ← Agregar esta prop
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
    setValue: any; // ← Agregar esta prop
  }) => {
    const typeProduct = useWatch({
      control,
      name: `products.${productIndex}.typeProduct`,
    });

    const [subAccounts, setSubAccounts] = useState<any>("");
    const { getByType, products, currentType } = useInventory();
    const { accounts: spentAccounts } = useAccountingAccountsByCategory(
      "sub_account",
      subAccounts
    );
    const { accounts: propertyAccounts } = useAccountingAccountsByCategory(
      "sub_account",
      "1"
    );

    const { accounts: accountingAccountByCategory } =
      useAccountingAccountsByCategory("category", typeProduct);

    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Cargar productos cuando cambia el tipo
    useEffect(() => {
      if (
        typeProduct &&
        ["supplies", "medications", "vaccines", "inventariables"].includes(
          typeProduct
        )
      ) {
        setLoading(true);
        getByType(typeProduct).finally(() => setLoading(false));
      }
    }, [typeProduct, getByType]);

    // Formatear opciones basadas en el tipo
    useEffect(() => {
      if (!typeProduct) {
        setOptions([]);
        return;
      }

      let formattedOptions: {
        id: number;
        label: string;
        name: string;
        accountingAccount?: any;
      }[] = [];

      if (typeProduct === "spent") {
        fetchAccountingAccounts();
        formattedOptions =
          spentAccounts?.map((acc) => ({
            id: acc.id,
            label: String(acc.account_name),
            name: String(acc.account_name),
            accountingAccount: acc,
          })) || [];
      } else if (typeProduct === "assets") {
        formattedOptions =
          propertyAccounts?.map((acc) => ({
            id: acc.id,
            label: String(acc.account_name),
            name: String(acc.account_name),
            accountingAccount: acc,
          })) || [];
      } else {
        formattedOptions =
          products?.map((p) => ({
            id: p.id,
            label: String(p.name || p.label || p.account_name),
            name: String(p.name || p.label || p.account_name),
            accountingAccount:
              p.accounting_account || accountingAccountByCategory?.[0],
          })) || [];
      }

      setOptions(formattedOptions);
    }, [
      typeProduct,
      products,
      spentAccounts,
      propertyAccounts,
      accountingAccountByCategory,
    ]);

    async function fetchAccountingAccounts() {
      try {
        const data: any =
          await accountingAccountsService.getAccountingAccountWithColumneUnique(
            "sub_account"
          );

        const dataMapped = data
          .map((item: any) => item.sub_account)
          .filter((subAccount: string, index: number, array: string[]) => {
            const num = parseInt(subAccount);
            return (
              array.indexOf(subAccount) === index && !isNaN(num) && num >= 5
            );
          })
          .sort((a: string, b: string) => parseInt(a) - parseInt(b));

        setSubAccounts(dataMapped.join(","));
      } catch (error) {
        console.error("Error fetching accounting accounts:", error);
      }
    }

    return (
      <Controller
        name={`products.${productIndex}.product`}
        control={control}
        render={({ field }) => (
          <Dropdown
            value={field.value}
            options={options}
            optionLabel="label"
            optionValue="id"
            placeholder="Seleccione Producto"
            className="w-100"
            onChange={(e: DropdownChangeEvent) => {
              const selectedOption = options.find((opt) => opt.id === e.value);

              // Actualizar el producto ID
              field.onChange(e.value);

              // Actualizar la cuenta contable y descripción
              if (selectedOption) {
                // Actualizar accountingAccount
                setValue(
                  `products.${productIndex}.accountingAccount`,
                  selectedOption.accountingAccount
                );

                // Actualizar descripción
                if (selectedOption.label) {
                  setValue(
                    `products.${productIndex}.description`,
                    selectedOption.label
                  );
                }
              }
            }}
            loading={loading}
            emptyMessage="No hay productos disponibles"
            filter
            disabled={disabled || !typeProduct}
          />
        )}
      />
    );
  }
);

const QuantityColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
  }) => {
    const typeProduct = useWatch({
      control,
      name: `products.${productIndex}.typeProduct`,
    });

    const lotInfo = useWatch({
      control,
      name: `products.${productIndex}.lotInfo`,
    });

    const isLotProduct = ["medications", "vaccines"].includes(typeProduct);

    // Calcular cantidad para productos con lotes
    const calculatedQuantity = isLotProduct
      ? (lotInfo || []).reduce(
          (sum: number, lot: any) => sum + (Number(lot.quantity) || 0),
          0
        )
      : 0;

    // Para productos sin lotes, usar el valor del campo directamente
    const displayValue = isLotProduct ? calculatedQuantity : undefined;

    return (
      <Controller
        name={`products.${productIndex}.quantity`}
        control={control}
        render={({ field }) => (
          <InputNumber
            value={isLotProduct ? calculatedQuantity : field.value || 0}
            placeholder="Cantidad"
            className="w-100"
            min={0}
            readOnly={isLotProduct}
            onValueChange={
              isLotProduct
                ? undefined
                : (e: any) => {
                    // Asegurarse de que solo pasamos el valor numérico
                    const newValue =
                      e.value !== null && e.value !== undefined
                        ? Number(e.value)
                        : 0;
                    field.onChange(newValue);
                  }
            }
            disabled={disabled}
          />
        )}
      />
    );
  }
);

const PriceColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
  }) => {
    return (
      <Controller
        name={`products.${productIndex}.price`}
        control={control}
        render={({ field }) => (
          <InputNumber
            value={field.value || 0} // ← Asegurar que nunca sea null/undefined
            placeholder="Precio"
            className="w-100"
            mode="currency"
            currency="DOP"
            style={{ maxWidth: "300px" }}
            locale="es-DO"
            min={0}
            onValueChange={(e: any) => field.onChange(e.value)}
            disabled={disabled}
          />
        )}
      />
    );
  }
);

const DiscountColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
  }) => {
    const discountType = useWatch({
      control,
      name: `products.${productIndex}.discountType`,
    });

    return (
      <div className="d-flex align-items-center gap-1">
        <Controller
          name={`products.${productIndex}.discountType`}
          control={control}
          render={({ field }) => (
            <Dropdown
              {...field}
              value={field.value || "percentage"}
              options={[
                { label: "%", value: "percentage" },
                { label: "$", value: "fixed" },
              ]}
              optionLabel="label"
              optionValue="value"
              onChange={(e) => field.onChange(e.value)}
              className="discount-type-selector"
              style={{ width: "60px", minWidth: "60px" }}
              size="small"
              disabled={disabled}
            />
          )}
        />

        <Controller
          name={`products.${productIndex}.discount`}
          control={control}
          render={({ field }) => (
            <InputNumber
              value={field.value || 0} // ← Asegurar valor por defecto
              placeholder={discountType === "percentage" ? "0" : "0.00"}
              className="flex-grow-1"
              suffix={discountType === "percentage" ? "%" : ""}
              mode={discountType === "fixed" ? "currency" : "decimal"}
              currency={discountType === "fixed" ? "DOP" : undefined}
              locale="es-DO"
              min={0}
              max={discountType === "percentage" ? 100 : undefined}
              onValueChange={(e: any) => field.onChange(e.value)}
              disabled={disabled}
              style={{ minWidth: "85px" }}
            />
          )}
        />
      </div>
    );
  }
);

const IvaColumnBody = React.memo(
  ({
    control,
    productIndex,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    disabled?: boolean;
  }) => {
    const { taxes, loading: loadingTaxes } = useTaxes();

    return (
      <Controller
        name={`products.${productIndex}.tax`}
        control={control}
        render={({ field }) => {
          // Función para encontrar el impuesto seleccionado
          const findSelectedTax = () => {
            if (!field.value) return null;

            // Si field.value es un objeto (ya tiene el impuesto completo)
            if (typeof field.value === "object" && field.value !== null) {
              return field.value;
            }

            // Si field.value es solo el porcentaje, buscar el impuesto correspondiente
            if (typeof field.value === "number") {
              return taxes.find((tax: any) => tax.percentage === field.value);
            }

            return null;
          };

          const selectedTax = findSelectedTax();

          return (
            <Dropdown
              value={selectedTax}
              options={taxes}
              optionLabel={(option: any) =>
                `${option.name} - ${Math.floor(option.percentage)}%`
              }
              placeholder="Seleccione IVA"
              className="w-100"
              onChange={(e: DropdownChangeEvent) => {
                // Guardar el objeto completo del impuesto
                field.onChange(e.value);
              }}
              onClear={() => {
                field.onChange(0); // O null, dependiendo de lo que prefieras
              }}
              appendTo={document.body}
              disabled={disabled || loadingTaxes}
              showClear
              loading={loadingTaxes}
            />
          );
        }}
      />
    );
  }
);

const DepositColumnBody = React.memo(
  ({
    control,
    productIndex,
    deposits,
    disabled,
  }: {
    control: Control<any>;
    productIndex: number;
    deposits: any[];
    disabled?: boolean;
  }) => {
    return (
      <Controller
        name={`products.${productIndex}.depositId`}
        control={control}
        render={({ field }) => (
          <Dropdown
            value={field.value}
            options={deposits}
            optionLabel="name"
            optionValue="id"
            placeholder="Seleccione depósito"
            className="w-100"
            onChange={(e: DropdownChangeEvent) => {
              field.onChange(e.value);
            }}
            appendTo={document.body}
            disabled={disabled}
            showClear
          />
        )}
      />
    );
  }
);

const ProductAccordion = React.memo(
  ({
    control,
    productIndex,
    onRemove,
    deposits,
    onSaveFixedAsset,
    onEditLot,
    onRemoveLot,
    onSaveEditedLot,
    editingLot,
    setValue,
  }: {
    control: Control<any>;
    productIndex: number;
    onRemove: () => void;
    deposits: any[];
    onSaveFixedAsset: (
      productIndex: number,
      data: FixedAssetsFormInputs
    ) => void;
    onEditLot: (productIndex: number, lotIndex: number) => void;
    onRemoveLot: (productIndex: number, lotIndex: number) => void;
    onSaveEditedLot: (
      productIndex: number,
      data: ExpirationLotFormInputs
    ) => void;
    editingLot: { productIndex: number; lotIndex: number; lotData: any } | null;
    setValue: any;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const product = useWatch({
      control,
      name: `products.${productIndex}`,
    });

    const [showFixedAssetForm, setShowFixedAssetForm] = useState(false);
    const [localFixedAssetData, setLocalFixedAssetData] =
      useState<FixedAssetsFormInputs>(
        product?.fixedAssetInfo || {
          assetType: "physical",
          assetName: "",
          asset_category_id: "",
          brand: "",
          model: "",
          serial_number: "",
          internal_code: "",
          description: "",
          user_id: "",
        }
      );

    const handleSaveFixedAssetLocal = useCallback(
      (data: FixedAssetsFormInputs) => {
        setLocalFixedAssetData(data);
        onSaveFixedAsset(productIndex, data);
      },
      [productIndex, onSaveFixedAsset]
    );

    const handleLotSubmit = (data: ExpirationLotFormInputs) => {
      if (editingLot && editingLot.productIndex === productIndex) {
        onSaveEditedLot(productIndex, data);
      } else {
        const currentLotInfo = product?.lotInfo || [];
        const updatedLotInfo = [
          ...currentLotInfo,
          {
            lotNumber: data.lotNumber,
            expirationDate: data.expirationDate,
            deposit: data.deposit,
            quantity: data.quantity || 0,
          },
        ];

        setValue(`products.${productIndex}.lotInfo`, updatedLotInfo);
      }
    };

    const toggleAccordion = () => {
      setValue(`products.${productIndex}.isExpanded`, !product?.isExpanded);
    };

    const shouldShowFixedAssetForm =
      product?.typeProduct === "assets" && product?.isExpanded;
    const shouldShowLotForm =
      (product?.typeProduct === "medications" ||
        product?.typeProduct === "vaccines") &&
      product?.isExpanded;

    // Determinar si mostrar la columna de depósito
    const shouldShowDepositColumn = !["medications", "vaccines"].includes(
      product?.typeProduct
    );

    // Calcular el valor total para este producto
    const calculateLineTotalForProduct = (productData: any): number => {
      const actualQuantity = ["medications", "vaccines"].includes(
        productData.typeProduct
      )
        ? (productData.lotInfo || []).reduce(
            (sum: number, lot: any) => sum + (lot.quantity || 0),
            0
          )
        : Number(productData.quantity) || 0;

      const price = Number(productData.price) || 0;
      const discount = Number(productData.discount) || 0;

      // Manejar tanto objeto como número para el impuesto
      let taxRate = 0;
      if (productData.tax) {
        if (typeof productData.tax === "object" && productData.tax !== null) {
          taxRate = Number(productData.tax.percentage) || 0;
        } else {
          taxRate = Number(productData.tax) || 0;
        }
      }

      const subtotal = actualQuantity * price;

      let discountAmount = 0;
      if (productData.discountType === "percentage") {
        discountAmount = subtotal * (discount / 100);
      } else {
        discountAmount = discount;
      }

      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxAmount = (subtotal - discountAmount) * (taxRate / 100) || 0;

      const total = subtotalAfterDiscount + taxAmount;
      const roundedTotal = parseFloat(total.toFixed(2));

      return roundedTotal;
    };

    if (!product) return null;

    return (
      <div
        ref={containerRef}
        className="card mb-3"
        style={{
          overflowAnchor: "none",
          overflow: "hidden",
        }}
      >
        <div
          className="card-header d-flex justify-content-between align-items-center"
          style={{
            cursor: "pointer",
            overflowY: "auto",
            overflowAnchor: "none",
          }}
          onClick={toggleAccordion}
        >
          <div className="d-flex align-items-center">
            <i
              className={`fas fa-${product.isExpanded ? "minus" : "plus"} me-2`}
            ></i>
            <span className="fw-bold">
              {product.description || "Nuevo Producto Asignado"}
            </span>
          </div>
          <div>
            <span className="badge bg-primary me-2">
              Cantidad: {product.quantity}
            </span>
            <span className="badge bg-success">
              Total: {(product.quantity * product.price).toFixed(2)} DOP
            </span>
          </div>
        </div>

        {product.isExpanded && (
          <div className="card-body">
            <DataTable
              value={[product]}
              responsiveLayout="scroll"
              className="p-datatable-sm p-datatable-gridlines mb-4"
              showGridlines
              stripedRows
            >
              <Column
                field="type"
                header="Tipo"
                body={() => (
                  <TypeColumnBody
                    control={control}
                    productIndex={productIndex}
                  />
                )}
              />
              <Column
                field="product"
                header="Producto"
                body={() => (
                  <ProductColumnBody
                    control={control}
                    productIndex={productIndex}
                    setValue={setValue}
                  />
                )}
              />
              <Column
                field="quantity"
                header="Cantidad"
                body={() => (
                  <QuantityColumnBody
                    control={control}
                    productIndex={productIndex}
                  />
                )}
                style={{ minWidth: "90px" }}
              />
              <Column
                field="price"
                header="Valor unitario"
                body={() => (
                  <PriceColumnBody
                    control={control}
                    productIndex={productIndex}
                  />
                )}
                style={{ maxWidth: "150px" }}
              />
              <Column
                field="discount"
                header="Descuento"
                body={() => (
                  <DiscountColumnBody
                    control={control}
                    productIndex={productIndex}
                  />
                )}
                style={{ minWidth: "150px" }}
              />
              <Column
                field="tax"
                header="Impuestos"
                body={() => (
                  <IvaColumnBody
                    control={control}
                    productIndex={productIndex}
                  />
                )}
                style={{ minWidth: "150px" }}
              />
              {/* Mostrar columna de depósito solo para productos que no son medicamentos o vacunas */}
              {shouldShowDepositColumn && (
                <Column
                  field="depositId"
                  header="Deposito"
                  body={() => (
                    <DepositColumnBody
                      control={control}
                      productIndex={productIndex}
                      deposits={deposits}
                    />
                  )}
                  style={{ minWidth: "150px" }}
                />
              )}
              {/* Columna de Valor Total */}
              <Column
                field="totalvalue"
                header="Valor total"
                body={() => {
                  const total = calculateLineTotalForProduct(product);
                  return (
                    <InputNumber
                      value={total}
                      mode="currency"
                      style={{ maxWidth: "300px" }}
                      className="w-100"
                      currency="DOP"
                      locale="es-DO"
                      readOnly
                    />
                  );
                }}
                style={{ minWidth: "300px" }}
              />
              <Column
                field="actions"
                header="Acciones"
                body={() => (
                  <Button
                    className="p-button-rounded p-button-danger p-button-text"
                    onClick={onRemove}
                    tooltip="Eliminar Producto"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                )}
                style={{ width: "120px", textAlign: "center" }}
              />
            </DataTable>

            {shouldShowLotForm && (
              <div className="mt-4">
                <h5 className="mb-3">
                  <i className="pi pi-box me-2"></i>
                  Gestión de Lotes
                </h5>

                {product.lotInfo && product.lotInfo.length > 0 && (
                  <div className="mb-3">
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>Lote</th>
                            <th>Fecha Caducidad</th>
                            <th>Depósito</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.lotInfo.map((lot: any, index: number) => (
                            <tr key={`lot-${index}`}>
                              <td>{lot.lotNumber}</td>
                              <td>
                                {lot.expirationDate?.toLocaleDateString() ||
                                  "N/A"}
                              </td>
                              <td>
                                {
                                  deposits.find((d) => d.id === lot.deposit)
                                    ?.name
                                }
                              </td>
                              <td>{lot.quantity}</td>
                              <td>
                                <div className="d-flex gap-1">
                                  <Button
                                    icon={
                                      <i className="fa-solid fa-pencil"></i>
                                    }
                                    className="p-button-info p-button-text"
                                    onClick={() =>
                                      onEditLot(productIndex, index)
                                    }
                                    tooltip="Editar lote"
                                  />
                                  <Button
                                    icon={<i className="fa-solid fa-trash"></i>}
                                    className="p-button-danger p-button-text"
                                    onClick={() =>
                                      onRemoveLot(productIndex, index)
                                    }
                                    tooltip="Eliminar lote"
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div
                  style={{ overflowAnchor: "none", contain: "paint" }}
                  className="lot-form-container p-4 border rounded bg-light"
                >
                  <ExpirationLotForm
                    formId={`lot-form-${productIndex}`}
                    initialData={
                      product.lotFormData || {
                        lotNumber: "",
                        expirationDate: null,
                        deposit: "",
                        quantity: 0,
                      }
                    }
                    deposits={deposits}
                    productName={product.description}
                    onSubmit={handleLotSubmit}
                    onCancel={() => {
                      toggleAccordion();
                    }}
                    isEditing={
                      !!editingLot && editingLot.productIndex === productIndex
                    }
                  />
                </div>
              </div>
            )}

            {shouldShowFixedAssetForm && (
              <div className="card-body mt-4">
                <h5 className="mb-3">
                  <i className="pi pi-box me-2"></i>
                  Información de Activo Fijo
                </h5>
                <FixedAssetsForm
                  formId={`fixed-asset-form-${productIndex}`}
                  onSubmit={handleSaveFixedAssetLocal}
                  onCancel={() => {}}
                  initialData={localFixedAssetData}
                  key={`fixed-asset-form-${productIndex}`}
                />
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

export const PurchaseBilling: React.FC<PurchaseBillingProps> = ({
  purchaseOrder,
  onClose = () => {},
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productForExpiration, setProductForExpiration] = useState<{
    id: string;
    productId: string;
    productName: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceNumber: "",
      documentType: "",
      fiscalVoucher: "",
      elaborationDate: null,
      expirationDate: null,
      supplier: null,
      costCenter: null,
      buyer: null,
      products: [
        {
          id: generateId(),
          typeProduct: null,
          product: null,
          description: "",
          quantity: 0,
          price: 0,
          discount: 0,
          discountType: "percentage",
          tax: 0,
          lotInfo: [],
          lotFormData: {
            lotNumber: "",
            expirationDate: null,
            deposit: "",
            quantity: 0,
          },
          isExpanded: false,
          showLotForm: false,
          fixedAssetInfo: null,
          depositId: null,
          accountingAccount: null,
        },
      ],
    },
  });

  const toast = useRef<Toast>(null);
  const productsArray = watch("products") || [];

  const [taxes, setTaxes] = useState<TaxItem[]>([]);
  const {
    taxes: availableTaxes,
    loading: loadingTaxes,
    fetchTaxes,
  } = useTaxes();

  const [retentions, setRetentions] = useState<RetentionItem[]>([
    {
      id: generateId(),
      percentage: 0,
      value: 0,
    },
  ]);
  const {
    fetchAdvancePayments,
    loading: loadingAdvance,
    advances,
  } = useAdvancePayments();
  const [selectedProductForLot, setSelectedProductForLot] = useState<{
    id: string;
    productId: string;
    productName: string;
    type: string;
  } | null>(null);
  const [lotFormData, setLotFormData] = useState<{
    lotNumber: string;
    expirationDate: Date | null;
    deposit: string;
  }>({
    lotNumber: "",
    expirationDate: null,
    deposit: "",
  });
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [formattedDeposits, setFormattedDeposits] = useState<
    {
      id: string;
      name: string;
      originalData: any;
    }[]
  >([]);
  const [options, setOptions] = useState<
    { id: string; label: string; name: string }[]
  >([]);
  const [selectedFixedAssetProductId, setSelectedFixedAssetProductId] =
    useState<string | null>(null);
  const [fixedAssetData, setFixedAssetData] =
    useState<FixedAssetsFormInputs | null>(null);
  const { thirdParties, fetchThirdParties } = useThirdParties();
  const { users } = useUsers();
  const { centresCosts } = useCentresCosts();
  const { productTypes, loading: loadingProductTypes } = useProductTypes();
  const { accounts, isLoading, error } = useAccountingAccountsByCategory(
    "account",
    "5"
  );

  const { categories, loading: loadingCategories } = useAssetCategories();
  const { refreshProducts } = useInventory();

  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();

  const { fetchBillingByType } = useBillingByType();

  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState<
    PaymentMethod[]
  >([]);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [showInventariableModal, setShowInventariableModal] = useState(false);
  const { storeInvoice, loading, getAllDeposits } = useInvoicePurchase();

  const [showAdvancesForm, setShowAdvancesForm] = useState(false);
  const [selectedAdvanceMethodId, setSelectedAdvanceMethodId] = useState<
    string | null
  >(null);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [disabledInputs, setDisabledInputs] = useState(false);
  const [showBrandFormModal, setShowBrandFormModal] = useState(false);

  const [editingLot, setEditingLot] = useState<{
    productIndex: number;
    lotIndex: number;
    lotData: any;
  } | null>(null);

  const [paymentMethodsArray, setPaymentMethodsArray] = useState<
    PaymentMethod[]
  >([
    {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: null,
    },
  ]);

  const [purchaseOrderId, setPurchaseOrderId] = useState<any>(0);

  useEffect(() => {
    if (purchaseOrder || supplierId) {
      fetchAdvancePayments(purchaseOrder?.third_id || supplierId, "provider");
    }
  }, [purchaseOrder, supplierId]);

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const depositsData = await getAllDeposits();
        const formatted = depositsData.map((deposit) => ({
          id: deposit.id,
          name: deposit.attributes.name,
          originalData: deposit,
        }));
        setFormattedDeposits(formatted);
      } catch (error) {
        console.error("Error loading deposits:", error);
      }
    };

    loadDeposits();
  }, []);

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

  useEffect(() => {
    if (purchaseOrder && users) {
      handleInvoice(purchaseOrder);
    }
  }, [purchaseOrder, users, reset]);

  async function handleInvoice(purchaseOrder: any) {
    try {
      const rowOrder = await purchaseOrdersService.get(purchaseOrder.id);
      setPurchaseOrderId(rowOrder.id);
      const initialFormData = {
        supplier: rowOrder.third_party?.id,
        costCenter:
          rowOrder.cost_center_id || rowOrder.centre_cost?.id || null,
        buyer: Number(rowOrder.buyer_id),
        elaborationDate: rowOrder.created_at
          ? new Date(rowOrder.created_at)
          : null,
        expirationDate: rowOrder.due_date
          ? new Date(rowOrder.due_date)
          : null,
      };

      reset(initialFormData);
      const mappedProducts =
        rowOrder.details?.map((detail: any) => {
          let typeProduct = "";
          if (detail.product?.product_type) {
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
          return {
            id: generateId(),
            typeProduct: typeProduct,
            product: detail.product_id
              ? detail.product_id
              : accountingAccount.accounting_account_id,
            description: `item ${detail.id}`,
            quantity: detail.quantity || 1,
            price: detail.price || 0,
            discount: discount || 0,
            tax: percentageTax,
            lotInfo: [],
            isExpanded: false,
          };
        }) || [];
      setValue("products", mappedProducts);
      setDisabledInputs(true);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo cargar la factura compra",
        life: 5000,
      });
    }
  }

  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  const handleProductCreated = (productType: string) => {
    refreshProducts(productType);
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Producto creado y lista actualizada",
      life: 3000,
    });
  };

  const calculateLineTotal = (product: any): number => {
    const actualQuantity = ["medications", "vaccines"].includes(
      product.typeProduct
    )
      ? (product.lotInfo || []).reduce(
          (sum: number, lot: any) => sum + (lot.quantity || 0),
          0
        )
      : Number(product.quantity) || 0;

    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;

    // Manejar tanto objeto como número para el impuesto
    let taxRate = 0;
    if (product.tax) {
      if (typeof product.tax === "object" && product.tax !== null) {
        taxRate = Number(product.tax.percentage) || 0;
      } else {
        taxRate = Number(product.tax) || 0;
      }
    }

    const subtotal = actualQuantity * price;

    let discountAmount = 0;
    if (product.discountType === "percentage") {
      discountAmount = subtotal * (discount / 100);
    } else {
      discountAmount = discount;
    }

    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotal - discountAmount) * (taxRate / 100) || 0;

    const total = subtotalAfterDiscount + taxAmount;
    const roundedTotal = parseFloat(total.toFixed(2));

    return roundedTotal;
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal() || 0;
    const totalDiscount = calculateTotalDiscount() || 0;
    const allTaxes = calculateAllTaxes() || 0;
    const totalRetentions = retentions.reduce(
      (sum, r) => sum + (r.value || 0),
      0
    );

    const total = subtotal - totalDiscount + allTaxes - totalRetentions;
    return parseFloat(total.toFixed(2));
  };

  const calculateSubtotal = (): number => {
    return productsArray.reduce((total, product) => {
      const actualQuantity = ["medications", "vaccines"].includes(
        product.typeProduct
      )
        ? (product.lotInfo || []).reduce(
            (sum: number, lot: any) => sum + (lot.quantity || 0),
            0
          )
        : Number(product.quantity) || 0;
      const price = Number(product.price) || 0;
      return total + actualQuantity * price;
    }, 0);
  };

  const calculateTotalDiscount = (): number => {
    return productsArray.reduce((total, product) => {
      const actualQuantity = ["medications", "vaccines"].includes(
        product.typeProduct
      )
        ? (product.lotInfo || []).reduce(
            (sum: number, lot: any) => sum + (lot.quantity || 0),
            0
          )
        : Number(product.quantity) || 0;
      const price = Number(product.price) || 0;

      const subtotal = actualQuantity * price;
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
      const actualQuantity = ["medications", "vaccines"].includes(
        product.typeProduct
      )
        ? (product.lotInfo || []).reduce(
            (sum: number, lot: any) => sum + (lot.quantity || 0),
            0
          )
        : Number(product.quantity) || 0;
      const price = Number(product.price) || 0;

      const subtotal = actualQuantity * price;
      let discountAmount = 0;

      if (product.discountType === "percentage") {
        discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      } else {
        discountAmount = product.discount;
      }

      const subtotalAfterDiscount = subtotal - discountAmount;

      // Manejar tanto objeto como número para el impuesto
      let taxRate = 0;
      if (product.tax) {
        if (typeof product.tax === "object" && product.tax !== null) {
          taxRate = Number(product.tax.percentage) || 0;
        } else {
          taxRate = Number(product.tax) || 0;
        }
      }

      const taxValue = subtotalAfterDiscount * (taxRate / 100);

      return total + taxValue;
    }, 0);
  };

  const calculateAllTaxes = (): number => {
    const productTaxes = calculateTotalTax();
    const additionalTaxes = taxes.reduce((sum, t) => sum + (t.value || 0), 0);

    return productTaxes + additionalTaxes;
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
    const currentProducts = getValues("products") || [];
    setValue("products", [
      ...currentProducts,
      {
        id: generateId(),
        typeProduct: null,
        product: null,
        description: "",
        quantity: 0,
        price: 0,
        discount: 0,
        discountType: "percentage",
        tax: 0,
        lotInfo: [],
        showLotForm: false,
        isExpanded: false,
        depositId: null,
      },
    ]);
  };

  const removeProduct = (index: number) => {
    const currentProducts = getValues("products") || [];
    if (currentProducts.length > 1) {
      const newProducts = currentProducts.filter((_, i) => i !== index);
      setValue("products", newProducts);
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
        value: null,
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

  const handleRemoveLot = (productIndex: number, lotIndex: number) => {
    const currentProducts = getValues("products") || [];
    const updatedProducts = currentProducts.map((product, index) => {
      if (index === productIndex) {
        const updatedLotInfo = [...(product.lotInfo || [])];
        updatedLotInfo.splice(lotIndex, 1);
        return {
          ...product,
          lotInfo: updatedLotInfo,
        };
      }
      return product;
    });
    setValue("products", updatedProducts);
  };

  const handleEditLot = (productIndex: number, lotIndex: number) => {
    const currentProducts = getValues("products") || [];
    const product = currentProducts[productIndex];
    if (product && product.lotInfo && product.lotInfo[lotIndex]) {
      setEditingLot({
        productIndex,
        lotIndex,
        lotData: product.lotInfo[lotIndex],
      });
    }
  };

  const handleSaveEditedLot = (
    productIndex: number,
    data: ExpirationLotFormInputs
  ) => {
    if (editingLot) {
      const currentProducts = getValues("products") || [];
      const updatedProducts = currentProducts.map((product, index) => {
        if (index === productIndex) {
          const updatedLotInfo = [...(product.lotInfo || [])];
          updatedLotInfo[editingLot.lotIndex] = {
            lotNumber: data.lotNumber,
            expirationDate: data.expirationDate,
            deposit: data.deposit,
            quantity: data.quantity || 0,
          };

          return {
            ...product,
            lotInfo: updatedLotInfo,
            lotFormData: {
              lotNumber: "",
              expirationDate: null,
              deposit: "",
              quantity: 0,
            },
          };
        }
        return product;
      });
      setValue("products", updatedProducts);
      setEditingLot(null);

      toast.current?.show({
        severity: "success",
        summary: "Lote actualizado",
        detail: "La información del lote se ha actualizado correctamente",
        life: 3000,
      });
    }
  };

  const handleSaveExpiration = (data: ExpirationLotFormInputs) => {
    if (productForExpiration) {
      // Lógica para guardar la información de expiración
      // Por ejemplo, actualizar el producto correspondiente
      const currentProducts = getValues("products") || [];
      const updatedProducts = currentProducts.map((product) => {
        if (product.id === productForExpiration.id) {
          return {
            ...product,
            // Aquí actualizas con los datos del lote
            lotInfo: [...(product.lotInfo || []), data],
          };
        }
        return product;
      });

      setValue("products", updatedProducts);
      setIsModalVisible(false);
      setProductForExpiration(null);

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Información de lote guardada correctamente",
        life: 3000,
      });
    }
  };

  const handleOpenExpirationModal = (product: any) => {
    setProductForExpiration({
      id: product.id,
      productId: product.product,
      productName: product.description,
    });
    setIsModalVisible(true);
  };

  const handleSaveFixedAsset = (
    productIndex: number,
    data: FixedAssetsFormInputs
  ) => {
    const currentProducts = getValues("products") || [];
    const updatedProducts = currentProducts.map((product, index) => {
      if (index === productIndex) {
        return { ...product, fixedAssetInfo: data };
      }
      return product;
    });
    setValue("products", updatedProducts);

    toast.current?.show({
      severity: "success",
      summary: "Activo fijo guardado",
      detail: "La información se ha guardado correctamente",
      life: 3000,
    });
  };

  const handleHideBrandFormModal = () => {
    setShowBrandFormModal(false);
  };

  const handleSubmitBrand = async (data: any) => {
    try {
      await brandService.create(data);
      SwalManager.success({
        title: "Marca creada",
      });
    } catch (error) {
      console.error("Error creating/updating brand: ", error);
    }
  };

  const handlePaymentChange = (
    id: string,
    field: keyof PaymentMethod,
    value: any
  ) => {
    if (field === "method") {
      const selectedMethod = paymentMethods.find(
        (method) => method.id === value
      );

      if (selectedMethod?.category === "supplier_advance") {
        const supplierId = getValues("supplier");
        if (!supplierId) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Debe seleccionar un proveedor primero",
            life: 5000,
          });
          return;
        }
        setSupplierId(supplierId);
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

  const buildInvoiceData = async (formData: any) => {
    const purchaseIdValue = purchaseOrderId
      ? {
          purchase_order_id: purchaseOrderId,
        }
      : {};

    const billing = await fetchBillingByType("purchase_invoice");

    return {
      invoice: {
        user_id: formData.buyer?.id || 1,
        due_date: formData.expirationDate.toISOString().split("T")[0],
        observations: "",
        third_party_id: formData.supplier || null,
        supplier_id: formData.supplier,
        billing: billing.data,
        ...purchaseIdValue,
      },

      invoice_detail: productsArray.map((product: any) => {
        let infoLot: any = null;
        if (product.lotInfo && product.lotInfo.length) {
          infoLot = product.lotInfo.map((lot: any) => {
            return {
              lot_number: lot.lotNumber || "",
              expiration_date: lot.expirationDate
                ? lot.expirationDate.toISOString().split("T")[0]
                : "",
              deposit_id: lot.deposit || 0,
              quantity: lot.quantity,
            };
          });
        }

        const actualQuantity = ["medications", "vaccines"].includes(
          product.typeProduct
        )
          ? (product.lotInfo || []).reduce(
              (sum: number, lot: any) => sum + (lot.quantity || 0),
              0
            )
          : Number(product.quantity) || 0;

        const subtotal = Number(actualQuantity) * Number(product.price);

        let discountAmount = 0;
        if (product.discountType === "percentage") {
          discountAmount = (subtotal * Number(product.discount)) / 100;
        } else {
          discountAmount = Number(product.discount) || 0;
        }

        const formAssets = product?.fixedAssetInfo
          ? {
              description: product.fixedAssetInfo.description || "",
              brand: product.fixedAssetInfo.brand || "",
              model: product.fixedAssetInfo.model || "",
              serial_number: product.fixedAssetInfo.serialNumber || "",
              internal_code: product.fixedAssetInfo.internalCode || "",
              asset_category_id:
                Number(product.fixedAssetInfo.asset_category_id) || null,
              accounting_account_id: product.accountingAccount?.id,
            }
          : {};

        const formLot = infoLot?.length ? infoLot : [];

        return {
          product_id:
            product.typeProduct === "assets" || product.typeProduct === "spent"
              ? null
              : Number(product.product),
          type_product: product.typeProduct,
          quantity: actualQuantity,
          deposit_id: product.depositId,
          unit_price: product.price,
          discount: discountAmount,
          discount_type: product.discountType,
          tax_product: product.tax?.percentage,
          tax_charge_id: product.tax.id || null,
          accounting_account_id: product.accountingAccount?.id,
          formLot: formLot,
          formAssets: formAssets,
        };
      }),

      retentions: retentions
        .map((retention: any) => retention.percentage.id)
        .filter(Boolean),

      payments: paymentMethodsArray.map((payment) => ({
        payment_method_id: payment.method,
        payment_date: formData.elaborationDate.toISOString().split("T")[0],
        amount: payment.value,
        notes: payment.authorizationNumber || "Pago",
      })),
      taxes: taxes,
    };
  };

  function hasInvalidLots() {
    const invalidLot = productsArray.some((product) => {
      if (
        !product.lotInfo?.length &&
        (product.typeProduct == "vaccines" ||
          product.typeProduct == "medications")
      ) {
        return true;
      }
    });
    return invalidLot;
  }

  const save = async (formData: any) => {
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

    if (hasInvalidLots()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail:
          "Debe agregar información de lote para productos que lo requieran",
        life: 5000,
      });
      return;
    }

    if (
      !formData.invoiceNumber ||
      !formData.documentType ||
      !formData.supplier ||
      !formData.fiscalVoucher ||
      !formData.elaborationDate ||
      !formData.expirationDate ||
      !formData.buyer ||
      !formData.costCenter
    ) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor rellene los campos requeridos",
        life: 5000,
      });
      return;
    }

    const invoiceData = await buildInvoiceData(formData);

    invoiceService
      .storePurcharseInvoice(invoiceData)
      .then((response) => {
        if (purchaseOrderId) {
          onClose();
        }
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Factura de compra guardada correctamente",
          life: 3000,
        });
        setTimeout(() => {
          window.location.href = `FE_FCE`;
        }, 2000);
      })
      .catch((error) => {
        console.error("Error al guardar la factura de compra:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3000,
        });
      });
  };

  const saveAndSend = async (formData: any) => {
    const invoiceData = await buildInvoiceData(formData);

    invoiceService
      .storePurcharseInvoice(invoiceData)
      .then((response) => {
        if (purchaseOrderId) {
          onClose();
        }
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Factura de compra guardada correctamente",
          life: 3000,
        });
        setTimeout(() => {
          window.location.href = `FE_FCE`;
        }, 2000);
      })
      .catch((error) => {
        console.error("Error al guardar la factura de compra:", error);
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3000,
        });
      });
  };

  const { openModal: openThirdPartyModal, ThirdPartyModal } =
    useThirdPartyModal({
      onSuccess: (data) => {
        fetchThirdParties();
      },
    });

  return (
    <div className="container-fluid p-3 p-md-4">
      <ThirdPartyModal />

      {/* Main Header Section */}
      <div className="row mb-3 mb-md-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body p-3 p-md-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                <div>
                  <h1 className="h4 h3-md mb-0 text-primary">
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
            <div className="card mb-3 mb-md-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <h2 className="h5 mb-0">
                  <i className="pi pi-user-edit me-2 text-primary"></i>
                  Información básica
                </h2>
              </div>
              <div className="card-body p-3 p-md-4">
                <div className="row g-2 g-md-3">
                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Número de factura *
                      </label>
                      <Controller
                        name="invoiceNumber"
                        control={control}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            placeholder="Número de factura"
                            className="w-100"
                            size="small"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Tipo de documento *
                      </label>
                      <Controller
                        name="documentType"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            options={[
                              {
                                label: "Factura de compra",
                                value: "factura_compra",
                              },
                              {
                                label: "Documento Soporte",
                                value: "documento_soporte",
                              },
                            ]}
                            placeholder="Seleccione tipo"
                            className="w-100"
                            appendTo={"self"}
                            disabled={disabledInputs}
                            showClear
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        # Comprobante fiscal *
                      </label>
                      <Controller
                        name="fiscalVoucher"
                        control={control}
                        render={({ field }) => (
                          <InputText
                            {...field}
                            placeholder="Número de comprobante fiscal"
                            className="w-100"
                            disabled={disabledInputs}
                            size="small"
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
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
                            appendTo={"self"}
                            disabled={disabledInputs}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Fecha vencimiento *
                      </label>
                      <Controller
                        name="expirationDate"
                        control={control}
                        render={({ field }) => (
                          <Calendar
                            {...field}
                            placeholder="Seleccione fecha"
                            className="w-100"
                            showIcon
                            dateFormat="dd/mm/yy"
                            appendTo={"self"}
                            disabled={disabledInputs}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Proveedor *
                      </label>
                      <Controller
                        name="supplier"
                        control={control}
                        render={({ field }) => (
                          <div className="d-flex gap-1">
                            <Dropdown
                              {...field}
                              filter
                              options={thirdParties}
                              optionLabel="name"
                              optionValue="id"
                              placeholder="Seleccione proveedor"
                              className="flex-grow-1"
                              appendTo={"self"}
                              disabled={disabledInputs}
                            />
                            <Button
                              type="button"
                              onClick={openThirdPartyModal}
                              icon={<i className="fa-solid fa-plus"></i>}
                              className="p-button-primary"
                              size="small"
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Centro de costo *
                      </label>
                      <Controller
                        name="costCenter"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={centresCosts || []}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Seleccione centro"
                            className="w-100"
                            appendTo={"self"}
                            disabled={disabledInputs}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 col-lg-4">
                    <div className="form-group">
                      <label className="form-label small fw-bold">
                        Comprador *
                      </label>
                      <Controller
                        name="buyer"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            {...field}
                            filter
                            options={users || []}
                            optionLabel="full_name"
                            optionValue="id"
                            placeholder="Seleccione comprador"
                            className="w-100"
                            appendTo={"self"}
                            disabled={disabledInputs}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="card mb-3 mb-md-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
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
                      {
                        label: "Inventariable",
                        command: () => setShowInventariableModal(true),
                      },
                      {
                        label: "Marca",
                        command: () => setShowBrandFormModal(true),
                      },
                    ]}
                    severity="contrast"
                    onClick={addProduct}
                    disabled={loadingProductTypes || disabledInputs}
                    size="small"
                  />
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                {loadingProductTypes ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="product-accordion">
                    {productsArray.map((product, index) => (
                      <ProductAccordion
                        key={`product-${product.id}`}
                        control={control}
                        productIndex={index}
                        onRemove={() => removeProduct(index)}
                        deposits={formattedDeposits}
                        onSaveFixedAsset={handleSaveFixedAsset}
                        onEditLot={handleEditLot}
                        onRemoveLot={handleRemoveLot}
                        onSaveEditedLot={handleSaveEditedLot}
                        editingLot={editingLot}
                        setValue={setValue}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Retentions Section */}
            <div className="card mb-3 mb-md-4 shadow-sm">
              <RetentionsSection
                subtotal={calculateSubtotal()}
                totalDiscount={calculateTotalDiscount()}
                retentions={retentions}
                onRetentionsChange={setRetentions}
                productsArray={productsArray}
              />
            </div>

            <div className="card mb-3 mb-md-4 shadow-sm">
              <CustomTaxes
                subtotal={calculateSubtotal()}
                totalDiscount={calculateTotalDiscount()}
                taxes={taxes}
                onTaxesChange={setTaxes}
                productsArray={productsArray}
                taxOptions={availableTaxes}
              />
            </div>

            {/* Payment Methods Section */}
            <div className="card mb-3 mb-md-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                  <h2 className="h5 mb-0">
                    <i className="pi pi-credit-card me-2 text-primary"></i>
                    Método de pago (DOP)
                  </h2>
                  <Button
                    icon="pi pi-plus"
                    label="Agregar método"
                    className="btn-primary"
                    onClick={addPayment}
                    size="small"
                  />
                </div>
              </div>
              <div className="card-body p-2 p-md-3">
                <div className="payment-methods-section">
                  {paymentMethodsArray.map((payment) => (
                    <div
                      key={payment.id}
                      className="payment-method-row mb-3 p-2 border rounded"
                    >
                      <div className="row g-2 align-items-end">
                        <div className="col-12 col-md-4">
                          <label className="form-label small fw-bold">
                            Método *
                          </label>
                          <Dropdown
                            value={payment.method}
                            options={filteredPaymentMethods}
                            optionLabel="method"
                            optionValue="id"
                            placeholder="Seleccione método"
                            className="w-100"
                            onChange={(e) =>
                              handlePaymentChange(payment.id, "method", e.value)
                            }
                            appendTo={"self"}
                            size="small"
                          />
                        </div>

                        <div className="col-12 col-md-4">
                          <label className="form-label small fw-bold">
                            Descripción *
                          </label>
                          <InputText
                            value={payment.authorizationNumber}
                            placeholder="Descripción"
                            className="w-100"
                            onChange={(e) =>
                              handlePaymentChange(
                                payment.id,
                                "authorizationNumber",
                                e.target.value
                              )
                            }
                            size="small"
                          />
                        </div>

                        <div className="col-12 col-md-3">
                          <label className="form-label small fw-bold">
                            Valor
                          </label>
                          <InputNumber
                            value={payment.value}
                            placeholder="Ingrese valor"
                            className="w-100"
                            mode="currency"
                            currency="DOP"
                            locale="es-DO"
                            min={0}
                            onValueChange={(e) =>
                              handlePaymentChange(
                                payment.id,
                                "value",
                                e.value || null
                              )
                            }
                            size="small"
                          />
                        </div>

                        <div className="col-12 col-md-1">
                          <div className="d-flex justify-content-end">
                            <Button
                              className="btn-danger btn-sm"
                              onClick={() => removePayment(payment.id)}
                              disabled={paymentMethodsArray.length <= 1}
                              tooltip="Eliminar método"
                              tooltipOptions={{ position: "top" }}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="payment-summary mt-3">
                    <div
                      className={`payment-summary-card p-3 border rounded ${
                        !paymentCoverage() ? "border-warning" : "border-success"
                      }`}
                    >
                      <div className="row g-3 align-items-center">
                        <div className="col-12 col-md-6">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong className="small">Total factura:</strong>
                            <InputNumber
                              value={calculateTotal() || 0}
                              className="payment-summary-input border-0 bg-transparent text-end"
                              mode="currency"
                              currency="DOP"
                              locale="es-DO"
                              minFractionDigits={2}
                              maxFractionDigits={3}
                              readOnly
                              size="small"
                            />
                          </div>
                        </div>

                        <div className="col-12 col-md-6">
                          <div className="d-flex justify-content-between align-items-center">
                            <strong className="small">Total pagos:</strong>
                            <InputNumber
                              value={calculateTotalPayments()}
                              className="payment-summary-input border-0 bg-transparent text-end"
                              mode="currency"
                              currency="DOP"
                              locale="es-DO"
                              minFractionDigits={2}
                              maxFractionDigits={3}
                              readOnly
                              size="small"
                            />
                          </div>
                        </div>

                        <div className="col-12">
                          <div
                            className={`text-center p-2 rounded ${
                              !paymentCoverage()
                                ? "bg-warning-light"
                                : "bg-success-light"
                            }`}
                          >
                            {!paymentCoverage() ? (
                              <span className="text-warning-dark small fw-bold">
                                <i className="pi pi-exclamation-triangle me-2"></i>
                                Faltan{" "}
                                {(
                                  (calculateTotal() || 0) -
                                  (calculateTotalPayments() || 0)
                                ).toFixed(2)}{" "}
                                DOP
                              </span>
                            ) : (
                              <span className="text-success-dark small fw-bold">
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
              </div>
            </div>

            {/* Summary Section */}
            <div className="card mb-3 mb-md-4 shadow-sm">
              <div className="card-header bg-light p-3">
                <h2 className="h5 mb-0">
                  <i className="pi pi-calculator me-2 text-primary"></i>
                  Resumen de compra (DOP)
                </h2>
              </div>
              <div className="card-body p-3">
                <div className="row g-2 g-md-3">
                  {[
                    {
                      label: "SUBTOTAL",
                      value: calculateSubtotal() || 0,
                      highlight: true,
                    },
                    {
                      label: "Descuento",
                      value: calculateTotalDiscount() || 0,
                      highlight: true,
                    },
                    {
                      label: "Impuestos productos",
                      value: calculateTotalTax() || 0,
                      highlight: true,
                    },
                    {
                      label: "Impuestos adicionales",
                      value: taxes.reduce((sum, t) => sum + t.value, 0),
                      highlight: false,
                    },
                    {
                      label: "Impuestos totales",
                      value: calculateAllTaxes() || 0,
                      highlight: true,
                    },
                    {
                      label: "Retenciones",
                      value: retentions.reduce((sum, r) => sum + r.value, 0),
                      highlight: true,
                    },
                    {
                      label: "TOTAL",
                      value: calculateTotal() || 0,
                      highlight: true,
                    },
                  ].map((item, index) => (
                    <div key={index} className="col-12 col-sm-6 col-lg-3">
                      <div
                        className={`form-group p-2 rounded ${
                          item.highlight ? "bg-light" : ""
                        }`}
                      >
                        <label className="form-label small fw-bold">
                          {item.label}
                        </label>
                        <InputNumber
                          value={item.value}
                          className="w-100"
                          mode="currency"
                          currency="DOP"
                          locale="es-DO"
                          readOnly
                          size="small"
                          inputClassName={
                            item.highlight ? "fw-bold text-primary" : ""
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex flex-column flex-md-row justify-content-end gap-2 mb-4">
              <div className="d-flex gap-2 d-md-none">
                <Button
                  label="Guardar"
                  icon="pi pi-check"
                  className="btn-info flex-fill"
                  type="submit"
                  size="small"
                />
                <Button
                  label="Enviar"
                  icon="pi pi-send"
                  className="btn-info flex-fill"
                  onClick={handleSubmit(save)}
                  disabled={!paymentCoverage()}
                  size="small"
                />
              </div>
              <div className="d-none d-md-flex gap-3">
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
                  onClick={handleSubmit(save)}
                  disabled={!paymentCoverage()}
                />
              </div>
            </div>
          </form>

          {/* Modals */}
          <MedicationFormModal
            show={showMedicamentoModal}
            onHide={() => setShowMedicamentoModal(false)}
            onSuccess={() => handleProductCreated("medications")}
          />

          <SupplyFormModal
            show={showInsumoModal}
            onHide={() => setShowInsumoModal(false)}
            onSuccess={() => handleProductCreated("supplies")}
          />

          <VaccineFormModal
            show={showVaccineModal}
            onHide={() => setShowVaccineModal(false)}
            onSuccess={() => handleProductCreated("vaccines")}
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

          <InventariableFormModal
            show={showInventariableModal}
            onHide={() => setShowInventariableModal(false)}
            onSuccess={() => handleProductCreated("inventariables")}
          />

          <BrandFormModal
            title={"Crear Marca"}
            show={showBrandFormModal}
            handleSubmit={handleSubmitBrand}
            onHide={handleHideBrandFormModal}
            initialData={{}}
          />
        </div>
      </div>
      <Toast ref={toast} />

      <style>{`
        .discount-type-selector .p-dropdown-label {
          padding: 12px 2px;
          text-align: center;
          font-weight: bold;
        }
        
        .discount-type-selector .p-dropdown-trigger {
          width: 1.5rem;
        }
        
        .discount-type-selector {
          min-width: 60px !important;
        }
        
        .d-flex.align-items-center.gap-1 {
          align-items: stretch !important;
        }
        
        .d-flex.align-items-center.gap-1 .p-inputnumber {
          flex: 1;
        }
        
        /* Estilos responsive adicionales */
        .container-fluid {
          max-width: 100%;
          overflow-x: hidden;
        }
        
        .card {
          border: 1px solid #e0e0e0;
        }
        
        .card-header {
          border-bottom: 1px solid #e0e0e0;
        }
        
        .form-label {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .p-inputtext, .p-dropdown, .p-calendar, .p-inputnumber {
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
};
