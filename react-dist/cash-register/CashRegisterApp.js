import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Dialog } from 'primereact/dialog';
import { useProductsByType } from "../products/hooks/useProductsByType.js";
import { CashRegisterProductCard } from "./CashRegisterProductCard.js";
import { CartProductCard } from "./CartProductCard.js";
import { formatPrice } from "../../services/utilidades.js";
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { CashRegisterPaymentForm } from "./CashRegisterPaymentForm.js";
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { usePRToast } from "../hooks/usePRToast.js";
import { Toast } from 'primereact/toast';
import { useLoggedUser } from "../users/hooks/useLoggedUser.js";
import { useBillingByType } from "../billing/hooks/useBillingByType.js";
import { usePOSBoxDeposit } from "../deposits/hooks/usePOSBoxDeposit.js";
import { useStoreInvoiceSale } from "../invoices/hooks/useStoreInvoiceSale.js";
import { InvoiceOptions } from "../invoices/InvoiceOptions.js";
export const CashRegisterApp = () => {
  const {
    showSuccessToast,
    showErrorToast,
    toast
  } = usePRToast();
  const {
    fetchProductsByType,
    productsByType: medications,
    loading
  } = useProductsByType();
  const {
    loggedUser
  } = useLoggedUser();
  const {
    billing,
    fetchBillingByType
  } = useBillingByType();
  const {
    posBoxDeposit
  } = usePOSBoxDeposit();
  const {
    storeInvoiceSale,
    toastRef: storeInvoiceToastRef
  } = useStoreInvoiceSale();
  const {
    control,
    reset
  } = useForm({
    defaultValues: {
      products: []
    }
  });
  const {
    append: addProduct,
    remove: removeProduct,
    update: updateProduct
  } = useFieldArray({
    control,
    name: 'products'
  });
  const products = useWatch({
    control,
    name: 'products'
  });
  const cashRegisterPaymentFormRef = React.useRef(null);
  const invoiceOptionsRef = React.useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mappedMedications, setMappedMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [showInvoiceOptionsModal, setShowInvoiceOptionsModal] = useState(false);
  const [createdInvoiceId, setCreatedInvoiceId] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const fetchCartProducts = () => {
    fetchProductsByType("Medicamentos");
  };
  useEffect(() => {
    const total = products.reduce((acc, product) => acc + product.price * product.quantity, 0);
    setSubtotal(total);
  }, [products]);
  useEffect(() => {
    const total = subtotal;
    setTotal(total);
  }, [subtotal]);
  useEffect(() => {
    fetchCartProducts();
    fetchBillingByType("consumer");
  }, []);
  useEffect(() => {
    const mappedData = medications.map(product => {
      const name = `${product.name} ${product.concentration ? `- (${product.concentration})` : ''}`.trim();
      return {
        id: product.id,
        name,
        description: product.description,
        concentration: product.concentration,
        presentation: product.presentation,
        price: parseFloat(product.sale_price) || 0.00,
        pharmacy_available_stock: product.pos_box_available_stock,
        pharmacy_product_stock: product.pos_box_product_stock,
        quantity: 1
      };
    });
    setMappedMedications(mappedData);
  }, [medications]);
  useEffect(() => {
    const filteredData = mappedMedications.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredMedications(filteredData);
  }, [searchTerm, mappedMedications]);
  const addToCart = product => {
    addProduct(product);
  };
  const removeFromCart = index => {
    removeProduct(index);
  };
  const inCart = product => {
    return products.some(p => p.id === product.id);
  };
  const handleQuantityChange = (product, quantity) => {
    updateProduct(products.indexOf(product), {
      ...product,
      quantity
    });
  };
  const clearCart = () => {
    reset();
  };
  const handlePay = () => {
    setShowPaymentModal(true);
  };
  const processPayment = async () => {
    if (!cashRegisterPaymentFormRef.current) {
      showErrorToast({
        title: "Error",
        message: "Error al procesar el pago."
      });
      return;
    }
    const {
      isValid,
      getValues
    } = await cashRegisterPaymentFormRef.current.submit();
    const {
      payments,
      client
    } = getValues;
    if (!isValid) {
      showErrorToast({
        title: "Error",
        message: "Por favor, complete todos los campos correctamente."
      });
      return;
    }
    if (products.length === 0) {
      showErrorToast({
        title: "Error",
        message: "El carrito está vacío."
      });
      return;
    }
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // 30 días para vencimiento

    const payload = {
      invoice: {
        user_id: loggedUser?.id,
        due_date: dueDate.toISOString().split('T')[0],
        observations: "Venta desde punto de venta",
        third_party_id: client?.id,
        billing: billing?.data
      },
      invoice_detail: products.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        type_product: "medications",
        unit_price: item.price,
        deposit_id: posBoxDeposit?.id
      })),
      payments: payments.map(payment => ({
        payment_method_id: parseInt(payment.method.id),
        payment_date: today.toISOString().split('T')[0],
        amount: payment.amount
      }))
    };
    console.log(payload);
    try {
      const data = await storeInvoiceSale(payload);
      showSuccessToast({
        title: 'Factura Creada',
        message: `Factura creada con éxito. Código de factura: ${data.invoice.invoice_code}`
      });
      fetchCartProducts();
      clearCart();
      setShowPaymentModal(false);
      setCreatedInvoiceId(data.invoice.id);
      setShowInvoiceOptionsModal(true);
    } catch (error) {
      console.error('Error al procesar el pago:', error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: storeInvoiceToastRef
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "mb-0"
  }, "Punto de venta"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(IconField, {
    iconPosition: "left"
  }, /*#__PURE__*/React.createElement(InputIcon, {
    className: "fas fa-search"
  }, " "), /*#__PURE__*/React.createElement(InputText, {
    placeholder: "Buscar productos...",
    value: searchTerm,
    onChange: e => setSearchTerm(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "badge bg-primary ms-2"
  }, filteredMedications.length))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3",
    id: "productsContainer"
  }, filteredMedications.map(product => /*#__PURE__*/React.createElement("div", {
    className: "col",
    key: product.id
  }, /*#__PURE__*/React.createElement(CashRegisterProductCard, {
    product: product,
    addToCart: addToCart,
    inCart: inCart(product)
  })))), loading && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5"
  }, /*#__PURE__*/React.createElement(ProgressSpinner, null)), !loading && filteredMedications.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-inbox fs-1 text-muted"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mt-2"
  }, "No se encontraron productos"))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex",
    style: {
      width: '400px',
      minWidth: '400px'
    }
  }, /*#__PURE__*/React.createElement(Card, {
    className: "w-100",
    header: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center gap-2 pt-3 px-3"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-shopping-cart"
    }), /*#__PURE__*/React.createElement("h5", {
      className: "mb-0"
    }, "Carrito de Compra")), /*#__PURE__*/React.createElement(Divider, null)),
    pt: {
      body: {
        style: {
          padding: '1rem',
          paddingTop: '0'
        }
      },
      content: {
        style: {
          paddingBottom: '1rem',
          paddingTop: '0'
        }
      }
    }
  }, products.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "text-center text-muted"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-shopping-cart fs-1"
  }), /*#__PURE__*/React.createElement("p", {
    className: "mt-2 text-muted"
  }, "El carrito est\xE1 vac\xEDo")), products.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, products.map(product => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mb-2 card shadow-sm p-2",
    key: product.id
  }, /*#__PURE__*/React.createElement(CartProductCard, {
    product: product,
    removeFromCart: () => removeFromCart(products.indexOf(product)),
    onQuantityChange: handleQuantityChange
  }))))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fs-8"
  }, "Subtotal:"), /*#__PURE__*/React.createElement("span", {
    className: "fs-8"
  }, formatPrice(subtotal))), /*#__PURE__*/React.createElement(Divider, null), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold fs-8"
  }, "Total:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold fs-8 text-success"
  }, formatPrice(total))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between gap-2 align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button p-button-secondary flex-grow-1",
    onClick: clearCart,
    disabled: products.length === 0,
    label: "Cancelar"
  }), /*#__PURE__*/React.createElement(Button, {
    className: "p-button p-button-primary flex-grow-1",
    onClick: handlePay,
    disabled: products.length === 0 || total === 0,
    label: "Pagar"
  })))))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showInvoiceOptionsModal,
    onHide: () => setShowInvoiceOptionsModal(false),
    header: "Factura",
    style: {
      width: '75vw'
    }
  }, createdInvoiceId && /*#__PURE__*/React.createElement(InvoiceOptions, {
    ref: invoiceOptionsRef,
    invoiceId: createdInvoiceId,
    onAppear: () => invoiceOptionsRef.current?.handleSendWhatsApp()
  }), !createdInvoiceId && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "Se produjo un error al crear la factura"))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showPaymentModal,
    onHide: () => setShowPaymentModal(false),
    header: "Procesar Pago",
    style: {
      width: '75vw'
    }
  }, /*#__PURE__*/React.createElement(CashRegisterPaymentForm, {
    ref: cashRegisterPaymentFormRef,
    products: products
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    onClick: () => setShowPaymentModal(false),
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-2"
    })
  }, "Cancelar"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => processPayment(),
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check me-2"
    })
  }, "Confirmar Pago"))));
};