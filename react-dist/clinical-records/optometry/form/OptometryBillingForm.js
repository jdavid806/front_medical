import React, { useEffect, useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Dropdown, InputNumber, Toast } from "primereact";
import { productService, paymentMethodService, optometryService, thirdPartyService, billingService } from "../../../../services/api/index.js";
import { getUserLogged } from "../../../../services/utilidades.js";
import { formatDate } from "../../../../services/utilidades.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { useCompany } from "../../../hooks/useCompany.js";
export const OptometryBillingForm = receiptId => {
  const patientId = new URLSearchParams(window.location.search).get("patient_id");
  const [thirdId, setThirdId] = useState(null);
  const [products, setProducts] = useState([]);
  const [paymentMethodsOptions, setPaymentMethodsOptions] = useState([]);
  const toast = useRef(null);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger
  } = useForm({
    defaultValues: {
      invoiceNumber: "",
      date: null,
      patient: null,
      doctor_id: null,
      product: null,
      quantity: 1,
      price: "",
      discount: 0,
      paymentMethods: [{
        id: generateId(),
        method: "",
        authorizationNumber: "",
        value: 0 // Cambiado de null a 0 para inicializar con valor numérico
      }]
    }
  });
  const formValues = watch();
  const formPaymentMethods = watch("paymentMethods");
  const userLogged = getUserLogged();
  const {
    company,
    setCompany,
    fetchCompany
  } = useCompany();
  const [billingInfo, setBillingInfo] = useState(null);
  useEffect(() => {
    loadProducts();
    loadPaymentMethods();
    fetchThirdParty();
  }, []);
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  async function fetchThirdParty() {
    const patientThirdParty = await thirdPartyService.getByExternalIdAndType({
      externalId: patientId,
      externalType: "client"
    });
    const billingData = await billingService.getBillingByType("consumer");
    setBillingInfo(billingData.data);
    setThirdId(patientThirdParty);
  }
  async function loadProducts() {
    try {
      const response = await productService.getAllProducts();
      const filteredProducts = response.data.filter(product => product.attributes.attention_type === "OPTOMETRY");
      setProducts(filteredProducts);
    } catch (error) {
      showError("Error al cargar los productos");
    }
  }
  async function loadPaymentMethods() {
    try {
      const response = await paymentMethodService.getPaymentMethods();
      const filteredMethods = response.filter(method => method.category === "transactional");
      setPaymentMethodsOptions(filteredMethods);
    } catch (error) {
      showError("Error al cargar los metodos de pago");
    }
  }
  const showError = message => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000
    });
  };
  const calculateLineTotal = () => {
    const quantity = Number(formValues.quantity) || 0;
    const price = Number(formValues.price) || 0;
    const discount = Number(formValues.discount) || 0;
    const subtotal = quantity * price;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };
  const subtotal = useMemo(() => {
    return calculateLineTotal();
  }, [formValues.quantity, formValues.price, formValues.discount]);
  const totalPayments = useMemo(() => {
    return formPaymentMethods.reduce((total, payment) => {
      return total + (Number(payment.value) || 0);
    }, 0);
  }, [formPaymentMethods]);
  const paymentCoverage = useMemo(() => {
    return Math.abs(totalPayments - subtotal) < 0.01;
  }, [totalPayments, subtotal]);
  const updatePaymentValue = (index, value) => {
    const currentPayments = [...formPaymentMethods];
    currentPayments[index].value = value || 0;
    setValue("paymentMethods", currentPayments, {
      shouldDirty: true,
      shouldValidate: true
    });
  };
  const addPaymentMethod = () => {
    setValue("paymentMethods", [...formPaymentMethods, {
      id: generateId(),
      method: "",
      authorizationNumber: "",
      value: 0 // Inicializado en 0 en lugar de null
    }]);
    trigger(); // Forzar actualización del formulario
  };
  const removePaymentMethod = id => {
    if (formPaymentMethods.length > 1) {
      setValue("paymentMethods", formPaymentMethods.filter(payment => payment.id !== id));
      trigger(); // Forzar actualización del formulario
    }
  };
  const onSubmit = async data => {
    if (!data.product) {
      showError("Debe seleccionar un producto");
      return;
    }
    if (!paymentCoverage) {
      showError(`Los pagos no cubren el total de la factura. Faltan ${(subtotal - totalPayments).toLocaleString("es-DO", {
        style: "currency",
        currency: "DOP"
      })}`);
      return;
    }
    const dataRequest = {
      invoice: {
        user_id: userLogged.id,
        due_date: formatDate(new Date(), true),
        observations: "Sin observacion - receta de optometria",
        third_party_id: thirdId.id,
        sub_type: "optometry",
        billing: {
          ...billingInfo
        }
      },
      invoice_detail: {
        product_id: data.product.id,
        type_product: "optometry",
        tax_product: 0
      },
      payments: data.paymentMethods.map(payment => ({
        payment_method_id: payment.method,
        payment_date: formatDate(new Date(), true),
        amount: payment.value,
        notes: "Pago sin descripcion - receta de optometria"
      }))
    };
    try {
      const response = await optometryService.createOptometryRecipe(dataRequest, receiptId.receiptId);
      SwalManager.success({
        text: "Factura creada exitosamente"
      });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Error al crear la factura:", error);
    }
  };
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
    className: "pi pi-eye me-2"
  }), "Facturaci\xF3n de optometr\xEDa (DOP)"))))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-shopping-cart me-2 text-primary"
  }), "Producto Optometria")), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Producto Optometria *"), /*#__PURE__*/React.createElement(Controller, {
    name: "product",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      onChange: e => {
        field.onChange(e.value);
        if (e.value && e.value.attributes.sale_price) {
          setValue("price", e.value.attributes.sale_price);
        }
      },
      optionLabel: "attributes.name",
      placeholder: "Seleccione",
      options: products,
      className: "w-100",
      appendTo: "self",
      filter: true,
      showClear: true
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cantidad *"), /*#__PURE__*/React.createElement(Controller, {
    name: "quantity",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: field.onChange,
      className: "w-100",
      min: 1
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Precio (DOP) *"), /*#__PURE__*/React.createElement(Controller, {
    name: "price",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: field.onChange,
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      min: 0
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Descuento %"), /*#__PURE__*/React.createElement(Controller, {
    name: "discount",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: field.onChange,
      className: "w-100",
      suffix: "%",
      min: 0,
      max: 100,
      readOnly: true
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Total (DOP)"), /*#__PURE__*/React.createElement(InputNumber, {
    value: calculateLineTotal(),
    className: "w-100",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "card mb-4 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-credit-card me-2 text-primary"
  }), "M\xE9todos de Pago (DOP)"), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Agregar M\xE9todo",
    className: "btn btn-primary",
    onClick: addPaymentMethod
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, formPaymentMethods.map((payment, index) => /*#__PURE__*/React.createElement("div", {
    key: payment.id,
    className: "row g-3 mb-3 align-items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "M\xE9todo *"), /*#__PURE__*/React.createElement(Controller, {
    name: `paymentMethods.${index}.method`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      value: field.value,
      optionLabel: "method",
      optionValue: "id",
      placeholder: "Seleccione m\xE9todo",
      options: paymentMethodsOptions,
      className: "w-100",
      onChange: e => field.onChange(e.value),
      appendTo: "self"
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Valor (DOP) *"), /*#__PURE__*/React.createElement(Controller, {
    name: `paymentMethods.${index}.value`,
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      className: "w-100",
      mode: "currency",
      currency: "DOP",
      locale: "es-DO",
      onValueChange: e => {
        field.onChange(e.value);
        updatePaymentValue(index, e.value || 0);
      }
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-2"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-rounded p-button-danger",
    onClick: () => removePaymentMethod(payment.id),
    disabled: formPaymentMethods.length <= 1
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 bg-gray-100 rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total factura:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: subtotal,
    className: "ml-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Total pagos:"), /*#__PURE__*/React.createElement(InputNumber, {
    value: totalPayments,
    className: "ml-2",
    mode: "currency",
    currency: "DOP",
    locale: "es-DO",
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", null, !paymentCoverage ? /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-exclamation-triangle me-1"
  }), "Faltan", " ", (subtotal - totalPayments).toLocaleString("es-DO", {
    style: "currency",
    currency: "DOP"
  })) : /*#__PURE__*/React.createElement("span", {
    className: "text-success"
  }, /*#__PURE__*/React.createElement("i", {
    className: "pi pi-check-circle me-1"
  }), "Pagos completos")))))))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3 mb-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Guardar Factura",
    icon: "pi pi-save",
    className: "p-button-primary",
    type: "submit"
  }))))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};