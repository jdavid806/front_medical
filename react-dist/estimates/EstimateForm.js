import React, { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import { useEffect } from "react";
import { productService, patientService, estimatesService } from "../../services/api/index.js";
import { Calendar } from "primereact/calendar";
export const EstimateForm = () => {
  const [discount, setDiscount] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [observations, setObservations] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [subtotal, setSubtotal] = useState("");
  const [selectedService, setSelectedService] = useState(0);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [products, setProducts] = useState([]);
  //totales
  const [priceTotal, setPriceTotal] = useState("");
  const [quantityTotal, setQuantityTotal] = useState("");
  const [discountTotal, setDiscountTotal] = useState("");
  const [total, setTotal] = useState("");
  const [services, setServices] = useState([]);
  const [servicePatient, setServicePatient] = useState([]);
  const [mappedServices, setMappedServices] = useState([]);
  const [mappedServicePatient, setMappedServicePatient] = useState([]);
  useEffect(() => {
    fetchProductsAndServices();
    fetchPatients();
  }, []);
  const fetchProductsAndServices = async () => {
    const data = await productService.getAllProducts();
    const mappedData = data.data.map(item => {
      return {
        value: item.id,
        label: item.attributes.name
      };
    });
    setServices(data.data);
    setMappedServices(mappedData);
  };
  const fetchPatients = async () => {
    const data = await patientService.getAll();
    const mappedData = data.map(item => {
      return {
        value: item.id,
        label: item.first_name + " " + item.last_name
      };
    });
    setServicePatient(data.data);
    setMappedServicePatient(mappedData);
  };
  function cambiarLabel() {
    const generarPara = document.getElementById("generarPara").value;
    const patientSelectContent = document.getElementById("patientSelectContent");
    const depositSelectContent = document.getElementById("depositSelectContent");
    if (generarPara === "paciente") {
      patientSelectContent.style.display = "block";
      depositSelectContent.style.display = "none";
    } else if (generarPara === "entidad") {
      patientSelectContent.style.display = "none";
      depositSelectContent.style.display = "block";
    }
  }
  function handleInputDiscount(discountEvent) {
    setDiscount(discountEvent.target.value);
    const precio = parseFloat(price);
    const cantidad = parseFloat(quantity);
    const descuentoInput = discountEvent.target.value.trim();
    let descuento = 0;
    if (descuentoInput.endsWith("%")) {
      const porcentaje = parseFloat(descuentoInput.slice(0, -1));
      if (!isNaN(porcentaje)) {
        descuento = precio * cantidad * porcentaje / 100;
      }
    } else {
      descuento = parseFloat(descuentoInput);
      if (isNaN(descuento)) {
        descuento = 0;
      }
    }
    const subtotal = precio * cantidad - descuento;
    setSubtotal(subtotal.toFixed(2));
  }
  function handleAddProduct() {
    const descripcion = description;
    const precio = parseFloat(price);
    const cantidad = parseFloat(quantity);
    const descuentoInput = discount.trim();
    let descuento = 0;
    if (descuentoInput.endsWith("%")) {
      const porcentaje = parseFloat(descuentoInput.slice(0, -1));
      if (!isNaN(porcentaje)) {
        descuento = precio * cantidad * porcentaje / 100;
      }
    } else {
      descuento = parseFloat(descuentoInput);
      if (isNaN(descuento)) {
        descuento = 0;
      }
    }
    const total = precio * cantidad - descuento;
    const newProduct = {
      product_id: selectedService,
      description: descripcion,
      price: precio,
      quantity: cantidad,
      discount: descuento,
      total: total
    };
    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts, newProduct];
      calculateTotals(updatedProducts);
      return updatedProducts;
    });
  }
  function handleDeleteProduct(index) {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1);
    setProducts(updatedProducts);
  }
  function calculateTotals(updatedProducts = products) {
    const priceTotal = updatedProducts.reduce((total, product) => total + product.price, 0);
    const quantityTotal = updatedProducts.reduce((total, product) => total + product.quantity, 0);
    const discountTotal = updatedProducts.reduce((total, product) => total + product.discount, 0);
    const total = updatedProducts.reduce((total, product) => total + product.total, 0);
    setPriceTotal(priceTotal.toFixed(2));
    setQuantityTotal(quantityTotal.toFixed(2));
    setDiscountTotal(discountTotal.toFixed(2));
    setTotal(total.toFixed(2));
  }
  function handleProductChange(event) {
    const product = services.find(service => service.id == event.value);
    if (product) {
      setPrice(product.attributes.purchase_price);
    }
    setSelectedService(event.value);
  }
  function selectedPatientChange(event) {
    setSelectedPatient(event.value);
  }
  function saveEstimate() {
    const formattedDueDate = dueDate ? dueDate.toISOString().split("T")[0] : null;
    const requestData = {
      user_id: selectedPatient,
      deposit_id: 2,
      due_date: formattedDueDate,
      observations: observations,
      estimate: products.map(product => {
        return {
          product_id: product.product_id,
          quantity: product.quantity,
          discount: product.discount
        };
      })
    };
    estimatesService.createEstimates(requestData).then(response => {
      window.location.reload();
    }).catch(error => {
      console.error("Error saving estimate:", error);
    });
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mt-5"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-5"
  }, "Generar presupuesto"), /*#__PURE__*/React.createElement("form", {
    id: "productForm",
    className: "d-flex flex-column gap-3 mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-12",
    id: "patientSelectContent"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "patients",
    className: "form-label"
  }, "Pacientes"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "patients",
    value: selectedPatient,
    onChange: selectedPatientChange,
    options: mappedServicePatient,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    style: {
      zIndex: 100000
    },
    panelStyle: {
      zIndex: 100000
    },
    appendTo: document.body
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group",
    id: "depositSelectContent"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "deposito"
  }, "Dep\xF3sito"), /*#__PURE__*/React.createElement("select", {
    className: "form-control",
    id: "deposito"
  }, /*#__PURE__*/React.createElement("option", null, "General"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "products_and_services_select",
    className: "form-label"
  }, "Productos y servicios"), /*#__PURE__*/React.createElement(Dropdown, {
    inputId: "products_and_services_select",
    value: selectedService,
    onChange: handleProductChange,
    options: mappedServices,
    optionLabel: "label",
    optionValue: "value",
    filter: true,
    className: "w-100",
    style: {
      zIndex: 100000
    },
    panelStyle: {
      zIndex: 100000
    },
    appendTo: "self"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-5"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "fechaVencimiento"
  }, "Fecha de vencimiento:"), /*#__PURE__*/React.createElement(Calendar, {
    value: dueDate,
    onChange: e => setDueDate(e.value),
    appendTo: "self",
    className: "w-100"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-end gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "precio"
  }, "Precio"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: "precio",
    value: price,
    onChange: price => setPrice(price.target.value),
    readOnly: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "cantidad"
  }, "Cantidad"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    className: "form-control",
    id: "cantidad",
    value: quantity,
    onChange: quantity => setQuantity(quantity.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "descuento"
  }, "Descuento"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    id: "descuento",
    value: discount,
    onChange: handleInputDiscount
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group col-md-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "subtotal"
  }, "Subtotal"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "form-control",
    id: "subtotal",
    value: subtotal,
    readOnly: true
  }))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "d-flex btn btn-primary",
    onClick: handleAddProduct
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group w-100 text-center"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-info"
  }, "[si desea el descuento en % deber\xE1 colocar al final del numero el s\xEDmbolo %, si es valor num\xE9rico solo colocar n\xFAmeros]"))), /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("table", {
    id: "productTable",
    className: "table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Descripci\xF3n del producto"), /*#__PURE__*/React.createElement("th", null, "Precio"), /*#__PURE__*/React.createElement("th", null, "Cantidad"), /*#__PURE__*/React.createElement("th", null, "Descuento"), /*#__PURE__*/React.createElement("th", null, "Total"))), /*#__PURE__*/React.createElement("tbody", null, products.map((product, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", null, product.description), /*#__PURE__*/React.createElement("td", null, product.price), /*#__PURE__*/React.createElement("td", null, product.quantity), /*#__PURE__*/React.createElement("td", null, product.discount), /*#__PURE__*/React.createElement("td", null, product.total), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-danger",
    onClick: () => handleDeleteProduct(index)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-trash"
  })))))), /*#__PURE__*/React.createElement("tfoot", {
    className: "fw-bold"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    colSpan: 1
  }, /*#__PURE__*/React.createElement("strong", null, "Totales")), /*#__PURE__*/React.createElement("td", null, priceTotal, "COP"), /*#__PURE__*/React.createElement("td", null, quantityTotal, "COP"), /*#__PURE__*/React.createElement("td", null, discountTotal), /*#__PURE__*/React.createElement("td", null, total, "$ COP"), /*#__PURE__*/React.createElement("td", null)))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "observaciones"
  }, "Observaciones o notas:"), /*#__PURE__*/React.createElement("textarea", {
    id: "observaciones",
    className: "form-control",
    value: observations,
    onInput: e => setObservations(e.target.value),
    rows: 7
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: saveEstimate,
    className: "btn btn-outline-info",
    type: "button"
  }, "Guardar")))))));
};