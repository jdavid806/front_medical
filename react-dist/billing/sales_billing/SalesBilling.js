function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";
import { useThirdParties } from "../third-parties/hooks/useThirdParties.js";
import { useProductTypes } from "../../product-types/hooks/useProductTypes.js";
import { usePaymentMethods } from "../../payment-methods/hooks/usePaymentMethods.js";
import { invoiceService } from "../../../services/api/index.js";
import { useUsers } from "../../users/hooks/useUsers.js";
import { useEffect } from "react";
import { useTaxes } from "../../invoices/hooks/useTaxes.js";
import { useInventory } from "../purchase_billing/hooks/useInventory.js";
import { RetentionsSection } from "../purchase_billing/retention/RetentionsSection.js";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts.js";
import { useAccountingAccountsByCategory } from "../../accounting/hooks/useAccountingAccounts.js";
import { FormAdvanceCopy } from "./modal/FormAdvanceCopy.js";
import { depositService } from "../../../services/api/index.js";
import { Dialog } from "primereact/dialog";
import { useAdvancePayments } from "../hooks/useAdvancePayments.js";
import { useBillingByType } from "../hooks/useBillingByType.js";
import { useThirdPartyModal } from "../third-parties/hooks/useThirdPartyModal.js"; // Definición de tipos
export const SalesBilling = ({
  selectedInvoice,
  successSale
}) => {
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch
  } = useForm();
  const {
    thirdParties,
    fetchThirdParties
  } = useThirdParties();
  const {
    users
  } = useUsers();
  const {
    productTypes,
    loading: loadingProductTypes
  } = useProductTypes();
  const {
    paymentMethods,
    loading: loadingPaymentMethods
  } = usePaymentMethods();
  const [filteredPaymentMethods, setFilteredPaymentMethods] = useState([]);
  const [showAdvancesForm, setShowAdvancesForm] = useState(false);
  const [selectedAdvanceMethodId, setSelectedAdvanceMethodId] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [disabledInpputs, setDisabledInputs] = useState(false);
  const [purchaseOrderId, setPurchaseOrderId] = useState(0);
  const {
    fetchBillingByType
  } = useBillingByType();
  const [billing, setBilling] = useState(null);
  // Estados para manejar lotes y activos fijos

  const invoiceType = watch("type");
  useEffect(() => {
    if (paymentMethods) {
      setFilteredPaymentMethods(paymentMethods.filter(paymentMethod => ["transactional", "customer_advance", "customer_expiration"].includes(paymentMethod.category)));
    }
  }, [paymentMethods]);
  const [productsArray, setProductsArray] = useState([{
    id: generateId(),
    typeProduct: "",
    product: "",
    description: "",
    quantity: 0,
    price: 0,
    discount: 0,
    iva: 0
  }]);
  const [retentions, setRetentions] = useState([{
    id: generateId(),
    percentage: 0,
    value: 0
  }]);
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([{
    id: generateId(),
    method: "",
    authorizationNumber: "",
    value: ""
  }]);
  const {
    centresCosts
  } = useCentresCosts();
  const {
    fetchAdvancePayments,
    loading,
    advances
  } = useAdvancePayments();
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
  const typeOptions = [{
    id: "tax_invoice",
    name: "Fiscal"
  }, {
    id: "consumer",
    name: "Consumidor"
  }, {
    id: "government_invoice",
    name: "Gubernamental"
  }];
  useEffect(() => {
    handleProductsToInvoice(selectedInvoice);
  }, [selectedInvoice && centresCosts]);
  function handleProductsToInvoice(selectedInvoice) {
    setProductsArray([]);
    if (selectedInvoice) {
      setValue("supplier", selectedInvoice.third_id);
      setValue("elaborationDate", new Date(selectedInvoice.created_at));
      setValue("expirationDate", new Date(selectedInvoice.due_date));
      const selectedCostCenter = centresCosts.find(cc => cc.id == selectedInvoice.cost_center_id);
      setValue("costCenter", selectedCostCenter);
      setValue("seller_id", Number(selectedInvoice.buyer_id));
      setPurchaseOrderId(selectedInvoice.id);
      const productsMapped = selectedInvoice.details.map(item => {
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
        const discount = item.discount ? Number(item.discount) / (Number(item.price) * Number(item.quantity)) * 100 : 0;
        const subtotal = Number(item.subtotal) - Number(item.discount);
        const percentageTax = Number(item.total_taxes) / Number(subtotal) * 100;
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
          taxAccountingAccountId: item.tax_accounting_account_id || null
        };
      });
      setProductsArray(productsMapped);
      setDisabledInputs(true);
    }
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = product => {
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
      return total + subtotal * (discount / 100);
    }, 0);
  };
  const calculateTotalTax = () => {
    return productsArray.reduce((total, product) => {
      const subtotal = (Number(product.quantity) || 0) * (Number(product.price) || 0);
      const discountAmount = subtotal * ((Number(product.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const ivaRate = product.iva || 0; // <-- Cambio aquí
      return total + subtotalAfterDiscount * (ivaRate / 100);
    }, 0);
  };
  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateTotalDiscount();
  };
  const calculateTotalWithholdingTax = () => {
    return retentions.reduce((total, retention) => total + (retention.value || 0), 0);
  };
  const calculateTotal = () => {
    const subtotalAfterDiscount = calculateSubtotalAfterDiscount() || 0;
    const totalTax = calculateTotalTax() || 0;
    const totalWithholding = calculateTotalWithholdingTax() || 0;
    const total = subtotalAfterDiscount + totalTax - totalWithholding;
    return parseFloat(total.toFixed(2));
  };
  const calculateTotalPayments = () => {
    return paymentMethodsArray.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  };
  const paymentCoverage = () => {
    const total = calculateTotal();
    const payments = calculateTotalPayments();
    // Permitimos un pequeño margen por redondeos
    return Math.abs(payments - total) < 0.01;
  };
  // Funciones para manejar productos
  const addProduct = () => {
    setProductsArray([...productsArray, {
      id: generateId(),
      typeProduct: "",
      product: "",
      description: "",
      quantity: 0,
      price: 0,
      discount: 0,
      iva: 0
    }]);
  };
  // Función para manejar la selección de anticipos
  const handleSelectAdvances = selectedAdvances => {
    if (!selectedAdvanceMethodId) return;
    setPaymentMethodsArray(prev => prev.map(payment => payment.id === selectedAdvanceMethodId ? {
      ...payment,
      value: selectedAdvances.amount
    } : payment));
    setShowAdvancesForm(false);
    setSelectedAdvanceMethodId(null);
  };
  const removeProduct = id => {
    if (productsArray.length > 1) {
      setProductsArray(prevProducts => prevProducts.filter(product => product.id !== id));
    }
  };
  const handleProductChange = (id, field, value) => {
    setProductsArray(prevProducts => prevProducts.map(product => product.id === id ? {
      ...product,
      [field]: value
    } : product));
  };

  // Funciones para manejar métodos de pago
  const addPayment = () => {
    setPaymentMethodsArray([...paymentMethodsArray, {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: ""
    }]);
  };
  const removePayment = id => {
    if (paymentMethodsArray.length > 1) {
      setPaymentMethodsArray(prevPayments => prevPayments.filter(payment => payment.id !== id));
    }
  };
  async function changeType(type) {
    const billing = await fetchBillingByType(type);
    setBilling(billing.data);
  }
  const handlePaymentChange = (id, field, value) => {
    if (field === "method") {
      const selectedMethod = paymentMethods.find(method => method.id === value);
      if (selectedMethod?.category === "customer_advance") {
        const customerId = getValues("supplier");
        if (!customerId) {
          window["toast"].show({
            severity: "error",
            summary: "Error",
            detail: "Debe seleccionar un cliente primero",
            life: 5000
          });
          return;
        }
        setCustomerId(customerId);
        setSelectedAdvanceMethodId(id);
        setShowAdvancesForm(true);
      }
    }
    setPaymentMethodsArray(prevPayments => prevPayments.map(payment => payment.id === id ? {
      ...payment,
      [field]: value
    } : payment));
  };

  // Funciones para guardar
  const save = async formData => {
    // Validación básica
    if (productsArray.length === 0) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un producto",
        life: 5000
      });
      return;
    }
    if (paymentMethodsArray.length === 0) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: "Debe agregar al menos un método de pago",
        life: 5000
      });
      return;
    }
    if (!paymentCoverage()) {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: `Los métodos de pago (${calculateTotalPayments().toFixed(2)} DOP) no cubren el total de la factura (${calculateTotal().toFixed(2)} DOP)`,
        life: 5000
      });
      return;
    }
    const invoiceData = formatInvoiceForBackend(formData);
    invoiceService.storeSale(invoiceData).then(response => {
      if (selectedInvoice) {
        successSale();
      }
      window["toast"].show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura creada exitosamente",
        life: 5000
      });
      setTimeout(() => {
        window.location.href = `FE_FCE`;
      }, 2000);
    }).catch(error => {
      window["toast"].show({
        severity: "error",
        summary: "Error",
        detail: error?.message,
        life: 5000
      });
      console.error("Error creating invoice:", error);
    });
  };
  function formatInvoiceForBackend(frontendData) {
    const purchaseIdValue = purchaseOrderId ? {
      purchase_order_id: purchaseOrderId
    } : {};
    const retentionsValue = retentions[0].value > 0 ? {
      retentions: retentions.map(retention => retention.percentage.id)
    } : {};
    return {
      invoice: {
        user_id: frontendData.seller_id,
        due_date: frontendData.expirationDate,
        observations: "",
        billing_type: frontendData.type,
        third_party_id: frontendData.supplier,
        ...purchaseIdValue,
        billing: billing
      },
      invoice_detail: productsArray.map(product => {
        return {
          product_id: Number(product.product),
          deposit_id: product.depositId,
          quantity: product.quantity,
          unit_price: product.price,
          discount: product.discount,
          tax_product: product.taxAmount || product.iva || 0,
          tax_accounting_account_id: product.taxAccountingAccountId || null,
          tax_charge_id: product.taxChargeId || null
        };
      }),
      payments: paymentMethodsArray.map(payment => {
        return {
          payment_method_id: payment.method,
          payment_date: new Date().toISOString().slice(0, 10),
          amount: payment.value,
          notes: ""
        };
      }),
      ...retentionsValue
    };
  }
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
        disabled: disabledInpputs
      })
    }, {
      field: "product",
      header: "Producto",
      body: rowData => {
        return /*#__PURE__*/React.createElement(ProductColumnBody, {
          rowData: rowData,
          type: rowData.typeProduct,
          onChange: value => {
            handleProductChange(rowData.id, "product", value);
          },
          handleProductChange: handleProductChange,
          disabled: disabledInpputs
        });
      }
    }, {
      field: "quantity",
      header: "Cantidad",
      body: rowData => /*#__PURE__*/React.createElement(QuantityColumnBody, {
        onChange: value => handleProductChange(rowData.id, "quantity", value || 0),
        value: rowData.quantity,
        disabled: disabledInpputs
      }),
      style: {
        minWidth: "90px"
      }
    }, {
      field: "price",
      header: "Valor unitario",
      body: rowData => /*#__PURE__*/React.createElement(PriceColumnBody, {
        onChange: value => handleProductChange(rowData.id, "price", value || 0),
        value: rowData.price,
        disabled: disabledInpputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "discount",
      header: "Descuento %",
      body: rowData => /*#__PURE__*/React.createElement(DiscountColumnBody, {
        onChange: value => handleProductChange(rowData.id, "discount", value || 0),
        value: rowData.discount,
        disabled: disabledInpputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "iva",
      header: "Impuestos",
      body: rowData => /*#__PURE__*/React.createElement(IvaColumnBody, {
        onChange: value => {
          // value ahora es el objeto completo del impuesto
          handleProductChange(rowData.id, "iva", value?.percentage || 0);
          handleProductChange(rowData.id, "taxAccountingAccountId", value?.accounting_account_id || null);
          handleProductChange(rowData.id, "taxChargeId", value?.id || null);
        },
        value: rowData.iva // Esto seguirá mostrando el porcentaje
        ,
        disabled: disabledInpputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "deposit",
      header: "Depósito",
      body: rowData => /*#__PURE__*/React.createElement(DepositColumnBody, {
        onChange: value => handleProductChange(rowData.id, "depositId", value),
        value: rowData.depositId,
        disabled: disabledInpputs
      }),
      style: {
        minWidth: "150px"
      }
    }, {
      field: "totalvalue",
      header: "Valor total",
      body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
        value: calculateLineTotal(rowData),
        mode: "currency",
        style: {
          maxWidth: "200px"
        },
        className: "button-width",
        currency: "DOP",
        locale: "es-DO",
        readOnly: true
      }),
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
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement(ThirdPartyModal, null), /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "h3 mb-0 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-file-invoice me-2"
  }), "Crear nueva factura de venta"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(save)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-user-edit me-2 text-primary"
  }), "Informaci\xF3n b\xE1sica")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({
      required: true
    }, field, {
      options: typeOptions,
      optionLabel: "name",
      optionValue: "id",
      onChange: e => {
        field.onChange(e.value);
        changeType(e.value);
      },
      placeholder: "Seleccione un tipo",
      className: classNames("w-100"),
      appendTo: "self"
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha de elaboraci\xF3n *"), /*#__PURE__*/React.createElement(Controller, {
    name: "elaborationDate",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy",
      disabled: disabledInpputs
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Fecha vencimiento *"), /*#__PURE__*/React.createElement(Controller, {
    name: "expirationDate",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: classNames("w-100"),
      showIcon: true,
      dateFormat: "dd/mm/yy",
      disabled: disabledInpputs
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Proveedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "supplier",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex"
    }, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: thirdParties,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccione un proveedor",
      className: classNames("w-100"),
      appendTo: "self",
      disabled: disabledInpputs
    })), /*#__PURE__*/React.createElement(Button, {
      type: "button",
      onClick: openThirdPartyModal,
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-plus"
      }),
      className: "p-button-primary"
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Vendedor *"), /*#__PURE__*/React.createElement(Controller, {
    name: "seller_id",
    control: control,
    rules: {
      required: "Campo obligatorio"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: users,
      optionLabel: "full_name",
      optionValue: "id",
      placeholder: "Seleccione un vendedor",
      className: classNames("w-100"),
      appendTo: "self",
      disabled: disabledInpputs
    })))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Centro de costo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "costCenter",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      filter: true,
      options: centresCosts,
      optionLabel: "name",
      placeholder: "Seleccione centro",
      className: classNames("w-100"),
      appendTo: "self",
      disabled: disabledInpputs
    }))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Productos"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "A\xF1adir Producto",
    className: "btn btn-primary",
    onClick: e => {
      e.preventDefault();
      addProduct();
    },
    disabled: disabledInpputs
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, loadingProductTypes ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner-border text-primary",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "visually-hidden"
  }, "Cargando...")), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-muted"
  }, "Cargando productos...")) : /*#__PURE__*/React.createElement(DataTable, {
    key: `products-table-${productTypes.length}`,
    value: productsArray,
    emptyMessage: "No hay productos agregados",
    className: "p-datatable-sm p-datatable-gridlines",
    showGridlines: true,
    scrollable: true,
    stripedRows: true,
    loading: false,
    size: "small"
  }, getProductColumns().map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement(RetentionsSection, {
    subtotal: calculateSubtotal(),
    totalDiscount: calculateTotalDiscount(),
    retentions: retentions,
    onRetentionsChange: setRetentions
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todos de Pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    icon: "pi pi-plus",
    label: "Agregar M\xE9todo",
    className: "btn btn-primary",
    onClick: e => {
      e.preventDefault();
      addPayment();
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, paymentMethodsArray.map(payment => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Dropdown, {
    required: true,
    value: payment.method,
    options: filteredPaymentMethods,
    optionLabel: "method",
    optionValue: "id",
    placeholder: "Seleccione m\xE9todo",
    className: "w-100",
    onChange: e => {
      handlePaymentChange(payment.id, "method", e.value);
    },
    appendTo: "self"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor *"), /*#__PURE__*/React.createElement(InputNumber, {
    value: payment.value === "" ? null : payment.value,
    placeholder: "$0.00",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    min: 0,
    onValueChange: e => handlePaymentChange(payment.id, "value", e.value === null ? "" : e.value)
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-1"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-danger p-button-text",
    onClick: () => removePayment(payment.id),
    disabled: paymentMethodsArray.length <= 1,
    tooltip: "Eliminar m\xE9todo"
  }, " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-trash"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-info",
    style: {
      background: "rgb(194 194 194 / 85%)",
      border: "none",
      color: "black"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total factura:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalPayments(),
    className: "ms-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    minFractionDigits: 2,
    maxFractionDigits: 3,
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, !paymentCoverage() ? /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-1"
  }), "Faltan", " ", (calculateTotal() - calculateTotalPayments()).toFixed(2), " ", "DOP") : /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-1"
  }), "Pagos completos")))))))), /*#__PURE__*/React.createElement(Dialog, {
    style: {
      width: "50vw",
      height: "44vh"
    },
    header: "Anticipos",
    visible: showAdvancesForm,
    onHide: () => setShowAdvancesForm(false)
  }, /*#__PURE__*/React.createElement(FormAdvanceCopy, {
    advances: advances,
    invoiceTotal: (calculateTotal() - calculateTotalPayments()).toFixed(2),
    onSubmit: data => {
      handleSelectAdvances(data);
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-calculator me-2 text-primary"
  }), "Totales (DOP)")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotal(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Subtotal con descuento"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateSubtotalAfterDiscount(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Impuesto"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Total"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotal(),
    className: "w-100 font-weight-bold",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit"
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: el => {
      window["toast"] = el;
    }
  }), " ", /*#__PURE__*/React.createElement("style", null, `
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
    id: "services",
    name: "Servicios"
  }, {
    id: "assetsFixed",
    name: "Activos y fijos"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Dropdown, {
    value: rowData.typeProduct,
    options: options,
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione Tipo",
    className: "w-100",
    onChange: e => {
      onChange(e.value);
    },
    onClick: e => e.stopPropagation(),
    disabled: disabled
  }));
};
const ProductColumnBody = ({
  rowData,
  type,
  onChange,
  handleProductChange,
  disabled
}) => {
  const {
    getByType,
    products
  } = useInventory();
  const {
    accounts: propertyAccounts
  } = useAccountingAccountsByCategory("sub_account", "15");
  const [options, setOptions] = useState([]);
  useEffect(() => {
    if (!type) return;
    if (type === "assetsFixed") {
      // Cargar cuentas de activos fijos
      const formatted = propertyAccounts?.map(acc => ({
        id: String(acc.id),
        label: String(acc.account_name),
        name: String(acc.account_name)
      })) || [];
      setOptions(formatted);
    } else {
      // Cargar productos normales
      getByType(type);
      const formatted = products?.map(p => ({
        id: String(p.id),
        label: String(p.name || p.label),
        name: String(p.name || p.label)
      })) || [];
      setOptions(formatted);
    }
  }, [type, propertyAccounts, products]);
  // Si es activo fijo, mostramos un campo de selección diferente
  if (type === "assetsFixed") {
    return /*#__PURE__*/React.createElement(Dropdown, {
      value: rowData.product,
      options: options,
      optionLabel: "label",
      optionValue: "id",
      placeholder: "Seleccione Activo",
      className: "w-100",
      filter: true,
      onChange: e => {
        e.originalEvent?.preventDefault();
        e.originalEvent?.stopPropagation();
        const selectedProduct = options.find(opt => opt.id === e.value);
        onChange(e.value); // Actualiza el ID del producto
        handleProductChange(rowData.id, "description", selectedProduct?.label || "");
      },
      onClick: e => e.stopPropagation(),
      loading: !options.length,
      emptyMessage: "No hay activos disponibles",
      disabled: disabled
    });
  }
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: rowData.product,
    options: options,
    optionLabel: "label",
    optionValue: "id",
    placeholder: "Seleccione Producto",
    className: "w-100",
    filter: true,
    onChange: e => {
      onChange(e.value);
      const selectedProduct = options.find(p => p.id === e.value);
      if (selectedProduct) {
        handleProductChange(rowData.id, "description", selectedProduct.label);
      }
    },
    virtualScrollerOptions: {
      itemSize: 38
    },
    emptyMessage: "No hay productos disponibles",
    disabled: disabled
  });
};
const QuantityColumnBody = ({
  onChange,
  value,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
    value: value,
    placeholder: "Cantidad",
    className: "w-100",
    style: {
      maxWidth: "100px"
    },
    min: 0,
    onValueChange: e => {
      onChange(e.value);
    },
    disabled: disabled
  }));
};
const PriceColumnBody = ({
  onChange,
  value,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(InputNumber, {
    value: value,
    placeholder: "Precio",
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    style: {
      maxWidth: "130px"
    },
    locale: "es-DO",
    min: 0,
    onValueChange: e => {
      onChange(e.value);
    },
    disabled: disabled
  });
};
const DiscountColumnBody = ({
  onChange,
  value,
  disabled
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputNumber, {
    value: value,
    placeholder: "Descuento",
    className: "w-100",
    style: {
      maxWidth: "120px"
    },
    suffix: "%",
    min: 0,
    max: 100,
    onValueChange: e => {
      onChange(e.value);
    },
    disabled: disabled
  }));
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
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: value // Usamos el porcentaje directamente como valor
    ,
    options: taxes,
    optionLabel: option => `${option.name} - ${Math.floor(option.percentage)}%`,
    optionValue: "percentage" // Usamos el porcentaje como valor
    ,
    placeholder: "Seleccione IVA",
    className: "w-100",
    onChange: e => {
      const selectedTax = taxes.find(tax => tax.percentage === e.value);
      if (selectedTax) {
        onChange(selectedTax); // Pasamos el objeto completo
      }
    },
    appendTo: document.body,
    disabled: disabled
  });
};
const DepositColumnBody = ({
  onChange,
  value,
  disabled
}) => {
  const [deposits, setDeposits] = useState([]);
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
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: value,
    options: deposits,
    optionLabel: option => `${option.attributes.name}`,
    optionValue: "id",
    placeholder: "Seleccione",
    className: "w-100",
    onChange: e => {
      onChange(e.value);
    },
    disabled: disabled,
    appendTo: document.body
  });
};