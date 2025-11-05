import React from "react";
import { Card } from "primereact/card";
import { formatPrice } from "../../services/utilidades.js";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
export const CashRegisterProductCard = props => {
  const {
    product,
    addToCart,
    inCart
  } = props;
  const getStockSeverity = stock => {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warning';
    return 'success';
  };
  const getStockText = stock => {
    if (stock === 0) return 'Sin stock';
    if (stock < 10) return `Stock bajo: ${stock}`;
    return `En stock: ${stock}`;
  };
  const header = /*#__PURE__*/React.createElement("div", {
    className: "position-relative"
  }, !product.pharmacy_available_stock && /*#__PURE__*/React.createElement("div", {
    className: "badge bg-danger position-absolute top-0 start-0 m-3"
  }, "AGOTADO"), product.pharmacy_available_stock && /*#__PURE__*/React.createElement("div", {
    className: "badge bg-success position-absolute top-0 start-0 m-3"
  }, "DISPONIBLE"));
  const footer = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center w-100 gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: `badge bg-${getStockSeverity(product.pharmacy_product_stock)}`
  }, getStockText(product.pharmacy_product_stock)), /*#__PURE__*/React.createElement(Tooltip, {
    target: ".add-to-cart-btn"
  }), /*#__PURE__*/React.createElement("div", {
    className: "add-to-cart-btn",
    "data-pr-tooltip": inCart ? 'Ya se encuentra en el carrito' : 'Agregar al carrito'
  }, /*#__PURE__*/React.createElement(Button, {
    className: `${inCart ? 'p-button-success' : 'p-button-primary'}`,
    size: "small",
    disabled: !product.pharmacy_available_stock || inCart,
    onClick: () => addToCart(product),
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cart-plus"
    })
  })));
  return /*#__PURE__*/React.createElement(Card, {
    key: product.id,
    header: header,
    footer: footer,
    className: "h-100 shadow-sm product-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body d-flex flex-column h-100 mt-3"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "card-title fw-bold text-primary mb-2 line-clamp-2"
  }, product.name), product.description && /*#__PURE__*/React.createElement("p", {
    className: "card-text small text-muted mb-2 line-clamp-2"
  }, product.description), /*#__PURE__*/React.createElement("div", {
    className: "mt-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row small text-muted g-1 mb-2"
  }, product.presentation && /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-box me-1"
  }), /*#__PURE__*/React.createElement("strong", null, "Presentaci\xF3n:"), " ", product.presentation)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center border-top pt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold fs-6"
  }, formatPrice(product.price)), product.pharmacy_available_stock && product.pharmacy_product_stock > 0 && /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check-circle text-success"
  })))));
};