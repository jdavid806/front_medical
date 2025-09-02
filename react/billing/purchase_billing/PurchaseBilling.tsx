import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact";
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
import { brandService, invoiceService } from "../../../services/api";
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
    formState: { errors },
  } = useForm();
  const toast = useRef<Toast>(null);

  const [productsArray, setProductsArray] = useState<any[]>([
    {
      id: generateId(),
      typeProduct: null,
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      tax: { id: 0, name: "3%" },
      lotInfo: [],
      lotFormData: {
        lotNumber: "",
        expirationDate: null,
        deposit: "",
      },
      isExpanded: false,
      showLotForm: false,
      fixedAssetInfo: null,
    },
  ]);
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
          originalData: deposit, // Mantenemos los datos originales por si son necesarios
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
    if (purchaseOrder && users) {
      handleInvoice(purchaseOrder);
    }
  }, [purchaseOrder, users, reset]);

  async function handleInvoice(purchaseOrder) {
    try {
      const rowOrder = await purchaseOrdersService.get(purchaseOrder.id);
      setPurchaseOrderId(rowOrder.data.id);
      const initialFormData = {
        supplier: rowOrder.data.third_party?.id,
        costCenter:
          rowOrder.data.cost_center_id || rowOrder.data.centre_cost?.id || null,
        buyer: Number(rowOrder.data.buyer_id),
        elaborationDate: rowOrder.data.created_at
          ? new Date(rowOrder.data.created_at)
          : null,
        expirationDate: rowOrder.data.due_date
          ? new Date(rowOrder.data.due_date)
          : null,
      };

      reset(initialFormData);
      const mappedProducts =
        rowOrder.data.details?.map((detail: any) => {
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
      setProductsArray(mappedProducts);
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

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = (product: InvoiceProduct): number => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const taxRate = (product.tax && Number(product.tax.id)) || 0;

    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);

    const total = subtotalAfterDiscount + taxAmount;
    const roundedTotal = parseFloat(total.toFixed(2));

    return roundedTotal;
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal() || 0;
    const totalDiscount = calculateTotalDiscount() || 0;
    const totalTax = calculateTotalTax() || 0;
    const totalRetentions = retentions.reduce(
      (sum, r) => sum + (r.value || 0),
      0
    );

    const total = subtotal - totalDiscount + totalTax - totalRetentions;
    return parseFloat(total.toFixed(2));
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
      const taxRate = product.tax ? Number(product.tax.id) : 0;
      return total + subtotalAfterDiscount * (taxRate / 100);
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
    setProductsArray((prev) => [
      ...prev,
      {
        id: generateId(),
        typeProduct: null,
        product: null,
        description: "",
        quantity: 0,
        price: 0,
        discount: 0,
        tax: { id: 0, name: "0%" },
        lotInfo: [],
        showLotForm: false,
        isExpanded: false,
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

  // Función para manejar el cambio en los métodos de pago
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
  const handleProductChange = useCallback(
    (id: any, field: keyof InvoiceProduct, value: any) => {
      setProductsArray((prevProducts) =>
        prevProducts.map((product) => {
          if (product.id === id) {
            const updatedProduct = {
              ...product,
              [field]: value,
            };

            if (field === "typeProduct") {
              updatedProduct.product = null;
              updatedProduct.description = "";

              if (value !== "assets") {
                updatedProduct.fixedAssetInfo = null;
              }
              if (!["medications", "vaccines"].includes(value)) {
                updatedProduct.lotInfo = [];
              }
            }

            return updatedProduct;
          }
          return product;
        })
      );
    },
    [] // Sin dependencias ya que solo usa setProductsArray
  );

  const handleProductSelection = (
    id: string,
    productId: string,
    type: string,
    productName?: string
  ) => {
    setProductsArray((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          // Mantener lotes existentes y datos del formulario
          const currentFixedAssetInfo = p.fixedAssetInfo;
          const currentLotInfo = p.lotInfo || [];
          const currentFormData = p.lotFormData || {
            lotNumber: "",
            expirationDate: null,
            deposit: "",
          };

          const updatedProduct = {
            ...p,
            product: productId,
            description: productName || `Producto ${productId}`,
            lotInfo: currentLotInfo,
            lotFormData: currentFormData,
            fixedAssetInfo: currentFixedAssetInfo,
          };

          if (type === "assets") {
            setSelectedFixedAssetProductId(id);
          } else {
            setSelectedFixedAssetProductId(null);
          }

          if (["medications", "vaccines"].includes(type)) {
            setSelectedProductForLot({
              id,
              productId,
              productName: productName || updatedProduct.description,
              type,
            });
          }

          return updatedProduct;
        }
        return p;
      })
    );
  };

  // Función para manejar el guardado de datos de activos fijos
  const handleSaveFixedAsset = useCallback(
    (productId: string, data: FixedAssetsFormInputs) => {
      setProductsArray((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, fixedAssetInfo: data } : p
        )
      );
      toast.current?.show({
        severity: "success",
        summary: "Activo fijo guardado",
        detail: "La información se ha guardado correctamente",
        life: 3000,
      });
    },
    []
  );

  //Componente de lote de Productos
  const ProductAccordion = React.memo(
    ({ product }: { product: InvoiceProduct }) => {
      const containerRef = useRef<HTMLDivElement>(null);
      const [showFixedAssetForm, setShowFixedAssetForm] = useState(false);
      const [localFixedAssetData, setLocalFixedAssetData] =
        useState<FixedAssetsFormInputs>(
          product.fixedAssetInfo || {
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

      // Función para guardar los datos del activo fijo
      const handleSaveFixedAssetLocal = useCallback(
        (data: FixedAssetsFormInputs) => {
          // Actualizar estado local
          setLocalFixedAssetData(data);
          // Actualizar estado global
          handleSaveFixedAsset(product.id, data);
        },
        [product.id, handleSaveFixedAsset]
      );

      useEffect(() => {
        if (product.fixedAssetInfo) {
          setLocalFixedAssetData(product.fixedAssetInfo);
        } else {
          setLocalFixedAssetData({
            assetType: "physical",
            assetName: "",
            asset_category_id: "",
            brand: "",
            model: "",
            serial_number: "",
            internal_code: "",
            description: "",
            user_id: "",
          });
        }
      }, [product.fixedAssetInfo]);

      const handleLotSubmit = (
        productId: string,
        data: ExpirationLotFormInputs
      ) => {
        setProductsArray((prev) =>
          prev.map((p) =>
            p.id === productId
              ? {
                  ...p,
                  lotInfo: [...p.lotInfo, data],
                }
              : p
          )
        );
      };

      const shouldShowFixedAssetForm =
        product.typeProduct === "assets" && product.isExpanded;

      const shouldShowLotForm =
        (product.typeProduct === "medications" ||
          product.typeProduct === "vaccines") &&
        product.isExpanded;

      useEffect(() => {
        if (product.typeProduct === "assets" && product.isExpanded) {
          setShowFixedAssetForm(true);
        }
      }, [product.typeProduct, product.isExpanded]);

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
            onClick={() => toggleProductAccordion(product.id)}
          >
            <div className="d-flex align-items-center">
              <i
                className={`fas fa-${
                  product.isExpanded ? "minus" : "plus"
                } me-2`}
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
                {getProductColumns().map((col, i) => {
                  if (
                    col.field === "depositId" &&
                    !(
                      product.typeProduct === "supplies" ||
                      product.typeProduct === "inventariables"
                    )
                  ) {
                    return null;
                  }
                  return (
                    <Column
                      key={i}
                      field={col.field}
                      header={col.header}
                      body={col.body}
                    />
                  );
                })}
              </DataTable>

              {shouldShowLotForm && (
                <div className="mt-4">
                  <h5 className="mb-3">
                    <i className="pi pi-box me-2"></i>
                    Gestión de Lotes
                  </h5>

                  {product.lotInfo.length > 0 && (
                    <div className="mb-3">
                      <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                          <thead className="table-light">
                            <tr>
                              <th>Lote</th>
                              <th>Fecha Caducidad</th>
                              <th>Depósito</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.lotInfo.map((lot, index) => (
                              <tr key={`lot-${index}`}>
                                <td>{lot.lotNumber}</td>
                                <td>
                                  {lot.expirationDate?.toLocaleDateString() ||
                                    "N/A"}
                                </td>
                                <td>
                                  {
                                    formattedDeposits.find(
                                      (d) => d.id === lot.deposit
                                    )?.name
                                  }
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
                    {
                      <ExpirationLotForm
                        formId={`lot-form-${product.id}`}
                        initialData={product.lotFormData}
                        deposits={formattedDeposits}
                        productName={product.description}
                        onSubmit={(data) => handleLotSubmit(product.id, data)}
                        onCancel={() => toggleProductAccordion(product.id)}
                      />
                    }
                  </div>
                </div>
              )}
              <div className="card-boyd mt-4">
                {shouldShowFixedAssetForm && (
                  <div className="card-boyd mt-4">
                    <h5 className="mb-3">
                      <i className="pi pi-box me-2"></i>
                      Información de Activo Fijo
                    </h5>
                    <FixedAssetsForm
                      formId={`fixed-asset-form-${product.id}`}
                      onSubmit={handleSaveFixedAssetLocal}
                      onCancel={() => {}}
                      initialData={localFixedAssetData}
                      key={`fixed-asset-form-${product.id}`}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  );

  const toggleProductAccordion = (productId: string) => {
    setProductsArray((prev) =>
      prev.map((p) => ({
        ...p,
        isExpanded: p.id === productId ? !p.isExpanded : p.isExpanded,
      }))
    );
  };

  const handleSaveLotInfo = (
    productId: string,
    lotData: ExpirationLotFormInputs
  ) => {
    setProductsArray((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            lotInfo: [
              ...product.lotInfo,
              {
                lotNumber: lotData.lotNumber,
                expirationDate: lotData.expirationDate,
                deposit: lotData.deposit,
              },
            ],
            lotFormData: {
              lotNumber: "",
              expirationDate: null,
              deposit: "",
            },
          };
        }
        return product;
      })
    );

    toast.current?.show({
      severity: "success",
      summary: "Lote guardado",
      detail: "La información del lote se ha guardado correctamente",
      life: 3000,
    });
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

  // Función para construir el objeto de datos a enviar al backend
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

      invoice_detail: productsArray.map((product) => {
        let infoLot: any = null;
        if (product.lotInfo && product.lotInfo.length) {
          infoLot = {
            lot_number: product.lotInfo[0].lotNumber || "",
            expiration_date: product.lotInfo?.[0].expirationDate
              ? product.lotInfo[0].expirationDate.toISOString().split("T")[0]
              : "",
            deposit_id: product.lotInfo[0].deposit || 0,
          };
        }

        const subtotal = Number(product.quantity) * Number(product.price);
        const discountAmount = (subtotal * Number(product.discount)) / 100;
        const taxAmount =
          (subtotal - discountAmount) * (Number(product.tax) / 100) || 0;

        const formAssets = product?.fixedAssetInfo
          ? {
              description: product.fixedAssetInfo.description || "",
              brand: product.fixedAssetInfo.brand || "",
              model: product.fixedAssetInfo.model || "",
              serial_number: product.fixedAssetInfo.serialNumber || "",
              internal_code: product.fixedAssetInfo.internalCode || "",
              asset_category_id:
                Number(product.fixedAssetInfo.asset_category_id) || null,
              accounting_account_id: product.product,
            }
          : {};

        const formLot = infoLot
          ? {
              expiration_date: infoLot?.expiration_date || null,
              deposit_id: infoLot?.deposit_id || null,
              lot_number: infoLot?.lot_number || "",
            }
          : {
              deposit_id: product.depositId || null,
            };

        return {
          product_id:
            product.typeProduct === "assets" ? null : Number(product.product),
          quantity: product.quantity,
          unit_price: product.price,
          discount: product.discount,
          tax_product: taxAmount,
          ...formLot,
          ...formAssets,
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
    };
  };

  function hasInvalidLots() {
    const invalidLot = productsArray.some((product) => {
      if (
        !product.lotInfo.length &&
        (product.typeProduct == "vaccines" ||
          product.typeProduct == "medications")
      ) {
        return true;
      }
    });
    return invalidLot;
  }

  // ✅ Función para guardar (solo validación y vista previa en consola)
  const save = async (formData: any) => {
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

    const invoiceData = await buildInvoiceData(formData);

    console.log("invoiceData:", invoiceData);
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
        // setTimeout(() => {
        //   window.location.href = `FE_FCE`;
        // }, 2000);
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

  // ✅ Función para guardar y enviar (envía al backend usando tu hook)
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

  // Columnas para la tabla de productos
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
            disabled={disabledInputs}
          />
        ),
      },
      {
        field: "product",
        header: "Producto",
        body: (rowData: InvoiceProduct) => (
          <ProductColumnBody
            rowData={rowData}
            type={rowData.typeProduct}
            onChange={(value: string) => {
              handleProductChange(rowData.id, "product", value);
            }}
            onProductSelection={handleProductSelection}
            disabled={disabledInputs}
          />
        ),
      },
      {
        field: "quantity",
        header: "Cantidad",
        body: (rowData: InvoiceProduct) => (
          <QuantityColumnBody
            rowData={rowData}
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "quantity", value || 0)
            }
            disabled={disabledInputs}
          />
        ),
        style: { minWidth: "90px" },
      },
      {
        field: "price",
        header: "Valor unitario",
        body: (rowData: InvoiceProduct) => (
          <PriceColumnBody
            rowData={rowData}
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "price", value || 0)
            }
            disabled={disabledInputs}
          />
        ),
        style: { maxWidth: "150px" },
      },
      {
        field: "discount",
        header: "Descuento %",
        body: (rowData: InvoiceProduct) => (
          <DiscountColumnBody
            rowData={rowData}
            onChange={(value: number | null) =>
              handleProductChange(rowData.id, "discount", value || 0)
            }
            disabled={disabledInputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "tax",
        header: "Impuestos",
        body: (rowData: InvoiceProduct) => (
          <IvaColumnBody
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "tax", value)
            }
            value={rowData.tax}
            disabled={disabledInputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "depositId",
        header: "Deposito",
        body: (rowData: InvoiceProduct) => (
          <DepositColumnBody
            deposits={formattedDeposits}
            onChange={(value: string | null) =>
              handleProductChange(rowData.id, "depositId", value)
            }
            value={rowData.depositId}
            disabled={disabledInputs}
          />
        ),
        style: { minWidth: "150px" },
      },
      {
        field: "totalvalue",
        header: "Valor total",
        body: (rowData: InvoiceProduct) => {
          const total = calculateLineTotal(rowData);

          return (
            <InputNumber
              value={total}
              mode="currency"
              style={{ maxWidth: "200px" }}
              className="button-width"
              currency="DOP"
              locale="es-DO"
              readOnly
            />
          );
        },
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

  const { openModal: openThirdPartyModal, ThirdPartyModal } =
    useThirdPartyModal({
      onSuccess: (data) => {
        fetchThirdParties();
      },
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

                  {/* Nuevo: Tipo de documento */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">Tipo de documento *</label>
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
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Nuevo: Comprobante fiscal */}
                  <div className="col-md-4">
                    <div className="form-group">
                      <label className="form-label">
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
                            appendTo={"self"}
                            disabled={disabledInputs}
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
                            appendTo={"self"}
                            disabled={disabledInputs}
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
                              appendTo={"self"}
                              disabled={disabledInputs}
                            />
                            <Button
                              type="button"
                              onClick={openThirdPartyModal}
                              icon={<i className="fa-solid fa-plus"></i>}
                              className="p-button-primary"
                            />
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
                            options={centresCosts || []}
                            optionLabel="name"
                            optionValue="id"
                            placeholder="Seleccione centro"
                            className={classNames("w-100")}
                            appendTo={"self"}
                            disabled={disabledInputs}
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
                            options={users || []}
                            optionLabel="full_name"
                            optionValue="id"
                            placeholder="Seleccione comprador"
                            className={classNames("w-100")}
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
                />
              </div>
              <div className="card-body">
                {loadingProductTypes ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 text-muted">Cargando productos...</p>
                  </div>
                ) : (
                  <div
                    className="product-accordion"
                    style={{ overflowAnchor: "none" }}
                  >
                    {productsArray.map((product) => (
                      <ProductAccordion
                        key={`product-${product.id}`}
                        product={product}
                      />
                    ))}
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
              />
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
                          className="w-100"
                          onChange={(e) =>
                            handlePaymentChange(payment.id, "method", e.value)
                          }
                          appendTo={"self"}
                        />
                      </div>

                      <div className="payment-method-field">
                        <label className="payment-method-label">
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
                        />
                      </div>

                      <div className="payment-method-field">
                        <label className="payment-method-label">Valor</label>
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
                      className={`payment-summary-card ${
                        !paymentCoverage()
                          ? "payment-warning"
                          : "payment-success"
                      }`}
                    >
                      <div className="payment-summary-item">
                        <strong>Total factura:</strong>
                        <InputNumber
                          value={calculateTotal() || 0}
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
                              (calculateTotal() || 0) -
                              (calculateTotalPayments() || 0)
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

            {/* {showAdvancesForm && supplierId && (
              <div className="card mb-4 shadow-sm">
                <div className="card-header bg-light">
                  <h2 className="h5 mb-0">
                    <i className="pi pi-history me-2 text-primary"></i>
                    Seleccionar Anticipos del Proveedor
                  </h2>
                </div>
                <div className="card-body">
                  <AdvanceHistoryForm
                    customerId={supplierId}
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
                                ? { ...payment, method: "", value: 0 }
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
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">SUBTOTAL</label>
                      <InputNumber
                        value={calculateSubtotal() || 0}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">Descuento</label>
                      <InputNumber
                        value={calculateTotalDiscount() || 0}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">IVA</label>
                      <InputNumber
                        value={calculateTotalTax() || 0}
                        className="w-100"
                        mode="currency"
                        currency="DOP"
                        locale="es-DO"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label className="form-label">TOTAL</label>
                      <InputNumber
                        value={calculateTotal() || 0}
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
            onHide={() => setShowMedicamentoModal(false)}
          />

          <SupplyFormModal
            show={showInsumoModal}
            onHide={() => setShowInsumoModal(false)}
          />

          <VaccineFormModal
            show={showVaccineModal}
            onHide={() => setShowVaccineModal(false)}
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
          />

          <BrandFormModal
            title={"Crear Marca"}
            show={showBrandFormModal}
            handleSubmit={handleSubmitBrand}
            onHide={handleHideBrandFormModal}
            initialData={{}}
          ></BrandFormModal>
        </div>
      </div>
      <Toast ref={toast} />

      <style>{` 
                  /* Asegurar que el overlay del dropdown tenga mayor z-index que el modal */
                  .p-dropdown-panel {
                    z-index: 1100 !important;
                  }
                  .overlay-invoices {
                    position: absolute !important;
                    z-index: 1030 !important;
                    height: fit-content !important;
                  }
				  
                  .p-datatable-wrapper {
                    overflow-x: auto;
                    max-width: 100%;
                  }
                  /* Evita que las celdas se rompan */
                  .p-datatable .p-datatable-thead > tr > th,
                  .p-datatable .p-datatable-tbody > tr > td {
                    white-space: nowrap;
                    min-width: 100px;
                  }

                  /* Corrección específica para PrimeReact */
                  .p-dropdown-panel .p-dropdown-items-wrapper {
                    overflow: auto;
                    max-height: 200px;
                  }
                  .product-accordion {
                   max-width:100%;
                   overflow-anchor: none; 

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
                          /* Estilos para el formulario de lotes */
                      .lot-form-container {
                         overflow-anchor: none;
                      }
                      .input-wrapper {
                        position: relative;
                        margin-bottom: 1rem;
                      }
                      /* Prevenir saltos en los inputs */
                      .p-inputtext {
                        transition: none !important;
                         overscroll-behavior: contain !important;
                           contain: content !important;
                             overflow-anchor: none !;


                      }
                      
                      /* Posicionamiento del dropdown */
                      .p-dropdown-panel {
                        position: absolute !important;
                        top: auto !important;
                        left: auto !important;
                        z-index: 1100 !important;
                      }
                      
                      /* Comportamiento de scroll */
                      .p-datatable-wrapper {
                        overscroll-behavior: contain;
                      }
                      
                      /* Foco en inputs */
                      .p-inputtext:focus {
                        box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
                        border-color: #268fff;
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
    { id: "spent", name: "gastos" },
    { id: "assets", name: "Activos fijos" },
    { id: "inventariables", name: "Inventariables" },
  ];

  return (
    <Dropdown
      value={rowData.typeProduct}
      options={options}
      optionLabel="name"
      optionValue="id"
      filter
      placeholder="Seleccione Tipo"
      className="w-100"
      onFocus={(e) => e.target.blur()}
      onChange={(e: DropdownChangeEvent) => {
        onChange(e.value);
        e.originalEvent?.preventDefault();
        e.originalEvent?.stopPropagation();
      }}
      disabled={disabled}
    />
  );
};

const ProductColumnBody = ({
  rowData,
  type,
  onChange,
  onProductSelection,
  disabled,
}: {
  rowData: InvoiceProduct;
  type: string | null;
  onChange: (value: string) => void;
  onProductSelection: (
    id: string,
    productId: string,
    type: string,
    productName?: string
  ) => void;
  disabled?: boolean;
}) => {
  const { getByType, products, currentType } = useInventory();
  const { accounts: spentAccounts } = useAccountingAccountsByCategory(
    "account",
    "5"
  );
  const { accounts: propertyAccounts } = useAccountingAccountsByCategory(
    "sub_account",
    "15"
  );

  const [options, setOptions] = useState<any[]>([]);
  const dropdownRef = useRef<any>(null);

  useEffect(() => {
    if (type && rowData.typeProduct !== type) {
      // Limpiar el producto seleccionado pero mantener el valor si es compatible
      const currentProduct = rowData.product;
      const isCurrentProductValid = options.some(
        (opt) => opt.id === currentProduct
      );

      if (!isCurrentProductValid) {
        onChange("");
        onProductSelection(rowData.id, "", type, "");
      }
    }
  }, [type, options]);

  useEffect(() => {
    if (!type) return;

    // Solo hacer la llamada si el tipo ha cambiado
    if (
      type !== currentType &&
      [
        "supplies",
        "medications",
        "vaccines",
        "services",
        "inventariables",
      ].includes(type)
    ) {
      getByType(type);
    }

    // Formatear opciones basadas en el tipo
    let formattedOptions: { id: number; label: string; name: string }[] = [];

    if (type === "spent") {
      formattedOptions =
        spentAccounts?.map((acc) => ({
          id: acc.id,
          label: String(acc.account_name),
          name: String(acc.account_name),
        })) || [];
    } else if (type === "assets") {
      formattedOptions =
        propertyAccounts?.map((acc) => ({
          id: acc.id,
          label: String(acc.account_name),
          name: String(acc.account_name),
        })) || [];
    } else {
      formattedOptions =
        products?.map((p) => ({
          id: p.id,
          label: String(p.name || p.label || p.account_name),
          name: String(p.name || p.label || p.account_name),
        })) || [];
    }

    setOptions(formattedOptions);
  }, [type, currentType, products, spentAccounts, propertyAccounts]);

  const handleProductChange = (e: DropdownChangeEvent) => {
    onChange(e.value);
    const selectedProduct = options.find((opt) => opt.id === e.value);
    onProductSelection(
      rowData.id,
      e.value,
      rowData.typeProduct || "",
      selectedProduct?.label
    );
  };

  return (
    <Dropdown
      ref={dropdownRef}
      value={rowData.product}
      options={options}
      optionLabel="label"
      optionValue="id"
      placeholder="Seleccione Producto"
      className="w-100"
      onChange={handleProductChange}
      onFocus={(e) => e.target.blur()}
      loading={!options.length}
      emptyMessage="No hay productos disponibles"
      appendTo={document.body}
      filter
      disabled={disabled}
    />
  );
};
const QuantityColumnBody = ({
  rowData,
  onChange,
  disabled,
}: {
  rowData: InvoiceProduct;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}) => {
  return (
    <InputNumber
      value={rowData.quantity}
      placeholder="Cantidad"
      className="w-100"
      style={{ maxWidth: "120px" }}
      min={0}
      onValueChange={(e: any) => onChange(e.value)}
      disabled={disabled}
    />
  );
};

const PriceColumnBody = ({
  rowData,
  onChange,
  disabled,
}: {
  rowData: InvoiceProduct;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}) => {
  return (
    <InputNumber
      value={rowData.price}
      placeholder="Precio"
      className="w-100"
      mode="currency"
      currency="DOP"
      style={{ maxWidth: "200px" }}
      locale="es-DO"
      min={0}
      onValueChange={(e: any) => onChange(e.value)}
      disabled={disabled}
    />
  );
};

const DiscountColumnBody = ({
  rowData,
  onChange,
  disabled,
}: {
  rowData: InvoiceProduct;
  onChange: (value: number | null) => void;
  disabled?: boolean;
}) => {
  return (
    <InputNumber
      value={rowData.discount}
      placeholder="Descuento"
      className="w-100"
      style={{ maxWidth: "120px" }}
      suffix="%"
      min={0}
      max={100}
      onValueChange={(e: any) => onChange(e.value)}
      disabled={disabled}
    />
  );
};

const IvaColumnBody = ({
  onChange,
  value,
  disabled,
}: {
  onChange: (value: string | null) => void;
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
  deposits,
  onChange,
  value,
  disabled,
}: {
  deposits: any[];
  onChange: (value: string | null) => void;
  value: any | null;
  disabled?: boolean;
}) => {
  return (
    <Dropdown
      value={value}
      options={deposits}
      optionLabel="name"
      optionValue="id"
      placeholder="Seleccione depósito"
      className="w-100"
      onChange={(e: DropdownChangeEvent) => {
        onChange(e.value);
      }}
      appendTo={document.body}
      disabled={disabled}
    />
  );
};
