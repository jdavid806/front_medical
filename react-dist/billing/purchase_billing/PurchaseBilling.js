function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { useThirdParties } from "../third-parties/hooks/useThirdParties.js";
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods.js";
import { useProductTypes } from "../../product-types/hooks/useProductTypes.js";
import { useUsers } from "../../users/hooks/useUsers.js";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts.js";
import { SplitButton } from "primereact/splitbutton";
import MedicationFormModal from "../../inventory/medications/MedicationFormModal.js";
import SupplyFormModal from "../../inventory/supply/SupplyFormModal.js";
import VaccineFormModal from "../../inventory/vaccine/VaccineFormModal.js";
import { useInvoicePurchase } from "./hooks/usePurchaseBilling.js";
import { useInventory } from "./hooks/useInventory.js";
import { brandService, invoiceService, accountingAccountsService } from "../../../services/api/index.js";
import { purchaseOrdersService } from "../../../services/api/index.js";
import { BrandFormModal } from "../../inventory/brands/modal/BrandFormModal.js";
import { useAccountingAccountsByCategory } from "../../accounting/hooks/useAccountingAccounts.js";
import ExpirationLotForm from "../../inventory/lote/ExpirationLotForm.js";
import ExpirationLotModal from "../../inventory/lote/ExpirationLotModal.js";
import { RetentionsSection } from "./retention/RetentionsSection.js";
import FixedAssetsForm from "../../accounting/fixedAssets/form/FixedAssetsForm.js";
import { useAssetCategories } from "../../accounting/fixedAssets/hooks/useAssetCategories.js";
import { useTaxes } from "../../invoices/hooks/useTaxes.js";
import { useAdvancePayments } from "../hooks/useAdvancePayments.js";
import { useBillingByType } from "../hooks/useBillingByType.js";
import { InventariableFormModal } from "../../inventory/inventariable/InventariableFormModal.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { useThirdPartyModal } from "../third-parties/hooks/useThirdPartyModal.js";
export const PurchaseBilling = ({
  purchaseOrder,
  onClose = () => {}
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [productForExpiration, setProductForExpiration] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: {
      errors
    }
  } = useForm();
  const toast = useRef(null);
  const [productsArray, setProductsArray] = useState([{
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
      deposit: ""
    },
    isExpanded: false,
    showLotForm: false,
    fixedAssetInfo: null
  }]);
  const [retentions, setRetentions] = useState([{
    id: generateId(),
    percentage: 0,
    value: 0
  }]);
  const {
    fetchAdvancePayments,
    loading: loadingAdvance,
    advances
  } = useAdvancePayments();
  const [selectedProductForLot, setSelectedProductForLot] = useState(null);
  const [lotFormData, setLotFormData] = useState({
    lotNumber: "",
    expirationDate: null,
    deposit: ""
  });
  const [deposits, setDeposits] = useState([]);
  const [formattedDeposits, setFormattedDeposits] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedFixedAssetProductId, setSelectedFixedAssetProductId] = useState(null);
  const [fixedAssetData, setFixedAssetData] = useState(null);
  const {
    thirdParties,
    fetchThirdParties
  } = useThirdParties();
  const {
    users
  } = useUsers();
  const {
    centresCosts
  } = useCentresCosts();
  const {
    productTypes,
    loading: loadingProductTypes
  } = useProductTypes();
  const {
    accounts,
    isLoading,
    error
  } = useAccountingAccountsByCategory("account", "5");
  const {
    categories,
    loading: loadingCategories
  } = useAssetCategories();
  const {
    refreshProducts
  } = useInventory();
  const {
    paymentMethods,
    loading: loadingPaymentMethods
  } = usePaymentMethods();
  const {
    fetchBillingByType
  } = useBillingByType();
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);
  const [showMedicamentoModal, setShowMedicamentoModal] = useState(false);
  const [showInventariableModal, setShowInventariableModal] = useState(false);
  const {
    storeInvoice,
    loading,
    getAllDeposits
  } = useInvoicePurchase();
  const [showAdvancesForm, setShowAdvancesForm] = useState(false);
  const [selectedAdvanceMethodId, setSelectedAdvanceMethodId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
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
        const formatted = depositsData.map(deposit => ({
          id: deposit.id,
          name: deposit.attributes.name,
          originalData: deposit
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
      setFilteredPaymentMethods(paymentMethods.filter(paymentMethod => ["transactional", "supplier_expiration", "supplier_advance"].includes(paymentMethod.category)));
    }
  }, [paymentMethods]);
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([{
    id: generateId(),
    method: "",
    authorizationNumber: "",
    value: null
  }]);
  const [purchaseOrderId, setPurchaseOrderId] = useState(0);
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
        costCenter: rowOrder.data.cost_center_id || rowOrder.data.centre_cost?.id || null,
        buyer: Number(rowOrder.data.buyer_id),
        elaborationDate: rowOrder.data.created_at ? new Date(rowOrder.data.created_at) : null,
        expirationDate: rowOrder.data.due_date ? new Date(rowOrder.data.due_date) : null
      };
      reset(initialFormData);
      const mappedProducts = rowOrder.data.details?.map(detail => {
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
        const discount = detail.discount ? Number(detail.discount) / (Number(detail.price) * Number(detail.quantity)) * 100 : 0;
        const subtotal = Number(detail.subtotal) - Number(detail.discount);
        const percentageTax = Number(detail.total_taxes) / Number(subtotal) * 100;
        const accountingAccount = detail.accounting_account_assignments.length ? detail.accounting_account_assignments[0] : null;
        return {
          id: generateId(),
          typeProduct: typeProduct,
          product: detail.product_id ? detail.product_id : accountingAccount.accounting_account_id,
          description: `item ${detail.id}`,
          quantity: detail.quantity || 1,
          price: detail.price || 0,
          discount: discount || 0,
          tax: percentageTax,
          lotInfo: [],
          isExpanded: false
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
        life: 5000
      });
    }
  }
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  const handleProductCreated = productType => {
    // Refrescar los productos del tipo específico
    refreshProducts(productType);
    toast.current?.show({
      severity: "success",
      summary: "Éxito",
      detail: "Producto creado y lista actualizada",
      life: 3000
    });
  };
  const calculateLineTotal = product => {
    const quantity = Number(product.quantity) || 0;
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;
    const taxRate = typeof product.tax === "object" && product.tax !== null ? Number(product.tax.percentage) : Number(product.tax) || 0;
    const subtotal = quantity * price;
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
  const calculateTotal = () => {
    const subtotal = calculateSubtotal() || 0;
    const totalDiscount = calculateTotalDiscount() || 0;
    const totalTax = calculateTotalTax() || 0;
    const totalRetentions = retentions.reduce((sum, r) => sum + (r.value || 0), 0);
    const total = subtotal - totalDiscount + totalTax - totalRetentions;
    return parseFloat(total.toFixed(2));
  };
  const calculateSubtotal = () => {
    return productsArray.reduce((total, product) => {
      const quantity = Number(product.quantity) || 0;
      const price = Number(product.price) || 0;
      return total + quantity * price;
    }, 0);
  };
  const calculateTotalDiscount = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discount = Number(product.discount) || 0;
      if (product.discountType === "percentage") {
        return total + subtotal * (discount / 100);
      } else {
        return total + discount;
      }
    }, 0);
  };
  const calculateTotalTax = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      let discountAmount = 0;
      if (product.discountType === "percentage") {
        discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      } else {
        discountAmount = product.discount;
      }
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxValue = subtotalAfterDiscount * (product.tax / 100);
      return total + taxValue;
    }, 0);
  };
  const calculateTotalPayments = () => {
    return paymentMethodsArray.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };
  const paymentCoverage = () => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    return Math.abs(payments - total) < 0.01;
  };
  const addProduct = () => {
    setProductsArray(prev => [...prev, {
      id: generateId(),
      typeProduct: null,
      product: null,
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      tax: 0,
      lotInfo: [],
      showLotForm: false,
      isExpanded: false
    }]);
  };
  const removeProduct = id => {
    if (productsArray.length > 1) {
      setProductsArray(productsArray.filter(product => product.id !== id));
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos un producto",
        life: 3000
      });
    }
  };
  const addPayment = () => {
    setPaymentMethodsArray([...paymentMethodsArray, {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: null
    }]);
  };
  const removePayment = id => {
    if (paymentMethodsArray.length > 1) {
      setPaymentMethodsArray(paymentMethodsArray.filter(payment => payment.id !== id));
    } else {
      toast.current?.show({
        severity: "warn",
        summary: "Advertencia",
        detail: "Debe tener al menos un método de pago",
        life: 3000
      });
    }
  };
  const handleHideBrandFormModal = () => {
    setShowBrandFormModal(false);
  };
  const handleSubmitBrand = async data => {
    try {
      await brandService.create(data);
      SwalManager.success({
        title: "Marca creada"
      });
    } catch (error) {
      console.error("Error creating/updating brand: ", error);
    }
  };
  const handlePaymentChange = (id, field, value) => {
    if (field === "method") {
      const selectedMethod = paymentMethods.find(method => method.id === value);
      if (selectedMethod?.category === "supplier_advance") {
        const supplierId = getValues("supplier");
        if (!supplierId) {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Debe seleccionar un proveedor primero",
            life: 5000
          });
          return;
        }
        setSupplierId(supplierId);
        setSelectedAdvanceMethodId(id);
        setShowAdvancesForm(true);
      }
    }
    setPaymentMethodsArray(prevPayments => prevPayments.map(payment => payment.id === id ? {
      ...payment,
      [field]: value
    } : payment));
  };
  const handleSelectAdvances = selectedAdvances => {
    if (!selectedAdvanceMethodId) return;
    setPaymentMethodsArray(prev => prev.map(payment => payment.id === selectedAdvanceMethodId ? {
      ...payment,
      value: selectedAdvances.amount
    } : payment));
    setShowAdvancesForm(false);
    setSelectedAdvanceMethodId(null);
  };
  const handleProductChange = useCallback((id, field, value) => {
    setProductsArray(prevProducts => prevProducts.map(product => {
      if (product.id === id) {
        const updatedProduct = {
          ...product,
          [field]: value
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
    }));
  }, []);
  const handleProductSelection = (id, productId, type, productName) => {
    setProductsArray(prev => prev.map(p => {
      if (p.id === id) {
        // Mantener lotes existentes y datos del formulario
        const currentFixedAssetInfo = p.fixedAssetInfo;
        const currentLotInfo = p.lotInfo || [];
        const currentFormData = p.lotFormData || {
          lotNumber: "",
          expirationDate: null,
          deposit: ""
        };
        const updatedProduct = {
          ...p,
          product: productId,
          description: productName || `Producto ${productId}`,
          lotInfo: currentLotInfo,
          lotFormData: currentFormData,
          fixedAssetInfo: currentFixedAssetInfo
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
            type
          });
        }
        return updatedProduct;
      }
      return p;
    }));
  };
  const handleSaveFixedAsset = useCallback((productId, data) => {
    setProductsArray(prev => prev.map(p => p.id === productId ? {
      ...p,
      fixedAssetInfo: data
    } : p));
    toast.current?.show({
      severity: "success",
      summary: "Activo fijo guardado",
      detail: "La información se ha guardado correctamente",
      life: 3000
    });
  }, []);
  const ProductAccordion = /*#__PURE__*/React.memo(({
    product
  }) => {
    const containerRef = useRef(null);
    const [showFixedAssetForm, setShowFixedAssetForm] = useState(false);
    const [localFixedAssetData, setLocalFixedAssetData] = useState(product.fixedAssetInfo || {
      assetType: "physical",
      assetName: "",
      asset_category_id: "",
      brand: "",
      model: "",
      serial_number: "",
      internal_code: "",
      description: "",
      user_id: ""
    });
    const handleSaveFixedAssetLocal = useCallback(data => {
      setLocalFixedAssetData(data);
      handleSaveFixedAsset(product.id, data);
    }, [product.id, handleSaveFixedAsset]);
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
          user_id: ""
        });
      }
    }, [product.fixedAssetInfo]);
    const handleLotSubmit = (productId, data) => {
      setProductsArray(prev => prev.map(p => p.id === productId ? {
        ...p,
        lotInfo: [...p.lotInfo, data]
      } : p));
    };
    const shouldShowFixedAssetForm = product.typeProduct === "assets" && product.isExpanded;
    const shouldShowLotForm = (product.typeProduct === "medications" || product.typeProduct === "vaccines") && product.isExpanded;
    useEffect(() => {
      if (product.typeProduct === "assets" && product.isExpanded) {
        setShowFixedAssetForm(true);
      }
    }, [product.typeProduct, product.isExpanded]);
    return /*#__PURE__*/React.createElement("div", {
      ref: containerRef,
      className: "card mb-3",
      style: {
        overflowAnchor: "none",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-header d-flex justify-content-between align-items-center",
      style: {
        cursor: "pointer",
        overflowY: "auto",
        overflowAnchor: "none"
      },
      onClick: () => toggleProductAccordion(product.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${product.isExpanded ? "minus" : "plus"} me-2`
    }), /*#__PURE__*/React.createElement("span", {
      className: "fw-bold"
    }, product.description || "Nuevo Producto Asignado")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge bg-primary me-2"
    }, "Cantidad: ", product.quantity), /*#__PURE__*/React.createElement("span", {
      className: "badge bg-success"
    }, "Total: ", (product.quantity * product.price).toFixed(2), " DOP"))), product.isExpanded && /*#__PURE__*/React.createElement("div", {
      className: "card-body"
    }, /*#__PURE__*/React.createElement(DataTable, {
      value: [product],
      responsiveLayout: "scroll",
      className: "p-datatable-sm p-datatable-gridlines mb-4",
      showGridlines: true,
      stripedRows: true
    }, getProductColumns().map((col, i) => {
      if (col.field === "depositId" && !(product.typeProduct === "supplies" || product.typeProduct === "inventariables")) {
        return null;
      }
      return /*#__PURE__*/React.createElement(Column, {
        key: i,
        field: col.field,
        header: col.header,
        body: col.body
      });
    })), shouldShowLotForm && /*#__PURE__*/React.createElement("div", {
      className: "mt-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-box me-2"
    }), "Gesti\xF3n de Lotes"), product.lotInfo.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "table-responsive"
    }, /*#__PURE__*/React.createElement("table", {
      className: "table table-bordered table-hover"
    }, /*#__PURE__*/React.createElement("thead", {
      className: "table-light"
    }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Lote"), /*#__PURE__*/React.createElement("th", null, "Fecha Caducidad"), /*#__PURE__*/React.createElement("th", null, "Dep\xF3sito"), /*#__PURE__*/React.createElement("th", null, "Acciones"))), /*#__PURE__*/React.createElement("tbody", null, product.lotInfo.map((lot, index) => /*#__PURE__*/React.createElement("tr", {
      key: `lot-${index}`
    }, /*#__PURE__*/React.createElement("td", null, lot.lotNumber), /*#__PURE__*/React.createElement("td", null, lot.expirationDate?.toLocaleDateString() || "N/A"), /*#__PURE__*/React.createElement("td", null, formattedDeposits.find(d => d.id === lot.deposit)?.name))))))), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowAnchor: "none",
        contain: "paint"
      },
      className: "lot-form-container p-4 border rounded bg-light"
    }, /*#__PURE__*/React.createElement(ExpirationLotForm, {
      formId: `lot-form-${product.id}`,
      initialData: product.lotFormData,
      deposits: formattedDeposits,
      productName: product.description,
      onSubmit: data => handleLotSubmit(product.id, data),
      onCancel: () => toggleProductAccordion(product.id)
    }))), /*#__PURE__*/React.createElement("div", {
      className: "card-boyd mt-4"
    }, shouldShowFixedAssetForm && /*#__PURE__*/React.createElement("div", {
      className: "card-boyd mt-4"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-box me-2"
    }), "Informaci\xF3n de Activo Fijo"), /*#__PURE__*/React.createElement(FixedAssetsForm, {
      formId: `fixed-asset-form-${product.id}`,
      onSubmit: handleSaveFixedAssetLocal,
      onCancel: () => {},
      initialData: localFixedAssetData,
      key: `fixed-asset-form-${product.id}`
    })))));
  });
  const toggleProductAccordion = productId => {
    setProductsArray(prev => prev.map(p => ({
      ...p,
      isExpanded: p.id === productId ? !p.isExpanded : p.isExpanded
    })));
  };
  const handleSaveLotInfo = (productId, lotData) => {
    setProductsArray(prevProducts => prevProducts.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          lotInfo: [...product.lotInfo, {
            lotNumber: lotData.lotNumber,
            expirationDate: lotData.expirationDate,
            deposit: lotData.deposit
          }],
          lotFormData: {
            lotNumber: "",
            expirationDate: null,
            deposit: ""
          }
        };
      }
      return product;
    }));
    toast.current?.show({
      severity: "success",
      summary: "Lote guardado",
      detail: "La información del lote se ha guardado correctamente",
      life: 3000
    });
  };
  const handleSaveExpiration = data => {
    if (productForExpiration) {
      setProductsArray(prev => prev.map(p => p.id === productForExpiration.id ? {
        ...p
      } : p));
    }
    setIsModalVisible(false);
    setProductForExpiration(null);
  };
  const buildInvoiceData = async formData => {
    const purchaseIdValue = purchaseOrderId ? {
      purchase_order_id: purchaseOrderId
    } : {};
    const billing = await fetchBillingByType("purchase_invoice");
    return {
      invoice: {
        user_id: formData.buyer?.id || 1,
        due_date: formData.expirationDate.toISOString().split("T")[0],
        observations: "",
        third_party_id: formData.supplier || null,
        supplier_id: formData.supplier,
        billing: billing.data,
        ...purchaseIdValue
      },
      invoice_detail: productsArray.map(product => {
        let infoLot = null;
        if (product.lotInfo && product.lotInfo.length) {
          infoLot = {
            lot_number: product.lotInfo[0].lotNumber || "",
            expiration_date: product.lotInfo?.[0].expirationDate ? product.lotInfo[0].expirationDate.toISOString().split("T")[0] : "",
            deposit_id: product.lotInfo[0].deposit || 0
          };
        }
        const subtotal = Number(product.quantity) * Number(product.price);
        let discountAmount = 0;
        if (product.discountType === "percentage") {
          // Descuento porcentual
          discountAmount = subtotal * Number(product.discount) / 100;
        } else {
          // Descuento en valor fijo
          discountAmount = Number(product.discount) || 0;
        }
        const formAssets = product?.fixedAssetInfo ? {
          description: product.fixedAssetInfo.description || "",
          brand: product.fixedAssetInfo.brand || "",
          model: product.fixedAssetInfo.model || "",
          serial_number: product.fixedAssetInfo.serialNumber || "",
          internal_code: product.fixedAssetInfo.internalCode || "",
          asset_category_id: Number(product.fixedAssetInfo.asset_category_id) || null,
          accounting_account_id: product.accountingAccount.id
        } : {};
        const formLot = infoLot ? {
          expiration_date: infoLot?.expiration_date || null,
          deposit_id: infoLot?.deposit_id || null,
          lot_number: infoLot?.lot_number || ""
        } : {
          deposit_id: product.depositId || null
        };
        return {
          product_id: product.typeProduct === "assets" || product.typeProduct === "spent" ? null : Number(product.product),
          quantity: product.quantity,
          unit_price: product.price,
          discount: discountAmount,
          discount_type: product.discountType,
          tax_product: product.tax,
          tax_charge_id: product.taxChargeId || null,
          accounting_account_id: product.accountingAccount.id,
          ...formLot,
          ...formAssets
        };
      }),
      retentions: retentions.map(retention => retention.percentage.id).filter(Boolean),
      payments: paymentMethodsArray.map(payment => ({
        payment_method_id: payment.method,
        payment_date: formData.elaborationDate.toISOString().split("T")[0],
        amount: payment.value,
        notes: payment.authorizationNumber || "Pago"
      }))
    };
  };
  function hasInvalidLots() {
    const invalidLot = productsArray.some(product => {
      if (!product.lotInfo.length && (product.typeProduct == "vaccines" || product.typeProduct == "medications")) {
        return true;
      }
    });
    return invalidLot;
  }

  // ✅ Función para guardar (solo validación y vista previa en consola)
  const save = async formData => {
    // Validaciones
    if (productsArray.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un producto",
        life: 5000
      });
      return;
    }
    if (paymentMethodsArray.length === 0) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un método de pago",
        life: 5000
      });
      return;
    }
    if (!paymentCoverage()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)}) no cubren el total de la factura (${calculateTotal().toFixed(2)})`,
        life: 5000
      });
      return;
    }
    if (hasInvalidLots()) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar información de lote para productos que lo requieran",
        life: 5000
      });
      return;
    }
    if (!formData.invoiceNumber || !formData.documentType || !formData.supplier || !formData.fiscalVoucher || !formData.elaborationDate || !formData.expirationDate || !formData.buyer || !formData.costCenter) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor rellene los campos requeridos",
        life: 5000
      });
      return;
    }
    const invoiceData = await buildInvoiceData(formData);
    invoiceService.storePurcharseInvoice(invoiceData).then(response => {
      if (purchaseOrderId) {
        onClose();
      }
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura de compra guardada correctamente",
        life: 3000
      });
      setTimeout(() => {
        window.location.href = `FE_FCE`;
      }, 2000);
    }).catch(error => {
      console.error("Error al guardar la factura de compra:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000
      });
    });
  };

  // ✅ Función para guardar y enviar (envía al backend usando tu hook)
  const saveAndSend = async formData => {
    const invoiceData = await buildInvoiceData(formData);
    invoiceService.storePurcharseInvoice(invoiceData).then(response => {
      if (purchaseOrderId) {
        onClose();
      }
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura de compra guardada correctamente",
        life: 3000
      });
      setTimeout(() => {
        window.location.href = `FE_FCE`;
      }, 2000);
    }).catch(error => {
      console.error("Error al guardar la factura de compra:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000
      });
    });
  };

  // Columnas para la tabla de productos
  const getProductColumns = () => {
    return [{
      field: "type",
      header: "Tipo",
      body: rowData => /*#__PURE__*/React.createElement(TypeColumnBody, {
        rowData: rowData,
        onChange: newType => {
          handleProductChange(rowData.id, "typeProduct", newType);
          handleProductChange(rowData.id, "product", null);
        },
        disabled: disabledInputs
      })
    }, {
      field: "product",
      header: "Producto",
      body: rowData => /*#__PURE__*/React.createElement(ProductColumnBody, {
        rowData: rowData,
        type: rowData.typeProduct,
        onChange: value => {
          handleProductChange(rowData.id, "product", value?.product_id);
          handleProductChange(rowData.id, "accountingAccount", value?.accountingAccount);
        },
        onProductSelection: handleProductSelection,
        disabled: disabledInputs
      })
    }, {
      field: "quantity",
      header: "Cantidad",
      body: rowData => /*#__PURE__*/React.createElement(QuantityColumnBody, {
        rowData: rowData,
        onChange: value => handleProductChange(rowData.id, "quantity", value || 0),
        disabled: disabledInputs
      }),
      style: {
        minWidth: "90px"
      }
    }, {
      field: "price",
      header: "Valor unitario",
      body: rowData => /*#__PURE__*/React.createElement(PriceColumnBody, {
        rowData: rowData,
        onChange: value => handleProductChange(rowData.id, "price", value || 0),
        disabled: disabledInputs
      }),
      style: {
        maxWidth: "150px"
      }
    }, {
      field: "discount",
      header: "Descuento",
      body: rowData => /*#__PURE__*/React.createElement(DiscountColumnBody, {
        rowData: rowData,
        onChange: value => handleProductChange(rowData.id, "discount", value || 0),
        onDiscountTypeChange: type => handleProductChange(rowData.id, "discountType", type),
        disabled: disabledInputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "tax",
      header: "Impuestos",
      body: rowData => /*#__PURE__*/React.createElement(IvaColumnBody, {
        onChange: value => {
          // value ahora es el objeto completo del impuesto
          handleProductChange(rowData.id, "tax", value?.percentage || 0);
          handleProductChange(rowData.id, "taxChargeId", value?.id || null);
        },
        value: rowData.tax,
        disabled: disabledInputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "depositId",
      header: "Deposito",
      body: rowData => /*#__PURE__*/React.createElement(DepositColumnBody, {
        deposits: formattedDeposits,
        onChange: value => handleProductChange(rowData.id, "depositId", value),
        value: rowData.depositId,
        disabled: disabledInputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "totalvalue",
      header: "Valor total",
      body: rowData => {
        const total = calculateLineTotal(rowData);
        return /*#__PURE__*/React.createElement(InputNumber, {
          value: total,
          mode: "currency",
          style: {
            maxWidth: "300px"
          },
          className: "w-100",
          currency: "DOP",
          locale: "es-DO",
          readOnly: true
        });
      },
      style: {
        minWidth: "300px"
      }
    }, {
      field: "actions",
      header: "Acciones",
      body: rowData => /*#__PURE__*/React.createElement(Button, {
        className: "p-button-rounded p-button-danger p-button-text",
        onClick: () => removeProduct(rowData.id),
        disabled: productsArray.length <= 1,
        tooltip: "Eliminar Producto"
      }, " ", /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-trash"
      })),
      style: {
        width: "120px",
        textAlign: "center"
      }
    }];
  };
  const {
    openModal: openThirdPartyModal,
    ThirdPartyModal
  } = useThirdPartyModal({
    onSuccess: data => {
      fetchThirdParties();
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-3 p-md-4"
  }, /*#__PURE__*/React.createElement(ThirdPartyModal, null), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3 mb-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3 p-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "h4 h3-md mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-invoice me-2"
  }), "Crear nueva factura de compra"))))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(save)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 mb-md-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light p-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user-edit me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3 p-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2 g-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "N\xFAmero de factura *"), /*#__PURE__*/React.createElement(Controller, {
    name: "invoiceNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "N\xFAmero de factura",
      className: "w-100",
      size: "small"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Tipo de documento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "documentType",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: [{
        label: "Factura de compra",
        value: "factura_compra"
      }, {
        label: "Documento Soporte",
        value: "documento_soporte"
      }],
      placeholder: "Seleccione tipo",
      className: "w-100",
      appendTo: "self",
      disabled: disabledInputs,
      showClear: true
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "# Comprobante fiscal *"), /*#__PURE__*/React.createElement(Controller, {
    name: "fiscalVoucher",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "N\xFAmero de comprobante fiscal",
      className: "w-100",
      disabled: disabledInputs,
      size: "small"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Fecha de elaboraci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "elaborationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: "w-100",
      showIcon: true,
      dateFormat: "dd/mm/yy",
      appendTo: "self",
      disabled: disabledInputs
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Fecha vencimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "expirationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: "w-100",
      showIcon: true,
      dateFormat: "dd/mm/yy",
      appendTo: "self",
      disabled: disabledInputs
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplier",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-1"
    }, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: thirdParties,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione proveedor",
      className: "flex-grow-1",
      appendTo: "self",
      disabled: disabledInputs
    })), /*#__PURE__*/React.createElement(Button, {
      type: "button",
      onClick: openThirdPartyModal,
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-plus"
      }),
      className: "p-button-primary",
      size: "small"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Centro de costo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "costCenter",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: centresCosts || [],
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione centro",
      className: "w-100",
      appendTo: "self",
      disabled: disabledInputs
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Comprador *"), /*#__PURE__*/React.createElement(Controller, {
    name: "buyer",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: users || [],
      optionLabel: "full_name",
      optionValue: "id",
      placeholder: "Seleccione comprador",
      className: "w-100",
      appendTo: "self",
      disabled: disabledInputs
    }))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 mb-md-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Productos/Servicios"), /*#__PURE__*/React.createElement(SplitButton, {
    label: "A\xF1adir producto",
    icon: "pi pi-plus",
    model: [{
      label: "Insumo",
      command: () => setShowInsumoModal(true)
    }, {
      label: "Vacuna",
      command: () => setShowVaccineModal(true)
    }, {
      label: "Medicamento",
      command: () => setShowMedicamentoModal(true)
    }, {
      label: "Inventariable",
      command: () => setShowInventariableModal(true)
    }, {
      label: "Marca",
      command: () => setShowBrandFormModal(true)
    }],
    severity: "contrast",
    onClick: addProduct,
    disabled: loadingProductTypes || disabledInputs,
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2 p-md-3"
  }, loadingProductTypes ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner-border text-primary",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "visually-hidden"
  }, "Cargando...")), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-muted"
  }, "Cargando productos...")) : /*#__PURE__*/React.createElement("div", {
    className: "product-accordion"
  }, productsArray.map(product => /*#__PURE__*/React.createElement(ProductAccordion, {
    key: `product-${product.id}`,
    product: product
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 mb-md-4 shadow-sm"
  }, /*#__PURE__*/React.createElement(RetentionsSection, {
    subtotal: calculateSubtotal(),
    totalDiscount: calculateTotalDiscount(),
    retentions: retentions,
    onRetentionsChange: setRetentions,
    productsArray: productsArray
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 mb-md-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todo de pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar m\xE9todo",
    className: "btn-primary",
    onClick: addPayment,
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-2 p-md-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "payment-methods-section"
  }, paymentMethodsArray.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "payment-method-row mb-3 p-2 border rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: payment.method,
    options: filteredPaymentMethods,
    optionLabel: "method",
    optionValue: "id",
    placeholder: "Seleccione m\xE9todo",
    className: "w-100",
    onChange: e => handlePaymentChange(payment.id, "method", e.value),
    appendTo: "self",
    size: "small"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Descripci\xF3n *"), /*#__PURE__*/React.createElement(InputText, {
    value: payment.authorizationNumber,
    placeholder: "Descripci\xF3n",
    className: "w-100",
    onChange: e => handlePaymentChange(payment.id, "authorizationNumber", e.target.value),
    size: "small"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Valor"), /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value,
    placeholder: "Ingrese valor",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    onValueChange: e => handlePaymentChange(payment.id, "value", e.value || null),
    size: "small"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "btn-danger btn-sm",
    onClick: () => removePayment(payment.id),
    disabled: paymentMethodsArray.length <= 1,
    tooltip: "Eliminar m\xE9todo",
    tooltipOptions: {
      position: "top"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "payment-summary mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `payment-summary-card p-3 border rounded ${!paymentCoverage() ? "border-warning" : "border-success"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3 align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "small"
  }, "Total factura:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal() || 0,
    className: "payment-summary-input border-0 bg-transparent text-end",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true,
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "small"
  }, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalPayments(),
    className: "payment-summary-input border-0 bg-transparent text-end",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true,
    size: "small"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: `text-center p-2 rounded ${!paymentCoverage() ? "bg-warning-light" : "bg-success-light"}`
  }, !paymentCoverage() ? /*#__PURE__*/React.createElement("span", {
    className: "text-warning-dark small fw-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-2"
  }), "Faltan", " ", ((calculateTotal() || 0) - (calculateTotalPayments() || 0)).toFixed(2), " ", "DOP") : /*#__PURE__*/React.createElement("span", {
    className: "text-success-dark small fw-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-2"
  }), "Pagos completos"))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 mb-md-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light p-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calculator me-2 text-primary"
  }), "Resumen de compra (DOP)")), /*#__PURE__*/React.createElement("div", {
    className: "card-body p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2 g-md-3"
  }, [{
    label: "SUBTOTAL",
    value: calculateSubtotal() || 0,
    highlight: true
  }, {
    label: "Descuento",
    value: calculateTotalDiscount() || 0,
    highlight: true
  }, {
    label: "Impuestos",
    value: calculateTotalTax() || 0,
    highlight: true
  }, {
    label: "Retenciones",
    value: retentions.reduce((sum, r) => sum + r.value, 0),
    highlight: true
  }, {
    label: "TOTAL",
    value: calculateTotal() || 0,
    highlight: true
  }].map((item, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "col-12 col-sm-6 col-lg-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `form-group p-2 rounded ${item.highlight ? "bg-light" : ""}`
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, item.label), /*#__PURE__*/React.createElement(InputNumber, {
    value: item.value,
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true,
    size: "small",
    inputClassName: item.highlight ? "fw-bold text-primary" : ""
  }))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-end gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 d-md-none"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info flex-fill",
    type: "submit",
    size: "small"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Enviar",
    icon: "pi pi-send",
    className: "btn-info flex-fill",
    onClick: handleSubmit(save),
    disabled: !paymentCoverage(),
    size: "small"
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-none d-md-flex gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(save),
    disabled: !paymentCoverage()
  })))), /*#__PURE__*/React.createElement(MedicationFormModal, {
    show: showMedicamentoModal,
    onHide: () => setShowMedicamentoModal(false),
    onSuccess: () => handleProductCreated("medications")
  }), /*#__PURE__*/React.createElement(SupplyFormModal, {
    show: showInsumoModal,
    onHide: () => setShowInsumoModal(false),
    onSuccess: () => handleProductCreated("supplies")
  }), /*#__PURE__*/React.createElement(VaccineFormModal, {
    show: showVaccineModal,
    onHide: () => setShowVaccineModal(false),
    onSuccess: () => handleProductCreated("vaccines")
  }), /*#__PURE__*/React.createElement(ExpirationLotModal, {
    isVisible: isModalVisible,
    onSave: handleSaveExpiration,
    onClose: () => {
      setIsModalVisible(false);
      setProductForExpiration(null);
    },
    productName: productForExpiration?.productName
  }), /*#__PURE__*/React.createElement(InventariableFormModal, {
    show: showInventariableModal,
    onHide: () => setShowInventariableModal(false),
    onSuccess: () => handleProductCreated("inventariables")
  }), /*#__PURE__*/React.createElement(BrandFormModal, {
    title: "Crear Marca",
    show: showBrandFormModal,
    handleSubmit: handleSubmitBrand,
    onHide: handleHideBrandFormModal,
    initialData: {}
  }))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("style", null, `
        /* Estilos mejorados para responsive */
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
        
        .p-inputtext-sm, .p-dropdown-sm, .p-calendar-sm {
          font-size: 0.875rem;
          padding: 0.375rem 0.75rem;
        }
        
        /* Mejoras para la tabla de productos en mobile */
        .p-datatable-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .p-datatable .p-datatable-thead > tr > th,
        .p-datatable .p-datatable-tbody > tr > td {
          white-space: nowrap;
          min-width: 80px;
          font-size: 0.875rem;
          padding: 0.5rem;
        }
        
        .p-datatable .p-column-title {
          font-size: 0.875rem;
          font-weight: 600;
        }
        
        /* Accordion mejorado para mobile */
        .product-accordion .card {
          margin-bottom: 0.5rem;
        }
        
        .product-accordion .card-header {
          padding: 0.75rem;
          font-size: 0.875rem;
        }
        
        .product-accordion .card-body {
          padding: 0.75rem;
        }
        
        /* Payment methods responsive */
        .payment-method-row {
          background: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .payment-method-row:hover {
          background: #e9ecef;
        }
        
        .payment-summary-card {
          background: rgba(248, 249, 250, 0.8);
          backdrop-filter: blur(10px);
        }
        
        .bg-warning-light {
          background: rgba(255, 193, 7, 0.1) !important;
        }
        
        .bg-success-light {
          background: rgba(40, 167, 69, 0.1) !important;
        }
        
        .text-warning-dark {
          color: #856404 !important;
        }
        
        .text-success-dark {
          color: #155724 !important;
        }
        
        /* Botones responsive */
        .btn-sm {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        /* Scroll suave */
        .product-accordion {
          scroll-behavior: smooth;
        }
        
        /* Mejoras visuales para mobile */
        @media (max-width: 768px) {
          .container-fluid {
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          }
          
          .card-body {
            padding: 1rem;
          }
          
          .h4, .h5 {
            font-size: 1.1rem;
          }
          
          .p-datatable {
            font-size: 0.8rem;
          }
          
          .p-datatable .p-datatable-thead > tr > th,
          .p-datatable .p-datatable-tbody > tr > td {
            padding: 0.375rem;
            min-width: 70px;
          }
          
          .payment-method-row .col-md-1 {
            margin-top: 0.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .p-datatable-wrapper {
            font-size: 0.75rem;
          }
          
          .p-button {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .d-flex.gap-2 {
            flex-direction: column;
          }
          
          .payment-summary-card .row {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
        
        /* Loading states */
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
        
        /* Focus states para accesibilidad */
        .p-focus {
          box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.2) !important;
          border-color: #268fff !important;
        }
      `));
};
const TypeColumnBody = ({
  rowData,
  onChange,
  disabled
}) => {
  const options = [{
    id: "supplies",
    name: "Insumos"
  }, {
    id: "medications",
    name: "Medicamentos"
  }, {
    id: "vaccines",
    name: "Vacunas"
  }, {
    id: "spent",
    name: "Gastos y servicios"
  }, {
    id: "assets",
    name: "Activos fijos"
  }, {
    id: "inventariables",
    name: "Inventariables"
  }];
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: rowData.typeProduct,
    options: options,
    optionLabel: "name",
    optionValue: "id",
    filter: true,
    placeholder: "Seleccione Tipo",
    className: "w-100",
    onFocus: e => e.target.blur(),
    onChange: e => {
      onChange(e.value);
      e.originalEvent?.preventDefault();
      e.originalEvent?.stopPropagation();
    },
    disabled: disabled
  });
};
const ProductColumnBody = ({
  rowData,
  type,
  onChange,
  onProductSelection,
  disabled
}) => {
  const [subAccounts, setSubAccounts] = useState("");
  const {
    getByType,
    products,
    currentType,
    refreshProducts
  } = useInventory();
  const {
    accounts: spentAccounts
  } = useAccountingAccountsByCategory("sub_account", subAccounts);
  const {
    accounts: propertyAccounts
  } = useAccountingAccountsByCategory("sub_account", "1");
  const {
    accounts: accountingAccountByCategory
  } = useAccountingAccountsByCategory("category", type);
  const [options, setOptions] = useState([]);
  const dropdownRef = useRef(null);
  useEffect(() => {
    if (type && type !== currentType && ["supplies", "medications", "vaccines", "services", "inventariables"].includes(type)) {
      getByType(type);
    }
  }, [type, currentType]);
  useEffect(() => {
    if (type && rowData.typeProduct !== type) {
      // Limpiar el producto seleccionado pero mantener el valor si es compatible
      const currentProduct = rowData.product;
      const isCurrentProductValid = options.some(opt => opt.id === currentProduct);
      if (!isCurrentProductValid) {
        onChange("");
        onProductSelection(rowData.id, "", type, "");
      }
    }
  }, [type, options]);
  useEffect(() => {
    if (!type) return;
    if (type !== currentType && ["supplies", "medications", "vaccines", "services", "inventariables"].includes(type)) {
      getByType(type);
    }

    // Formatear opciones basadas en el tipo
    let formattedOptions = [];
    if (type === "spent") {
      fetchAccountingAccounts();
      formattedOptions = spentAccounts?.map(acc => ({
        id: acc.id,
        label: String(acc.account_name),
        name: String(acc.account_name)
      })) || [];
    } else if (type === "assets") {
      formattedOptions = propertyAccounts?.map(acc => ({
        id: acc.id,
        label: String(acc.account_name),
        name: String(acc.account_name)
      })) || [];
    } else {
      formattedOptions = products?.map(p => ({
        id: p.id,
        label: String(p.name || p.label || p.account_name),
        name: String(p.name || p.label || p.account_name)
      })) || [];
    }
    setOptions(formattedOptions);
  }, [type, currentType, products, spentAccounts, propertyAccounts]);
  async function fetchAccountingAccounts() {
    const data = await accountingAccountsService.getAll();
    const dataMapped = data.data.map(item => item.sub_account).filter((subAccount, index, array) => {
      const num = parseInt(subAccount);
      return array.indexOf(subAccount) === index && !isNaN(num) && num >= 5;
    }).sort((a, b) => parseInt(a) - parseInt(b)); // Ordenar numéricamente

    setSubAccounts(dataMapped.join(","));
  }
  const handleProductChange = e => {
    const accountingAccountId = type === "spent" || type === "assets" ? {
      id: e.value
    } : 0;
    const data = {
      product_id: e.value,
      accountingAccount: accountingAccountByCategory[0] || accountingAccountId
    };
    onChange(data);
    const selectedProduct = options.find(opt => opt.id === e.value);
    onProductSelection(rowData.id, e.value, rowData.typeProduct || "", selectedProduct?.label);
  };
  return /*#__PURE__*/React.createElement(Dropdown, {
    ref: dropdownRef,
    value: rowData.product,
    options: options,
    optionLabel: "label",
    optionValue: "id",
    placeholder: "Seleccione Producto",
    className: "w-100",
    onChange: handleProductChange,
    onFocus: e => e.target.blur(),
    loading: !options.length,
    emptyMessage: "No hay productos disponibles",
    appendTo: document.body,
    filter: true,
    disabled: disabled
  });
};
const QuantityColumnBody = ({
  rowData,
  onChange,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(InputNumber, {
    value: rowData.quantity,
    placeholder: "Cantidad",
    className: "w-100",
    min: 0,
    onValueChange: e => onChange(e.value),
    disabled: disabled
  });
};
const PriceColumnBody = ({
  rowData,
  onChange,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(InputNumber, {
    value: rowData.price,
    placeholder: "Precio",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    style: {
      maxWidth: "300px"
    },
    locale: "es-DO",
    min: 0,
    onValueChange: e => onChange(e.value),
    disabled: disabled
  });
};
const DiscountColumnBody = ({
  rowData,
  onChange,
  onDiscountTypeChange,
  disabled
}) => {
  const [localDiscountType, setLocalDiscountType] = useState(rowData.discountType || "percentage");
  useEffect(() => {
    if (rowData.discountType && rowData.discountType !== localDiscountType) {
      setLocalDiscountType(rowData.discountType);
    }
  }, [rowData.discountType]);
  const handleTypeChange = type => {
    setLocalDiscountType(type);
    onDiscountTypeChange(type);
    if (type !== (rowData.discountType || "percentage")) {
      onChange(0);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-1"
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: localDiscountType,
    options: [{
      label: "%",
      value: "percentage"
    }, {
      label: "$",
      value: "fixed"
    }],
    optionLabel: "label",
    optionValue: "value",
    onChange: e => handleTypeChange(e.value),
    className: "discount-type-selector",
    style: {
      width: "60px",
      minWidth: "60px"
    },
    size: "small",
    disabled: disabled
  }), /*#__PURE__*/React.createElement(InputNumber, {
    value: rowData.discount,
    placeholder: localDiscountType === "percentage" ? "0" : "0.00",
    className: "flex-grow-1",
    suffix: localDiscountType === 'percentage' ? "%" : "",
    mode: localDiscountType === "fixed" ? "currency" : "decimal",
    currency: localDiscountType === "fixed" ? "DOP" : undefined,
    locale: "es-DO",
    min: 0,
    max: localDiscountType === "percentage" ? 100 : undefined,
    onValueChange: e => onChange(e.value),
    disabled: disabled,
    style: {
      minWidth: "85px"
    }
  }), /*#__PURE__*/React.createElement("style", null, `
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
  
  /* Para que los dos elementos queden bien alineados */
  .d-flex.align-items-center.gap-1 {
    align-items: stretch !important;
  }
  
  .d-flex.align-items-center.gap-1 .p-inputnumber {
    flex: 1;
  }
`));
};
const IvaColumnBody = ({
  onChange,
  value,
  disabled
}) => {
  const {
    taxes,
    loading: loadingTaxes,
    fetchTaxes
  } = useTaxes();
  useEffect(() => {
    fetchTaxes();
  }, []);
  const currentValue = typeof value === "object" && value !== null ? value.percentage : value;
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: currentValue,
    options: taxes,
    optionLabel: option => `${option.name} - ${Math.floor(option.percentage)}%`,
    optionValue: "percentage",
    placeholder: "Seleccione IVA",
    className: "w-100",
    onChange: e => {
      const selectedTax = taxes.find(tax => tax.percentage === e.value);
      if (selectedTax) {
        onChange(selectedTax);
      }
    },
    appendTo: document.body,
    disabled: disabled,
    showClear: true
  });
};
const DepositColumnBody = ({
  deposits,
  onChange,
  value,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: value,
    options: deposits,
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione dep\xF3sito",
    className: "w-100",
    onChange: e => {
      onChange(e.value);
    },
    appendTo: document.body,
    disabled: disabled,
    showClear: true
  });
};