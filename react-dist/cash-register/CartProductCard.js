import React from "react";
import { formatPrice } from "../../services/utilidades.js";
import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
export const CartProductCard = props => {
  const {
    product,
    removeFromCart,
    onQuantityChange
  } = props;
  const handleQuantityChange = newQuantity => {
    if (newQuantity < 1) return;
    if (product.pharmacy_available_stock && product.pharmacy_product_stock > 0) {
      if (newQuantity > product.pharmacy_product_stock) return;
    }
    onQuantityChange(product, newQuantity);
  };
  const incrementQuantity = () => {
    handleQuantityChange(product.quantity + 1);
  };
  const decrementQuantity = () => {
    handleQuantityChange(product.quantity - 1);
  };
  const calculateTotal = () => {
    return product.price * product.quantity;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card h-100 border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex flex-column p-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title fw-bold text-primary mb-0 line-clamp-2 flex-grow-1 me-2"
  }, product.name), /*#__PURE__*/React.createElement(Tooltip, {
    target: ".add-to-cart-btn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "add-to-cart-btn",
    "data-pr-tooltip": 'Eliminar producto',
    "data-pr-position": "left"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-danger",
    size: "small",
    onClick: () => removeFromCart(product),
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash"
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row small text-muted g-2 mb-3"
  }, product.presentation && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-box me-1"
  }), /*#__PURE__*/React.createElement("strong", null, "Presentaci\xF3n:"), " ", product.presentation)), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    size: "small",
    onClick: decrementQuantity,
    disabled: product.quantity <= 1,
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-minus"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement(InputNumber, {
    className: "mx-2 w-100",
    inputClassName: "w-100",
    placeholder: "Cantidad",
    value: product.quantity,
    onValueChange: e => handleQuantityChange(e.value || 1),
    onChange: e => handleQuantityChange(e.value || 1),
    min: 1,
    max: product.pharmacy_product_stock || undefined
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-secondary",
    size: "small",
    onClick: incrementQuantity,
    disabled: product.pharmacy_available_stock && product.quantity >= product.pharmacy_product_stock,
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus"
    })
  }))), product.pharmacy_available_stock && /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-cubes me-1"
  }), "Stock disponible: ", product.pharmacy_product_stock)), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto border-top pt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small text-muted"
  }, "Precio unitario:"), /*#__PURE__*/React.createElement("span", {
    className: "small text-muted"
  }, formatPrice(product.price))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold text-dark"
  }, "Total:"), /*#__PURE__*/React.createElement("span", {
    className: "fw-bold fs-6"
  }, formatPrice(calculateTotal()))))));
};