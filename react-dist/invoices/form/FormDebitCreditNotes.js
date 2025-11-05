function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, InputText, Dropdown, Calendar, DataTable, Column, Toast, InputNumber } from "primereact";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties.js";
import { useCentresCosts } from "../../centres-cost/hooks/useCentresCosts.js";
import { productService, invoiceService, paymentMethodService } from "../../../services/api/index.js";
import { useTaxes } from "../hooks/useTaxes.js";
import { useBillingByType } from "../../billing/hooks/useBillingByType.js";
import { PaymentMethodsSection } from "../../components/billing/CustomPaymentMethods.js"; // Definición de tipos
export const FormDebitCreditNotes = ({
  initialData,
  onSuccess
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue
  } = useForm({
    defaultValues: {
      documentType: null,
      documentNumber: "",
      noteType: null,
      client: null,
      elaborationDate: new Date(),
      costCenter: null
    }
  });
  const {
    thirdParties
  } = useThirdParties();
  const {
    centresCosts
  } = useCentresCosts();
  const {
    fetchBillingByType
  } = useBillingByType();
  const [billing, setBilling] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [clientSelected, setClientSelected] = useState(null);
  const [centresCostsSelected, setCentresCostsSelected] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const toast = useRef(null);
  const [billingItems, setBillingItems] = useState([{
    id: generateId(),
    product: "",
    description: "",
    quantity: 0,
    unitPrice: null,
    discount: null,
    tax: 0,
    totalValue: 0
  }]);
  const [paymentMethodsArray, setPaymentMethodsArray] = useState([{
    id: generateId(),
    method: "",
    authorizationNumber: "",
    value: ""
  }]);
  const [availablePaymentMethods, setAvailablePaymentMethods] = useState([]);
  const handlePaymentMethodsChange = paymentMethods => {
    setPaymentMethodsArray(paymentMethods);
  };
  const noteType = watch("noteType");
  useEffect(() => {
    if (invoices.length && initialData) {
      loadPaymentMethods();
      const invoice = invoices.filter(invoice => invoice.id === Number(initialData.id))[0];
      if (invoice) {
        setSelectedInvoice(invoice);
        handleProductsOfInvoice(invoice);
        setIsModalActive(true);
        setValue("noteType", initialData.noteType);
        setValue("elaborationDate", new Date(initialData.fecha));
      }
    }
    if (thirdParties.length && initialData && initialData.third_party) {
      const clientFound = thirdParties.find(client => client.id == initialData.third_party.id);
      setClientSelected(clientFound);
    }
    if (centresCosts.length && initialData && initialData.centre_cost) {
      const centreCostFound = centresCosts.find(centre => centre.id == initialData.centre_cost.id);
      setCentresCostsSelected(centreCostFound);
    }
  }, [initialData, invoices]);
  useEffect(() => {
    loadInvoices();
    loadProducts();
  }, []);
  const loadPaymentMethods = async () => {
    const methods = await paymentMethodService.getAll();
    let methodsFiltered = [];
    if (initialData.noteType.id === "DEBIT") {
      methodsFiltered = methods.filter(method => method.payment_type === "sale");
    } else {
      methodsFiltered = methods.filter(method => method.payment_type === "purchase");
    }
    setAvailablePaymentMethods(methodsFiltered);
  };
  async function loadInvoices() {
    const invoices = await invoiceService.getTogenerateNotes();
    setInvoices(invoices);
  }
  const loadProducts = async () => {
    const response = await productService.getAllProducts();
    setProducts(response.data.map(product => product.attributes));
  };

  // Helper function to generate unique IDs
  function generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Funciones de cálculo en DOP
  const calculateLineTotal = item => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const discount = Number(item.discount) || 0;
    const taxRate = typeof item.tax === "object" ? item.tax.percentage : Number(item.tax) || 0;
    const subtotal = quantity * unitPrice;
    const discountAmount = subtotal * (discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (taxRate / 100);
    const lineTotal = subtotalAfterDiscount + taxAmount;
    return parseFloat(lineTotal.toFixed(2));
  };
  const calculateSubtotal = () => {
    return billingItems.reduce((total, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return total + quantity * unitPrice;
    }, 0);
  };
  const calculateTotalDiscount = () => {
    return billingItems.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discount = Number(item.discount) || 0;
      return total + subtotal * (discount / 100);
    }, 0);
  };
  const calculateTotalTax = () => {
    return billingItems.reduce((total, item) => {
      const subtotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
      const discountAmount = subtotal * ((Number(item.discount) || 0) / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxRate = typeof item.tax === "object" ? item.tax.percentage : Number(item.tax) || 0;
      return total + subtotalAfterDiscount * (taxRate / 100);
    }, 0);
  };
  const calculateSubtotalAfterDiscount = () => {
    return calculateSubtotal() - calculateTotalDiscount();
  };
  const calculateTotal = () => {
    return billingItems.reduce((total, item) => {
      return total + calculateLineTotal(item);
    }, 0);
  };
  const calculateAdjustmentDifference = () => {
    const currentTotal = calculateTotal(); // Total actual con los ajustes

    // Calcular el total original basado en los valores originales de la factura
    const originalTotal = billingItems.reduce((total, item) => {
      const originalQuantity = item.originalQuantity || 0;
      const originalUnitPrice = item.originalUnitPrice || 0;
      const discount = Number(item.discount) || 0;
      const taxRate = typeof item.tax === "object" ? item.tax.percentage : Number(item.tax) || 0;
      const subtotal = originalQuantity * originalUnitPrice;
      const discountAmount = subtotal * (discount / 100);
      const subtotalAfterDiscount = subtotal - discountAmount;
      const taxAmount = subtotalAfterDiscount * (taxRate / 100);
      return total + (subtotalAfterDiscount + taxAmount);
    }, 0);

    // La diferencia es el total actual menos el total original
    const difference = currentTotal - originalTotal;
    return parseFloat(difference.toFixed(2));
  };

  // Funciones para manejar items de facturación
  const addBillingItem = () => {
    setBillingItems([...billingItems, {
      id: generateId(),
      product: "",
      description: "",
      quantity: 0,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      totalValue: 0,
      fromInvoice: false
    }]);
  };
  const removeBillingItem = id => {
    if (billingItems.length > 1) {
      setBillingItems(prevItems => prevItems.filter(item => item.id !== id));
    }
  };
  const handleBillingItemChange = (id, field, value) => {
    setBillingItems(prevItems => prevItems.map(item => item.id === id ? {
      ...item,
      [field]: value
    } : item));
  };
  function validatedCreditDebitNoteProducts(billingItems) {
    let isIrregularNoteType = false;
    let productsWithErrors = [];
    billingItems.forEach(item => {
      switch (noteType?.id) {
        case "DEBIT":
          if (item.quantity < item.originalQuantity || item.unitPrice < item.originalUnitPrice) {
            isIrregularNoteType = true;
            productsWithErrors.push(item.productName);
          }
          break;
        case "CREDIT":
          if (item.quantity > item.originalQuantity || item.unitPrice > item.originalUnitPrice) {
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
        detail: "Hay itens de factura irregulares en la nota" + noteType?.name + ", productos: " + productsWithErrors.join(", "),
        life: 5000
      });
    }
    return isIrregularNoteType;
  }

  // Funciones para guardar
  const save = async formData => {
    const validateForm = validatedCreditDebitNoteProducts(billingItems);
    const billingTypeMap = {
      DEBIT: "debit_note",
      CREDIT: "credit_note"
    };
    const billing = await fetchBillingByType(billingTypeMap[noteType?.id]);
    const noteData = {
      invoice_id: selectedInvoice?.id,
      amount: Math.abs(calculateAdjustmentDifference()),
      reason: "Ajuste por error en la facturación",
      details: billingItems.map(item => {
        const priceAdjustment = item.unitPrice - Number(item.originalUnitPrice);
        return {
          product_id: item.productId || item.product.id,
          quantity: item.quantity,
          price_adjustment: priceAdjustment
        };
      }),
      billing: billing.data,
      payments: paymentMethodsArray.map(payment => {
        return {
          payment_method_id: payment.method,
          payment_date: new Date(),
          amount: payment.value
        };
      })
    };
    if (!validateForm) {
      switch (noteType?.id) {
        case "DEBIT":
          invoiceService.createDebitNote(noteData).then(response => {
            if (response) {
              toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Nota débito guardada",
                life: 2000
              });
            }
            if (isModalActive) {
              onSuccess();
            } else {
              setTimeout(() => {
                //window.location.href = "FE_FCE";
              }, 1000);
            }
          }).catch(error => {});
          break;
        case "CREDIT":
          invoiceService.createCreditNote(noteData).then(response => {
            if (response) {
              toast.current?.show({
                severity: "success",
                summary: "Éxito",
                detail: "Nota crédito guardada",
                life: 2000
              });
            }
            if (isModalActive) {
              onSuccess();
            } else {
              setTimeout(() => {
                //window.location.href = "FE_FCE";
              }, 1000);
            }
          }).catch(error => {});
          break;
      }
    }
  };
  const saveAndSend = formData => {
    save(formData);
  };
  function handleProductsOfInvoice(invoice) {
    setSelectedInvoice(invoice);
    setBillingItems([]);
    if (invoice.third_party) {
      const clientFound = thirdParties.find(client => client.id == invoice.third_party.id);
      setClientSelected(clientFound);
    } else {
      setClientSelected(null);
    }
    if (invoice.centre_cost) {
      const centreCostFound = centresCosts.find(centre => centre.id == invoice.centre_cost.id);
      setCentresCostsSelected(centreCostFound);
    } else {
      setCentresCostsSelected(null);
    }
    setValue("elaborationDate", new Date(invoice.created_at));
    const productsMapped = invoice?.details.map(product => {
      const rateDiscunt = Number(product.discount) / Number(product.amount) * 100 || 0;
      return {
        id: generateId(),
        productId: product.product.id,
        // Guardamos solo el ID
        productName: product.product.name,
        description: "",
        quantity: product.quantity,
        originalQuantity: product.quantity,
        // Guardamos el valor original
        unitPrice: product.unit_price,
        originalUnitPrice: product.unit_price,
        discount: rateDiscunt,
        taxId: product?.tax_charge_id || 0,
        totalValue: 0,
        fromInvoice: true
      };
    });
    setBillingItems(productsMapped);
  }
  const formatCurrency = value => {
    return new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP"
    }).format(value || 0);
  };
  const [tableKey, setTableKey] = useState(0);
  useEffect(() => {
    // Forzar recreación de la tabla cuando noteType cambie
    setTableKey(prevKey => prevKey + 1);
  }, [noteType]);

  // Columnas para la tabla de items de facturación
  const billingItemColumns = React.useMemo(() => [{
    field: "product",
    header: "Producto",
    body: rowData => /*#__PURE__*/React.createElement(ProductDropdown, {
      key: `${rowData.id}-${selectedInvoice?.id}`,
      rowData: rowData,
      handleBillingItemChange: handleBillingItemChange
    })
  }, {
    field: "quantity",
    header: "Cantidad",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.quantity,
      placeholder: "Cantidad",
      className: "w-100",
      min: noteType?.id === "DEBIT" ? rowData.originalQuantity : undefined,
      max: noteType?.id === "CREDIT" ? rowData.originalQuantity : undefined,
      disabled: !noteType,
      onValueChange: e => {
        if (!noteType) return;
        const newValue = e.value || 0;
        const originalValue = rowData.originalQuantity || 0;
        if (noteType.id === "DEBIT") {
          // Débito: solo permite aumentar
          if (newValue >= originalValue) {
            handleBillingItemChange(rowData.id, "quantity", newValue);
          } else {
            // Si intenta disminuir, mantenemos el valor original
            handleBillingItemChange(rowData.id, "quantity", originalValue);
          }
        } else {
          // Crédito: solo permite disminuir
          if (newValue <= originalValue && newValue >= 0) {
            handleBillingItemChange(rowData.id, "quantity", newValue);
          } else {
            // Si intenta aumentar, mantenemos el valor original
            handleBillingItemChange(rowData.id, "quantity", originalValue);
          }
        }
      },
      tooltip: noteType ? noteType.id === "DEBIT" ? `Mínimo: ${rowData.originalQuantity} (valor original)` : `Máximo: ${rowData.originalQuantity} (valor original)` : "Seleccione tipo de nota"
    })
  }, {
    field: "unitPrice",
    header: "Valor unitario",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.unitPrice,
      placeholder: "Precio",
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: noteType?.id === "DEBIT" ? rowData.originalUnitPrice : undefined,
      max: noteType?.id === "CREDIT" ? rowData.originalUnitPrice : undefined,
      disabled: !noteType,
      onValueChange: e => {
        if (!noteType) return;
        const newValue = e.value || 0;
        const originalValue = rowData.originalUnitPrice || 0;
        if (noteType.id === "DEBIT") {
          // Débito: solo permite aumentar
          if (newValue >= originalValue) {
            handleBillingItemChange(rowData.id, "unitPrice", newValue);
          } else {
            handleBillingItemChange(rowData.id, "unitPrice", originalValue);
          }
        } else {
          // Crédito: solo permite disminuir
          if (newValue <= originalValue && newValue >= 0) {
            handleBillingItemChange(rowData.id, "unitPrice", newValue);
          } else {
            handleBillingItemChange(rowData.id, "unitPrice", originalValue);
          }
        }
      },
      tooltip: noteType ? noteType.id === "DEBIT" ? `Mínimo: ${formatCurrency(rowData.originalUnitPrice || 0)} (valor original)` : `Máximo: ${formatCurrency(rowData.originalUnitPrice || 0)} (valor original)` : "Seleccione tipo de nota"
    })
  }, {
    field: "discount",
    header: "% Dscto",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: rowData.discount,
      readOnly: true,
      placeholder: "Descuento",
      className: "w-100",
      suffix: "%",
      min: 0,
      max: 100,
      onValueChange: e => handleBillingItemChange(rowData.id, "discount", e.value || 0)
    })
  }, {
    field: "tax",
    header: "Impuesto",
    body: rowData => /*#__PURE__*/React.createElement(IvaColumnBody, {
      key: `${rowData.id}-${selectedInvoice?.id}`,
      rowData: rowData,
      handleBillingItemChange: handleBillingItemChange
    })
  }, {
    field: "totalValue",
    header: "Valor total",
    body: rowData => /*#__PURE__*/React.createElement(InputNumber, {
      value: calculateLineTotal(rowData),
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      readOnly: true
    })
  }, {
    field: "description",
    header: "Descripción",
    body: rowData => /*#__PURE__*/React.createElement(InputText, {
      value: rowData.description,
      placeholder: "Ingresar Descripci\xF3n",
      className: "w-100",
      onChange: e => handleBillingItemChange(rowData.id, "description", e.target.value)
    })
  }, {
    field: "actions",
    header: "Acciones",
    body: rowData => rowData.fromInvoice ? null : /*#__PURE__*/React.createElement(Button, {
      className: "p-button-rounded p-button-danger p-button-text",
      onClick: () => removeBillingItem(rowData.id),
      disabled: billingItems.length <= 1,
      tooltip: "Eliminar item"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }))
  }], [noteType, selectedInvoice, handleBillingItemChange, billingItems, removeBillingItem, calculateLineTotal]);
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
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
    className: "pi pi-file-edit me-2"
  }), "Crear Nota de D\xE9bito/Cr\xE9dito"))))), /*#__PURE__*/React.createElement("div", {
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
  }, "Factura *"), /*#__PURE__*/React.createElement(Controller, {
    name: "documentType",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: invoices,
      optionLabel: "invoice_code",
      placeholder: "Seleccione",
      className: "w-100",
      filter: true,
      virtualScrollerOptions: {
        itemSize: 38
      },
      value: selectedInvoice // Esto muestra visualmente la selección
      ,
      onChange: e => {
        field.onChange(e.value); // Si estás usando Formik o similar
        handleProductsOfInvoice(e.value);
      },
      disabled: isModalActive,
      appendTo: "self"
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de nota *"), /*#__PURE__*/React.createElement(Controller, {
    name: "documentNumber",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "N\xFAmero generado autom\xE1ticamente",
      className: "w-100",
      readOnly: true
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo *"), /*#__PURE__*/React.createElement(Controller, {
    name: "noteType",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: [{
        id: "DEBIT",
        name: "Débito"
      }, {
        id: "CREDIT",
        name: "Crédito"
      }],
      optionLabel: "name",
      placeholder: "Seleccione tipo",
      className: "w-100",
      appendTo: "self",
      disabled: isModalActive
    }))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cliente *"), /*#__PURE__*/React.createElement(Controller, {
    name: "client",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      options: thirdParties,
      value: clientSelected,
      optionLabel: "name",
      placeholder: "Seleccione cliente",
      className: "w-100",
      filter: true,
      virtualScrollerOptions: {
        itemSize: 38
      },
      appendTo: "self",
      disabled: true
    }))
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
    }) => /*#__PURE__*/React.createElement(Calendar, _extends({}, field, {
      placeholder: "Seleccione fecha",
      className: "w-100",
      showIcon: true,
      dateFormat: "dd/mm/yy",
      disabled: true
    }))
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
      options: centresCosts,
      value: centresCostsSelected,
      optionLabel: "name",
      placeholder: "Seleccione centro",
      className: "w-100",
      filter: true,
      virtualScrollerOptions: {
        itemSize: 38
      },
      appendTo: "self",
      disabled: true
    }))
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Informaci\xF3n de Facturaci\xF3n"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    icon: "pi pi-plus",
    label: `${!noteType ? "Seleccione tipo" : "Añadir "}`,
    className: `btn ${!noteType ? "btn-secondary" : "btn-primary"}`,
    onClick: addBillingItem,
    disabled: !noteType || noteType?.id === "CREDIT"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "table-responsive"
  }, /*#__PURE__*/React.createElement(DataTable, {
    key: tableKey,
    value: billingItems,
    responsiveLayout: "scroll",
    emptyMessage: "No hay items agregados",
    className: "p-datatable-sm",
    showGridlines: true,
    stripedRows: true
  }, billingItemColumns.map((col, i) => /*#__PURE__*/React.createElement(Column, {
    key: i,
    field: col.field,
    header: col.header,
    body: col.body,
    style: {
      minWidth: "150px"
    }
  })))))), /*#__PURE__*/React.createElement("div", {
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
    className: "d-flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-fixed"
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
    className: "col-fixed"
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
    className: "col-fixed"
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
    className: "col-fixed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Impuestos"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateTotalTax(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-fixed"
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
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-fixed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, noteType?.id === "DEBIT" ? "Ajuste a Favor" : "Ajuste en Contra"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateAdjustmentDifference(),
    className: "w-100 font-weight-bold",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })))))), /*#__PURE__*/React.createElement(PaymentMethodsSection, {
    totalInvoice: calculateAdjustmentDifference(),
    paymentMethods: paymentMethodsArray,
    availablePaymentMethods: availablePaymentMethods,
    onPaymentMethodsChange: handlePaymentMethodsChange,
    labelTotal: "Total ajuste",
    isNote: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    className: "btn-info",
    type: "submit"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar y Enviar",
    icon: "pi pi-send",
    className: "btn-info",
    onClick: handleSubmit(saveAndSend)
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};
const ProductDropdown = ({
  rowData,
  handleBillingItemChange
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      try {
        const response = await productService.getAllProducts();
        const dataFilter = response.data.map(product => {
          return {
            ...product.attributes,
            id: product.id
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
      const foundProduct = products.find(p => p.id === rowData.productId);
      if (foundProduct) {
        setSelectedProduct(foundProduct);
        handleBillingItemChange(rowData.id, "product", foundProduct);
      }
    }
  }, [rowData.productId, products]);
  const handleProductChange = e => {
    handleBillingItemChange(rowData.id, "product", e.value);
    if (e.value?.sale_price) {
      handleBillingItemChange(rowData.id, "unitPrice", e.value.sale_price);
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-spinner pi-spin mr-2"
    }), "Cargando...");
  }
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedProduct,
    options: products,
    optionLabel: "name",
    placeholder: products.length ? "Seleccione Producto" : "No hay productos",
    className: "w-100",
    disabled: rowData.fromInvoice,
    onChange: handleProductChange,
    filter: true,
    virtualScrollerOptions: {
      itemSize: 38
    },
    appendTo: "self"
  });
};
const IvaColumnBody = ({
  rowData,
  handleBillingItemChange
}) => {
  const {
    taxes,
    loading: loadingTaxes
  } = useTaxes();
  const [currentTax, setCurrentTax] = useState(null);
  useEffect(() => {
    if (!loadingTaxes && taxes.length > 0 && rowData.taxId) {
      const foundTax = taxes.find(t => t.id === rowData.taxId);
      if (foundTax) {
        setCurrentTax(foundTax);
        handleBillingItemChange(rowData.id, "tax", foundTax);
      }
    }
  }, [loadingTaxes, taxes, rowData.taxId]);
  if (loadingTaxes) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "pi pi-spinner pi-spin mr-2"
    }), "Cargando...");
  }
  return /*#__PURE__*/React.createElement(Dropdown, {
    value: currentTax,
    options: taxes,
    optionLabel: option => `${option.name} - ${Math.floor(option.percentage)}%` // Usando percentage
    ,
    placeholder: "Seleccione IVA",
    className: "w-100",
    disabled: rowData.fromInvoice,
    onChange: e => {
      setCurrentTax(e.value);
      handleBillingItemChange(rowData.id, "tax", e.value);
      handleBillingItemChange(rowData.id, "taxId", e.value.id);
    },
    filter: true,
    virtualScrollerOptions: {
      itemSize: 38
    },
    appendTo: "self"
  });
};